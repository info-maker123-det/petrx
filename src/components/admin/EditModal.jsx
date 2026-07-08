import React from "react";

export default function EditModal({ open, onClose, title, children, onSave, saving, saveLabel = "Save Changes" }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="font-display text-xl text-slate-900 mb-4">{title}</h2>
          {children}
          <div className="flex gap-3 mt-6">
            <button onClick={onClose} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button onClick={onSave} disabled={saving} className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 disabled:opacity-50 transition-colors">
              {saving ? "Saving..." : saveLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}