import React, { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Activity, Users, Eye, UserCheck, MapPin, Monitor, Smartphone, Tablet, Globe, Loader2, RefreshCw } from "lucide-react";

function Bar({ label, count, total, color }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="mb-2.5 last:mb-0">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-slate-600 capitalize">{label}</span>
        <span className="text-xs text-slate-400">{count} ({pct}%)</span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function VisitorAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    base44.functions
      .invoke("getVisitorAnalytics", {})
      .then((res) => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [load]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center justify-center py-16">
        <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <p className="text-sm text-slate-400">Visitor analytics unavailable.</p>
      </div>
    );
  }

  const deviceTotal = Object.values(data.deviceBreakdown || {}).reduce((a, b) => a + b, 0);
  const browserTotal = Object.values(data.browserBreakdown || {}).reduce((a, b) => a + b, 0);
  const deviceIcons = { mobile: Smartphone, tablet: Tablet, desktop: Monitor };
  const deviceColors = { mobile: "bg-blue-500", tablet: "bg-violet-500", desktop: "bg-slate-700" };

  const statCards = [
    { label: "Active Now", value: data.activeNow, icon: Activity, tint: "bg-green-50 text-green-600" },
    { label: "Visits Today", value: data.visitsToday, icon: Eye, tint: "bg-blue-50 text-blue-600" },
    { label: "Total Visitors", value: data.totalVisitors, icon: Users, tint: "bg-violet-50 text-violet-600" },
    { label: "Logged-in Users", value: data.loggedInVisitors, icon: UserCheck, tint: "bg-amber-50 text-amber-600" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-slate-700" />
          <h2 className="font-display text-lg text-slate-900">Visitor Analytics</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Live
          </span>
          <button onClick={load} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className={`w-9 h-9 rounded-xl ${card.tint} flex items-center justify-center mb-3`}>
              <card.icon className="w-4 h-4" />
            </div>
            <p className="font-display text-2xl text-slate-900">{card.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-slate-400" />
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Top Locations</h3>
          </div>
          {data.topLocations?.length > 0 ? (
            <div className="space-y-2">
              {data.topLocations.map((loc, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-slate-700 truncate">{loc.location}</span>
                  <span className="text-xs font-medium text-slate-400 ml-2">{loc.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">No location data yet.</p>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Monitor className="w-4 h-4 text-slate-400" />
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Devices</h3>
          </div>
          {deviceTotal > 0 ? (
            Object.entries(data.deviceBreakdown).map(([device, count]) => (
              <Bar key={device} label={device} count={count} total={deviceTotal} color={deviceColors[device] || "bg-slate-500"} />
            ))
          ) : (
            <p className="text-sm text-slate-400">No device data yet.</p>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-4 h-4 text-slate-400" />
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Browsers</h3>
          </div>
          {browserTotal > 0 ? (
            Object.entries(data.browserBreakdown).map(([browser, count]) => (
              <Bar key={browser} label={browser} count={count} total={browserTotal} color="bg-emerald-500" />
            ))
          ) : (
            <p className="text-sm text-slate-400">No browser data yet.</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 mt-5">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Recent Visitors</h3>
        {data.recentVisitors?.length > 0 ? (
          <div className="space-y-1">
            {data.recentVisitors.map((v, i) => {
              const Icon = v.device_type === "mobile" ? Smartphone : v.device_type === "tablet" ? Tablet : Monitor;
              return (
                <div key={i} className="flex items-center justify-between gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-slate-700 truncate">
                        {v.city ? `${v.city}, ${v.state || v.country}` : "Unknown location"}
                        {v.is_logged_in && <span className="ml-2 text-xs text-green-600 font-medium">· {v.user_email}</span>}
                      </p>
                      <p className="text-xs text-slate-400 truncate">Viewing {v.page}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 flex-shrink-0">
                    {v.created_date ? new Date(v.created_date).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : ""}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-slate-400">No visitors tracked yet.</p>
        )}
      </div>
    </div>
  );
}