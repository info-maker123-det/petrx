import React, { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import ProductCard from "@/components/petrx/ProductCard";
import ShopSidebar from "@/components/petrx/ShopSidebar";
import GuidedShop, { HEALTH_ISSUES } from "@/components/petrx/GuidedShop";
import TopSellersCarousel from "@/components/petrx/TopSellersCarousel";
import { Search, PawPrint, SlidersHorizontal, X, RotateCcw } from "lucide-react";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [petType, setPetType] = useState("all");
  const [productType, setProductType] = useState("all");
  const [brand, setBrand] = useState("all");
  const [search, setSearch] = useState("");
  const [healthIssue, setHealthIssue] = useState(null);
  const [visible, setVisible] = useState(24);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pet = params.get("pet");
    if (pet && ["dog", "cat", "horse"].includes(pet)) setPetType(pet);
    const type = params.get("type");
    if (type === "rx" || type === "otc") setProductType(type);
    const brandParam = params.get("brand");
    if (brandParam) setBrand(brandParam);
    const categoryParam = params.get("category");
    if (categoryParam) setCategory(categoryParam);
    const issueParam = params.get("issue");
    if (issueParam) setHealthIssue(issueParam);
    base44.entities.Product
      .list("-rating", 1000)
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { setVisible(24); }, [category, petType, productType, brand, search, healthIssue]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const issueCats = healthIssue ? HEALTH_ISSUES.find((i) => i.id === healthIssue)?.categories : null;
    return products.filter((p) => {
      if (petType !== "all" && p.pet_type !== petType && p.pet_type !== "all") return false;
      if (productType === "rx" && !p.requires_prescription) return false;
      if (productType === "otc" && p.requires_prescription) return false;
      if (issueCats && !issueCats.includes(p.category)) return false;
      if (!issueCats && category !== "All" && p.category !== category) return false;
      if (brand !== "all" && p.brand !== brand) return false;
      if (q && !`${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [products, category, petType, productType, brand, search, healthIssue]);

  const hasFilters = category !== "All" || petType !== "all" || productType !== "all" || brand !== "all" || search || healthIssue;

  const clearFilters = () => {
    setCategory("All");
    setPetType("all");
    setProductType("all");
    setBrand("all");
    setSearch("");
    setHealthIssue(null);
  };

  const shown = filtered.slice(0, visible);

  const sidebarProps = {
    products, category, setCategory, petType, setPetType,
    productType, setProductType, brand, setBrand,
  };

  const issueLabel = healthIssue ? HEALTH_ISSUES.find((i) => i.id === healthIssue)?.label : null;

  const heading = (() => {
    if (brand !== "all") return { eyebrow: "Brand", title: `Shop ${brand}`, subtitle: `All medications and supplements from ${brand}.` };
    if (category !== "All") return { eyebrow: "Category", title: `Shop ${category}`, subtitle: `Products in the ${category} category.` };
    if (productType === "rx") return { eyebrow: "Prescription", title: "Shop the Pharmacy", subtitle: "Vet-verified prescription medications, reviewed by our pharmacists." };
    if (productType === "otc") return { eyebrow: "Over-the-Counter", title: "Shop Supplements", subtitle: "Vet-recommended wellness supplements — no prescription required." };
    if (petType !== "all") return { eyebrow: "Shop by Pet", title: `Shop for ${petType === "all" ? "All Pets" : petType.charAt(0).toUpperCase() + petType.slice(1) + "s"}`, subtitle: `Showing products for your ${petType}${issueLabel ? ` — ${issueLabel}` : ""}.` };
    return { eyebrow: "Pharmacy Catalog", title: "Shop All Products", subtitle: "Prescription medications and supplements for every pet." };
  })();

  return (
    <div className="min-h-screen bg-porcelain">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-12 md:py-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <p className="text-sage text-sm font-semibold tracking-widest uppercase mb-3">{heading.eyebrow}</p>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-ink leading-tight">{heading.title}</h1>
          </div>
          <p className="text-ink/50 max-w-sm text-base">{loading ? "Loading catalog…" : heading.subtitle}</p>
        </div>

        {brand === "all" && category === "All" && (
          <>
            <GuidedShop
              products={products}
              petType={petType}
              setPetType={setPetType}
              healthIssue={healthIssue}
              setHealthIssue={setHealthIssue}
              excludeIssues={productType === "rx" ? ["supplements"] : []}
            />
            <TopSellersCarousel products={products} />
          </>
        )}

        <div className="flex gap-3 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sage" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search medications, brands..."
              className="w-full pl-11 pr-4 py-3 bg-white rounded-full text-sm border-[0.5px] border-border focus:border-sage focus:outline-none"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 px-5 py-3 bg-white border-[0.5px] border-border rounded-full text-sm font-medium text-ink"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
        </div>

        <div className="flex gap-10">
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <div className="sticky top-28">
              <ShopSidebar {...sidebarProps} />
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-6 flex items-center gap-1.5 text-xs text-sage hover:text-[#3d5a66] font-medium"
                >
                  <RotateCcw className="w-3 h-3" /> Clear all filters
                </button>
              )}
            </div>
          </aside>

          {showFilters && (
            <div className="lg:hidden fixed inset-0 z-50 bg-[#1A1C1E]/40 backdrop-blur-sm" onClick={() => setShowFilters(false)}>
              <div className="absolute top-0 left-0 bottom-0 w-72 bg-porcelain p-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-display text-xl">Filters</h2>
                  <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-secondary rounded-full"><X className="w-5 h-5" /></button>
                </div>
                <ShopSidebar {...sidebarProps} onClose={() => setShowFilters(false)} />
              </div>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-ink/50">
                {loading ? "Loading…" : `${filtered.length} product${filtered.length !== 1 ? "s" : ""}`}
              </p>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="lg:hidden flex items-center gap-1.5 text-xs text-sage font-medium"
                >
                  <RotateCcw className="w-3 h-3" /> Clear
                </button>
              )}
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
                <p className="text-ink/50 text-sm mb-4">No products match your filters.</p>
                <button onClick={clearFilters} className="px-6 py-2.5 bg-sage text-white rounded-full text-sm font-semibold hover:bg-[#3d5a66] transition-colors">
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
      </div>
    </div>
  );
}