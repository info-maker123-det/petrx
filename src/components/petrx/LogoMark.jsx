import React from "react";
import DogIcon from "./DogIcon";

/**
 * The advisor avatar — the dog mark from the PetRx logo, set in a clean circle.
 */
export default function LogoMark({ size = 32, className = "" }) {
  const dogSize = Math.round(size * 0.64);
  return (
    <span
      className={`inline-flex items-center justify-center bg-white border border-border shadow-sm flex-shrink-0 ${className}`}
      style={{ width: size, height: size, borderRadius: "50%" }}
    >
      <DogIcon size={dogSize} color="#4a4a4a" strokeWidth={2.4} />
    </span>
  );
}