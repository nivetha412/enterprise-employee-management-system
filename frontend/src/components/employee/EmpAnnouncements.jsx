import { useState } from "react";
import { RiMegaphoneLine, RiBellLine, RiCheckDoubleLine } from "react-icons/ri";

const ANNOUNCEMENTS = [
  { tag: "HR",      priority: "High",   tagColor: "#dc2626", tagBg: "#fef2f2",  text: "Q3 performance reviews start next Monday. Please complete your self-assessment.", time: "Today" },
  { tag: "IT",      priority: "Medium", tagColor: "#8b5cf6", tagBg: "#f5f3ff",  text: "System maintenance scheduled Sunday 2–4 AM. Save your work before then.",         time: "Yesterday" },
  { tag: "Finance", priority: "Medium", tagColor: "#10b981", tagBg: "#ecfdf5",  text: "Expense submission deadline is July 31. Submit all pending reimbursements.",       time: "2 days ago" },
  { tag: "Admin",   priority: "Low",    tagColor: "#d97706", tagBg: "#fffbeb",  text: "New WFH policy effective August 1. Check the HR portal for details.",              time: "3 days ago" },
];

const NOTIFICATIONS = [
  { icon: "📝", text: "Your leave request is pending approval",  time: "5m ago",  unread: true  },
  { icon: "✅", text: "Attendance marked successfully for today", time: "1h ago",  unread: true  },
  { icon: "📊", text: "Your June payslip is now available",       time: "2h ago",  unread: false },
  { icon: "🎯", text: "Performance review due in 3 days",         time: "1d ago",  unread: false },
];

const priorityColors = {
  High:   { color: "#dc2626", bg: "#fef2f2" },
  Medium: { color: "#d97706", bg: "#fffbeb" },
  Low:    { color: "#059669", bg: "#ecfdf5" },
};

export default function EmpAnnouncements() {
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const unreadCount = notifs.filter(n => n.unread).length;

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, unread: false })));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

      {/* Announcements */}
      <div style={{
        background: "#fff", borderRadius: "16px",
        boxShadow: "0 4px 24px rgba(30,64,175,0.08), 0 1px 4px rgba(0,0,0,0.04)",
        border: "1px solid #e8edf5", overflow: "hidden",
      }}>
        <div style={{
          padding: "18px 22px 14px", borderBottom: "1px solid #f1f5f9",
          display: "flex", alignItems: "center", gap: "8px",
        }}>
          <div style={{
            width: "30px", height: "30px", borderRadius: "8px",
            background: "#f5f3ff", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <RiMegaphoneLine size={15} color="#8b5cf6" />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: "13.5px", fontWeight: 700, color: "#0f172a" }}>Company Announcements</h3>
          </div>
          <span style={{
            fontSize: "11px", fontWeight: 700, color: "#8b5cf6",
            background: "#f5f3ff", padding: "3px 10px", borderRadius: "20px",
            border: "1px solid #ddd6fe",
          }}>
            {ANNOUNCEMENTS.length} new
          </span>
        </div>

        <div style={{ padding: "14px 22px", display: "flex", flexDirection: "column", gap: "8px" }}>
          {ANNOUNCEMENTS.map((a, i) => {
            const pc = priorityColors[a.priority];
            return (
              <div key={i} style={{
                padding: "12px 14px", borderRadius: "12px",
                background: "#f8fafc", border: "1px solid #f1f5f9",
                borderLeft: `3px solid ${a.tagColor}`,
                cursor: "pointer", transition: "all 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = a.tagBg; e.currentTarget.style.borderColor = a.tagColor + "40"; e.currentTarget.style.borderLeftColor = a.tagColor; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.borderColor = "#f1f5f9"; e.currentTarget.style.borderLeftColor = a.tagColor; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                  <span style={{
                    fontSize: "10px", fontWeight: 700, color: a.tagColor,
                    background: a.tagColor + "18", padding: "2px 8px", borderRadius: "6px",
                  }}>{a.tag}</span>
                  <span style={{
                    fontSize: "9.5px", fontWeight: 700, color: pc.color,
                    background: pc.bg, padding: "1px 7px", borderRadius: "6px",
                  }}>{a.priority}</span>
                  <span style={{ fontSize: "10px", color: "#94a3b8", marginLeft: "auto" }}>{a.time}</span>
                </div>
                <div style={{ fontSize: "12px", color: "#475569", lineHeight: 1.5 }}>{a.text}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Notifications */}
      <div style={{
        background: "#fff", borderRadius: "16px",
        boxShadow: "0 4px 24px rgba(30,64,175,0.08), 0 1px 4px rgba(0,0,0,0.04)",
        border: "1px solid #e8edf5", overflow: "hidden",
      }}>
        <div style={{
          padding: "18px 22px 14px", borderBottom: "1px solid #f1f5f9",
          display: "flex", alignItems: "center", gap: "8px",
        }}>
          <div style={{
            width: "30px", height: "30px", borderRadius: "8px",
            background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative",
          }}>
            <RiBellLine size={15} color="#1e40af" />
            {unreadCount > 0 && (
              <span style={{
                position: "absolute", top: "-4px", right: "-4px",
                width: "14px", height: "14px", borderRadius: "50%",
                background: "#dc2626", color: "#fff",
                fontSize: "8px", fontWeight: 800,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "2px solid #fff",
              }}>{unreadCount}</span>
            )}
          </div>
          <h3 style={{ fontSize: "13.5px", fontWeight: 700, color: "#0f172a", flex: 1 }}>Notifications</h3>
          {unreadCount > 0 && (
            <button onClick={markAllRead} style={{
              display: "flex", alignItems: "center", gap: "4px",
              fontSize: "11px", fontWeight: 600, color: "#1e40af",
              background: "none", border: "none", cursor: "pointer",
            }}>
              <RiCheckDoubleLine size={13} /> Mark all read
            </button>
          )}
        </div>

        <div style={{ padding: "8px 0" }}>
          {notifs.map((n, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "flex-start", gap: "12px",
              padding: "11px 22px",
              background: n.unread ? "#f8fbff" : "transparent",
              borderBottom: i < notifs.length - 1 ? "1px solid #f8fafc" : "none",
              cursor: "pointer", transition: "background 0.15s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "#f1f5f9"}
              onMouseLeave={e => e.currentTarget.style.background = n.unread ? "#f8fbff" : "transparent"}
            >
              <div style={{
                width: "34px", height: "34px", borderRadius: "9px",
                background: n.unread ? "#eff6ff" : "#f8fafc",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "16px", flexShrink: 0,
              }}>
                {n.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "12px", color: "#0f172a", lineHeight: 1.4, fontWeight: n.unread ? 600 : 400 }}>{n.text}</div>
                <div style={{ fontSize: "10.5px", color: "#94a3b8", marginTop: "3px" }}>{n.time}</div>
              </div>
              {n.unread && (
                <div style={{
                  width: "8px", height: "8px", borderRadius: "50%",
                  background: "#3b82f6", flexShrink: 0, marginTop: "5px",
                  boxShadow: "0 0 0 3px rgba(59,130,246,0.2)",
                }} />
              )}
            </div>
          ))}
        </div>

        <div style={{ padding: "12px 22px", borderTop: "1px solid #f1f5f9" }}>
          <button style={{
            width: "100%", padding: "9px",
            background: "#eff6ff", color: "#1e40af",
            border: "1px solid #bfdbfe", borderRadius: "10px",
            fontSize: "12px", fontWeight: 700, cursor: "pointer",
            transition: "background 0.15s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "#dbeafe"}
            onMouseLeave={e => e.currentTarget.style.background = "#eff6ff"}
          >
            View all notifications →
          </button>
        </div>
      </div>
    </div>
  );
}
