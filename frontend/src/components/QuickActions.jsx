import { useNavigate } from "react-router-dom";

const actions = [
  { label: "Employees", icon: "👥", path: "/employees", color: "#4f46e5", bg: "#eef2ff" },
  { label: "Departments", icon: "🏢", path: "/departments", color: "#7c3aed", bg: "#ede9fe" },
  { label: "Attendance", icon: "🕐", path: "/attendance", color: "#059669", bg: "#d1fae5" },
  { label: "Leave", icon: "📝", path: "/leave", color: "#d97706", bg: "#fef3c7" },
  { label: "Reports", icon: "📊", path: "/reports", color: "#0891b2", bg: "#cffafe" },
];

function QuickActions() {
  const navigate = useNavigate();

  return (
    <div style={{
      background: "#fff",
      padding: "22px 24px",
      borderRadius: "14px",
      marginTop: "24px",
      boxShadow: "var(--shadow-sm)",
      border: "1px solid var(--border)"
    }}>
      <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "16px" }}>
        ⚡ Quick Actions
      </h3>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {actions.map(({ label, icon, path, color, bg }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "9px 16px",
              background: bg,
              color: color,
              border: `1px solid ${color}30`,
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s ease"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = color;
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = bg;
              e.currentTarget.style.color = color;
            }}
          >
            <span>{icon}</span> {label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuickActions;
