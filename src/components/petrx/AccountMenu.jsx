import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { User, LogOut, ChevronDown, LogIn } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

export default function AccountMenu() {
  const { isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSignOut = () => {
    setOpen(false);
    logout();
  };

  if (!isAuthenticated) {
    return (
      <Link
        to="/login"
        aria-label="Sign in"
        className="inline-flex items-center justify-center w-9 h-9 sm:w-auto sm:h-auto sm:gap-2 sm:px-4 sm:py-2 border border-border rounded-xl text-sm font-medium text-ink hover:border-sage hover:text-sage transition-colors"
      >
        <LogIn className="w-5 h-5 sm:w-4 sm:h-4" />
        <span className="hidden sm:inline">Sign In</span>
      </Link>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label="My account"
        className="inline-flex items-center justify-center w-9 h-9 sm:w-auto sm:h-auto sm:gap-2 sm:px-4 sm:py-2 border border-border rounded-xl text-sm font-medium text-ink hover:border-sage hover:text-sage transition-colors"
      >
        <User className="w-5 h-5 sm:w-4 sm:h-4" />
        <span className="hidden sm:inline">Account</span>
        <ChevronDown className="hidden sm:block w-3.5 h-3.5" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-border rounded-2xl shadow-lg overflow-hidden z-50">
          <Link
            to="/dashboard"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-ink hover:bg-secondary transition-colors"
          >
            <User className="w-4 h-4" /> My Account
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors border-t border-border"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      )}
    </div>
  );
}