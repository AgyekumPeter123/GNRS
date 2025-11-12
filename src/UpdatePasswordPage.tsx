import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

export default function UpdatePasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
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
      setTimeout(() => navigate("/signin"), 2000);
    }

    setLoading(false);
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center py-4"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}
    >
      <div
        className="card shadow-lg border-0 p-4 p-sm-5 bg-white"
        style={{
          width: "90%",
          maxWidth: "520px",
          borderRadius: "1rem",
        }}
      >
        <div className="text-center mb-4">
          <h3 className="fw-bold text-dark mb-2">Set a New Password</h3>
          <p className="text-muted">Enter your new password below.</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        <form onSubmit={handlePasswordUpdate}>
          <div className="form-floating mb-4 position-relative">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              id="password"
              placeholder="New Password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label htmlFor="password">New Password</label>
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="position-absolute top-50 end-0 translate-middle-y pe-3"
              style={{ cursor: "pointer" }}
              aria-label="Toggle password visibility"
            >
              <i className={showPassword ? "bi bi-eye" : "bi bi-eye-slash"}></i>
            </span>
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
            disabled={loading}
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
