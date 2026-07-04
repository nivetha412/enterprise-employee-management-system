import {
  RiCalendarCheckLine, RiTimeLine, RiUserLine,
  RiFileTextLine, RiCalendarEventLine,
} from "react-icons/ri";
import { useDomainNav } from "../../context/RoleContext";

const ACTIONS = [
  {
    label: "Apply Leave", icon: RiCalendarCheckLine, path: "/leave",
    gradient: "linear-gradient(135deg,#1e40af,#3b82f6)",
    iconBg: "#eff6ff", iconColor: "#1e40af",
    desc: "Request time off",
  },
  {
    label: "View Attendance", icon: RiTimeLine, path: "/attendance",
    gradient: "linear-gradient(135deg,#047857,#10b981)",
    iconBg: "#ecfdf5", iconColor: "#059669",
    desc: "Check your records",
  },
  {
    label: "Update Profile", icon: RiUserLine, path: "/profile",
    gradient: "linear-gradient(135deg,#6d28d9,#8b5cf6)",
    iconBg: "#f5f3ff", iconColor: "#7c3aed",
    desc: "Edit your info",
  },
  {
    label: "Download Payslip", icon: RiFileTextLine, path: "/payslip",
    gradient: "linear-gradient(135deg,#b45309,#f59e0b)",
    iconBg: "#fffbeb", iconColor: "#d97706",
    desc: "Get salary slip",
  },
  {
    label: "View Holidays", icon: RiCalendarEventLine, path: "/holidays",
    gradient: "linear-gradient(135deg,#0e7490,#06b6d4)",
    iconBg: "#ecfeff", iconColor: "#0891b2",
    desc: "Company calendar",
  },
];

export default function EmpQuickActions() {
  const navigate = useDomainNav();

  return (
    <div style={{
      background: "#fff", borderRadius: "16px", padding: "20px 22px",
      boxShadow: "0 4px 24px rgba(30,64,175,0.08), 0 1px 4px rgba(0,0,0,0.04)",
      border: "1px solid #e8edf5",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <div>
          <h3 style={{ fontSize: "13.5px", fontWeight: 700, color: "#0f172a" }}>Quick Actions</h3>
          <p style={{ fontSize: "11.5px", color: "#94a3b8", marginTop: "2px" }}>Frequently used shortcuts</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "12px" }}>
        {ACTIONS.map(({ label, icon: Icon, path, gradient, iconBg, iconColor, desc }) => (
          <button
            key={label}
            onClick={() => navigate(path)}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              gap: "10px", padding: "18px 10px",
              background: "#f8fafc",
              border: "1.5px solid #e8edf5",
              borderRadius: "14px", cursor: "pointer",
              transition: "all 0.22s cubic-bezier(0.16,1,0.3,1)",
              position: "relative", overflow: "hidden",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = gradient;
              e.currentTarget.style.border = "1.5px solid transparent";
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.15)";
              const icon = e.currentTarget.querySelector(".qa-icon");
              const label = e.currentTarget.querySelector(".qa-label");
              const desc = e.currentTarget.querySelector(".qa-desc");
              if (icon) { icon.style.background = "rgba(255,255,255,0.2)"; icon.style.color = "#fff"; }
              if (label) label.style.color = "#fff";
              if (desc) desc.style.color = "rgba(255,255,255,0.7)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "#f8fafc";
              e.currentTarget.style.border = "1.5px solid #e8edf5";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
              const icon = e.currentTarget.querySelector(".qa-icon");
              const label = e.currentTarget.querySelector(".qa-label");
              const desc = e.currentTarget.querySelector(".qa-desc");
              if (icon) { icon.style.background = iconBg; icon.style.color = iconColor; }
              if (label) label.style.color = "#0f172a";
              if (desc) desc.style.color = "#94a3b8";
            }}
          >
            <div className="qa-icon" style={{
              width: "44px", height: "44px", borderRadius: "12px",
              background: iconBg, color: iconColor,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.22s",
            }}>
              <Icon size={22} />
            </div>
            <div style={{ textAlign: "center" }}>
              <div className="qa-label" style={{ fontSize: "11.5px", fontWeight: 700, color: "#0f172a", lineHeight: 1.3, transition: "color 0.22s" }}>{label}</div>
              <div className="qa-desc" style={{ fontSize: "10px", color: "#94a3b8", marginTop: "2px", transition: "color 0.22s" }}>{desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
