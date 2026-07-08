import React from "react";

/**
 * PetRx brand dog mark — a continuous-line dog head in profile (facing right).
 * Charcoal by default to match the brand asset; color is overridable via `color`.
 * Shared by the full Logo and the advisor LogoMark so both use the identical dog.
 */
export default function DogIcon({ size = 36, color = "currentColor", strokeWidth = 2.4, className = "" }) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M13 39 C11 33, 11 27, 14 22 C16 18, 20 16, 24 16 C23 12, 25 9, 28 10 C31 11, 30 15, 27 16 C31 17, 34 19, 36 22 C38 25, 38 28, 36 29 C34 30, 32 29, 31 27 C29 29, 26 30, 23 30 C21 34, 18 37, 14 39" />
      <circle cx="29" cy="20" r="1.3" fill={color} stroke="none" />
    </svg>
  );
}