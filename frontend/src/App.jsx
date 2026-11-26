import { lazy, Suspense, useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import api               from "./services/api";
import ProtectedRoute     from "./components/ProtectedRoute";

const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Employees = lazy(() => import("./pages/Employees"));
const Departments = lazy(() => import("./pages/Departments"));
const Attendance = lazy(() => import("./pages/Attendance"));
const Leave = lazy(() => import("./pages/Leave"));
const EmployeeDashboard = lazy(() => import("./pages/employee/EmployeeDashboard"));
const EmployeeAttendance = lazy(() => import("./pages/employee/EmployeeAttendance"));
const EmployeeLeave = lazy(() => import("./pages/employee/EmployeeLeave"));
const EmployeeProfile = lazy(() => import("./pages/employee/EmployeeProfile"));
const EmployeeSettings = lazy(() => import("./pages/employee/EmployeeSettings"));

// ── Redirect helpers ──────────────────────────────────────────────────────────

/** Redirects an authenticated user from / to their correct dashboard */
function RootRedirect() {
  const [destination, setDestination] = useState(null);

  useEffect(() => {
    api.get("/auth/me")
      .then((response) => {
        const serverRole = String(response?.data?.role || "").toUpperCase();
        if (!serverRole) {
          localStorage.clear();
          setDestination("login");
          return;
        }

        localStorage.setItem("role", serverRole);
        const mustChangePassword = response?.data?.mustChangePassword === true;
        localStorage.setItem("mustChangePassword", String(mustChangePassword));
        if (serverRole === "EMPLOYEE" && mustChangePassword) {
          setDestination("/employee/settings");
          return;
        }
        const domainMap = { ADMIN: "admin", EMPLOYEE: "employee" };
        const domain = domainMap[serverRole] || "employee";
        setDestination(`/${domain}/dashboard`);
      })
      .catch(() => {
        localStorage.clear();
        setDestination("login");
      });
  }, []);

  if (destination === "login") return <Login />;
  if (destination) return <Navigate to={destination} replace />;
  return <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", color: "#475569" }}>Loading…</div>;
}

/** Redirects /<domain> (no sub-path) → /<domain>/dashboard */
function DomainRoot({ domain }) {
  return <Navigate to={`/${domain}/dashboard`} replace />;
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "grid", placeItems: "center", color: "#475569" }}>Loading page…</div>}>
    <Routes>

      {/* ── Public ── */}
      <Route path="/" element={<RootRedirect />} />

      {/* ── Admin routes ── */}
      <Route path="/admin">
        <Route index element={<DomainRoot domain="admin" />} />

        <Route path="dashboard" element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="employees" element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <Employees />
          </ProtectedRoute>
        } />

        <Route path="departments" element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <Departments />
          </ProtectedRoute>
        } />

        <Route path="attendance" element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <Attendance />
          </ProtectedRoute>
        } />

        <Route path="leave" element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <Leave />
          </ProtectedRoute>
        } />

        <Route path="settings" element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <EmployeeSettings />
          </ProtectedRoute>
        } />

        {/* Unknown /admin/* → 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* ── Employee routes ── */}
      <Route path="/employee">
        <Route index element={<DomainRoot domain="employee" />} />

        <Route path="dashboard" element={
          <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
            <EmployeeDashboard />
          </ProtectedRoute>
        } />

        <Route path="attendance" element={
          <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
            <EmployeeAttendance />
          </ProtectedRoute>
        } />

        <Route path="leave" element={
          <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
            <EmployeeLeave />
          </ProtectedRoute>
        } />

        <Route path="profile" element={
          <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
            <EmployeeProfile />
          </ProtectedRoute>
        } />

        <Route path="settings" element={
          <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
            <EmployeeSettings />
          </ProtectedRoute>
        } />

        {/* Unknown /employee/* → 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* ── Global 404 ── */}
      <Route path="*" element={<NotFound />} />

    </Routes>
    </Suspense>
  );
}
