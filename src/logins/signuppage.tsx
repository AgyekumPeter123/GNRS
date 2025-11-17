import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
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

  const [error, setError] = useState("");
  const navigate = useNavigate();

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

  // Handlers to clear alerts when user starts typing
  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) setError("");
    setFullName(e.target.value);
  };
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) setError("");
    setPhone(e.target.value);
  };
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) setError("");
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) setError("");
    setPassword(e.target.value);
  };
  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (error) setError("");
    setConfirmPassword(e.target.value);
  };

  useEffect(() => {
    // This will run whenever the password changes
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

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: fullName,
          phone: phone, // Pass the phone number here
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
    } else if (data.user) {
      // Supabase sends a confirmation email by default.
      // The user object is returned, but the session is null until the email is confirmed.
      // A user is considered "registered" if their identities array is empty, which can indicate they already exist.
      if (data.user.identities && data.user.identities.length === 0) {
        setError("This user already exists. Please try to sign in.");
      } else {
        setMessage(
          "Registration successful! Please check your email to confirm your account."
        );
        setTimeout(() => navigate("/payment"), 2000); // Redirect after 2 seconds
      }
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
      className="d-flex align-items-center justify-content-center py-3"
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
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div
              className="card shadow-lg border-0"
              id="signup-form-card"
              style={{
                borderRadius: "1rem",
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <div className="card-body p-4 p-sm-5">
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
                  <h3 className="fw-bold text-dark mb-1">Join Us Today!</h3>
                  <p className="text-muted">
                    Create your account to get started.
                  </p>
                </div>

                <form onSubmit={handleSignUp} noValidate>
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
                      type="text"
                      className="form-control"
                      id="fullName"
                      placeholder="Full Name"
                      name="fullName"
                      value={fullName}
                      onChange={handleFullNameChange}
                      required
                      style={{ background: "transparent" }}
                    />
                    <label htmlFor="fullName">Full Name</label>
                  </div>
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
                      type="tel"
                      className="form-control"
                      id="phone"
                      placeholder="Phone Number"
                      name="phone"
                      value={phone}
                      onChange={handlePhoneChange}
                      required
                      style={{ background: "transparent" }}
                    />
                    <label htmlFor="phone">Phone Number</label>
                  </div>
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
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
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
                          placeholder="Password"
                          name="password"
                          value={password}
                          onChange={handlePasswordChange}
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
                          <i
                            className={
                              showPassword ? "bi bi-eye" : "bi bi-eye-slash"
                            }
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
                            <i className="bi bi-check-circle-fill me-2"></i>
                            8+ characters
                          </li>
                          <li className={requirements.uppercase ? "valid" : ""}>
                            <i className="bi bi-check-circle-fill me-2"></i>1
                            uppercase
                          </li>
                          <li className={requirements.lowercase ? "valid" : ""}>
                            <i className="bi bi-check-circle-fill me-2"></i>1
                            lowercase
                          </li>
                          <li className={requirements.number ? "valid" : ""}>
                            <i className="bi bi-check-circle-fill me-2"></i>1
                            number
                          </li>
                          <li className={requirements.special ? "valid" : ""}>
                            <i className="bi bi-check-circle-fill me-2"></i>1
                            special
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-md-6">
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
                          placeholder="Confirm Password"
                          name="confirmPassword"
                          value={confirmPassword}
                          onChange={handleConfirmPasswordChange}
                          required
                          style={{ background: "transparent" }}
                        />
                        <label htmlFor="confirmPassword">
                          Confirm Password
                        </label>
                        <span
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="position-absolute top-50 end-0 translate-middle-y pe-3"
                          style={{ cursor: "pointer" }}
                          aria-label="Toggle password visibility"
                        >
                          <i
                            className={
                              showConfirmPassword
                                ? "bi bi-eye"
                                : "bi bi-eye-slash"
                            }
                          ></i>
                        </span>
                      </div>
                    </div>
                  </div>

                  {message && (
                    <div className="alert alert-success">{message}</div>
                  )}
                  {error && <div className="alert alert-danger">{error}</div>}

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-3 fw-semibold mt-3 btn-submit-modern d-flex align-items-center justify-content-center"
                    style={{
                      background: "linear-gradient(145deg, #104b7a, #0C3C60)",
                      borderColor: "#0C3C60",
                      borderRadius: "0.5rem",
                      minHeight: "58px", // Ensure consistent height
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
                        <span className="ms-2">Signing Up...</span>
                      </>
                    ) : (
                      "Sign Up"
                    )}
                  </button>
                </form>
                <div className="text-center mt-3">
                  <p>
                    Already have an account?{" "}
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
          </div>
        </div>
      </div>
    </div>
  );
}
