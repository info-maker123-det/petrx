import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import ProductCard from "./ProductCard";

// Shows similar products from the same brand (fallback to same category),
// excluding the current product.
export default function SimilarProducts({ product }) {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!product?.id) return;
    setLoading(true);
    base44.entities.Product
      .list("-rating", 1000)
      .then((data) => {
        const all = Array.isArray(data) ? data : [];
        const sameBrand = all.filter((p) => p.id !== product.id && p.brand === product.brand);
        const sameCategory = all.filter(
          (p) => p.id !== product.id && p.brand !== product.brand && p.category === product.category
        );
        setRelated([...sameBrand, ...sameCategory].slice(0, 4));
      })
      .catch(() => setRelated([]))
      .finally(() => setLoading(false));
  }, [product?.id]);

  if (!loading && related.length === 0) return null;

  return (
    <div className="diagnostic-line pt-12 mt-12">
      <p className="text-sage text-sm font-semibold tracking-widest uppercase mb-2">You May Also Like</p>
      <h3 className="font-display text-2xl text-ink mb-6">Similar products</h3>
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-secondary border-t-sage rounded-full animate-spin" />
        </div>
      ) : (
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 overflow-x-auto sm:overflow-visible no-scrollbar snap-x snap-mandatory sm:snap-none -mx-5 px-5 sm:mx-0 sm:px-0 pb-2 sm:pb-0">
          {related.map((p, i) => (
            <div key={p.id} className="w-[75vw] max-w-[280px] sm:w-auto sm:max-w-none flex-shrink-0 sm:flex-shrink snap-start">
              <ProductCard product={p} index={i} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}