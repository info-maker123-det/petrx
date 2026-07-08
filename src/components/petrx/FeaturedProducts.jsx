import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import ProductCard from "./ProductCard";

const TABS = [
  { key: "all", label: "All Products" },
  { key: "pharma", label: "Pharmaceuticals" },
  { key: "supplements", label: "Supplements" },
];

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    base44.entities.Product
      .filter({ featured: true }, "-rating", 24)
      .then((data) => setProducts(data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) => {
    if (activeTab === "pharma") return p.requires_prescription;
    if (activeTab === "supplements") return !p.requires_prescription;
    return true;
  });

  return (
    <section id="products" className="py-24 md:py-36 bg-white">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <p className="text-sage text-sm font-semibold tracking-widest uppercase mb-3">Pharmacy</p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-ink">
              Shop the Catalog
            </h2>
          </div>
          <p className="text-ink/50 max-w-sm text-base">
            Prescription medications and everyday supplements — browse by category to find exactly what your pet needs.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-12 pb-px">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-sage text-white"
                  : "bg-secondary text-ink/60 hover:text-ink"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-secondary border-t-sage rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-ink/40 text-sm">No products in this category yet. Check back shortly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}