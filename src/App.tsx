import { Routes, Route } from "react-router-dom";
import LandingPage from "./other pages/landingpage";
import SignUpPage from "./logins/signuppage";
import SignInPage from "./logins/signinpage";
import ForgotPasswordPage from "./other pages/ForgotPasswordPage";
import UpdatePasswordPage from "./other pages/UpdatePasswordPage";
import PaymentPage from "./other pages/paymentpage";
import UserDashboard from "./actors pages/user/userdashboard";
import AdminDashboard from "./actors pages/admin/admindashboard";
import StaffDashboard from "./actors pages/staff/staffdashboard";
import ProtectedRoute from "./ProtectedRoute";
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
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/staff" element={<StaffDashboard />} />
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
  return <AppRoutes />;
}
