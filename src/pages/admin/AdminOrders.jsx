import React, { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { Search, Truck, CheckCircle, Loader2, Package } from "lucide-react";
import { ORDER_STATUS_CONFIG, formatDateTime, formatCurrency } from "@/lib/adminUtils";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("standard");
  const [search, setSearch] = useState("");
  const [trackingInputs, setTrackingInputs] = useState({});
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    base44.entities.Order
      .list("-created_date", 500)
      .then((data) => setOrders(data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = orders;
    if (tab === "standard") result = result.filter((o) => !o.has_prescription_items);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((o) =>
        (o.order_number || "").toLowerCase().includes(q) ||
        (o.shipping_name || "").toLowerCase().includes(q)
      );
    }
    return result;
  }, [orders, tab, search]);

  const updateOrder = async (id, data) => {
    setUpdating(id);
    try {
      await base44.entities.Order.update(id, data);
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...data } : o)));
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  const now = () => new Date().toISOString();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-40">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-700 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl md:text-3xl text-slate-900 mb-1">Order Queue</h1>
        <p className="text-slate-500 text-sm">Standard OTC orders — no vet verification required. Separate from the Rx workflow.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order # or customer..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-400"
          />
        </div>
        <div className="flex gap-1.5 p-1.5 bg-slate-100 rounded-xl">
          <button onClick={() => setTab("standard")} className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${tab === "standard" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>
            Standard
          </button>
          <button onClick={() => setTab("all")} className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${tab === "all" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>
            All Orders
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-slate-400 text-sm">No orders found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Order</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Customer</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Items</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider min-w-[200px]">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => {
                  const cfg = ORDER_STATUS_CONFIG[o.status] || { label: o.status, color: "bg-slate-100 text-slate-700" };
                  const itemCount = (o.items || []).reduce((sum, i) => sum + (i.quantity || 1), 0);
                  const isUpdating = updating === o.id;
                  return (
                    <tr key={o.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-slate-900">{o.order_number || "—"}</p>
                        <p className="text-xs text-slate-400">{formatDateTime(o.created_date)}</p>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <p className="text-sm text-slate-700">{o.shipping_name || "—"}</p>
                        <p className="text-xs text-slate-400">{o.shipping_city}, {o.shipping_state}</p>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <p className="text-sm text-slate-700">{itemCount} item{itemCount !== 1 ? "s" : ""}</p>
                        <p className="text-xs text-slate-400 truncate max-w-[150px]">{(o.items || []).map((i) => i.name).join(", ")}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold text-slate-900">{formatCurrency(o.total)}</p>
                        {o.has_prescription_items && <p className="text-[10px] text-amber-600 font-medium">Rx items</p>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${cfg.color}`}>{cfg.label}</span>
                        {o.tracking_number && <p className="text-[10px] text-slate-400 font-mono mt-1">{o.tracking_number}</p>}
                      </td>
                      <td className="px-4 py-3">
                        {isUpdating ? (
                          <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
                        ) : o.status === "pending" ? (
                          <button onClick={() => updateOrder(o.id, { status: "processing" })} className="text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors">
                            Start Processing
                          </button>
                        ) : o.status === "processing" ? (
                          <div className="flex gap-1.5">
                            <input
                              value={trackingInputs[o.id] || ""}
                              onChange={(e) => setTrackingInputs((prev) => ({ ...prev, [o.id]: e.target.value }))}
                              placeholder="Tracking #"
                              className="w-28 px-2 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-slate-400"
                            />
                            <button
                              onClick={() => updateOrder(o.id, { status: "shipped", tracking_number: trackingInputs[o.id] || "" })}
                              disabled={!trackingInputs[o.id]}
                              className="text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                            >
                              Ship
                            </button>
                          </div>
                        ) : o.status === "shipped" ? (
                          <button onClick={() => updateOrder(o.id, { status: "delivered", delivered_date: now() })} className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-colors">
                            <CheckCircle className="w-3 h-3" /> Mark Delivered
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">{o.tracking_number || "—"}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}