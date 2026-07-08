import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { Upload, FileText, Check, ArrowRight, Stethoscope, PawPrint, MapPin, Phone, Mail, X } from "lucide-react";
import MedicationSearch from "@/components/petrx/MedicationSearch";
import VetSearch from "@/components/petrx/VetSearch";

export default function PrescriptionUpload() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState("");
  const [checkingPets, setCheckingPets] = useState(true);
  const [selectedVet, setSelectedVet] = useState(null);
  const [manualVet, setManualVet] = useState(false);
  const [form, setForm] = useState({
    pet_name: "",
    pet_species: "dog",
    medication_name: "",
    vet_clinic_name: "",
    vet_name: "",
    vet_phone: "",
    vet_email: "",
    vet_address: "",
    notes: "",
  });

  useEffect(() => {
    base44.auth.isAuthenticated().then((authed) => {
      if (!authed) {
        base44.auth.redirectToLogin("/prescription");
        return;
      }
      base44.entities.Pet.list()
        .then((data) => {
          const list = Array.isArray(data) ? data : [];
          setPets(list);
          if (list.length > 0) {
            setSelectedPetId(list[0].id);
            setForm((f) => ({ ...f, pet_name: list[0].name, pet_species: list[0].species }));
          }
        })
        .catch(() => setPets([]))
        .finally(() => setCheckingPets(false));
    });
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  };

  const valid = form.pet_name && form.medication_name && form.vet_clinic_name;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!valid) {
      setError("Please fill in your pet's name, medication, and vet clinic.");
      return;
    }
    setSubmitting(true);
    try {
      let prescription_file_url = "";
      const fileInput = document.getElementById("prescription-file");
      const file = fileInput?.files?.[0];
      if (file) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        prescription_file_url = file_url;
      }
      const record = await base44.entities.Prescription.create({
        ...form,
        prescription_file_url,
        status: "pending",
      });
      setSubmitted(record);
    } catch (err) {
      setError("Something went wrong submitting your prescription. Please try again.");
    }
    setSubmitting(false);
  };

  if (submitted)
    return (
      <div className="py-20 md:py-32 bg-porcelain">
        <div className="max-w-2xl mx-auto px-5 md:px-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12 }}
            className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
          >
            <Check className="w-10 h-10 text-green-600" />
          </motion.div>
          <p className="text-sage text-sm font-semibold tracking-widest uppercase mb-2">Prescription Received</p>
          <h1 className="font-display text-3xl md:text-4xl text-ink mb-3">We're on it</h1>
          <p className="text-ink/50 mb-8 max-w-md mx-auto">
            Our pharmacists will verify your prescription with {submitted.vet_clinic_name}. You'll receive an email
            update once it's approved — usually within 24–48 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/" className="px-6 py-3 bg-sage text-white rounded-full text-sm font-semibold hover:bg-[#3d5a66] transition-colors">
              Continue Shopping
            </Link>
            <Link to="/contact" className="px-6 py-3 border-[0.5px] border-border rounded-full text-sm font-semibold text-ink hover:bg-secondary transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    );

  if (checkingPets)
    return (
      <div className="py-20 md:py-32 bg-porcelain flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-secondary border-t-sage rounded-full animate-spin" />
      </div>
    );

  if (pets.length === 0)
    return (
      <div className="py-20 md:py-32 bg-porcelain">
        <div className="max-w-xl mx-auto px-5 md:px-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-sage/10 flex items-center justify-center mx-auto mb-6">
            <PawPrint className="w-8 h-8 text-sage" />
          </div>
          <p className="text-sage text-sm font-semibold tracking-widest uppercase mb-2">Pet Profile Required</p>
          <h1 className="font-display text-3xl md:text-4xl text-ink mb-3">Add your pet first</h1>
          <p className="text-ink/50 mb-8 max-w-md mx-auto">
            Before submitting a prescription, please create a profile for your pet so we can match the medication to the right patient.
          </p>
          <Link to="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 bg-sage text-white rounded-full text-sm font-semibold hover:bg-[#3d5a66] transition-colors">
            Create Pet Profile <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );

  return (
    <div className="py-12 md:py-16 bg-porcelain">
      <div className="max-w-3xl mx-auto px-5 md:px-8">
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-sage/10 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-7 h-7 text-sage" />
          </div>
          <p className="text-sage text-sm font-semibold tracking-widest uppercase mb-2">Prescription</p>
          <h1 className="font-display text-3xl md:text-4xl text-ink mb-3">Submit Your Prescription</h1>
          <p className="text-ink/50 max-w-md mx-auto">
            Upload your vet's prescription or provide your clinic's details and we'll contact them directly.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="cellular-card p-6 md:p-8 space-y-8">
          {/* Pet Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <PawPrint className="w-5 h-5 text-sage" />
              <h2 className="font-display text-xl text-ink">Pet Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-xs text-ink/50 font-medium uppercase tracking-wider">Select Your Pet *</label>
                <select
                  value={selectedPetId}
                  onChange={(e) => {
                    const pet = pets.find((p) => p.id === e.target.value);
                    setSelectedPetId(e.target.value);
                    setForm({ ...form, pet_name: pet?.name || "", pet_species: pet?.species || "dog" });
                  }}
                  className="mt-1 w-full px-4 py-3 bg-secondary rounded-2xl border-[0.5px] border-transparent focus:border-sage focus:outline-none transition-all"
                >
                  {pets.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} ({p.species})</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs text-ink/50 font-medium uppercase tracking-wider">Medication Name *</label>
                <div className="mt-1">
                  <MedicationSearch value={form.medication_name} onChange={(val) => setForm({ ...form, medication_name: val })} />
                </div>
              </div>
            </div>
          </div>

          {/* Vet Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Stethoscope className="w-5 h-5 text-sage" />
              <h2 className="font-display text-xl text-ink">Veterinarian Information</h2>
            </div>

            {selectedVet ? (
              <div className="p-5 bg-sage/5 rounded-2xl border-[0.5px] border-sage/30">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-sage/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-5 h-5 text-sage" />
                    </div>
                    <div>
                      <p className="font-semibold text-ink">{selectedVet.clinic_name}</p>
                      {selectedVet.vet_name && selectedVet.vet_name !== "Not listed" && (
                        <p className="text-sm text-ink/50">Dr. {selectedVet.vet_name}</p>
                      )}
                      <div className="mt-2 space-y-1 text-sm text-ink/60">
                        {selectedVet.address && (
                          <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-sage" />{selectedVet.address}, {selectedVet.city}, CA {selectedVet.zip}</p>
                        )}
                        {selectedVet.phone && (
                          <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-sage" />{selectedVet.phone}</p>
                        )}
                        {selectedVet.email && (
                          <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-sage" />{selectedVet.email}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedVet(null);
                      setForm({ ...form, vet_clinic_name: "", vet_name: "", vet_phone: "", vet_email: "", vet_address: "" });
                    }}
                    className="p-2 hover:bg-white/60 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-ink/40" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm text-ink/40 mb-3">Search our California vet directory and select your clinic — we'll fill in the rest.</p>
                <VetSearch
                  selectedClinic={form.vet_clinic_name}
                  onSelect={(vet) => {
                    setSelectedVet(vet);
                    setManualVet(false);
                    setForm({
                      ...form,
                      vet_clinic_name: vet.clinic_name,
                      vet_name: vet.vet_name && vet.vet_name !== "Not listed" ? vet.vet_name : "",
                      vet_phone: vet.phone || "",
                      vet_email: vet.email || "",
                      vet_address: vet.address ? `${vet.address}, ${vet.city}, CA ${vet.zip || ""}`.trim() : "",
                    });
                  }}
                />
                <button
                  type="button"
                  onClick={() => setManualVet(!manualVet)}
                  className="mt-3 text-xs text-sage hover:underline font-medium"
                >
                  {manualVet ? "Cancel manual entry" : "Can't find your vet? Enter manually"}
                </button>

                {manualVet && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="text-xs text-ink/50 font-medium uppercase tracking-wider">Clinic Name *</label>
                      <input name="vet_clinic_name" value={form.vet_clinic_name} onChange={handleChange} className="mt-1 w-full px-4 py-3 bg-secondary rounded-2xl border-[0.5px] border-transparent focus:border-sage focus:outline-none transition-all" />
                    </div>
                    <div>
                      <label className="text-xs text-ink/50 font-medium uppercase tracking-wider">Vet's Name</label>
                      <input name="vet_name" value={form.vet_name} onChange={handleChange} className="mt-1 w-full px-4 py-3 bg-secondary rounded-2xl border-[0.5px] border-transparent focus:border-sage focus:outline-none transition-all" />
                    </div>
                    <div>
                      <label className="text-xs text-ink/50 font-medium uppercase tracking-wider">Phone</label>
                      <input name="vet_phone" value={form.vet_phone} onChange={handleChange} className="mt-1 w-full px-4 py-3 bg-secondary rounded-2xl border-[0.5px] border-transparent focus:border-sage focus:outline-none transition-all" />
                    </div>
                    <div>
                      <label className="text-xs text-ink/50 font-medium uppercase tracking-wider">Email</label>
                      <input name="vet_email" type="email" value={form.vet_email} onChange={handleChange} className="mt-1 w-full px-4 py-3 bg-secondary rounded-2xl border-[0.5px] border-transparent focus:border-sage focus:outline-none transition-all" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs text-ink/50 font-medium uppercase tracking-wider">Clinic Address</label>
                      <input name="vet_address" value={form.vet_address} onChange={handleChange} className="mt-1 w-full px-4 py-3 bg-secondary rounded-2xl border-[0.5px] border-transparent focus:border-sage focus:outline-none transition-all" />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* File Upload */}
          <div>
            <h2 className="font-display text-xl text-ink mb-2">Upload Prescription</h2>
            <p className="text-sm text-ink/40 mb-4">
              Optional — if you have a copy, upload it now. Otherwise we'll contact your vet directly.
            </p>
            <label
              htmlFor="prescription-file"
              className="flex flex-col items-center justify-center gap-2 p-8 border-2 border-dashed border-border rounded-2xl cursor-pointer hover:border-sage hover:bg-sage/5 transition-all"
            >
              <Upload className="w-7 h-7 text-sage" />
              <span className="text-sm font-medium text-ink">{fileName || "Click to upload"}</span>
              <span className="text-xs text-ink/40">PDF, JPG, or PNG up to 10MB</span>
              <input id="prescription-file" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFile} className="hidden" />
            </label>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs text-ink/50 font-medium uppercase tracking-wider">Additional Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} placeholder="Any details about your pet's condition or prescription..." className="mt-1 w-full px-4 py-3 bg-secondary rounded-2xl border-[0.5px] border-transparent focus:border-sage focus:outline-none transition-all resize-none" />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-4 bg-sage text-white rounded-full font-semibold text-sm hover:bg-[#3d5a66] transition-colors disabled:opacity-50"
          >
            {submitting ? "Submitting..." : <>Submit Prescription <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>
      </div>
    </div>
  );
}