import { useState, useEffect } from "react";
import { RiTimeLine, RiUserUnfollowLine, RiAlarmWarningLine, RiCheckboxCircleLine, RiLoginBoxLine, RiLogoutBoxLine } from "react-icons/ri";
import { useEmployee } from "../../hooks/useEmployee";
import api from "../../services/api";

function DonutRing({ pct = 0 }) {
  const r = 44, cx = 52, cy = 52;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width="104" height="104" viewBox="0 0 104 104">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth="10" />
      <circle cx={cx} cy={cy} r={r} fill="none"
        stroke="url(#attGrad)" strokeWidth="10"
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeDashoffset={circ * 0.25}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.8s ease" }}
      />
      <defs>
        <linearGradient id="attGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#10b981" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      <text x={cx} y={cy - 6}  textAnchor="middle" fontSize="16" fontWeight="800" fill="#0f172a">{pct}%</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fontSize="9"  fontWeight="600" fill="#94a3b8">Attendance</text>
    </svg>
  );
}

export default function EmpAttendanceOverview() {
  const { emp } = useEmployee();
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    if (!emp?.id) return;
    const now   = new Date();
    const year  = now.getFullYear();
    const month = now.getMonth() + 1;
    api.get(`/attendance/employee/${emp.id}/summary`, { params: { year, month } })
      .then(res => setSummary(res.data))
      .catch(() => setSummary(null));
  }, [emp?.id]);

  const present     = summary?.present     ?? 0;
  const absent      = summary?.absent      ?? 0;
  const late        = summary?.late        ?? 0;
  const workingDays = summary?.workingDays ?? 0;
  const pct         = workingDays > 0 ? Math.round((present / workingDays) * 100) : 0;
  const checkIn     = summary?.todayCheckIn  || null;
  const checkOut    = summary?.todayCheckOut || null;

  const now   = new Date();
  const label = now.toLocaleString("en-US", { month: "long", year: "numeric" });

  const STATS = [
    { icon: RiCheckboxCircleLine, label: "Present",      value: present,     color: "#059669", bg: "#ecfdf5", border: "#6ee7b7" },
    { icon: RiUserUnfollowLine,   label: "Absent",       value: absent,      color: "#dc2626", bg: "#fef2f2", border: "#fca5a5" },
    { icon: RiAlarmWarningLine,   label: "Late",         value: late,        color: "#d97706", bg: "#fffbeb", border: "#fcd34d" },
    { icon: RiTimeLine,           label: "Working Days", value: workingDays, color: "#1e40af", bg: "#eff6ff", border: "#93c5fd" },
  ];

  return (
    <div style={{
      background: "#fff", borderRadius: "16px",
      boxShadow: "0 4px 24px rgba(30,64,175,0.08), 0 1px 4px rgba(0,0,0,0.04)",
      border: "1px solid #e8edf5", overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        padding: "18px 22px 14px",
        borderBottom: "1px solid #f1f5f9",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <h3 style={{ fontSize: "13.5px", fontWeight: 700, color: "#0f172a" }}>Attendance Overview</h3>
          <p style={{ fontSize: "11.5px", color: "#94a3b8", marginTop: "2px" }}>This month's summary</p>
        </div>
        <span style={{
          fontSize: "11px", fontWeight: 700, color: "#059669",
          background: "#ecfdf5", padding: "4px 12px", borderRadius: "20px",
          border: "1px solid #6ee7b7",
        }}>{label}</span>
      </div>

      <div style={{ padding: "18px 22px" }}>
        {/* Donut + stats */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
          <div style={{ flexShrink: 0 }}><DonutRing pct={pct} /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", flex: 1 }}>
            {STATS.map(({ icon: Icon, label, value, color, bg, border }) => (
              <div key={label} style={{ background: bg, borderRadius: "10px", padding: "10px 12px", border: `1px solid ${border}40` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "4px" }}>
                  <Icon size={12} color={color} />
                  <span style={{ fontSize: "9.5px", color, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</span>
                </div>
                <div style={{ fontSize: "20px", fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's check-in/out */}
        <div style={{
          background: "linear-gradient(135deg, #f8fafc, #f1f5f9)",
          borderRadius: "12px", padding: "14px 16px",
          border: "1px solid #e2e8f0",
        }}>
          <div style={{ fontSize: "10.5px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "10px" }}>
            Today's Status
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            {[
              { label: "Check-In",  time: checkIn,  icon: RiLoginBoxLine,  activeColor: "#059669", activeBg: "#ecfdf5", activeBorder: "#6ee7b7" },
              { label: "Check-Out", time: checkOut, icon: RiLogoutBoxLine, activeColor: "#1e40af", activeBg: "#eff6ff", activeBorder: "#93c5fd" },
            ].map(({ label, time, icon: Icon, activeColor, activeBg, activeBorder }) => (
              <div key={label} style={{
                flex: 1, display: "flex", alignItems: "center", gap: "10px",
                padding: "10px 14px", borderRadius: "10px",
                background: time ? activeBg : "#fff",
                border: `1.5px solid ${time ? activeBorder : "#e2e8f0"}`,
              }}>
                <div style={{
                  width: "32px", height: "32px", borderRadius: "8px",
                  background: time ? activeColor : "#e2e8f0",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={16} color={time ? "#fff" : "#94a3b8"} />
                </div>
                <div>
                  <div style={{ fontSize: "9.5px", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase" }}>{label}</div>
                  <div style={{ fontSize: "13px", fontWeight: 800, color: time ? activeColor : "#94a3b8" }}>
                    {time || (label === "Check-Out" ? "Pending" : "—")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
