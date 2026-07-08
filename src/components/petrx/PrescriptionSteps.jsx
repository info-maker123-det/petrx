import React from "react";
import { Upload, Stethoscope, CheckCircle2, Truck } from "lucide-react";

const STEPS = [
  { icon: Upload, label: "Submit Rx", desc: "Upload or share your vet's prescription" },
  { icon: Stethoscope, label: "Pharmacist Review", desc: "Our team verifies with your vet" },
  { icon: CheckCircle2, label: "Approved", desc: "You'll get an email confirmation" },
  { icon: Truck, label: "Shipped", desc: "Medication delivered to your door" },
];

export default function PrescriptionSteps({ active = 0 }) {
  return (
    <div className="cellular-card p-6 md:p-8 mb-8">
      <p className="text-sage text-sm font-semibold tracking-widest uppercase mb-1 text-center">How It Works</p>
      <h2 className="font-display text-xl md:text-2xl text-ink text-center mb-6">Our 4-Step Pharmacy Process</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-2">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const isActive = i === active;
          const isDone = i < active;
          return (
            <div key={step.label} className="relative flex flex-col items-center text-center">
              {i < STEPS.length - 1 && (
                <div
                  className={`hidden md:block absolute top-6 left-[60%] w-full h-[1px] ${
                    isDone ? "bg-sage" : "bg-border"
                  }`}
                />
              )}
              <div
                className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${
                  isActive
                    ? "bg-sage text-white"
                    : isDone
                    ? "bg-sage/20 text-sage"
                    : "bg-secondary text-ink/40"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <p className={`text-sm font-semibold mb-1 ${isActive || isDone ? "text-ink" : "text-ink/50"}`}>
                {i + 1}. {step.label}
              </p>
              <p className="text-xs text-ink/40 leading-snug max-w-[140px]">{step.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}