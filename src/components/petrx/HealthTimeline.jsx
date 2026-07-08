import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Clock, Pill, FileText, Loader2 } from "lucide-react";

const STATUS_STYLES = {
  pending: { dot: "bg-ochre", label: "Submitted", text: "text-ochre" },
  in_review: { dot: "bg-blue-400", label: "In Review", text: "text-blue-500" },
  approved: { dot: "bg-sage", label: "Approved", text: "text-sage" },
  rejected: { dot: "bg-red-400", label: "Rejected", text: "text-red-500" },
  fulfilled: { dot: "bg-green-500", label: "Fulfilled", text: "text-green-600" },
};

function formatDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function HealthTimeline({ pet }) {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pet?.name) return;
    setLoading(true);
    base44.entities.Prescription
      .filter({ pet_name: pet.name }, "-created_date", 50)
      .then((data) => setPrescriptions(Array.isArray(data) ? data : []))
      .catch(() => setPrescriptions([]))
      .finally(() => setLoading(false));
  }, [pet?.name]);

  return (
    <div className="cellular-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-sage" />
        <h3 className="font-display text-lg text-ink">Health Timeline</h3>
      </div>
      {loading ? (
        <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 text-sage animate-spin" /></div>
      ) : prescriptions.length === 0 ? (
        <div className="text-center py-6">
          <FileText className="w-7 h-7 text-ink/20 mx-auto mb-2" />
          <p className="text-xs text-ink/40 mb-3">No prescription history yet for {pet.name}.</p>
          <Link to="/prescription" className="text-xs text-sage font-semibold hover:underline">Submit one →</Link>
        </div>
      ) : (
        <div className="relative pl-5">
          <div className="absolute left-1.5 top-1 bottom-1 w-px bg-border" />
          {prescriptions.map((rx) => {
            const style = STATUS_STYLES[rx.status] || STATUS_STYLES.pending;
            return (
              <div key={rx.id} className="relative pb-5 last:pb-0">
                <span className={`absolute -left-[14px] top-1 w-3 h-3 rounded-full ${style.dot} ring-4 ring-white`} />
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-ink flex items-center gap-1.5 min-w-0">
                    <Pill className="w-3.5 h-3.5 text-ink/40 flex-shrink-0" />
                    <span className="truncate">{rx.medication_name}</span>
                  </p>
                  <span className={`text-[10px] font-bold uppercase tracking-wide ${style.text} flex-shrink-0`}>{style.label}</span>
                </div>
                <p className="text-xs text-ink/40 mt-0.5">{rx.vet_clinic_name} · {formatDate(rx.created_date)}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}