import {
  RiCalendarCheckLine, RiTimeLine, RiCheckboxCircleLine,
  RiCloseCircleLine, RiUserLine,
} from "react-icons/ri";

const CARDS = [
  { key: "total",    label: "Total Requests",      icon: RiCalendarCheckLine,  color: "#7c3aed", light: "#ede9fe", border: "#ddd6fe" },
  { key: "pending",  label: "Pending Approval",    icon: RiTimeLine,           color: "#d97706", light: "#fef3c7", border: "#fde68a" },
  { key: "approved", label: "Approved",            icon: RiCheckboxCircleLine, color: "#059669", light: "#d1fae5", border: "#6ee7b7" },
  { key: "rejected", label: "Rejected",            icon: RiCloseCircleLine,    color: "#dc2626", light: "#fee2e2", border: "#fecaca" },
  { key: "onLeave",  label: "On Leave Today",      icon: RiUserLine,           color: "#0891b2", light: "#cffafe", border: "#a5f3fc" },
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
      <div style={{ position: "absolute", top: -18, right: -18, width: 70, height: 70, borderRadius: "50%", background: card.color + "08", pointerEvents: "none" }} />
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
            <div style={{ fontSize: 26, fontWeight: 800, color: card.color, lineHeight: 1, letterSpacing: "-0.04em" }}>{value}</div>
            <div style={{ fontSize: 11, color: "#64748b", marginTop: 4, fontWeight: 600 }}>{card.label}</div>
          </>
        )}
      </div>
    </div>
  );
}

export default function LeaveKPICards({ kpi, loading }) {
  return (
    <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 22 }}>
      {CARDS.map(card => (
        <KPICard key={card.key} card={card} value={kpi[card.key] ?? 0} loading={loading} />
      ))}
    </div>
  );
}
