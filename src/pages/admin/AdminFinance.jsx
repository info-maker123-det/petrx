import React, { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { DollarSign, TrendingUp, Package, RefreshCw, AlertTriangle, CreditCard } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/lib/adminUtils";

export default function AdminFinance() {
  const [orders, setOrders] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.Order.list("-created_date", 1000).catch(() => []),
      base44.entities.Subscription.list("-created_date", 500).catch(() => []),
    ]).then(([orderData, subData]) => {
      setOrders(orderData || []);
      setSubscriptions(subData || []);
    }).finally(() => setLoading(false));
  }, []);

  const metrics = useMemo(() => {
    const valid = orders.filter((o) => o.status !== "cancelled");
    const totalSales = valid.reduce((sum, o) => sum + (o.total || 0), 0);
    const orderCount = valid.length;
    const aov = orderCount > 0 ? totalSales / orderCount : 0;
    const activeSubs = subscriptions.filter((s) => s.status === "active");
    const autoshipRevenue = activeSubs.reduce((sum, s) => sum + (s.product_price || 0) * (s.quantity || 1), 0);
    const pendingPayments = orders.filter((o) => o.payment_status === "pending" && o.status !== "cancelled").reduce((sum, o) => sum + (o.total || 0), 0);
    const collectedPayments = orders.filter((o) => o.payment_status === "paid").reduce((sum, o) => sum + (o.total || 0), 0);
    return { totalSales, orderCount, aov, autoshipRevenue, pendingPayments, collectedPayments, activeSubCount: activeSubs.length };
  }, [orders, subscriptions]);

  const chartData = useMemo(() => {
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push({
        date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        orders: 0,
        revenue: 0,
      });
    }
    orders.forEach((o) => {
      if (o.status === "cancelled") return;
      const key = new Date(o.created_date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const day = days.find((d) => d.date === key);
      if (day) {
        day.orders += 1;
        day.revenue += o.total || 0;
      }
    });
    return days;
  }, [orders]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-40">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-700 rounded-full animate-spin" />
      </div>
    );
  }

  const cards = [
    { label: "Total Sales", value: formatCurrency(metrics.totalSales), icon: DollarSign, tint: "bg-slate-900 text-white" },
    { label: "Order Volume", value: `${metrics.orderCount} orders`, icon: Package, tint: "bg-blue-100 text-blue-700" },
    { label: "Avg Order Value", value: formatCurrency(metrics.aov), icon: TrendingUp, tint: "bg-green-100 text-green-700" },
    { label: "AutoShip Revenue", value: formatCurrency(metrics.autoshipRevenue), sub: `${metrics.activeSubCount} active subscriptions`, icon: RefreshCw, tint: "bg-violet-100 text-violet-700" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl md:text-3xl text-slate-900 mb-1">Financial Overview</h1>
        <p className="text-slate-500 text-sm">Revenue and order metrics from the database.</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-900">Payment processing not yet connected</p>
          <p className="text-xs text-amber-700 mt-0.5">
            All figures below are order totals from the database. Payment status reflects what was recorded at checkout,
            not verified transactions. Connect a payment provider to enable live payment tracking.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className={`w-9 h-9 rounded-xl ${card.tint} flex items-center justify-center mb-3`}>
              <card.icon className="w-4 h-4" />
            </div>
            <p className="font-display text-2xl text-slate-900 mb-0.5">{card.value}</p>
            <p className="text-xs text-slate-500">{card.label}</p>
            {card.sub && <p className="text-[11px] text-slate-400 mt-0.5">{card.sub}</p>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:col-span-2">
          <h2 className="font-display text-lg text-slate-900 mb-1">Order Volume (Last 30 Days)</h2>
          <p className="text-xs text-slate-400 mb-4">Daily order count and revenue</p>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} interval={4} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }}
                formatter={(value, name) => name === "revenue" ? formatCurrency(value) : [value, "orders"]}
              />
              <Line type="monotone" dataKey="orders" stroke="#4F6D7A" strokeWidth={2} dot={false} name="orders" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-4 h-4 text-slate-400" />
            <h2 className="font-display text-lg text-slate-900">Payment Status</h2>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-xl">
              <p className="text-xs text-green-600 font-medium mb-1">Collected</p>
              <p className="font-display text-2xl text-green-900">{formatCurrency(metrics.collectedPayments)}</p>
            </div>
            <div className="p-4 bg-amber-50 rounded-xl">
              <p className="text-xs text-amber-600 font-medium mb-1">Pending</p>
              <p className="font-display text-2xl text-amber-900">{formatCurrency(metrics.pendingPayments)}</p>
            </div>
            <div className="pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Total</span>
                <span className="font-semibold text-slate-900">{formatCurrency(metrics.collectedPayments + metrics.pendingPayments)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}