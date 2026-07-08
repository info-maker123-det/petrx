import React from "react";
import { Link } from "react-router-dom";

const CHARCOAL = "#3F3F3F";
const MAGENTA = "#FF008C";

/**
 * Pure inline-SVG PetRx logo — line-art dog mark + "PetRx" wordmark.
 * Transparent background (blends on any surface), infinitely scalable.
 */
export default function Logo({ className = "", onDark = false, to = "/" }) {
  const ink = onDark ? "#F5F3EF" : CHARCOAL;
  return (
    <Link to={to} aria-label="PetRx home" className={`inline-flex items-center ${className}`}>
      <svg
        viewBox="0 0 160 40"
        className="h-8 md:h-9 w-auto"
        role="img"
        aria-label="PetRx"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Dog line-art icon */}
        <g transform="translate(2 2)">
          <path
            d="M5 32 C3 26 4 19 10 15 C12 13 14 13 15 10 C16 4 21 1 25 3 C29 5 28 11 24 12 C30 12 35 15 38 19 C41 22 40 26 36 26 C33 26 31 24 29 25 C24 27 19 30 14 31 C11 32 8 32 5 32 Z"
            stroke={ink}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="22" cy="16" r="1.5" fill={ink} />
        </g>
        {/* Wordmark */}
        <text
          x="52"
          y="29"
          fontFamily="Quicksand, ui-sans-serif, system-ui, sans-serif"
          fontWeight="700"
          fontSize="26"
          fill={MAGENTA}
          letterSpacing="0.5"
        >
          PetRx
        </text>
      </svg>
    </Link>
  );
}