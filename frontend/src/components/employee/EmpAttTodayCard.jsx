import { useState, useEffect } from "react";
import { RiLoginBoxLine, RiLogoutBoxLine, RiTimeLine, RiMapPinLine } from "react-icons/ri";

function LiveTimer({ startTime }) {
  const [elapsed, setElapsed] = useState("00:00:00");
  useEffect(() => {
    if (!startTime) return;
    const calc = () => {
      const [h, m, s] = startTime.split(":").map(Number);
      const start = new Date();
      start.setHours(h, m, s || 0, 0);
      const diff = Math.max(0, Math.floor((new Date() - start) / 1000));
      setElapsed(
        `${String(Math.floor(diff / 3600)).padStart(2, "0")}:${String(Math.floor((diff % 3600) / 60)).padStart(2, "0")}:${String(diff % 60).padStart(2, "0")}`
      );
    };
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, [startTime]);
  return <span style={{ fontFamily: "monospace", letterSpacing: "0.05em" }}>{elapsed}</span>;
}

const S_CFG = {
  PRESENT: { label: "Present", color: "#059669", bg: "#ecfdf5", border: "#6ee7b7" },
  LATE:    { label: "Late",    color: "#d97706", bg: "#fffbeb", border: "#fcd34d" },
  ABSENT:  { label: "Absent",  color: "#dc2626", bg: "#fef2f2", border: "#fca5a5" },
  default: { label: "—",       color: "#94a3b8", bg: "#f8fafc", border: "#e2e8f0" },
};

export default function EmpAttTodayCard({ record }) {
  const cfg        = S_CFG[record?.status] || S_CFG.default;
  const checkedIn  = !!record?.checkInTime;
  const checkedOut = !!record?.checkOutTime;

  const items = [
    { icon: RiLoginBoxLine,  label: "Check-In",    value: record?.checkInTime  || "—",      color: checkedIn  ? "#059669" : "#94a3b8", bg: checkedIn  ? "#ecfdf5" : "#f8fafc", border: checkedIn  ? "#6ee7b7" : "#e2e8f0" },
    { icon: RiLogoutBoxLine, label: "Check-Out",   value: record?.checkOutTime || "Pending", color: checkedOut ? "#1e40af" : "#94a3b8", bg: checkedOut ? "#eff6ff" : "#f8fafc", border: checkedOut ? "#93c5fd" : "#e2e8f0" },
    { icon: RiTimeLine,      label: "Hours Worked",value: record?.workingHours ? `${record.workingHours.toFixed(1)}h` : "—", color: "#7c3aed", bg: "#f5f3ff", border: "#c4b5fd" },
    { icon: RiMapPinLine,    label: "Work Mode",   value: "Office",             color: "#0891b2", bg: "#ecfeff", border: "#67e8f9" },
  ];

  return (
    <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e8edf5", boxShadow: "0 4px 24px rgba(30,64,175,0.07)", overflow: "hidden" }}>
      <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h3 style={{ fontSize: "13.5px", fontWeight: 700, color: "#0f172a" }}>Today's Attendance</h3>
          <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>
        <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: 700, color: cfg.color, background: cfg.bg, padding: "4px 12px", borderRadius: "20px", border: `1px solid ${cfg.border}` }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.color }} />
          {cfg.label}
        </span>
      </div>

      <div style={{ padding: "16px 20px" }}>
        {checkedIn && !checkedOut && (
          <div style={{ background: "linear-gradient(135deg,#eff6ff,#dbeafe)", borderRadius: "12px", padding: "12px 16px", marginBottom: "14px", border: "1px solid #93c5fd", textAlign: "center" }}>
            <div style={{ fontSize: "10px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "4px" }}>⏱ Live Working Timer</div>
            <div style={{ fontSize: "26px", fontWeight: 800, color: "#1e40af" }}>
              <LiveTimer startTime={record?.checkInTime} />
            </div>
            <div style={{ fontSize: "11px", color: "#64748b", marginTop: "3px" }}>Since check-in at {record?.checkInTime}</div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "9px" }}>
          {items.map(({ icon: Icon, label, value, color, bg, border }) => (
            <div key={label} style={{ background: bg, borderRadius: "11px", padding: "11px 13px", border: `1px solid ${border}60` }}>
              <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "5px" }}>
                <Icon size={12} color={color} />
                <span style={{ fontSize: "9.5px", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase" }}>{label}</span>
              </div>
              <div style={{ fontSize: "14px", fontWeight: 800, color }}>{value}</div>
            </div>
          ))}
        </div>

        {record?.workingHours > 0 && (
          <div style={{ marginTop: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <span style={{ fontSize: "11px", fontWeight: 600, color: "#475569" }}>Daily Target</span>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#1e40af" }}>{record.workingHours.toFixed(1)}h / 8h</span>
            </div>
            <div style={{ height: "6px", borderRadius: "99px", background: "#f1f5f9", overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: "99px",
                width: `${Math.min((record.workingHours / 8) * 100, 100)}%`,
                background: record.workingHours >= 8 ? "linear-gradient(90deg,#10b981,#059669)" : "linear-gradient(90deg,#3b82f6,#1e40af)",
                transition: "width 0.8s ease",
              }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
