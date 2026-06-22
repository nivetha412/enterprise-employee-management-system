import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Departments from "./pages/Departments";
import Attendance from "./pages/Attendance";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>

      <Route
        path="/"
        element={<Login />}
      />

      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      <Route
  path="/employees"
  element={
    <ProtectedRoute
      allowedRoles={[
        "ADMIN",
        "HR"
      ]}
    >
      <Employees />
    </ProtectedRoute>
  }
/>

      <Route
  path="/departments"
  element={
    <ProtectedRoute
      allowedRoles={[
        "ADMIN"
      ]}
    >
      <Departments />
    </ProtectedRoute>
  }
/>
<Route
  path="/attendance"
  element={
    <ProtectedRoute
      allowedRoles={[
        "ADMIN",
        "HR",
        "EMPLOYEE"
      ]}
    >
      <Attendance />
    </ProtectedRoute>
  }
/>

    </Routes>
  );
}

export default App;