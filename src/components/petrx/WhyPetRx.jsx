import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Stethoscope, Lock, Truck, BadgeCheck, Heart } from "lucide-react";

const REASONS = [
  { icon: ShieldCheck, title: "Licensed & Accredited", desc: "Nationwide licensed pharmacy, NABP-accredited and compliant with all state and federal regulations for pet medication dispensing." },
  { icon: Stethoscope, title: "Board-Certified Pharmacists", desc: "Every prescription is reviewed by a licensed pharmacist before it ships — ensuring safety, accuracy, and the right dosage for your pet." },
  { icon: Lock, title: "Secure & Compliant", desc: "Our platform is HIPAA-compliant and encrypted end to end. Your pet's health data and your information stay private." },
  { icon: Truck, title: "Fast, Free Shipping", desc: "Temperature-controlled delivery on all orders over $49, shipped directly from our California pharmacy to your door." },
  { icon: BadgeCheck, title: "FDA-Approved Medications", desc: "We carry only FDA-approved medications and EPA-registered products. No compromises on quality or sourcing." },
  { icon: Heart, title: "Real People, Real Care", desc: "Talk to a pharmacist anytime. We understand the stress of a sick pet, and our team is here with guidance and support every step of the way." },
];

export default function WhyPetRx() {
  return (
    <section id="why-petrx" className="py-14 md:py-36 bg-[#1A1C1E] relative overflow-hidden">
      {/* Subtle pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-sage blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-sage blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-20">
          <p className="text-sage text-sm font-semibold tracking-widest uppercase mb-3">Why Families Trust Us</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-white mb-4">
            A pharmacy built on trust
          </h2>
          <p className="text-white/40 max-w-md mx-auto text-base">
            Clinical-grade infrastructure with the personal care your pet deserves.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {REASONS.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="p-5 md:p-8 rounded-[24px] md:rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-sm hover:bg-white/[0.06] transition-colors"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-sage/15 flex items-center justify-center mb-4 md:mb-5">
                <Icon className="w-4 h-4 md:w-5 md:h-5 text-sage" />
              </div>
              <h3 className="font-display text-base md:text-xl text-white mb-2">{title}</h3>
              <p className="text-white/40 text-xs md:text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}