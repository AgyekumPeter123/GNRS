import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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

  // Handle email input change to clear the error immediately
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) {
      setError("");
    }
    setEmail(e.target.value);
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      // First, check if a user with this email exists in your database.
      // Note: This approach can expose which emails are registered in your system.
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("email")
        .eq("email", email)
        .single();

      if (profileError || !profile) {
        setError("No account found with this email address.");
        setLoading(false);
        return;
      }

      // If the email exists, proceed to send the reset link.
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        { redirectTo: `${window.location.origin}/update-password` }
      );

      if (resetError) {
        setError(resetError.message);
      } else {
        setMessage("Password reset instructions have been sent to your email.");
      }
    } catch (catchError: any) {
      setError(catchError.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
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
          <h3 className="fw-bold text-dark mb-2">Forgot Your Password?</h3>
          <p className="text-muted">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        <form onSubmit={handlePasswordReset}>
          <div
            className="form-floating mb-3"
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(5px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "0.375rem",
            }}
          >
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Email address"
              name="email"
              value={email}
              onChange={handleEmailChange}
              required
              style={{ background: "transparent" }}
            />
            <label htmlFor="email">Email Address</label>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 py-3 fw-semibold mt-3 btn-submit-modern d-flex align-items-center justify-content-center"
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
                <span className="ms-2">Sending...</span>
              </>
            ) : (
              "Send Reset Instructions"
            )}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-muted">
            Remember your password?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/signin");
              }}
              className="fw-medium text-decoration-none"
              style={{ color: "#0C3C60" }}
            >
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
