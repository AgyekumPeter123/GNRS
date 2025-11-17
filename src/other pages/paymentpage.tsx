import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { supabase } from "../supabaseClient";

const plans = {
  monthly: {
    id: "monthly",
    name: "Monthly Subscription",
    price: 50, // Price in GHS
    durationDays: 30,
    features: [
      "Full Past Question Bank",
      "Premium Job Alerts",
      "Premium Scholarship Alerts",
      "Ad-free Experience",
    ],
  },
  yearly: {
    id: "yearly",
    name: "Yearly Subscription",
    price: 500, // Price in GHS
    durationDays: 365,
    features: [
      "Full Past Question Bank",
      "Premium Job Alerts",
      "Premium Scholarship Alerts",
      "Ad-free Experience",
      "2 Months Free Discount",
    ],
  },
};

export default function PaymentPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(plans.monthly);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");

  // This function is called when the "Pay Now" button is clicked
  const handlePayNow = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError("Payment integration is currently under development.");
    // In a real scenario, you would initiate Paystack payment here.
    console.log("Attempted to pay for:", selectedPlan.name);
  };

  const handleSkipForNow = async () => {
    if (!user || isUpdating) return;

    setIsUpdating(true);
    setError("");

    // Set has_onboarded to true so the user sees the dashboard next time.
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ has_onboarded: true })
      .eq("id", user.id);

    if (updateError) {
      setError(
        "Could not update your profile. Please try again or contact support."
      );
      console.error("Onboarding update error:", updateError);
      setIsUpdating(false);
    } else {
      navigate("/dashboard", { replace: true });
    }
  };

  // Effect to automatically clear the error message after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Ensure the error message clears if the user changes the plan selection
  useEffect(() => {
    setError("");
  }, [selectedPlan]);

  return (
    <div
      className="d-flex align-items-center justify-content-center py-5"
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
        className="card shadow-lg border-0 p-4 p-sm-5 bg-white"
        style={{
          width: "90%",
          maxWidth: "800px",
          borderRadius: "1rem",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <div className="text-center mb-4">
          <h2 className="fw-bolder text-dark mb-2">Choose Your Plan</h2>
          <p className="text-muted">
            Unlock premium features and support our platform.
          </p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row g-4">
          {Object.values(plans).map((plan) => (
            <div className="col-md-6" key={plan.id}>
              <div
                className={`card h-100 ${
                  selectedPlan.id === plan.id
                    ? "border-primary border-2"
                    : "border-light"
                }`}
                onClick={() => setSelectedPlan(plan)}
                style={{
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(5px)",
                  border:
                    selectedPlan.id === plan.id
                      ? "2px solid #0C3C60"
                      : "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "0.5rem",
                }}
              >
                <div className="card-body p-4">
                  <h4 className="card-title fw-bold">{plan.name}</h4>
                  <h1 className="display-5 fw-bolder">
                    GHS {plan.price}
                    <span className="fs-6 text-muted">
                      /{plan.id === "monthly" ? "mo" : "yr"}
                    </span>
                  </h1>
                  <ul className="list-unstyled mt-3 mb-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="d-grid gap-3 mt-4">
          <button
            onClick={handlePayNow}
            className="btn btn-primary btn-lg w-100 py-3 fw-semibold d-flex align-items-center justify-content-center"
            style={{ backgroundColor: "#0C3C60", borderColor: "#0C3C60" }}
            disabled={isUpdating}
          >
            Pay GHS {selectedPlan.price} Now
          </button>
          <button
            onClick={handleSkipForNow}
            className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center"
            disabled={isUpdating}
          >
            {isUpdating ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Saving...
              </>
            ) : (
              "Skip For Now"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
