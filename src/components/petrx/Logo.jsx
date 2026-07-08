import React from "react";
import { Link } from "react-router-dom";
import DogIcon from "./DogIcon";

export default function Logo({ className = "", onDark = false, to = "/" }) {
  const dogColor = onDark ? "text-white" : "text-brand-charcoal";
  return (
    <Link to={to} aria-label="PetRx home" className={`inline-flex items-center gap-2 ${className}`}>
      <DogIcon size={36} color="currentColor" strokeWidth={2.4} className={dogColor} />
      <span className="font-logo font-bold text-[1.6rem] leading-none tracking-tight text-brand-magenta">PetRx</span>
    </Link>
  );
}