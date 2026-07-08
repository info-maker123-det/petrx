import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Check, Star, PawPrint } from "lucide-react";
import { useCart } from "@/lib/cartContext";

const enhanceImage = (url) => {
  if (!url) return url;
  if (url.includes("cdn.shopify.com")) return url + (url.includes("?") ? "&width=400" : "?width=400");
  return url;
};

export default function TopSellerCard({ product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const autoshipPrice = (Number(product.price) * 0.95).toFixed(2);

  const handleAdd = (e) => {
    e.preventDefault();
    addItem(product, 1, false);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <Link to={`/product/${product.id}`} className="group flex-shrink-0 w-[200px] cellular-card overflow-hidden block">
      <div className="relative aspect-square bg-secondary overflow-hidden">
        {product.image_url && !imgError ? (
          <img src={enhanceImage(product.image_url)} alt={product.name} loading="lazy" onError={() => setImgError(true)} className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center"><PawPrint className="w-10 h-10 text-sage/30" /></div>
        )}
        {product.requires_prescription && (
          <span className="absolute top-2 left-2 px-2 py-0.5 bg-ochre/10 text-ochre text-[10px] font-semibold rounded-full">Rx</span>
        )}
      </div>
      <div className="p-3.5">
        <p className="text-sage text-[10px] font-semibold tracking-wider uppercase mb-1 truncate">{product.brand}</p>
        <h3 className="text-sm font-medium text-ink leading-snug line-clamp-2 mb-1.5 min-h-[2.5rem]">{product.name}</h3>
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-3 h-3 fill-ochre text-ochre" />
          <span className="text-xs text-ink/40">{product.rating} ({product.review_count})</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-base font-semibold text-ink">${Number(product.price).toFixed(2)}</p>
            {product.autoship_eligible && <p className="text-[11px] text-sage">${autoshipPrice} w/ AutoShip</p>}
          </div>
          <button onClick={handleAdd} className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${added ? "bg-green-600 text-white" : "bg-sage text-white hover:bg-[#3d5a66]"}`}>
            {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </Link>
  );
}