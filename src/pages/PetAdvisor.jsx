import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import AdvisorChat from "@/components/petrx/AdvisorChat";
import PetHealthPanel from "@/components/petrx/PetHealthPanel";
import { Stethoscope, PawPrint, Plus, ArrowRight, ShieldCheck } from "lucide-react";

export default function PetAdvisor() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPet, setSelectedPet] = useState(null);

  useEffect(() => {
    base44.entities.Pet
      .list()
      .then((data) => {
        setPets(data || []);
        if (data?.length > 0) setSelectedPet(data[0]);
      })
      .catch(() => setPets([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="py-6 md:py-16 bg-porcelain min-h-screen">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="mb-8 md:mb-12">
          <div className="flex items-center gap-2 text-sage text-xs font-semibold tracking-wider uppercase mb-3">
            <Stethoscope className="w-4 h-4" /> PetRx Advisor
          </div>
          <h1 className="font-display text-3xl md:text-4xl text-ink mb-3 leading-tight">
            Personalized Medication Guidance
          </h1>
          <p className="text-ink/60 text-sm md:text-base max-w-2xl leading-relaxed">
            Get tailored product recommendations based on your pet's medical conditions, allergies, and
            current medications — reviewed by our pharmacy intelligence.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-secondary border-t-sage rounded-full animate-spin" />
          </div>
        ) : pets.length === 0 ? (
          <div className="cellular-card p-10 md:p-16 text-center">
            <div className="w-16 h-16 rounded-full bg-sage/10 flex items-center justify-center mx-auto mb-5">
              <PawPrint className="w-8 h-8 text-sage/50" />
            </div>
            <h2 className="font-display text-2xl text-ink mb-2">Add a pet to get started</h2>
            <p className="text-ink/50 text-sm mb-6 max-w-md mx-auto">
              Our advisor analyzes your pet's medical profile to suggest the best products. Add a pet with
              their conditions and medications first.
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-sage text-white rounded-full text-sm font-semibold hover:bg-[#3d5a66] transition-colors"
            >
              Go to Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <p className="text-xs text-ink/40 uppercase tracking-wider font-semibold mb-3">
                Select a Pet
              </p>
              <div className="flex gap-2 md:gap-3 overflow-x-auto no-scrollbar -mx-1 px-1 pb-1">
                {pets.map((pet) => {
                  const active = selectedPet?.id === pet.id;
                  return (
                    <button
                      key={pet.id}
                      onClick={() => setSelectedPet(pet)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all flex-shrink-0 ${
                        active
                          ? "border-sage bg-sage/5"
                          : "border-border bg-white hover:border-sage/40"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-sage/10 flex items-center justify-center overflow-hidden">
                        {pet.photo_url ? (
                          <img
                            src={pet.photo_url}
                            alt={pet.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <PawPrint className="w-5 h-5 text-sage/50" />
                        )}
                      </div>
                      <div className="text-left">
                        <p
                          className={`text-sm font-semibold ${
                            active ? "text-sage" : "text-ink"
                          }`}
                        >
                          {pet.name}
                        </p>
                        <p className="text-xs text-ink/40 capitalize">
                          {pet.breed || pet.species}
                        </p>
                      </div>
                    </button>
                  );
                })}
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl border-2 border-dashed border-border text-ink/40 hover:text-sage hover:border-sage/40 transition-all text-sm font-medium flex-shrink-0"
                >
                  <Plus className="w-4 h-4" /> Add Pet
                </Link>
              </div>
            </div>

            {selectedPet && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center gap-2 mb-3 text-xs text-ink/40">
                  <ShieldCheck className="w-3.5 h-3.5 text-sage" />
                  Recommendations are guidance only — always consult your veterinarian before starting
                  new medications.
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 items-start">
                  <div className="lg:sticky lg:top-28 order-2 lg:order-1">
                    <PetHealthPanel pet={selectedPet} />
                  </div>
                  <div className="order-1 lg:order-2">
                    <AdvisorChat pet={selectedPet} />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}