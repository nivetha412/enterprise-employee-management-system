function DashboardCard({ title, value, color, icon }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: "14px",
      padding: "22px 24px",
      flex: "1 1 160px",
      boxShadow: "var(--shadow-sm)",
      border: "1px solid var(--border)",
      position: "relative",
      overflow: "hidden",
      transition: "transform 0.2s, box-shadow 0.2s",
      cursor: "default"
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "var(--shadow-md)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "var(--shadow-sm)";
      }}
    >
      {/* Color accent bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: "3px", background: color
      }} />

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>
            {title}
          </p>
          <p style={{ fontSize: "28px", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1 }}>
            {value ?? "—"}
          </p>
        </div>
        {icon && (
          <div style={{
            width: "40px", height: "40px",
            borderRadius: "10px",
            background: color + "18",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "18px"
          }}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardCard;
