import { RiCalendarEventLine, RiCake2Line, RiMegaphoneLine, RiCheckboxCircleLine, RiVideoLine } from "react-icons/ri";

const holidays = [
  { date: "Jul 4",  name: "Independence Day", daysLeft: 3  },
  { date: "Sep 1",  name: "Labor Day",         daysLeft: 62 },
  { date: "Nov 27", name: "Thanksgiving",      daysLeft: 150 },
];

const birthdays = [
  { name: "James Carter",  dept: "Engineering", avatar: "JC" },
  { name: "Ana Rodrigues", dept: "Marketing",   avatar: "AR" },
];

const announcements = [
  { tag: "HR",      color: "#3b82f6", bg: "#eff6ff",   text: "Q3 performance reviews start next Monday",    time: "Today" },
  { tag: "IT",      color: "#8b5cf6", bg: "#f5f3ff",   text: "System maintenance scheduled Sunday 2–4 AM",  time: "Yesterday" },
  { tag: "Finance", color: "#10b981", bg: "#ecfdf5",   text: "Expense submission deadline is July 31",       time: "2 days ago" },
];

const approvals = [
  { name: "Sarah Kim",     type: "Annual Leave",  days: "3 days",  avatar: "SK", color: "#3b82f6" },
  { name: "Michael Chen",  type: "Sick Leave",    days: "1 day",   avatar: "MC", color: "#ef4444" },
  { name: "Elena Vasquez", type: "WFH Request",   days: "2 days",  avatar: "EV", color: "#8b5cf6" },
];

const widgetCard = {
  background: "#fff", borderRadius: "16px", padding: "20px",
  boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)"
};

const widgetTitle = {
  fontSize: "13.5px", fontWeight: 700, color: "var(--text-primary)",
  marginBottom: "3px", display: "flex", alignItems: "center", gap: "8px"
};

function Avatar({ label, color = "#3b82f6", size = 32 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `linear-gradient(135deg, ${color}cc, ${color}66)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontWeight: 700, fontSize: size * 0.35 + "px", flexShrink: 0
    }}>
      {label}
    </div>
  );
}

export default function InfoWidgets() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

      {/* Upcoming Holidays */}
      <div style={widgetCard}>
        <div style={{ ...widgetTitle, marginBottom: "14px" }}>
          <RiCalendarEventLine size={16} color="#3b82f6" />
          Upcoming Holidays
          <span style={{ marginLeft: "auto", fontSize: "11px", fontWeight: 600, color: "#3b82f6", background: "#eff6ff", padding: "2px 8px", borderRadius: "20px" }}>
            {holidays.length}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {holidays.map((h, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                width: "42px", height: "42px", borderRadius: "10px",
                background: "#eff6ff", border: "1px solid #bfdbfe",
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", flexShrink: 0
              }}>
                <span style={{ fontSize: "9px", fontWeight: 700, color: "#3b82f6", textTransform: "uppercase" }}>
                  {h.date.split(" ")[0]}
                </span>
                <span style={{ fontSize: "14px", fontWeight: 800, color: "#1e40af", lineHeight: 1 }}>
                  {h.date.split(" ")[1]}
                </span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--text-primary)" }}>{h.name}</div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                  {h.daysLeft <= 7 ? <span style={{ color: "#ef4444", fontWeight: 600 }}>In {h.daysLeft} days</span> : `In ${h.daysLeft} days`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Birthdays Today */}
      <div style={widgetCard}>
        <div style={{ ...widgetTitle, marginBottom: "14px" }}>
          <RiCake2Line size={16} color="#f59e0b" />
          Birthdays Today
          <span style={{ marginLeft: "auto", fontSize: "11px", fontWeight: 600, color: "#f59e0b", background: "#fffbeb", padding: "2px 8px", borderRadius: "20px" }}>
            {birthdays.length}
          </span>
        </div>
        {birthdays.length === 0 ? (
          <div style={{ padding: "20px 0", textAlign: "center" }}>
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>🎂</div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>No birthdays today</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {birthdays.map((b, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px", borderRadius: "10px", background: "#fffbeb", border: "1px solid #fef3c7" }}>
                <Avatar label={b.avatar} color="#f59e0b" size={36} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--text-primary)" }}>{b.name}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{b.dept}</div>
                </div>
                <span style={{ fontSize: "20px" }}>🎉</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Announcements */}
      <div style={widgetCard}>
        <div style={{ ...widgetTitle, marginBottom: "14px" }}>
          <RiMegaphoneLine size={16} color="#8b5cf6" />
          Announcements
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {announcements.map((a, i) => (
            <div key={i} style={{ padding: "10px 12px", borderRadius: "10px", background: a.bg, border: `1px solid ${a.color}22`, cursor: "pointer", transition: "opacity 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                <span style={{ fontSize: "10px", fontWeight: 700, color: a.color, background: a.color + "20", padding: "1px 7px", borderRadius: "10px" }}>{a.tag}</span>
                <span style={{ fontSize: "10px", color: "var(--text-muted)", marginLeft: "auto" }}>{a.time}</span>
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-primary)", lineHeight: 1.4 }}>{a.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Approvals */}
      <div style={widgetCard}>
        <div style={{ ...widgetTitle, marginBottom: "14px" }}>
          <RiCheckboxCircleLine size={16} color="#ef4444" />
          Pending Approvals
          <span style={{ marginLeft: "auto", fontSize: "11px", fontWeight: 700, color: "#ef4444", background: "#fff5f5", padding: "2px 8px", borderRadius: "20px" }}>
            {approvals.length} pending
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {approvals.map((a, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", borderRadius: "10px", border: "1px solid var(--border)", background: "#fafafa" }}>
              <Avatar label={a.avatar} color={a.color} size={32} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.name}</div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{a.type} · {a.days}</div>
              </div>
              <div style={{ display: "flex", gap: "5px" }}>
                <button style={{ padding: "4px 9px", borderRadius: "6px", border: "none", background: "#d1fae5", color: "#059669", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}>✓</button>
                <button style={{ padding: "4px 9px", borderRadius: "6px", border: "none", background: "#fee2e2", color: "#dc2626", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}>✕</button>
              </div>
            </div>
          ))}
        </div>
        <button style={{ width: "100%", marginTop: "12px", padding: "8px", background: "#eff6ff", color: "#1e40af", border: "1px solid #bfdbfe", borderRadius: "10px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
          View all approvals →
        </button>
      </div>

    </div>
  );
}
