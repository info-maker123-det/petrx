import React, { useMemo } from "react";
import { ChevronDown } from "lucide-react";
import BrandFilter from "./BrandFilter";

const PET_TYPES = [
  { key: "all", label: "All Pets" },
  { key: "dog", label: "Dogs" },
  { key: "cat", label: "Cats" },
  { key: "horse", label: "Horses" },
];

const PRODUCT_TYPES = [
  { key: "all", label: "All Products" },
  { key: "rx", label: "Prescription (Rx)" },
  { key: "otc", label: "Over-the-Counter" },
];

export default function ShopSidebar({
  products,
  category, setCategory,
  petType, setPetType,
  productType, setProductType,
  brand, setBrand,
  onClose,
}) {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((p) => p.category).filter(Boolean))).sort()],
    [products]
  );

  const brands = useMemo(
    () => Array.from(new Set(products.map((p) => p.brand).filter(Boolean))).sort(),
    [products]
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Product Type */}
      <FilterGroup title="Product Type">
        {PRODUCT_TYPES.map((t) => (
          <FilterButton
            key={t.key}
            active={productType === t.key}
            onClick={() => { setProductType(t.key); onClose?.(); }}
            label={t.label}
          />
        ))}
      </FilterGroup>

      {/* Animal */}
      <FilterGroup title="Shop by Animal">
        {PET_TYPES.map((pt) => (
          <FilterButton
            key={pt.key}
            active={petType === pt.key}
            onClick={() => { setPetType(pt.key); onClose?.(); }}
            label={pt.label}
          />
        ))}
      </FilterGroup>

      {/* Health Issue / Category */}
      <FilterGroup title="Health Issue">
        <div className="max-h-52 overflow-y-auto pr-1 space-y-0.5">
          {categories.map((c) => (
            <FilterButton
              key={c}
              active={category === c}
              onClick={() => { setCategory(c); onClose?.(); }}
              label={c}
            />
          ))}
        </div>
      </FilterGroup>

      {/* Brand */}
      <BrandFilter brands={brands} brand={brand} setBrand={setBrand} onClose={onClose} />
    </div>
  );
}

function FilterGroup({ title, children }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-widest text-ink/40 mb-3">{title}</h3>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function FilterButton({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-3 py-2 rounded-2xl text-sm text-left transition-colors ${
        active ? "bg-sage/10 text-sage font-medium" : "text-ink/60 hover:bg-secondary"
      }`}
    >
      {label}
    </button>
  );
}