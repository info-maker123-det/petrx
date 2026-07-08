import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Search, ChevronRight } from "lucide-react";
import { effectiveRxStatus, getRxStatusConfig, formatDateTime } from "@/lib/adminUtils";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "submitted", label: "Needs Vet Request" },
  { value: "vet_request_sent", label: "Awaiting Vet Response" },
  { value: "vet_response_received", label: "Awaiting Sister Pharmacy" },
  { value: "sent_to_sister_pharmacy", label: "Awaiting Tracking" },
  { value: "tracking_entered", label: "Awaiting Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "rejected", label: "Rejected" },
  { value: "needs_more_info", label: "Needs More Info" },
];

export default function AdminPrescriptions() {
  const [rxList, setRxList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    base44.entities.Prescription
      .list("-created_date", 500)
      .then((data) => setRxList(data || []))
      .catch(() => setRxList([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = rxList;
    if (filter !== "all") {
      result = result.filter((r) => effectiveRxStatus(r) === filter);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((r) =>
        (r.pet_name || "").toLowerCase().includes(q) ||
        (r.medication_name || "").toLowerCase().includes(q) ||
        (r.vet_clinic_name || "").toLowerCase().includes(q) ||
        (r.vet_name || "").toLowerCase().includes(q)
      );
    }
    return result;
  }, [rxList, filter, search]);

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
        <h1 className="font-display text-2xl md:text-3xl text-slate-900 mb-1">Prescription Queue</h1>
        <p className="text-slate-500 text-sm">Internal workflow — not visible to customers.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by pet, medication, or vet..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-400"
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-4">
        {FILTERS.map((f) => {
          const count = f.value === "all" ? rxList.length : rxList.filter((r) => effectiveRxStatus(r) === f.value).length;
          return (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                filter === f.value ? "bg-slate-900 text-white" : "bg-white text-slate-500 border border-slate-200 hover:border-slate-300"
              }`}
            >
              {f.label}
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${filter === f.value ? "bg-white/20" : "bg-slate-100"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <p className="text-slate-400 text-sm">No prescriptions match this filter.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Pet</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Medication</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Vet Clinic</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Submitted</th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((rx) => {
                const cfg = getRxStatusConfig(effectiveRxStatus(rx));
                return (
                  <tr key={rx.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-slate-900">{rx.pet_name}</p>
                      <p className="text-xs text-slate-400 capitalize">{rx.pet_species}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-slate-700">{rx.medication_name}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="text-sm text-slate-700">{rx.vet_clinic_name}</p>
                      <p className="text-xs text-slate-400">{rx.vet_name}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${cfg.color}`}>{cfg.label}</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <p className="text-xs text-slate-400">{formatDateTime(rx.created_date)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Link to={`/admin/prescriptions/${rx.id}`} className="text-slate-400 hover:text-slate-700">
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}