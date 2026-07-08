import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Shield } from "lucide-react";

export default function ContactDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-sm font-medium text-ink/70 hover:text-ink transition-colors"
      >
        Contact <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-2 w-44 bg-white border border-border rounded-xl shadow-lg py-1.5 z-50">
          <Link
            to="/contact"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm text-ink/70 hover:bg-secondary hover:text-ink transition-colors"
          >
            Contact Us
          </Link>
          <Link
            to="/admin"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink/70 hover:bg-secondary hover:text-ink transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-sage" /> Staff Portal
          </Link>
        </div>
      )}
    </div>
  );
}