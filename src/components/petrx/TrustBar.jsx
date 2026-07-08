import React from "react";
import { BadgeCheck, ShieldCheck, Lock, Building2 } from "lucide-react";

const CREDENTIALS = [
  { icon: BadgeCheck, label: "NABP Accredited" },
  { icon: ShieldCheck, label: "VIPPS Certified Pharmacy" },
  { icon: Lock, label: "HIPAA-Secure Platform" },
  { icon: Building2, label: "CA Board of Pharmacy" },
];

export default function TrustBar() {
  return (
    <section className="border-y border-border bg-white">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-5 md:py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {CREDENTIALS.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2.5 justify-center md:justify-start">
              <Icon className="w-4 h-4 md:w-5 md:h-5 text-sage flex-shrink-0" />
              <span className="text-xs md:text-sm font-medium text-ink/60 tracking-wide">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}