import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../commons/AuthContext";

const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();

  // Debug log for production
  React.useEffect(() => {
    if (!loading) {
      console.log("[ProtectedRoute] Status:", user ? "Authenticated" : "Unauthenticated");
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
