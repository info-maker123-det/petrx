import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Admin access required' }, { status: 403 });

    const batchSize = 20;
    let allProducts = await base44.asServiceRole.entities.Product.list('-created_date', 1000);

    let updated = 0;
    let skipped = 0;

    for (let i = 0; i < allProducts.length; i += batchSize) {
      const batch = allProducts.slice(i, i + batchSize);

      const contextList = batch.map((p, idx) => ({
        index: idx,
        id: p.id,
        name: p.name,
        brand: p.brand,
        category: p.category,
        pet_type: p.pet_type,
        requires_prescription: p.requires_prescription,
        description: (p.description || '').slice(0, 400),
      }));

      const prompt = `You are a veterinary pharmacy expert. For each product below, fill in these fields based on the product name, brand, category, and description. Use your veterinary knowledge.

Fields:
- active_ingredient: The main active pharmaceutical ingredient (e.g. "Carprofen", "Praziquantel", "Chlorhexidine"). For supplement/multi-ingredient products, list the key active (e.g. "Glucosamine HCL"). Keep it concise — just the ingredient name(s), 1-3 words typically.
- dosage_type: The form factor (e.g. "Chewable Tablet", "Oral Suspension", "Topical Solution", "Spot-On Treatment", "Dental Chew", "Eye Ointment"). 
- weight_class: The weight range this product is suited for, if applicable (e.g. "Dogs 25-60 lbs", "All weights", "Cats 2-10 lbs"). If not weight-dependent, use "All weights".
- usage: A concise phrase describing what the product treats or is used for (e.g. "Pain and inflammation associated with osteoarthritis", "Flea and tick prevention", "Dental plaque and tartar control"). 5-15 words.

Rules:
- Be accurate. If you're not certain of the active ingredient from the name, infer from the description or use "Not specified".
- Keep each field concise.
- Return ONLY the results matching the input indices.

Products:
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
                  active_ingredient: { type: 'string' },
                  dosage_type: { type: 'string' },
                  weight_class: { type: 'string' },
                  usage: { type: 'string' },
                },
                required: ['id', 'active_ingredient', 'dosage_type', 'weight_class', 'usage'],
              },
            },
          },
          required: ['products'],
        },
      });

      const results = llmRes?.products || [];

      const updates = [];
      const seen = new Set();
      for (const item of results) {
        if (seen.has(item.id) || !item.id) {
          skipped++;
          continue;
        }
        seen.add(item.id);
        updates.push({
          id: item.id,
          active_ingredient: (item.active_ingredient || 'Not specified').slice(0, 200),
          dosage_type: (item.dosage_type || 'Not specified').slice(0, 200),
          weight_class: (item.weight_class || 'All weights').slice(0, 200),
          usage: (item.usage || '').slice(0, 300),
        });
      }

      if (updates.length > 0) {
        await base44.asServiceRole.entities.Product.bulkUpdate(updates);
        updated += updates.length;
      }
      skipped += batch.length - results.length;
    }

    return Response.json({
      status: 'success',
      total: allProducts.length,
      updated,
      skipped,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});