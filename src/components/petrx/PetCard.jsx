import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import MedicationList from "./MedicationList";
import { PawPrint, Trash2, ChevronDown, Pill, Cake } from "lucide-react";

export default function PetCard({ pet, onChanged }) {
  const [expanded, setExpanded] = useState(false);
  const meds = pet.medications || [];

  const handleDelete = async () => {
    if (!confirm(`Remove ${pet.name} from your pets?`)) return;
    await base44.entities.Pet.delete(pet.id);
    onChanged();
  };

  const ageText = pet.date_of_birth
    ? `${new Date().getFullYear() - new Date(pet.date_of_birth).getFullYear()} yrs`
    : null;

  return (
    <div className="cellular-card overflow-hidden flex flex-col">
      <div className="relative aspect-[4/3] bg-gradient-to-br from-sage/10 to-secondary flex items-center justify-center">
        {pet.photo_url ? (
          <img src={pet.photo_url} alt={pet.name} className="w-full h-full object-cover absolute inset-0" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-sm">
            <PawPrint className="w-10 h-10 text-sage/40" />
          </div>
        )}
        <button
          onClick={handleDelete}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-ink/40 hover:text-destructive transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-medium text-sage capitalize">
          {pet.species}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display text-xl text-ink">{pet.name}</h3>
        <div className="flex items-center gap-2 text-xs text-ink/50 mt-1 mb-4 flex-wrap">
          {pet.breed && <span>{pet.breed}</span>}
          {pet.weight && <span>· {pet.weight} {pet.weight_unit || "lbs"}</span>}
          {ageText && (
            <span className="flex items-center gap-1">
              · <Cake className="w-3 h-3" /> {ageText}
            </span>
          )}
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-between w-full px-4 py-3 bg-secondary rounded-2xl text-sm font-medium text-ink hover:bg-sage/10 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Pill className="w-4 h-4 text-sage" />
            {meds.length} medication{meds.length !== 1 ? "s" : ""}
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>

        {expanded && <MedicationList pet={pet} onUpdated={onChanged} />}
      </div>
    </div>
  );
}