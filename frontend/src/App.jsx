
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Landing Pages
import Landing from "./pages/Landing/Landing";
import ExploreOryn from "./pages/Landing/ExploreOryn";

// Authentication Pages
import SignIn from "./pages/Auth/SignIn";
import Signup from "./pages/Auth/Signup";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import ResetSuccess from "./pages/Auth/ResetSuccess";

// Dashboard Pages
import Dashboard from "./pages/Dashboard/Dashboard";
import UploadData from "./pages/Dashboard/UploadData";
import Validation from "./pages/Dashboard/Validation";
import Datasets from "./pages/Dashboard/Datasets";
import Problems from "./pages/Dashboard/Problems";
import Recommendations from "./pages/Dashboard/Recommendations";
import History from "./pages/Dashboard/History";
import Settings from "./pages/Dashboard/Settings";
import Profile from "./pages/Dashboard/Profile";
import Notifications from "./pages/Dashboard/Notifications";
import DashboardLayout from "./pages/Dashboard/DashboardLayout";

// Authentication Protection
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Landing Pages */}
          <Route path="/" element={<Landing />} />
          <Route path="/explore" element={<ExploreOryn />} />

          {/* Authentication */}
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />
          <Route
            path="/reset-password"
            element={<ResetPassword />}
          />
          <Route
            path="/reset-success"
            element={<ResetSuccess />}
          />

          {/* Protected Dashboard Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/upload" element={<UploadData />} />
              <Route path="/dashboard/validation" element={<Validation />} />
              <Route path="/dashboard/datasets" element={<Datasets />} />
              <Route path="/dashboard/problems" element={<Problems />} />

              <Route
                path="/dashboard/recommendations"
                element={<Recommendations />}
              />

              <Route path="/dashboard/history" element={<History />} />
              <Route path="/dashboard/settings" element={<Settings />} />
              <Route path="/dashboard/profile" element={<Profile />} />
              <Route
                path="/dashboard/notifications"
                element={<Notifications />}
              />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
