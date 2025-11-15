import { useAuth } from "./AuthContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function Root() {
  const { user, loading } = useAuth();
  const location = useLocation();

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
  // However, allow access to /update-password even if authenticated, as password recovery requires it.
  if (user && location.pathname !== "/update-password") {
    return <Navigate to="/dashboard" replace />;
  }

  // If no user, or if on /update-password, render the public routes (landing, sign-in, etc.)
  return <Outlet />;
}
