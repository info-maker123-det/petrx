import React from "react";
import { Link } from "react-router-dom";

const LOGO_URL =
  "https://media.base44.com/images/public/6a4dc0dbd2a6ae29bc765da4/7b3615369_Screenshot2026-07-07at113231PM.png";

export default function Logo({ className = "", onDark = false, to = "/" }) {
  return (
    <Link to={to} className={`inline-flex items-center ${className}`}>
      <img
        src={LOGO_URL}
        alt="PetRx"
        className={onDark ? "h-8 md:h-9 rounded-lg bg-white px-2 py-1" : "h-8 md:h-9"}
      />
    </Link>
  );
}