import { RiFireLine, RiAlarmWarningLine, RiTimeLine, RiTrophyLine, RiDownloadLine, RiEditLine, RiCalendarEventLine, RiBellLine } from "react-icons/ri";
import { useDomainNav } from "../../context/RoleContext";

const INSIGHTS = [
  { icon: RiTrophyLine,      label: "Attendance Rate",   value: "94%",  sub: "This month",    color: "#10b981", bg: "linear-gradient(135deg,#ecfdf5,#d1fae5)", border: "#6ee7b7" },
  { icon: RiFireLine,        label: "Longest Streak",    value: "12",   sub: "days in a row", color: "#f59e0b", bg: "linear-gradient(135deg,#fffbeb,#fef3c7)", border: "#fcd34d" },
  { icon: RiAlarmWarningLine,label: "Late Arrivals",     value: "3",    sub: "This month",    color: "#d97706", bg: "linear-gradient(135deg,#fff7ed,#fed7aa)", border: "#fdba74" },
  { icon: RiTimeLine,        label: "Overtime Hours",    value: "8.5h", sub: "This month",    color: "#8b5cf6", bg: "linear-gradient(135deg,#f5f3ff,#ede9fe)", border: "#c4b5fd" },
];

const HOLIDAYS = [
  { name: "Independence Day",  date: "Jul 4",  day: "Friday",    color: "#1e40af", bg: "#eff6ff", border: "#93c5fd" },
  { name: "Labor Day",         date: "Sep 1",  day: "Monday",    color: "#059669", bg: "#ecfdf5", border: "#6ee7b7" },
  { name: "Thanksgiving",      date: "Nov 27", day: "Thursday",  color: "#d97706", bg: "#fffbeb", border: "#fcd34d" },
  { name: "Christmas Day",     date: "Dec 25", day: "Thursday",  color: "#dc2626", bg: "#fef2f2", border: "#fca5a5" },
];

const NOTIFICATIONS = [
  { icon: "⚠️", text: "Missing check-out yesterday",        time: "1h ago",  unread: true,  color: "#d97706" },
  { icon: "📋", text: "Attendance correction approved",      time: "3h ago",  unread: true,  color: "#059669" },
  { icon: "🎉", text: "Independence Day holiday on Jul 4",   time: "1d ago",  unread: false, color: "#1e40af" },
  { icon: "📊", text: "June attendance report available",    time: "2d ago",  unread: false, color: "#8b5cf6" },
];

export default function EmpAttendanceInsights() {
  const navigate = useDomainNav();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

      {/* Insights */}
      <div style={{
        background: "#fff", borderRadius: "16px",
        boxShadow: "0 4px 24px rgba(30,64,175,0.08), 0 1px 4px rgba(0,0,0,0.04)",
        border: "1px solid #e8edf5", overflow: "hidden",
      }}>
        <div style={{ padding: "16px 22px 14px", borderBottom: "1px solid #f1f5f9" }}>
          <h3 style={{ fontSize: "13.5px", fontWeight: 700, color: "#0f172a" }}>Attendance Insights</h3>
          <p style={{ fontSize: "11.5px", color: "#94a3b8", marginTop: "2px" }}>Your performance metrics</p>
        </div>
        <div style={{ padding: "14px 22px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          {INSIGHTS.map(({ icon: Icon, label, value, sub, color, bg, border }) => (
            <div key={label} style={{
              background: bg, borderRadius: "12px", padding: "14px",
              border: `1px solid ${border}60`,
              transition: "transform 0.2s, box-shadow 0.2s", cursor: "default",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 6px 20px ${color}20`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: color + "20", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" }}>
                <Icon size={16} color={color} />
              </div>
              <div style={{ fontSize: "22px", fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: "10px", color: color + "90", fontWeight: 600, marginTop: "2px" }}>{sub}</div>
              <div style={{ fontSize: "11px", color: "#475569", marginTop: "5px", fontWeight: 600 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        background: "#fff", borderRadius: "16px",
        boxShadow: "0 4px 24px rgba(30,64,175,0.08), 0 1px 4px rgba(0,0,0,0.04)",
        border: "1px solid #e8edf5", overflow: "hidden",
      }}>
        <div style={{ padding: "16px 22px 14px", borderBottom: "1px solid #f1f5f9" }}>
          <h3 style={{ fontSize: "13.5px", fontWeight: 700, color: "#0f172a" }}>Quick Actions</h3>
        </div>
        <div style={{ padding: "14px 22px", display: "flex", flexDirection: "column", gap: "8px" }}>
          {[
            { icon: RiDownloadLine, label: "Download Attendance Report", color: "#1e40af", bg: "#eff6ff", border: "#bfdbfe" },
            { icon: RiEditLine,     label: "Request Attendance Correction", color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe" },
            { icon: RiCalendarEventLine, label: "View Holidays Calendar", color: "#059669", bg: "#ecfdf5", border: "#a7f3d0" },
          ].map(({ icon: Icon, label, color, bg, border }) => (
            <button key={label} style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "11px 14px", borderRadius: "11px",
              background: bg, border: `1px solid ${border}`,
              cursor: "pointer", transition: "all 0.15s", width: "100%", textAlign: "left",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateX(3px)"; e.currentTarget.style.boxShadow = `0 4px 12px ${color}20`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateX(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: color + "20", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={15} color={color} />
              </div>
              <span style={{ fontSize: "12.5px", fontWeight: 600, color: "#0f172a" }}>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Upcoming Holidays */}
      <div style={{
        background: "#fff", borderRadius: "16px",
        boxShadow: "0 4px 24px rgba(30,64,175,0.08), 0 1px 4px rgba(0,0,0,0.04)",
        border: "1px solid #e8edf5", overflow: "hidden",
      }}>
        <div style={{ padding: "16px 22px 14px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 style={{ fontSize: "13.5px", fontWeight: 700, color: "#0f172a" }}>Upcoming Holidays</h3>
          <RiCalendarEventLine size={16} color="#1e40af" />
        </div>
        <div style={{ padding: "14px 22px", display: "flex", flexDirection: "column", gap: "8px" }}>
          {HOLIDAYS.map((h, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: "12px",
              padding: "10px 12px", borderRadius: "11px",
              background: "#f8fafc", border: "1px solid #f1f5f9",
              borderLeft: `3px solid ${h.color}`,
              transition: "all 0.15s", cursor: "pointer",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = h.bg; e.currentTarget.style.transform = "translateX(3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.transform = "translateX(0)"; }}
            >
              <div style={{
                width: "40px", height: "40px", borderRadius: "9px",
                background: h.color + "15", border: `1px solid ${h.border}50`,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <span style={{ fontSize: "8px", fontWeight: 800, color: h.color, textTransform: "uppercase" }}>{h.date.split(" ")[0]}</span>
                <span style={{ fontSize: "14px", fontWeight: 800, color: h.color, lineHeight: 1 }}>{h.date.split(" ")[1]}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "12.5px", fontWeight: 700, color: "#0f172a" }}>{h.name}</div>
                <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "1px" }}>{h.day}</div>
              </div>
              <span style={{ fontSize: "9.5px", fontWeight: 700, color: h.color, background: h.bg, padding: "2px 8px", borderRadius: "10px", border: `1px solid ${h.border}` }}>
                Holiday
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div style={{
        background: "#fff", borderRadius: "16px",
        boxShadow: "0 4px 24px rgba(30,64,175,0.08), 0 1px 4px rgba(0,0,0,0.04)",
        border: "1px solid #e8edf5", overflow: "hidden",
      }}>
        <div style={{ padding: "16px 22px 14px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: "8px" }}>
          <RiBellLine size={15} color="#1e40af" />
          <h3 style={{ fontSize: "13.5px", fontWeight: 700, color: "#0f172a", flex: 1 }}>Notifications</h3>
          <span style={{ fontSize: "11px", fontWeight: 700, color: "#dc2626", background: "#fef2f2", padding: "2px 8px", borderRadius: "20px", border: "1px solid #fca5a5" }}>
            {NOTIFICATIONS.filter(n => n.unread).length} new
          </span>
        </div>
        <div style={{ padding: "8px 0" }}>
          {NOTIFICATIONS.map((n, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "flex-start", gap: "10px",
              padding: "10px 22px",
              background: n.unread ? "#f8fbff" : "transparent",
              borderBottom: i < NOTIFICATIONS.length - 1 ? "1px solid #f8fafc" : "none",
              cursor: "pointer", transition: "background 0.15s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "#f1f5f9"}
              onMouseLeave={e => e.currentTarget.style.background = n.unread ? "#f8fbff" : "transparent"}
            >
              <span style={{ fontSize: "16px", flexShrink: 0 }}>{n.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "12px", color: "#0f172a", lineHeight: 1.4, fontWeight: n.unread ? 600 : 400 }}>{n.text}</div>
                <div style={{ fontSize: "10.5px", color: "#94a3b8", marginTop: "2px" }}>{n.time}</div>
              </div>
              {n.unread && <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#3b82f6", flexShrink: 0, marginTop: "4px", boxShadow: "0 0 0 3px rgba(59,130,246,0.2)" }} />}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
