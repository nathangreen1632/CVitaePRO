import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth.ts";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, token } = useAuth();

  const isAdmin = () => {
    const tokenData = token ? JSON.parse(atob(token.split(".")[1])) : null;
    return tokenData?.role === "admin";
  };

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
