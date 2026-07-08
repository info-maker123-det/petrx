import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { base44 } from "@/api/base44Client";
import { Upload, Loader2, PawPrint } from "lucide-react";

const SPECIES = ["dog", "cat", "horse", "other"];

export default function AddPetModal({ open, onClose, onAdded }) {
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("dog");
  const [breed, setBreed] = useState("");
  const [weight, setWeight] = useState("");
  const [dob, setDob] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const reset = () => {
    setName("");
    setSpecies("dog");
    setBreed("");
    setWeight("");
    setDob("");
    setPhotoUrl("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError("");
    try {
      await base44.entities.Pet.create({
        name: name.trim(),
        species,
        breed: breed.trim(),
        weight: weight ? Number(weight) : undefined,
        date_of_birth: dob || undefined,
        photo_url: photoUrl,
        medications: [],
      });
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Add Your Pet</DialogTitle>
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

          <div>
            <label className="text-xs font-medium text-ink/60 mb-1.5 block">Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
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
            {saving ? "Saving..." : "Add Pet"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}