import React from "react";
import { FileText, Stethoscope, Package, Truck, CheckCircle, XCircle, ExternalLink, Clock } from "lucide-react";

const STAGES = [
  { key: "submitted", label: "Received", icon: FileText, desc: "We've received your prescription request." },
  { key: "vet_request_sent", label: "Verifying", icon: Stethoscope, desc: "Contacting your veterinarian for approval." },
  { key: "vet_response_received", label: "Approved", icon: CheckCircle, desc: "Your veterinarian approved the prescription." },
  { key: "sent_to_sister_pharmacy", label: "Preparing", icon: Package, desc: "Your medication is being dispensed." },
  { key: "tracking_entered", label: "Shipped", icon: Truck, desc: "Your order is on its way." },
  { key: "delivered", label: "Delivered", icon: CheckCircle, desc: "Delivered to your address." },
];

function trackingUrl(num) {
  const n = (num || "").trim().toUpperCase();
  if (/^(1Z|[\d]{12,})/.test(n)) return `https://www.ups.com/track?tracknum=${encodeURIComponent(n)}`;
  if (/^\d{20,22}$/.test(n)) return `https://www.fedex.com/fedextrack/?trknbr=${encodeURIComponent(n)}`;
  return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${encodeURIComponent(n)}`;
}

export default function PrescriptionTracker({ rx }) {
  const status = rx.internal_status || "submitted";

  if (status === "rejected") {
    return (
      <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl">
        <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
          <XCircle className="w-5 h-5 text-red-600" />
        </div>
        <div>
          <p className="font-semibold text-red-900 text-sm">Prescription Not Verified</p>
          <p className="text-xs text-red-700 mt-0.5">
            {rx.vet_response_notes || "We were unable to verify this prescription with your veterinarian."}
          </p>
        </div>
      </div>
    );
  }

  if (status === "needs_more_info") {
    return (
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
        <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
          <Clock className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <p className="font-semibold text-amber-900 text-sm">More Information Needed</p>
          <p className="text-xs text-amber-700 mt-0.5">
            {rx.vet_response_notes || "Our pharmacy team needs additional details to proceed."}
          </p>
        </div>
      </div>
    );
  }

  const currentIdx = STAGES.findIndex((s) => s.key === status);
  const showTracking = rx.tracking_number && (status === "tracking_entered" || status === "delivered");

  return (
    <div>
      <div className="space-y-1">
        {STAGES.map((stage, idx) => {
          const isComplete = idx < currentIdx;
          const isCurrent = idx === currentIdx;
          const Icon = stage.icon;
          return (
            <div key={stage.key} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                    isComplete
                      ? "bg-green-500 text-white"
                      : isCurrent
                      ? "bg-sage text-white ring-4 ring-sage/20"
                      : "bg-secondary text-ink/30"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                {idx < STAGES.length - 1 && (
                  <div className={`w-0.5 h-6 ${isComplete ? "bg-green-500" : "bg-border"}`} />
                )}
              </div>
              <div className="pt-1 pb-3">
                <p className={`text-sm font-semibold ${isComplete || isCurrent ? "text-ink" : "text-ink/40"}`}>
                  {stage.label}
                </p>
                {(isComplete || isCurrent) && (
                  <p className="text-xs text-ink/50 mt-0.5">{stage.desc}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showTracking && (
        <a
          href={trackingUrl(rx.tracking_number)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-2 px-4 py-2.5 bg-sage/10 text-sage rounded-full text-xs font-semibold hover:bg-sage/20 transition-colors"
        >
          <Truck className="w-3.5 h-3.5" />
          Track: {rx.tracking_number}
          <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </div>
  );
}