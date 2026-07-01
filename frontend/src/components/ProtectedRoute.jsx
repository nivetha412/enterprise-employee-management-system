import { Navigate, useParams } from "react-router-dom";
import { DOMAIN_TO_ROLE, ROLE_TO_DOMAIN } from "../context/RoleContext";

function ProtectedRoute({ children, allowedRoles }) {
  const token  = localStorage.getItem("token");
  const role   = localStorage.getItem("role");
  const { domain } = useParams();

  // Not authenticated → login
  if (!token || !role) return <Navigate to="/" replace />;

  // URL domain doesn't match stored role → redirect to correct domain
  if (domain && DOMAIN_TO_ROLE[domain] !== role) {
    const correctDomain = ROLE_TO_DOMAIN[role] || "employee";
    return <Navigate to={`/${correctDomain}/dashboard`} replace />;
  }

  // Role not allowed for this page → go to own dashboard
  if (allowedRoles && !allowedRoles.includes(role)) {
    const correctDomain = ROLE_TO_DOMAIN[role] || "employee";
    return <Navigate to={`/${correctDomain}/dashboard`} replace />;
  }

  return children;
}

export default ProtectedRoute;
