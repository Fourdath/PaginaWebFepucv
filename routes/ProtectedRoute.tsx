import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth, Role } from "../context/AuthContext";

type Props = {
  children: React.ReactNode;
  allow?: Role[];
};

const ProtectedRoute: React.FC<Props> = ({ children, allow }) => {
  const { user, role, loading } = useAuth();

  if (loading) return <div>Cargando sesión...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (allow && allow.length > 0) {
    if (!role) return <Navigate to="/login" replace />;
    if (!allow.includes(role)) return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
