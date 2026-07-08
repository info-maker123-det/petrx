import React from "react";
import ProductCard from "./ProductCard";

export default function CatalogGrid({ products = [], loading = false, columns = 3, emptyText = "No products available yet." }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-4 border-secondary border-t-sage rounded-full animate-spin" />
      </div>
    );
  }
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-ink/40 text-sm">{emptyText}</p>
      </div>
    );
  }
  const cols = columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <div className={`grid grid-cols-1 ${cols} gap-6`}>
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} index={i} />
      ))}
    </div>
  );
}