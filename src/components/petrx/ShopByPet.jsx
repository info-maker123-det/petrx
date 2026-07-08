import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const DOG_IMG = "https://media.base44.com/images/public/6a4dc0dbd2a6ae29bc765da4/f7f41c7ea_generated_e9c1e8b0.png";
const CAT_IMG = "https://media.base44.com/images/public/6a4dc0dbd2a6ae29bc765da4/dfd450f1f_generated_18a3246a.png";
const HORSE_IMG = "https://media.base44.com/images/public/6a4dc0dbd2a6ae29bc765da4/6c813bc05_generated_880758e4.png";

const CATEGORIES = [
  { name: "Dogs", petKey: "dog", tagline: "Medications, supplements & preventatives", image: DOG_IMG, count: "200+ Products" },
  { name: "Cats", petKey: "cat", tagline: "Feline health & wellness essentials", image: CAT_IMG, count: "150+ Products" },
  { name: "Horses", petKey: "horse", tagline: "Equine supplements & care", image: HORSE_IMG, count: "80+ Products" },
];

export default function ShopByPet() {
  const navigate = useNavigate();
  return (
    <section id="shop-by-pet" className="py-24 md:py-36 bg-porcelain">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16">
          <div>
            <p className="text-sage text-sm font-semibold tracking-widest uppercase mb-3">Browse</p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-ink">
              Shop by Pet
            </h2>
          </div>
          <p className="text-ink/50 max-w-sm text-base">
            Curated pharmaceutical collections for every member of your family.
          </p>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CATEGORIES.map((cat, i) => (
            <motion.a
              key={cat.name}
              onClick={() => navigate(`/shop?pet=${cat.petKey}`)}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group relative cellular-card overflow-hidden cursor-pointer"
            >
              {/* Image */}
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={cat.image}
                  alt={`${cat.name} pharmacy category`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1C1E]/80 via-transparent to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-white/60 text-xs font-medium tracking-wider uppercase mb-1">{cat.count}</p>
                    <h3 className="font-display text-2xl md:text-3xl text-white mb-1">{cat.name}</h3>
                    <p className="text-white/60 text-sm">{cat.tagline}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-sage transition-colors duration-300">
                    <ArrowUpRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}