import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "./supabaseClient";

interface Notification {
  id: string;
  type: string;
  message: string;
  time: string;
}

export default function StaffDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Real data from Supabase
  const [stats, setStats] = useState({
    pendingApprovals: 0,
    contentCreated: 0,
    usersManaged: 0,
    verifications: 0,
  });

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [pendingContent, setPendingContent] = useState([
    {
      id: 1,
      type: "job",
      title: "Software Developer Position",
      submittedBy: "John Doe",
      submittedAt: "2024-01-15",
      status: "pending",
    },
    {
      id: 2,
      type: "scholarship",
      title: "Masters Scholarship Program",
      submittedBy: "Jane Smith",
      submittedAt: "2024-01-14",
      status: "pending",
    },
  ]);

  const [processingContent, setProcessingContent] = useState<Set<number>>(
    new Set()
  );

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      // Fetch pending content
      const { data: pendingData, error: pendingError } = await supabase
        .from("content")
        .select("*")
        .eq("status", "pending");

      if (pendingError) throw pendingError;

      const formattedPendingContent = pendingData.map((item) => ({
        id: item.id,
        type: item.type,
        title: item.title,
        submittedBy: item.submitted_by, // This is UUID, might need to fetch name later
        submittedAt: new Date(item.created_at).toISOString().split("T")[0],
        status: item.status,
      }));

      setPendingContent(formattedPendingContent);

      // Fetch notifications for current user
      const { data: notificationsData, error: notificationsError } =
        await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10);

      if (notificationsError) throw notificationsError;

      const formattedNotifications = notificationsData.map((item) => ({
        id: item.id,
        type: item.type,
        message: item.message,
        time: new Date(item.created_at).toLocaleString(),
      }));

      setNotifications(formattedNotifications);

      // Fetch stats
      const { count: contentCount, error: contentError } = await supabase
        .from("content")
        .select("*", { count: "exact", head: true })
        .eq("submitted_by", user.id);

      if (contentError) throw contentError;

      const { count: pendingCount, error: pendingCountError } = await supabase
        .from("content")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      if (pendingCountError) throw pendingCountError;

      const { count: verificationCount, error: verificationError } =
        await supabase
          .from("user_verifications")
          .select("*", { count: "exact", head: true })
          .eq("status", "approved");

      if (verificationError) throw verificationError;

      const { count: userCount, error: userError } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      if (userError) throw userError;

      setStats({
        pendingApprovals: pendingCount || 0,
        contentCreated: contentCount || 0,
        usersManaged: userCount || 0,
        verifications: verificationCount || 0,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/signin");
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleApproveContent = async (contentId: number) => {
    if (processingContent.has(contentId)) return;

    setProcessingContent((prev) => new Set(prev).add(contentId));

    try {
      const { error } = await supabase
        .from("content")
        .update({ status: "approved" })
        .eq("id", contentId);

      if (error) throw error;

      // Remove from pending content list
      setPendingContent((prev) =>
        prev.filter((content) => content.id !== contentId)
      );

      // Update stats
      setStats((prev) => ({
        ...prev,
        pendingApprovals: Math.max(0, prev.pendingApprovals - 1),
      }));
    } catch (error) {
      console.error("Error approving content:", error);
      alert("Failed to approve content. Please try again.");
    } finally {
      setProcessingContent((prev) => {
        const newSet = new Set(prev);
        newSet.delete(contentId);
        return newSet;
      });
    }
  };

  const handleRejectContent = async (contentId: number) => {
    if (processingContent.has(contentId)) return;

    setProcessingContent((prev) => new Set(prev).add(contentId));

    try {
      const { error } = await supabase
        .from("content")
        .update({ status: "rejected" })
        .eq("id", contentId);

      if (error) throw error;

      // Remove from pending content list
      setPendingContent((prev) =>
        prev.filter((content) => content.id !== contentId)
      );

      // Update stats
      setStats((prev) => ({
        ...prev,
        pendingApprovals: Math.max(0, prev.pendingApprovals - 1),
      }));
    } catch (error) {
      console.error("Error rejecting content:", error);
      alert("Failed to reject content. Please try again.");
    } finally {
      setProcessingContent((prev) => {
        const newSet = new Set(prev);
        newSet.delete(contentId);
        return newSet;
      });
    }
  };

  return (
    <div className="dashboard-layout" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-inner">
          <div className="logo">
            <img src="/logo/GNRSlogo.png" alt="GNRS Logo" />
            <span>GNRS Staff</span>
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
              <span className="label">Content Creation</span>
            </button>

            <button
              className={`nav-item ${
                activeTab === "approvals" ? "active" : ""
              }`}
              onClick={() => handleTabChange("approvals")}
            >
              <span className="icon">
                <i className="bi bi-check-circle-fill"></i>
              </span>
              <span className="label">Content Approvals</span>
              <span className="badge">{pendingContent.length}</span>
            </button>

            <button
              className={`nav-item ${
                activeTab === "verification" ? "active" : ""
              }`}
              onClick={() => handleTabChange("verification")}
            >
              <span className="icon">
                <i className="bi bi-shield-check-fill"></i>
              </span>
              <span className="label">Verification Center</span>
            </button>

            <button
              className={`nav-item ${
                activeTab === "communication" ? "active" : ""
              }`}
              onClick={() => handleTabChange("communication")}
            >
              <span className="icon">
                <i className="bi bi-chat-dots-fill"></i>
              </span>
              <span className="label">Communication</span>
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
              <span className="label">Reports & Analytics</span>
            </button>

            <button
              className={`nav-item ${activeTab === "support" ? "active" : ""}`}
              onClick={() => handleTabChange("support")}
            >
              <span className="icon">
                <i className="bi bi-headset"></i>
              </span>
              <span className="label">Support Center</span>
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
                Welcome, Staff {user?.user_metadata.full_name || "Staff Member"}
              </h1>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-primary btn-sm">
                  <i className="bi bi-plus-circle me-1"></i>Add Job Posting
                </button>
                <button className="btn btn-outline-success btn-sm">
                  <i className="bi bi-plus-circle me-1"></i>Add Scholarship
                </button>
                <button className="btn btn-outline-info btn-sm">
                  <i className="bi bi-plus-circle me-1"></i>Add Content
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
                  <div className="col-md-3 col-sm-6">
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
                        <i className="bi bi-clock-fill text-warning fs-2 mb-2"></i>
                        <h3 className="h5 mb-1">{stats.pendingApprovals}</h3>
                        <p className="text-muted small mb-0">
                          Pending Approvals
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 col-sm-6">
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
                        <i className="bi bi-file-earmark-plus-fill text-success fs-2 mb-2"></i>
                        <h3 className="h5 mb-1">{stats.contentCreated}</h3>
                        <p className="text-muted small mb-0">Content Created</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 col-sm-6">
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
                        <i className="bi bi-people-fill text-primary fs-2 mb-2"></i>
                        <h3 className="h5 mb-1">
                          {stats.usersManaged.toLocaleString()}
                        </h3>
                        <p className="text-muted small mb-0">Users Managed</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 col-sm-6">
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
                        <i className="bi bi-shield-check-fill text-info fs-2 mb-2"></i>
                        <h3 className="h5 mb-1">{stats.verifications}</h3>
                        <p className="text-muted small mb-0">Verifications</p>
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
                            <div className="col-md-3">
                              <button className="btn btn-primary w-100">
                                <i className="bi bi-plus-circle me-2"></i>Add
                                Job
                              </button>
                            </div>
                            <div className="col-md-3">
                              <button className="btn btn-success w-100">
                                <i className="bi bi-plus-circle me-2"></i>Add
                                Scholarship
                              </button>
                            </div>
                            <div className="col-md-3">
                              <button className="btn btn-info w-100">
                                <i className="bi bi-plus-circle me-2"></i>Add
                                News
                              </button>
                            </div>
                            <div className="col-md-3">
                              <button className="btn btn-warning w-100">
                                <i className="bi bi-plus-circle me-2"></i>Add
                                Resource
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recent Activity */}
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
                            <i className="bi bi-activity me-2"></i>
                            Recent Activity
                          </h4>
                          <div className="row g-3">
                            <div className="col-md-6">
                              <div className="p-3 bg-light rounded">
                                <h6>Content Submissions</h6>
                                <div
                                  className="progress mb-2"
                                  style={{ height: "8px" }}
                                >
                                  <div
                                    className="progress-bar bg-success"
                                    style={{ width: "85%" }}
                                  ></div>
                                </div>
                                <small className="text-muted">
                                  85% approved this week
                                </small>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="p-3 bg-light rounded">
                                <h6>User Verifications</h6>
                                <div
                                  className="progress mb-2"
                                  style={{ height: "8px" }}
                                >
                                  <div
                                    className="progress-bar bg-primary"
                                    style={{ width: "72%" }}
                                  ></div>
                                </div>
                                <small className="text-muted">
                                  72% completion rate
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
                          <div className="row g-3 mb-3">
                            <div className="col-md-4">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Search users..."
                              />
                            </div>
                            <div className="col-md-3">
                              <select className="form-select">
                                <option>All Users</option>
                                <option>Students</option>
                                <option>Alumni</option>
                                <option>Employers</option>
                                <option>Skilled Workers</option>
                              </select>
                            </div>
                            <div className="col-md-2">
                              <select className="form-select">
                                <option>Status</option>
                                <option>Active</option>
                                <option>Suspended</option>
                                <option>Pending</option>
                              </select>
                            </div>
                            <div className="col-md-3">
                              <button className="btn btn-primary w-100">
                                Search
                              </button>
                            </div>
                          </div>
                          <div className="table-responsive">
                            <table className="table table-hover">
                              <thead>
                                <tr>
                                  <th>Name</th>
                                  <th>Role</th>
                                  <th>Status</th>
                                  <th>Last Activity</th>
                                  <th>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>John Doe</td>
                                  <td>Student</td>
                                  <td>
                                    <span className="badge bg-success">
                                      Active
                                    </span>
                                  </td>
                                  <td>2 hours ago</td>
                                  <td>
                                    <button className="btn btn-sm btn-outline-primary me-1">
                                      View
                                    </button>
                                    <button className="btn btn-sm btn-outline-warning">
                                      Suspend
                                    </button>
                                  </td>
                                </tr>
                                <tr>
                                  <td>Jane Smith</td>
                                  <td>Employer</td>
                                  <td>
                                    <span className="badge bg-warning">
                                      Pending
                                    </span>
                                  </td>
                                  <td>1 day ago</td>
                                  <td>
                                    <button className="btn btn-sm btn-outline-primary me-1">
                                      View
                                    </button>
                                    <button className="btn btn-sm btn-outline-success">
                                      Verify
                                    </button>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
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
                            Content Creation & Management
                          </h4>
                          <div className="row g-3">
                            <div className="col-md-3">
                              <div className="p-3 border rounded text-center">
                                <i className="bi bi-briefcase-fill text-primary fs-2 mb-2"></i>
                                <h6>Job Postings</h6>
                                <p className="mb-2">Create new job listings</p>
                                <button className="btn btn-sm btn-outline-primary">
                                  Add Job
                                </button>
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="p-3 border rounded text-center">
                                <i className="bi bi-mortarboard-fill text-success fs-2 mb-2"></i>
                                <h6>Scholarships</h6>
                                <p className="mb-2">Add scholarship programs</p>
                                <button className="btn btn-sm btn-outline-success">
                                  Add Scholarship
                                </button>
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="p-3 border rounded text-center">
                                <i className="bi bi-newspaper text-info fs-2 mb-2"></i>
                                <h6>News Articles</h6>
                                <p className="mb-2">Publish news content</p>
                                <button className="btn btn-sm btn-outline-info">
                                  Add News
                                </button>
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="p-3 border rounded text-center">
                                <i className="bi bi-book-fill text-warning fs-2 mb-2"></i>
                                <h6>Resources</h6>
                                <p className="mb-2">
                                  Upload learning materials
                                </p>
                                <button className="btn btn-sm btn-outline-warning">
                                  Add Resource
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4">
                            <h6>My Recent Content</h6>
                            <div className="list-group">
                              <div className="list-group-item">
                                <div className="d-flex justify-content-between align-items-center">
                                  <div>
                                    <h6 className="mb-1">
                                      Software Developer Position
                                    </h6>
                                    <small className="text-muted">
                                      Job Posting • Submitted 2 hours ago
                                    </small>
                                  </div>
                                  <span className="badge bg-warning">
                                    Pending Approval
                                  </span>
                                </div>
                              </div>
                              <div className="list-group-item">
                                <div className="d-flex justify-content-between align-items-center">
                                  <div>
                                    <h6 className="mb-1">
                                      Masters Scholarship Program
                                    </h6>
                                    <small className="text-muted">
                                      Scholarship • Submitted 1 day ago
                                    </small>
                                  </div>
                                  <span className="badge bg-success">
                                    Approved
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "approvals" && (
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
                            <i className="bi bi-check-circle-fill me-2"></i>
                            Content Approvals
                          </h4>
                          <div className="table-responsive">
                            <table className="table table-hover">
                              <thead>
                                <tr>
                                  <th>Content Type</th>
                                  <th>Title</th>
                                  <th>Submitted By</th>
                                  <th>Submitted Date</th>
                                  <th>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {pendingContent.map((content) => (
                                  <tr key={content.id}>
                                    <td>
                                      <span
                                        className={`badge ${
                                          content.type === "job"
                                            ? "bg-primary"
                                            : "bg-success"
                                        }`}
                                      >
                                        {content.type}
                                      </span>
                                    </td>
                                    <td>{content.title}</td>
                                    <td>{content.submittedBy}</td>
                                    <td>{content.submittedAt}</td>
                                    <td>
                                      <button
                                        className="btn btn-sm btn-success me-1"
                                        onClick={() =>
                                          handleApproveContent(content.id)
                                        }
                                      >
                                        Approve
                                      </button>
                                      <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() =>
                                          handleRejectContent(content.id)
                                        }
                                      >
                                        Reject
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "verification" && (
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
                            <i className="bi bi-shield-check-fill me-2"></i>
                            Verification Center
                          </h4>
                          <div className="row g-3">
                            <div className="col-md-4">
                              <div className="p-3 border rounded text-center">
                                <i className="bi bi-person-check-fill text-primary fs-2 mb-2"></i>
                                <h6>Skilled Workers</h6>
                                <p className="mb-2">12 pending verifications</p>
                                <button className="btn btn-sm btn-outline-primary">
                                  Review
                                </button>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="p-3 border rounded text-center">
                                <i className="bi bi-building-fill text-success fs-2 mb-2"></i>
                                <h6>Employers</h6>
                                <p className="mb-2">8 pending verifications</p>
                                <button className="btn btn-sm btn-outline-success">
                                  Review
                                </button>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="p-3 border rounded text-center">
                                <i className="bi bi-file-earmark-check-fill text-info fs-2 mb-2"></i>
                                <h6>Educational Content</h6>
                                <p className="mb-2">15 pending verifications</p>
                                <button className="btn btn-sm btn-outline-info">
                                  Review
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4">
                            <h6>Recent Verifications</h6>
                            <div className="list-group">
                              <div className="list-group-item">
                                <div className="d-flex justify-content-between align-items-center">
                                  <div>
                                    <h6 className="mb-1">
                                      John Doe - Software Developer
                                    </h6>
                                    <small className="text-muted">
                                      Skilled Worker Verification • Approved 2
                                      hours ago
                                    </small>
                                  </div>
                                  <span className="badge bg-success">
                                    Verified
                                  </span>
                                </div>
                              </div>
                              <div className="list-group-item">
                                <div className="d-flex justify-content-between align-items-center">
                                  <div>
                                    <h6 className="mb-1">TechCorp Inc.</h6>
                                    <small className="text-muted">
                                      Employer Verification • Pending Review
                                    </small>
                                  </div>
                                  <span className="badge bg-warning">
                                    Pending
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "communication" && (
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
                            <i className="bi bi-chat-dots-fill me-2"></i>
                            Communication Tools
                          </h4>
                          <div className="row g-3">
                            <div className="col-md-6">
                              <div className="p-3 border rounded">
                                <h6>Send Announcements</h6>
                                <p className="mb-2">
                                  Broadcast messages to all users
                                </p>
                                <button className="btn btn-sm btn-outline-primary">
                                  Create Announcement
                                </button>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="p-3 border rounded">
                                <h6>Bulk Messaging</h6>
                                <p className="mb-2">
                                  Send messages by category
                                </p>
                                <button className="btn btn-sm btn-outline-success">
                                  Send Bulk Message
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4">
                            <h6>Push Notifications</h6>
                            <div className="row g-3">
                              <div className="col-md-6">
                                <div className="p-3 bg-light rounded">
                                  <h6>New Jobs Alert</h6>
                                  <p className="small mb-2">
                                    Notify users about new job postings
                                  </p>
                                  <button className="btn btn-sm btn-primary">
                                    Send Notification
                                  </button>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="p-3 bg-light rounded">
                                  <h6>Scholarship Updates</h6>
                                  <p className="small mb-2">
                                    Alert users about new scholarships
                                  </p>
                                  <button className="btn btn-sm btn-success">
                                    Send Notification
                                  </button>
                                </div>
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
                            Reports & Analytics
                          </h4>
                          <div className="row g-3">
                            <div className="col-md-6">
                              <div className="p-3 bg-light rounded">
                                <h6>Content Analytics</h6>
                                <div className="row text-center">
                                  <div className="col-4">
                                    <div className="h5 text-primary">156</div>
                                    <small className="text-muted">Jobs</small>
                                  </div>
                                  <div className="col-4">
                                    <div className="h5 text-success">89</div>
                                    <small className="text-muted">
                                      Scholarships
                                    </small>
                                  </div>
                                  <div className="col-4">
                                    <div className="h5 text-info">234</div>
                                    <small className="text-muted">
                                      Resources
                                    </small>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="p-3 bg-light rounded">
                                <h6>User Activity</h6>
                                <div
                                  className="progress mb-2"
                                  style={{ height: "8px" }}
                                >
                                  <div
                                    className="progress-bar bg-success"
                                    style={{ width: "78%" }}
                                  ></div>
                                </div>
                                <small className="text-muted">
                                  78% user engagement this month
                                </small>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <h6>Export Reports</h6>
                              <div className="btn-group">
                                <button className="btn btn-sm btn-outline-primary">
                                  CSV
                                </button>
                                <button className="btn btn-sm btn-outline-success">
                                  Excel
                                </button>
                                <button className="btn btn-sm btn-outline-info">
                                  PDF
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "support" && (
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
                            <i className="bi bi-headset me-2"></i>
                            Support & Feedback Center
                          </h4>
                          <div className="row g-3">
                            <div className="col-md-6">
                              <div className="p-3 border rounded">
                                <h6>Helpdesk Tickets</h6>
                                <p className="mb-2">12 open tickets</p>
                                <button className="btn btn-sm btn-outline-primary">
                                  View Tickets
                                </button>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="p-3 border rounded">
                                <h6>User Complaints</h6>
                                <p className="mb-2">5 pending reviews</p>
                                <button className="btn btn-sm btn-outline-warning">
                                  Review Complaints
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4">
                            <h6>Service Quality Reports</h6>
                            <div className="row g-3">
                              <div className="col-md-4">
                                <div className="text-center">
                                  <div className="h4 text-success">95%</div>
                                  <small className="text-muted">
                                    Resolution Rate
                                  </small>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="text-center">
                                  <div className="h4 text-primary">2.4h</div>
                                  <small className="text-muted">
                                    Avg Response Time
                                  </small>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="text-center">
                                  <div className="h4 text-info">4.8/5</div>
                                  <small className="text-muted">
                                    User Satisfaction
                                  </small>
                                </div>
                              </div>
                            </div>
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
                            <i className="bi bi-gear-fill me-2"></i>
                            Settings & Preferences
                          </h4>
                          <div className="row g-3">
                            <div className="col-md-6">
                              <div className="p-3 border rounded">
                                <h6>Profile Settings</h6>
                                <p className="mb-2">
                                  Update your profile information
                                </p>
                                <button className="btn btn-sm btn-outline-primary">
                                  Edit Profile
                                </button>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="p-3 border rounded">
                                <h6>Notification Preferences</h6>
                                <p className="mb-2">
                                  Manage notification settings
                                </p>
                                <button className="btn btn-sm btn-outline-success">
                                  Configure
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4">
                            <h6>Dashboard Customization</h6>
                            <div className="row g-3">
                              <div className="col-md-4">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="darkMode"
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="darkMode"
                                  >
                                    Dark Mode
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="compactView"
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="compactView"
                                  >
                                    Compact View
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="autoRefresh"
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="autoRefresh"
                                  >
                                    Auto-refresh Data
                                  </label>
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

              {/* Notifications Sidebar */}
              <div className="col-lg-4">
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
                          <i className="bi bi-bell-fill me-2"></i>
                          Recent Notifications
                        </h4>
                        <div className="list-group list-group-flush">
                          {notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className="list-group-item bg-transparent border-0 px-0"
                            >
                              <div className="d-flex align-items-start">
                                <div className="flex-shrink-0 me-3">
                                  <i
                                    className={`bi ${
                                      notification.type === "approval"
                                        ? "bi-check-circle-fill text-success"
                                        : notification.type === "content"
                                        ? "bi-file-earmark-text-fill text-info"
                                        : "bi-shield-check-fill text-warning"
                                    } fs-4`}
                                  ></i>
                                </div>
                                <div className="flex-grow-1">
                                  <p className="mb-1 fw-medium">
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
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
