import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { X, Copy, Check, Mail, Search, Loader2 } from "lucide-react";
import { generateVetVerificationText } from "@/lib/prescriptionPackets";

export default function VetEmailGenerator({ vet, onClose }) {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    base44.entities.Prescription
      .list("-created_date", 200)
      .then((data) => {
        const list = (data || []).filter((r) => r.pet_name && r.medication_name);
        setPrescriptions(list);
        if (list.length) setSelectedId(list[0].id);
      })
      .catch(() => setPrescriptions([]))
      .finally(() => setLoading(false));
  }, []);

  const selected = prescriptions.find((r) => r.id === selectedId);
  const text = selected ? generateVetVerificationText(selected, vet) : "";

  const filtered = search
    ? prescriptions.filter((r) =>
        `${r.pet_name} ${r.medication_name} ${r.vet_clinic_name}`.toLowerCase().includes(search.toLowerCase())
      )
    : prescriptions;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {}
  };

  const mailto = vet?.email
    ? `mailto:${vet.email}?subject=${encodeURIComponent(`Prescription Verification Request — ${selected?.pet_name || ""}`)}&body=${encodeURIComponent(text)}`
    : null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <div>
            <h3 className="font-display text-lg text-slate-900">Email Vet</h3>
            <p className="text-xs text-slate-500">{vet?.clinic_name} {vet?.email ? `· ${vet.email}` : "· no email on file"}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-4 h-4 text-slate-500" /></button>
        </div>

        <div className="flex flex-col md:flex-row flex-1 min-h-0">
          <div className="md:w-64 border-b md:border-b-0 md:border-r border-slate-200 p-3 overflow-y-auto">
            <div className="relative mb-2">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search prescriptions..."
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-slate-400"
              />
            </div>
            {loading ? (
              <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 text-slate-300 animate-spin" /></div>
            ) : filtered.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No prescriptions found.</p>
            ) : (
              <div className="space-y-1">
                {filtered.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedId(r.id)}
                    className={`w-full text-left p-2 rounded-lg transition-colors ${
                      selectedId === r.id ? "bg-slate-900 text-white" : "hover:bg-slate-100"
                    }`}
                  >
                    <p className="text-xs font-medium truncate">{r.medication_name}</p>
                    <p className={`text-[11px] truncate ${selectedId === r.id ? "text-white/60" : "text-slate-400"}`}>{r.pet_name} · {r.vet_clinic_name}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col min-h-0 p-4">
            {text ? (
              <>
                <textarea
                  readOnly
                  value={text}
                  className="flex-1 w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 resize-none focus:outline-none min-h-[260px]"
                />
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={copy}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copied!" : "Copy Text"}
                  </button>
                  {mailto && (
                    <a
                      href={mailto}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Mail className="w-4 h-4" /> Open Email
                    </a>
                  )}
                </div>
              </>
            ) : (
              <p className="text-xs text-slate-400 text-center py-10">Select a prescription to generate the email text.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}