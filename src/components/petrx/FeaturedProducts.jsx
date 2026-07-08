import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star, ShoppingBag, Info, ArrowRight } from "lucide-react";

const PRODUCTS = [
  {
    name: "Vetmedin Chewable Tablets",
    brand: "Boehringer Ingelheim",
    price: "$71.24",
    priceRange: "$71 – $166",
    badge: "Rx Required",
    rating: 4.9,
    reviews: 312,
    ingredient: "Pimobendan",
    weightClass: "All Sizes",
    type: "Chewable Tablet",
    category: "Heart Health",
  },
  {
    name: "Apoquel Tablets for Dogs",
    brand: "Zoetis",
    price: "$3.19",
    priceRange: "$3 – $558",
    badge: "Rx Required",
    rating: 4.8,
    reviews: 489,
    ingredient: "Oclacitinib",
    weightClass: "All Sizes",
    type: "Tablet",
    category: "Allergy Relief",
  },
  {
    name: "NexGard Soft Chews",
    brand: "Boehringer Ingelheim",
    price: "$88.67",
    priceRange: "$89 – $169",
    badge: "Rx Required",
    rating: 4.9,
    reviews: 627,
    ingredient: "Afoxolaner",
    weightClass: "4–10 lbs+",
    type: "Soft Chew",
    category: "Flea & Tick",
  },
  {
    name: "Simparica Trio Chewable",
    brand: "Zoetis",
    price: "$189.99",
    priceRange: "$190 – $221",
    badge: "Rx Required",
    rating: 4.7,
    reviews: 284,
    ingredient: "Sarolaner + Moxidectin",
    weightClass: "2.8–5.5 lbs+",
    type: "Chewable",
    category: "Flea, Tick & Heartworm",
  },
  {
    name: "Galliprant Tablets",
    brand: "Elanco",
    price: "$47.08",
    priceRange: "$47 – $331",
    badge: "Rx Required",
    rating: 4.8,
    reviews: 198,
    ingredient: "Grapiprant",
    weightClass: "All Sizes",
    type: "Tablet",
    category: "Joint & Pain",
  },
  {
    name: "Carprofen Caplets",
    brand: "Generic",
    price: "$0.33",
    priceRange: "$0.33 – $115",
    badge: "Rx Required",
    rating: 4.6,
    reviews: 153,
    ingredient: "Carprofen",
    weightClass: "All Sizes",
    type: "Caplet",
    category: "Pain & Inflammation",
  },
];

function ProductCard({ product, index }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group cellular-card overflow-hidden cursor-pointer relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Product Image Area */}
      <div className="relative aspect-square bg-gradient-to-br from-secondary to-white p-8 flex items-center justify-center overflow-hidden">
        {/* Abstract pill/medication visual */}
        <div className="w-24 h-24 rounded-[24px] bg-sage/10 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-sage/20" />
        </div>

        {/* Badge */}
        <div className="absolute top-4 left-4 px-3 py-1 bg-ochre/10 text-ochre text-xs font-semibold rounded-full">
          {product.badge}
        </div>

        {/* Category */}
        <div className="absolute top-4 right-4 px-3 py-1 bg-sage/10 text-sage text-xs font-medium rounded-full">
          {product.category}
        </div>

        {/* Hover Fast-Fact Overlay */}
        <motion.div
          initial={false}
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 10 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 bg-[#1A1C1E]/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 pointer-events-none"
        >
          <p className="text-white/50 text-xs uppercase tracking-wider mb-4">Quick Facts</p>
          <div className="space-y-3 w-full max-w-[200px]">
            <div className="flex justify-between">
              <span className="text-white/50 text-sm">Active</span>
              <span className="text-white text-sm font-medium">{product.ingredient}</span>
            </div>
            <div className="h-px bg-white/10" />
            <div className="flex justify-between">
              <span className="text-white/50 text-sm">Weight</span>
              <span className="text-white text-sm font-medium">{product.weightClass}</span>
            </div>
            <div className="h-px bg-white/10" />
            <div className="flex justify-between">
              <span className="text-white/50 text-sm">Type</span>
              <span className="text-white text-sm font-medium">{product.type}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Product Info */}
      <div className="p-5 md:p-6">
        <p className="text-sage text-xs font-semibold tracking-wider uppercase mb-2">{product.brand}</p>
        <h3 className="font-display text-lg text-ink mb-3 leading-tight">{product.name}</h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${i < Math.floor(product.rating) ? "fill-ochre text-ochre" : "text-border"}`}
              />
            ))}
          </div>
          <span className="text-xs text-ink/40">{product.rating} ({product.reviews})</span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold text-ink">From {product.price}</p>
            <p className="text-xs text-ink/40">{product.priceRange}</p>
          </div>
          <button className="w-10 h-10 rounded-full bg-sage text-white flex items-center justify-center hover:bg-[#3d5a66] transition-colors">
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function FeaturedProducts() {
  return (
    <section id="products" className="py-24 md:py-36 bg-white">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16">
          <div>
            <p className="text-sage text-sm font-semibold tracking-widest uppercase mb-3">Pharmacy</p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-ink">
              Top Selling Products
            </h2>
          </div>
          <a href="#products" className="inline-flex items-center gap-2 text-sage text-sm font-semibold hover:gap-3 transition-all">
            View All Products <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCTS.map((product, i) => (
            <ProductCard key={product.name} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}