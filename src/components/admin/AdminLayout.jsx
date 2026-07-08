import React, { useState, useEffect } from "react";
import { Outlet, Link, NavLink } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import {
  LayoutDashboard, FileText, Package, Mail, Pill,
  Stethoscope, DollarSign, ExternalLink, Menu, X, LogOut,
} from "lucide-react";

const NAV = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/prescriptions", label: "Prescriptions", icon: FileText },
  { to: "/admin/orders", label: "Orders", icon: Package },
  { to: "/admin/messages", label: "Messages", icon: Mail },
  { to: "/admin/products", label: "Products", icon: Pill },
  { to: "/admin/vets", label: "Vet Directory", icon: Stethoscope },
  { to: "/admin/finance", label: "Finance", icon: DollarSign },
];

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const handleLogout = async () => {
    await base44.auth.logout();
    window.location.href = "/login";
  };

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
      isActive ? "bg-white/10 text-white" : "text-white/50 hover:text-white hover:bg-white/5"
    }`;

  const SidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-6 flex items-center justify-between">
        <Link to="/admin" className="font-display text-xl text-white" onClick={() => setMobileOpen(false)}>
          PetRx <span className="text-white/40">Admin</span>
        </Link>
        <button className="md:hidden text-white/60" onClick={() => setMobileOpen(false)}>
          <X className="w-5 h-5" />
        </button>
      </div>
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {NAV.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={navClass} onClick={() => setMobileOpen(false)}>
            <item.icon className="w-4 h-4" /> {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10 space-y-1">
        {user && (
          <div className="px-4 py-2">
            <p className="text-sm text-white font-medium truncate">{user.full_name || user.email}</p>
            <p className="text-xs text-white/40">Administrator</p>
          </div>
        )}
        <Link to="/" className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors px-4 py-2">
          <ExternalLink className="w-4 h-4" /> View Store
        </Link>
        <button onClick={handleLogout} className="w-full flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors px-4 py-2">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F6F7]">
      <aside className="fixed inset-y-0 left-0 w-64 bg-[#1A1C1E] hidden md:flex flex-col z-30">
        {SidebarContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-[#1A1C1E] flex flex-col">
            {SidebarContent}
          </aside>
        </div>
      )}

      <div className="md:hidden sticky top-0 z-40 bg-[#1A1C1E] text-white px-4 py-3 flex items-center justify-between">
        <button onClick={() => setMobileOpen(true)}>
          <Menu className="w-5 h-5" />
        </button>
        <Link to="/admin" className="font-display text-lg">PetRx Admin</Link>
        <div className="w-5" />
      </div>

      <main className="md:ml-64 p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}