import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./landingpage";
import SignUpPage from "./signuppage";
import SignInPage from "./signinpage";
import ForgotPasswordPage from "./ForgotPasswordPage";
import UpdatePasswordPage from "./UpdatePasswordPage";
import PaymentPage from "./paymentpage";
import UserDashboard from "./userdashboard";
import ProtectedRoute from "./ProtectedRoute";
import { supabase } from "./supabaseClient";
import Root from "./Root";

/**
 * The main application component, which contains the React Router
 * configuration and renders the main routes of the application.
 *
 * The App component is the top-level component of the application,
 * and it contains the main routes of the application. The App component
 * renders the React Router configuration, which includes the routes for
 * the landing page and the dashboard.
 */

/**
 * The main application component that defines routing configuration.
 */
function AppRoutes() {
  return (
    <Routes>
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/payment" element={<PaymentPage />} />
      </Route>

      {/* Public routes are nested under the Root component */}
      <Route path="/" element={<Root />}>
        <Route index element={<LandingPage />} />
        <Route path="landingpage" element={<LandingPage />} />
        <Route path="signup" element={<SignUpPage />} />
        <Route path="signin" element={<SignInPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="update-password" element={<UpdatePasswordPage />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
