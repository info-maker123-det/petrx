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

function getOption1Label(optionName, values) {
  const sample = (values[0] || "").toLowerCase();
  if (/lb|kg/.test(sample)) return "Select Your Pet's Weight";
  if (/mg|mcg|ml/.test(sample)) return "Select Strength";
  return `Select ${optionName || "Size"}`;
}

function getOption2Label(optionName, values) {
  const sample = (values[0] || "").toLowerCase();
  if (/month/.test(sample)) return "Supply Size";
  if (/tablet|ct|count|cap|chew|dose/.test(sample)) return "Select Quantity";
  return `Select ${optionName || "Count"}`;
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoship, setAutoship] = useState(true);
  const [selectedOption1, setSelectedOption1] = useState(null);
  const [selectedOption2, setSelectedOption2] = useState(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    base44.entities.Product
      .get(id)
      .then((p) => {
        setProduct(p);
        if (p?.variants?.length > 0) {
          const o1vals = [...new Set(p.variants.map((v) => v.option1))].filter(Boolean);
          const o2vals = [...new Set(p.variants.map((v) => v.option2))].filter(Boolean);
          if (o1vals.length > 0) setSelectedOption1(o1vals[0]);
          if (o2vals.length > 0) setSelectedOption2(o2vals[0]);
        }
      })
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

  // Generic variant data — works for weight-dosed, strength-dosed, and count-based products
  const variants = product.variants || [];
  const hasVariants = variants.length > 0;

  const option1Values = hasVariants
    ? [...new Set(variants.map((v) => v.option1))].filter(Boolean)
    : [];
  const option2Values = hasVariants
    ? [...new Set(variants.map((v) => v.option2))].filter(Boolean)
    : [];

  const hasOption1Selection = option1Values.length > 1;
  const hasOption2Selection = option2Values.length > 1;

  const selectedVariant = hasVariants
    ? variants.find(
        (v) =>
          (!hasOption1Selection || v.option1 === selectedOption1) &&
          (!hasOption2Selection || v.option2 === selectedOption2)
      ) || variants[0]
    : null;

  const basePrice = hasVariants && selectedVariant ? selectedVariant.price : product.price;
  const totalPrice = autoship ? basePrice * 0.95 : basePrice;
  const autoshipSavings = basePrice - basePrice * 0.95;

  const handleAdd = () => {
    addItem(
      { ...product, selected_variant: selectedVariant },
      1,
      autoship
    );
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
            <div className="flex items-baseline gap-3 mb-2 flex-wrap">
              <span className="font-display text-4xl text-ink">${totalPrice.toFixed(2)}</span>
              {autoship && (
                <span className="text-ink/40 line-through text-lg">${basePrice.toFixed(2)}</span>
              )}
            </div>
            {autoship ? (
              <p className="text-sage text-sm font-semibold mb-8">Save ${autoshipSavings.toFixed(2)} with AutoShip</p>
            ) : (
              <p className="text-ink/40 text-sm mb-8">One-time purchase</p>
            )}

            {/* Subscription Engine */}
            {product.autoship_eligible && (
              <div className="mb-5">
                <p className="text-xs text-ink/40 uppercase tracking-wider font-semibold mb-3">Delivery Option</p>
                <div className="space-y-2.5">
                  <button
                    onClick={() => setAutoship(true)}
                    className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all text-left ${
                      autoship ? "border-sage bg-sage/5 shadow-sm" : "border-border hover:border-sage/40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${autoship ? "border-sage" : "border-border"}`}>
                        {autoship && <div className="w-2.5 h-2.5 rounded-full bg-sage" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-ink flex items-center gap-2">
                          <RefreshCw className="w-3.5 h-3.5 text-sage" /> AutoShip
                          {autoship && (
                            <span className="px-2 py-0.5 bg-sage text-white rounded-full text-[10px] font-bold uppercase tracking-wide">Recommended</span>
                          )}
                        </p>
                        <p className="text-xs text-ink/40 mt-0.5">Save 5% on every refill · Cancel anytime</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-sage">${(basePrice * 0.95).toFixed(2)}</p>
                      <p className="text-xs text-ink/40 line-through">${basePrice.toFixed(2)}</p>
                    </div>
                  </button>
                  <button
                    onClick={() => setAutoship(false)}
                    className={`w-full flex items-center justify-between p-5 rounded-2xl border-[0.5px] transition-all text-left ${
                      !autoship ? "border-sage bg-sage/5" : "border-border hover:border-sage/40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${!autoship ? "border-sage" : "border-border"}`}>
                        {!autoship && <div className="w-2.5 h-2.5 rounded-full bg-sage" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-ink">One-Time Purchase</p>
                        <p className="text-xs text-ink/40 mt-0.5">Ships once, no subscription</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-ink">${basePrice.toFixed(2)}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Option 1 Selector — weight, strength, or size depending on product */}
            {hasOption1Selection && (
              <div className="cellular-card p-5 mb-5">
                <p className="text-xs text-ink/40 uppercase tracking-wider font-semibold mb-3">
                  {getOption1Label(product.option1_name, option1Values)}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {option1Values.map((val) => {
                    const active = selectedOption1 === val;
                    const valVariant = variants.find(
                      (v) => v.option1 === val && (!hasOption2Selection || v.option2 === selectedOption2)
                    );
                    const valPrice = valVariant?.price || 0;
                    return (
                      <button
                        key={val}
                        onClick={() => setSelectedOption1(val)}
                        className={`flex flex-col items-center gap-1 py-4 px-2 rounded-2xl border-2 transition-all ${
                          active ? "border-sage bg-sage/5" : "border-border hover:border-sage/40"
                        }`}
                      >
                        <span className={`text-sm font-semibold ${active ? "text-sage" : "text-ink"}`}>{val}</span>
                        <span className="text-xs text-ink/40">${valPrice.toFixed(2)}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-ink/40 mt-3">
                  Not sure? Check your pet's weight or ask your vet — dosing is based on body weight.
                </p>
              </div>
            )}

            {/* Option 2 Selector — supply size, quantity, or count */}
            {hasOption2Selection && (
              <div className="mb-5">
                <p className="text-xs text-ink/40 uppercase tracking-wider font-semibold mb-3">
                  {getOption2Label(product.option2_name, option2Values)}
                </p>
                <div className={`grid gap-2.5 grid-cols-${Math.min(option2Values.length, 4)}`}>
                  {option2Values.map((val) => {
                    const active = selectedOption2 === val;
                    const optVariant = variants.find(
                      (v) => (!hasOption1Selection || v.option1 === selectedOption1) && v.option2 === val
                    );
                    const optPrice = optVariant?.price || 0;
                    const optAutoship = optPrice * 0.95;
                    const isBestValue = /60|6\s*month/i.test(val);
                    const isPopular = /30|3\s*month/i.test(val);
                    return (
                      <button
                        key={val}
                        onClick={() => setSelectedOption2(val)}
                        className={`flex flex-col items-center gap-1 py-4 rounded-2xl border-2 transition-all relative ${
                          active ? "border-sage bg-sage/5" : "border-border hover:border-sage/40"
                        }`}
                      >
                        {active && isBestValue && (
                          <span className="absolute -top-2 px-2 py-0.5 bg-sage text-white rounded-full text-[9px] font-bold uppercase tracking-wide">Best Value</span>
                        )}
                        {active && !isBestValue && isPopular && (
                          <span className="absolute -top-2 px-2 py-0.5 bg-sage text-white rounded-full text-[9px] font-bold uppercase tracking-wide">Most Popular</span>
                        )}
                        <span className={`text-sm font-semibold ${active ? "text-sage" : "text-ink"}`}>{val}</span>
                        <span className="text-xs text-ink/40">${optPrice.toFixed(2)}</span>
                        {autoship && (
                          <span className="text-[10px] text-sage font-medium">${optAutoship.toFixed(2)} w/ AutoShip</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <button
              onClick={handleAdd}
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-full font-semibold text-sm transition-all mb-3 ${
                added ? "bg-green-600 text-white" : "bg-sage text-white hover:bg-[#3d5a66]"
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" /> Added to Cart
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" /> Add to Cart · ${totalPrice.toFixed(2)}
                </>
              )}
            </button>

            {/* Rx Reassurance */}
            {product.requires_prescription ? (
              <div className="flex items-start gap-2.5 p-4 bg-sage/5 rounded-2xl border-[0.5px] border-sage/20 mb-8">
                <Stethoscope className="w-4 h-4 text-sage flex-shrink-0 mt-0.5" />
                <p className="text-xs text-ink/60 leading-relaxed">
                  <span className="font-semibold text-ink">Prescription approval made easy</span> — add this to your cart now and we'll contact your vet clinic to verify the prescription. No paperwork needed upfront.
                </p>
              </div>
            ) : (
              <div className="mb-8" />
            )}

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

                {product.side_effects && (
                  <AccordionItem value="side-effects" className="border-border">
                    <AccordionTrigger className="text-ink font-display text-lg hover:no-underline">
                      <span className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-ochre" /> Side Effects
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-ink/60 text-sm leading-relaxed">
                      <p>{product.side_effects}</p>
                      <p className="mt-3 text-xs text-ink/40">
                        If your pet experiences an adverse reaction, discontinue use and contact your veterinarian
                        immediately. Report side effects to the manufacturer.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                )}

                <AccordionItem value="additional" className="border-border">
                  <AccordionTrigger className="text-ink font-display text-lg hover:no-underline">
                    <span className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-sage" /> Additional Info
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-sm">
                    {product.serving_info && (
                      <div className="mb-5 p-4 bg-sage/5 rounded-2xl">
                        <p className="text-ink/40 text-xs uppercase tracking-wider mb-1">Serving Info</p>
                        <p className="text-ink text-sm font-medium leading-relaxed">{product.serving_info}</p>
                      </div>
                    )}
                    {product.directions && (
                      <div className="mb-5 p-4 bg-sage/5 rounded-2xl">
                        <p className="text-ink/40 text-xs uppercase tracking-wider mb-1">Directions</p>
                        <p className="text-ink text-sm font-medium leading-relaxed">{product.directions}</p>
                      </div>
                    )}
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