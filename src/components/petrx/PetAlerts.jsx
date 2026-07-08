import React from "react";
import { Link } from "react-router-dom";
import { Bone, Sparkles, Scale, Cake, AlertCircle } from "lucide-react";

function ageYears(dob) {
  if (!dob) return null;
  const b = new Date(dob);
  if (isNaN(b.getTime())) return null;
  return (Date.now() - b.getTime()) / (365.25 * 24 * 3600 * 1000);
}

function buildAlerts(pet) {
  const alerts = [];
  const age = ageYears(pet.date_of_birth);
  const w = pet.weight;
  const unit = pet.weight_unit || "lbs";
  const sp = pet.species;
  const isDog = sp === "dog";
  const isCat = sp === "cat";
  const isHorse = sp === "horse";

  if (age === null) {
    alerts.push({
      icon: Cake, tone: "sage",
      title: "Add a birth date",
      detail: `Knowing ${pet.name}'s age helps us flag age-relevant care.`,
      to: "/dashboard", label: "Update profile",
    });
  } else if (age < 1) {
    alerts.push({
      icon: Sparkles, tone: "sage",
      title: `${isDog ? "Puppy" : isCat ? "Kitten" : "Young"} life stage`,
      detail: "Growth & development support is especially relevant right now.",
      to: "/shop?issue=supplements", label: "Browse wellness",
    });
  } else {
    const seniorAt = isDog ? (w && w > 50 ? 6 : 7) : isCat ? 10 : isHorse ? 15 : 8;
    if (age >= seniorAt) {
      alerts.push({
        icon: Bone, tone: "ochre",
        title: "Senior life stage",
        detail: "Joint & mobility support becomes especially relevant as pets age.",
        to: "/shop?issue=joint", label: "Joint & pain products",
      });
    }
  }

  if (w) {
    const largeDog = isDog && w >= 75;
    const heavyCat = isCat && w >= 12;
    if (largeDog || heavyCat) {
      alerts.push({
        icon: Scale, tone: "ochre",
        title: "Higher weight range",
        detail: `At ${w} ${unit}, joint support and weight-appropriate dosing are especially relevant.`,
        to: "/shop?issue=joint", label: "See relevant products",
      });
    } else {
      alerts.push({
        icon: Scale, tone: "sage",
        title: "Weight on file",
        detail: `Medication dosing is matched to ${pet.name}'s ${w} ${unit}.`,
        to: "/shop", label: "Browse the shop",
      });
    }
  }

  return alerts;
}

const TONE = {
  sage: { bg: "bg-sage/5", border: "border-sage/20", icon: "bg-sage/10 text-sage" },
  ochre: { bg: "bg-ochre/5", border: "border-ochre/20", icon: "bg-ochre/10 text-ochre" },
};

export default function PetAlerts({ pet }) {
  const alerts = buildAlerts(pet);
  return (
    <div className="cellular-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="w-4 h-4 text-sage" />
        <h3 className="font-display text-lg text-ink">Care Alerts</h3>
      </div>
      <div className="space-y-2.5">
        {alerts.map((a, i) => {
          const Icon = a.icon;
          const t = TONE[a.tone];
          return (
            <div key={i} className={`flex gap-3 p-3 rounded-2xl border ${t.bg} ${t.border}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${t.icon}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink">{a.title}</p>
                <p className="text-xs text-ink/50 leading-relaxed mb-1.5">{a.detail}</p>
                <Link to={a.to} className="text-xs text-sage font-semibold hover:underline">{a.label} →</Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}