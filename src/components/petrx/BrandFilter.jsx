import React, { useMemo, useState } from "react";
import { ChevronDown, Search, Check, RotateCcw } from "lucide-react";

export default function BrandFilter({ brands, brand, setBrand, onClose }) {
  const [query, setQuery] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = brands.filter((b) => !q || b.toLowerCase().includes(q));
    const map = {};
    filtered.forEach((b) => {
      const letter = (b[0] || "#").toUpperCase();
      if (!map[letter]) map[letter] = [];
      map[letter].push(b);
    });
    return Object.keys(map)
      .sort()
      .map((letter) => ({ letter, items: map[letter].sort() }));
  }, [brands, query]);

  const total = brands.length;
  const shown = grouped.reduce((n, g) => n + g.items.length, 0);

  const select = (b) => {
    setBrand(b);
    onClose?.();
  };

  return (
    <div>
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="flex items-center justify-between w-full mb-3"
      >
        <span className="text-xs font-semibold uppercase tracking-widest text-ink/40">
          Brand {brand !== "all" && <span className="text-sage normal-case font-medium tracking-normal">· {brand}</span>}
        </span>
        <ChevronDown className={`w-4 h-4 text-ink/40 transition-transform ${collapsed ? "-rotate-90" : ""}`} />
      </button>

      {!collapsed && (
        <div>
          {brand !== "all" && (
            <button
              onClick={() => select("all")}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-2xl text-sm text-left text-ink/60 hover:bg-secondary transition-colors mb-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> All Brands
            </button>
          )}

          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${total} brands…`}
              className="w-full pl-9 pr-3 py-2 bg-secondary rounded-2xl text-sm text-ink border-[0.5px] border-transparent focus:border-sage focus:bg-white focus:outline-none"
            />
          </div>

          <div className="max-h-64 overflow-y-auto pr-1 no-scrollbar space-y-3">
            {grouped.length === 0 ? (
              <p className="text-xs text-ink/40 px-3 py-2">No brands match "{query}".</p>
            ) : (
              grouped.map((group) => (
                <div key={group.letter}>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-ink/30 px-3 mb-1">
                    {group.letter}
                  </p>
                  <div className="space-y-0.5">
                    {group.items.map((b) => {
                      const active = brand === b;
                      return (
                        <button
                          key={b}
                          onClick={() => select(b)}
                          className={`flex items-center justify-between w-full px-3 py-2 rounded-2xl text-sm text-left transition-colors ${
                            active ? "bg-sage/10 text-sage font-medium" : "text-ink/60 hover:bg-secondary"
                          }`}
                        >
                          <span className="truncate">{b}</span>
                          {active && <Check className="w-3.5 h-3.5 flex-shrink-0 ml-2" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          {query && shown < total && (
            <p className="text-[11px] text-ink/40 px-3 mt-2">
              Showing {shown} of {total}
            </p>
          )}
        </div>
      )}
    </div>
  );
}