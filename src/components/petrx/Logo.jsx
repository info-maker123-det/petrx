import React from "react";
import { Link } from "react-router-dom";

const LOGO_URL = "https://media.base44.com/images/public/6a4dc0dbd2a6ae29bc765da4/64fda4022_generated_image.png";

export default function Logo({ className = "", onDark = false, to = "/" }) {
  return (
    <Link
      to={to}
      aria-label="PetRx home"
      className={`inline-flex items-center ${className}`}
    >
      <img src={LOGO_URL} alt="PetRx" className="h-8 md:h-9 w-auto" />
    </Link>
  );
}