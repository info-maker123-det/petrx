import React, { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { Search, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/adminUtils";
import EditModal from "@/components/admin/EditModal";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    base44.entities.Product
      .list("-created_date", 500)
      .then((data) => setProducts(data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = products;
    if (filter === "ai_estimated") result = result.filter((p) => p.data_source === "ai_estimated");
    if (filter === "shopify") result = result.filter((p) => p.data_source === "shopify" || !p.data_source);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) =>
        (p.name || "").toLowerCase().includes(q) ||
        (p.brand || "").toLowerCase().includes(q) ||
        (p.category || "").toLowerCase().includes(q)
      );
    }
    return result;
  }, [products, filter, search]);

  const startEdit = (product) => {
    setEditing(product);
    setForm({
      name: product.name || "",
      brand: product.brand || "",
      category: product.category || "",
      price: product.price || 0,
      active_ingredient: product.active_ingredient || "",
      dosage_type: product.dosage_type || "",
      description: product.description || "",
      data_source: product.data_source || "shopify",
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await base44.entities.Product.update(editing.id, { ...form, price: Number(form.price) });
      setProducts((prev) => prev.map((p) => (p.id === editing.id ? { ...p, ...form, price: Number(form.price) } : p)));
      setEditing(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-40">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-700 rounded-full animate-spin" />
      </div>
    );
  }

  const aiCount = products.filter((p) => p.data_source === "ai_estimated").length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl md:text-3xl text-slate-900 mb-1">Product Data Review</h1>
        <p className="text-slate-500 text-sm">
          {aiCount > 0 ? (
            <span className="inline-flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5 text-orange-500" /> {aiCount} products have AI-estimated data that needs review.</span>
          ) : "All product data is sourced from Shopify."}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-400"
          />
        </div>
        <div className="flex gap-1.5 p-1.5 bg-slate-100 rounded-xl">
          {[
            { value: "all", label: "All" },
            { value: "shopify", label: "Shopify" },
            { value: "ai_estimated", label: "AI-Estimated" },
          ].map((f) => (
            <button key={f.value} onClick={() => setFilter(f.value)} className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f.value ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Product</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Data Source</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-slate-900 truncate max-w-[200px]">{p.name}</p>
                    <p className="text-xs text-slate-400">{p.brand}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <p className="text-sm text-slate-700">{p.category}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-semibold text-slate-900">{formatCurrency(p.price)}</p>
                  </td>
                  <td className="px-4 py-3">
                    {p.data_source === "ai_estimated" ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-orange-100 text-orange-700">
                        <AlertCircle className="w-3 h-3" /> AI-Estimated
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-green-100 text-green-700">
                        <CheckCircle className="w-3 h-3" /> Shopify
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => startEdit(p)} className="text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-slate-400 text-sm py-8">No products match this filter.</p>
      )}

      <EditModal open={!!editing} onClose={() => setEditing(null)} title="Edit Product" onSave={handleSave} saving={saving}>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Name</label>
            <input value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-400" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Brand</label>
              <input value={form.brand || ""} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-400" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Category</label>
              <input value={form.category || ""} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-400" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Price</label>
              <input type="number" step="0.01" value={form.price || 0} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-400" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Data Source</label>
              <select value={form.data_source || "shopify"} onChange={(e) => setForm({ ...form, data_source: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-400 bg-white">
                <option value="shopify">Shopify (Verified)</option>
                <option value="ai_estimated">AI-Estimated (Needs Review)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Active Ingredient</label>
            <input value={form.active_ingredient || ""} onChange={(e) => setForm({ ...form, active_ingredient: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-400" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Dosage Type</label>
            <input value={form.dosage_type || ""} onChange={(e) => setForm({ ...form, dosage_type: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-400" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Description</label>
            <textarea value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-400" />
          </div>
        </div>
      </EditModal>
    </div>
  );
}