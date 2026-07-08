import React from "react";
import { Search, Shield, Truck, Clock } from "lucide-react";
import { motion } from "framer-motion";

const HERO_IMAGE = "https://media.base44.com/images/public/6a4dc0dbd2a6ae29bc765da4/d1e54be26_generated_e50bc09d.png";

const TRUST_BADGES = [
  { icon: Shield, label: "Licensed Pharmacy" },
  { icon: Truck, label: "Free Shipping $49+" },
  { icon: Clock, label: "Same-Day Processing" },
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
        <div className="absolute inset-0 bg-gradient-to-r from-[#FDFDFB]/95 via-[#FDFDFB]/70 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 md:px-8">
        <div className="py-24 md:py-36 lg:py-44 max-w-2xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-sage/10 text-sage text-sm font-medium rounded-full mb-8"
          >
            <Shield className="w-3.5 h-3.5" />
            Family-Owned & Operated Since 2022
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl text-ink leading-[1.1] mb-6"
          >
            Your Pet's Health,{" "}
            <span className="text-sage italic">Delivered</span> with Care
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg text-ink/60 mb-10 max-w-lg leading-relaxed"
          >
            Prescription medications, flea & tick protection, and supplements
            delivered to your door. Trusted by thousands of pet parents across California.
          </motion.p>

          {/* Monolithic Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative max-w-xl mb-12"
          >
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-sage" />
              <input
                type="text"
                placeholder="Search for medications, supplements, or brands..."
                className="w-full pl-14 pr-36 py-4 md:py-5 bg-white rounded-full border-[0.5px] border-border shadow-lg shadow-black/[0.04] text-base focus:outline-none focus:border-sage focus:shadow-sage/10 transition-all placeholder:text-muted-foreground"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 md:py-3 bg-sage text-white rounded-full text-sm font-semibold hover:bg-[#3d5a66] transition-colors">
                Search
              </button>
            </div>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex flex-wrap items-center gap-6 md:gap-8"
          >
            {TRUST_BADGES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2.5 text-ink/50">
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