import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function LandingPage() {
  const navigate = useNavigate();
  const [rotationAngle, setRotationAngle] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSocialIndex, setActiveSocialIndex] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const socialIcons = [
    { name: "facebook", icon: "bi-facebook" },
    { name: "twitter", icon: "bi-twitter" },
    { name: "linkedin", icon: "bi-linkedin" },
    { name: "instagram", icon: "bi-instagram" },
    { name: "youtube", icon: "bi-youtube" },
  ];

  const socialAngle = 360 / socialIcons.length;

  // Handle scroll progress bar and back-to-top button
  const handleScroll = () => {
    const totalScroll = document.documentElement.scrollTop;
    const windowHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scroll = `${(totalScroll / windowHeight) * 100}`;

    setScrollProgress(Number(scroll));

    // Show or hide the back-to-top button
    setShowBackToTop(window.scrollY > 300);
  };

  // Attach scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Function to scroll to the top of the page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Handle social icon carousel navigation
  const handleSocialNav = (direction: "prev" | "next") => {
    setActiveSocialIndex((prevIndex) => {
      const newIndex = direction === "next" ? prevIndex + 1 : prevIndex - 1;
      return (newIndex + socialIcons.length) % socialIcons.length;
    });

    setRotationAngle((prevAngle) => {
      return direction === "next"
        ? prevAngle - socialAngle
        : prevAngle + socialAngle;
    });
  };
  return (
    <div
      style={{
        backgroundColor: "#f8f9fa",
        color: "#343a40",
      }}
    >
      {/* Navbar */}
      <header className="sticky-top shadow-sm">
        <nav className="navbar navbar-expand-lg navbar-light bg-white">
          <div className="container">
            <a
              className="navbar-brand d-flex align-items-center fw-bold"
              href="#"
              style={{ color: "#0C3C60" }}
            >
              <img
                src="/logo/GNRSlogo.png"
                alt="GNRS Logo"
                width="30"
                height="30"
                className="me-2"
              />
              GNRS
            </a>
            <button
              className="navbar-toggler hamburger-toggler collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#main-nav"
              aria-controls="main-nav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="hamburger-toggler-icon top-bar"></span>
              <span className="hamburger-toggler-icon middle-bar"></span>
              <span className="hamburger-toggler-icon bottom-bar"></span>
            </button>
            <div className="collapse navbar-collapse" id="main-nav">
              <ul className="navbar-nav mx-auto">
                <li className="nav-item">
                  <a className="nav-link nav-link-hover" href="#features">
                    Jobs
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link nav-link-hover" href="#features">
                    Education
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link nav-link-hover" href="#features">
                    Scholarships
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link nav-link-hover" href="#features">
                    Skilled Labor
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link nav-link-hover" href="#features">
                    News
                  </a>
                </li>
              </ul>
              <div className="d-flex gap-2">
                <button
                  onClick={() => navigate("/signin")}
                  className="btn btn-outline-primary fw-bold"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="btn btn-primary fw-bold"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </nav>
        <div className="progress-container">
          <div
            className="progress-bar"
            style={{ width: `${scrollProgress}%` }}
          ></div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="d-flex flex-column align-items-center justify-content-center text-center text-white"
        style={{
          backgroundImage:
            "linear-gradient(rgba(12, 60, 96, 0.7), rgba(12, 60, 96, 0.6)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuCMQaCpqqWj-4M4La-90wHbzB-R89tlZ9iuFAvCBIcmhgIp-Sg4FobS_0BU50J9j1qAkDAgjK7jIlZCEihe1Eme8E8oyOG5btPtBp4ZBYqj1yZ241_Scr4Zds-coc0tzeloaVV2Q0TMbV7iuYMxxqo-HE6yqRhCiIedVoK4V2wRdeNKtEI3Cie3dXp5kzcm57VNGzIwNKRjB5Yi59w1UEM93-u3ne9ZqjkOD0Txtbzjhtl_NAS6n2J5xTlDPYC9CWCylXAcE007sdY')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "60vh",
          padding: "4rem 1rem",
        }}
      >
        <div className="container" style={{ maxWidth: "800px" }}>
          <h1 className="display-4 fw-bolder mb-3">
            Ghana's Central Hub for Opportunity
          </h1>
          <p className="lead mb-4" style={{ color: "rgba(255,255,255,0.9)" }}>
            Connect to jobs, education, scholarships, and skilled
            professionals—all in one place.
          </p>
          <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
            <button
              className="btn btn-lg fw-bold"
              style={{ backgroundColor: "#D4AF37", color: "#0C3C60" }}
            >
              Explore Resources
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="btn btn-light btn-lg fw-bold"
            >
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* Search Bar Section */}
      <section className="py-5" style={{ marginTop: "-80px" }}>
        <div className="container" style={{ maxWidth: "700px" }}>
          <div className="bg-white p-4 rounded-3 shadow-lg">
            <h3 className="text-center mb-3 fw-bold">Find What You Need</h3>
            <div className="input-group input-group-lg">
              <input
                type="text"
                className="form-control"
                placeholder="Search for jobs, courses, scholarships..."
              />
              <button className="btn btn-primary" type="button">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-5 text-center"
        style={{ position: "relative", zIndex: 2 }}
      >
        <div className="container">
          <h2 className="fw-bolder mb-3">Discover Your Path</h2>
          <p
            className="lead text-muted mb-5 mx-auto"
            style={{ maxWidth: "700px" }}
          >
            Whatever your goal, GNRS provides the resources and connections to
            help you achieve it. Start your journey today.
          </p>
          <div className="row g-4">
            {[
              {
                icon: "briefcase",
                title: "Find Your Career",
                text: "Explore job opportunities from top employers across Ghana.",
              },
              {
                icon: "book",
                title: "Advance Your Education",
                text: "Find courses and programs to further your academic journey.",
              },
              {
                icon: "award",
                title: "Fund Your Future",
                text: "Discover scholarships to support your educational goals.",
              },
              {
                icon: "tools",
                title: "Learn a Skill",
                text: "Access vocational training to gain practical, in-demand skills.",
              },
              {
                icon: "people",
                title: "Hire a Professional",
                text: "Connect with verified skilled labor for your projects.",
              },
              {
                icon: "newspaper",
                title: "Stay Informed",
                text: "Get the latest news and updates relevant to your career.",
              },
            ].map((card, i) => (
              <div className="col-lg-4 col-md-6" key={i}>
                <div className="card h-100 border-0 shadow-sm feature-card">
                  <div className="card-body p-4">
                    <div
                      className="d-inline-block p-3 mb-3 rounded-3"
                      style={{ backgroundColor: "#cfe2ff", color: "#0C3C60" }}
                    >
                      <i className={`bi bi-${card.icon} fs-2`}></i>
                    </div>
                    <h5 className="card-title fw-bold">{card.title}</h5>
                    <p className="card-text text-muted">{card.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <div
        className="py-5"
        style={{
          background: "linear-gradient(135deg, #0C3C60 0%, #2165a1ff 74%)",
        }}
      >
        <section className="container text-center glass-section">
          <div>
            <h2 className="fw-bolder mb-3 text-white">How It Works</h2>
            <p
              className="lead text-white-50 mb-5 mx-auto"
              style={{ maxWidth: "700px" }}
            >
              Get connected to your next opportunity in three simple steps.
            </p>
            <div className="row g-5">
              {[
                {
                  icon: "search",
                  step: "1. Search",
                  desc: "Use our powerful search to find exactly what you're looking for.",
                },
                {
                  icon: "person-check",
                  step: "2. Connect",
                  desc: "Apply for opportunities or connect with professionals.",
                },
                {
                  icon: "graph-up-arrow",
                  step: "3. Succeed",
                  desc: "Achieve your personal and professional goals.",
                },
              ].map((s, i) => (
                <div className="col-md-4" key={i}>
                  <div className="p-4">
                    <div
                      className="d-inline-flex align-items-center justify-content-center mb-3 rounded-circle"
                      style={{
                        width: "70px",
                        height: "70px",
                        backgroundColor: "#fcf8e3",
                        color: "#D4AF37",
                      }}
                    >
                      <i className={`bi bi-${s.icon} fs-1`}></i>
                    </div>
                    <h5 className="fw-bold text-white">{s.step}</h5>
                    <p className="text-white-50">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer
        className="py-2"
        style={{ backgroundColor: "#0C3C60", color: "white" }}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-4 mb-4 mb-lg-0">
              <h4 className="fw-bold mb-3">GNRS</h4>
              <p className="text-white-50">
                Ghana's Central Hub for Opportunity.
              </p>
            </div>
            <div className="col-6 col-lg-2 mb-4 mb-lg-0">
              <h5 className="fw-bold mb-3">About</h5>
              <ul>
                <li className="mb-2">
                  <a
                    href="#"
                    className="text-white-50 text-decoration-none footer-glass-link"
                  >
                    <span>About Us</span>
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    href="#"
                    className="text-white-50 text-decoration-none footer-glass-link"
                  >
                    <span>Contact</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white-50 text-decoration-none footer-glass-link"
                  >
                    <span>News</span>
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-6 col-lg-2 mb-4 mb-lg-0">
              <h5 className="fw-bold mb-3">Resources</h5>
              <ul>
                <li className="mb-2">
                  <a
                    href="#"
                    className="text-white-50 text-decoration-none footer-glass-link"
                  >
                    <span>Jobs</span>
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    href="#"
                    className="text-white-50 text-decoration-none footer-glass-link"
                  >
                    <span>Education</span>
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    href="#"
                    className="text-white-50 text-decoration-none footer-glass-link"
                  >
                    <span>Scholarships</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white-50 text-decoration-none footer-glass-link"
                  >
                    <span>Skilled Labor</span>
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-6 col-lg-2 mb-4 mb-lg-0">
              <h5 className="fw-bold mb-3">Support</h5>
              <ul>
                <li className="mb-2">
                  <a
                    href="#"
                    className="text-white-50 text-decoration-none footer-glass-link"
                  >
                    <span>FAQ</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white-50 text-decoration-none footer-glass-link"
                  >
                    <span>Help Center</span>
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-6 col-lg-2">
              <h5 className="fw-bold mb-3">Legal</h5>
              <ul>
                <li className="mb-2">
                  <a
                    href="#"
                    className="text-white-50 text-decoration-none footer-glass-link"
                  >
                    <span>Privacy Policy</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white-50 text-decoration-none footer-glass-link"
                  >
                    <span>Terms of Service</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <hr
            className="my-4"
            style={{ borderColor: "rgba(255,255,255,0.2)" }}
          />
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center text-center text-sm-start">
            <div>
              <p className="small text-white-50 mb-0">
                &copy; 2025 Ghana National Resource System. All Rights Reserved.
              </p>
              <p className="small text-white-50 mb-0">
                Created by{" "}
                <a
                  href="https://preview--meta-consult.lovable.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fw-semibold text-white-50 text-decoration-none"
                  style={{ transition: "color 0.3s" }}
                >
                  METASCHOLAR CONSULT LIMITED
                </a>
              </p>
            </div>
            <div className="social-carousel-container mt-3 mt-sm-0">
              <button
                className="social-nav-arrow prev"
                onClick={() => handleSocialNav("prev")}
              >
                <i className="bi bi-chevron-left"></i>
              </button>
              <div className="social-carousel">
                <div
                  className="social-carousel-inner"
                  style={{
                    transform: `rotateY(${rotationAngle}deg)`,
                  }}
                >
                  {socialIcons.map((social, index) => (
                    <a
                      key={index}
                      href="#"
                      className={`social-icon ${
                        index === activeSocialIndex ? "active" : ""
                      }`}
                    >
                      <i className={`bi ${social.icon}`}></i>
                    </a>
                  ))}
                </div>
              </div>
              <button
                className="social-nav-arrow next"
                onClick={() => handleSocialNav("next")}
              >
                <i className="bi bi-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`btn btn-primary back-to-top-btn ${
          showBackToTop ? "show" : ""
        }`}
        title="Go to top"
      >
        <i className="bi bi-arrow-up"></i>
      </button>
    </div>
  );
}
