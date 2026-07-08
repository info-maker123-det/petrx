import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Mail, ArrowLeft, CheckCircle, Loader2, Reply } from "lucide-react";
import { MESSAGE_STATUS_CONFIG, formatDateTime } from "@/lib/adminUtils";

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    base44.entities.ContactMessage
      .list("-created_date", 200)
      .then((data) => setMessages(data || []))
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  }, []);

  const selected = messages.find((m) => m.id === selectedId);

  const markRead = async (msg) => {
    if (msg.status === "new") {
      setUpdating(true);
      try {
        await base44.entities.ContactMessage.update(msg.id, { status: "read" });
        setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, status: "read" } : m)));
      } finally {
        setUpdating(false);
      }
    }
  };

  const markResolved = async () => {
    if (!selected) return;
    setUpdating(true);
    try {
      await base44.entities.ContactMessage.update(selected.id, { status: "resolved" });
      setMessages((prev) => prev.map((m) => (m.id === selected.id ? { ...m, status: "resolved" } : m)));
    } finally {
      setUpdating(false);
    }
  };

  const handleSelect = (msg) => {
    setSelectedId(msg.id);
    markRead(msg);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-40">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-700 rounded-full animate-spin" />
      </div>
    );
  }

  const unreadCount = messages.filter((m) => m.status === "new").length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl md:text-3xl text-slate-900 mb-1">Message Inbox</h1>
        <p className="text-slate-500 text-sm">{unreadCount} unread of {messages.length} total messages</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
        {/* Message list */}
        <div className={`${selectedId ? "hidden lg:block" : "block"}`}>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            {messages.length === 0 ? (
              <div className="p-8 text-center">
                <Mail className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">No messages yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-[70vh] overflow-y-auto">
                {messages.map((msg) => {
                  const cfg = MESSAGE_STATUS_CONFIG[msg.status] || { color: "bg-slate-100 text-slate-700", label: msg.status };
                  const isSelected = selectedId === msg.id;
                  const isUnread = msg.status === "new";
                  return (
                    <button
                      key={msg.id}
                      onClick={() => handleSelect(msg)}
                      className={`w-full text-left p-4 hover:bg-slate-50 transition-colors ${isSelected ? "bg-slate-50" : ""} ${isUnread ? "border-l-2 border-l-blue-500" : "border-l-2 border-l-transparent"}`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className={`text-sm truncate ${isUnread ? "font-semibold text-slate-900" : "font-medium text-slate-700"}`}>
                          {msg.name}
                        </p>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${cfg.color} flex-shrink-0`}>{cfg.label}</span>
                      </div>
                      <p className="text-xs text-slate-500 truncate mb-1">{msg.subject || "(no subject)"}</p>
                      <p className="text-xs text-slate-400">{formatDateTime(msg.created_date)}</p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Message detail */}
        <div className={`${selectedId ? "block" : "hidden lg:block"}`}>
          {selected ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <button onClick={() => setSelectedId(null)} className="lg:hidden inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-4">
                <ArrowLeft className="w-4 h-4" /> Back to inbox
              </button>
              <div className="mb-6 pb-6 border-b border-slate-200">
                <h2 className="font-display text-xl text-slate-900 mb-2">{selected.subject || "(no subject)"}</h2>
                <div className="flex items-center gap-3 text-sm">
                  <p className="font-medium text-slate-700">{selected.name}</p>
                  <span className="text-slate-400">·</span>
                  <a href={`mailto:${selected.email}`} className="text-blue-600 hover:underline">{selected.email}</a>
                  {selected.phone && (
                    <>
                      <span className="text-slate-400">·</span>
                      <a href={`tel:${selected.phone}`} className="text-blue-600 hover:underline">{selected.phone}</a>
                    </>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-2">{formatDateTime(selected.created_date)}</p>
              </div>
              <div className="mb-6">
                <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{selected.message}</p>
              </div>
              <div className="flex gap-3">
                <a
                  href={`mailto:${selected.email}?subject=Re: ${selected.subject || "Your message to PetRx"}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Reply className="w-4 h-4" /> Reply via Email
                </a>
                {selected.status !== "resolved" && (
                  <button
                    onClick={markResolved}
                    disabled={updating}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                    Mark as Resolved
                  </button>
                )}
                {selected.status === "resolved" && (
                  <span className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-50 text-green-700 rounded-xl text-sm font-medium">
                    <CheckCircle className="w-4 h-4" /> Resolved
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center hidden lg:block">
              <Mail className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">Select a message to view</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}