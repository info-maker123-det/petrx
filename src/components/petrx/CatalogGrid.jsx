import React from "react";
import ProductCard from "./ProductCard";

export default function CatalogGrid({ products = [], loading = false, columns = 3, emptyText = "No products available yet.", mobileScroll = false }) {
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

  if (mobileScroll) {
    return (
      <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 overflow-x-auto sm:overflow-visible no-scrollbar snap-x snap-mandatory sm:snap-none -mx-5 px-5 sm:mx-0 sm:px-0 pb-2 sm:pb-0">
        {products.map((product, i) => (
          <div key={product.id} className="w-[75vw] max-w-[280px] sm:w-auto sm:max-w-none flex-shrink-0 sm:flex-shrink snap-start">
            <ProductCard product={product} index={i} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 ${cols} gap-6`}>
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} index={i} />
      ))}
    </div>
  );
}