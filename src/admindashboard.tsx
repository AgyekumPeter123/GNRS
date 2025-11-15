import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "./supabaseClient";

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for demonstration
  const [stats, setStats] = useState({
    newUsers: 1247,
    jobs: 89,
    scholarships: 23,
    uploads: 156,
    subscriptions: 342,
  });

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "approval",
      message: "New job posting awaiting approval",
      time: "2 min ago",
    },
    {
      id: 2,
      type: "update",
      message: "Scholarship deadline updated",
      time: "15 min ago",
    },
    {
      id: 3,
      type: "report",
      message: "Content flagged for review",
      time: "1 hour ago",
    },
  ]);

  useEffect(() => {
    if (user) {
      setIsLoading(false);
    }
  }, [user, navigate]);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/signin");
  };

  const isLinkActive = (path: string) => {
    return location.pathname === path;
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="dashboard-layout" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-inner">
          <div className="logo">
            <img src="/logo/GNRSlogo.png" alt="GNRS Logo" />
            <span>GNRS Admin</span>
          </div>

          <nav className="nav">
            <button
              className={`nav-item ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => handleTabChange("overview")}
            >
              <span className="icon">
                <i className="bi bi-grid-1x2-fill"></i>
              </span>
              <span className="label">Overview</span>
            </button>

            <button
              className={`nav-item ${activeTab === "users" ? "active" : ""}`}
              onClick={() => handleTabChange("users")}
            >
              <span className="icon">
                <i className="bi bi-people-fill"></i>
              </span>
              <span className="label">User Management</span>
            </button>

            <button
              className={`nav-item ${activeTab === "content" ? "active" : ""}`}
              onClick={() => handleTabChange("content")}
            >
              <span className="icon">
                <i className="bi bi-file-earmark-text-fill"></i>
              </span>
              <span className="label">Content Management</span>
            </button>

            <button
              className={`nav-item ${
                activeTab === "analytics" ? "active" : ""
              }`}
              onClick={() => handleTabChange("analytics")}
            >
              <span className="icon">
                <i className="bi bi-graph-up-arrow"></i>
              </span>
              <span className="label">Analytics</span>
            </button>

            <button
              className={`nav-item ${
                activeTab === "notifications" ? "active" : ""
              }`}
              onClick={() => handleTabChange("notifications")}
            >
              <span className="icon">
                <i className="bi bi-bell-fill"></i>
              </span>
              <span className="label">Notifications</span>
              <span className="badge">{notifications.length}</span>
            </button>

            <button
              className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
              onClick={() => handleTabChange("settings")}
            >
              <span className="icon">
                <i className="bi bi-gear-fill"></i>
              </span>
              <span className="label">Settings</span>
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
      <main
        className="main-content"
        style={{ position: "relative", minHeight: "100vh" }}
      >
        {/* Blurred Background */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            minHeight: "100vh",
            backgroundImage: `url('/logo/user.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
            filter: "blur(8px)",
            zIndex: 0,
            opacity: 0.3,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 0,
            opacity: 0.1,
            pointerEvents: "none",
          }}
        >
          <img
            src="/logo/GNRSlogo.png"
            alt="Watermark"
            style={{ width: "100%", maxWidth: "600px" }}
          />
        </div>

        <header
          className="main-header"
          style={{ position: "relative", zIndex: 1 }}
        >
          <section className="welcome-banner">
            <div className="d-flex align-items-center justify-content-between">
              <h1 className="mb-0 h4 fw-bold">
                Welcome, Admin{" "}
                {user?.user_metadata.full_name || "Administrator"}
              </h1>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-primary btn-sm">
                  <i className="bi bi-plus-circle me-1"></i>Add New Job
                </button>
                <button className="btn btn-outline-success btn-sm">
                  <i className="bi bi-plus-circle me-1"></i>Add Scholarship
                </button>
                <button className="btn btn-outline-info btn-sm">
                  <i className="bi bi-plus-circle me-1"></i>Add Resource
                </button>
              </div>
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
            <div className="row g-4">
              {/* Real-time Statistics */}
              <div className="col-12">
                <div className="row g-3 mb-4">
                  <div className="col-md-2 col-sm-6">
                    <div
                      className="card h-100 shadow-sm feature-card"
                      style={{
                        background: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(5px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: "0.5rem",
                      }}
                    >
                      <div className="card-body p-3 text-center">
                        <i className="bi bi-person-plus-fill text-primary fs-2 mb-2"></i>
                        <h3 className="h5 mb-1">
                          {stats.newUsers.toLocaleString()}
                        </h3>
                        <p className="text-muted small mb-0">New Users</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-2 col-sm-6">
                    <div
                      className="card h-100 shadow-sm feature-card"
                      style={{
                        background: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(5px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: "0.5rem",
                      }}
                    >
                      <div className="card-body p-3 text-center">
                        <i className="bi bi-briefcase-fill text-success fs-2 mb-2"></i>
                        <h3 className="h5 mb-1">{stats.jobs}</h3>
                        <p className="text-muted small mb-0">Active Jobs</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-2 col-sm-6">
                    <div
                      className="card h-100 shadow-sm feature-card"
                      style={{
                        background: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(5px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: "0.5rem",
                      }}
                    >
                      <div className="card-body p-3 text-center">
                        <i className="bi bi-mortarboard-fill text-warning fs-2 mb-2"></i>
                        <h3 className="h5 mb-1">{stats.scholarships}</h3>
                        <p className="text-muted small mb-0">Scholarships</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-2 col-sm-6">
                    <div
                      className="card h-100 shadow-sm feature-card"
                      style={{
                        background: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(5px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: "0.5rem",
                      }}
                    >
                      <div className="card-body p-3 text-center">
                        <i className="bi bi-cloud-upload-fill text-info fs-2 mb-2"></i>
                        <h3 className="h5 mb-1">{stats.uploads}</h3>
                        <p className="text-muted small mb-0">Uploads</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-2 col-sm-6">
                    <div
                      className="card h-100 shadow-sm feature-card"
                      style={{
                        background: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(5px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: "0.5rem",
                      }}
                    >
                      <div className="card-body p-3 text-center">
                        <i className="bi bi-credit-card-fill text-danger fs-2 mb-2"></i>
                        <h3 className="h5 mb-1">{stats.subscriptions}</h3>
                        <p className="text-muted small mb-0">Subscriptions</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-2 col-sm-6">
                    <div
                      className="card h-100 shadow-sm feature-card"
                      style={{
                        background: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(5px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: "0.5rem",
                      }}
                    >
                      <div className="card-body p-3 text-center">
                        <i className="bi bi-graph-up-arrow text-secondary fs-2 mb-2"></i>
                        <h3 className="h5 mb-1">98.5%</h3>
                        <p className="text-muted small mb-0">Uptime</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Dashboard Content */}
              <div className="col-lg-8">
                {activeTab === "overview" && (
                  <div className="row g-4">
                    {/* Quick Actions */}
                    <div className="col-12">
                      <div
                        className="card shadow-sm feature-card"
                        style={{
                          background: "rgba(255, 255, 255, 0.1)",
                          backdropFilter: "blur(5px)",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          borderRadius: "0.5rem",
                        }}
                      >
                        <div className="card-body p-4">
                          <h4 className="card-title fw-bold mb-3 text-dark">
                            <i className="bi bi-lightning-charge-fill me-2"></i>
                            Quick Actions
                          </h4>
                          <div className="row g-3">
                            <div className="col-md-4">
                              <button className="btn btn-primary w-100">
                                <i className="bi bi-plus-circle me-2"></i>Add
                                Job
                              </button>
                            </div>
                            <div className="col-md-4">
                              <button className="btn btn-success w-100">
                                <i className="bi bi-plus-circle me-2"></i>Add
                                Scholarship
                              </button>
                            </div>
                            <div className="col-md-4">
                              <button className="btn btn-info w-100">
                                <i className="bi bi-plus-circle me-2"></i>Add
                                Resource
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Analytics Preview */}
                    <div className="col-12">
                      <div
                        className="card shadow-sm feature-card"
                        style={{
                          background: "rgba(255, 255, 255, 0.1)",
                          backdropFilter: "blur(5px)",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          borderRadius: "0.5rem",
                        }}
                      >
                        <div className="card-body p-4">
                          <h4 className="card-title fw-bold mb-3 text-dark">
                            <i className="bi bi-graph-up-arrow me-2"></i>
                            Analytics Overview
                          </h4>
                          <div className="row g-3">
                            <div className="col-md-6">
                              <div className="p-3 bg-light rounded">
                                <h6>User Activity Trends</h6>
                                <div
                                  className="progress mb-2"
                                  style={{ height: "8px" }}
                                >
                                  <div
                                    className="progress-bar bg-primary"
                                    style={{ width: "75%" }}
                                  ></div>
                                </div>
                                <small className="text-muted">
                                  +15% this week
                                </small>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="p-3 bg-light rounded">
                                <h6>Content Engagement</h6>
                                <div
                                  className="progress mb-2"
                                  style={{ height: "8px" }}
                                >
                                  <div
                                    className="progress-bar bg-success"
                                    style={{ width: "60%" }}
                                  ></div>
                                </div>
                                <small className="text-muted">
                                  +8% this week
                                </small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "users" && (
                  <div className="row g-4">
                    <div className="col-12">
                      <div
                        className="card shadow-sm feature-card"
                        style={{
                          background: "rgba(255, 255, 255, 0.1)",
                          backdropFilter: "blur(5px)",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          borderRadius: "0.5rem",
                        }}
                      >
                        <div className="card-body p-4">
                          <h4 className="card-title fw-bold mb-3 text-dark">
                            <i className="bi bi-people-fill me-2"></i>User
                            Management
                          </h4>
                          <div className="row g-3">
                            <div className="col-md-6">
                              <div className="p-3 border rounded">
                                <h6>Pending Approvals</h6>
                                <p className="mb-2">
                                  12 new user registrations
                                </p>
                                <button className="btn btn-sm btn-outline-primary">
                                  Review
                                </button>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="p-3 border rounded">
                                <h6>Role Management</h6>
                                <p className="mb-2">3 moderator requests</p>
                                <button className="btn btn-sm btn-outline-success">
                                  Manage
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "content" && (
                  <div className="row g-4">
                    <div className="col-12">
                      <div
                        className="card shadow-sm feature-card"
                        style={{
                          background: "rgba(255, 255, 255, 0.1)",
                          backdropFilter: "blur(5px)",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          borderRadius: "0.5rem",
                        }}
                      >
                        <div className="card-body p-4">
                          <h4 className="card-title fw-bold mb-3 text-dark">
                            <i className="bi bi-file-earmark-text-fill me-2"></i>
                            Content Management
                          </h4>
                          <div className="row g-3">
                            <div className="col-md-4">
                              <div className="p-3 border rounded text-center">
                                <i className="bi bi-flag-fill text-warning fs-2 mb-2"></i>
                                <h6>Reported Content</h6>
                                <p className="mb-2">5 items flagged</p>
                                <button className="btn btn-sm btn-outline-warning">
                                  Review
                                </button>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="p-3 border rounded text-center">
                                <i className="bi bi-archive-fill text-secondary fs-2 mb-2"></i>
                                <h6>Expired Content</h6>
                                <p className="mb-2">23 items to archive</p>
                                <button className="btn btn-sm btn-outline-secondary">
                                  Archive
                                </button>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="p-3 border rounded text-center">
                                <i className="bi bi-tags-fill text-info fs-2 mb-2"></i>
                                <h6>Categories</h6>
                                <p className="mb-2">Manage tags & topics</p>
                                <button className="btn btn-sm btn-outline-info">
                                  Edit
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "analytics" && (
                  <div className="row g-4">
                    <div className="col-12">
                      <div
                        className="card shadow-sm feature-card"
                        style={{
                          background: "rgba(255, 255, 255, 0.1)",
                          backdropFilter: "blur(5px)",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          borderRadius: "0.5rem",
                        }}
                      >
                        <div className="card-body p-4">
                          <h4 className="card-title fw-bold mb-3 text-dark">
                            <i className="bi bi-graph-up-arrow me-2"></i>
                            Detailed Analytics
                          </h4>
                          <div className="row g-3">
                            <div className="col-md-6">
                              <div className="p-3 bg-light rounded">
                                <h6>Traffic Heat Map</h6>
                                <div className="text-center my-3">
                                  <i className="bi bi-globe text-primary fs-1"></i>
                                </div>
                                <small className="text-muted">
                                  Interactive map coming soon
                                </small>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="p-3 bg-light rounded">
                                <h6>Revenue Reports</h6>
                                <div className="text-center my-3">
                                  <i className="bi bi-cash-stack text-success fs-1"></i>
                                </div>
                                <small className="text-muted">
                                  Monthly reports available
                                </small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "notifications" && (
                  <div className="row g-4">
                    <div className="col-12">
                      <div
                        className="card shadow-sm feature-card"
                        style={{
                          background: "rgba(255, 255, 255, 0.1)",
                          backdropFilter: "blur(5px)",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          borderRadius: "0.5rem",
                        }}
                      >
                        <div className="card-body p-4">
                          <h4 className="card-title fw-bold mb-3 text-dark">
                            <i className="bi bi-bell-fill me-2"></i>Notification
                            Center
                          </h4>
                          <div className="list-group">
                            {notifications.map((notification) => (
                              <div
                                key={notification.id}
                                className="list-group-item border-0 px-0"
                              >
                                <div className="d-flex align-items-center">
                                  <div className="flex-shrink-0 me-3">
                                    <i
                                      className={`bi ${
                                        notification.type === "approval"
                                          ? "bi-check-circle-fill text-success"
                                          : notification.type === "update"
                                          ? "bi-info-circle-fill text-info"
                                          : "bi-exclamation-triangle-fill text-warning"
                                      } fs-4`}
                                    ></i>
                                  </div>
                                  <div className="flex-grow-1">
                                    <p className="mb-1">
                                      {notification.message}
                                    </p>
                                    <small className="text-muted">
                                      {notification.time}
                                    </small>
                                  </div>
                                  <button className="btn btn-sm btn-outline-primary ms-3">
                                    View
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "settings" && (
                  <div className="row g-4">
                    <div className="col-12">
                      <div
                        className="card shadow-sm feature-card"
                        style={{
                          background: "rgba(255, 255, 255, 0.1)",
                          backdropFilter: "blur(5px)",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          borderRadius: "0.5rem",
                        }}
                      >
                        <div className="card-body p-4">
                          <h4 className="card-title fw-bold mb-3 text-dark">
                            <i className="bi bi-gear-fill me-2"></i>System
                            Settings
                          </h4>
                          <div className="row g-3">
                            <div className="col-md-6">
                              <div className="p-3 border rounded">
                                <h6>Maintenance Mode</h6>
                                <p className="mb-2">Currently: Disabled</p>
                                <button className="btn btn-sm btn-outline-danger">
                                  Enable
                                </button>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="p-3 border rounded">
                                <h6>Subscription Plans</h6>
                                <p className="mb-2">Manage pricing tiers</p>
                                <button className="btn btn-sm btn-outline-primary">
                                  Edit Plans
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar Panel */}
              <div className="col-lg-4">
                <div className="row g-4">
                  {/* Notifications Panel */}
                  <div className="col-12">
                    <div
                      className="card shadow-sm feature-card"
                      style={{
                        background: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(5px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: "0.5rem",
                      }}
                    >
                      <div className="card-body p-4">
                        <h5 className="card-title fw-bold mb-3 text-dark">
                          <i className="bi bi-bell-fill me-2"></i>Recent
                          Activity
                        </h5>
                        <div className="list-group list-group-flush bg-transparent">
                          {notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className="list-group-item bg-transparent px-0 py-2"
                            >
                              <div className="d-flex align-items-start">
                                <div className="flex-shrink-0 me-2">
                                  <i
                                    className={`bi ${
                                      notification.type === "approval"
                                        ? "bi-check-circle text-success"
                                        : notification.type === "update"
                                        ? "bi-info-circle text-info"
                                        : "bi-exclamation-triangle text-warning"
                                    }`}
                                  ></i>
                                </div>
                                <div className="flex-grow-1">
                                  <p className="mb-1 small">
                                    {notification.message}
                                  </p>
                                  <small className="text-muted">
                                    {notification.time}
                                  </small>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="col-12">
                    <div
                      className="card shadow-sm feature-card"
                      style={{
                        background: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(5px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: "0.5rem",
                      }}
                    >
                      <div className="card-body p-4">
                        <h5 className="card-title fw-bold mb-3 text-dark">
                          <i className="bi bi-bar-chart-line-fill me-2"></i>
                          Quick Stats
                        </h5>
                        <div className="row g-3">
                          <div className="col-6">
                            <div className="text-center">
                              <div className="h4 mb-1 text-primary">1.2K</div>
                              <small className="text-muted">Daily Active</small>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="text-center">
                              <div className="h4 mb-1 text-success">$2.4K</div>
                              <small className="text-muted">Revenue</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
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
