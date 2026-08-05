import { RiTimeLine, RiCalendarCheckLine, RiAlarmWarningLine, RiUserHeartLine } from "react-icons/ri";
import { useEmployee } from "../../hooks/useEmployee";

function KPICard({ icon: Icon, label, value, color, bg, border, loading }) {
  return (
    <div style={{
      background: bg, borderRadius: "16px", padding: "20px",
      border: `1px solid ${border}`, flex: "1 1 0",
      boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
      transition: "transform 0.2s, box-shadow 0.2s", cursor: "default",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 8px 24px ${color}20`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)"; }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
        <div style={{ width: "40px", height: "40px", borderRadius: "11px", background: `${color}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={20} color={color} />
        </div>
        <span style={{ fontSize: "10px", fontWeight: 700, color, background: `${color}15`, padding: "3px 10px", borderRadius: "20px" }}>This Month</span>
      </div>
      <div style={{ fontSize: "28px", fontWeight: 800, color, lineHeight: 1, letterSpacing: "-0.03em" }}>
        {loading ? <span className="skeleton" style={{ display: "inline-block", width: 48, height: 28, borderRadius: 6 }} /> : value}
      </div>
      <div style={{ fontSize: "12px", color: "#475569", marginTop: "6px", fontWeight: 600 }}>{label}</div>
    </div>
  );
}

export default function EmpDashKPIRow() {
  const { attStats, leaveStats, loading } = useEmployee();
  const pct = attStats.workingDays > 0 ? Math.round((attStats.presentDays / attStats.workingDays) * 100) : 0;

  const cards = [
    { icon: RiTimeLine,          label: "Present Days",   value: attStats.presentDays, color: "#059669", bg: "linear-gradient(135deg,#ecfdf5,#d1fae5)", border: "#6ee7b760" },
    { icon: RiAlarmWarningLine,  label: "Late Arrivals",  value: attStats.lateDays,    color: "#d97706", bg: "linear-gradient(135deg,#fffbeb,#fef3c7)", border: "#fcd34d60" },
    { icon: RiCalendarCheckLine, label: "Leave Pending",  value: leaveStats.pending,   color: "#7c3aed", bg: "linear-gradient(135deg,#f5f3ff,#ede9fe)", border: "#c4b5fd60" },
    { icon: RiUserHeartLine,     label: "Attendance Rate",value: `${pct}%`,            color: "#1e40af", bg: "linear-gradient(135deg,#eff6ff,#dbeafe)", border: "#93c5fd60" },
  ];

  return (
    <div style={{ display: "flex", gap: "16px", marginBottom: "0" }}>
      {cards.map(c => <KPICard key={c.label} {...c} loading={loading} />)}
    </div>
  );
}
