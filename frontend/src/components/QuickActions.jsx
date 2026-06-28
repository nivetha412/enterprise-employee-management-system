import { useNavigate } from "react-router-dom";
import {
  RiUserAddLine, RiBuildingLine, RiTimeLine, RiCalendarCheckLine,
  RiBarChartLine, RiMoneyDollarCircleLine
} from "react-icons/ri";

const actions = [
  { label: "Add Employee",   icon: RiUserAddLine,            path: "/employees",  color: "#1e40af", bg: "#eff6ff", gradient: "linear-gradient(135deg,#3b82f6,#1d4ed8)" },
  { label: "Add Department", icon: RiBuildingLine,           path: "/departments", color: "#7c3aed", bg: "#f5f3ff", gradient: "linear-gradient(135deg,#8b5cf6,#6d28d9)" },
  { label: "Mark Attendance",icon: RiTimeLine,               path: "/attendance", color: "#059669", bg: "#ecfdf5", gradient: "linear-gradient(135deg,#10b981,#047857)" },
  { label: "Approve Leave",  icon: RiCalendarCheckLine,      path: "/leave",      color: "#d97706", bg: "#fffbeb", gradient: "linear-gradient(135deg,#f59e0b,#b45309)" },
  { label: "Reports",        icon: RiBarChartLine,           path: "/reports",    color: "#0891b2", bg: "#ecfeff", gradient: "linear-gradient(135deg,#06b6d4,#0e7490)" },
  { label: "Payroll",        icon: RiMoneyDollarCircleLine,  path: "/payroll",    color: "#dc2626", bg: "#fff1f2", gradient: "linear-gradient(135deg,#ef4444,#b91c1c)" },
];

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <div style={{
      background: "#fff", padding: "22px 24px", borderRadius: "16px",
      marginTop: "24px", boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)"
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
        <div>
          <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>Quick Actions</h3>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>Frequently used operations</p>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "12px" }}>
        {actions.map(({ label, icon: Icon, path, color, bg, gradient }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              gap: "10px", padding: "18px 12px",
              background: bg, color, border: `1.5px solid ${color}22`,
              borderRadius: "14px", fontSize: "12px", fontWeight: 600,
              cursor: "pointer", transition: "all 0.2s ease",
              position: "relative", overflow: "hidden"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = gradient;
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "var(--shadow-md)";
              e.currentTarget.style.border = "1.5px solid transparent";
              const icon = e.currentTarget.querySelector(".action-icon");
              if (icon) { icon.style.background = "rgba(255,255,255,0.2)"; icon.style.color = "#fff"; }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = bg;
              e.currentTarget.style.color = color;
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.border = `1.5px solid ${color}22`;
              const icon = e.currentTarget.querySelector(".action-icon");
              if (icon) { icon.style.background = color + "18"; icon.style.color = color; }
            }}
          >
            <div
              className="action-icon"
              style={{
                width: "44px", height: "44px", borderRadius: "12px",
                background: color + "18", display: "flex",
                alignItems: "center", justifyContent: "center",
                transition: "all 0.2s ease", color
              }}
            >
              <Icon size={22} />
            </div>
            <span style={{ textAlign: "center", lineHeight: 1.3 }}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
