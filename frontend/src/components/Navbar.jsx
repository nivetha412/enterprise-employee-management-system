import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  RiBuildingLine, RiBellLine, RiSettings3Line,
  RiUserLine, RiLogoutBoxLine, RiShieldUserLine, RiArrowDownSLine,
  RiCheckLine,
} from "react-icons/ri";
import { useRole, ROLE_TO_DOMAIN, DOMAIN_TO_ROLE } from "../context/RoleContext";

const ROLES = ["ADMIN", "EMPLOYEE"];

const ROLE_COLORS = { ADMIN: "#1e40af", EMPLOYEE: "#059669" };
const ROLE_BG     = { ADMIN: "#eff6ff", EMPLOYEE: "#d1fae5" };

export default function Navbar({ onSidebarToggle }) {
  const email        = localStorage.getItem("email") || "";
  const { role: ctxRole } = useRole();
  const location     = useLocation();
  const navigate     = useNavigate();

  // Derive role from URL first, then context, then localStorage
  const urlSegment   = location.pathname.split("/")[1];
  const roleFromUrl  = DOMAIN_TO_ROLE[urlSegment];
  const role         = roleFromUrl || ctxRole || localStorage.getItem("role") || "EMPLOYEE";

  const displayName  = localStorage.getItem("name") || email.split("@")[0] || "User";
  const initials     = displayName.slice(0, 2).toUpperCase();

  const [showProfile, setShowProfile] = useState(false);
  const [showNotif,   setShowNotif]   = useState(false);
  const [showRole,    setShowRole]    = useState(false);

  const profileRef = useRef(null);
  const notifRef   = useRef(null);
  const roleRef    = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
      if (notifRef.current   && !notifRef.current.contains(e.target))   setShowNotif(false);
      if (roleRef.current    && !roleRef.current.contains(e.target))    setShowRole(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setShowProfile(false);
    setShowNotif(false);
    setShowRole(false);
  }, [location.pathname]);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  // Switching role requires a fresh login
  const switchRole = (newRole) => {
    setShowRole(false);
    if (newRole === role) return;
    localStorage.clear();
    navigate(`/?role=${newRole.toLowerCase()}`, { replace: true });
  };

  const openAccountPage = (page) => {
    setShowProfile(false);
    navigate(`/${ROLE_TO_DOMAIN[role] || "employee"}/${page}`);
  };

  return (
    <header className="app-navbar" style={{
      height: "var(--navbar-height)",
      background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 60%, #2563eb 100%)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 20px 0 16px",
      position: "sticky", top: 0, zIndex: 200,
      boxShadow: "0 2px 20px rgba(30,58,138,0.4)",
    }}>

      {/* Left: Toggle + Logo */}
      <div className="app-navbar__left" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button
          onClick={onSidebarToggle}
          style={{
            background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer",
            width: "36px", height: "36px", borderRadius: "10px",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: "18px", transition: "background 0.2s", flexShrink: 0,
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
          title="Toggle Sidebar"
        >
          ☰
        </button>
        <div className="app-navbar__brand" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "36px", height: "36px",
            background: "rgba(255,255,255,0.18)", borderRadius: "10px",
            display: "flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.25)",
          }}>
            <RiBuildingLine color="#fff" size={20} />
          </div>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: "15px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
              Enterprise EMS
            </div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "10.5px", letterSpacing: "0.04em" }}>
              HRMS Platform
            </div>
          </div>
        </div>
      </div>

      {/* Center: breadcrumb hint */}
      <div className="app-navbar__breadcrumb" style={{ flex: 1, maxWidth: "420px", margin: "0 24px" }}>
        <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>
          Enterprise HRMS Platform
        </span>
      </div>

      {/* Right: actions */}
      <div className="app-navbar__actions" style={{ display: "flex", alignItems: "center", gap: "6px" }}>

        {/* Role Switcher */}
        <div className="app-navbar__role" ref={roleRef} style={{ position: "relative" }}>
          <button
            onClick={() => setShowRole(v => !v)}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "10px", color: "#fff",
              padding: "6px 10px", cursor: "pointer", fontSize: "12px",
              fontWeight: 600, transition: "all 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
          >
            <RiShieldUserLine size={14} />
            {role}
            <RiArrowDownSLine size={14} />
          </button>

          {showRole && (
            <div style={{
              position: "absolute", right: 0, top: "calc(100% + 8px)",
              background: "#fff", borderRadius: "12px",
              boxShadow: "var(--shadow-lg)", border: "1px solid var(--border)",
              minWidth: "160px", overflow: "hidden", zIndex: 300,
            }}>
              <div style={{ padding: "8px 12px 6px", fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Switch Role (Re-login)
              </div>
              {ROLES.map(r => (
                <button key={r} onClick={() => switchRole(r)} style={{
                  width: "100%", padding: "9px 14px", background: "none",
                  border: "none", cursor: "pointer", fontSize: "13px",
                  fontWeight: 500, color: "var(--text-primary)",
                  display: "flex", alignItems: "center", gap: "10px",
                  textAlign: "left", transition: "background 0.15s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                  onMouseLeave={e => e.currentTarget.style.background = "none"}
                >
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: ROLE_COLORS[r], flexShrink: 0 }} />
                  {r}
                  {r === role && <RiCheckLine size={14} color={ROLE_COLORS[r]} style={{ marginLeft: "auto" }} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Settings (placeholder) */}
        <button style={{
          width: "36px", height: "36px", borderRadius: "10px",
          background: "rgba(255,255,255,0.1)", border: "none",
          cursor: "pointer", display: "flex", alignItems: "center",
          justifyContent: "center", color: "rgba(255,255,255,0.8)",
          transition: "all 0.2s",
        }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
          title="Settings"
        >
          <RiSettings3Line size={17} />
        </button>

        {/* Notifications */}
        <div ref={notifRef} style={{ position: "relative" }}>
          <button
            onClick={() => setShowNotif(v => !v)}
            style={{
              width: "36px", height: "36px", borderRadius: "10px",
              background: "rgba(255,255,255,0.1)", border: "none",
              cursor: "pointer", display: "flex", alignItems: "center",
              justifyContent: "center", color: "rgba(255,255,255,0.8)",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
            title="Notifications"
          >
            <RiBellLine size={17} />
          </button>

          {showNotif && (
            <div style={{
              position: "absolute", right: 0, top: "calc(100% + 8px)",
              background: "#fff", borderRadius: "16px",
              boxShadow: "var(--shadow-lg)", border: "1px solid var(--border)",
              width: "300px", zIndex: 300,
            }}>
              <div style={{ padding: "16px 16px 10px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700, fontSize: "14px" }}>Notifications</span>
              </div>
              <div style={{ padding: "32px 16px", textAlign: "center" }}>
                <div style={{ fontSize: "28px", marginBottom: "8px" }}>🔔</div>
                <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>No new notifications</div>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="app-navbar__profile" ref={profileRef} style={{ position: "relative" }}>
          <button
            onClick={() => setShowProfile(v => !v)}
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: "12px", padding: "5px 10px 5px 5px",
              cursor: "pointer", transition: "all 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
          >
            <div style={{
              width: "30px", height: "30px", borderRadius: "8px",
              background: "linear-gradient(135deg, #60a5fa, #a78bfa)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 700, fontSize: "12px",
              border: "1.5px solid rgba(255,255,255,0.4)",
            }}>
              {initials}
            </div>
            <div className="app-navbar__profile-details" style={{ textAlign: "left" }}>
              <div style={{ color: "#fff", fontSize: "12px", fontWeight: 600, lineHeight: 1.2 }}>
                {displayName}
              </div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "10px" }}>
                {role}
              </div>
            </div>
            <RiArrowDownSLine size={14} color="rgba(255,255,255,0.7)" />
          </button>

          {showProfile && (
            <div className="app-navbar__profile-menu" style={{
              position: "absolute", right: 0, top: "calc(100% + 8px)",
              background: "#fff", borderRadius: "16px",
              boxShadow: "var(--shadow-lg)", border: "1px solid var(--border)",
              minWidth: "220px", maxWidth: "calc(100vw - 24px)", overflow: "hidden", zIndex: 300,
            }}>
              <div style={{ padding: "16px", borderBottom: "1px solid var(--border)", background: "linear-gradient(135deg, #eff6ff, #f5f3ff)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "10px",
                    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontWeight: 700, fontSize: "15px",
                  }}>
                    {initials}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "13.5px", color: "var(--text-primary)" }}>{displayName}</div>
                    <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>{email}</div>
                    <span style={{
                      display: "inline-block", marginTop: "3px",
                      padding: "1px 7px", borderRadius: "20px", fontSize: "10px", fontWeight: 700,
                      color: ROLE_COLORS[role], background: ROLE_BG[role],
                    }}>{role}</span>
                  </div>
                </div>
              </div>

              {[
                { icon: <RiUserLine size={15} />, label: "My Profile", page: "profile" },
                { icon: <RiSettings3Line size={15} />, label: "Settings", page: "settings" },
              ].map(item => (
                <button key={item.label} onClick={() => openAccountPage(item.page)} style={{
                  width: "100%", padding: "10px 16px", background: "none",
                  border: "none", cursor: "pointer", fontSize: "13px",
                  fontWeight: 500, color: "var(--text-primary)",
                  display: "flex", alignItems: "center", gap: "10px",
                  textAlign: "left", transition: "background 0.15s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                  onMouseLeave={e => e.currentTarget.style.background = "none"}
                >
                  <span style={{ color: "var(--text-secondary)" }}>{item.icon}</span>
                  {item.label}
                </button>
              ))}

              <div style={{ borderTop: "1px solid var(--border)" }}>
                <button onClick={logout} style={{
                  width: "100%", padding: "10px 16px", background: "none",
                  border: "none", cursor: "pointer", fontSize: "13px",
                  fontWeight: 600, color: "#dc2626",
                  display: "flex", alignItems: "center", gap: "10px",
                  textAlign: "left", transition: "background 0.15s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "#fff5f5"}
                  onMouseLeave={e => e.currentTarget.style.background = "none"}
                >
                  <RiLogoutBoxLine size={15} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
