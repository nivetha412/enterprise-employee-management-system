import { RiCalendarEventLine } from "react-icons/ri";

const EVENTS = [
  { icon: "🎉", color: "#d97706", bg: "#fffbeb", border: "#fcd34d", label: "Holiday",  title: "Independence Day",        date: "Jul 4",  sub: "Public Holiday",      labelColor: "#d97706", labelBg: "#fef3c7" },
  { icon: "🎂", color: "#ec4899", bg: "#fdf2f8", border: "#f9a8d4", label: "Birthday", title: "James Carter's Birthday", date: "Jul 6",  sub: "Engineering Team",    labelColor: "#ec4899", labelBg: "#fce7f3" },
  { icon: "📹", color: "#3b82f6", bg: "#eff6ff", border: "#93c5fd", label: "Meeting",  title: "Sprint Planning",         date: "Jul 7",  sub: "10:00 AM · Zoom",     labelColor: "#1e40af", labelBg: "#dbeafe" },
  { icon: "📚", color: "#8b5cf6", bg: "#f5f3ff", border: "#c4b5fd", label: "Training", title: "React Advanced Workshop", date: "Jul 10", sub: "2:00 PM · Online",    labelColor: "#7c3aed", labelBg: "#ede9fe" },
  { icon: "🎉", color: "#d97706", bg: "#fffbeb", border: "#fcd34d", label: "Holiday",  title: "Labor Day",               date: "Sep 1",  sub: "Public Holiday",      labelColor: "#d97706", labelBg: "#fef3c7" },
];

export default function EmpUpcomingEvents() {
  return (
    <div style={{
      background: "#fff", borderRadius: "16px",
      boxShadow: "0 4px 24px rgba(30,64,175,0.08), 0 1px 4px rgba(0,0,0,0.04)",
      border: "1px solid #e8edf5", overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        padding: "18px 22px 14px",
        borderBottom: "1px solid #f1f5f9",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <h3 style={{ fontSize: "13.5px", fontWeight: 700, color: "#0f172a" }}>Upcoming Events</h3>
          <p style={{ fontSize: "11.5px", color: "#94a3b8", marginTop: "2px" }}>Next 30 days</p>
        </div>
        <div style={{
          width: "32px", height: "32px", borderRadius: "8px",
          background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <RiCalendarEventLine size={16} color="#1e40af" />
        </div>
      </div>

      <div style={{ padding: "14px 22px", display: "flex", flexDirection: "column", gap: "8px" }}>
        {EVENTS.map((ev, i) => {
          const [month, day] = ev.date.split(" ");
          return (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: "12px",
              padding: "12px 14px", borderRadius: "12px",
              background: "#f8fafc",
              border: "1px solid #f1f5f9",
              borderLeft: `3px solid ${ev.color}`,
              transition: "all 0.18s",
              cursor: "pointer",
            }}
              onMouseEnter={e => {
                e.currentTarget.style.background = ev.bg;
                e.currentTarget.style.border = `1px solid ${ev.border}60`;
                e.currentTarget.style.borderLeft = `3px solid ${ev.color}`;
                e.currentTarget.style.transform = "translateX(3px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "#f8fafc";
                e.currentTarget.style.border = "1px solid #f1f5f9";
                e.currentTarget.style.borderLeft = `3px solid ${ev.color}`;
                e.currentTarget.style.transform = "translateX(0)";
              }}
            >
              {/* Date badge */}
              <div style={{
                width: "44px", height: "44px", borderRadius: "10px",
                background: ev.color + "15",
                border: `1px solid ${ev.color}30`,
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", flexShrink: 0,
              }}>
                <span style={{ fontSize: "8px", fontWeight: 800, color: ev.color, textTransform: "uppercase", letterSpacing: "0.05em" }}>{month}</span>
                <span style={{ fontSize: "16px", fontWeight: 800, color: ev.color, lineHeight: 1 }}>{day}</span>
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "12.5px", fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {ev.icon} {ev.title}
                </div>
                <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>{ev.sub}</div>
              </div>

              <span style={{
                fontSize: "9.5px", fontWeight: 700, padding: "3px 8px",
                borderRadius: "10px", color: ev.labelColor, background: ev.labelBg,
                flexShrink: 0, whiteSpace: "nowrap",
              }}>{ev.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
