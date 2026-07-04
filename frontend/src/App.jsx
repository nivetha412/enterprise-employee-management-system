import { Routes, Route, Navigate } from "react-router-dom";

import Login                from "./pages/Login";
import Dashboard            from "./pages/Dashboard";
import EmployeeDashboard    from "./pages/employee/EmployeeDashboard";
import EmployeeAttendance   from "./pages/employee/EmployeeAttendance";
import Employees            from "./pages/Employees";
import Departments          from "./pages/Departments";
import Attendance           from "./pages/Attendance";
import Leave                from "./pages/Leave";
import ProtectedRoute       from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>

      {/* Public */}
      <Route path="/" element={<Login />} />

      {/* Domain-scoped protected routes */}
      <Route path="/:domain">

        <Route path="dashboard" element={
          <ProtectedRoute allowedRoles={["ADMIN", "HR", "EMPLOYEE"]}>
            <DashboardRouter />
          </ProtectedRoute>
        } />

        <Route path="attendance" element={
          <ProtectedRoute allowedRoles={["ADMIN", "HR", "EMPLOYEE"]}>
            <AttendanceRouter />
          </ProtectedRoute>
        } />

        <Route path="leave" element={
          <ProtectedRoute allowedRoles={["ADMIN", "HR", "EMPLOYEE"]}>
            <Leave />
          </ProtectedRoute>
        } />

        <Route path="employees" element={
          <ProtectedRoute allowedRoles={["ADMIN", "HR"]}>
            <Employees />
          </ProtectedRoute>
        } />

        <Route path="departments" element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <Departments />
          </ProtectedRoute>
        } />

        {/* /:domain with no sub-path → go to dashboard */}
        <Route index element={<DomainIndex />} />

        {/* Unknown sub-path under a domain → go to that domain's dashboard */}
        <Route path="*" element={<DomainIndex />} />

      </Route>

      {/* Absolute catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}

/** Renders the correct dashboard based on the logged-in role */
function DashboardRouter() {
  const role = localStorage.getItem("role");
  return role === "EMPLOYEE" ? <EmployeeDashboard /> : <Dashboard />;
}

/** Renders the correct attendance page based on role */
function AttendanceRouter() {
  const role = localStorage.getItem("role");
  return role === "EMPLOYEE" ? <EmployeeAttendance /> : <Attendance />;
}

/** Redirects /:domain → /:domain/dashboard */
function DomainIndex() {
  const token = localStorage.getItem("token");
  const role  = localStorage.getItem("role");
  if (!token || !role) return <Navigate to="/" replace />;

  const domainMap = { ADMIN: "admin", HR: "hr", EMPLOYEE: "employee" };
  const domain = domainMap[role] || "employee";
  return <Navigate to={`/${domain}/dashboard`} replace />;
}

export default App;
