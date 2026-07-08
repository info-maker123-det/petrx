import React, { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import ProductCard from "@/components/petrx/ProductCard";
import { Search, PawPrint } from "lucide-react";

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

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [petType, setPetType] = useState("all");
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(24);

  useEffect(() => {
    base44.entities.Product
      .list("-rating", 1000)
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setVisible(24);
  }, [category, petType, search]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (category !== "All" && p.category !== category) return false;
      if (petType !== "all" && p.pet_type !== petType && p.pet_type !== "all") return false;
      if (q && !`${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [products, category, petType, search]);

  const shown = filtered.slice(0, visible);

  return (
    <div className="min-h-screen bg-porcelain">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-12 md:py-16">
        <div className="mb-8">
          <p className="text-sage text-sm font-semibold tracking-widest uppercase mb-2">Pharmacy Catalog</p>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-ink">Shop All Products</h1>
          <p className="text-ink/50 mt-3 max-w-xl">
            Browse our complete catalog of prescription medications and supplements for every pet.
          </p>
        </div>

        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sage" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search medications, brands..."
            className="w-full pl-11 pr-4 py-3 bg-white rounded-full text-sm border-[0.5px] border-border focus:border-sage focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          {PET_TYPES.map((pt) => (
            <button
              key={pt.key}
              onClick={() => setPetType(pt.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                petType === pt.key
                  ? "bg-ink text-white"
                  : "bg-white text-ink/60 border-[0.5px] border-border hover:text-ink"
              }`}
            >
              {pt.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-8 pb-6 border-b border-border">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                category === c ? "bg-sage text-white" : "bg-secondary text-ink/60 hover:text-ink"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-ink/50">
            {loading ? "Loading…" : `${filtered.length} product${filtered.length !== 1 ? "s" : ""} found`}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-secondary border-t-sage rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="cellular-card py-20 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-sage/10 flex items-center justify-center mb-4">
              <PawPrint className="w-7 h-7 text-sage/50" />
            </div>
            <p className="text-ink/50 text-sm">No products match your search. Try a different filter.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {shown.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
            {visible < filtered.length && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={() => setVisible((v) => v + 24)}
                  className="px-8 py-3.5 bg-white border-[0.5px] border-border rounded-full text-sm font-semibold text-ink hover:border-sage hover:text-sage transition-colors"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}