import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { ShoppingCart, Truck, CheckCircle, DollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/adminUtils";

export default function OrderStats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    base44.entities.Order
      .list("-created_date", 500)
      .then((orders) => {
        const list = orders || [];
        setStats({
          placed: list.filter((o) => o.status === "pending" || o.status === "processing").length,
          shipped: list.filter((o) => o.status === "shipped").length,
          delivered: list.filter((o) => o.status === "delivered").length,
          revenue: list
            .filter((o) => o.payment_status === "paid" || o.status === "delivered")
            .reduce((sum, o) => sum + (o.total || 0), 0),
        });
      })
      .catch(() => setStats({ placed: 0, shipped: 0, delivered: 0, revenue: 0 }));
  }, []);

  if (!stats) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 h-24 animate-pulse" />
        ))}
      </div>
    );
  }

  const cards = [
    { label: "Orders Placed", value: stats.placed, icon: ShoppingCart, tint: "bg-blue-50 text-blue-600" },
    { label: "Shipped", value: stats.shipped, icon: Truck, tint: "bg-indigo-50 text-indigo-600" },
    { label: "Delivered", value: stats.delivered, icon: CheckCircle, tint: "bg-green-50 text-green-600" },
    { label: "Revenue", value: formatCurrency(stats.revenue), icon: DollarSign, tint: "bg-emerald-50 text-emerald-600" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className={`w-9 h-9 rounded-xl ${card.tint} flex items-center justify-center mb-3`}>
            <card.icon className="w-4 h-4" />
          </div>
          <p className="font-display text-2xl text-slate-900">{card.value}</p>
          <p className="text-xs text-slate-500 mt-0.5">{card.label}</p>
        </div>
      ))}
    </div>
  );
}