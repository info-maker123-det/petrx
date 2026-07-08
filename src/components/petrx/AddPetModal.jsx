import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { base44 } from "@/api/base44Client";
import { Upload, Loader2, PawPrint, X } from "lucide-react";

const SPECIES = ["dog", "cat", "horse", "other"];

export default function AddPetModal({ open, onClose, onAdded, editingPet }) {
  const [name, setName] = useState(editingPet?.name || "");
  const [species, setSpecies] = useState(editingPet?.species || "dog");
  const [breed, setBreed] = useState(editingPet?.breed || "");
  const [sex, setSex] = useState(editingPet?.sex || "");
  const [spayedNeutered, setSpayedNeutered] = useState(editingPet?.spayed_neutered || false);
  const [weight, setWeight] = useState(editingPet?.weight ? String(editingPet.weight) : "");
  const [dob, setDob] = useState(editingPet?.date_of_birth ? editingPet.date_of_birth.slice(0, 10) : "");
  const [photoUrl, setPhotoUrl] = useState(editingPet?.photo_url || "");
  const [conditionsInput, setConditionsInput] = useState("");
  const [conditions, setConditions] = useState(editingPet?.medical_conditions || []);
  const [allergies, setAllergies] = useState(editingPet?.allergies || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const reset = () => {
    setName("");
    setSpecies("dog");
    setBreed("");
    setSex("");
    setSpayedNeutered(false);
    setWeight("");
    setDob("");
    setPhotoUrl("");
    setConditionsInput("");
    setConditions([]);
    setAllergies("");
    setError("");
  };

  const handlePhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const res = await base44.integrations.Core.UploadFile({ file });
      setPhotoUrl(res.file_url);
    } catch {
      setError("Photo upload failed. You can still add your pet without a photo.");
    }
    setUploading(false);
  };

  const addCondition = () => {
    const val = conditionsInput.trim();
    if (val && !conditions.includes(val)) {
      setConditions([...conditions, val]);
    }
    setConditionsInput("");
  };

  const removeCondition = (c) => setConditions(conditions.filter((x) => x !== c));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError("");
    try {
      const payload = {
        name: name.trim(),
        species,
        breed: breed.trim(),
        sex: sex || undefined,
        spayed_neutered: spayedNeutered,
        weight: weight ? Number(weight) : undefined,
        date_of_birth: dob || undefined,
        photo_url: photoUrl,
        medical_conditions: conditions,
        allergies: allergies.trim(),
        medications: editingPet?.medications || [],
      };
      if (editingPet) {
        await base44.entities.Pet.update(editingPet.id, payload);
      } else {
        await base44.entities.Pet.create(payload);
      }
      reset();
      onAdded();
      onClose();
    } catch (err) {
      setError(err.message || "Could not save your pet. Please try again.");
    }
    setSaving(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) reset();
        onClose();
      }}
    >
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {editingPet ? "Edit Pet Profile" : "Add Your Pet"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="flex flex-col items-center">
            <label className="relative w-28 h-28 rounded-full bg-secondary border-[0.5px] border-border flex items-center justify-center cursor-pointer overflow-hidden hover:border-sage transition-colors">
              {photoUrl ? (
                <img src={photoUrl} alt="pet" className="w-full h-full object-cover" />
              ) : uploading ? (
                <Loader2 className="w-8 h-8 text-sage animate-spin" />
              ) : (
                <div className="flex flex-col items-center gap-1 text-sage/50">
                  <Upload className="w-6 h-6" />
                  <span className="text-[10px]">Upload photo</span>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
            </label>
          </div>

          <div>
            <label className="text-xs font-medium text-ink/60 mb-1.5 block">Pet Name *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-secondary rounded-2xl text-sm border-[0.5px] border-transparent focus:border-sage focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-ink/60 mb-1.5 block">Species</label>
            <div className="grid grid-cols-4 gap-2">
              {SPECIES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSpecies(s)}
                  className={`py-2 rounded-2xl text-xs font-medium capitalize transition-colors ${
                    species === s ? "bg-sage text-white" : "bg-secondary text-ink/60"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-ink/60 mb-1.5 block">Breed</label>
              <input
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                className="w-full px-4 py-2.5 bg-secondary rounded-2xl text-sm border-[0.5px] border-transparent focus:border-sage focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-ink/60 mb-1.5 block">Weight (lbs)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-4 py-2.5 bg-secondary rounded-2xl text-sm border-[0.5px] border-transparent focus:border-sage focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-ink/60 mb-1.5 block">Sex</label>
              <div className="grid grid-cols-2 gap-2">
                {["male", "female"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSex(sex === s ? "" : s)}
                    className={`py-2 rounded-2xl text-xs font-medium capitalize transition-colors ${
                      sex === s ? "bg-sage text-white" : "bg-secondary text-ink/60"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-ink/60 mb-1.5 block">Spayed / Neutered</label>
              <button
                type="button"
                onClick={() => setSpayedNeutered(!spayedNeutered)}
                className={`w-full py-2.5 rounded-2xl text-xs font-medium transition-colors ${
                  spayedNeutered ? "bg-sage text-white" : "bg-secondary text-ink/60"
                }`}
              >
                {spayedNeutered ? "Yes" : "No"}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-ink/60 mb-1.5 block">Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full px-4 py-2.5 bg-secondary rounded-2xl text-sm border-[0.5px] border-transparent focus:border-sage focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-ink/60 mb-1.5 block">Medical Conditions</label>
            {conditions.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {conditions.map((c) => (
                  <span key={c} className="inline-flex items-center gap-1 px-2.5 py-1 bg-sage/10 text-sage rounded-full text-xs font-medium">
                    {c}
                    <button type="button" onClick={() => removeCondition(c)} className="hover:text-ink">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input
                value={conditionsInput}
                onChange={(e) => setConditionsInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCondition();
                  }
                }}
                placeholder="e.g. Arthritis, Hypothyroidism"
                className="flex-1 px-4 py-2.5 bg-secondary rounded-2xl text-sm border-[0.5px] border-transparent focus:border-sage focus:outline-none"
              />
              <button
                type="button"
                onClick={addCondition}
                className="px-4 py-2.5 bg-secondary text-sage rounded-2xl text-sm font-medium hover:bg-sage/10 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-ink/60 mb-1.5 block">Allergies</label>
            <input
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="e.g. Chicken, Penicillin — or 'None known'"
              className="w-full px-4 py-2.5 bg-secondary rounded-2xl text-sm border-[0.5px] border-transparent focus:border-sage focus:outline-none"
            />
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={saving || uploading || !name.trim()}
            className="w-full py-3 bg-sage text-white rounded-2xl text-sm font-semibold hover:bg-[#3d5a66] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <PawPrint className="w-4 h-4" />}
            {saving ? "Saving..." : editingPet ? "Save Changes" : "Add Pet"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}