import { Navigate } from "react-router-dom";

function ProtectedRoute({
  children,
  allowedRoles
}) {

  const role =
    localStorage.getItem("role");

  if (!role) {

    return <Navigate to="/" />;

  }

  if (
    !allowedRoles.includes(role)
  ) {

    return (
      <Navigate
        to="/dashboard"
      />
    );

  }

  return children;
}

export default ProtectedRoute;