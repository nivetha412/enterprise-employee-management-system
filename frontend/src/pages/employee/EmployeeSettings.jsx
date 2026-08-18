import { useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { EmployeeProvider } from "../../context/EmployeeContext";
import { useEmployee } from "../../hooks/useEmployee";
import { RiSettings3Line, RiBellLine, RiShieldLine, RiPaletteLine, RiLogoutBoxLine } from "react-icons/ri";

const TABS = [
  { key: "notifications", label: "Notifications", icon: RiBellLine    },
  { key: "appearance",    label: "Appearance",    icon: RiPaletteLine  },
  { key: "security",      label: "Security",      icon: RiShieldLine   },
];

function Toggle({ checked, onChange }) {
  return (
    <div onClick={() => onChange(!checked)} style={{ width: "44px", height: "24px", borderRadius: "12px", background: checked ? "#1e40af" : "#e2e8f0", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
      <div style={{ position: "absolute", top: "3px", left: checked ? "23px" : "3px", width: "18px", height: "18px", borderRadius: "50%", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.2)", transition: "left 0.2s" }} />
    </div>
  );
}

function SettingsRow({ label, desc, checked, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid #f1f5f9" }}>
      <div>
        <div style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a" }}>{label}</div>
        {desc && <div style={{ fontSize: "11.5px", color: "#94a3b8", marginTop: "2px" }}>{desc}</div>}
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

function NotificationsTab() {
  const [prefs, setPrefs] = useState({
    emailAttendance: true,
    emailLeave:      true,
    emailAnnounce:   false,
    pushAttendance:  true,
    pushLeave:       true,
    pushReminders:   true,
  });
  const set = (k, v) => setPrefs(p => ({ ...p, [k]: v }));

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <h4 style={{ fontSize: "12px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "4px" }}>Email Notifications</h4>
        <SettingsRow label="Attendance Alerts"    desc="Get notified about attendance records"    checked={prefs.emailAttendance} onChange={v => set("emailAttendance", v)} />
        <SettingsRow label="Leave Updates"        desc="Updates on your leave request status"     checked={prefs.emailLeave}      onChange={v => set("emailLeave", v)} />
        <SettingsRow label="Company Announcements"desc="Receive company-wide announcements"       checked={prefs.emailAnnounce}   onChange={v => set("emailAnnounce", v)} />
      </div>
      <div>
        <h4 style={{ fontSize: "12px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "4px" }}>In-App Notifications</h4>
        <SettingsRow label="Attendance Reminders" desc="Daily check-in/out reminders"             checked={prefs.pushAttendance}  onChange={v => set("pushAttendance", v)} />
        <SettingsRow label="Leave Notifications"  desc="Real-time leave approval updates"         checked={prefs.pushLeave}       onChange={v => set("pushLeave", v)} />
        <SettingsRow label="General Reminders"    desc="Upcoming events and deadlines"            checked={prefs.pushReminders}   onChange={v => set("pushReminders", v)} />
      </div>
    </div>
  );
}

function AppearanceTab() {
  const [theme, setTheme] = useState("light");
  const [compact, setCompact] = useState(false);
  const [animations, setAnimations] = useState(true);

  const themes = [
    { key: "light",  label: "Light",  bg: "#fff",    border: "#e2e8f0" },
    { key: "dark",   label: "Dark",   bg: "#0f172a", border: "#334155" },
    { key: "system", label: "System", bg: "linear-gradient(135deg,#fff 50%,#0f172a 50%)", border: "#e2e8f0" },
  ];

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <h4 style={{ fontSize: "12px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "12px" }}>Theme</h4>
        <div style={{ display: "flex", gap: "12px" }}>
          {themes.map(t => (
            <button key={t.key} onClick={() => setTheme(t.key)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", padding: "12px 20px", borderRadius: "12px", border: theme === t.key ? "2px solid #1e40af" : "2px solid #e2e8f0", background: "#f8fafc", cursor: "pointer", transition: "all 0.15s" }}>
              <div style={{ width: "40px", height: "28px", borderRadius: "6px", background: t.bg, border: `1px solid ${t.border}` }} />
              <span style={{ fontSize: "12px", fontWeight: 600, color: theme === t.key ? "#1e40af" : "#475569" }}>{t.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <h4 style={{ fontSize: "12px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "4px" }}>Display</h4>
        <SettingsRow label="Compact Mode"   desc="Reduce spacing for more content"    checked={compact}    onChange={setCompact} />
        <SettingsRow label="Animations"     desc="Enable smooth transitions"          checked={animations} onChange={setAnimations} />
      </div>
    </div>
  );
}

function SecurityTab() {
  const [form, setForm] = useState({ current: "", newPwd: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPwd !== form.confirm) { setMsg("Passwords do not match"); return; }
    if (form.newPwd.length < 6) { setMsg("Password must be at least 6 characters"); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setMsg("Password change is not yet implemented on the backend."); setForm({ current: "", newPwd: "", confirm: "" }); }, 800);
  };

  const inp = { width: "100%", padding: "9px 13px", border: "1.5px solid #e2e8f0", borderRadius: "10px", fontSize: "13px", outline: "none", color: "#0f172a", background: "#fafafa", fontFamily: "inherit", boxSizing: "border-box", transition: "border-color 0.15s" };
  const lbl = { display: "block", fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "5px" };

  return (
    <div>
      <h4 style={{ fontSize: "12px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "16px" }}>Change Password</h4>
      {msg && <div style={{ background: "#fffbeb", color: "#d97706", padding: "10px 14px", borderRadius: "10px", fontSize: "13px", marginBottom: "16px", border: "1px solid #fde68a" }}>⚠️ {msg}</div>}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <div><label style={lbl}>Current Password</label><input type="password" value={form.current} onChange={e => setForm(f => ({ ...f, current: e.target.value }))} required style={inp} onFocus={e => e.target.style.borderColor = "#3b82f6"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} /></div>
        <div><label style={lbl}>New Password</label><input type="password" value={form.newPwd} onChange={e => setForm(f => ({ ...f, newPwd: e.target.value }))} required style={inp} onFocus={e => e.target.style.borderColor = "#3b82f6"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} /></div>
        <div><label style={lbl}>Confirm New Password</label><input type="password" value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} required style={inp} onFocus={e => e.target.style.borderColor = "#3b82f6"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} /></div>
        <button type="submit" disabled={loading} style={{ padding: "11px", borderRadius: "10px", border: "none", background: loading ? "#a5b4fc" : "linear-gradient(135deg,#1e40af,#2563eb)", color: "#fff", fontWeight: 700, fontSize: "13px", cursor: loading ? "not-allowed" : "pointer", boxShadow: loading ? "none" : "0 4px 14px rgba(37,99,235,0.35)" }}>
          {loading ? "Updating…" : "Update Password"}
        </button>
      </form>

      <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid #f1f5f9" }}>
        <h4 style={{ fontSize: "12px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "12px" }}>Session</h4>
        <button onClick={() => { localStorage.clear(); window.location.href = "/"; }} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 18px", borderRadius: "10px", border: "1px solid #fecaca", background: "#fef2f2", color: "#dc2626", fontWeight: 600, fontSize: "13px", cursor: "pointer", transition: "all 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.background = "#fee2e2"}
          onMouseLeave={e => e.currentTarget.style.background = "#fef2f2"}>
          <RiLogoutBoxLine size={16} /> Sign Out of All Devices
        </button>
      </div>
    </div>
  );
}

function SettingsContent() {
  const { emp: employee, loading } = useEmployee();
  const [tab, setTab] = useState("notifications");
  const accountEmail = localStorage.getItem("email") || "";
  const accountName = localStorage.getItem("name") || accountEmail.split("@")[0] || "User";
  const accountRole = localStorage.getItem("role") || "EMPLOYEE";
  const emp = employee || { firstName: accountName, lastName: "", employeeCode: accountRole === "ADMIN" ? "ADMIN" : "" };

  const CONTENT = { notifications: <NotificationsTab />, appearance: <AppearanceTab />, security: <SecurityTab /> };

  return (
    <>

      {/* Header */}
      <div className="fade-in" style={{ background: "linear-gradient(135deg,#0f172a 0%,#1e3a8a 40%,#1e40af 70%,#2563eb 100%)", borderRadius: "20px", padding: "24px 28px", marginBottom: "20px", position: "relative", overflow: "hidden", boxShadow: "0 20px 60px rgba(30,64,175,0.3)" }}>
        <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "center", gap: "14px", position: "relative" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <RiSettings3Line size={24} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: 800, color: "#fff", margin: 0 }}>Settings</h1>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "12px", marginTop: "2px" }}>Manage your preferences and account</p>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "20px" }} className="emp-grid-2">
        {/* Sidebar */}
        <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e8edf5", boxShadow: "0 4px 24px rgba(30,64,175,0.07)", padding: "16px", height: "fit-content" }}>
          {/* Profile mini */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px", borderRadius: "12px", background: "linear-gradient(135deg,#eff6ff,#dbeafe)", marginBottom: "16px", border: "1px solid #bfdbfe" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "linear-gradient(135deg,#60a5fa,#a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: "14px", flexShrink: 0 }}>
              {emp ? `${emp.firstName?.[0] ?? ""}${emp.lastName?.[0] ?? ""}`.toUpperCase() : "…"}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: "12.5px", fontWeight: 700, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {loading ? "…" : emp ? `${emp.firstName} ${emp.lastName}` : "—"}
              </div>
              <div style={{ fontSize: "10.5px", color: "#64748b" }}>{emp?.employeeCode || "—"}</div>
            </div>
          </div>

          <nav style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {TABS.map(({ key, label, icon: Icon }) => (
              <button key={key} onClick={() => setTab(key)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: tab === key ? 700 : 500, color: tab === key ? "#fff" : "#475569", background: tab === key ? "linear-gradient(135deg,rgba(59,130,246,0.35),rgba(139,92,246,0.25))" : "transparent", transition: "all 0.15s", textAlign: "left", borderLeft: tab === key ? "3px solid #60a5fa" : "3px solid transparent" }}
                onMouseEnter={e => { if (tab !== key) e.currentTarget.style.background = "#f8fafc"; }}
                onMouseLeave={e => { if (tab !== key) e.currentTarget.style.background = "transparent"; }}>
                <Icon size={16} />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e8edf5", boxShadow: "0 4px 24px rgba(30,64,175,0.07)", padding: "24px" }}>
          <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a", marginBottom: "4px" }}>
            {TABS.find(t => t.key === tab)?.label}
          </h3>
          <p style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "20px" }}>
            Manage your {TABS.find(t => t.key === tab)?.label.toLowerCase()} preferences
          </p>
          {CONTENT[tab]}
        </div>
      </div>
    </>
  );
}

export default function EmployeeSettings() {
  return <MainLayout><div style={{ maxWidth: 620, background: "#fff", borderRadius: 16, padding: 28, border: "1px solid #e2e8f0" }}><h1 style={{ fontSize: 20 }}>Account settings</h1><p style={{ color: "#64748b", marginTop: 8 }}>Settings are read-only until secure preference and password-management APIs are available.</p></div></MainLayout>;
}
