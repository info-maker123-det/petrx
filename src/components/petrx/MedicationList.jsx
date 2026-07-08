import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Pill, Plus, Trash2, Clock } from "lucide-react";

export default function MedicationList({ pet, onUpdated }) {
  const meds = pet.medications || [];
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [saving, setSaving] = useState(false);

  const addMed = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      const updated = [
        ...meds,
        { name: name.trim(), dosage: dosage.trim(), frequency: frequency.trim() },
      ];
      await base44.entities.Pet.update(pet.id, { medications: updated });
      setName("");
      setDosage("");
      setFrequency("");
      onUpdated();
    } finally {
      setSaving(false);
    }
  };

  const removeMed = async (idx) => {
    const updated = meds.filter((_, i) => i !== idx);
    await base44.entities.Pet.update(pet.id, { medications: updated });
    onUpdated();
  };

  return (
    <div className="mt-4 border-t border-border pt-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-sage mb-3">
        What {pet.name} is taking
      </p>

      {meds.length === 0 ? (
        <p className="text-sm text-ink/40 mb-4">
          No medications tracked yet. Add what {pet.name} is taking below.
        </p>
      ) : (
        <div className="space-y-2 mb-4">
          {meds.map((m, i) => (
            <div key={i} className="flex items-start justify-between bg-secondary rounded-2xl p-3">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-full bg-sage/10 flex items-center justify-center flex-shrink-0">
                  <Pill className="w-4 h-4 text-sage" />
                </div>
                <div>
                  <p className="text-sm font-medium text-ink">{m.name}</p>
                  {(m.dosage || m.frequency) && (
                    <p className="text-xs text-ink/50 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {[m.dosage, m.frequency].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => removeMed(i)}
                className="text-ink/30 hover:text-destructive transition-colors p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={addMed} className="space-y-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Medication name"
          className="w-full px-4 py-2.5 bg-secondary rounded-full text-sm border-[0.5px] border-transparent focus:border-sage focus:outline-none"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            placeholder="Dosage (e.g. 16mg)"
            className="w-full px-4 py-2.5 bg-secondary rounded-full text-sm border-[0.5px] border-transparent focus:border-sage focus:outline-none"
          />
          <input
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            placeholder="Frequency (e.g. 2x daily)"
            className="w-full px-4 py-2.5 bg-secondary rounded-full text-sm border-[0.5px] border-transparent focus:border-sage focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={saving || !name.trim()}
          className="w-full py-2.5 bg-sage text-white rounded-full text-sm font-medium hover:bg-[#3d5a66] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> {saving ? "Adding..." : "Add Medication"}
        </button>
      </form>
    </div>
  );
}