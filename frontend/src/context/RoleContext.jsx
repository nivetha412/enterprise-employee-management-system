import { createContext, useContext, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const ROLE_TO_DOMAIN = {
  ADMIN:    "admin",
  HR:       "hr",
  EMPLOYEE: "employee",
};

export const DOMAIN_TO_ROLE = {
  admin:    "ADMIN",
  hr:       "HR",
  employee: "EMPLOYEE",
};

const RoleContext = createContext(null);

export function RoleProvider({ children }) {
  const [role, setRoleState] = useState(
    () => localStorage.getItem("role") || null
  );

  const setRole = useCallback((newRole) => {
    localStorage.setItem("role", newRole);
    setRoleState(newRole);
  }, []);

  const domain = ROLE_TO_DOMAIN[role] || null;

  return (
    <RoleContext.Provider value={{ role, domain, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  return useContext(RoleContext);
}

/**
 * Drop-in replacement for useNavigate() that automatically
 * prepends /:domain to every path.
 *
 * Usage:  const navigate = useDomainNav();
 *         navigate("/dashboard");  →  /admin/dashboard
 */
export function useDomainNav() {
  const navigate  = useNavigate();
  const params    = useParams();
  const { domain: ctxDomain } = useRole();

  const domain =
    params?.domain ||
    ctxDomain ||
    ROLE_TO_DOMAIN[localStorage.getItem("role")] ||
    "employee";

  return useCallback(
    (path, options) => {
      const clean = path.replace(/^\/(admin|hr|employee)/, "");
      navigate(`/${domain}${clean}`, options);
    },
    [navigate, domain]
  );
}
