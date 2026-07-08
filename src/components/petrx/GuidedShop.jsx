import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PawPrint, Bug, Bone, Eye, Brain, Wind, Droplets, Activity, Shield, Pill, Sparkles, RotateCcw, ArrowRight, LayoutGrid } from "lucide-react";

export const PETS = [
  { key: "dog", label: "Dog", accent: "sage" },
  { key: "cat", label: "Cat", accent: "sage" },
  { key: "horse", label: "Horse", accent: "sage" },
];

export const HEALTH_ISSUES = [
  { id: "fleas", label: "Fleas, Ticks & Heartworm", icon: Bug, categories: ["Flea & Tick", "Flea, Tick & Heartworm"] },
  { id: "joint", label: "Joint & Pain", icon: Bone, categories: ["Joint & Pain", "Pain & Inflammation"] },
  { id: "skin", label: "Skin & Coat", icon: Sparkles, categories: ["Skin & Coat"] },
  { id: "eyeear", label: "Eye & Ear", icon: Eye, categories: ["Eye & Ear"] },
  { id: "behavior", label: "Behavior & Anxiety", icon: Brain, categories: ["Behavioral"] },
  { id: "allergy", label: "Allergies", icon: Wind, categories: ["Allergy Relief"] },
  { id: "digestive", label: "Digestive", icon: Droplets, categories: ["Digestive Health"] },
  { id: "thyroid", label: "Thyroid & Hormones", icon: Activity, categories: ["Thyroid & Hormone"] },
  { id: "infection", label: "Infections", icon: Shield, categories: ["Antibiotics"] },
  { id: "supplements", label: "Vitamins & Supplements", icon: Pill, categories: ["Supplements"] },
];

export default function GuidedShop({ petType, setPetType, healthIssue, setHealthIssue }) {
  const petSelected = petType !== "all";
  const issueSelected = healthIssue !== null;

  const reset = () => {
    setPetType("all");
    setHealthIssue(null);
  };

  return (
    <div className="cellular-card p-8 md:p-10 mb-10">
      {/* Step 1: Pet type */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sage text-sm font-semibold tracking-widest uppercase">Step 1</p>
          {(petSelected || issueSelected) && (
            <button onClick={reset} className="flex items-center gap-1.5 text-xs text-ink/40 hover:text-ink transition-colors">
              <RotateCcw className="w-3 h-3" /> Start over
            </button>
          )}
        </div>
        <h2 className="font-display text-2xl md:text-3xl text-ink mb-6">What kind of pet do you have?</h2>
        <div className="grid grid-cols-3 gap-3">
          {PETS.map((pet) => {
            const active = petType === pet.key;
            return (
              <button
                key={pet.key}
                onClick={() => { setPetType(pet.key); setHealthIssue(null); }}
                className={`relative flex flex-col items-center justify-center gap-2 py-5 rounded-2xl border-[0.5px] transition-all ${
                  active
                    ? "border-sage bg-sage/5 shadow-sm"
                    : "border-border bg-porcelain hover:border-sage/40 hover:bg-sage/5"
                }`}
              >
                <div className={`w-11 h-11 rounded-full flex items-center justify-center ${active ? "bg-sage text-white" : "bg-sage/10 text-sage"}`}>
                  <PawPrint className="w-5 h-5" />
                </div>
                <span className={`text-sm font-medium ${active ? "text-ink" : "text-ink/60"}`}>{pet.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Health issue */}
      <AnimatePresence>
        {petSelected && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-8 mt-8 border-t border-border">
              <p className="text-sage text-sm font-semibold tracking-widest uppercase mb-2">Step 2</p>
              <h2 className="font-display text-2xl md:text-3xl text-ink mb-6">What can we help with?</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <button
                  onClick={() => setHealthIssue(null)}
                  className={`flex flex-col items-center justify-center gap-2 py-4 px-2 rounded-2xl border-[0.5px] transition-all ${
                    !issueSelected
                      ? "border-sage bg-sage/5 shadow-sm"
                      : "border-border bg-porcelain hover:border-sage/40 hover:bg-sage/5"
                  }`}
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center ${!issueSelected ? "bg-sage text-white" : "bg-sage/10 text-sage"}`}>
                    <LayoutGrid className="w-4 h-4" />
                  </div>
                  <span className={`text-xs font-medium text-center ${!issueSelected ? "text-ink" : "text-ink/60"}`}>All issues</span>
                </button>
                {HEALTH_ISSUES.map((issue) => {
                  const active = healthIssue === issue.id;
                  const Icon = issue.icon;
                  return (
                    <button
                      key={issue.id}
                      onClick={() => setHealthIssue(issue.id)}
                      className={`flex flex-col items-center justify-center gap-2 py-4 px-2 rounded-2xl border-[0.5px] transition-all ${
                        active
                          ? "border-sage bg-sage/5 shadow-sm"
                          : "border-border bg-porcelain hover:border-sage/40 hover:bg-sage/5"
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center ${active ? "bg-sage text-white" : "bg-sage/10 text-sage"}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-xs font-medium text-center leading-tight ${active ? "text-ink" : "text-ink/60"}`}>{issue.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selection summary */}
      <AnimatePresence>
        {petSelected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-5 pt-5 border-t border-border flex items-center gap-2 text-sm"
          >
            <span className="text-ink/40">Showing</span>
            <span className="px-3 py-1 bg-sage/10 text-sage rounded-full text-xs font-medium capitalize">{petType} products</span>
            {issueSelected && (
              <>
                <ArrowRight className="w-3 h-3 text-ink/30" />
                <span className="px-3 py-1 bg-sage/10 text-sage rounded-full text-xs font-medium">
                  {HEALTH_ISSUES.find((i) => i.id === healthIssue)?.label}
                </span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}