import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Search, Pill } from "lucide-react";

// Combobox: searches the product catalog, but also allows free-text entry
// for medications not found in the catalog.
export default function MedicationSearch({ value, onChange }) {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState(value || "");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);

  useEffect(() => {
    base44.entities.Product
      .list("-rating", 1000)
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const q = query.trim().toLowerCase();
  const filtered = q
    ? products.filter((p) => `${p.name} ${p.brand} ${p.category} ${p.active_ingredient || ""}`.toLowerCase().includes(q)).slice(0, 30)
    : products.slice(0, 30);

  const select = (product) => {
    onChange(product.name);
    setQuery(product.name);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sage" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search medications, e.g. Vetmedin, Carprofen…"
          className="w-full pl-11 pr-4 py-3 bg-secondary rounded-2xl border-[0.5px] border-transparent focus:border-sage focus:outline-none transition-all"
        />
      </div>
      {open && (
        <div className="absolute z-20 mt-2 w-full bg-white rounded-2xl border-[0.5px] border-border shadow-lg max-h-72 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center">
              <div className="w-6 h-6 border-4 border-secondary border-t-sage rounded-full animate-spin mx-auto" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-4 text-sm text-ink/40 text-center">
              No match found — type the medication name manually and continue.
            </div>
          ) : (
            filtered.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => select(p)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary text-left transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-sage/10 flex items-center justify-center flex-shrink-0">
                  <Pill className="w-4 h-4 text-sage" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink truncate">{p.name}</p>
                  <p className="text-xs text-ink/40 truncate">{p.brand} · {p.category}</p>
                </div>
                {p.requires_prescription && (
                  <span className="text-xs text-ochre font-semibold flex-shrink-0">Rx</span>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}