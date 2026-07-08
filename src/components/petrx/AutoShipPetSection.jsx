import React, { useState } from "react";
import AutoShipSubscriptionRow from "./AutoShipSubscriptionRow";
import AddSubscriptionModal from "./AddSubscriptionModal";
import { Plus, PawPrint, Pill } from "lucide-react";

export default function AutoShipPetSection({ pet, subscriptions, products, onChanged }) {
  const [showAdd, setShowAdd] = useState(false);
  const petSubs = subscriptions.filter((s) => s.pet_id === pet.id);

  return (
    <div className="cellular-card overflow-hidden">
      <div className="flex items-center gap-4 p-5 border-b border-border">
        <div className="w-14 h-14 rounded-2xl bg-sage/10 overflow-hidden flex-shrink-0">
          {pet.photo_url ? (
            <img src={pet.photo_url} alt={pet.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <PawPrint className="w-6 h-6 text-sage/40" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-xl text-ink">{pet.name}</h3>
          <p className="text-xs text-ink/50 capitalize">
            {pet.species}{pet.breed ? ` · ${pet.breed}` : ""}{pet.weight ? ` · ${pet.weight} ${pet.weight_unit || "lbs"}` : ""}
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-sage text-white rounded-full text-xs font-semibold hover:bg-[#3d5a66] transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add Item
        </button>
      </div>

      <div className="p-5">
        {petSubs.length === 0 ? (
          <div className="flex flex-col items-center text-center py-8">
            <div className="w-12 h-12 rounded-2xl bg-sage/10 flex items-center justify-center mb-3">
              <Pill className="w-5 h-5 text-sage/50" />
            </div>
            <p className="text-sm text-ink/50 mb-3">No AutoShip items yet for {pet.name}.</p>
            <button
              onClick={() => setShowAdd(true)}
              className="text-sm text-sage font-medium hover:underline"
            >
              Add a medication or supplement
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {petSubs.map((sub) => (
              <AutoShipSubscriptionRow key={sub.id} sub={sub} onChanged={onChanged} />
            ))}
          </div>
        )}
      </div>

      <AddSubscriptionModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        pet={pet}
        products={products}
        onAdded={onChanged}
      />
    </div>
  );
}