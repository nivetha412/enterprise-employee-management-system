import {
  RiCheckboxCircleLine, RiCloseCircleLine, RiAlarmWarningLine,
  RiCalendarCheckLine, RiTimeLine, RiSunLine,
} from "react-icons/ri";

function DonutRing({ pct, color, size = 64 }) {
  const r = (size / 2) - 7;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f1f5f9" strokeWidth="7" />
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth="7"
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeDashoffset={circ * 0.25}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.8s ease" }}
      />
      <text x={size/2} y={size/2 + 4} textAnchor="middle" fontSize="11" fontWeight="800" fill={color}>{pct}%</text>
    </svg>
  );
}

export default function EmpAttendanceSummaryCards({ stats }) {
  const {
    presentDays = 18, absentDays = 2, lateDays = 3,
    leaveDays = 1, totalHours = "142.5", workingDays = 23,
  } = stats || {};

  const pct = workingDays > 0 ? Math.round((presentDays / workingDays) * 100) : 0;
  const pctColor = pct >= 90 ? "#10b981" : pct >= 75 ? "#3b82f6" : "#f59e0b";

  const cards = [
    { icon: RiCheckboxCircleLine, label: "Present Days",   value: presentDays, unit: "days",  color: "#059669", bg: "linear-gradient(135deg,#ecfdf5,#d1fae5)", border: "#6ee7b7" },
    { icon: RiCloseCircleLine,    label: "Absent Days",    value: absentDays,  unit: "days",  color: "#dc2626", bg: "linear-gradient(135deg,#fef2f2,#fee2e2)", border: "#fca5a5" },
    { icon: RiAlarmWarningLine,   label: "Late Arrivals",  value: lateDays,    unit: "days",  color: "#d97706", bg: "linear-gradient(135deg,#fffbeb,#fef3c7)", border: "#fcd34d" },
    { icon: RiCalendarCheckLine,  label: "Leave Days",     value: leaveDays,   unit: "days",  color: "#8b5cf6", bg: "linear-gradient(135deg,#f5f3ff,#ede9fe)", border: "#c4b5fd" },
    { icon: RiTimeLine,           label: "Total Hours",    value: totalHours,  unit: "hrs",   color: "#0891b2", bg: "linear-gradient(135deg,#ecfeff,#cffafe)", border: "#67e8f9" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "14px", marginBottom: "20px" }}>
      {cards.map(({ icon: Icon, label, value, unit, color, bg, border }) => (
        <div key={label} style={{
          background: bg, borderRadius: "16px", padding: "18px 16px",
          border: `1px solid ${border}60`,
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          transition: "transform 0.2s, box-shadow 0.2s",
          cursor: "default",
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 8px 24px ${color}20`; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)"; }}
        >
          <div style={{
            width: "36px", height: "36px", borderRadius: "10px",
            background: color + "20", display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: "12px",
          }}>
            <Icon size={18} color={color} />
          </div>
          <div style={{ fontSize: "26px", fontWeight: 800, color, lineHeight: 1, letterSpacing: "-0.03em" }}>{value}</div>
          <div style={{ fontSize: "10px", color: color + "90", fontWeight: 600, marginTop: "2px" }}>{unit}</div>
          <div style={{ fontSize: "11px", color: "#475569", marginTop: "6px", fontWeight: 600 }}>{label}</div>
        </div>
      ))}

      {/* Attendance % card with donut */}
      <div style={{
        background: "#fff", borderRadius: "16px", padding: "18px 16px",
        border: "1px solid #e8edf5",
        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        transition: "transform 0.2s, box-shadow 0.2s", cursor: "default",
      }}
        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 8px 24px ${pctColor}20`; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)"; }}
      >
        <DonutRing pct={pct} color={pctColor} size={64} />
        <div style={{ fontSize: "11px", color: "#475569", fontWeight: 700, marginTop: "8px", textAlign: "center" }}>Attendance %</div>
        <div style={{ fontSize: "10px", color: "#94a3b8", marginTop: "2px" }}>{presentDays}/{workingDays} days</div>
      </div>
    </div>
  );
}
