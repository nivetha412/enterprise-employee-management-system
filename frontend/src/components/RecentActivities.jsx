function RecentActivities() {
  const activities = [
    { id: 1, icon: "👤", title: "John checked in", time: "09:30 AM", color: "#4f46e5" },
    { id: 2, icon: "🏢", title: "Finance Department Created", time: "09:45 AM", color: "#7c3aed" },
    { id: 3, icon: "📝", title: "Leave Request Submitted", time: "10:15 AM", color: "#d97706" },
    { id: 4, icon: "🕐", title: "Attendance Updated", time: "11:00 AM", color: "#059669" },
  ];

  return (
    <div style={{
      background: "#fff",
      padding: "22px 24px",
      borderRadius: "14px",
      marginTop: "24px",
      boxShadow: "var(--shadow-sm)",
      border: "1px solid var(--border)"
    }}>
      <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "18px" }}>
        🕒 Recent Activities
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "12px 0",
              borderBottom: index < activities.length - 1 ? "1px solid var(--border)" : "none"
            }}
          >
            <div style={{
              width: "36px", height: "36px",
              borderRadius: "10px",
              background: activity.color + "15",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "16px",
              flexShrink: 0
            }}>
              {activity.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "13.5px", fontWeight: 500, color: "var(--text-primary)" }}>
                {activity.title}
              </div>
            </div>
            <div style={{
              fontSize: "12px",
              color: "var(--text-muted)",
              background: "var(--bg-main)",
              padding: "3px 8px",
              borderRadius: "6px",
              whiteSpace: "nowrap"
            }}>
              {activity.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentActivities;
