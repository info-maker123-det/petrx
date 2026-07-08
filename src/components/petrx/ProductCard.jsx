import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "@/lib/cartContext";
import { Star, ShoppingBag, Check, PawPrint } from "lucide-react";

const enhanceImage = (url) => {
  if (!url) return url;
  // Pull the highest-quality version available from Shopify's CDN
  if (url.includes("cdn.shopify.com")) {
    return url + (url.includes("?") ? "&width=1200" : "?width=1200");
  }
  return url;
};

export default function ProductCard({ product, index = 0 }) {
  const { addItem } = useCart();
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

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
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: (index % 12) * 0.05 }}
    >
      <Link
        to={`/product/${product.id}`}
        className="group cellular-card overflow-hidden cursor-pointer relative block"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="relative aspect-square bg-secondary overflow-hidden">
          {product.image_url && !imgError ? (
            <img
              src={enhanceImage(product.image_url)}
              alt={product.name}
              loading="lazy"
              onError={() => setImgError(true)}
              className="w-full h-full object-contain p-8 transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-[24px] bg-sage/10 flex items-center justify-center">
                <PawPrint className="w-10 h-10 text-sage/30" />
              </div>
            </div>
          )}

          {product.requires_prescription && (
            <div className="absolute top-4 left-4 px-3 py-1 bg-ochre/10 text-ochre text-xs font-semibold rounded-full">
              Rx Required
            </div>
          )}

          <div className="absolute top-4 right-4 px-3 py-1 bg-sage/10 text-sage text-xs font-medium rounded-full">
            {product.category}
          </div>

          <motion.div
            initial={false}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-[#1A1C1E]/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 pointer-events-none"
          >
            <p className="text-white/50 text-xs uppercase tracking-wider mb-3">Overview</p>
            <p className="text-white/90 text-sm leading-relaxed text-center line-clamp-4">
              {product.description || `${product.brand} · ${product.category}`}
            </p>
            <div className="mt-4 pt-4 border-t border-white/10 w-full flex justify-between text-xs">
              <span className="text-white/50">For</span>
              <span className="text-white font-medium capitalize">{product.pet_type}</span>
            </div>
          </motion.div>
        </div>

        <div className="p-5 md:p-6">
          <p className="text-sage text-xs font-semibold tracking-wider uppercase mb-2">{product.brand}</p>
          <h3 className="font-display text-lg text-ink mb-3 leading-tight line-clamp-2">{product.name}</h3>

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

          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-ink">From ${Number(product.price).toFixed(2)}</p>
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