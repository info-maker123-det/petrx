import React from "react";
import { motion } from "framer-motion";
import { Search, FileText, Package } from "lucide-react";

const STEPS = [
  {
    icon: Search,
    step: "01",
    title: "Find Your Medication",
    desc: "Search our full pharmacy catalog for your pet's prescription or over-the-counter medications.",
  },
  {
    icon: FileText,
    step: "02",
    title: "Submit Your Prescription",
    desc: "Upload your vet's prescription or let us contact your veterinarian directly for approval.",
  },
  {
    icon: Package,
    step: "03",
    title: "Delivered to Your Door",
    desc: "Your pet's medications arrive safely at your home — with free shipping on orders over $49.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 md:py-36 bg-white">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <p className="text-sage text-sm font-semibold tracking-widest uppercase mb-3">Process</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-ink mb-4">
            How It Works
          </h2>
          <p className="text-ink/50 max-w-md mx-auto text-base">
            Three simple steps to get your pet's medications delivered on schedule.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {STEPS.map(({ icon: Icon, step, title, desc }, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative text-center px-6"
            >
              {/* Connector Line (desktop) */}
              {i < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-px bg-border" />
              )}

              {/* Icon */}
              <div className="w-20 h-20 rounded-[24px] bg-sage/8 border-[0.5px] border-sage/20 flex items-center justify-center mx-auto mb-6">
                <Icon className="w-8 h-8 text-sage" />
              </div>

              {/* Step Number */}
              <p className="text-sage text-xs font-bold tracking-widest uppercase mb-2">{step}</p>

              <h3 className="font-display text-xl text-ink mb-3">{title}</h3>
              <p className="text-ink/50 text-sm leading-relaxed max-w-xs mx-auto">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}