import React from "react";

const CATEGORIES = [
  "All", "Prescription", "Flea & Tick", "Flea, Tick & Heartworm", "Joint & Pain",
  "Pain & Inflammation", "Allergy Relief", "Skin & Coat", "Eye & Ear", "Antibiotics",
  "Behavioral", "Dental", "Digestive Health", "Thyroid & Hormone", "Heart Health",
  "Cleaning & Odor", "Supplements",
];

const PET_TYPES = [
  { key: "all", label: "All Pets" },
  { key: "dog", label: "Dogs" },
  { key: "cat", label: "Cats" },
  { key: "horse", label: "Horses" },
];

export default function ShopSidebar({ category, setCategory, petType, setPetType, onClose }) {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-ink/40 mb-3">Shop by Pet</h3>
        <div className="space-y-1">
          {PET_TYPES.map((pt) => (
            <button
              key={pt.key}
              onClick={() => { setPetType(pt.key); onClose?.(); }}
              className={`flex items-center w-full px-3 py-2 rounded-2xl text-sm text-left transition-colors ${
                petType === pt.key ? "bg-sage/10 text-sage font-medium" : "text-ink/60 hover:bg-secondary"
              }`}
            >
              {pt.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-ink/40 mb-3">Categories</h3>
        <div className="space-y-0.5 max-h-[55vh] overflow-y-auto pr-1">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => { setCategory(c); onClose?.(); }}
              className={`flex items-center w-full px-3 py-2 rounded-2xl text-sm text-left transition-colors ${
                category === c ? "bg-sage/10 text-sage font-medium" : "text-ink/60 hover:bg-secondary"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}