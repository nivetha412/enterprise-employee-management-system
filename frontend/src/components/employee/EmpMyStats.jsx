import { RiAwardLine, RiCalendarLine, RiProjectorLine, RiStarLine } from "react-icons/ri";

const STATS = [
  {
    icon: RiAwardLine, label: "Years in Company", value: "3.5", unit: "years",
    color: "#1e40af", bg: "linear-gradient(135deg,#eff6ff,#dbeafe)",
    border: "#93c5fd", trend: "+0.5 this year", trendUp: true,
  },
  {
    icon: RiCalendarLine, label: "Total Leaves Taken", value: "8", unit: "days",
    color: "#7c3aed", bg: "linear-gradient(135deg,#f5f3ff,#ede9fe)",
    border: "#c4b5fd", trend: "3 remaining", trendUp: null,
  },
  {
    icon: RiProjectorLine, label: "Projects Assigned", value: "4", unit: "active",
    color: "#0891b2", bg: "linear-gradient(135deg,#ecfeff,#cffafe)",
    border: "#67e8f9", trend: "2 completed", trendUp: true,
  },
  {
    icon: RiStarLine, label: "Performance Rating", value: "4.2", unit: "out of 5.0",
    color: "#d97706", bg: "linear-gradient(135deg,#fffbeb,#fef3c7)",
    border: "#fcd34d", trend: "↑ from 3.9", trendUp: true,
  },
];

function StarBar({ rating }) {
  return (
    <div style={{ display: "flex", gap: "2px", marginTop: "6px" }}>
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} style={{
          height: "4px", flex: 1, borderRadius: "2px",
          background: i <= Math.round(rating) ? "#d97706" : "#fde68a",
          transition: "background 0.3s",
        }} />
      ))}
    </div>
  );
}

export default function EmpMyStats() {
  return (
    <div style={{
      background: "#fff", borderRadius: "16px", padding: "20px 22px",
      boxShadow: "0 4px 24px rgba(30,64,175,0.08), 0 1px 4px rgba(0,0,0,0.04)",
      border: "1px solid #e8edf5",
    }}>
      <div style={{ marginBottom: "16px" }}>
        <h3 style={{ fontSize: "13.5px", fontWeight: 700, color: "#0f172a" }}>My Statistics</h3>
        <p style={{ fontSize: "11.5px", color: "#94a3b8", marginTop: "2px" }}>Your career snapshot</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {STATS.map(({ icon: Icon, label, value, unit, color, bg, border, trend, trendUp }) => (
          <div key={label} style={{
            background: bg, borderRadius: "14px", padding: "16px",
            border: `1px solid ${border}60`,
            transition: "transform 0.2s, box-shadow 0.2s",
            cursor: "default",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 8px 24px ${color}20`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <div style={{
              width: "38px", height: "38px", borderRadius: "10px",
              background: color + "20",
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: "12px",
            }}>
              <Icon size={19} color={color} />
            </div>
            <div style={{ fontSize: "26px", fontWeight: 800, color, lineHeight: 1, letterSpacing: "-0.03em" }}>{value}</div>
            <div style={{ fontSize: "10px", color: color + "90", fontWeight: 600, marginTop: "2px" }}>{unit}</div>
            <div style={{ fontSize: "11px", color: "#475569", marginTop: "6px", fontWeight: 600 }}>{label}</div>
            {label === "Performance Rating" && <StarBar rating={parseFloat(value)} />}
            {trend && (
              <div style={{
                marginTop: "8px", fontSize: "10px", fontWeight: 700,
                color: trendUp === true ? "#059669" : trendUp === false ? "#dc2626" : "#94a3b8",
                display: "flex", alignItems: "center", gap: "3px",
              }}>
                {trendUp === true ? "↑" : trendUp === false ? "↓" : "•"} {trend}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
