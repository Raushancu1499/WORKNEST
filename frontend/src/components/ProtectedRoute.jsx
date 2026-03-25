import { Navigate, useLocation } from "react-router-dom";
import { dashboardPathForRole } from "../lib/utils";

export default function ProtectedRoute({ user, roles, children }) {
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={dashboardPathForRole(user.role)} replace />;
  }

  return children;
}
