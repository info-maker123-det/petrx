import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TopSellerCard from "./TopSellerCard";

export default function TopSellersCarousel({ products = [] }) {
  const scrollRef = useRef(null);

  const topSellers = [...products]
    .filter((p) => p.image_url)
    .sort((a, b) => (b.review_count || 0) - (a.review_count || 0) || (b.rating || 0) - (a.rating || 0))
    .slice(0, 12);

  if (topSellers.length === 0) return null;

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 300, behavior: "smooth" });
  };

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-sage text-sm font-semibold tracking-widest uppercase mb-1">Most Popular</p>
          <h2 className="font-display text-2xl md:text-3xl text-ink">Top Sellers</h2>
        </div>
        <div className="flex gap-2">
          <button onClick={() => scroll(-1)} className="w-10 h-10 rounded-full border border-border bg-white flex items-center justify-center hover:border-sage hover:text-sage transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => scroll(1)} className="w-10 h-10 rounded-full border border-border bg-white flex items-center justify-center hover:border-sage hover:text-sage transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar pb-2">
        {topSellers.map((p) => (
          <TopSellerCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}