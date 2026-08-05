import { RiCheckboxCircleLine, RiUserUnfollowLine, RiAlarmWarningLine, RiTimeLine, RiLoginBoxLine, RiLogoutBoxLine } from "react-icons/ri";
import { useEmployee } from "../../hooks/useEmployee";

function DonutRing({ pct }) {
  const r = 44, cx = 52, cy = 52, circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  const color = pct >= 90 ? "#10b981" : pct >= 75 ? "#3b82f6" : "#f59e0b";
  return (
    <svg width="104" height="104" viewBox="0 0 104 104">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth="10" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="10"
        strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={circ * 0.25}
        strokeLinecap="round" style={{ transition: "stroke-dasharray 0.8s ease" }} />
      <text x={cx} y={cy - 5} textAnchor="middle" fontSize="16" fontWeight="800" fill="#0f172a">{pct}%</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fontSize="9" fontWeight="600" fill="#94a3b8">Attendance</text>
    </svg>
  );
}

export default function EmpDashAttCard() {
  const { attStats, todayRecord, loading } = useEmployee();
  const pct = attStats.workingDays > 0 ? Math.round((attStats.presentDays / attStats.workingDays) * 100) : 0;
  const month = new Date().toLocaleString("en-US", { month: "long", year: "numeric" });

  const stats = [
    { icon: RiCheckboxCircleLine, label: "Present",      value: attStats.presentDays, color: "#059669", bg: "#ecfdf5" },
    { icon: RiUserUnfollowLine,   label: "Absent",       value: attStats.absentDays,  color: "#dc2626", bg: "#fef2f2" },
    { icon: RiAlarmWarningLine,   label: "Late",         value: attStats.lateDays,    color: "#d97706", bg: "#fffbeb" },
    { icon: RiTimeLine,           label: "Working Days", value: attStats.workingDays, color: "#1e40af", bg: "#eff6ff" },
  ];

  return (
    <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e8edf5", boxShadow: "0 4px 24px rgba(30,64,175,0.07)", overflow: "hidden" }}>
      <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h3 style={{ fontSize: "13.5px", fontWeight: 700, color: "#0f172a" }}>Attendance Overview</h3>
          <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>This month's summary</p>
        </div>
        <span style={{ fontSize: "10.5px", fontWeight: 700, color: "#059669", background: "#ecfdf5", padding: "3px 10px", borderRadius: "20px", border: "1px solid #6ee7b7" }}>{month}</span>
      </div>

      <div style={{ padding: "16px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
          <div style={{ flexShrink: 0 }}>{loading ? <div className="skeleton" style={{ width: 104, height: 104, borderRadius: "50%" }} /> : <DonutRing pct={pct} />}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "7px", flex: 1 }}>
            {stats.map(({ icon: Icon, label, value, color, bg }) => (
              <div key={label} style={{ background: bg, borderRadius: "10px", padding: "9px 11px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "3px" }}>
                  <Icon size={11} color={color} />
                  <span style={{ fontSize: "9px", color, fontWeight: 700, textTransform: "uppercase" }}>{label}</span>
                </div>
                <div style={{ fontSize: "18px", fontWeight: 800, color, lineHeight: 1 }}>{loading ? "…" : value}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "linear-gradient(135deg,#f8fafc,#f1f5f9)", borderRadius: "12px", padding: "12px 14px", border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: "10px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "8px" }}>Today's Status</div>
          <div style={{ display: "flex", gap: "8px" }}>
            {[
              { label: "Check-In",  time: todayRecord?.checkInTime,  icon: RiLoginBoxLine,  ac: "#059669", ab: "#ecfdf5", abr: "#6ee7b7" },
              { label: "Check-Out", time: todayRecord?.checkOutTime, icon: RiLogoutBoxLine, ac: "#1e40af", ab: "#eff6ff", abr: "#93c5fd" },
            ].map(({ label, time, icon: Icon, ac, ab, abr }) => (
              <div key={label} style={{ flex: 1, display: "flex", alignItems: "center", gap: "8px", padding: "9px 12px", borderRadius: "10px", background: time ? ab : "#fff", border: `1.5px solid ${time ? abr : "#e2e8f0"}` }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "7px", background: time ? ac : "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={14} color={time ? "#fff" : "#94a3b8"} />
                </div>
                <div>
                  <div style={{ fontSize: "9px", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase" }}>{label}</div>
                  <div style={{ fontSize: "12px", fontWeight: 800, color: time ? ac : "#94a3b8" }}>{time || "—"}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
