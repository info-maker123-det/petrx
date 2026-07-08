import React from "react";
import { useNavigate } from "react-router-dom";

// Renders a button (valid inside a <Link>) that navigates to the shop filtered by `param=value`.
// Use anywhere a brand, category, pet type, or issue is mentioned as text.
export default function FilterLink({ param, value, children, className }) {
  const navigate = useNavigate();
  if (!value) return <span className={className}>{children}</span>;
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(`/shop?${param}=${encodeURIComponent(value)}`);
      }}
      className={className}
    >
      {children}
    </button>
  );
}