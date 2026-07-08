export const RX_INTERNAL_STAGES = [
  { value: "submitted", label: "Submitted", color: "bg-slate-100 text-slate-700" },
  { value: "vet_request_sent", label: "Vet Request Sent", color: "bg-amber-100 text-amber-700" },
  { value: "vet_response_received", label: "Vet Response Received", color: "bg-violet-100 text-violet-700" },
  { value: "sent_to_sister_pharmacy", label: "Sent to Sister Pharmacy", color: "bg-indigo-100 text-indigo-700" },
  { value: "tracking_entered", label: "Tracking Entered", color: "bg-cyan-100 text-cyan-700" },
  { value: "delivered", label: "Delivered", color: "bg-green-100 text-green-700" },
  { value: "needs_more_info", label: "Needs More Info", color: "bg-orange-100 text-orange-700" },
  { value: "rejected", label: "Rejected", color: "bg-red-100 text-red-700" },
];

export const ORDER_STATUS_CONFIG = {
  pending: { label: "Order Placed", color: "bg-slate-100 text-slate-700" },
  processing: { label: "Processing", color: "bg-amber-100 text-amber-700" },
  shipped: { label: "Shipped", color: "bg-cyan-100 text-cyan-700" },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-700" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700" },
};

export const MESSAGE_STATUS_CONFIG = {
  new: { label: "New", color: "bg-blue-100 text-blue-700" },
  read: { label: "Read", color: "bg-slate-100 text-slate-700" },
  responded: { label: "Responded", color: "bg-amber-100 text-amber-700" },
  resolved: { label: "Resolved", color: "bg-green-100 text-green-700" },
};

export const CUSTOMER_STATUS_MAP = {
  submitted: "pending",
  vet_request_sent: "in_review",
  vet_response_received: "in_review",
  needs_more_info: "in_review",
  sent_to_sister_pharmacy: "approved",
  tracking_entered: "approved",
  delivered: "fulfilled",
  rejected: "rejected",
};

export function getRxStatusConfig(status) {
  return RX_INTERNAL_STAGES.find((s) => s.value === status) || { label: status || "Unknown", color: "bg-slate-100 text-slate-700" };
}

export function effectiveRxStatus(rx) {
  return rx.internal_status || "submitted";
}

export function formatDateTime(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit",
  });
}

export function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount || 0);
}

export function printHtml(title, bodyContent) {
  const w = window.open("", "_blank", "width=800,height=900");
  if (!w) {
    alert("Please allow popups to print documents.");
    return;
  }
  w.document.write(`<!DOCTYPE html><html><head><title>${title}</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500;600;700&display=swap');
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'Inter', sans-serif; color: #1A1C1E; padding: 48px; line-height: 1.6; }
      .letterhead { border-bottom: 3px solid #4F6D7A; padding-bottom: 20px; margin-bottom: 32px; display: flex; justify-content: space-between; align-items: end; }
      .brand { font-family: 'DM Serif Display', serif; font-size: 32px; }
      .brand-accent { color: #4F6D7A; }
      .meta { text-align: right; font-size: 13px; color: #6b7280; line-height: 1.5; }
      h1 { font-family: 'DM Serif Display', serif; font-size: 24px; margin-bottom: 16px; }
      h2 { font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #4F6D7A; margin-bottom: 8px; margin-top: 24px; font-weight: 600; }
      .field { margin-bottom: 6px; }
      .label { font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; }
      .value { font-size: 15px; font-weight: 500; }
      .section { margin-bottom: 20px; }
      .badge { display: inline-block; padding: 4px 12px; border-radius: 999px; background: #f0f4f5; color: #4F6D7A; font-size: 12px; font-weight: 600; }
      .box { border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin-top: 16px; }
      .checkbox-row { display: flex; gap: 32px; margin: 20px 0; }
      .checkbox-item { font-size: 15px; }
      .sig-line { border-bottom: 1px solid #1A1C1E; width: 300px; margin-top: 40px; height: 1px; }
      .footer { margin-top: 48px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 11px; color: #9ca3af; text-align: center; }
      @media print { body { padding: 24px; } }
    </style>
  </head><body>${bodyContent}
    <div class="footer">PetRx Pharmacy &middot; Licensed in California &middot; (888) 555-1234 &middot; care@petrx.com<br/>Confidential &mdash; Contains Protected Health Information</div>
  </body></html>`);
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 400);
}