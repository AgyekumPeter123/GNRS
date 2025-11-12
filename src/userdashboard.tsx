import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "./supabaseClient";

export default function UserDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If there's no session, redirect to sign-in. This can happen on a hard refresh
    // before the AuthProvider has had a chance to fully load the session.
    if (user) {
      // We can add future data fetching here if needed
      setIsLoading(false);
    }
  }, [user, navigate]);

  // Placeholder function for handling navigation
  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/signin"); // Navigate to sign-in page after logout
  };

  const isLinkActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-inner">
          <div className="logo">
            <img
              src="/logo/GNRSlogo.png"
              alt="GNRS Logo"
              style={{ width: "32px", height: "32px" }}
            />
            <span>GNRS</span>
          </div>

          <nav className="nav">
            <button
              className={`nav-item ${
                isLinkActive("/dashboard") ? "active" : ""
              }`}
              onClick={() => handleNavigate("/dashboard")}
            >
              <span className="icon">
                <i className="bi bi-grid-1x2-fill"></i>
              </span>
              <span className="label">Dashboard</span>
            </button>

            <button
              className={`nav-item has-new ${
                isLinkActive("/messages") ? "active" : ""
              }`}
            >
              <span className="icon">
                <i className="bi bi-envelope-fill"></i>
              </span>
              <span className="label">Messages</span>
              <span className="badge">5</span>
            </button>
            <button
              className={`nav-item ${
                isLinkActive("/profile-editor") ? "active" : ""
              }`}
              onClick={() => handleNavigate("/profile-editor")}
            >
              <span className="icon">
                <i className="bi bi-person-fill"></i>
              </span>
              <span className="label">Profile</span>
            </button>

            <button
              className={`nav-item ${
                isLinkActive("/subscription") ? "active" : ""
              }`}
              onClick={() => handleNavigate("/subscription")}
            >
              <span className="icon">
                <i className="bi bi-credit-card-fill"></i>
              </span>
              <span className="label">Subscription</span>
            </button>
          </nav>

          <div className="sidebar-footer d-flex justify-content-center">
            <button className="nav-item" onClick={handleLogout}>
              <span className="icon">
                <i className="bi bi-box-arrow-left"></i>
              </span>
              <span className="label">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content" style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 0,
            // opacity: 0.05,
            opacity: 0.1,
            pointerEvents: "none",
          }}
        >
          <img
            src="/logo/GNRSlogo.png"
            alt="Watermark"
            //style={{ width: "100%", maxWidth: "400px" }}
            style={{ width: "100%", maxWidth: "600px" }}
          />
        </div>
        <header
          className="main-header"
          style={{ position: "relative", zIndex: 1 }}
        >
          <section className="welcome-banner">
            <div className="d-flex align-items-center">
              <h1 className="mb-0 h4 fw-bold">
                Welcome, {user?.user_metadata.full_name || "User"}
              </h1>
              <span className="ms-2 fs-4">👋</span>
            </div>
          </section>
        </header>

        <div
          className="container-fluid p-4"
          style={{ position: "relative", zIndex: 1 }}
        >
          {isLoading && (
            <div className="d-flex justify-content-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          {!isLoading && (
            <div className="row g-4 dashboard-cards-grid">
              {/* Personalized Feed */}
              <div className="col-lg-8" style={{ animationDelay: "0.1s" }}>
                <div className="card h-100 shadow-sm feature-card">
                  <div className="card-body p-4 text-dark">
                    <h4 className="card-title fw-bold mb-3 text-dark">
                      <i className="bi bi-person-circle me-2"></i>Personalized
                      Feed
                    </h4>
                    <ul className="list-group list-group-flush bg-transparent">
                      <li className="list-group-item">
                        Latest past questions in your enrolled courses.
                      </li>
                      <li className="list-group-item">
                        Job and scholarship recommendations.
                      </li>
                      <li className="list-group-item">
                        Your saved questions & bookmarks.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Opportunities */}
              <div className="col-lg-4" style={{ animationDelay: "0.2s" }}>
                <div className="card h-100 shadow-sm feature-card">
                  <div className="card-body p-4 text-dark">
                    <h4 className="card-title fw-bold mb-3 text-dark">
                      <i className="bi bi-briefcase-fill me-2"></i>Opportunities
                    </h4>
                    <ul className="list-group list-group-flush bg-transparent">
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        Job Alerts
                        <span className="badge bg-primary rounded-pill">
                          3 New
                        </span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        Scholarship Opportunities
                        <span className="badge bg-primary rounded-pill">
                          1 New
                        </span>
                      </li>
                      <li className="list-group-item">
                        Networking Hub (Connect with Alumni)
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Professional Features */}
              <div className="col-md-6" style={{ animationDelay: "0.3s" }}>
                <div className="card shadow-sm feature-card">
                  <div className="card-body p-4 text-dark">
                    <h4 className="card-title fw-bold mb-3 text-dark">
                      <i className="bi bi-graph-up-arrow me-2"></i>Professional
                      Tools
                    </h4>
                    <ul className="list-group list-group-flush bg-transparent">
                      <li className="list-group-item">Post a Job or Service</li>
                      <li className="list-group-item">Performance Analytics</li>
                      <li className="list-group-item">
                        Customer Inquiries & Ratings
                      </li>
                      <li className="list-group-item">Local Map View</li>
                    </ul>
                    <button
                      className="btn btn-warning mt-3"
                      style={{ backgroundColor: "#D4AF37", color: "#0C3C60" }}
                    >
                      <i className="bi bi-star-fill me-2"></i>Boost Visibility
                    </button>
                  </div>
                </div>
              </div>

              {/* Mentorship */}
              <div className="col-md-6">
                <div
                  className="card shadow-sm feature-card"
                  style={{ animationDelay: "0.4s" }}
                >
                  <div className="card-body p-4 text-dark">
                    <h4 className="card-title fw-bold mb-3 text-dark">
                      <i className="bi bi-people-fill me-2"></i>Mentorship
                      Program
                    </h4>
                    <p>Share your knowledge and guide students.</p>
                    <button className="btn btn-outline-success">
                      Become a Mentor
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
