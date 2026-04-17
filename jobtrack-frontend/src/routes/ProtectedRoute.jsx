import { Navigate } from "react-router-dom";
import { getUserFromToken } from "../services/api";

function ProtectedRoute({ children, allowedRoles }) {
  const user = getUserFromToken();

  // No token
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role check
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;