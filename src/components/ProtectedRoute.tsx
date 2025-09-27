import React from "react";
import { Navigate } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAdmin();

  // ✅ Wait until admin state is fully loaded
  if (isLoading) {
    return <div>Loading...</div>; // or show a spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
