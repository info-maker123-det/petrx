import React from "react";
import { Link } from "react-router-dom";
import { FileText, Stethoscope, Package, ArrowRight, ShieldCheck } from "lucide-react";
import CatalogGrid from "./CatalogGrid";

const STEPS = [
  { icon: FileText, title: "Choose & order", desc: "Select your pet's medication and check out securely." },
  { icon: Stethoscope, title: "Pharmacist review", desc: "Our team verifies your veterinarian's prescription." },
  { icon: Package, title: "Shipped to you", desc: "Approved orders ship within one business day." },
];

export default function PharmaCatalog({ products, loading, linkParams = "" }) {
  const viewAllHref = `/shop?type=rx${linkParams ? `&${linkParams}` : ""}`;
  return (
    <div>
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-14 md:py-20">
        <div className="grid lg:grid-cols-3 gap-10 lg:gap-14">
          {/* Clinical intro panel */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-28">
              <p className="text-ochre text-sm font-semibold tracking-widest uppercase mb-3">Prescription</p>
              <h3 className="font-display text-3xl text-ink mb-4 leading-tight">Vet-verified medications</h3>
              <p className="text-ink/60 text-sm leading-relaxed mb-8">
                Every prescription order is reviewed by a licensed pharmacist before it leaves our facility — so your pet gets exactly what the doctor ordered.
              </p>
              <div className="space-y-5">
                {STEPS.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-ochre/10 flex items-center justify-center flex-shrink-0">
                      <step.icon className="w-4 h-4 text-ochre" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink mb-0.5">{step.title}</p>
                      <p className="text-xs text-ink/50 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/prescription" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-ochre hover:gap-3 transition-all">
                Upload a prescription <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </aside>

          {/* Product grid */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs text-ink/40 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Pharmacist-reviewed
              </p>
              <Link to={viewAllHref} className="text-sm text-ink/50 hover:text-ink transition-colors">View all Rx</Link>
            </div>
            <CatalogGrid products={products} loading={loading} columns={2} emptyText="No prescription medications available right now." />
          </div>
        </div>
      </div>
    </div>
  );
}