import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Repeat } from "lucide-react";
import CatalogGrid from "./CatalogGrid";

export default function SupplementsCatalog({ products, loading }) {
  return (
    <div className="bg-[#F4F8F6]">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-20 md:py-28">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-sage text-sm font-semibold tracking-widest uppercase mb-3">Over-the-Counter</p>
          <h3 className="font-display text-3xl md:text-4xl text-ink mb-4 leading-tight">Daily wellness & supplements</h3>
          <p className="text-ink/60 text-sm leading-relaxed">
            Vet-recommended supplements for joint, skin, digestive, and everyday care — no prescription required.
          </p>
        </div>

        {/* AutoShip strip */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12 bg-white rounded-3xl border-[0.5px] border-border px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sage/10 flex items-center justify-center flex-shrink-0">
              <Repeat className="w-4 h-4 text-sage" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">Save 5% with AutoShip</p>
              <p className="text-xs text-ink/50">Schedule recurring deliveries — skip or cancel anytime.</p>
            </div>
          </div>
          <Link to="/shop?type=otc" className="flex items-center gap-2 text-sm font-semibold text-sage hover:gap-3 transition-all">
            Browse supplements <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <CatalogGrid products={products} loading={loading} columns={3} emptyText="No supplements available right now." />
      </div>
    </div>
  );
}