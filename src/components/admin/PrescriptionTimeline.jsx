import React from "react";
import { formatDateTime } from "@/lib/adminUtils";

export default function PrescriptionTimeline({ rx }) {
  const events = [];
  if (rx.created_date) events.push({ date: rx.created_date, label: "Prescription submitted" });
  if (rx.vet_request_sent_date) events.push({ date: rx.vet_request_sent_date, label: `Vet request sent via ${rx.vet_request_method || "—"}` });
  if (rx.vet_response_date) events.push({ date: rx.vet_response_date, label: `Vet response: ${rx.vet_response || "—"}`, detail: rx.vet_response_notes });
  if (rx.sister_pharmacy_sent_date) events.push({ date: rx.sister_pharmacy_sent_date, label: "Sent to sister pharmacy" });
  if (rx.tracking_entered_date) events.push({ date: rx.tracking_entered_date, label: `Tracking entered: ${rx.tracking_number || "—"}` });
  if (rx.delivered_date) events.push({ date: rx.delivered_date, label: "Delivered" });

  events.sort((a, b) => new Date(a.date) - new Date(b.date));

  if (events.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <h3 className="font-display text-lg text-slate-900 mb-4">Timeline</h3>
      <div>
        {events.map((e, i) => (
          <div key={i} className="flex gap-3 pb-5 last:pb-0 relative">
            {i < events.length - 1 && <div className="absolute left-[7px] top-4 bottom-0 w-px bg-slate-200" />}
            <div className={`w-3.5 h-3.5 rounded-full mt-1 flex-shrink-0 z-10 ring-4 ring-white ${i === events.length - 1 ? "bg-green-500" : "bg-slate-300"}`} />
            <div>
              <p className="text-sm font-medium text-slate-900">{e.label}</p>
              <p className="text-xs text-slate-400">{formatDateTime(e.date)}</p>
              {e.detail && <p className="text-xs text-slate-500 mt-1 italic">{e.detail}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}