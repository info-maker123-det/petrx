import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Search, Stethoscope, MapPin, Phone, Mail, Check, X, ChevronDown, Printer } from "lucide-react";

export default function VetSearch({ onSelect, selectedClinic }) {
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const containerRef = useRef(null);

  useEffect(() => {
    base44.entities.Vet
      .list("clinic_name", 2000)
      .then((data) => setVets(Array.isArray(data) ? data : []))
      .catch(() => setVets([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = query.trim()
    ? vets
        .filter((v) =>
          `${v.clinic_name} ${v.city} ${v.vet_name} ${v.address} ${v.zip}`
            .toLowerCase()
            .includes(query.trim().toLowerCase())
        )
        .slice(0, 30)
    : vets.slice(0, 30);

  const pick = (vet) => {
    onSelect(vet);
    setQuery("");
    setOpen(false);
    setHighlight(-1);
  };

  const onKey = (e) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter" && highlight >= 0) {
      e.preventDefault();
      pick(filtered[highlight]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center gap-2 py-3 text-sm text-ink/40">
        <div className="w-4 h-4 border-2 border-secondary border-t-sage rounded-full animate-spin" />
        Loading California vet directory…
      </div>
    );

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sage" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setHighlight(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKey}
          placeholder={selectedClinic ? "Search to change clinic…" : "Search by clinic name, city, or vet…"}
          className="w-full pl-11 pr-10 py-3.5 bg-secondary rounded-2xl border-[0.5px] border-transparent focus:border-sage focus:outline-none transition-all text-sm"
        />
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/30 pointer-events-none" />
      </div>

      {open && filtered.length > 0 && (
        <div className="absolute z-30 mt-2 w-full max-h-80 overflow-y-auto bg-white rounded-2xl border-[0.5px] border-border shadow-lg">
          {filtered.map((vet, idx) => (
            <button
              key={vet.id}
              type="button"
              onClick={() => pick(vet)}
              onMouseEnter={() => setHighlight(idx)}
              className={`w-full text-left px-4 py-3 border-b border-border/50 last:border-0 transition-colors ${
                idx === highlight ? "bg-sage/5" : "hover:bg-sage/5"
              }`}
            >
              <p className="text-sm font-semibold text-ink">{vet.clinic_name}</p>
              {vet.vet_name && vet.vet_name !== "Not listed" && (
                <p className="text-xs text-ink/50">Dr. {vet.vet_name}</p>
              )}
              <div className="flex items-center gap-1 mt-1 text-xs text-ink/40">
                <MapPin className="w-3 h-3" />
                <span>{vet.city}, CA{vet.zip ? ` ${vet.zip}` : ""}</span>
                {vet.phone && (
                  <>
                    <span className="mx-1">·</span>
                    <Phone className="w-3 h-3" />
                    <span>{vet.phone}</span>
                  </>
                )}
                {vet.email && (
                  <>
                    <span className="mx-1">·</span>
                    <Mail className="w-3 h-3" />
                    <span className="truncate max-w-[140px]">{vet.email}</span>
                  </>
                )}
                {vet.fax && (
                  <>
                    <span className="mx-1">·</span>
                    <Printer className="w-3 h-3" />
                    <span>{vet.fax}</span>
                  </>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {open && filtered.length === 0 && query && (
        <div className="absolute z-30 mt-2 w-full bg-white rounded-2xl border-[0.5px] border-border shadow-lg px-4 py-6 text-center">
          <p className="text-sm text-ink/50">No clinics found for "{query}".</p>
        </div>
      )}
    </div>
  );
}