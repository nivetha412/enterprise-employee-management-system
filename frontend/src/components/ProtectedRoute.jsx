import { Navigate, useLocation } from "react-router-dom";
import { DOMAIN_TO_ROLE, ROLE_TO_DOMAIN } from "../context/RoleContext";

/**
 * Guards a route by:
 * 1. Requiring a valid token + role in localStorage
 * 2. Ensuring the URL domain segment matches the stored role
 * 3. Ensuring the stored role is in allowedRoles
 *
 * Usage:
 *   <ProtectedRoute allowedRoles={["ADMIN"]}>
 *     <SomePage />
 *   </ProtectedRoute>
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const token    = localStorage.getItem("token");
  const role     = localStorage.getItem("role");
  const location = useLocation();

  // 1. Not authenticated → login
  if (!token || !role) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // 2. Extract domain from current URL path (first segment after /)
  const urlDomain = location.pathname.split("/")[1]; // "admin" | "employee"
  const expectedRole = DOMAIN_TO_ROLE[urlDomain];

  // If URL domain is a known domain but doesn't match stored role → redirect to correct domain
  if (expectedRole && expectedRole !== role) {
    const correctDomain = ROLE_TO_DOMAIN[role] || "employee";
    return <Navigate to={`/${correctDomain}/dashboard`} replace />;
  }

  // 3. Role not in allowedRoles → redirect to own dashboard
  if (allowedRoles && !allowedRoles.includes(role)) {
    const correctDomain = ROLE_TO_DOMAIN[role] || "employee";
    return <Navigate to={`/${correctDomain}/dashboard`} replace />;
  }

  return children;
}
