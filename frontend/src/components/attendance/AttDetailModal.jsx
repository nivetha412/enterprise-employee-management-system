import { useMemo } from "react";
import {
  RiCloseLine, RiTimeLine, RiCalendarCheckLine,
  RiLoginBoxLine, RiLogoutBoxLine, RiAlarmWarningLine,
  RiCheckboxCircleLine, RiCloseCircleLine, RiDownloadLine,
} from "react-icons/ri";
import { Avatar } from "../../styles/ui.jsx";

function Pill({ icon, label, value, color, bg }) {
  return (
    <div style={{ flex: "1 1 80px", background: bg, borderRadius: 11, padding: "11px 13px", border: `1px solid ${color}22` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
        <span style={{ color }}>{icon}</span>
        <span style={{ fontSize: 9.5, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
      </div>
      <div style={{ fontSize: 20, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
    </div>
  );
}

function SecLabel({ children }) {
  return <div style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>{children}</div>;
}

export default function AttDetailModal({ record, employees, attendance, leaves, onClose }) {
  if (!record) return null;

  const emp  = employees.find(e => e.id === record.employeeId);
  const name = emp ? `${emp.firstName} ${emp.lastName}` : `Employee #${record.employeeId}`;

  const empRecords = useMemo(() =>
    attendance.filter(a => a.employeeId === record.employeeId)
      .sort((a, b) => String(b.attendanceDate).localeCompare(String(a.attendanceDate))),
    [attendance, record.employeeId]
  );

  const presentCount  = empRecords.filter(a => a.status === "PRESENT").length;
  const absentCount   = empRecords.filter(a => a.status === "ABSENT").length;
  const lateCount     = empRecords.filter(a => a.lateArrival).length;
  const totalHours    = empRecords.reduce((s, a) => s + (a.workingHours || 0), 0);
  const totalOvertime = empRecords.reduce((s, a) => s + (a.workingHours > 8 ? a.workingHours - 8 : 0), 0);
  const avgHours      = empRecords.length > 0 ? (totalHours / empRecords.length).toFixed(1) : "0.0";
  const attRate       = empRecords.length > 0 ? Math.round((presentCount / empRecords.length) * 100) : 0;

  const empLeaves      = leaves.filter(l => l.employeeId === record.employeeId || Number(l.employeeId) === record.employeeId);
  const pendingLeaves  = empLeaves.filter(l => l.status === "PENDING").length;
  const approvedLeaves = empLeaves.filter(l => l.status === "APPROVED").length;

  const statusColor = { PRESENT: "#059669", ABSENT: "#dc2626", LATE: "#d97706" };
  const statusBg    = { PRESENT: "#d1fae5", ABSENT: "#fee2e2", LATE: "#fef3c7" };

  const downloadReport = () => {
    const rows = [
      ["Date", "Check In", "Check Out", "Working Hours", "Overtime", "Status", "Late"],
      ...empRecords.map(r => {
        const ot = r.workingHours > 8 ? (r.workingHours - 8).toFixed(1) : "";
        const st = r.lateArrival && r.status === "PRESENT" ? "LATE" : r.status;
        return [r.attendanceDate, r.checkInTime || "", r.checkOutTime || "", r.workingHours?.toFixed(1) || "", ot, st, r.lateArrival ? "Yes" : "No"];
      }),
    ];
    const csv  = rows.map(r => r.map(v => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = `attendance_${name.replace(/ /g, "_")}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", zIndex: 1000, backdropFilter: "blur(4px)" }} />
      <div style={{
        position: "fixed", top: 0, right: 0, height: "100vh", width: 500,
        background: "#f8fafc", zIndex: 1001,
        boxShadow: "-16px 0 60px rgba(0,0,0,0.18)",
        display: "flex", flexDirection: "column",
        animation: "slideInRight 0.26s cubic-bezier(0.16,1,0.3,1)",
        overflowY: "auto",
      }}>

        {/* Header */}
        <div style={{ background: "linear-gradient(135deg,#0f172a,#1e3a8a)", padding: "22px 22px 18px", position: "relative", overflow: "hidden", flexShrink: 0 }}>
          <div style={{ position: "absolute", top: -30, right: -30, width: 110, height: 110, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
          <button onClick={onClose} style={{
            position: "absolute", top: 14, right: 14,
            background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: 9, width: 32, height: 32, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", color: "#fff",
            transition: "background 0.15s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
          ><RiCloseLine size={16} /></button>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Avatar name={name} size={48} color="#3b82f6" bg="#dbeafe" />
            <div>
              <div style={{ fontSize: 17, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>{name}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>
                {emp?.employeeCode || `ID #${record.employeeId}`} · {emp?.department || "—"}
              </div>
              <div style={{ display: "flex", gap: 7, marginTop: 7 }}>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 9px", borderRadius: 20, background: "rgba(52,211,153,0.18)", color: "#34d399", border: "1px solid rgba(52,211,153,0.3)" }}>
                  {attRate}% Attendance Rate
                </span>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 9px", borderRadius: 20, background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.75)", border: "1px solid rgba(255,255,255,0.18)" }}>
                  {empRecords.length} Records
                </span>
              </div>
            </div>
          </div>

          {/* Download button */}
          <button onClick={downloadReport} style={{
            marginTop: 14, width: "100%", padding: "8px 0",
            background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: 9, color: "#fff", fontSize: 12, fontWeight: 600,
            cursor: "pointer", fontFamily: "var(--font)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            transition: "background 0.15s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
          >
            <RiDownloadLine size={13} /> Download Attendance Report
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 18 }}>

          {/* Attendance Summary */}
          <section>
            <SecLabel>Attendance Summary</SecLabel>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
              <Pill icon={<RiCheckboxCircleLine size={13} />} label="Present"  value={presentCount}         color="#059669" bg="#d1fae5" />
              <Pill icon={<RiCloseCircleLine size={13} />}    label="Absent"   value={absentCount}          color="#dc2626" bg="#fee2e2" />
              <Pill icon={<RiAlarmWarningLine size={13} />}   label="Late"     value={lateCount}            color="#d97706" bg="#fef3c7" />
              <Pill icon={<RiTimeLine size={13} />}           label="Avg Hrs"  value={`${avgHours}h`}       color="#7c3aed" bg="#ede9fe" />
            </div>
            <div style={{ background: "#f8fafc", borderRadius: 10, padding: "11px 13px", border: "1px solid #f1f5f9" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: "#475569" }}>Attendance Rate</span>
                <span style={{ fontSize: 12.5, fontWeight: 800, color: attRate >= 80 ? "#059669" : "#d97706" }}>{attRate}%</span>
              </div>
              <div style={{ height: 5, borderRadius: 99, background: "#e2e8f0", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${attRate}%`, borderRadius: 99, background: attRate >= 80 ? "linear-gradient(90deg,#059669,#34d399)" : "linear-gradient(90deg,#d97706,#fbbf24)", transition: "width 0.6s ease" }} />
              </div>
            </div>
          </section>

          {/* Working Hours & Overtime */}
          <section>
            <SecLabel>Working Hours & Overtime</SecLabel>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ flex: 1, background: "#f0fdf4", borderRadius: 10, padding: "12px 14px", border: "1px solid #a7f3d0" }}>
                <div style={{ fontSize: 9.5, fontWeight: 700, color: "#059669", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>Total Hours</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#059669" }}>{totalHours.toFixed(1)}h</div>
              </div>
              <div style={{ flex: 1, background: "#faf5ff", borderRadius: 10, padding: "12px 14px", border: "1px solid #ddd6fe" }}>
                <div style={{ fontSize: 9.5, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>Total Overtime</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#7c3aed" }}>{totalOvertime.toFixed(1)}h</div>
              </div>
              <div style={{ flex: 1, background: "#eff6ff", borderRadius: 10, padding: "12px 14px", border: "1px solid #bfdbfe" }}>
                <div style={{ fontSize: 9.5, fontWeight: 700, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>Avg / Day</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#2563eb" }}>{avgHours}h</div>
              </div>
            </div>
          </section>

          {/* Leave Summary */}
          <section>
            <SecLabel>Leave History</SecLabel>
            {empLeaves.length === 0
              ? <div style={{ padding: "12px 14px", borderRadius: 10, background: "#f8fafc", border: "1px solid #f1f5f9", fontSize: 12, color: "#94a3b8", textAlign: "center" }}>No leave requests</div>
              : <div style={{ display: "flex", gap: 8 }}>
                  <Pill icon={<RiCalendarCheckLine size={13} />} label="Total"    value={empLeaves.length} color="#2563eb" bg="#dbeafe" />
                  <Pill icon={<RiTimeLine size={13} />}          label="Pending"  value={pendingLeaves}    color="#d97706" bg="#fef3c7" />
                  <Pill icon={<RiCheckboxCircleLine size={13} />} label="Approved" value={approvedLeaves}  color="#059669" bg="#d1fae5" />
                </div>
            }
          </section>

          {/* Attendance History */}
          <section>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <SecLabel>Attendance History</SecLabel>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#2563eb", background: "#dbeafe", padding: "2px 8px", borderRadius: 20, marginBottom: 10 }}>{empRecords.length}</span>
            </div>
            {empRecords.length === 0
              ? <div style={{ padding: 16, borderRadius: 10, background: "#f8fafc", border: "1px solid #f1f5f9", fontSize: 12, color: "#94a3b8", textAlign: "center" }}>No records found</div>
              : <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 300, overflowY: "auto" }}>
                  {empRecords.map(r => {
                    const st = r.lateArrival && r.status === "PRESENT" ? "LATE" : r.status;
                    const sc = statusColor[st] || "#64748b";
                    const sb = statusBg[st]    || "#f1f5f9";
                    return (
                      <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 11px", borderRadius: 10, background: "#fff", border: "1px solid #f1f5f9", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
                        <div style={{ width: 32, height: 32, borderRadius: 9, background: sb, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <RiCalendarCheckLine size={14} color={sc} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>{String(r.attendanceDate)}</div>
                          <div style={{ display: "flex", gap: 7, marginTop: 2, flexWrap: "wrap" }}>
                            {r.checkInTime  && <span style={{ fontSize: 10.5, color: "#059669", display: "flex", alignItems: "center", gap: 2 }}><RiLoginBoxLine size={9} /> {r.checkInTime}</span>}
                            {r.checkOutTime && <span style={{ fontSize: 10.5, color: "#0891b2", display: "flex", alignItems: "center", gap: 2 }}><RiLogoutBoxLine size={9} /> {r.checkOutTime}</span>}
                            {r.workingHours && <span style={{ fontSize: 10.5, color: "#7c3aed", display: "flex", alignItems: "center", gap: 2 }}><RiTimeLine size={9} /> {r.workingHours.toFixed(1)}h</span>}
                          </div>
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, color: sc, background: sb, border: `1px solid ${sc}22`, flexShrink: 0 }}>{st}</span>
                      </div>
                    );
                  })}
                </div>
            }
          </section>
        </div>
      </div>
    </>
  );
}
