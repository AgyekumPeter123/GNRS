import type { JSX } from "react";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

export default function SignInPage(): JSX.Element {
  const navigate = useNavigate();

  const [loading, setLoading] = useState<
    null | "google" | "facebook" | "manual"
  >(null);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Parse URL for error messages
  const urlParams = useMemo(
    () => new URLSearchParams(window.location.search),
    [window.location.search]
  );

  // Effect to automatically clear the error message after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }

    // Check for specific error from URL on initial load
    const urlError = urlParams.get("error");
    if (urlError === "no_existing_profile") {
      setError(
        "No existing account found for this Google email. Please sign up first."
      );
      setError("No account found with this email. Please sign up first.");
    } else if (urlError === "profile_check_failed") {
      setError("Failed to verify profile. Please try again.");
    }
    // Clear the error from URL after displaying
    urlParams.delete("error");
  }, [error]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) setError(""); // Clear error on change
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading("google");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) {
      setError(error.message);
    }
    // Don't reset loading state here, as the page will redirect.
  };

  const handleFacebookSignIn = async () => {
    setError("");
    setLoading("facebook");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "facebook",
    });
    if (error) {
      setError(error.message);
    }
    // Don't reset loading state here, as the page will redirect.
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading("manual");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setError(error.message);
      } else {
        // On successful sign-in, check user role and navigate accordingly
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("email", formData.email)
          .single();

        if (profileError && profileError.code !== "PGRST116") {
          console.error("Error fetching user profile:", profileError);
          setError("Failed to verify user role. Please try again.");
          return;
        }

        if (profile && profile.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (catchError: any) {
      setError(
        catchError.message || "An unexpected error occurred during sign-in."
      );
    } finally {
      setLoading(null);
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
          backgroundImage: "url('/logo/user.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.3,
          filter: "blur(8px)",
          zIndex: 0,
        }}
      ></div>
      <div className="background-text-container">
        <span className="background-text-left">GN</span>
        <span className="background-text-right">RS</span>
      </div>
      <div
        className="card shadow-lg border-0 p-4 p-sm-5 animated-signin-card"
        style={{
          width: "90%",
          maxWidth: "520px",
          borderRadius: "1rem",
          position: "relative",
          zIndex: 1,
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <div className="text-center mb-4">
          <div
            className="d-flex align-items-center justify-content-center fw-bold mb-3"
            style={{ color: "#0C3C60" }}
          >
            <img
              src="/logo/GNRSlogo.png"
              alt="GNRS Logo"
              width="36"
              height="36"
              className="me-2"
            />
            <h2 className="h4 m-0">GNRS</h2>
          </div>
          <h3 className="fw-bold text-dark mb-1">Welcome Back</h3>
          <p className="text-muted">Sign in to continue to your account.</p>
        </div>

        <div className="d-grid gap-3 mb-4">
          <button
            className="btn btn-light border py-2 btn-social d-flex align-items-center justify-content-center"
            onClick={handleGoogleSignIn}
            disabled={loading !== null}
          >
            {loading === "google" ? (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
            ) : (
              <>
                <i className="bi bi-google me-2"></i> Sign in with Google
              </>
            )}
          </button>
          <button
            className="btn btn-light border py-2 btn-social d-flex align-items-center justify-content-center"
            onClick={handleFacebookSignIn}
            disabled={loading !== null}
          >
            {loading === "facebook" ? (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
            ) : (
              <>
                <i className="bi bi-facebook me-2"></i> Sign in with Facebook
              </>
            )}
          </button>
        </div>

        <div className="d-flex align-items-center my-3">
          <hr className="flex-grow-1" />
          <span className="px-3 text-muted">OR</span>
          <hr className="flex-grow-1" />
        </div>

        <form onSubmit={handleSubmit}>
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
              value={formData.email}
              onChange={handleChange}
              required
              style={{ background: "transparent" }}
            />
            <label htmlFor="email">Email Address</label>
          </div>

          <div
            className="form-floating mb-4 position-relative"
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
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{ background: "transparent" }}
            />
            <label htmlFor="password">Password</label>
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="position-absolute top-50 end-0 translate-middle-y pe-3"
              style={{ cursor: "pointer" }}
              aria-label="Toggle password visibility"
            >
              <i className={showPassword ? "bi bi-eye" : "bi bi-eye-slash"}></i>
            </span>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label
                className="form-check-label text-muted"
                htmlFor="rememberMe"
                style={{ fontSize: "0.9rem" }}
              >
                Remember me
              </label>
            </div>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/forgot-password");
              }}
              className="fw-medium text-decoration-none"
              style={{ color: "#0C3C60", fontSize: "0.9rem" }}
            >
              Forgot password?
            </a>
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
            disabled={loading !== null}
          >
            {loading === "manual" ? (
              <>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                <span className="ms-2">Signing In...</span>
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-muted">
            Don't have an account?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/signup");
              }}
              className="fw-medium text-decoration-none"
              style={{ color: "#0C3C60" }}
            >
              Sign up
            </a>
          </p>
        </div>
        {error && <div className="alert alert-danger mt-4 mb-0">{error}</div>}
      </div>
    </div>
  );
}
