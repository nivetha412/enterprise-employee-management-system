import { Link, useLocation, useParams } from "react-router-dom";
import {
  RiDashboardLine, RiTeamLine, RiBuildingLine, RiTimeLine,
  RiCalendarCheckLine, RiLogoutBoxLine, RiShieldUserLine
} from "react-icons/ri";
import { ROLE_TO_DOMAIN } from "../context/RoleContext";

const NAV_ITEMS = {
  ADMIN: [
    { path: "dashboard",   icon: RiDashboardLine,    label: "Dashboard"    },
    { path: "employees",   icon: RiTeamLine,          label: "Employees"    },
    { path: "departments", icon: RiBuildingLine,      label: "Departments"  },
    { path: "attendance",  icon: RiTimeLine,          label: "Attendance"   },
    { path: "leave",       icon: RiCalendarCheckLine, label: "Leave"        },
  ],
  HR: [
    { path: "dashboard",   icon: RiDashboardLine,    label: "Dashboard"    },
    { path: "employees",   icon: RiTeamLine,          label: "Employees"    },
    { path: "attendance",  icon: RiTimeLine,          label: "Attendance"   },
    { path: "leave",       icon: RiCalendarCheckLine, label: "Leave"        },
  ],
  EMPLOYEE: [
    { path: "dashboard",   icon: RiDashboardLine,    label: "Dashboard"    },
    { path: "attendance",  icon: RiTimeLine,          label: "My Attendance"},
    { path: "leave",       icon: RiCalendarCheckLine, label: "My Leave"     },
  ],
};

export default function Sidebar({ collapsed }) {
  const role     = localStorage.getItem("role") || "EMPLOYEE";
  const location = useLocation();
  const { domain } = useParams();
  const activeDomain = domain || ROLE_TO_DOMAIN[role] || "employee";
  const items    = NAV_ITEMS[role] || NAV_ITEMS["EMPLOYEE"];

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const w = collapsed ? "var(--sidebar-collapsed)" : "var(--sidebar-width)";

  return (
    <aside style={{
      width: w, minWidth: w, maxWidth: w,
      minHeight: "calc(100vh - var(--navbar-height))",
      background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
      display: "flex", flexDirection: "column",
      padding: collapsed ? "20px 8px" : "20px 12px",
      flexShrink: 0,
      position: "sticky",
      top: "var(--navbar-height)",
      height: "calc(100vh - var(--navbar-height))",
      overflowY: "auto", overflowX: "hidden",
      transition: "width 0.25s cubic-bezier(0.4,0,0.2,1), min-width 0.25s, max-width 0.25s, padding 0.25s",
      zIndex: 100,
    }}>

      {!collapsed && (
        <div style={{
          color: "rgba(148,163,184,0.7)", fontSize: "10px", fontWeight: 700,
          letterSpacing: "0.12em", textTransform: "uppercase",
          padding: "0 10px", marginBottom: "10px"
        }}>
          Main Menu
        </div>
      )}

      <nav style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1 }}>
        {items.map(({ path, icon: Icon, label }) => {
          const fullPath = `/${activeDomain}/${path}`;
          const isActive = location.pathname === fullPath;
          return (
            <Link
              key={path}
              to={fullPath}
              title={collapsed ? label : ""}
              style={{
                display: "flex", alignItems: "center",
                gap: collapsed ? "0" : "10px",
                justifyContent: collapsed ? "center" : "flex-start",
                padding: collapsed ? "10px" : "10px 12px",
                borderRadius: "10px",
                textDecoration: "none",
                color: isActive ? "#fff" : "rgba(148,163,184,0.85)",
                background: isActive
                  ? "linear-gradient(135deg, rgba(59,130,246,0.35), rgba(139,92,246,0.25))"
                  : "transparent",
                fontWeight: isActive ? 600 : 400,
                fontSize: "13px",
                transition: "all 0.15s ease",
                borderLeft: !collapsed && isActive ? "3px solid #60a5fa" : "3px solid transparent",
                whiteSpace: "nowrap", overflow: "hidden",
              }}
              onMouseEnter={e => {
                if (!isActive) { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#fff"; }
              }}
              onMouseLeave={e => {
                if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(148,163,184,0.85)"; }
              }}
            >
              <Icon size={18} style={{ flexShrink: 0 }} />
              {!collapsed && <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>}
              {isActive && !collapsed && (
                <span style={{ marginLeft: "auto", width: "6px", height: "6px", borderRadius: "50%", background: "#60a5fa", flexShrink: 0 }} />
              )}
            </Link>
          );
        })}
      </nav>

      {!collapsed && (
        <div style={{
          margin: "12px 0 8px", padding: "10px 12px", borderRadius: "10px",
          background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <RiShieldUserLine size={14} color="#60a5fa" />
            <span style={{ fontSize: "11px", color: "rgba(148,163,184,0.9)", fontWeight: 500 }}>Logged in as</span>
          </div>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#93c5fd", marginTop: "2px" }}>{role}</div>
        </div>
      )}

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "12px" }}>
        <button
          onClick={logout}
          title={collapsed ? "Logout" : ""}
          style={{
            width: "100%", display: "flex", alignItems: "center",
            gap: collapsed ? "0" : "10px",
            justifyContent: collapsed ? "center" : "flex-start",
            padding: collapsed ? "10px" : "10px 12px",
            borderRadius: "10px", background: "rgba(220,38,38,0.12)",
            color: "#fca5a5", border: "1px solid rgba(220,38,38,0.2)",
            cursor: "pointer", fontSize: "13px", fontWeight: 500,
            transition: "all 0.15s ease",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(220,38,38,0.22)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(220,38,38,0.12)"}
        >
          <RiLogoutBoxLine size={16} style={{ flexShrink: 0 }} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
