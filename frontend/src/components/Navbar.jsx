import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  RiBuildingLine, RiSearchLine, RiBellLine, RiSettings3Line,
  RiUserLine, RiLogoutBoxLine, RiShieldUserLine, RiArrowDownSLine,
  RiCheckLine
} from "react-icons/ri";
import { useRole, ROLE_TO_DOMAIN } from "../context/RoleContext";

const ROLES = ["ADMIN", "HR", "EMPLOYEE"];

export default function Navbar({ onSidebarToggle }) {
  const email = localStorage.getItem("email") || "";
  const { role: ctxRole } = useRole();
  const role = ctxRole || localStorage.getItem("role") || "EMPLOYEE";
  const initials = email ? email.slice(0, 2).toUpperCase() : "U";
  const navigate = useNavigate();
  const { domain } = useParams();

  const [showProfile, setShowProfile] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showRole, setShowRole] = useState(false);
  const [notifCount] = useState(0);

  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const roleRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
      if (roleRef.current && !roleRef.current.contains(e.target)) setShowRole(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const logout = () => { localStorage.clear(); window.location.href = "/"; };

  const notifications = [];

  // Switching role requires a fresh login — clear session and go to login page with role pre-selected
  const switchRole = (newRole) => {
    setShowRole(false);
    if (newRole === role) return;
    localStorage.clear();
    navigate(`/?role=${newRole.toLowerCase()}`, { replace: true });
  };

  const roleColors = { ADMIN: "#1e40af", HR: "#7c3aed", EMPLOYEE: "#059669" };
  const roleBg     = { ADMIN: "#eff6ff", HR: "#ede9fe", EMPLOYEE: "#d1fae5" };

  return (
    <header style={{
      height: "var(--navbar-height)",
      background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 60%, #2563eb 100%)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 20px 0 16px",
      position: "sticky", top: 0, zIndex: 200,
      boxShadow: "0 2px 20px rgba(30,58,138,0.4)",
    }}>
      {/* Left: Logo + Toggle */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button
          onClick={onSidebarToggle}
          style={{
            background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer",
            width: "36px", height: "36px", borderRadius: "10px",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: "18px", transition: "background 0.2s",
            flexShrink: 0
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
        >
          ☰
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "36px", height: "36px",
            background: "rgba(255,255,255,0.18)",
            borderRadius: "10px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "18px", backdropFilter: "blur(4px)",
            border: "1px solid rgba(255,255,255,0.25)"
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

      {/* Center: Page context */}
      <div style={{
        flex: 1, maxWidth: "420px", margin: "0 24px",
        display: "flex", alignItems: "center"
      }}>
        <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>
          Enterprise HRMS Platform
        </span>
      </div>

      {/* Right: Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>

        {/* Role Switcher */}
        <div ref={roleRef} style={{ position: "relative" }}>
          <button
            onClick={() => setShowRole(!showRole)}
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
              minWidth: "150px", overflow: "hidden", zIndex: 300
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
                  textAlign: "left", transition: "background 0.15s"
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                  onMouseLeave={e => e.currentTarget.style.background = "none"}
                >
                  <span style={{
                    width: "8px", height: "8px", borderRadius: "50%",
                    background: roleColors[r], flexShrink: 0
                  }} />
                  {r}
                  {r === role && <RiCheckLine size={14} color={roleColors[r]} style={{ marginLeft: "auto" }} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Settings */}
        <button style={{
          width: "36px", height: "36px", borderRadius: "10px",
          background: "rgba(255,255,255,0.1)", border: "none",
          cursor: "pointer", display: "flex", alignItems: "center",
          justifyContent: "center", color: "rgba(255,255,255,0.8)",
          transition: "all 0.2s"
        }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
        >
          <RiSettings3Line size={17} />
        </button>

        {/* Notifications */}
        <div ref={notifRef} style={{ position: "relative" }}>
          <button
            onClick={() => setShowNotif(!showNotif)}
            style={{
              width: "36px", height: "36px", borderRadius: "10px",
              background: "rgba(255,255,255,0.1)", border: "none",
              cursor: "pointer", display: "flex", alignItems: "center",
              justifyContent: "center", color: "rgba(255,255,255,0.8)",
              transition: "all 0.2s", position: "relative"
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
          >
            <RiBellLine size={17} />
            {notifCount > 0 && (
              <span style={{
                position: "absolute", top: "5px", right: "5px",
                width: "16px", height: "16px", borderRadius: "50%",
                background: "#ef4444", color: "#fff",
                fontSize: "9px", fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "2px solid #1e40af"
              }}>
                {notifCount}
              </span>
            )}
          </button>
          {showNotif && (
            <div style={{
              position: "absolute", right: 0, top: "calc(100% + 8px)",
              background: "#fff", borderRadius: "16px",
              boxShadow: "var(--shadow-lg)", border: "1px solid var(--border)",
              width: "320px", zIndex: 300
            }}>
              <div style={{ padding: "16px 16px 10px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700, fontSize: "14px" }}>Notifications</span>
                <span style={{ fontSize: "11px", color: "var(--primary-light)", cursor: "pointer", fontWeight: 600 }}>Mark all read</span>
              </div>
              {notifications.map(n => (
                <div key={n.id} style={{
                  padding: "12px 16px", display: "flex", gap: "12px",
                  alignItems: "flex-start",
                  background: n.unread ? "#eff6ff" : "#fff",
                  borderBottom: "1px solid var(--border)",
                  cursor: "pointer", transition: "background 0.15s"
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                  onMouseLeave={e => e.currentTarget.style.background = n.unread ? "#eff6ff" : "#fff"}
                >
                  <span style={{ fontSize: "20px", flexShrink: 0 }}>{n.icon}</span>
                  <div>
                    <div style={{ fontSize: "12.5px", color: "var(--text-primary)", lineHeight: 1.4 }}>{n.text}</div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "3px" }}>{n.time}</div>
                  </div>
                  {n.unread && <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#3b82f6", flexShrink: 0, marginTop: "4px" }} />}
                </div>
              ))}
              <div style={{ padding: "10px 16px", textAlign: "center" }}>
                <span style={{ fontSize: "12px", color: "var(--primary-light)", cursor: "pointer", fontWeight: 600 }}>View all notifications</span>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div ref={profileRef} style={{ position: "relative" }}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: "12px", padding: "5px 10px 5px 5px",
              cursor: "pointer", transition: "all 0.2s"
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
          >
            <div style={{
              width: "30px", height: "30px", borderRadius: "8px",
              background: "linear-gradient(135deg, #60a5fa, #a78bfa)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 700, fontSize: "12px",
              border: "1.5px solid rgba(255,255,255,0.4)"
            }}>
              {initials}
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ color: "#fff", fontSize: "12px", fontWeight: 600, lineHeight: 1.2 }}>
                {email.split("@")[0] || "Admin"}
              </div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "10px" }}>
                {role}
              </div>
            </div>
            <RiArrowDownSLine size={14} color="rgba(255,255,255,0.7)" />
          </button>

          {showProfile && (
            <div style={{
              position: "absolute", right: 0, top: "calc(100% + 8px)",
              background: "#fff", borderRadius: "16px",
              boxShadow: "var(--shadow-lg)", border: "1px solid var(--border)",
              minWidth: "220px", overflow: "hidden", zIndex: 300
            }}>
              <div style={{ padding: "16px", borderBottom: "1px solid var(--border)", background: "linear-gradient(135deg, #eff6ff, #f5f3ff)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "10px",
                    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontWeight: 700, fontSize: "15px"
                  }}>
                    {initials}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "13.5px", color: "var(--text-primary)" }}>{email.split("@")[0]}</div>
                    <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>{email}</div>
                    <span style={{
                      display: "inline-block", marginTop: "3px",
                      padding: "1px 7px", borderRadius: "20px", fontSize: "10px", fontWeight: 700,
                      color: roleColors[role], background: roleBg[role]
                    }}>{role}</span>
                  </div>
                </div>
              </div>
              {[
                { icon: <RiUserLine size={15} />, label: "My Profile" },
                { icon: <RiSettings3Line size={15} />, label: "Settings" },
              ].map(item => (
                <button key={item.label} style={{
                  width: "100%", padding: "10px 16px", background: "none",
                  border: "none", cursor: "pointer", fontSize: "13px",
                  fontWeight: 500, color: "var(--text-primary)",
                  display: "flex", alignItems: "center", gap: "10px",
                  textAlign: "left", transition: "background 0.15s"
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
                  textAlign: "left", transition: "background 0.15s"
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
