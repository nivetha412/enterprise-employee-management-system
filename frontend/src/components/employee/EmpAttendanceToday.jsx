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
      const hh = String(Math.floor(diff / 3600)).padStart(2, "0");
      const mm = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
      const ss = String(diff % 60).padStart(2, "0");
      setElapsed(`${hh}:${mm}:${ss}`);
    };
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, [startTime]);

  return <span style={{ fontFamily: "monospace", letterSpacing: "0.05em" }}>{elapsed}</span>;
}

const STATUS_CFG = {
  PRESENT: { label: "Present",  color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", dot: "#10b981" },
  LATE:    { label: "Late",     color: "#d97706", bg: "#fffbeb", border: "#fcd34d", dot: "#f59e0b" },
  ABSENT:  { label: "Absent",   color: "#dc2626", bg: "#fef2f2", border: "#fca5a5", dot: "#ef4444" },
  WFH:     { label: "WFH",      color: "#8b5cf6", bg: "#f5f3ff", border: "#c4b5fd", dot: "#8b5cf6" },
  default: { label: "—",        color: "#94a3b8", bg: "#f8fafc", border: "#e2e8f0", dot: "#94a3b8" },
};

export default function EmpAttendanceToday({ record }) {
  const cfg = STATUS_CFG[record?.status] || STATUS_CFG.default;
  const checkedIn  = !!record?.checkInTime;
  const checkedOut = !!record?.checkOutTime;

  const items = [
    {
      icon: RiLoginBoxLine, label: "Check-In Time",
      value: record?.checkInTime || "—",
      color: checkedIn ? "#059669" : "#94a3b8",
      bg: checkedIn ? "#ecfdf5" : "#f8fafc",
      border: checkedIn ? "#6ee7b7" : "#e2e8f0",
    },
    {
      icon: RiLogoutBoxLine, label: "Check-Out Time",
      value: record?.checkOutTime || "Pending",
      color: checkedOut ? "#1e40af" : "#94a3b8",
      bg: checkedOut ? "#eff6ff" : "#f8fafc",
      border: checkedOut ? "#93c5fd" : "#e2e8f0",
    },
    {
      icon: RiTimeLine, label: "Hours Worked",
      value: record?.workingHours ? `${record.workingHours.toFixed(1)}h` : "—",
      color: "#7c3aed",
      bg: "#f5f3ff",
      border: "#c4b5fd",
    },
    {
      icon: RiMapPinLine, label: "Work Mode",
      value: record?.status === "WFH" ? "Work From Home" : "Office",
      color: "#0891b2",
      bg: "#ecfeff",
      border: "#67e8f9",
    },
  ];

  return (
    <div style={{
      background: "#fff", borderRadius: "16px",
      boxShadow: "0 4px 24px rgba(30,64,175,0.08), 0 1px 4px rgba(0,0,0,0.04)",
      border: "1px solid #e8edf5", overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        padding: "16px 22px 14px", borderBottom: "1px solid #f1f5f9",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <h3 style={{ fontSize: "13.5px", fontWeight: 700, color: "#0f172a" }}>Today's Attendance</h3>
          <p style={{ fontSize: "11.5px", color: "#94a3b8", marginTop: "2px" }}>
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>
        <span style={{
          display: "flex", alignItems: "center", gap: "5px",
          fontSize: "11px", fontWeight: 700, color: cfg.color,
          background: cfg.bg, padding: "4px 12px", borderRadius: "20px",
          border: `1px solid ${cfg.border}`,
        }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: cfg.dot }} />
          {cfg.label}
        </span>
      </div>

      <div style={{ padding: "18px 22px" }}>
        {/* Live timer */}
        {checkedIn && !checkedOut && (
          <div style={{
            background: "linear-gradient(135deg,#eff6ff,#dbeafe)",
            borderRadius: "12px", padding: "14px 18px", marginBottom: "16px",
            border: "1px solid #93c5fd", textAlign: "center",
          }}>
            <div style={{ fontSize: "10.5px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "6px" }}>
              ⏱ Live Working Timer
            </div>
            <div style={{ fontSize: "28px", fontWeight: 800, color: "#1e40af", letterSpacing: "0.05em" }}>
              <LiveTimer startTime={record?.checkInTime} />
            </div>
            <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>Since check-in at {record?.checkInTime}</div>
          </div>
        )}

        {/* Info grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          {items.map(({ icon: Icon, label, value, color, bg, border }) => (
            <div key={label} style={{
              background: bg, borderRadius: "12px", padding: "12px 14px",
              border: `1px solid ${border}60`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                <Icon size={13} color={color} />
                <span style={{ fontSize: "10px", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
              </div>
              <div style={{ fontSize: "15px", fontWeight: 800, color }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Hours progress bar */}
        {record?.workingHours > 0 && (
          <div style={{ marginTop: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
              <span style={{ fontSize: "11px", fontWeight: 600, color: "#475569" }}>Daily Target Progress</span>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#1e40af" }}>
                {record.workingHours.toFixed(1)}h / 8h
              </span>
            </div>
            <div style={{ height: "7px", borderRadius: "99px", background: "#f1f5f9", overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: "99px",
                width: `${Math.min((record.workingHours / 8) * 100, 100)}%`,
                background: record.workingHours >= 8
                  ? "linear-gradient(90deg,#10b981,#059669)"
                  : "linear-gradient(90deg,#3b82f6,#1e40af)",
                transition: "width 0.8s ease",
              }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
