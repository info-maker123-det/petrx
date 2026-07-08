import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { FileText, Package, Mail, AlertCircle, ArrowRight, Truck } from "lucide-react";
import { effectiveRxStatus, formatDateTime, formatCurrency, getRxStatusConfig } from "@/lib/adminUtils";
import OrderStats from "@/components/admin/OrderStats";
import VisitorAnalytics from "@/components/admin/VisitorAnalytics";

export default function AdminHome() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.Prescription.list("-created_date", 100).catch(() => []),
      base44.entities.Order.list("-created_date", 100).catch(() => []),
      base44.entities.ContactMessage.list("-created_date", 50).catch(() => []),
      base44.entities.Product.list("-created_date", 500).catch(() => []),
    ]).then(([rxList, orders, messages, products]) => {
      const rx = rxList || [];
      setData({
        pendingVetRequests: rx.filter((r) => effectiveRxStatus(r) === "submitted"),
        awaitingSisterPharmacy: rx.filter((r) => effectiveRxStatus(r) === "vet_response_received"),
        needsMoreInfo: rx.filter((r) => effectiveRxStatus(r) === "needs_more_info"),
        newOrders: (orders || []).filter((o) => o.status === "pending" && !o.has_prescription_items),
        unreadMessages: (messages || []).filter((m) => m.status === "new"),
        flaggedProducts: (products || []).filter((p) => p.data_source === "ai_estimated"),
        recentRx: rx.slice(0, 5),
        recentOrders: (orders || []).slice(0, 5),
      });
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-40">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-700 rounded-full animate-spin" />
      </div>
    );
  }

  const cards = [
    { count: data.pendingVetRequests.length, label: "Prescriptions needing vet verification", link: "/admin/prescriptions", icon: FileText, tint: "bg-amber-50 text-amber-600" },
    { count: data.awaitingSisterPharmacy.length, label: "Awaiting sister-pharmacy handoff", link: "/admin/prescriptions", icon: Package, tint: "bg-indigo-50 text-indigo-600" },
    { count: data.newOrders.length, label: "New standard orders to process", link: "/admin/orders", icon: Truck, tint: "bg-blue-50 text-blue-600" },
    { count: data.unreadMessages.length, label: "Unread contact messages", link: "/admin/messages", icon: Mail, tint: "bg-violet-50 text-violet-600" },
    { count: data.flaggedProducts.length, label: "AI-estimated product data to review", link: "/admin/products", icon: AlertCircle, tint: "bg-orange-50 text-orange-600" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl md:text-3xl text-slate-900 mb-1">Admin Overview</h1>
        <p className="text-slate-500 text-sm">
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        </p>
      </div>

      <div className="mb-8">
        <h2 className="font-display text-lg text-slate-900 mb-3">Order Metrics</h2>
        <OrderStats />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map((card, i) => (
          <Link key={i} to={card.link} className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-slate-300 hover:shadow-sm transition-all group">
            <div className={`w-10 h-10 rounded-xl ${card.tint} flex items-center justify-center mb-4`}>
              <card.icon className="w-5 h-5" />
            </div>
            <p className="font-display text-3xl text-slate-900 mb-1">{card.count}</p>
            <p className="text-sm text-slate-500 mb-3">{card.label}</p>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 group-hover:text-slate-600 transition-colors">
              View queue <ArrowRight className="w-3 h-3" />
            </span>
          </Link>
        ))}
      </div>

      {data.needsMoreInfo.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-8 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
          <p className="text-sm text-orange-800">
            <strong>{data.needsMoreInfo.length}</strong> prescription(s) need more information from the vet.
            <Link to="/admin/prescriptions" className="font-semibold underline ml-1">Review now</Link>
          </p>
        </div>
      )}

      <div className="mb-8">
        <VisitorAnalytics />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg text-slate-900">Recent Prescriptions</h2>
            <Link to="/admin/prescriptions" className="text-xs font-semibold text-slate-400 hover:text-slate-600">View all</Link>
          </div>
          {data.recentRx.length === 0 ? (
            <p className="text-sm text-slate-400 py-4">No prescriptions yet.</p>
          ) : (
            <div className="space-y-1">
              {data.recentRx.map((rx) => {
                const cfg = getRxStatusConfig(effectiveRxStatus(rx));
                return (
                  <Link key={rx.id} to={`/admin/prescriptions/${rx.id}`} className="flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{rx.medication_name}</p>
                      <p className="text-xs text-slate-400">{rx.pet_name} · {rx.vet_clinic_name}</p>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${cfg.color} flex-shrink-0`}>{cfg.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg text-slate-900">Recent Orders</h2>
            <Link to="/admin/orders" className="text-xs font-semibold text-slate-400 hover:text-slate-600">View all</Link>
          </div>
          {data.recentOrders.length === 0 ? (
            <p className="text-sm text-slate-400 py-4">No orders yet.</p>
          ) : (
            <div className="space-y-1">
              {data.recentOrders.map((o) => (
                <div key={o.id} className="flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{o.order_number || "Order"}</p>
                    <p className="text-xs text-slate-400">{o.shipping_name} · {formatDateTime(o.created_date)}</p>
                  </div>
                  <span className="text-sm font-semibold text-slate-900 flex-shrink-0">{formatCurrency(o.total)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}