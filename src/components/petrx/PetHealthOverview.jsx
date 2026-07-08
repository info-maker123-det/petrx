import React, { useState } from "react";
import { Link } from "react-router-dom";
import PetAlerts from "./PetAlerts";
import HealthTimeline from "./HealthTimeline";
import QuickReorder from "./QuickReorder";
import { Pill, PawPrint, Activity } from "lucide-react";

export default function PetHealthOverview({ pets }) {
  const [selectedId, setSelectedId] = useState(pets[0]?.id || null);
  const pet = pets.find((p) => p.id === selectedId) || pets[0];

  if (!pet) {
    return (
      <div className="cellular-card py-16 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-sage/10 flex items-center justify-center mb-5">
          <PawPrint className="w-7 h-7 text-sage/50" />
        </div>
        <h3 className="font-display text-xl text-ink mb-2">No pets to overview</h3>
        <p className="text-sm text-ink/50 max-w-sm">
          Add a pet to see their full health timeline, care advice, and reorder history.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Pet selector */}
      {pets.length > 1 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1 pb-2 mb-6">
          {pets.map((p) => {
            const active = p.id === pet.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedId(p.id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border-2 transition-all flex-shrink-0 ${
                  active ? "border-sage bg-sage/5" : "border-border bg-white hover:border-sage/40"
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-sage/10 flex items-center justify-center overflow-hidden">
                  {p.photo_url ? (
                    <img src={p.photo_url} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <PawPrint className="w-4 h-4 text-sage/50" />
                  )}
                </div>
                <span className={`text-sm font-semibold ${active ? "text-sage" : "text-ink"}`}>{p.name}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Patient summary banner */}
      <div className="cellular-card p-5 md:p-6 mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-sage/10 flex items-center justify-center overflow-hidden flex-shrink-0">
          {pet.photo_url ? (
            <img src={pet.photo_url} alt={pet.name} className="w-full h-full object-cover" />
          ) : (
            <PawPrint className="w-7 h-7 text-sage/50" />
          )}
        </div>
        <div className="flex-1">
          <h2 className="font-display text-2xl text-ink">{pet.name}</h2>
          <p className="text-sm text-ink/50 capitalize">
            {pet.breed ? `${pet.breed} · ` : ""}{pet.species}
            {pet.weight ? ` · ${pet.weight} ${pet.weight_unit || "lbs"}` : ""}
            {pet.medical_conditions?.length ? ` · ${pet.medical_conditions.length} condition(s)` : ""}
          </p>
        </div>
        <Link
          to={`/advisor`}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-sage text-white rounded-full text-sm font-semibold hover:bg-[#3d5a66] transition-colors flex-shrink-0"
        >
          <Activity className="w-4 h-4" /> Ask Advisor
        </Link>
      </div>

      {/* Grid: advice + history */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <PetAlerts pet={pet} />
        <HealthTimeline pet={pet} />
      </div>

      {/* Current medications */}
      <div className="cellular-card p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Pill className="w-4 h-4 text-sage" />
          <h3 className="font-display text-lg text-ink">Current Medications</h3>
        </div>
        {pet.medications?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pet.medications.map((m, i) => (
              <div key={i} className="p-3.5 bg-secondary/40 rounded-2xl">
                <p className="text-sm font-semibold text-ink">{m.name}</p>
                {(m.dosage || m.frequency) && (
                  <p className="text-xs text-ink/50 mt-0.5">
                    {[m.dosage, m.frequency].filter(Boolean).join(" · ")}
                  </p>
                )}
                {m.notes && <p className="text-xs text-ink/40 mt-1">{m.notes}</p>}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <Pill className="w-7 h-7 text-ink/20 mx-auto mb-2" />
            <p className="text-xs text-ink/40 mb-3">No medications recorded for {pet.name}.</p>
            <Link to="/dashboard" className="text-xs text-sage font-semibold hover:underline">
              Add from pet profile →
            </Link>
          </div>
        )}
      </div>

      {/* Quick reorder */}
      <QuickReorder />
    </div>
  );
}