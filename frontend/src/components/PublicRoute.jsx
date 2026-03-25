import { Navigate } from "react-router-dom";
import { dashboardPathForRole } from "../lib/utils";

export default function PublicRoute({ user, children }) {
  if (user) {
    return <Navigate to={dashboardPathForRole(user.role)} replace />;
  }

  return children;
}
