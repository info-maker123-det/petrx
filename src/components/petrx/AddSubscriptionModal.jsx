import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { base44 } from "@/api/base44Client";
import { useCart } from "@/lib/cartContext";
import { Search, Loader2, Plus, Check, Pill, Leaf, ShieldCheck } from "lucide-react";

export const FREQUENCIES = [
  { days: 14, label: "Every 2 weeks" },
  { days: 30, label: "Monthly" },
  { days: 42, label: "Every 6 weeks" },
  { days: 60, label: "Every 2 months" },
  { days: 90, label: "Quarterly" },
  { days: 180, label: "Every 6 months" },
];

export default function AddSubscriptionModal({ open, onClose, pet, products = [], onAdded }) {
  const navigate = useNavigate();
  const { addItem, closeCart } = useCart();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [frequency, setFrequency] = useState(30);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products.slice(0, 24);
    return products
      .filter((p) => `${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(q))
      .slice(0, 24);
  }, [products, query]);

  const reset = () => {
    setQuery("");
    setSelected(null);
    setQuantity(1);
    setFrequency(30);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected || !pet) return;
    setSaving(true);
    setError("");
    try {
      const next = new Date();
      next.setDate(next.getDate() + frequency);
      await base44.entities.Subscription.create({
        pet_id: pet.id,
        pet_name: pet.name,
        product_id: selected.id,
        product_name: selected.name,
        product_image: selected.image_url,
        product_price: selected.price,
        brand: selected.brand,
        requires_prescription: selected.requires_prescription,
        quantity,
        frequency_days: frequency,
        next_refill_date: next.toISOString().slice(0, 10),
        status: "active",
      });
      reset();
      onAdded();
      onClose();
      closeCart();
      addItem(selected, quantity, true);
      if (selected.requires_prescription) {
        navigate("/prescription");
      } else {
        navigate("/checkout");
      }
    } catch (err) {
      setError(err.message || "Could not create this subscription.");
    }
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) reset(); onClose(); }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            Add to {pet?.name}'s AutoShip
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {!selected ? (
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search medications, supplements, brands..."
                className="w-full pl-10 pr-4 py-3 bg-secondary rounded-2xl text-sm border-[0.5px] border-transparent focus:border-sage focus:outline-none"
              />
              <div className="mt-3 max-h-80 overflow-y-auto space-y-1.5 no-scrollbar">
                {results.length === 0 ? (
                  <p className="text-sm text-ink/40 text-center py-8">
                    No products match "{query}".
                  </p>
                ) : (
                  results.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => { setSelected(p); setQuery(""); }}
                      className="flex items-center gap-3 w-full p-2.5 rounded-2xl hover:bg-secondary text-left transition-colors"
                    >
                      <div className="w-11 h-11 rounded-xl bg-secondary overflow-hidden flex-shrink-0">
                        {p.image_url ? (
                          <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            {p.requires_prescription ? <Pill className="w-4 h-4 text-sage/50" /> : <Leaf className="w-4 h-4 text-sage/50" />}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink truncate">{p.name}</p>
                        <p className="text-xs text-ink/50">{p.brand} · ${p.price?.toFixed(2)}</p>
                      </div>
                      {p.requires_prescription && (
                        <ShieldCheck className="w-3.5 h-3.5 text-ochre flex-shrink-0" />
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-secondary rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-white overflow-hidden flex-shrink-0">
                  {selected.image_url ? (
                    <img src={selected.image_url} alt={selected.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {selected.requires_prescription ? <Pill className="w-5 h-5 text-sage/50" /> : <Leaf className="w-5 h-5 text-sage/50" />}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink">{selected.name}</p>
                  <p className="text-xs text-ink/50">{selected.brand} · ${selected.price?.toFixed(2)}</p>
                </div>
                <button type="button" onClick={() => setSelected(null)} className="text-xs text-sage font-medium hover:underline">
                  Change
                </button>
              </div>

              <div>
                <label className="text-xs font-medium text-ink/60 mb-1.5 block">Quantity</label>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-9 h-9 rounded-2xl bg-secondary text-ink font-medium hover:bg-sage/10">−</button>
                  <span className="w-10 text-center text-sm font-medium">{quantity}</span>
                  <button type="button" onClick={() => setQuantity((q) => q + 1)} className="w-9 h-9 rounded-2xl bg-secondary text-ink font-medium hover:bg-sage/10">+</button>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-ink/60 mb-1.5 block">Delivery frequency</label>
                <div className="grid grid-cols-2 gap-2">
                  {FREQUENCIES.map((f) => (
                    <button
                      key={f.days}
                      type="button"
                      onClick={() => setFrequency(f.days)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-medium transition-colors ${
                        frequency === f.days ? "bg-sage text-white" : "bg-secondary text-ink/60 hover:bg-sage/10"
                      }`}
                    >
                      {f.label}
                      {frequency === f.days && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              {selected.requires_prescription && (
                <p className="text-xs text-ochre bg-ochre/10 rounded-2xl p-3 leading-relaxed">
                  This medication requires a prescription. We'll verify it with your vet before the first refill ships.
                </p>
              )}

              {error && <p className="text-xs text-destructive">{error}</p>}

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 bg-sage text-white rounded-2xl text-sm font-semibold hover:bg-[#3d5a66] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                {saving ? "Adding..." : "Add to AutoShip"}
              </button>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}