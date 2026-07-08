import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useCart } from "@/lib/cartContext";
import {
  ShieldCheck,
  Stethoscope,
  Star,
  ShoppingBag,
  RefreshCw,
  ArrowLeft,
  Check,
  Truck,
} from "lucide-react";
import SimilarProducts from "@/components/petrx/SimilarProducts";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { ShieldAlert, Info, FileText, AlertTriangle } from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoship, setAutoship] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [weight, setWeight] = useState(50);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    base44.entities.Product
      .get(id)
      .then((p) => setProduct(p))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="py-40 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-secondary border-t-sage rounded-full animate-spin" />
      </div>
    );

  if (!product)
    return (
      <div className="py-40 text-center">
        <p className="font-display text-2xl text-ink mb-2">Product not found</p>
        <Link to="/" className="text-sage text-sm hover:underline">
          Back to products
        </Link>
      </div>
    );

  const unitPrice = autoship ? product.price * 0.95 : product.price;
  const savings = (product.price - unitPrice).toFixed(2);
  const sizeRec =
    weight < 25 ? "Small — under 25 lbs" : weight < 60 ? "Medium — 25–60 lbs" : "Large — 60+ lbs";

  const handleAdd = () => {
    addItem(product, quantity, autoship);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="py-10 md:py-16 bg-porcelain">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-ink/50 hover:text-ink text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Sticky Gallery */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="cellular-card overflow-hidden aspect-square bg-gradient-to-br from-secondary to-white flex items-center justify-center">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-24 h-24 rounded-[24px] bg-sage/10 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-sage/20" />
                </div>
              )}
            </div>
          </div>

          {/* Info Clusters */}
          <div>
            <Link to={`/shop?brand=${encodeURIComponent(product.brand)}`} className="block text-sage text-sm font-semibold tracking-wider uppercase mb-2 hover:underline">
              {product.brand}
            </Link>
            <h1 className="font-display text-3xl md:text-4xl text-ink mb-4 leading-tight">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(product.rating || 0) ? "fill-ochre text-ochre" : "text-border"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-ink/40">
                {product.rating} ({product.review_count} reviews)
              </span>
            </div>

            {/* Transparency Tier */}
            <div className="flex flex-wrap gap-3 mb-6">
              {product.requires_prescription && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-ochre/10 text-ochre rounded-full text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" /> Rx Required
                </div>
              )}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-sage/10 text-sage rounded-full text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> FDA-Approved
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-sage/10 text-sage rounded-full text-xs font-semibold">
                <Stethoscope className="w-3.5 h-3.5" /> Vet Recommended
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-sage/10 text-sage rounded-full text-xs font-semibold">
                <Truck className="w-3.5 h-3.5" /> Free Ship $49+
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-8">
              <span className="font-display text-4xl text-ink">${unitPrice.toFixed(2)}</span>
              {autoship && <span className="text-ink/40 line-through text-lg">${product.price.toFixed(2)}</span>}
              {autoship && (
                <span className="text-sage text-sm font-semibold">Save ${savings} with AutoShip</span>
              )}
            </div>

            {/* Subscription Engine */}
            {product.autoship_eligible && (
              <div className="cellular-card p-5 mb-5">
                <p className="text-xs text-ink/40 uppercase tracking-wider font-semibold mb-3">Delivery Option</p>
                <div className="space-y-2.5">
                  <button
                    onClick={() => setAutoship(true)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border-[0.5px] transition-all text-left ${
                      autoship ? "border-sage bg-sage/5" : "border-border"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${autoship ? "border-sage" : "border-border"}`}>
                        {autoship && <div className="w-2.5 h-2.5 rounded-full bg-sage" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-ink flex items-center gap-2">
                          <RefreshCw className="w-3.5 h-3.5 text-sage" /> AutoShip
                        </p>
                        <p className="text-xs text-ink/40">Save 5% · Cancel anytime</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-sage">${(product.price * 0.95).toFixed(2)}</span>
                  </button>
                  <button
                    onClick={() => setAutoship(false)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border-[0.5px] transition-all text-left ${
                      !autoship ? "border-sage bg-sage/5" : "border-border"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${!autoship ? "border-sage" : "border-border"}`}>
                        {!autoship && <div className="w-2.5 h-2.5 rounded-full bg-sage" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-ink">One-Time Purchase</p>
                        <p className="text-xs text-ink/40">Ships once</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-ink">${product.price.toFixed(2)}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Dosage Calculator */}
            <div className="cellular-card p-5 mb-5">
              <p className="text-xs text-ink/40 uppercase tracking-wider font-semibold mb-3">Dosage Calculator</p>
              <p className="text-sm text-ink/60 mb-3">Enter your pet's weight to find the right size</p>
              <input
                type="range"
                min="5"
                max="120"
                value={weight}
                onChange={(e) => setWeight(parseInt(e.target.value))}
                className="w-full accent-[#4F6D7A] mb-3"
              />
              <div className="flex items-center justify-between">
                <span className="text-sm text-ink/50">{weight} lbs</span>
                <div className="px-3 py-1.5 bg-sage/10 text-sage rounded-full text-sm font-semibold">
                  Recommended: {sizeRec}
                </div>
              </div>
            </div>

            {/* Qty + Add to Cart */}
            <div className="flex gap-3 mb-8">
              <div className="flex items-center gap-3 px-4 cellular-card">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-ink/50 hover:text-ink">
                  −
                </button>
                <span className="font-semibold w-6 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="text-ink/50 hover:text-ink">
                  +
                </button>
              </div>
              <button
                onClick={handleAdd}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-full font-semibold text-sm transition-all ${
                  added ? "bg-green-600 text-white" : "bg-sage text-white hover:bg-[#3d5a66]"
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" /> Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> Add to Cart
                  </>
                )}
              </button>
            </div>

            {/* Collapsible info sections */}
            <div className="diagnostic-line pt-8">
              <Accordion type="single" collapsible defaultValue="details" className="w-full">
                <AccordionItem value="details" className="border-border">
                  <AccordionTrigger className="text-ink font-display text-lg hover:no-underline">
                    <span className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-sage" /> Product Details
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-ink/60 text-sm leading-relaxed">
                    <p className="mb-4">{product.description}</p>
                    {product.usage && (
                      <div className="p-4 bg-sage/5 rounded-2xl">
                        <p className="text-ink/40 text-xs uppercase tracking-wider mb-1">Indications / Usage</p>
                        <p className="text-ink text-sm font-medium leading-relaxed">{product.usage}</p>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="safety" className="border-border">
                  <AccordionTrigger className="text-ink font-display text-lg hover:no-underline">
                    <span className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-ochre" /> Safety Info
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-ink/60 text-sm leading-relaxed space-y-3">
                    {product.requires_prescription ? (
                      <p>
                        <strong className="text-ink">Prescription required.</strong> This medication requires a valid
                        prescription from a licensed veterinarian. Our pharmacists will verify your prescription before
                        dispensing. Do not administer without veterinary supervision.
                      </p>
                    ) : (
                      <p>
                        <strong className="text-ink">Over-the-counter supplement.</strong> For animal use only. Keep out
                        of reach of children and other animals. In case of accidental overdose, contact a health
                        professional immediately.
                      </p>
                    )}
                    <p>
                      <strong className="text-ink">Warnings:</strong> For use in animals only. Not for human use. Keep
                      out of reach of children. Do not use if product appears tampered with or seal is broken. Store at
                      controlled room temperature unless otherwise directed.
                    </p>
                    <p>
                      <strong className="text-ink">Cautions:</strong> If your pet experiences any adverse reactions,
                      discontinue use and consult your veterinarian. Always inform your veterinarian of any other
                      medications your pet is taking before starting a new treatment.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="side-effects" className="border-border">
                  <AccordionTrigger className="text-ink font-display text-lg hover:no-underline">
                    <span className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-ochre" /> Side Effects
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-ink/60 text-sm leading-relaxed space-y-3">
                    {product.side_effects ? (
                      <p>{product.side_effects}</p>
                    ) : product.requires_prescription ? (
                      <>
                        <p>
                          <strong className="text-ink">Possible side effects may include:</strong> gastrointestinal
                          upset (vomiting, diarrhea, decreased appetite), lethargy, or changes in behavior. These are
                          not all possible side effects.
                        </p>
                        <p>
                          <strong className="text-ink">Serious reactions:</strong> Stop use and contact your
                          veterinarian immediately if you observe signs of allergic reaction (hives, facial swelling,
                          difficulty breathing), persistent vomiting or diarrhea, or any other unusual symptoms.
                        </p>
                        <p>
                          For a complete list of side effects, refer to the product label or consult your veterinarian.
                          Report any adverse reactions to your vet and to the manufacturer.
                        </p>
                      </>
                    ) : (
                      <p>
                        Side effects are rare with this supplement. Mild digestive upset may occur when first
                        introduced. If you notice any unusual symptoms or allergic reactions, discontinue use and
                        consult your veterinarian.
                      </p>
                    )}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="additional" className="border-border">
                  <AccordionTrigger className="text-ink font-display text-lg hover:no-underline">
                    <span className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-sage" /> Additional Info
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-ink/40 text-xs uppercase tracking-wider mb-1">Active Ingredient</p>
                        <p className="text-ink font-medium">{product.active_ingredient || "—"}</p>
                      </div>
                      <div>
                        <p className="text-ink/40 text-xs uppercase tracking-wider mb-1">Dosage Type</p>
                        <p className="text-ink font-medium">{product.dosage_type || "—"}</p>
                      </div>
                      <div>
                        <p className="text-ink/40 text-xs uppercase tracking-wider mb-1">Weight Class</p>
                        <p className="text-ink font-medium">{product.weight_class || "—"}</p>
                      </div>
                      <div>
                        <p className="text-ink/40 text-xs uppercase tracking-wider mb-1">Brand</p>
                        <Link to={`/shop?brand=${encodeURIComponent(product.brand)}`} className="text-ink font-medium hover:underline">{product.brand || "—"}</Link>
                      </div>
                      <div>
                        <p className="text-ink/40 text-xs uppercase tracking-wider mb-1">Category</p>
                        <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="text-ink font-medium hover:underline">{product.category || "—"}</Link>
                      </div>
                      <div>
                        <p className="text-ink/40 text-xs uppercase tracking-wider mb-1">For</p>
                        <Link to={`/shop?pet=${product.pet_type}`} className="text-ink font-medium capitalize hover:underline">{product.pet_type || "—"}</Link>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>

        <SimilarProducts product={product} />
      </div>
    </div>
  );
}