import { Link, useLocation } from "react-router-dom";

const navItems = {
  ADMIN: [
    { to: "/dashboard", icon: "📊", label: "Dashboard" },
    { to: "/employees", icon: "👥", label: "Employees" },
    { to: "/departments", icon: "🏢", label: "Departments" },
    { to: "/attendance", icon: "🕐", label: "Attendance" },
  ],
  HR: [
    { to: "/dashboard", icon: "📊", label: "Dashboard" },
    { to: "/employees", icon: "👥", label: "Employees" },
    { to: "/attendance", icon: "🕐", label: "Attendance" },
  ],
  EMPLOYEE: [
    { to: "/dashboard", icon: "📊", label: "Dashboard" },
    { to: "/attendance", icon: "🕐", label: "My Attendance" },
  ],
};

function Sidebar() {
  const role = localStorage.getItem("role");
  const location = useLocation();

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const items = navItems[role] || navItems["EMPLOYEE"];

  return (
    <div style={{
      width: "var(--sidebar-width)",
      minHeight: "calc(100vh - var(--navbar-height))",
      background: "#1e1b4b",
      display: "flex",
      flexDirection: "column",
      padding: "20px 12px",
      flexShrink: 0,
      position: "sticky",
      top: "var(--navbar-height)",
      height: "calc(100vh - var(--navbar-height))",
      overflowY: "auto"
    }}>
      <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "0 10px", marginBottom: "8px" }}>
        Navigation
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1 }}>
        {items.map(({ to, icon, label }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 12px",
                borderRadius: "8px",
                textDecoration: "none",
                color: isActive ? "#fff" : "rgba(255,255,255,0.6)",
                background: isActive ? "rgba(99,102,241,0.35)" : "transparent",
                fontWeight: isActive ? 600 : 400,
                fontSize: "13.5px",
                transition: "all 0.15s ease",
                borderLeft: isActive ? "3px solid #818cf8" : "3px solid transparent",
              }}
            >
              <span style={{ fontSize: "15px", width: "20px", textAlign: "center" }}>{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      <div style={{ marginTop: "auto", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <button
          onClick={logout}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 12px",
            borderRadius: "8px",
            background: "rgba(220,38,38,0.15)",
            color: "#fca5a5",
            border: "1px solid rgba(220,38,38,0.25)",
            cursor: "pointer",
            fontSize: "13.5px",
            fontWeight: 500,
            transition: "all 0.15s ease",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(220,38,38,0.28)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(220,38,38,0.15)"}
        >
          <span>🚪</span> Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
