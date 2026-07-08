import React from "react";
import { motion } from "framer-motion";
import { Heart, ShieldCheck, Users, Truck, Award, Stethoscope } from "lucide-react";

const REASONS = [
  { icon: Users, title: "Family-Owned", desc: "We're a family-owned pharmacy, not a faceless corporation. Every order is handled with personal care." },
  { icon: ShieldCheck, title: "Licensed & Accredited", desc: "Fully licensed pharmacy meeting all state and federal regulations for pet medication dispensing." },
  { icon: Stethoscope, title: "Pharmacist On Staff", desc: "Our licensed pharmacists review every prescription to ensure your pet's safety." },
  { icon: Truck, title: "Free Shipping $49+", desc: "Fast, temperature-controlled shipping on all orders over $49 — delivered right to your door." },
  { icon: Award, title: "FDA-Approved Only", desc: "We carry only FDA-approved medications and EPA-registered products. No compromises on quality." },
  { icon: Heart, title: "Compassionate Service", desc: "We understand the stress of a sick pet. Our team provides guidance and support every step of the way." },
];

export default function WhyPetRx() {
  return (
    <section id="why-petrx" className="py-24 md:py-36 bg-[#1A1C1E] relative overflow-hidden">
      {/* Subtle pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-sage blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-sage blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <p className="text-sage text-sm font-semibold tracking-widest uppercase mb-3">Our Promise</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-white mb-4">
            Why Pet Parents Choose PetRx
          </h2>
          <p className="text-white/40 max-w-md mx-auto text-base">
            Trusted by thousands of families for pharmaceutical-grade pet care.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REASONS.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="p-8 rounded-[32px] border-[0.5px] border-white/10 bg-white/[0.03] backdrop-blur-sm hover:bg-white/[0.06] transition-colors"
            >
              <div className="w-12 h-12 rounded-2xl bg-sage/15 flex items-center justify-center mb-5">
                <Icon className="w-5 h-5 text-sage" />
              </div>
              <h3 className="font-display text-xl text-white mb-2">{title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}