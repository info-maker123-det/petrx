import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Printer, Send, CheckCircle, XCircle, Truck, Package, RefreshCw, AlertCircle, Loader2 } from "lucide-react";
import { effectiveRxStatus, CUSTOMER_STATUS_MAP, printHtml } from "@/lib/adminUtils";
import { generateVetVerificationPacket, generateSisterPharmacyPacket } from "@/lib/prescriptionPackets";

const METHODS = [
  { value: "fax", label: "Fax" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
];

const RESPONSES = [
  { value: "approved", label: "Approved", color: "border-green-500 bg-green-50 text-green-700" },
  { value: "denied", label: "Denied", color: "border-red-500 bg-red-50 text-red-700" },
  { value: "needs_more_info", label: "Needs More Info", color: "border-orange-500 bg-orange-50 text-orange-700" },
];

export default function PrescriptionWorkflow({ rx, onUpdate }) {
  const status = effectiveRxStatus(rx);
  const [method, setMethod] = useState("fax");
  const [response, setResponse] = useState("approved");
  const [responseNotes, setResponseNotes] = useState("");
  const [tracking, setTracking] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const update = async (data) => {
    setSaving(true);
    setError(null);
    try {
      await base44.entities.Prescription.update(rx.id, data);
      onUpdate();
    } catch (err) {
      setError(err.message || "Failed to update prescription");
    } finally {
      setSaving(false);
    }
  };

  const now = () => new Date().toISOString();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center">
          <Package className="w-3.5 h-3.5" />
        </div>
        <h3 className="font-display text-lg text-slate-900">Workflow Actions</h3>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <p className="text-xs text-red-700">{error}</p>
        </div>
      )}

      {saving && (
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
          <Loader2 className="w-4 h-4 animate-spin" /> Saving...
        </div>
      )}

      {/* Step 1: Submitted → Send vet verification */}
      {status === "submitted" && (
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Step 1: Vet Verification</p>
            <p className="text-sm text-slate-600 mb-3">Generate a verification request to send to the prescribing veterinarian.</p>
            <button
              onClick={() => printHtml("Vet Verification Request", generateVetVerificationPacket(rx))}
              className="w-full flex items-center justify-center gap-2 py-2.5 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors mb-3"
            >
              <Printer className="w-4 h-4" /> Print Verification Packet
            </button>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-2">Method used to send:</p>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {METHODS.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setMethod(m.value)}
                  className={`py-2 rounded-lg text-xs font-medium transition-colors ${
                    method === m.value ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => update({
                internal_status: "vet_request_sent",
                status: CUSTOMER_STATUS_MAP.vet_request_sent,
                vet_request_method: method,
                vet_request_sent_date: now(),
              })}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" /> Mark as Sent via {method}
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Log vet response */}
      {status === "vet_request_sent" && (
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Step 2: Log Vet Response</p>
            <p className="text-sm text-slate-600 mb-3">Sent via {rx.vet_request_method} on {new Date(rx.vet_request_sent_date).toLocaleDateString()}.</p>
            <div className="space-y-2 mb-3">
              {RESPONSES.map((r) => (
                <button
                  key={r.value}
                  onClick={() => setResponse(r.value)}
                  className={`w-full py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                    response === r.value ? r.color : "border-slate-200 text-slate-500 hover:border-slate-300"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
            <textarea
              value={responseNotes}
              onChange={(e) => setResponseNotes(e.target.value)}
              placeholder="Vet response notes..."
              rows={3}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-400 mb-3"
            />
            <button
              onClick={() => update({
                internal_status: response === "approved" ? "vet_response_received" : response === "denied" ? "rejected" : "needs_more_info",
                status: CUSTOMER_STATUS_MAP[response === "approved" ? "vet_response_received" : response === "denied" ? "rejected" : "needs_more_info"],
                vet_response: response,
                vet_response_date: now(),
                vet_response_notes: responseNotes,
              })}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" /> Submit Response
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Send to sister pharmacy */}
      {status === "vet_response_received" && (
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Step 3: Sister Pharmacy Handoff</p>
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
              <p className="text-xs text-green-700">Vet approved on {new Date(rx.vet_response_date).toLocaleDateString()}</p>
            </div>
            <p className="text-sm text-slate-600 mb-3">Generate a dispensing packet to send to our sister pharmacy.</p>
            <button
              onClick={() => printHtml("Dispensing & Shipping Request", generateSisterPharmacyPacket(rx))}
              className="w-full flex items-center justify-center gap-2 py-2.5 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors mb-3"
            >
              <Printer className="w-4 h-4" /> Print Dispensing Packet
            </button>
            <button
              onClick={() => update({
                internal_status: "sent_to_sister_pharmacy",
                sister_pharmacy_sent_date: now(),
              })}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              <Package className="w-4 h-4" /> Mark as Sent to Sister Pharmacy
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Enter tracking */}
      {status === "sent_to_sister_pharmacy" && (
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Step 4: Enter Tracking</p>
            <p className="text-sm text-slate-600 mb-3">Sent to sister pharmacy on {rx.sister_pharmacy_sent_date ? new Date(rx.sister_pharmacy_sent_date).toLocaleDateString() : "—"}. Enter the tracking number once shipped.</p>
            <input
              value={tracking}
              onChange={(e) => setTracking(e.target.value)}
              placeholder="Tracking number"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-400 mb-3"
            />
            <button
              onClick={() => update({
                internal_status: "tracking_entered",
                tracking_number: tracking,
                tracking_entered_date: now(),
              })}
              disabled={saving || !tracking}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              <Truck className="w-4 h-4" /> Save Tracking Number
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Mark delivered */}
      {status === "tracking_entered" && (
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Step 5: Confirm Delivery</p>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-3">
              <p className="text-xs text-slate-400">Tracking Number</p>
              <p className="text-sm font-mono text-slate-800">{rx.tracking_number}</p>
            </div>
            <button
              onClick={() => update({
                internal_status: "delivered",
                status: CUSTOMER_STATUS_MAP.delivered,
                delivered_date: now(),
              })}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" /> Mark as Delivered
            </button>
          </div>
        </div>
      )}

      {/* Needs more info */}
      {status === "needs_more_info" && (
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Needs More Information</p>
            {rx.vet_response_notes && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 mb-3">
                <p className="text-xs text-orange-700">{rx.vet_response_notes}</p>
              </div>
            )}
            <button
              onClick={() => printHtml("Vet Verification Request", generateVetVerificationPacket(rx))}
              className="w-full flex items-center justify-center gap-2 py-2.5 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors mb-3"
            >
              <Printer className="w-4 h-4" /> Print Verification Packet
            </button>
            <p className="text-xs text-slate-400 mb-2">Method to re-send:</p>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {METHODS.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setMethod(m.value)}
                  className={`py-2 rounded-lg text-xs font-medium transition-colors ${
                    method === m.value ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => update({
                internal_status: "vet_request_sent",
                vet_request_method: method,
                vet_request_sent_date: now(),
              })}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              <RefreshCw className="w-4 h-4" /> Re-send Vet Request
            </button>
          </div>
        </div>
      )}

      {/* Delivered */}
      {status === "delivered" && (
        <div className="text-center py-4">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-sm font-medium text-slate-900">Prescription Fulfilled</p>
          <p className="text-xs text-slate-400 mt-1">Delivered on {rx.delivered_date ? new Date(rx.delivered_date).toLocaleDateString() : "—"}</p>
        </div>
      )}

      {/* Rejected */}
      {status === "rejected" && (
        <div className="text-center py-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
            <XCircle className="w-6 h-6 text-red-600" />
          </div>
          <p className="text-sm font-medium text-slate-900">Prescription Rejected</p>
          {rx.vet_response_notes && <p className="text-xs text-slate-500 mt-1">{rx.vet_response_notes}</p>}
        </div>
      )}
    </div>
  );
}