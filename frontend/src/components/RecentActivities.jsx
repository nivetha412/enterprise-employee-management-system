import { useState } from "react";
import { RiRefreshLine } from "react-icons/ri";

const TABS = [
  { key: "all",      label: "All" },
  { key: "checkins", label: "Check-ins" },
  { key: "leaves",   label: "Leaves" },
];

function timeAgo(dateStr, timeStr) {
  if (!dateStr) return "";
  const dt = timeStr ? new Date(`${dateStr}T${timeStr}`) : new Date(dateStr);
  const diff = Date.now() - dt.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)   return "Just now";
  if (mins < 60)  return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)   return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// Accepts data as props — no internal API calls (avoids duplicate fetches from Dashboard)
export default function RecentActivities({ attendance = [], leaves = [], employees = [], loading = false, onRefresh }) {
  const [tab, setTab] = useState("all");

  const empName = (id) => {
    const e = employees.find(e => e.id === id || e.id === Number(id));
    return e ? `${e.firstName} ${e.lastName}` : `Employee #${id}`;
  };

  const empDept = (id) => {
    const e = employees.find(e => e.id === id || e.id === Number(id));
    return e?.department || e?.designation || "";
  };

  const checkInActivities = attendance
    .filter(a => a.checkInTime)
    .sort((a, b) => String(b.attendanceDate).localeCompare(String(a.attendanceDate)))
    .slice(0, 20)
    .map(a => ({
      id:        `att-${a.id}`,
      category:  "checkins",
      icon:      "👤",
      iconColor: a.lateArrival ? "#ef4444" : "#3b82f6",
      title:     `${empName(a.employeeId)} checked ${a.checkOutTime ? "out" : "in"}`,
      detail:    `${empDept(a.employeeId) || "—"} · ${a.lateArrival ? "Late arrival" : "On time"}`,
      time:      timeAgo(a.attendanceDate, a.checkInTime),
      dot:       a.lateArrival ? "#ef4444" : "#10b981",
    }));

  const leaveActivities = leaves
    .sort((a, b) => b.id - a.id)
    .slice(0, 20)
    .map(l => ({
      id:        `leave-${l.id}`,
      category:  "leaves",
      icon:      "📝",
      iconColor: l.status === "APPROVED" ? "#10b981" : l.status === "REJECTED" ? "#ef4444" : "#f59e0b",
      title:     `${empName(l.employeeId)} — ${(l.leaveType || "").replace(/_/g, " ")}`,
      detail:    `${l.startDate} → ${l.endDate} · ${l.status}`,
      time:      l.startDate ? new Date(l.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "",
      dot:       l.status === "APPROVED" ? "#10b981" : l.status === "REJECTED" ? "#ef4444" : "#f59e0b",
    }));

  const allActivities = [...checkInActivities, ...leaveActivities]
    .sort((a, b) => a.id > b.id ? -1 : 1)
    .slice(0, 15);

  const displayed = tab === "all" ? allActivities : tab === "checkins" ? checkInActivities.slice(0, 10) : leaveActivities.slice(0, 10);
  const counts = { all: allActivities.length, checkins: checkInActivities.length, leaves: leaveActivities.length };

  return (
    <div style={{ background: "#fff", borderRadius: "16px", marginTop: "24px", boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "20px 24px 0", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
          <div>
            <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>Activity Center</h3>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>Real-time employee activity</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {onRefresh && (
              <button
                onClick={onRefresh}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", alignItems: "center", padding: 4 }}
                title="Refresh"
              >
                <RiRefreshLine size={15} />
              </button>
            )}
            <span style={{ fontSize: "11px", fontWeight: 600, color: "#10b981", background: "#ecfdf5", padding: "3px 10px", borderRadius: "20px", border: "1px solid #bbf7d0", display: "flex", alignItems: "center", gap: "5px" }}>
              <span className="pulse-dot" /> Live
            </span>
          </div>
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
                transition: "all 0.15s", borderRadius: "4px 4px 0 0", marginBottom: "-1px"
              }}
            >
              {label}
              <span style={{ marginLeft: "5px", fontSize: "10px", fontWeight: 700, color: tab === key ? "var(--primary)" : "var(--text-muted)", background: tab === key ? "var(--primary-bg)" : "#f1f5f9", padding: "1px 5px", borderRadius: "10px" }}>
                {counts[key]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Activity List */}
      <div>
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 24px", borderBottom: "1px solid var(--border)" }}>
              <div className="skeleton" style={{ width: 38, height: 38, borderRadius: 11, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div className="skeleton" style={{ height: 13, width: "60%", borderRadius: 6, marginBottom: 6 }} />
                <div className="skeleton" style={{ height: 11, width: "40%", borderRadius: 6 }} />
              </div>
            </div>
          ))
        ) : displayed.length === 0 ? (
          <div style={{ padding: "40px 24px", textAlign: "center" }}>
            <div style={{ fontSize: "36px", marginBottom: "10px" }}>📭</div>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-secondary)" }}>No activities yet</div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>Check back later for updates</div>
          </div>
        ) : (
          displayed.map((a, i) => (
            <div
              key={a.id}
              style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 24px", borderBottom: i < displayed.length - 1 ? "1px solid var(--border)" : "none", transition: "background 0.15s", cursor: "default" }}
              onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
              onMouseLeave={e => e.currentTarget.style.background = "#fff"}
            >
              <div style={{ width: "38px", height: "38px", borderRadius: "11px", background: a.iconColor + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "17px", flexShrink: 0 }}>
                {a.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.title}</div>
                <div style={{ fontSize: "11.5px", color: "var(--text-muted)", marginTop: "2px" }}>{a.detail}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px", flexShrink: 0 }}>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>{a.time}</span>
                <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: a.dot, flexShrink: 0 }} />
              </div>
            </div>
          ))
        )}
      </div>

      {displayed.length > 0 && (
        <div style={{ padding: "12px 24px", borderTop: "1px solid var(--border)", textAlign: "center" }}>
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            Showing {displayed.length} of {counts[tab]} activities
          </span>
        </div>
      )}
    </div>
  );
}
