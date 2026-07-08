import React from "react";
import { Plus } from "lucide-react";

export default function LogoMark({ size = 32, className = "" }) {
  const iconSize = Math.round(size * 0.55);
  const radius = Math.round(size * 0.28);
  return (
    <span
      className={`inline-flex items-center justify-center bg-sage shadow-sm flex-shrink-0 ${className}`}
      style={{ width: size, height: size, borderRadius: radius }}
    >
      <Plus className="text-white" strokeWidth={2.5} style={{ width: iconSize, height: iconSize }} />
    </span>
  );
}