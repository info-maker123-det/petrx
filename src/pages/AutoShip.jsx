import React, { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import AddPetModal from "@/components/petrx/AddPetModal";
import AutoShipPetSection from "@/components/petrx/AutoShipPetSection";
import { Plus, RefreshCw, Calendar, PiggyBank, PawPrint } from "lucide-react";

export default function AutoShip() {
  const [pets, setPets] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddPet, setShowAddPet] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [p, s, pr] = await Promise.all([
      base44.entities.Pet.list().catch(() => []),
      base44.entities.Subscription.list("-created_date", 200).catch(() => []),
      base44.entities.Product.list("-rating", 1000).catch(() => []),
    ]);
    setPets(Array.isArray(p) ? p : []);
    setSubscriptions(Array.isArray(s) ? s : []);
    setProducts(Array.isArray(pr) ? pr : []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const activeSubs = subscriptions.filter((s) => s.status === "active");
  const totalSavings = activeSubs.reduce(
    (sum, s) => sum + (s.product_price || 0) * 0.05 * (s.quantity || 1),
    0
  );
  const nextRefill = activeSubs
    .map((s) => s.next_refill_date)
    .filter(Boolean)
    .sort()[0];

  return (
    <div className="min-h-screen bg-porcelain">
      <div className="max-w-5xl mx-auto px-5 md:px-8 py-12 md:py-16">
        <div className="mb-10">
          <p className="text-sage text-sm font-semibold tracking-widest uppercase mb-3">Subscribe & Save</p>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-ink mb-4 leading-tight">
            AutoShip Manager
          </h1>
          <p className="text-ink/50 max-w-lg leading-relaxed">
            Build a restock schedule for every pet. Add medications, prescriptions, and supplements —
            set the frequency, and we'll deliver before you run out. Save 5% on every refill.
          </p>
        </div>

        {!loading && pets.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <SummaryCard icon={RefreshCw} label="Active Subscriptions" value={activeSubs.length} />
            <SummaryCard
              icon={Calendar}
              label="Next Refill"
              value={nextRefill ? new Date(nextRefill).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}
            />
            <SummaryCard icon={PiggyBank} label="Saved Per Cycle" value={`$${totalSavings.toFixed(2)}`} />
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-secondary border-t-sage rounded-full animate-spin" />
          </div>
        ) : pets.length === 0 ? (
          <div className="cellular-card py-16 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-sage/10 flex items-center justify-center mb-5">
              <PawPrint className="w-7 h-7 text-sage" />
            </div>
            <h3 className="font-display text-xl text-ink mb-2">Start with a pet profile</h3>
            <p className="text-sm text-ink/50 max-w-sm mb-6">
              Add your pet to build their personalized AutoShip restock schedule.
            </p>
            <button
              onClick={() => setShowAddPet(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-sage text-white rounded-full text-sm font-semibold hover:bg-[#3d5a66] transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Your Pet
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {pets.map((pet) => (
              <AutoShipPetSection
                key={pet.id}
                pet={pet}
                subscriptions={subscriptions}
                products={products}
                onChanged={load}
              />
            ))}
            <button
              onClick={() => setShowAddPet(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sage font-medium text-sm hover:underline"
            >
              <Plus className="w-4 h-4" /> Add another pet
            </button>
          </div>
        )}
      </div>

      <AddPetModal open={showAddPet} onClose={() => setShowAddPet(false)} onAdded={load} />
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value }) {
  return (
    <div className="cellular-card p-5 flex items-center gap-4">
      <div className="w-11 h-11 rounded-2xl bg-sage/10 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-sage" />
      </div>
      <div>
        <p className="font-display text-xl text-ink">{value}</p>
        <p className="text-xs text-ink/50">{label}</p>
      </div>
    </div>
  );
}