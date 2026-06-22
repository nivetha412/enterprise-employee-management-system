
import { Link } from "react-router-dom";

function Sidebar() {

  const role =
    localStorage.getItem("role");

  const logout = () => {

    localStorage.clear();

    window.location.href = "/";

  };

  return (

    <div
      style={{
        width: "220px",
        minHeight: "100vh",
        backgroundColor: "#f4f4f4",
        padding: "20px",
        borderRight: "1px solid #ddd"
      }}
    >

      <h2>EMS</h2>

      <hr />

      <Link
        to="/dashboard"
        style={{
          textDecoration: "none"
        }}
      >
        <p>Dashboard</p>
      </Link>

      {
        role === "ADMIN" && (
          <>
            <Link
              to="/employees"
              style={{
                textDecoration: "none"
              }}
            >
              <p>Employees</p>
            </Link>

            <Link
              to="/departments"
              style={{
                textDecoration: "none"
              }}
            >
              <p>Departments</p>
            </Link>

            <Link
              to="/attendance"
              style={{
                textDecoration: "none"
              }}
            >
              <p>Attendance</p>
            </Link>
          </>
        )
      }

      {
        role === "HR" && (
          <>
            <Link
              to="/employees"
              style={{
                textDecoration: "none"
              }}
            >
              <p>Employees</p>
            </Link>

            <Link
              to="/attendance"
              style={{
                textDecoration: "none"
              }}
            >
              <p>Attendance</p>
            </Link>
          </>
        )
      }

      {
        role === "EMPLOYEE" && (
          <>
            <Link
              to="/attendance"
              style={{
                textDecoration: "none"
              }}
            >
              <p>My Attendance</p>
            </Link>
          </>
        )
      }

      <br />

      <button
        onClick={logout}
      >
        Logout
      </button>

    </div>

  );
}

export default Sidebar;

