import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { base44 } from "@/api/base44Client";

export default function AdminRoute({ unauthenticatedElement, unauthorizedElement }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.me()
      .then((u) => setUser(u))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#1A1C1E]">
        <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return unauthenticatedElement || <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return unauthorizedElement || <Navigate to="/" replace />;
  }

  return <Outlet />;
}