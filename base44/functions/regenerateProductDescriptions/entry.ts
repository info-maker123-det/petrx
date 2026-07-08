import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Admin access required' }, { status: 403 });

    // Optional ?limit=N to process only the first N products (useful for testing)
    const url = new URL(req.url);
    const limitParam = parseInt(url.searchParams.get('limit') || '0', 10);
    const batchSize = 15;

    // Fetch all products
    let allProducts = await base44.asServiceRole.entities.Product.list('-created_date', 1000);
    if (limitParam > 0) allProducts = allProducts.slice(0, limitParam);

    let updated = 0;
    let skipped = 0;
    const errors = [];

    for (let i = 0; i < allProducts.length; i += batchSize) {
      const batch = allProducts.slice(i, i + batchSize);

      // Build a compact context list for the LLM
      const contextList = batch.map((p, idx) => ({
        index: idx,
        id: p.id,
        name: p.name,
        brand: p.brand,
        category: p.category,
        pet_type: p.pet_type,
        requires_prescription: p.requires_prescription,
        raw_description: (p.description || '').slice(0, 600),
      }));

      const prompt = `You are a professional copywriter for PetRx, a boutique digital pet pharmacy. 
Rewrite the product descriptions below into clean, well-written, professional pharmacy copy.

Rules:
- Each description should be 2-3 sentences (max ~400 characters).
- Write in a warm, clinical, trustworthy tone — precise yet compassionate.
- Describe what the product is, what it treats, and key benefit. Do NOT make up dosages, side effects, or medical claims beyond what's in the raw description.
- If the raw description is broken, empty, or useless, write a fresh description based on the product name, brand, and category.
- Do not include pricing, "buy now", or marketing fluff.
- Return ONLY the rewritten descriptions matching the input indices.

Products to rewrite:
${JSON.stringify(contextList, null, 2)}`;

      const llmRes = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            products: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  description: { type: 'string' },
                },
                required: ['id', 'description'],
              },
            },
          },
          required: ['products'],
        },
      });

      const rewritten = llmRes?.products || [];

      // Update each product with its clean description (dedupe by id)
      const updates = [];
      const seen = new Set();
      for (const item of rewritten) {
        const desc = (item.description || '').trim();
        if (!desc || desc.length < 10 || seen.has(item.id)) {
          skipped++;
          continue;
        }
        seen.add(item.id);
        updates.push({ id: item.id, description: desc.slice(0, 800) });
      }

      if (updates.length > 0) {
        const result = await base44.asServiceRole.entities.Product.bulkUpdate(updates);
        updated += updates.length;
      }
      skipped += batch.length - rewritten.length;
    }

    return Response.json({
      status: 'success',
      total: allProducts.length,
      updated,
      skipped,
      errors,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});