import { RiBuilding2Line, RiTeamLine, RiCheckboxCircleLine, RiUserStarLine } from "react-icons/ri";

const CARDS = [
  { key: "total",     label: "Total Departments",    icon: RiBuilding2Line,       color: "#2563eb", grad: "linear-gradient(135deg,#dbeafe,#bfdbfe)", border: "#bfdbfe" },
  { key: "employees", label: "Total Employees",      icon: RiTeamLine,            color: "#7c3aed", grad: "linear-gradient(135deg,#ede9fe,#ddd6fe)", border: "#ddd6fe" },
  { key: "active",    label: "Active Departments",   icon: RiCheckboxCircleLine,  color: "#059669", grad: "linear-gradient(135deg,#d1fae5,#a7f3d0)", border: "#6ee7b7" },
  { key: "heads",     label: "Dept Heads Assigned",  icon: RiUserStarLine,        color: "#d97706", grad: "linear-gradient(135deg,#fef3c7,#fde68a)", border: "#fde68a" },
];

function KPICard({ card, value, loading }) {
  const Icon = card.icon;
  return (
    <div
      style={{
        flex: "1 1 180px", background: "#fff", borderRadius: 18,
        padding: "20px 22px", border: `1.5px solid ${card.border}`,
        boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
        display: "flex", alignItems: "center", gap: 16,
        transition: "transform 0.2s, box-shadow 0.2s", cursor: "default",
        position: "relative", overflow: "hidden",
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 12px 32px ${card.color}20`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.06)"; }}
    >
      {/* Subtle bg accent */}
      <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: card.color + "08", pointerEvents: "none" }} />

      <div style={{
        width: 50, height: 50, borderRadius: 14,
        background: card.grad,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        boxShadow: `0 4px 12px ${card.color}25`,
      }}>
        <Icon size={22} color={card.color} />
      </div>

      <div style={{ flex: 1 }}>
        {loading ? (
          <>
            <div className="skeleton" style={{ height: 28, width: 60, borderRadius: 8, marginBottom: 6 }} />
            <div className="skeleton" style={{ height: 11, width: 100, borderRadius: 6 }} />
          </>
        ) : (
          <>
            <div style={{ fontSize: 28, fontWeight: 800, color: card.color, lineHeight: 1, letterSpacing: "-0.04em" }}>{value}</div>
            <div style={{ fontSize: 11.5, color: "#64748b", marginTop: 4, fontWeight: 600 }}>{card.label}</div>
          </>
        )}
      </div>

      {/* Bottom accent line */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${card.color}, ${card.color}44)`, borderRadius: "0 0 18px 18px" }} />
    </div>
  );
}

export default function DeptKPICards({ kpi, loading }) {
  return (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
      {CARDS.map(card => (
        <KPICard key={card.key} card={card} value={kpi[card.key]} loading={loading} />
      ))}
    </div>
  );
}
