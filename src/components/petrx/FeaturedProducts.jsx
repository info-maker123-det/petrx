import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useCart } from "@/lib/cartContext";
import { Star, ShoppingBag, ArrowRight, Check } from "lucide-react";

function ProductCard({ product, index }) {
  const { addItem } = useCart();
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1, false);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Link
        to={`/product/${product.id}`}
        className="group cellular-card overflow-hidden cursor-pointer relative block"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Product Image Area */}
        <div className="relative aspect-square bg-gradient-to-br from-secondary to-white p-8 flex items-center justify-center overflow-hidden">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover absolute inset-0" />
          ) : (
            <div className="w-24 h-24 rounded-[24px] bg-sage/10 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-sage/20" />
            </div>
          )}

          {/* Badge */}
          {product.requires_prescription && (
            <div className="absolute top-4 left-4 px-3 py-1 bg-ochre/10 text-ochre text-xs font-semibold rounded-full">
              Rx Required
            </div>
          )}

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
                <span className="text-white text-sm font-medium">{product.active_ingredient}</span>
              </div>
              <div className="h-px bg-white/10" />
              <div className="flex justify-between">
                <span className="text-white/50 text-sm">Weight</span>
                <span className="text-white text-sm font-medium">{product.weight_class}</span>
              </div>
              <div className="h-px bg-white/10" />
              <div className="flex justify-between">
                <span className="text-white/50 text-sm">Type</span>
                <span className="text-white text-sm font-medium">{product.dosage_type}</span>
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
                  className={`w-3 h-3 ${i < Math.floor(product.rating || 0) ? "fill-ochre text-ochre" : "text-border"}`}
                />
              ))}
            </div>
            <span className="text-xs text-ink/40">{product.rating} ({product.review_count})</span>
          </div>

          {/* Price + CTA */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-ink">From ${product.price}</p>
              <p className="text-xs text-ink/40">{product.price_range}</p>
            </div>
            <button
              onClick={handleAdd}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                added ? "bg-green-600 text-white" : "bg-sage text-white hover:bg-[#3d5a66]"
              }`}
            >
              {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Product
      .filter({ featured: true }, "-rating", 8)
      .then((data) => setProducts(data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

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
          <Link to="/" className="inline-flex items-center gap-2 text-sage text-sm font-semibold hover:gap-3 transition-all">
            View All Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-secondary border-t-sage rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-ink/40 text-sm">Products are being added to our pharmacy. Check back shortly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}