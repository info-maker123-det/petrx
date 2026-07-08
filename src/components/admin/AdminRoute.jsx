import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";

export default function AdminRoute({ unauthenticatedElement, unauthorizedElement }) {
  const { user, isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
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