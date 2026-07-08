import React from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

export default function Logo({ className = "", onDark = false, to = "/" }) {
  return (
    <Link to={to} aria-label="PetRx home" className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-sage shadow-sm">
        <Plus className="w-5 h-5 text-white" strokeWidth={2.5} />
      </span>
      <span className="flex items-baseline">
        <span className={`font-display text-[1.75rem] leading-none ${onDark ? "text-white" : "text-ink"}`}>Pet</span>
        <span className="font-display text-[1.75rem] leading-none text-sage">Rx</span>
      </span>
    </Link>
  );
}