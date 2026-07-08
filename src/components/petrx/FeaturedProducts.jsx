import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { Pill, Leaf, LayoutGrid, ArrowRight } from "lucide-react";
import PharmaCatalog from "./PharmaCatalog";
import SupplementsCatalog from "./SupplementsCatalog";
import CatalogGrid from "./CatalogGrid";
import GuidedShop, { HEALTH_ISSUES } from "./GuidedShop";

const TABS = [
  { key: "all", label: "All Products", icon: LayoutGrid },
  { key: "pharma", label: "Pharmacy", icon: Pill },
  { key: "supplements", label: "Supplements", icon: Leaf },
];

export default function FeaturedProducts() {
  const [rx, setRx] = useState([]);
  const [otc, setOtc] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [petType, setPetType] = useState("all");
  const [healthIssue, setHealthIssue] = useState(null);
  const [visibleAll, setVisibleAll] = useState(18);

  useEffect(() => {
    Promise.all([
      base44.entities.Product.filter({ requires_prescription: true }, "-rating", 24).catch(() => []),
      base44.entities.Product.filter({ requires_prescription: false }, "-rating", 24).catch(() => []),
    ]).then(([rxData, otcData]) => {
      setRx(rxData);
      setOtc(otcData);
      setLoading(false);
    });
  }, []);

  const allProducts = [...rx, ...otc];

  const issueCats = healthIssue ? HEALTH_ISSUES.find((i) => i.id === healthIssue)?.categories : null;
  const matchesGuide = (p) => {
    if (petType !== "all" && p.pet_type !== petType && p.pet_type !== "all") return false;
    if (issueCats && !issueCats.includes(p.category)) return false;
    return true;
  };
  const filteredRx = rx.filter(matchesGuide);
  const filteredOtc = otc.filter(matchesGuide);

  const shopLinkParams = () => {
    const params = new URLSearchParams();
    if (petType !== "all") params.set("pet", petType);
    if (healthIssue) params.set("issue", healthIssue);
    return params.toString();
  };

  return (
    <section id="products">
      {/* Tab bar */}
      <div className="bg-porcelain border-y border-border">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-6 md:py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
          <div>
            <p className="text-sage text-sm font-semibold tracking-widest uppercase mb-2">Curated by Pharmacists</p>
            <h2 className="font-display text-2xl md:text-4xl text-ink">Shop the Catalog</h2>
          </div>
          <div className="flex flex-wrap gap-1.5 p-1.5 bg-secondary rounded-full self-start md:self-auto">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                    isActive ? "bg-white text-ink shadow-sm" : "text-ink/50 hover:text-ink"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Views */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          {activeTab === "pharma" && (
            <div className="bg-[#FBF7F0] pt-8 md:pt-14">
              <div className="max-w-7xl mx-auto px-5 md:px-8">
                <GuidedShop petType={petType} setPetType={setPetType} healthIssue={healthIssue} setHealthIssue={setHealthIssue} excludeIssues={["supplements"]} />
              </div>
              <PharmaCatalog products={filteredRx} loading={loading} linkParams={shopLinkParams()} mobileScroll />
            </div>
          )}
          {activeTab === "supplements" && (
            <div className="bg-[#F4F8F6] pt-8 md:pt-14">
              <div className="max-w-7xl mx-auto px-5 md:px-8">
                <GuidedShop petType={petType} setPetType={setPetType} healthIssue={healthIssue} setHealthIssue={setHealthIssue} />
              </div>
              <SupplementsCatalog products={filteredOtc} loading={loading} linkParams={shopLinkParams()} mobileScroll />
            </div>
          )}
          {activeTab === "all" && (
            <div className="bg-white">
              <div className="max-w-7xl mx-auto px-5 md:px-8 py-12 md:py-28">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 md:mb-10">
                  <div>
                    <p className="text-ink/40 text-sm font-semibold tracking-widest uppercase mb-2">Prescriptions &amp; Supplements</p>
                    <h3 className="font-display text-2xl md:text-4xl text-ink">The full catalog</h3>
                  </div>
                  <Link to="/shop" className="flex items-center gap-2 text-sm font-semibold text-sage hover:gap-3 transition-all">
                    Open the shop <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <CatalogGrid products={allProducts.slice(0, visibleAll)} loading={loading} columns={3} emptyText="Products are loading." mobileScroll />
                {visibleAll < allProducts.length && (
                  <div className="flex justify-center mt-10">
                    <button onClick={() => setVisibleAll((v) => v + 18)} className="px-8 py-3.5 bg-white border-[0.5px] border-border rounded-full text-sm font-semibold text-ink hover:border-sage hover:text-sage transition-colors">
                      Load More
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}