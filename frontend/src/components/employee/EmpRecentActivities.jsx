import { useState } from "react";

const ACTIVITIES = {
  all: [
    { id: 1, icon: "📝", dot: "#f59e0b", title: "Leave request submitted",    detail: "Annual Leave · 3 days",       time: "Today, 9:14 AM",  status: "Pending",  statusColor: "#d97706", statusBg: "#fef3c7" },
    { id: 2, icon: "✅", dot: "#10b981", title: "Attendance marked",          detail: "Present · On time",           time: "Today, 9:02 AM",  status: "Done",     statusColor: "#059669", statusBg: "#ecfdf5" },
    { id: 3, icon: "✅", dot: "#10b981", title: "Leave approved",             detail: "Sick Leave · 1 day",          time: "Yesterday",       status: "Approved", statusColor: "#059669", statusBg: "#ecfdf5" },
    { id: 4, icon: "👤", dot: "#3b82f6", title: "Profile updated",            detail: "Phone number changed",        time: "Jun 28",          status: "Done",     statusColor: "#1e40af", statusBg: "#eff6ff" },
    { id: 5, icon: "❌", dot: "#ef4444", title: "Leave request rejected",     detail: "Casual Leave · 2 days",       time: "Jun 25",          status: "Rejected", statusColor: "#dc2626", statusBg: "#fef2f2" },
    { id: 6, icon: "📋", dot: "#8b5cf6", title: "Payslip downloaded",         detail: "May 2025 payslip",            time: "Jun 1",           status: "Done",     statusColor: "#7c3aed", statusBg: "#f5f3ff" },
  ],
};
ACTIVITIES.leave      = ACTIVITIES.all.filter(a => a.title.toLowerCase().includes("leave"));
ACTIVITIES.attendance = ACTIVITIES.all.filter(a => a.title.toLowerCase().includes("attendance"));

const TABS = [
  { key: "all",        label: "All" },
  { key: "leave",      label: "Leave" },
  { key: "attendance", label: "Attendance" },
];

export default function EmpRecentActivities() {
  const [tab, setTab] = useState("all");
  const list = ACTIVITIES[tab] || [];

  return (
    <div style={{
      background: "#fff", borderRadius: "16px",
      boxShadow: "0 4px 24px rgba(30,64,175,0.08), 0 1px 4px rgba(0,0,0,0.04)",
      border: "1px solid #e8edf5", overflow: "hidden",
    }}>
      {/* Header + Tabs */}
      <div style={{ padding: "18px 22px 0", borderBottom: "1px solid #f1f5f9" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
          <div>
            <h3 style={{ fontSize: "13.5px", fontWeight: 700, color: "#0f172a" }}>Recent Activities</h3>
            <p style={{ fontSize: "11.5px", color: "#94a3b8", marginTop: "2px" }}>Your latest actions</p>
          </div>
          <span style={{
            fontSize: "11px", fontWeight: 700, color: "#10b981",
            background: "#ecfdf5", padding: "4px 12px", borderRadius: "20px",
            border: "1px solid #6ee7b7", display: "flex", alignItems: "center", gap: "6px",
          }}>
            <span className="pulse-dot" /> Live
          </span>
        </div>
        <div style={{ display: "flex", gap: "2px" }}>
          {TABS.map(({ key, label }) => (
            <button key={key} onClick={() => setTab(key)} style={{
              padding: "8px 16px", fontSize: "12px", fontWeight: 600,
              background: "none", border: "none", cursor: "pointer",
              color: tab === key ? "#1e40af" : "#94a3b8",
              borderBottom: tab === key ? "2.5px solid #1e40af" : "2.5px solid transparent",
              transition: "all 0.15s", borderRadius: "4px 4px 0 0", marginBottom: "-1px",
            }}>
              {label}
              <span style={{
                marginLeft: "6px", fontSize: "10px", fontWeight: 700,
                color: tab === key ? "#1e40af" : "#94a3b8",
                background: tab === key ? "#eff6ff" : "#f1f5f9",
                padding: "1px 6px", borderRadius: "10px",
              }}>
                {ACTIVITIES[key].length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Timeline list */}
      <div style={{ padding: "8px 0" }}>
        {list.map((a, i) => (
          <div key={a.id} style={{
            display: "flex", alignItems: "flex-start", gap: "0",
            padding: "0 22px",
            transition: "background 0.15s", cursor: "pointer",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            {/* Timeline line */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginRight: "14px", paddingTop: "14px" }}>
              <div style={{
                width: "10px", height: "10px", borderRadius: "50%",
                background: a.dot, flexShrink: 0,
                boxShadow: `0 0 0 3px ${a.dot}25`,
              }} />
              {i < list.length - 1 && (
                <div style={{ width: "1.5px", flex: 1, background: "#f1f5f9", minHeight: "28px" }} />
              )}
            </div>

            {/* Content */}
            <div style={{
              flex: 1, display: "flex", alignItems: "center", gap: "12px",
              padding: "12px 0",
              borderBottom: i < list.length - 1 ? "1px solid #f8fafc" : "none",
            }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "10px",
                background: a.dot + "15",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "16px", flexShrink: 0,
              }}>
                {a.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "12.5px", fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.title}</div>
                <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>{a.detail}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "5px", flexShrink: 0 }}>
                <span style={{ fontSize: "10.5px", color: "#94a3b8" }}>{a.time}</span>
                <span style={{
                  fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "10px",
                  color: a.statusColor, background: a.statusBg,
                }}>{a.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: "12px 22px", borderTop: "1px solid #f1f5f9", textAlign: "center" }}>
        <button style={{
          fontSize: "12px", fontWeight: 600, color: "#1e40af",
          background: "none", border: "none", cursor: "pointer",
          display: "inline-flex", alignItems: "center", gap: "4px",
        }}>
          View all activity →
        </button>
      </div>
    </div>
  );
}
