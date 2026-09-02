/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const ROLE_TO_DOMAIN = {
  ADMIN:    "admin",
  EMPLOYEE: "employee",
};

export const DOMAIN_TO_ROLE = {
  admin:    "ADMIN",
  employee: "EMPLOYEE",
};

const RoleContext = createContext(null);

export function RoleProvider({ children }) {
  const [role, setRoleState] = useState(
    () => localStorage.getItem("role") || null
  );
  const [employeeId, setEmployeeIdState] = useState(
    () => localStorage.getItem("employeeId") || null
  );

  const setRole = useCallback((newRole) => {
    localStorage.setItem("role", newRole);
    setRoleState(newRole);
  }, []);

  const setEmployeeId = useCallback((id) => {
    if (id) {
      localStorage.setItem("employeeId", String(id));
      setEmployeeIdState(String(id));
    }
  }, []);

  const domain = ROLE_TO_DOMAIN[role] || null;

  return (
    <RoleContext.Provider value={{ role, domain, setRole, employeeId, setEmployeeId }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  return useContext(RoleContext);
}

/**
 * Domain-aware navigation hook.
 * Derives the current domain from the URL pathname (most reliable source).
 * Falls back to RoleContext domain, then localStorage.
 *
 * Usage:
 *   const navigate = useDomainNav();
 *   navigate("/dashboard");   →  /admin/dashboard  (if logged in as ADMIN)
 *   navigate("/employees");   →  /admin/employees
 */
export function useDomainNav() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { domain: ctxDomain } = useRole();

  // Derive domain from current URL first segment — most reliable on refresh
  const urlSegment = location.pathname.split("/")[1];
  const domain =
    (DOMAIN_TO_ROLE[urlSegment] ? urlSegment : null) ||
    ctxDomain ||
    ROLE_TO_DOMAIN[localStorage.getItem("role")] ||
    "employee";

  return useCallback(
    (path, options) => {
      const clean = path.replace(/^\/(admin|employee)/, "").replace(/^([^/])/, "/$1");
      navigate(`/${domain}${clean}`, options);
    },
    [navigate, domain]
  );
}
