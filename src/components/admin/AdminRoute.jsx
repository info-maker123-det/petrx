import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { base44 } from "@/api/base44Client";

export default function AdminRoute({ unauthenticatedElement, unauthorizedElement }) {
  const [state, setState] = useState({ loading: true, user: null });

  useEffect(() => {
    base44.auth
      .me()
      .then((user) => setState({ loading: false, user }))
      .catch(() => setState({ loading: false, user: null }));
  }, []);

  if (state.loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#1A1C1E]">
        <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!state.user) {
    return unauthenticatedElement || <Navigate to="/login" replace />;
  }

  if (state.user.role !== "admin") {
    return unauthorizedElement || <Navigate to="/" replace />;
  }

  return <Outlet />;
}