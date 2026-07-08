import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, ArrowRight, FileText, Star, Stethoscope } from "lucide-react";
import { motion } from "framer-motion";

const HERO_IMAGE = "https://media.base44.com/images/public/6a4dc0dbd2a6ae29bc765da4/d1e54be26_generated_e50bc09d.png";

const TRUST_BADGES = [
  { icon: ShieldCheck, label: "Licensed in 50 States" },
  { icon: FileText, label: "Pharmacist-Reviewed Rx" },
  { icon: Star, label: "4.9/5 · 12,000+ Reviews" },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-porcelain">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={HERO_IMAGE}
          alt="A serene moment between a golden retriever and its owner in warm morning light"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#FDFDFB]/97 via-[#FDFDFB]/75 to-[#FDFDFB]/20" />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 md:px-8">
        <div className="py-20 md:py-32 lg:py-40 max-w-2xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/80 backdrop-blur-sm border border-sage/20 text-sage text-sm font-medium rounded-full mb-8"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Licensed Online Pet Pharmacy
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-4xl md:text-5xl lg:text-[3.75rem] text-ink leading-[1.08] mb-6"
          >
            Pet medications,{" "}
            <span className="text-sage italic">handled</span> with clinical precision
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg text-ink/60 mb-10 max-w-lg leading-relaxed"
          >
            Prescription management, pharmacist consultations, and doorstep delivery —
            all on one secure platform built for your pet's health.
          </motion.p>

          {/* Primary CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 mb-12"
          >
            <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-4 bg-sage text-white rounded-2xl text-base font-semibold hover:bg-[#3d5a66] transition-colors shadow-lg shadow-sage/10">
              Browse the catalog
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/prescription" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-ink rounded-2xl text-base font-semibold border border-border hover:border-sage hover:text-sage transition-colors">
              Submit a prescription
            </Link>
            <Link to="/advisor" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-ink rounded-2xl text-base font-semibold border border-border hover:border-sage hover:text-sage transition-colors">
              <Stethoscope className="w-4 h-4" /> Talk to the Advisor
            </Link>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex flex-wrap items-center gap-6 md:gap-8"
          >
            {TRUST_BADGES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2.5 text-ink/60">
                <Icon className="w-4 h-4 text-sage" />
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}