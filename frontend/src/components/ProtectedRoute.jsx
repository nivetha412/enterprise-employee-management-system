import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import api from "../services/api";
import { DOMAIN_TO_ROLE, ROLE_TO_DOMAIN } from "../context/RoleContext";

/**
 * Guards a route by:
 * 1. Requiring a valid backend session for the current token
 * 2. Ensuring the URL domain segment matches the server-returned role
 * 3. Ensuring the returned role is in allowedRoles
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRole(null);
      setLoading(false);
      return;
    }

    let ignore = false;

    api.get("/auth/me")
      .then((response) => {
        if (ignore) return;
        const serverRole = String(response?.data?.role || "").toUpperCase();
        if (!serverRole) {
          localStorage.clear();
          setRole(null);
          setLoading(false);
          return;
        }

        localStorage.setItem("role", serverRole);
        setRole(serverRole);
        setLoading(false);
      })
      .catch(() => {
        if (ignore) return;
        localStorage.clear();
        setRole(null);
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [location.pathname]);

  if (loading) {
    return <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", color: "#475569" }}>Loading…</div>;
  }

  if (!localStorage.getItem("token") || !role) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  const urlDomain = location.pathname.split("/")[1];
  const expectedRole = DOMAIN_TO_ROLE[urlDomain];

  if (expectedRole && expectedRole !== role) {
    const correctDomain = ROLE_TO_DOMAIN[role] || "employee";
    return <Navigate to={`/${correctDomain}/dashboard`} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    const correctDomain = ROLE_TO_DOMAIN[role] || "employee";
    return <Navigate to={`/${correctDomain}/dashboard`} replace />;
  }

  return children;
}
