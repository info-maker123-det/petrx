import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { X, Plus, Minus, Trash2, ArrowRight, ShieldAlert, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cartContext";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, subtotal, hasPrescriptionItems, count } = useCart();

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
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                  <ShoppingBag className="w-7 h-7 text-ink/30" />
                </div>
                <p className="font-display text-lg text-ink mb-1">Your cart is empty</p>
                <p className="text-sm text-ink/40 mb-6">Browse our pharmacy to find your pet's medications.</p>
                <Link
                  to="/"
                  onClick={closeCart}
                  className="px-6 py-3 bg-sage text-white rounded-full text-sm font-semibold hover:bg-[#3d5a66] transition-colors"
                >
                  Shop Products
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
                  <Link
                    to="/checkout"
                    onClick={closeCart}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-sage text-white rounded-full font-semibold text-sm hover:bg-[#3d5a66] transition-colors"
                  >
                    Checkout <ArrowRight className="w-4 h-4" />
                  </Link>
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