import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import { AuthProvider, useAuth } from "./lib/auth-context";
import { ROLES } from "./lib/constants";
import DashboardRedirect from "./pages/DashboardRedirect";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CustomerDashboard from "./pages/CustomerDashboard";
import WorkerDashboard from "./pages/WorkerDashboard";
import ContractorDashboard from "./pages/ContractorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFoundPage from "./pages/NotFoundPage";

function AppContent() {
  const { user, logout, isReady, sessionNotice } = useAuth();

  if (!isReady) {
    return (
      <div className="page-loader">
        <div className="loader-panel">
          <span className="eyebrow">WORKNEST</span>
          <h1>Restoring your workspace</h1>
          <p>Checking the saved session and preparing the role-based routes.</p>
        </div>
      </div>
    );
  }

  return (
    <Layout user={user} onLogout={logout} notice={sessionNotice}>
      <Routes>
        <Route path="/" element={<LandingPage user={user} />} />
        <Route
          path="/login"
          element={
            <PublicRoute user={user}>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute user={user}>
              <RegisterPage />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user}>
              <DashboardRedirect />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/customer"
          element={
            <ProtectedRoute user={user} roles={[ROLES.CUSTOMER]}>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/worker"
          element={
            <ProtectedRoute user={user} roles={[ROLES.WORKER]}>
              <WorkerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/contractor"
          element={
            <ProtectedRoute user={user} roles={[ROLES.CONTRACTOR]}>
              <ContractorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute user={user} roles={[ROLES.ADMIN]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
