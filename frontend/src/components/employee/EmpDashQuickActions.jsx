import { RiTimeLine, RiCalendarCheckLine, RiUserLine, RiSettings3Line, RiLoginBoxLine } from "react-icons/ri";
import { useDomainNav } from "../../context/RoleContext";

const ACTIONS = [
  { label: "My Attendance", icon: RiTimeLine,          path: "/attendance", color: "#059669", bg: "#ecfdf5", gradient: "linear-gradient(135deg,#047857,#10b981)", desc: "View & check-in" },
  { label: "Apply Leave",   icon: RiCalendarCheckLine, path: "/leave",      color: "#7c3aed", bg: "#f5f3ff", gradient: "linear-gradient(135deg,#6d28d9,#8b5cf6)", desc: "Request time off" },
  { label: "My Profile",    icon: RiUserLine,          path: "/profile",    color: "#1e40af", bg: "#eff6ff", gradient: "linear-gradient(135deg,#1e3a8a,#3b82f6)", desc: "View profile"    },
  { label: "Settings",      icon: RiSettings3Line,     path: "/settings",   color: "#0891b2", bg: "#ecfeff", gradient: "linear-gradient(135deg,#0e7490,#06b6d4)", desc: "Preferences"     },
  { label: "Check In",      icon: RiLoginBoxLine,      path: "/attendance", color: "#d97706", bg: "#fffbeb", gradient: "linear-gradient(135deg,#b45309,#f59e0b)", desc: "Mark attendance"  },
];

export default function EmpDashQuickActions() {
  const navigate = useDomainNav();
  return (
    <div style={{ background: "#fff", borderRadius: "16px", padding: "20px 22px", marginTop: "20px", border: "1px solid #e8edf5", boxShadow: "0 4px 24px rgba(30,64,175,0.07)" }}>
      <div style={{ marginBottom: "16px" }}>
        <h3 style={{ fontSize: "13.5px", fontWeight: 700, color: "#0f172a" }}>Quick Actions</h3>
        <p style={{ fontSize: "11.5px", color: "#94a3b8", marginTop: "2px" }}>Frequently used shortcuts</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "12px" }}>
        {ACTIONS.map(({ label, icon: Icon, path, color, bg, gradient, desc }) => (
          <button key={label} onClick={() => navigate(path)} style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: "10px",
            padding: "18px 10px", background: "#f8fafc", border: "1.5px solid #e8edf5",
            borderRadius: "14px", cursor: "pointer", transition: "all 0.22s cubic-bezier(0.16,1,0.3,1)",
          }}
            onMouseEnter={e => {
              e.currentTarget.style.background = gradient;
              e.currentTarget.style.border = "1.5px solid transparent";
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.15)";
              const ic = e.currentTarget.querySelector(".qa-ic");
              const lb = e.currentTarget.querySelector(".qa-lb");
              const ds = e.currentTarget.querySelector(".qa-ds");
              if (ic) { ic.style.background = "rgba(255,255,255,0.2)"; ic.style.color = "#fff"; }
              if (lb) lb.style.color = "#fff";
              if (ds) ds.style.color = "rgba(255,255,255,0.7)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "#f8fafc";
              e.currentTarget.style.border = "1.5px solid #e8edf5";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
              const ic = e.currentTarget.querySelector(".qa-ic");
              const lb = e.currentTarget.querySelector(".qa-lb");
              const ds = e.currentTarget.querySelector(".qa-ds");
              if (ic) { ic.style.background = bg; ic.style.color = color; }
              if (lb) lb.style.color = "#0f172a";
              if (ds) ds.style.color = "#94a3b8";
            }}
          >
            <div className="qa-ic" style={{ width: "44px", height: "44px", borderRadius: "12px", background: bg, color, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.22s" }}>
              <Icon size={22} />
            </div>
            <div style={{ textAlign: "center" }}>
              <div className="qa-lb" style={{ fontSize: "11.5px", fontWeight: 700, color: "#0f172a", lineHeight: 1.3, transition: "color 0.22s" }}>{label}</div>
              <div className="qa-ds" style={{ fontSize: "10px", color: "#94a3b8", marginTop: "2px", transition: "color 0.22s" }}>{desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
