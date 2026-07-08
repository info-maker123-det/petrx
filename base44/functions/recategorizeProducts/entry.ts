import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const CATEGORIES = [
  "Allergy Relief","Antibiotics","Behavioral","Dental","Digestive Health",
  "Eye & Ear","Flea & Tick","Flea, Tick & Heartworm","Joint & Pain",
  "Pain & Inflammation","Prescription","Skin & Coat","Supplements","Thyroid & Hormone"
];
const PET_TYPES = ["dog","cat","horse","all"];

const RULES = `You are a veterinary pharmacy catalog expert. For each product, assign the SINGLE most accurate category and the most accurate pet_type.

CATEGORIES (use EXACT spelling, pick ONE):
- Allergy Relief — anti-itch/allergy meds: apoquel/oclacitinib, cyclosporine/atopica, cytopoint, hydroxyzine, cetirizine, temaril-p, corticosteroids used for allergies (prednisolone for itching).
- Antibiotics — antimicrobials/anti-infectives: amoxicillin, clavamox, cephalexin, clindamycin, metronidazole, enrofloxacin/baytril, doxycycline, marbofloxacin, sulfamethoxazole/trimethoprim, gentamicin, azithromycin, penicillin, tetracycline.
- Behavioral — anxiety/calming/behavior: trazodone, fluoxetine/prozac, clomipramine/clomicalm, acepromazine, selegiline/anipryl, diazepam, calming supplements marketed for anxiety.
- Dental — oral/dental care: toothpaste, dental chews, plaque/tartar control, Oravet, enzymatic gels, periodontal/gingival products, 1-TDC when marketed for dental.
- Digestive Health — gut/digestion: probiotics, digestive enzymes, pancreatin/pancreatic enzymes, anti-nausea (maropitant/cerenia, ondansetron), sucralfate, famotidine/omeprazole (GI), cobalequin/B12, electrolytes, diarrhea remedies.
- Eye & Ear — ophthalmic/otic: eye drops/ointments, ear treatments, mometamax, osurnia, posatex, synotic, optimmune, tobramycin, ofloxacin otic, terramycin eye.
- Flea & Tick — flea/tick only prevention/treatment: fipronil, nitenpyram, spinosad, imidacloprid, fluralaner/bravecto, afoxolaner/nexgard, sarolaner, lotilaner, lufenuron, methoprene, pyriproxyfen, permethrin, flea combs/collars.
- Flea, Tick & Heartworm — combo flea/tick AND heartworm: heartgard (ivermectin+pyrantel), trifexis (spinosad+milbemycin), revolution/stronghold (selamectin), advantage multi (imidacloprid+moxidectin), sentinel (milbemycin+lufenuron). Use only when it covers heartworm too.
- Joint & Pain — joint/mobility supplements: glucosamine, chondroitin, MSM, dasuquin, cosequin, adequan, omega-3 for joints, arthri-ease, joint chews.
- Pain & Inflammation — analgesics/NSAIDs: carprofen/rimadyl, meloxicam/metacam, deracoxib/previcox, firocoxib, robenacoxib/onsior, gabapentin (pain), grapiprant/vetprofen, galliprant, corticosteroids for inflammation.
- Prescription — ONLY a catch-all for Rx drugs that fit NONE of the above specific categories. Prefer a specific category whenever one applies. Do not use for OTC items.
- Skin & Coat — skin/coat topical care: shampoos, conditioners, miconazole/chlorhexidine shampoos, derma sprays, hot spot treatments, coat supplements, dandruff/seborrhea, wound/topical care.
- Supplements — general wellness nutrition ONLY: multivitamins, omega-3/fish/salmon/krill oil for general wellness, fatty acids, antioxidants, taurine, immune support, lysine, milk thistle, general nutritional supplements with no specific therapeutic category. NOT for Rx or specific-therapy products.
- Thyroid & Hormone — endocrine: methimazole, levothyroxine/soloxine/thyroxine, trilostane/vetoryl, desoxycorticosterone/percorten/zycortal, insulin/vetsulin/prozinc, desmopressin, anipryl for Cushing's.

RULES:
1. Decide by active_ingredient and usage/indication, not just the name.
2. Prefer the SPECIFIC therapeutic category over "Prescription" and over "Supplements". A prescription antibiotic is "Antibiotics", NOT "Prescription". An OTC joint chew is "Joint & Pain", NOT "Supplements".
3. "Supplements" is the LAST resort for OTC items with no specific therapeutic category.
4. "Prescription" is the LAST resort for Rx items with no specific therapeutic category.
5. Fleas/ticks AND heartworm → "Flea, Tick & Heartworm"; fleas/ticks only → "Flea & Tick".
6. Corticosteroids (prednisolone, dexamethasone): for allergies/itching → "Allergy Relief"; for anti-inflammation/pain → "Pain & Inflammation".

pet_type: assign "dog", "cat", "horse", or "all". Use "all" when suitable for multiple species (common for general supplements, shampoos, dental chews, omega oils, probiotics). Keep the specific species for species-specific products (many Rx meds and flea/tick preventives are species/weight-specific). If the name says "for Dogs & Cats" → "all". Only change pet_type when clearly more accurate.

Return ONLY the assignments array: one {id, category, pet_type} per product, using each product's exact id.`;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    let body = {};
    try { body = await req.json(); } catch (_) {}
    const start = Number(body.start) || 0;
    const count = Number(body.count) || 120;
    const SUB = 30;

    const all = await base44.asServiceRole.entities.Product.list('-rating', 1000);
    const slice = all.slice(start, start + count);

    const changes = [];
    let processed = 0;

    for (let i = 0; i < slice.length; i += SUB) {
      const sub = slice.slice(i, i + SUB);
      const payload = sub.map(p => ({
        id: p.id,
        name: p.name,
        active_ingredient: (p.active_ingredient || "").slice(0, 120),
        usage: (p.usage || "").slice(0, 160),
        brand: p.brand || "",
        requires_prescription: !!p.requires_prescription,
        current_category: p.category || "",
        current_pet_type: p.pet_type || ""
      }));
      const prompt = `${RULES}\n\nProducts to categorize (JSON):\n${JSON.stringify(payload)}\n\nReturn the assignments array.`;
      const res = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            assignments: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  category: { type: "string" },
                  pet_type: { type: "string" }
                },
                required: ["id", "category", "pet_type"]
              }
            }
          },
          required: ["assignments"]
        }
      });
      const assignments = Array.isArray(res?.assignments) ? res.assignments : [];
      const toUpdate = [];
      for (const a of assignments) {
        const p = sub.find(x => x.id === a.id);
        if (!p) continue;
        const newCat = CATEGORIES.includes(a.category) ? a.category : null;
        const newPt = PET_TYPES.includes(a.pet_type) ? a.pet_type : null;
        const catChanged = newCat && newCat !== p.category;
        const ptChanged = newPt && newPt !== p.pet_type;
        if (catChanged || ptChanged) {
          const upd = { id: p.id };
          if (catChanged) upd.category = newCat;
          if (ptChanged) upd.pet_type = newPt;
          toUpdate.push(upd);
          changes.push({ name: p.name, from_cat: p.category, to_cat: catChanged ? newCat : p.category, from_pt: p.pet_type, to_pt: ptChanged ? newPt : p.pet_type });
        }
      }
      if (toUpdate.length) await base44.asServiceRole.entities.Product.bulkUpdate(toUpdate);
      processed += sub.length;
    }

    return Response.json({ processed, changed: changes.length, changes });
  } catch (error) {
    return Response.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
});