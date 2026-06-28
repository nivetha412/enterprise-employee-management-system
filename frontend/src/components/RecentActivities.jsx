import { useState } from "react";
import { RiTimeLine, RiCalendarLine, RiUserAddLine, RiBuildingLine } from "react-icons/ri";

const ALL_ACTIVITIES = {
  all: [
    { id: 1, icon: "👤", iconColor: "#3b82f6", category: "Check-in", title: "Marcus Johnson checked in", detail: "Engineering · On time", time: "08:52 AM", dot: "#10b981" },
    { id: 2, icon: "📝", iconColor: "#8b5cf6", category: "Leave",    title: "Sarah K. submitted leave request", detail: "Annual Leave · 3 days", time: "09:14 AM", dot: "#f59e0b" },
    { id: 3, icon: "👤", iconColor: "#10b981", category: "New",      title: "Alex Rivera joined Engineering", detail: "Software Engineer · L3", time: "09:30 AM", dot: "#3b82f6" },
    { id: 4, icon: "🏢", iconColor: "#f59e0b", category: "Dept",     title: "Design Dept. headcount updated", detail: "+2 new members", time: "10:05 AM", dot: "#8b5cf6" },
    { id: 5, icon: "👤", iconColor: "#3b82f6", category: "Check-in", title: "Priya Sharma checked in late", detail: "HR · 22 min late", time: "10:22 AM", dot: "#ef4444" },
    { id: 6, icon: "📝", iconColor: "#ef4444", category: "Leave",    title: "Leave approved for Tom Willis", detail: "Sick Leave · 2 days", time: "11:00 AM", dot: "#10b981" },
  ],
};

ALL_ACTIVITIES.checkins = ALL_ACTIVITIES.all.filter(a => a.category === "Check-in");
ALL_ACTIVITIES.leaves   = ALL_ACTIVITIES.all.filter(a => a.category === "Leave");
ALL_ACTIVITIES.new      = ALL_ACTIVITIES.all.filter(a => a.category === "New");

const TABS = [
  { key: "all",      label: "All",        icon: RiTimeLine },
  { key: "checkins", label: "Check-ins",  icon: RiTimeLine },
  { key: "leaves",   label: "Leaves",     icon: RiCalendarLine },
  { key: "new",      label: "New Hires",  icon: RiUserAddLine },
];

export default function RecentActivities() {
  const [tab, setTab] = useState("all");
  const activities = ALL_ACTIVITIES[tab] || [];

  return (
    <div style={{
      background: "#fff", borderRadius: "16px", marginTop: "24px",
      boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)",
      overflow: "hidden"
    }}>
      {/* Header */}
      <div style={{ padding: "20px 24px 0", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
          <div>
            <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>Activity Center</h3>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>Real-time employee activity</p>
          </div>
          <span style={{
            fontSize: "11px", fontWeight: 600, color: "#10b981",
            background: "#ecfdf5", padding: "3px 10px", borderRadius: "20px",
            border: "1px solid #bbf7d0", display: "flex", alignItems: "center", gap: "5px"
          }}>
            <span className="pulse-dot" /> Live
          </span>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "2px" }}>
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              style={{
                padding: "7px 14px", fontSize: "12.5px", fontWeight: 600,
                background: "none", border: "none", cursor: "pointer",
                color: tab === key ? "var(--primary)" : "var(--text-secondary)",
                borderBottom: tab === key ? "2px solid var(--primary)" : "2px solid transparent",
                transition: "all 0.15s", borderRadius: "4px 4px 0 0",
                marginBottom: "-1px"
              }}
            >
              {label}
              <span style={{
                marginLeft: "5px", fontSize: "10px", fontWeight: 700,
                color: tab === key ? "var(--primary)" : "var(--text-muted)",
                background: tab === key ? "var(--primary-bg)" : "#f1f5f9",
                padding: "1px 5px", borderRadius: "10px"
              }}>
                {ALL_ACTIVITIES[key].length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Activity List */}
      <div>
        {activities.length === 0 ? (
          <div style={{ padding: "40px 24px", textAlign: "center" }}>
            <div style={{ fontSize: "36px", marginBottom: "10px" }}>📭</div>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-secondary)" }}>No activities yet</div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>Check back later for updates</div>
          </div>
        ) : (
          activities.map((a, i) => (
            <div
              key={a.id}
              style={{
                display: "flex", alignItems: "center", gap: "14px",
                padding: "14px 24px",
                borderBottom: i < activities.length - 1 ? "1px solid var(--border)" : "none",
                transition: "background 0.15s", cursor: "pointer"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
              onMouseLeave={e => e.currentTarget.style.background = "#fff"}
            >
              <div style={{
                width: "38px", height: "38px", borderRadius: "11px",
                background: a.iconColor + "15",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "17px", flexShrink: 0
              }}>
                {a.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {a.title}
                </div>
                <div style={{ fontSize: "11.5px", color: "var(--text-muted)", marginTop: "2px" }}>
                  {a.detail}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px", flexShrink: 0 }}>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>{a.time}</span>
                <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: a.dot, flexShrink: 0 }} />
              </div>
            </div>
          ))
        )}
      </div>

      {activities.length > 0 && (
        <div style={{ padding: "12px 24px", borderTop: "1px solid var(--border)", textAlign: "center" }}>
          <button style={{
            fontSize: "12.5px", fontWeight: 600, color: "var(--primary-light)",
            background: "none", border: "none", cursor: "pointer"
          }}>
            View all activity →
          </button>
        </div>
      )}
    </div>
  );
}
