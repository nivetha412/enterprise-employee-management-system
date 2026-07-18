import {
  RiTeamLine, RiCheckboxCircleLine, RiCloseCircleLine,
  RiAlarmWarningLine, RiCalendarCheckLine, RiBarChartBoxLine,
} from "react-icons/ri";

const CARDS = [
  { key: "total",   label: "Total Employees", icon: RiTeamLine,           color: "#2563eb", light: "#dbeafe", border: "#bfdbfe" },
  { key: "present", label: "Present Today",   icon: RiCheckboxCircleLine, color: "#059669", light: "#d1fae5", border: "#6ee7b7" },
  { key: "absent",  label: "Absent Today",    icon: RiCloseCircleLine,    color: "#dc2626", light: "#fee2e2", border: "#fecaca" },
  { key: "late",    label: "Late Arrivals",   icon: RiAlarmWarningLine,   color: "#d97706", light: "#fef3c7", border: "#fde68a" },
  { key: "onLeave", label: "On Leave Today",  icon: RiCalendarCheckLine,  color: "#7c3aed", light: "#ede9fe", border: "#ddd6fe" },
  { key: "rate",    label: "Attendance Rate", icon: RiBarChartBoxLine,    color: "#0891b2", light: "#cffafe", border: "#a5f3fc", isRate: true },
];

function KPICard({ card, value, loading }) {
  const Icon = card.icon;
  return (
    <div style={{
      flex: "1 1 155px", background: "#fff", borderRadius: 16,
      padding: "18px 20px", border: `1.5px solid ${card.border}`,
      boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
      display: "flex", alignItems: "center", gap: 14,
      transition: "transform 0.18s, box-shadow 0.18s", cursor: "default",
      position: "relative", overflow: "hidden",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 8px 24px ${card.color}18`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 8px rgba(0,0,0,0.05)"; }}
    >
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${card.color},${card.color}55)`, borderRadius: "0 0 16px 16px" }} />

      <div style={{
        width: 46, height: 46, borderRadius: 13, flexShrink: 0,
        background: `linear-gradient(135deg,${card.light},${card.color}22)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: `0 3px 10px ${card.color}20`,
      }}>
        <Icon size={21} color={card.color} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        {loading ? (
          <>
            <div className="skeleton" style={{ height: 26, width: 52, borderRadius: 7, marginBottom: 6 }} />
            <div className="skeleton" style={{ height: 10, width: 90, borderRadius: 5 }} />
          </>
        ) : (
          <>
            <div style={{ fontSize: 26, fontWeight: 800, color: card.color, lineHeight: 1, letterSpacing: "-0.04em" }}>
              {card.isRate ? `${value}%` : value}
            </div>
            <div style={{ fontSize: 11, color: "#64748b", marginTop: 4, fontWeight: 600 }}>{card.label}</div>
            {card.isRate && (
              <div style={{ marginTop: 5, height: 3, borderRadius: 99, background: "#e2e8f0", overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 99, width: `${Math.min(value, 100)}%`,
                  background: value >= 80 ? "linear-gradient(90deg,#059669,#34d399)" : "linear-gradient(90deg,#d97706,#fbbf24)",
                  transition: "width 0.6s ease",
                }} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function AttKPICards({ kpi, loading }) {
  return (
    <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 22 }}>
      {CARDS.map(card => (
        <KPICard key={card.key} card={card} value={kpi[card.key] ?? 0} loading={loading} />
      ))}
    </div>
  );
}
