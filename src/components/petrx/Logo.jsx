import React from "react";
import { Link } from "react-router-dom";

const LOGO_URL = "https://media.base44.com/images/public/6a4dc0dbd2a6ae29bc765da4/dc10b251f_Screenshot2026-07-08at35748AM.png";

export default function Logo({ className = "", onDark = false, to = "/" }) {
  return (
    <Link
      to={to}
      aria-label="PetRx home"
      className={`inline-flex items-center overflow-hidden ${onDark ? "bg-white rounded-xl px-2.5 py-1" : ""} ${className}`}
    >
      <img src={LOGO_URL} alt="PetRx" className="h-8 md:h-9 w-auto" />
    </Link>
  );
}