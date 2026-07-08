import React from "react";

const LOGO_URL = "https://media.base44.com/images/public/6a4dc0dbd2a6ae29bc765da4/dc10b251f_Screenshot2026-07-08at35748AM.png";

/**
 * The advisor avatar — the dog mark cropped from the left side of the PetRx logo.
 */
export default function LogoMark({ size = 32, className = "" }) {
  return (
    <span
      className={`inline-flex items-center justify-center bg-white border border-border shadow-sm flex-shrink-0 overflow-hidden ${className}`}
      style={{ width: size, height: size, borderRadius: "50%" }}
    >
      <img
        src={LOGO_URL}
        alt="PetRx Advisor"
        className="w-full h-full"
        style={{ objectFit: "cover", objectPosition: "left center" }}
      />
    </span>
  );
}