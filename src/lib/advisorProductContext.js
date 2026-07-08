import { base44 } from "@/api/base44Client";

const CONDITION_CATEGORIES = {
  allerg: "Allergy Relief",
  itch: "Allergy Relief",
  arthrit: "Joint & Pain",
  joint: "Joint & Pain",
  mobility: "Joint & Pain",
  anxiety: "Behavioral",
  stress: "Behavioral",
  dental: "Dental",
  ear: "Eye & Ear",
  eye: "Eye & Ear",
  flea: "Flea & Tick",
  tick: "Flea & Tick",
  heartworm: "Flea, Tick & Heartworm",
  thyroid: "Thyroid & Hormone",
  hormone: "Thyroid & Hormone",
  skin: "Skin & Coat",
  coat: "Skin & Coat",
  dermat: "Skin & Coat",
  digest: "Digestive Health",
  diarrhea: "Digestive Health",
  stomach: "Digestive Health",
  infect: "Antibiotics",
  bacterial: "Antibiotics",
  pain: "Pain & Inflammation",
  inflam: "Pain & Inflammation",
};

const BASE_CATEGORIES = ["Supplements", "Joint & Pain", "Dental", "Skin & Coat", "Allergy Relief"];

/**
 * Pre-fetches products relevant to the pet's species + conditions and formats
 * them as a compact context string. This replaces the agent's slow multi-step
 * Product entity searches with a single injected catalog.
 */
export async function buildProductContext(pet) {
  const species = pet?.species || "dog";
  const conditions = pet?.medical_conditions || [];

  const categories = new Set(BASE_CATEGORIES);
  for (const cond of conditions) {
    const lower = cond.toLowerCase();
    for (const [key, cat] of Object.entries(CONDITION_CATEGORIES)) {
      if (lower.includes(key)) {
        categories.add(cat);
        break;
      }
    }
  }

  const fetches = [...categories].map(async (category) => {
    try {
      const items = await base44.entities.Product.filter({ category }, "-rating", 30);
      return (items || []).filter((p) => p.pet_type === species || p.pet_type === "all");
    } catch {
      return [];
    }
  });

  const results = await Promise.all(fetches);
  const seen = new Set();
  const products = [];
  for (const items of results) {
    for (const p of items) {
      if (!seen.has(p.id)) {
        seen.add(p.id);
        products.push(p);
      }
    }
  }

  if (!products.length) return "";

  const lines = products.slice(0, 80).map((p) => {
    const rx = p.requires_prescription ? "Rx" : "OTC";
    const ing = p.active_ingredient ? ` ${p.active_ingredient}` : "";
    const price = p.price != null ? ` $${p.price.toFixed(2)}` : "";
    return `- ${p.name} [${rx}, ${p.category}]${ing}${price} | id:${p.id}`;
  });

  return `RELEVANT PRODUCTS (use ONLY these; link as [Name](/product/{id})):\n${lines.join("\n")}`;
}