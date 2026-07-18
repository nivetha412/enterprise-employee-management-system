import { useState, useMemo } from "react";
import {
  RiCloseLine, RiCheckLine, RiTimeLine, RiCalendarCheckLine,
  RiUserLine, RiMapPinLine, RiDownloadLine,
} from "react-icons/ri";
import { Avatar } from "../../styles/ui.jsx";

const STATUS_MAP = {
  PENDING:  { color: "#d97706", bg: "#fef3c7", border: "#fde68a" },
  APPROVED: { color: "#059669", bg: "#d1fae5", border: "#a7f3d0" },
  REJECTED: { color: "#dc2626", bg: "#fee2e2", border: "#fecaca" },
};

const TYPE_COLORS = {
  CASUAL_LEAVE:   "#d97706",
  SICK_LEAVE:     "#dc2626",
  EARNED_LEAVE:   "#2563eb",
  COMP_OFF:       "#7c3aed",
  WORK_FROM_HOME: "#0891b2",
  LOSS_OF_PAY:    "#64748b",
};

function InfoRow({ icon, label, value }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10, background: "#f8fafc", border: "1px solid #f1f5f9", marginBottom: 7 }}>
      <div style={{ width: 28, height: 28, borderRadius: 8, background: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#7c3aed" }}>{icon}</div>
      <div>
        <div style={{ fontSize: 9.5, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</div>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: value ? "#0f172a" : "#94a3b8", marginTop: 1 }}>{value || "—"}</div>
      </div>
    </div>
  );
}

function SecLabel({ children }) {
  return <div style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>{children}</div>;
}

export default function LeaveDetailModal({ leave, employees, allLeaves, onClose, onApprove, onReject }) {
  const [remarks, setRemarks] = useState("");
  const [acting, setActing]   = useState(false);

  if (!leave) return null;

  const emp  = employees.find(e => e.id === leave.employeeId || e.id === Number(leave.employeeId));
  const name = emp ? `${emp.firstName} ${emp.lastName}` : `Employee #${leave.employeeId}`;
  const sc   = STATUS_MAP[leave.status] || STATUS_MAP.PENDING;
  const tc   = TYPE_COLORS[leave.leaveType] || "#64748b";

  const days = leave.totalDays ?? (leave.startDate && leave.endDate
    ? Math.max(1, Math.round((new Date(leave.endDate) - new Date(leave.startDate)) / 86400000) + 1)
    : "—");

  // Leave history for this employee
  const history = useMemo(() =>
    allLeaves
      .filter(l => (l.employeeId === leave.employeeId || Number(l.employeeId) === leave.employeeId) && l.id !== leave.id)
      .sort((a, b) => String(b.appliedDate || b.startDate || "").localeCompare(String(a.appliedDate || a.startDate || ""))),
    [allLeaves, leave.employeeId, leave.id]
  );

  // Leave balance summary (from history)
  const approvedDays = allLeaves
    .filter(l => (l.employeeId === leave.employeeId || Number(l.employeeId) === leave.employeeId) && l.status === "APPROVED")
    .reduce((s, l) => s + (l.totalDays || 1), 0);

  const handleApprove = async () => {
    setActing(true);
    await onApprove(leave, remarks);
    setActing(false);
    setRemarks("");
  };

  const handleReject = async () => {
    setActing(true);
    await onReject(leave, remarks);
    setActing(false);
    setRemarks("");
  };

  const downloadReport = () => {
    const rows = [
      ["Leave ID", "Employee", "Code", "Department", "Leave Type", "Start Date", "End Date", "Days", "Reason", "Status", "Applied Date", "Manager Remarks"],
      [
        leave.id,
        name,
        emp?.employeeCode || "",
        emp?.department || "",
        (leave.leaveType || "").replace(/_/g, " "),
        leave.startDate,
        leave.endDate,
        days,
        leave.reason || "",
        leave.status,
        leave.appliedDate || "",
        leave.managerRemarks || "",
      ],
    ];
    const csv  = rows.map(r => r.map(v => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = `leave_${leave.id}_${name.replace(/ /g, "_")}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", zIndex: 1000, backdropFilter: "blur(4px)" }} />
      <div style={{
        position: "fixed", top: 0, right: 0, height: "100vh", width: 520,
        background: "#f8fafc", zIndex: 1001,
        boxShadow: "-16px 0 60px rgba(0,0,0,0.18)",
        display: "flex", flexDirection: "column",
        animation: "slideInRight 0.26s cubic-bezier(0.16,1,0.3,1)",
        overflowY: "auto",
      }}>

        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg,#0f172a,#4c1d95)",
          padding: "22px 22px 18px", position: "relative", overflow: "hidden", flexShrink: 0,
        }}>
          <div style={{ position: "absolute", top: -30, right: -30, width: 110, height: 110, borderRadius: "50%", background: "rgba(167,139,250,0.1)", pointerEvents: "none" }} />
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
            <Avatar name={name} size={48} color="#7c3aed" bg="#ede9fe" />
            <div>
              <div style={{ fontSize: 17, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>{name}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>
                {emp?.employeeCode || `ID #${leave.employeeId}`} · {emp?.department || "—"}
              </div>
              <div style={{ display: "flex", gap: 7, marginTop: 7 }}>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 9px", borderRadius: 20, background: sc.bg + "33", color: sc.color === "#d97706" ? "#fbbf24" : sc.color === "#059669" ? "#34d399" : "#fca5a5", border: `1px solid ${sc.color}44` }}>
                  ● {leave.status}
                </span>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 9px", borderRadius: 20, background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.75)", border: "1px solid rgba(255,255,255,0.18)" }}>
                  {days} day{days !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>

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
            <RiDownloadLine size={13} /> Download Leave Report
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 18 }}>

          {/* Leave Details */}
          <section>
            <SecLabel>Leave Details</SecLabel>
            <InfoRow icon={<RiCalendarCheckLine size={13} />} label="Leave Type"  value={(leave.leaveType || "").replace(/_/g, " ")} />
            <InfoRow icon={<RiTimeLine size={13} />}          label="Duration"    value={`${String(leave.startDate)} → ${String(leave.endDate)} (${days} days)`} />
            <InfoRow icon={<RiUserLine size={13} />}          label="Priority"    value={leave.priority || "—"} />
            <InfoRow icon={<RiMapPinLine size={13} />}        label="Applied On"  value={leave.appliedDate ? String(leave.appliedDate) : "—"} />
            {leave.reason && (
              <div style={{ padding: "10px 12px", borderRadius: 10, background: "#f8fafc", border: "1px solid #f1f5f9", fontSize: 12.5, color: "#475569", lineHeight: 1.5 }}>
                <div style={{ fontSize: 9.5, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Reason</div>
                {leave.reason}
              </div>
            )}
          </section>

          {/* Leave Balance */}
          <section>
            <SecLabel>Leave Balance Summary</SecLabel>
            <div style={{ display: "flex", gap: 8 }}>
              {[
                { label: "Total Taken",  value: approvedDays,    color: "#7c3aed", bg: "#ede9fe" },
                { label: "This Request", value: `${days}d`,      color: "#d97706", bg: "#fef3c7" },
                { label: "History",      value: `${history.length} req`, color: "#2563eb", bg: "#dbeafe" },
              ].map(item => (
                <div key={item.label} style={{ flex: 1, background: item.bg, borderRadius: 10, padding: "10px 12px", border: `1px solid ${item.color}22` }}>
                  <div style={{ fontSize: 9.5, fontWeight: 700, color: item.color, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>{item.label}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: item.color }}>{item.value}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Manager / HR Remarks */}
          {(leave.managerRemarks || leave.hrRemarks) && (
            <section>
              <SecLabel>Manager Comments</SecLabel>
              {leave.managerRemarks && (
                <div style={{ padding: "10px 12px", borderRadius: 10, background: "#f0fdf4", border: "1px solid #a7f3d0", fontSize: 12.5, color: "#065f46", marginBottom: 7 }}>
                  <div style={{ fontSize: 9.5, fontWeight: 700, color: "#059669", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Manager Remarks</div>
                  {leave.managerRemarks}
                </div>
              )}
              {leave.hrRemarks && (
                <div style={{ padding: "10px 12px", borderRadius: 10, background: "#eff6ff", border: "1px solid #bfdbfe", fontSize: 12.5, color: "#1e40af" }}>
                  <div style={{ fontSize: 9.5, fontWeight: 700, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>HR Remarks</div>
                  {leave.hrRemarks}
                </div>
              )}
            </section>
          )}

          {/* Approve / Reject with Remarks */}
          {leave.status === "PENDING" && (
            <section>
              <SecLabel>Take Action</SecLabel>
              <textarea
                style={{
                  width: "100%", padding: "9px 12px",
                  border: "1.5px solid #e2e8f0", borderRadius: 10,
                  fontSize: 12.5, outline: "none", color: "#0f172a",
                  background: "#fff", fontFamily: "var(--font)",
                  resize: "vertical", minHeight: 72, boxSizing: "border-box",
                  transition: "border-color 0.15s",
                  marginBottom: 10,
                }}
                placeholder="Add remarks (optional)…"
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
                onFocus={e => e.target.style.borderColor = "#7c3aed"}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"}
              />
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={handleApprove} disabled={acting} style={{
                  flex: 1, padding: "10px 0",
                  background: "linear-gradient(135deg,#059669,#047857)",
                  color: "#fff", border: "none", borderRadius: 10,
                  fontSize: 13, fontWeight: 700, cursor: acting ? "not-allowed" : "pointer",
                  fontFamily: "var(--font)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  boxShadow: "0 3px 10px rgba(5,150,105,0.3)", transition: "all 0.15s",
                  opacity: acting ? 0.7 : 1,
                }}>
                  <RiCheckLine size={14} /> {acting ? "Processing…" : "Approve"}
                </button>
                <button onClick={handleReject} disabled={acting} style={{
                  flex: 1, padding: "10px 0",
                  background: "linear-gradient(135deg,#dc2626,#b91c1c)",
                  color: "#fff", border: "none", borderRadius: 10,
                  fontSize: 13, fontWeight: 700, cursor: acting ? "not-allowed" : "pointer",
                  fontFamily: "var(--font)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  boxShadow: "0 3px 10px rgba(220,38,38,0.3)", transition: "all 0.15s",
                  opacity: acting ? 0.7 : 1,
                }}>
                  <RiCloseLine size={14} /> {acting ? "Processing…" : "Reject"}
                </button>
              </div>
            </section>
          )}

          {/* Leave History */}
          <section>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <SecLabel>Leave History</SecLabel>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", background: "#ede9fe", padding: "2px 8px", borderRadius: 20, marginBottom: 10 }}>{history.length}</span>
            </div>
            {history.length === 0
              ? <div style={{ padding: "14px", borderRadius: 10, background: "#f8fafc", border: "1px solid #f1f5f9", fontSize: 12, color: "#94a3b8", textAlign: "center" }}>No previous leave requests</div>
              : <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 260, overflowY: "auto" }}>
                  {history.map(l => {
                    const hsc = STATUS_MAP[l.status] || STATUS_MAP.PENDING;
                    const htc = TYPE_COLORS[l.leaveType] || "#64748b";
                    const hd  = l.totalDays ?? "—";
                    return (
                      <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 11px", borderRadius: 10, background: "#fff", border: "1px solid #f1f5f9", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
                        <div style={{ width: 32, height: 32, borderRadius: 9, background: htc + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <RiCalendarCheckLine size={14} color={htc} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>{(l.leaveType || "").replace(/_/g, " ")}</div>
                          <div style={{ fontSize: 10.5, color: "#64748b", marginTop: 1 }}>{String(l.startDate)} → {String(l.endDate)} · {hd}d</div>
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, color: hsc.color, background: hsc.bg, border: `1px solid ${hsc.border}`, flexShrink: 0 }}>
                          {l.status}
                        </span>
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
