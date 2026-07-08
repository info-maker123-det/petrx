import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useCart } from "@/lib/cartContext";
import { Repeat, Loader2, ShoppingBag, Check } from "lucide-react";

export default function QuickReorder() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reordered, setReordered] = useState(null);
  const { addItem } = useCart();

  useEffect(() => {
    setLoading(true);
    base44.entities.Order
      .list("-created_date", 100)
      .then((orders) => {
        const list = Array.isArray(orders) ? orders : [];
        const freq = {};
        list.forEach((o) => {
          (o.items || []).forEach((it) => {
            const key = it.productId || it.id || it.name;
            if (!key) return;
            if (!freq[key]) freq[key] = { ...it, id: it.productId || it.id, count: 0 };
            freq[key].count += 1;
          });
        });
        setItems(Object.values(freq).sort((a, b) => b.count - a.count).slice(0, 4));
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const reorder = (it) => {
    addItem({
      id: it.productId || it.id,
      name: it.name,
      brand: it.brand,
      price: it.price,
      image_url: it.image_url,
      requires_prescription: it.requires_prescription,
    }, 1, false);
    setReordered(it.productId || it.id);
    setTimeout(() => setReordered(null), 1500);
  };

  return (
    <div className="cellular-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Repeat className="w-4 h-4 text-sage" />
        <h3 className="font-display text-lg text-ink">Quick Reorder</h3>
      </div>
      {loading ? (
        <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 text-sage animate-spin" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-6">
          <ShoppingBag className="w-7 h-7 text-ink/20 mx-auto mb-2" />
          <p className="text-xs text-ink/40 mb-3">No past purchases to reorder yet.</p>
          <Link to="/shop" className="text-xs text-sage font-semibold hover:underline">Browse the shop →</Link>
        </div>
      ) : (
        <div className="space-y-2.5">
          {items.map((it) => {
            const key = it.productId || it.id;
            const done = reordered === key;
            return (
              <div key={key} className="flex items-center gap-3 p-2.5 bg-secondary/40 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-white border border-border overflow-hidden flex-shrink-0">
                  {it.image_url ? <img src={it.image_url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-sage/10" />}
                </div>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${key}`} className="text-xs font-semibold text-ink hover:text-sage truncate block">{it.name}</Link>
                  <p className="text-xs text-ink/40">{it.brand} · ${Number(it.price || 0).toFixed(2)} · {it.count}×</p>
                </div>
                <button onClick={() => reorder(it)} disabled={done} className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${done ? "bg-green-600 text-white" : "bg-sage text-white hover:bg-[#3d5a66]"}`}>
                  {done ? <Check className="w-3.5 h-3.5" /> : "Reorder"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}