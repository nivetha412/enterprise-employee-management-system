import { Link } from "react-router-dom";
function Sidebar() {
  return (
    <div style={{
      width: "220px",
      backgroundColor: "#1e293b",
      color: "white",
      minHeight: "100vh",
      padding: "20px"
    }}>
      <h2>EMS</h2>

      <hr />

    <Link to="/dashboard">
  <p>Dashboard</p>
</Link>

<Link to="/employees">
  <p>Employees</p>
</Link>

<p>Departments</p>
<p>Attendance</p>
    </div>
  );
}

export default Sidebar;