import React from "react";
import { Upload, Stethoscope, Mail } from "lucide-react";

const METHODS = [
  {
    key: "contact_vet",
    icon: Stethoscope,
    label: "We'll Contact Your Vet",
    desc: "Provide your clinic's details and our pharmacists will reach out to verify the prescription.",
  },
  {
    key: "upload",
    icon: Upload,
    label: "Upload Prescription Now",
    desc: "Have a copy ready? Upload a photo or PDF of your vet's prescription and we'll review it.",
  },
  {
    key: "mail",
    icon: Mail,
    label: "Mail It In",
    desc: "Place your order now, then mail us the original paper prescription from your vet.",
  },
];

export default function ApprovalMethodSelector({ value, onChange }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Stethoscope className="w-5 h-5 text-sage" />
        <h2 className="font-display text-xl text-ink">How Should We Verify Your Prescription?</h2>
      </div>
      <p className="text-sm text-ink/40 mb-4">
        Choose the option that works best for you — we'll handle the rest.
      </p>
      <div className="space-y-2.5">
        {METHODS.map((m) => {
          const Icon = m.icon;
          const active = value === m.key;
          return (
            <button
              key={m.key}
              type="button"
              onClick={() => onChange(m.key)}
              className={`w-full flex items-start gap-3 p-4 rounded-2xl border-[0.5px] transition-all text-left ${
                active ? "border-sage bg-sage/5" : "border-border hover:border-sage/40"
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${active ? "border-sage" : "border-border"}`}>
                {active && <div className="w-2.5 h-2.5 rounded-full bg-sage" />}
              </div>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${active ? "bg-sage text-white" : "bg-sage/10 text-sage"}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className={`text-sm font-semibold ${active ? "text-ink" : "text-ink/70"}`}>{m.label}</p>
                <p className="text-xs text-ink/50 leading-snug mt-0.5">{m.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}