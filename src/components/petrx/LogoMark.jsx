import React from "react";

const CHARCOAL = "#3F3F3F";

/**
 * The advisor avatar — the dog mark from the PetRx logo as a crisp vector.
 * Transparent fill with a soft sage tint so it reads on light surfaces.
 */
export default function LogoMark({ size = 32, className = "" }) {
  return (
    <span
      className={`inline-flex items-center justify-center flex-shrink-0 ${className}`}
      style={{ width: size, height: size, borderRadius: "50%" }}
    >
      <svg
        viewBox="0 0 44 40"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="PetRx Advisor"
      >
        <path
          d="M7 34 C5 28 6 21 12 17 C14 15 16 15 17 12 C18 6 23 3 27 5 C31 7 30 13 26 14 C32 14 37 17 40 21 C43 24 42 28 38 28 C35 28 33 26 31 27 C26 29 21 32 16 33 C13 34 10 34 7 34 Z"
          stroke={CHARCOAL}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="24" cy="18" r="1.6" fill={CHARCOAL} />
      </svg>
    </span>
  );
}