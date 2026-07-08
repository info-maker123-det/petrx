import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const REVIEWS = [
  {
    name: "Sarah M.",
    pet: "Bella — Golden Retriever",
    rating: 5,
    text: "PetRx has been a lifesaver. Bella's heart medication arrives like clockwork every month with AutoShip. The prices are significantly lower than our local pharmacy.",
  },
  {
    name: "James K.",
    pet: "Oscar — Tabby Cat",
    rating: 5,
    text: "The prescription process was seamless. They contacted my vet directly and had Oscar's medication shipped within 48 hours. Incredible service.",
  },
  {
    name: "Maria L.",
    pet: "Duke — German Shepherd",
    rating: 5,
    text: "Family-owned and it shows. When I called with questions about Duke's allergy medication, the pharmacist spent 20 minutes explaining everything. You don't get that anywhere else.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 md:py-36 bg-porcelain">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <p className="text-sage text-sm font-semibold tracking-widest uppercase mb-3">Testimonials</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-ink mb-4">
            Loved by Pet Parents
          </h2>
          <p className="text-ink/50 max-w-md mx-auto text-base">
            Real stories from real families who trust PetRx with their pet's health.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((review, i) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="cellular-card p-8 flex flex-col"
            >
              {/* Quote Icon */}
              <Quote className="w-8 h-8 text-sage/20 mb-4" />

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(review.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-ochre text-ochre" />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-ink/70 text-base leading-relaxed flex-1 mb-6">
                "{review.text}"
              </p>

              {/* Author */}
              <div className="diagnostic-line pt-5">
                <p className="text-ink font-semibold text-sm">{review.name}</p>
                <p className="text-ink/40 text-xs mt-0.5">{review.pet}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}