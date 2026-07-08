import React, { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { Search, Stethoscope, Trash2, Loader2 } from "lucide-react";
import EditModal from "@/components/admin/EditModal";

export default function AdminVets() {
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    base44.entities.Vet
      .list("-created_date", 1000)
      .then((data) => setVets(data || []))
      .catch(() => setVets([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!search) return vets;
    const q = search.toLowerCase();
    return vets.filter((v) =>
      (v.clinic_name || "").toLowerCase().includes(q) ||
      (v.vet_name || "").toLowerCase().includes(q) ||
      (v.city || "").toLowerCase().includes(q)
    );
  }, [vets, search]);

  const startEdit = (vet) => {
    setEditing(vet);
    setForm({
      clinic_name: vet.clinic_name || "",
      vet_name: vet.vet_name || "",
      address: vet.address || "",
      city: vet.city || "",
      state: vet.state || "CA",
      zip: vet.zip || "",
      phone: vet.phone || "",
      email: vet.email || "",
      fax: vet.fax || "",
      website: vet.website || "",
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await base44.entities.Vet.update(editing.id, form);
      setVets((prev) => prev.map((v) => (v.id === editing.id ? { ...v, ...form } : v)));
      setEditing(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (vet) => {
    if (!window.confirm(`Delete ${vet.clinic_name}? This cannot be undone.`)) return;
    setDeleting(vet.id);
    try {
      await base44.entities.Vet.delete(vet.id);
      setVets((prev) => prev.filter((v) => v.id !== vet.id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

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
        <h1 className="font-display text-2xl md:text-3xl text-slate-900 mb-1">Vet Directory</h1>
        <p className="text-slate-500 text-sm">{vets.length} entries in the California vet directory</p>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by clinic, vet name, or city..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-400"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Stethoscope className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-slate-400 text-sm">No vets found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Clinic</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Vet</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Location</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Contact</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((v) => (
                  <tr key={v.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-slate-900">{v.clinic_name}</p>
                      <p className="text-xs text-slate-400 md:hidden">{v.vet_name}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="text-sm text-slate-700">{v.vet_name || "—"}</p>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <p className="text-sm text-slate-700">{v.city}, {v.state}</p>
                      <p className="text-xs text-slate-400">{v.zip}</p>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <p className="text-sm text-slate-700">{v.phone || "—"}</p>
                      <p className="text-xs text-slate-400">{v.email || "—"}</p>
                      {v.fax && <p className="text-xs text-slate-400">Fax: {v.fax}</p>}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => startEdit(v)} className="text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(v)} disabled={deleting === v.id} className="text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50">
                          {deleting === v.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <EditModal open={!!editing} onClose={() => setEditing(null)} title="Edit Vet Entry" onSave={handleSave} saving={saving}>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Clinic Name</label>
            <input value={form.clinic_name || ""} onChange={(e) => setForm({ ...form, clinic_name: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-400" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Veterinarian Name</label>
            <input value={form.vet_name || ""} onChange={(e) => setForm({ ...form, vet_name: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-400" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Address</label>
            <input value={form.address || ""} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-400" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">City</label>
              <input value={form.city || ""} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-400" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">State</label>
              <input value={form.state || ""} onChange={(e) => setForm({ ...form, state: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-400" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Zip</label>
              <input value={form.zip || ""} onChange={(e) => setForm({ ...form, zip: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-400" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Phone</label>
              <input value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-400" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Fax</label>
              <input value={form.fax || ""} onChange={(e) => setForm({ ...form, fax: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-400" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Email</label>
            <input value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-400" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Website</label>
            <input value={form.website || ""} onChange={(e) => setForm({ ...form, website: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-400" />
          </div>
        </div>
      </EditModal>
    </div>
  );
}