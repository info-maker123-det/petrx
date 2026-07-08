import React from "react";
import { Link } from "react-router-dom";

const LOGO_URL =
  "https://media.base44.com/images/public/6a4dc0dbd2a6ae29bc765da4/152feb3a5_ChatGPTImageJul82026at04_16_36AM.png";

/**
 * PetRx logo — uses the official brand asset.
 * On light surfaces, `mix-blend-multiply` drops the white background so the
 * logo blends seamlessly. On dark surfaces (footer) the logo sits on a white
 * rounded "plate" so it reads cleanly.
 */
export default function Logo({ className = "", onDark = false, to = "/" }) {
  const img = (
    <img
      src={LOGO_URL}
      alt="PetRx"
      className={`h-8 md:h-9 w-auto ${onDark ? "" : "mix-blend-multiply"}`}
    />
  );

  return (
    <Link to={to} aria-label="PetRx home" className={`inline-flex items-center ${className}`}>
      {onDark ? (
        <span className="bg-white rounded-full px-3 py-1.5 inline-flex items-center">
          {img}
        </span>
      ) : (
        img
      )}
    </Link>
  );
}