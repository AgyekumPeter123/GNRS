import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import { useAuth } from "./AuthContext";

export default function UpdatePasswordPage() {
  const navigate = useNavigate();
  const { loading: authLoading } = useAuth(); // Get auth loading state
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  // This useEffect hook is the key to fixing the session issue.
  // It runs once when the component mounts to handle the password recovery flow.
  useEffect(() => {
    // Supabase redirects with the session token in the URL hash.
    // This line checks for the token and exchanges it for a valid session.
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // The PASSWORD_RECOVERY event is fired once the session is restored.
      }
    );
    return () => authListener.subscription.unsubscribe();
  }, []);

  // Effect to automatically clear the error message after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Effect to automatically clear the success message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    const checkPasswordStrength = () => {
      const strengthChecks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password),
      };
      const strength = Object.values(strengthChecks).filter(Boolean).length;
      setPasswordStrength(strength);
      setRequirements(strengthChecks);
    };
    checkPasswordStrength();
  }, [password]);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Your password has been updated successfully!");
      // Sign out the user after successful password update for security
      await supabase.auth.signOut();
      setTimeout(() => navigate("/signin"), 2000);
    }

    setLoading(false);
  };

  const getStrengthBarColor = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return "#dc3545"; // red
      case 2:
        return "#fd7e14"; // orange
      case 3:
        return "#ffc107"; // yellow
      case 4:
        return "#198754"; // green
      case 5:
        return "#0d6efd"; // blue
      default:
        return "#e9ecef";
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center py-4"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "url('/logo/userdashboard.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.3,
          filter: "blur(8px)",
          zIndex: 0,
        }}
      ></div>
      <div
        className="card shadow-lg border-0 p-4 p-sm-5"
        style={{
          width: "90%",
          maxWidth: "520px",
          borderRadius: "1rem",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <div className="text-center mb-4">
          <h3 className="fw-bold text-dark mb-2">Set a New Password</h3>
          <p className="text-muted">Enter your new password below.</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        <form onSubmit={handlePasswordUpdate}>
          <div className="row g-3 mb-3">
            <div className="col-12">
              <div
                className="form-floating position-relative"
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(5px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "0.375rem",
                }}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  id="password"
                  placeholder="New Password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ background: "transparent" }}
                />
                <label htmlFor="password">New Password</label>
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="position-absolute top-50 end-0 translate-middle-y pe-3"
                  style={{ cursor: "pointer" }}
                  aria-label="Toggle password visibility"
                >
                  <i
                    className={showPassword ? "bi bi-eye" : "bi bi-eye-slash"}
                  ></i>
                </span>
              </div>
              <div
                className="password-strength-meter mt-2"
                style={{ maxWidth: "100%" }}
              >
                <div
                  className="strength-bar"
                  style={{
                    width: `${passwordStrength * 20}%`,
                    backgroundColor: getStrengthBarColor(),
                  }}
                ></div>
              </div>
              <div className="password-requirements mt-2">
                <ul className="list-unstyled mb-0">
                  <li className={requirements.length ? "valid" : ""}>
                    <i className="bi bi-check-circle-fill me-2"></i>8+
                    characters
                  </li>
                  <li className={requirements.uppercase ? "valid" : ""}>
                    <i className="bi bi-check-circle-fill me-2"></i>1 uppercase
                  </li>
                  <li className={requirements.lowercase ? "valid" : ""}>
                    <i className="bi bi-check-circle-fill me-2"></i>1 lowercase
                  </li>
                  <li className={requirements.number ? "valid" : ""}>
                    <i className="bi bi-check-circle-fill me-2"></i>1 number
                  </li>
                  <li className={requirements.special ? "valid" : ""}>
                    <i className="bi bi-check-circle-fill me-2"></i>1 special
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-12">
              <div
                className="form-floating position-relative"
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(5px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "0.375rem",
                }}
              >
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="form-control"
                  id="confirmPassword"
                  placeholder="Confirm New Password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={{ background: "transparent" }}
                />
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <span
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="position-absolute top-50 end-0 translate-middle-y pe-3"
                  style={{ cursor: "pointer" }}
                  aria-label="Toggle password visibility"
                >
                  <i
                    className={
                      showConfirmPassword ? "bi bi-eye" : "bi bi-eye-slash"
                    }
                  ></i>
                </span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 py-3 fw-semibold btn-submit-modern d-flex align-items-center justify-content-center"
            style={{
              background: "linear-gradient(145deg, #104b7a, #0C3C60)",
              borderColor: "#0C3C60",
              borderRadius: "0.5rem",
              minHeight: "58px",
            }}
            disabled={loading || authLoading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                <span className="ms-2">Updating...</span>
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
