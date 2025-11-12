import React from "react";
import { useAuth } from "./AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export default function Root() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        }}
      >
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // If the auth state is loaded and there is a user, redirect to the dashboard.
  // This prevents the landing page from ever showing for a logged-in user.
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // If no user, render the public routes (landing, sign-in, etc.)
  return <Outlet />;
}
