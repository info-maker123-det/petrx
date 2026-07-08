import React from "react";

const LOGO_URL =
  "https://media.base44.com/images/public/6a4dc0dbd2a6ae29bc765da4/152feb3a5_ChatGPTImageJul82026at04_16_36AM.png";

/**
 * Advisor avatar — the dog mark cropped from the official PetRx logo,
 * shown on a white circular chip so it blends on any surface.
 */
export default function LogoMark({ size = 32, className = "" }) {
  return (
    <span
      className={`inline-flex items-center justify-center flex-shrink-0 overflow-hidden bg-white ${className}`}
      style={{ width: size, height: size, borderRadius: "50%" }}
    >
      <img
        src={LOGO_URL}
        alt="PetRx Advisor"
        className="w-full h-full object-cover"
        style={{ objectPosition: "18% center" }}
      />
    </span>
  );
}