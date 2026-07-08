import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { X, Plus, Minus, Trash2, ArrowRight, ShieldAlert, ShoppingBag, UserPlus, LogIn } from "lucide-react";
import { useCart } from "@/lib/cartContext";
import { base44 } from "@/api/base44Client";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, subtotal, hasPrescriptionItems, count } = useCart();
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(null);

  useEffect(() => {
    if (isOpen && items.length > 0) {
      base44.auth.isAuthenticated().then(setAuthed).catch(() => setAuthed(false));
    }
  }, [isOpen, items.length]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-[#1A1C1E]/40 backdrop-blur-sm z-[60]"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-porcelain z-[70] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-sage" />
                <h3 className="font-display text-xl text-ink">Your Cart</h3>
                <span className="text-sm text-ink/40">({count})</span>
              </div>
              <button onClick={closeCart} className="p-2 hover:bg-secondary rounded-full transition-colors">
                <X className="w-5 h-5 text-ink" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-sage/10 flex items-center justify-center mb-5">
                  <ShoppingBag className="w-7 h-7 text-sage" />
                </div>
                <p className="text-sage text-xs font-semibold tracking-widest uppercase mb-2">Empty Cart</p>
                <p className="font-display text-xl text-ink mb-2">Your cart is empty</p>
                <p className="text-sm text-ink/40 mb-6 max-w-xs">Browse our pharmacy to find your pet's medications and supplements.</p>
                <Link
                  to="/shop"
                  onClick={closeCart}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-sage text-white rounded-full text-sm font-semibold hover:bg-[#3d5a66] transition-colors"
                >
                  Browse the Catalog <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <>
                {/* Items */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                  {hasPrescriptionItems && (
                    <div className="flex gap-2.5 p-3 bg-ochre/8 rounded-2xl border-[0.5px] border-ochre/20">
                      <ShieldAlert className="w-4 h-4 text-ochre flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-ink/60 leading-relaxed">
                        Some items require vet verification. You can submit your prescription during checkout.
                      </p>
                    </div>
                  )}
                  {items.map((item) => (
                    <div key={item.productId} className="flex gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center flex-shrink-0">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover rounded-2xl" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-sage/20" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-sage font-medium">{item.brand}</p>
                        <p className="text-sm text-ink font-medium leading-tight mb-1 truncate">{item.name}</p>
                        {item.autoship && (
                          <span className="inline-block text-[10px] text-sage bg-sage/10 px-2 py-0.5 rounded-full font-medium mb-1">
                            AutoShip · 5% off
                          </span>
                        )}
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQty(item.productId, item.quantity - 1)}
                              className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center hover:bg-border transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-medium w-5 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQty(item.productId, item.quantity + 1)}
                              className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center hover:bg-border transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-ink">
                              ${(item.price * item.quantity * (item.autoship ? 0.95 : 1)).toFixed(2)}
                            </span>
                            <button onClick={() => removeItem(item.productId)} className="text-ink/30 hover:text-destructive transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="border-t border-border px-6 py-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-ink/60 text-sm">Subtotal</span>
                    <span className="font-display text-xl text-ink">${subtotal.toFixed(2)}</span>
                  </div>
                  {authed === false ? (
                    <div className="rounded-2xl bg-sage/8 border-[0.5px] border-sage/20 p-4 text-center">
                      <p className="text-sm text-ink/70 mb-3 leading-relaxed">
                        Create an account to securely check out, track orders, and manage your pet's medications.
                      </p>
                      <button
                        onClick={() => { closeCart(); navigate("/register"); }}
                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-sage text-white rounded-full font-semibold text-sm hover:bg-[#3d5a66] transition-colors mb-2"
                      >
                        <UserPlus className="w-4 h-4" /> Create Account
                      </button>
                      <button
                        onClick={() => { closeCart(); navigate("/login"); }}
                        className="w-full flex items-center justify-center gap-2 py-2 text-sm text-ink/60 hover:text-ink transition-colors"
                      >
                        <LogIn className="w-4 h-4" /> Already have an account? Sign in
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/checkout"
                      onClick={closeCart}
                      className="w-full flex items-center justify-center gap-2 py-4 bg-sage text-white rounded-full font-semibold text-sm hover:bg-[#3d5a66] transition-colors"
                    >
                      Checkout <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                  <button onClick={closeCart} className="w-full text-center text-sm text-ink/50 hover:text-ink transition-colors">
                    Continue Shopping
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}