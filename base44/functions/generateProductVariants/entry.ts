import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Admin access required' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const limit = body.limit || 10;
    const skip = body.skip || 0;

    const allProducts = await base44.asServiceRole.entities.Product.list('-created_date', 1000);

    // Products that need dosage variants: single variant, no multiple options, not a simple tool
    const toolKeywords = /comb|brush|toothbrush|fingerbrush|applicator/i;
    const needsDosing = (p) => {
      const variants = p.variants || [];
      const o1 = [...new Set(variants.map(v => v.option1).filter(Boolean))];
      const o2 = [...new Set(variants.map(v => v.option2).filter(Boolean))];
      if (o1.length > 1 || o2.length > 1) return false;
      if (toolKeywords.test(p.name)) return false;
      return true;
    };

    const toProcess = allProducts.filter(needsDosing).slice(skip, skip + limit);

    let updated = 0;
    let skipped = 0;
    const errors = [];
    const updates = [];

    for (const product of toProcess) {
      try {
        const prompt = `You are a veterinary pharmacy expert. Generate accurate product variant/dosage options for this pet medication/supplement.

Product: ${product.name}
Brand: ${product.brand || 'Unknown'}
Category: ${product.category}
Pet Type: ${product.pet_type}
Active Ingredient: ${product.active_ingredient || 'Unknown'}
Current Price: $${product.price}
Current Single Variant: ${JSON.stringify(product.variants?.[0] || {})}

Research this product and generate the REAL variant options that exist for it (weight bands, strengths, sizes, counts, or supply durations). 

Rules:
- Use the actual variants/sizes/strengths that exist for this product in the real world.
- If weight-based dosing applies (flea/tick, heartworm, dewormers), use weight bands like "Up to 10 lbs", "11-20 lbs", "21-55 lbs", "56+ lbs".
- If strength-based, use actual strengths like "5mg", "10mg", "20mg".
- If size/count-based, use actual sizes like "30ct", "60ct", "120ct" or "Small", "Medium", "Large".
- If supply duration applies, use "1 Month", "3 Month", "6 Month".
- Generate realistic prices scaled from the current price ($${product.price}). Larger sizes/strengths cost more.
- option1_name should describe the primary option (e.g., "Weight", "Strength", "Size", "Count").
- option2_name if applicable (e.g., "Supply", "Count", "Flavor").
- Generate 3-6 variants.
- Each variant needs: option1 (string), option2 (string or empty), price (number), label (string combining options).

Return JSON matching this schema:
{
  "option1_name": "string",
  "option2_name": "string or null",
  "variants": [
    {"option1": "string", "option2": "string", "price": number, "label": "string"}
  ]
}`;

        const jsonSchema = {
          type: "object",
          properties: {
            option1_name: { type: "string" },
            option2_name: { type: "string" },
            variants: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  option1: { type: "string" },
                  option2: { type: "string" },
                  price: { type: "number" },
                  label: { type: "string" }
                }
              }
            }
          }
        };

        // Try with web search first; fall back to model knowledge alone if the LLM errors
        let llmResponse;
        try {
          llmResponse = await base44.integrations.Core.InvokeLLM({
            prompt,
            add_context_from_internet: true,
            response_json_schema: jsonSchema
          });
        } catch (llmErr) {
          llmResponse = await base44.integrations.Core.InvokeLLM({
            prompt,
            response_json_schema: jsonSchema
          });
        }

        if (!llmResponse || !llmResponse.variants || llmResponse.variants.length === 0) {
          errors.push({ product: product.name, error: 'LLM returned no variants' });
          skipped++;
          continue;
        }

        const variants = llmResponse.variants.map(v => ({
          option1: v.option1 || '',
          option2: v.option2 || '',
          price: parseFloat(v.price) || product.price,
          label: v.label || [v.option1, v.option2].filter(Boolean).join(', ')
        }));

        const prices = variants.map(v => v.price).filter(p => p > 0);
        const minPrice = prices.length > 0 ? Math.min(...prices) : product.price;
        const maxPrice = prices.length > 0 ? Math.max(...prices) : product.price;
        const priceRange = minPrice !== maxPrice
          ? `$${minPrice.toFixed(2)} – $${maxPrice.toFixed(2)}`
          : `$${minPrice.toFixed(2)}`;

        updates.push({
          id: product.id,
          variants,
          option1_name: llmResponse.option1_name || 'Size',
          option2_name: llmResponse.option2_name || null,
          price: minPrice,
          price_range: priceRange
        });
        updated++;
      } catch (e) {
        errors.push({ product: product.name, error: e.message });
        skipped++;
      }
    }

    if (updates.length > 0) {
      await base44.asServiceRole.entities.Product.bulkUpdate(updates);
    }

    const totalNeedsDosing = allProducts.filter(needsDosing).length;

    return Response.json({
      status: 'success',
      totalProducts: allProducts.length,
      totalNeedsDosing,
      skip,
      processed: toProcess.length,
      updated,
      skipped,
      remaining: Math.max(0, totalNeedsDosing - skip - toProcess.length),
      errors: errors.slice(0, 10),
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});