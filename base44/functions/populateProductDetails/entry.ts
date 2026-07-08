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

      const prompt = `You are a veterinary pharmacy expert. For each product below, fill in these fields based on the product name, brand, category, and description. Use your veterinary knowledge — be accurate and specific to the actual active ingredient of each product.

Fields:
- active_ingredient: The main active pharmaceutical ingredient (e.g. "Carprofen", "Praziquantel", "Chlorhexidine"). For supplement/multi-ingredient products, list the key active (e.g. "Glucosamine HCL"). Keep it concise — just the ingredient name(s), 1-3 words typically.
- dosage_type: The form factor (e.g. "Chewable Tablet", "Oral Suspension", "Topical Solution", "Spot-On Treatment", "Dental Chew", "Eye Ointment"). 
- weight_class: The weight range this product is suited for, if applicable (e.g. "Dogs 25-60 lbs", "All weights", "Cats 2-10 lbs"). If not weight-dependent, use "All weights".
- usage: A concise phrase describing what the product treats or is used for (e.g. "Pain and inflammation associated with osteoarthritis", "Flea and tick prevention", "Dental plaque and tartar control"). 5-15 words.
- side_effects: Accurate, specific side effects known for this product's active ingredient. List the actual known adverse reactions (e.g. for Carprofen: "May cause gastrointestinal upset including vomiting, diarrhea, and decreased appetite. Rare but serious side effects include liver or kidney toxicity. Stop use and contact your veterinarian if jaundice, increased thirst/urination, or persistent vomiting occurs."). If the product is a supplement with minimal known side effects, state that honestly. Do NOT use generic placeholder text — provide real, ingredient-specific information. If genuinely unknown, write "Consult your veterinarian for possible side effects specific to this medication." 2-4 sentences.
- serving_info: The serving size / dosage strength info (e.g. "Each chewable tablet contains 75 mg carprofen", "1 mL per 10 lbs body weight", "One chew per day for dogs 25-50 lbs"). Be specific to the product form. 1-2 sentences.
- directions: How to administer the product (e.g. "Give orally once or twice daily with food. Dosage based on body weight — 2 mg per lb. Follow your veterinarian's exact instructions.", "Apply topically to the affected area once daily.", "Place the chew directly in the pet's mouth or mix with food."). Be specific and practical. 2-3 sentences.

Rules:
- Be accurate and specific to the actual active ingredient. Do NOT use generic boilerplate.
- Keep each field concise but informative.
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
                  side_effects: { type: 'string' },
                  serving_info: { type: 'string' },
                  directions: { type: 'string' },
                },
                required: ['id', 'active_ingredient', 'dosage_type', 'weight_class', 'usage', 'side_effects', 'serving_info', 'directions'],
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
          side_effects: (item.side_effects || '').slice(0, 800),
          serving_info: (item.serving_info || '').slice(0, 500),
          directions: (item.directions || '').slice(0, 600),
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