import { useState, useMemo } from "react";
import { useEmployee } from "../../hooks/useEmployee";

const TABS = [
  { key: "all",        label: "All"        },
  { key: "attendance", label: "Attendance" },
  { key: "leave",      label: "Leave"      },
];

const STATUS_CFG = {
  PRESENT:  { color: "#059669", bg: "#ecfdf5", dot: "#10b981" },
  ABSENT:   { color: "#dc2626", bg: "#fef2f2", dot: "#ef4444" },
  LATE:     { color: "#d97706", bg: "#fffbeb", dot: "#f59e0b" },
  LEAVE:    { color: "#8b5cf6", bg: "#f5f3ff", dot: "#8b5cf6" },
  PENDING:  { color: "#d97706", bg: "#fffbeb", dot: "#f59e0b" },
  APPROVED: { color: "#059669", bg: "#ecfdf5", dot: "#10b981" },
  REJECTED: { color: "#dc2626", bg: "#fef2f2", dot: "#ef4444" },
};

function fmt(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  const today = new Date();
  const diff  = Math.floor((today - d) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7)  return `${diff} days ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function EmpDashActivity() {
  const { attendance, leaves, loading } = useEmployee();
  const [tab, setTab] = useState("all");

  const items = useMemo(() => {
    const attItems = attendance.slice(0, 10).map(r => ({
      type: "attendance", id: `a${r.id}`,
      title: r.lateArrival && r.status === "PRESENT" ? "Late Arrival" : `Attendance: ${r.status}`,
      detail: r.checkInTime ? `Check-in ${r.checkInTime}${r.checkOutTime ? ` · Out ${r.checkOutTime}` : ""}` : r.status,
      date: r.attendanceDate,
      status: r.lateArrival && r.status === "PRESENT" ? "LATE" : r.status,
      icon: "📋",
    }));
    const leaveItems = leaves.slice(0, 10).map(l => ({
      type: "leave", id: `l${l.id}`,
      title: `Leave Request — ${(l.leaveType || "").replace(/_/g, " ")}`,
      detail: `${l.startDate} → ${l.endDate} · ${l.totalDays || 1} day(s)`,
      date: l.appliedDate || l.startDate,
      status: l.status,
      icon: "📝",
    }));
    const all = [...attItems, ...leaveItems].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    if (tab === "attendance") return attItems;
    if (tab === "leave")      return leaveItems;
    return all;
  }, [attendance, leaves, tab]);

  const counts = useMemo(() => ({
    all:        attendance.slice(0, 10).length + leaves.slice(0, 10).length,
    attendance: attendance.slice(0, 10).length,
    leave:      leaves.slice(0, 10).length,
  }), [attendance, leaves]);

  return (
    <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e8edf5", boxShadow: "0 4px 24px rgba(30,64,175,0.07)", overflow: "hidden" }}>
      <div style={{ padding: "16px 22px 0", borderBottom: "1px solid #f1f5f9" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          <div>
            <h3 style={{ fontSize: "13.5px", fontWeight: 700, color: "#0f172a" }}>Recent Activity</h3>
            <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>Your latest actions</p>
          </div>
          <span style={{ fontSize: "11px", fontWeight: 700, color: "#10b981", background: "#ecfdf5", padding: "3px 10px", borderRadius: "20px", border: "1px solid #6ee7b7", display: "flex", alignItems: "center", gap: "5px" }}>
            <span className="pulse-dot" /> Live
          </span>
        </div>
        <div style={{ display: "flex", gap: "2px" }}>
          {TABS.map(({ key, label }) => (
            <button key={key} onClick={() => setTab(key)} style={{
              padding: "7px 14px", fontSize: "12px", fontWeight: 600,
              background: "none", border: "none", cursor: "pointer",
              color: tab === key ? "#1e40af" : "#94a3b8",
              borderBottom: tab === key ? "2.5px solid #1e40af" : "2.5px solid transparent",
              transition: "all 0.15s", borderRadius: "4px 4px 0 0", marginBottom: "-1px",
            }}>
              {label}
              <span style={{ marginLeft: "5px", fontSize: "10px", fontWeight: 700, color: tab === key ? "#1e40af" : "#94a3b8", background: tab === key ? "#eff6ff" : "#f1f5f9", padding: "1px 6px", borderRadius: "10px" }}>
                {counts[key]}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxHeight: "380px", overflowY: "auto" }}>
        {loading ? (
          <div style={{ padding: "32px", textAlign: "center" }}>
            {[1,2,3,4].map(i => (
              <div key={i} className="skeleton" style={{ height: 52, borderRadius: 10, marginBottom: 8 }} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div style={{ padding: "48px", textAlign: "center" }}>
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>📭</div>
            <div style={{ fontSize: "13px", color: "#94a3b8", fontWeight: 600 }}>No activity yet</div>
          </div>
        ) : items.map((a, i) => {
          const cfg = STATUS_CFG[a.status] || { color: "#94a3b8", bg: "#f8fafc", dot: "#94a3b8" };
          return (
            <div key={a.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 22px", borderBottom: i < items.length - 1 ? "1px solid #f8fafc" : "none", transition: "background 0.15s", cursor: "pointer" }}
              onMouseEnter={e => e.currentTarget.style.background = "#f8fbff"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: cfg.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>
                {a.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "12.5px", fontWeight: 700, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title}</div>
                <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "1px" }}>{a.detail}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px", flexShrink: 0 }}>
                <span style={{ fontSize: "10.5px", color: "#94a3b8" }}>{fmt(a.date)}</span>
                <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "10px", color: cfg.color, background: cfg.bg }}>
                  {a.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
