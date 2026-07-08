import React from "react";
import { Link } from "react-router-dom";
import { Search, ShieldCheck, ArrowRight, FileText, Star } from "lucide-react";
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

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative max-w-xl mb-8"
          >
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-sage" />
              <input
                type="text"
                placeholder="Search medications, supplements, or brands..."
                className="w-full pl-14 pr-36 py-4 md:py-5 bg-white rounded-2xl border border-border shadow-xl shadow-black/[0.03] text-base focus:outline-none focus:border-sage focus:shadow-sage/5 transition-all placeholder:text-muted-foreground"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 md:py-3 bg-sage text-white rounded-xl text-sm font-semibold hover:bg-[#3d5a66] transition-colors">
                Search
              </button>
            </div>
          </motion.div>

          {/* Secondary CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-wrap items-center gap-4 mb-12"
          >
            <Link to="/prescription" className="inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-sage transition-colors group">
              Submit a prescription
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <span className="text-ink/20">|</span>
            <Link to="/shop" className="inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-sage transition-colors">
              Browse the catalog
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