import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import PetCard from "@/components/petrx/PetCard";
import AddPetModal from "@/components/petrx/AddPetModal";
import PetHealthOverview from "@/components/petrx/PetHealthOverview";
import { Plus, PawPrint, Package, FileText, ChevronRight, Stethoscope, HeartPulse } from "lucide-react";

const TABS = [
  { key: "pets", label: "My Pets", icon: PawPrint },
  { key: "health", label: "Pet Health", icon: HeartPulse },
  { key: "orders", label: "Orders", icon: Package },
  { key: "prescriptions", label: "Prescriptions", icon: FileText },
];

const STATUS_STYLES = {
  pending: "bg-ochre/10 text-ochre",
  processing: "bg-sage/10 text-sage",
  shipped: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  approved: "bg-green-100 text-green-700",
  in_review: "bg-sage/10 text-sage",
  rejected: "bg-red-100 text-red-700",
  fulfilled: "bg-green-100 text-green-700",
};

export default function Dashboard() {
  const [pets, setPets] = useState([]);
  const [orders, setOrders] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("pets");
  const [showAdd, setShowAdd] = useState(false);
  const [userName, setUserName] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const u = await base44.auth.me();
      setUserName(u?.full_name || "");
    } catch {
      /* user will be redirected to login by route guard */
    }
    const [p, o, rx] = await Promise.all([
      base44.entities.Pet.list().catch(() => []),
      base44.entities.Order.list("-created_date", 50).catch(() => []),
      base44.entities.Prescription.list("-created_date", 50).catch(() => []),
    ]);
    setPets(Array.isArray(p) ? p : []);
    setOrders(Array.isArray(o) ? o : []);
    setPrescriptions(Array.isArray(rx) ? rx : []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const totalMeds = pets.reduce((sum, p) => sum + (p.medications?.length || 0), 0);

  return (
    <div className="min-h-screen bg-porcelain">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-12 md:py-16">
        {/* Branded Welcome Banner */}
        <div className="relative overflow-hidden rounded-[32px] bg-[#1A1C1E] p-8 md:p-12 mb-10">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute -top-10 -right-10 w-72 h-72 rounded-full bg-sage blur-3xl" />
          </div>
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-sage text-sm font-semibold tracking-widest uppercase mb-3">My Account</p>
              <h1 className="font-display text-3xl md:text-4xl text-white mb-3 leading-tight">
                Welcome back{userName ? `, ${userName.split(" ")[0]}` : ""}
              </h1>
              <p className="text-white/50 max-w-md">
                Manage your pets, track their medications, and review your orders — all in one secure place.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <Link
                to="/advisor"
                className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white rounded-full text-sm font-semibold hover:bg-white/10 transition-colors"
              >
                <Stethoscope className="w-4 h-4" /> Ask the Advisor
              </Link>
              <Link
                to="/prescription"
                className="inline-flex items-center gap-2 px-6 py-3 bg-sage text-white rounded-full text-sm font-semibold hover:bg-[#3d5a66] transition-colors"
              >
                <FileText className="w-4 h-4" /> Submit Prescription
              </Link>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <StatCard label="Pets" value={pets.length} icon={PawPrint} />
          <StatCard label="Medications" value={totalMeds} icon={FileText} />
          <StatCard label="Orders" value={orders.length} icon={Package} />
        </div>

        <div className="flex items-center gap-2 mb-8 border-b border-border overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                tab === t.key
                  ? "border-sage text-ink"
                  : "border-transparent text-ink/40 hover:text-ink/70"
              }`}
            >
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-secondary border-t-sage rounded-full animate-spin" />
          </div>
        ) : tab === "pets" ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl text-ink">Your Pets</h2>
              <button
                onClick={() => setShowAdd(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-sage text-white rounded-full text-sm font-semibold hover:bg-[#3d5a66] transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Pet
              </button>
            </div>
            {pets.length === 0 ? (
              <EmptyState
                icon={PawPrint}
                title="No pets yet"
                desc="Add your first pet to start tracking their medications and health."
                cta={{ label: "Add Your Pet", onClick: () => setShowAdd(true) }}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {pets.map((pet) => (
                  <PetCard key={pet.id} pet={pet} onChanged={load} />
                ))}
              </div>
            )}
          </div>
        ) : tab === "health" ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl text-ink">Pet Overview</h2>
              <Link
                to="/advisor"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-border rounded-full text-sm font-semibold text-ink hover:border-sage hover:text-sage transition-colors"
              >
                <Stethoscope className="w-4 h-4" /> Open Advisor
              </Link>
            </div>
            <PetHealthOverview pets={pets} />
          </div>
        ) : tab === "orders" ? (
          <div>
            {orders.length === 0 ? (
              <EmptyState
                icon={Package}
                title="No orders yet"
                desc="When you place an order, it will appear here for tracking."
              />
            ) : (
              <div className="space-y-3">
                {orders.map((o) => (
                  <div key={o.id} className="cellular-card p-5 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-ink">{o.order_number}</p>
                      <p className="text-xs text-ink/50 mt-0.5">
                        {o.items?.length || 0} item(s) · ${o.total?.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                          STATUS_STYLES[o.status] || "bg-secondary text-ink/60"
                        }`}
                      >
                        {o.status}
                      </span>
                      <ChevronRight className="w-4 h-4 text-ink/30" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {prescriptions.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="No prescriptions"
                desc="Submit a prescription to have it reviewed by our pharmacy team."
              />
            ) : (
              <div className="space-y-3">
                {prescriptions.map((rx) => (
                  <div key={rx.id} className="cellular-card p-5 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-ink">{rx.medication_name}</p>
                      <p className="text-xs text-ink/50 mt-0.5">
                        {rx.pet_name} · {rx.vet_clinic_name}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                        STATUS_STYLES[rx.status] || "bg-secondary text-ink/60"
                      }`}
                    >
                      {rx.status.replace("_", " ")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <AddPetModal open={showAdd} onClose={() => setShowAdd(false)} onAdded={load} />
    </div>
  );
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="cellular-card p-5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-sage/10 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-sage" />
      </div>
      <div>
        <p className="font-display text-2xl text-ink">{value}</p>
        <p className="text-xs text-ink/50">{label}</p>
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, title, desc, cta }) {
  return (
    <div className="cellular-card py-16 flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-sage/10 flex items-center justify-center mb-5">
        <Icon className="w-7 h-7 text-sage" />
      </div>
      <h3 className="font-display text-xl text-ink mb-2">{title}</h3>
      <p className="text-sm text-ink/50 max-w-sm mb-6">{desc}</p>
      {cta && (
        <button
          onClick={cta.onClick}
          className="inline-flex items-center gap-2 px-6 py-3 bg-sage text-white rounded-full text-sm font-semibold hover:bg-[#3d5a66] transition-colors"
        >
          {cta.label}
        </button>
      )}
    </div>
  );
}