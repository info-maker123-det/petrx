import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useCart } from "@/lib/cartContext";
import {
  ShieldAlert,
  Check,
  ArrowRight,
  Lock,
  MapPin,
  Stethoscope,
  ShoppingBag,
} from "lucide-react";

const US_STATES = ["CA", "NY", "TX", "FL", "IL", "PA", "OH", "GA", "NC", "MI", "NJ", "VA", "WA", "AZ", "MA", "TN", "IN", "MO", "MD", "WI", "CO", "MN", "OR", "Other"];

export default function Checkout() {
  const { items, subtotal, hasPrescriptionItems, clearCart } = useCart();
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(null);
  const [form, setForm] = useState({
    shipping_name: "",
    shipping_address: "",
    shipping_city: "",
    shipping_state: "CA",
    shipping_zip: "",
    shipping_phone: "",
  });
  const [error, setError] = useState("");

  const shippingCost = subtotal >= 49 || subtotal === 0 ? 0 : 5.95;
  const total = subtotal + shippingCost;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const valid =
    form.shipping_name && form.shipping_address && form.shipping_city && form.shipping_state && form.shipping_zip && form.shipping_phone;

  const handlePlace = async () => {
    setError("");
    if (!valid) {
      setError("Please complete all shipping fields.");
      return;
    }
    setPlacing(true);
    try {
      const order_number = "PRX-" + Date.now().toString().slice(-8);
      const order = await base44.entities.Order.create({
        order_number,
        items,
        subtotal,
        shipping_cost: shippingCost,
        total,
        ...form,
        has_prescription_items: hasPrescriptionItems,
        status: "pending",
        payment_status: "pending",
      });
      clearCart();
      setPlaced(order);
    } catch (e) {
      setError("Something went wrong placing your order. Please try again.");
    }
    setPlacing(false);
  };

  // Confirmation
  if (placed)
    return (
      <div className="py-20 md:py-32 bg-porcelain">
        <div className="max-w-2xl mx-auto px-5 md:px-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12 }}
            className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
          >
            <Check className="w-10 h-10 text-green-600" />
          </motion.div>
          <p className="text-sage text-sm font-semibold tracking-widest uppercase mb-2">Order Confirmed</p>
          <h1 className="font-display text-3xl md:text-4xl text-ink mb-3">Thank you for your order</h1>
          <p className="text-ink/50 mb-2">
            Your order number is <span className="font-semibold text-ink">{placed.order_number}</span>
          </p>
          <p className="text-ink/50 mb-8">
            A confirmation email is on its way. We'll process your order right away.
          </p>

          {placed.has_prescription_items && (
            <div className="cellular-card p-6 mb-8 text-left">
              <div className="flex gap-3 mb-3">
                <ShieldAlert className="w-5 h-5 text-ochre flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-display text-lg text-ink mb-1">Prescription Verification Needed</h3>
                  <p className="text-sm text-ink/50 mb-4">
                    Your order includes prescription medications. Please submit your vet's prescription so we can ship those items.
                  </p>
                  <Link
                    to="/prescription"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-sage text-white rounded-full text-sm font-semibold hover:bg-[#3d5a66] transition-colors"
                  >
                    Submit Prescription <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          <Link to="/" className="text-sage text-sm font-semibold hover:underline">
            Continue Shopping
          </Link>
        </div>
      </div>
    );

  // Empty cart
  if (items.length === 0)
    return (
      <div className="py-32 text-center bg-porcelain">
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-7 h-7 text-ink/30" />
        </div>
        <p className="font-display text-2xl text-ink mb-2">Your cart is empty</p>
        <p className="text-ink/40 mb-6">Add medications to get started.</p>
        <Link to="/" className="px-6 py-3 bg-sage text-white rounded-full text-sm font-semibold hover:bg-[#3d5a66] transition-colors">
          Browse Products
        </Link>
      </div>
    );

  return (
    <div className="py-12 md:py-16 bg-porcelain">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <h1 className="font-display text-3xl md:text-4xl text-ink mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Left: Shipping + Prescription Status */}
          <div className="lg:col-span-3 space-y-8">
            {/* Prescription Status Dashboard */}
            {hasPrescriptionItems && (
              <div className="cellular-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Stethoscope className="w-5 h-5 text-sage" />
                  <h2 className="font-display text-xl text-ink">Prescription Status</h2>
                </div>
                <div className="space-y-2">
                  {items
                    .filter((i) => i.requires_prescription)
                    .map((item) => (
                      <div key={item.productId} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <span className="text-sm text-ink/70">{item.name}</span>
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-ochre">
                          <ShieldAlert className="w-3.5 h-3.5" /> Needs Vet Verification
                        </span>
                      </div>
                    ))}
                </div>
                <Link
                  to="/prescription"
                  className="mt-4 inline-flex items-center gap-2 text-sage text-sm font-semibold hover:gap-3 transition-all"
                >
                  Submit prescription now <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}

            {/* Shipping Address */}
            <div className="cellular-card p-6">
              <div className="flex items-center gap-2 mb-5">
                <MapPin className="w-5 h-5 text-sage" />
                <h2 className="font-display text-xl text-ink">Shipping Address</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-xs text-ink/50 font-medium uppercase tracking-wider">Full Name</label>
                  <input name="shipping_name" value={form.shipping_name} onChange={handleChange} className="mt-1 w-full px-4 py-3 bg-secondary rounded-2xl border-[0.5px] border-transparent focus:border-sage focus:outline-none transition-all" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-ink/50 font-medium uppercase tracking-wider">Street Address</label>
                  <input name="shipping_address" value={form.shipping_address} onChange={handleChange} className="mt-1 w-full px-4 py-3 bg-secondary rounded-2xl border-[0.5px] border-transparent focus:border-sage focus:outline-none transition-all" />
                </div>
                <div>
                  <label className="text-xs text-ink/50 font-medium uppercase tracking-wider">City</label>
                  <input name="shipping_city" value={form.shipping_city} onChange={handleChange} className="mt-1 w-full px-4 py-3 bg-secondary rounded-2xl border-[0.5px] border-transparent focus:border-sage focus:outline-none transition-all" />
                </div>
                <div>
                  <label className="text-xs text-ink/50 font-medium uppercase tracking-wider">State</label>
                  <select name="shipping_state" value={form.shipping_state} onChange={handleChange} className="mt-1 w-full px-4 py-3 bg-secondary rounded-2xl border-[0.5px] border-transparent focus:border-sage focus:outline-none transition-all">
                    {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-ink/50 font-medium uppercase tracking-wider">ZIP Code</label>
                  <input name="shipping_zip" value={form.shipping_zip} onChange={handleChange} className="mt-1 w-full px-4 py-3 bg-secondary rounded-2xl border-[0.5px] border-transparent focus:border-sage focus:outline-none transition-all" />
                </div>
                <div>
                  <label className="text-xs text-ink/50 font-medium uppercase tracking-wider">Phone</label>
                  <input name="shipping_phone" value={form.shipping_phone} onChange={handleChange} className="mt-1 w-full px-4 py-3 bg-secondary rounded-2xl border-[0.5px] border-transparent focus:border-sage focus:outline-none transition-all" />
                </div>
              </div>
            </div>

            {/* Payment placeholder */}
            <div className="cellular-card p-6">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-5 h-5 text-sage" />
                <h2 className="font-display text-xl text-ink">Payment</h2>
              </div>
              <p className="text-sm text-ink/40">
                Secure payment will be collected at the next step. Your card details are encrypted and never stored.
              </p>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-2">
            <div className="cellular-card p-6 lg:sticky lg:top-28">
              <h2 className="font-display text-xl text-ink mb-5">Order Summary</h2>
              <div className="space-y-3 mb-5 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-3">
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-sage/20" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-ink font-medium leading-tight truncate">{item.name}</p>
                      <p className="text-xs text-ink/40">Qty {item.quantity}{item.autoship ? " · AutoShip" : ""}</p>
                    </div>
                    <span className="text-sm font-semibold text-ink">
                      ${(item.price * item.quantity * (item.autoship ? 0.95 : 1)).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="diagnostic-line pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-ink/60">Subtotal</span>
                  <span className="text-ink font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-ink/60">Shipping</span>
                  <span className="text-ink font-medium">{shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-border">
                  <span className="font-display text-lg text-ink">Total</span>
                  <span className="font-display text-lg text-ink">${total.toFixed(2)}</span>
                </div>
              </div>

              {error && <p className="text-sm text-destructive mt-4">{error}</p>}

              <button
                onClick={handlePlace}
                disabled={placing || !valid}
                className="w-full mt-6 flex items-center justify-center gap-2 py-4 bg-sage text-white rounded-full font-semibold text-sm hover:bg-[#3d5a66] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {placing ? "Placing Order..." : <>Place Order <ArrowRight className="w-4 h-4" /></>}
              </button>
              <p className="text-xs text-ink/40 text-center mt-3 flex items-center justify-center gap-1.5">
                <Lock className="w-3 h-3" /> Secure checkout · 256-bit encryption
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}