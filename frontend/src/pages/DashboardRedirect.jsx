import { Navigate } from "react-router-dom";
import { useAuth } from "../lib/auth-context";
import { dashboardPathForRole } from "../lib/utils";

export default function DashboardRedirect() {
  const { user } = useAuth();
  return <Navigate to={dashboardPathForRole(user?.role)} replace />;
}
