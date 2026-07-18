import { RiEyeLine, RiCheckLine, RiCloseLine, RiDeleteBinLine, RiUserLine } from "react-icons/ri";
import { Avatar, EmptyState } from "../../styles/ui.jsx";

const COLS = ["Employee", "Code", "Department", "Leave Type", "Start", "End", "Days", "Reason", "Applied", "Status", "Actions"];

const STATUS_MAP = {
  PENDING:  { color: "#d97706", bg: "#fef3c7", border: "#fde68a" },
  APPROVED: { color: "#059669", bg: "#d1fae5", border: "#a7f3d0" },
  REJECTED: { color: "#dc2626", bg: "#fee2e2", border: "#fecaca" },
};

const TYPE_MAP = {
  CASUAL_LEAVE:   { color: "#d97706", bg: "#fef3c7" },
  SICK_LEAVE:     { color: "#dc2626", bg: "#fee2e2" },
  EARNED_LEAVE:   { color: "#2563eb", bg: "#dbeafe" },
  COMP_OFF:       { color: "#7c3aed", bg: "#ede9fe" },
  WORK_FROM_HOME: { color: "#0891b2", bg: "#cffafe" },
  LOSS_OF_PAY:    { color: "#64748b", bg: "#f1f5f9" },
};

const cell = { padding: "11px 13px", borderBottom: "1px solid #f1f5f9", verticalAlign: "middle" };

export default function LeaveTable({ records, employees, loading, onView, onApprove, onReject, onDelete }) {
  const getEmp = id => employees.find(e => e.id === id || e.id === Number(id));

  return (
    <div style={{
      background: "#fff", borderRadius: 16,
      border: "1px solid #e2e8f0", boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
      overflow: "hidden", marginBottom: 20,
    }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
          <thead>
            <tr>
              {COLS.map((h, i) => (
                <th key={i} style={{
                  padding: "10px 13px", textAlign: "left",
                  fontSize: 10, fontWeight: 800, color: "#64748b",
                  textTransform: "uppercase", letterSpacing: "0.07em",
                  background: "linear-gradient(180deg,#f8fafc,#f1f5f9)",
                  borderBottom: "1.5px solid #e2e8f0", whiteSpace: "nowrap",
                  ...(i === COLS.length - 1 ? { textAlign: "center", width: 120 } : {}),
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(6)].map((_, i) => (
                <tr key={i}>
                  {COLS.map((_, j) => (
                    <td key={j} style={cell}>
                      <div className="skeleton" style={{ height: 12, borderRadius: 5, width: j === 0 ? 130 : j === 3 ? 90 : 65 }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : records.length === 0 ? (
              <tr><td colSpan={COLS.length}>
                <EmptyState icon="📋" title="No Leave Requests Found" subtitle="Adjust your filters or check back later" />
              </td></tr>
            ) : records.map(lv => {
              const emp = getEmp(lv.employeeId);
              const name = emp ? `${emp.firstName} ${emp.lastName}` : `Employee #${lv.employeeId}`;
              const sc  = STATUS_MAP[lv.status] || STATUS_MAP.PENDING;
              const tc  = TYPE_MAP[lv.leaveType] || { color: "#64748b", bg: "#f1f5f9" };
              const days = lv.totalDays ?? (lv.startDate && lv.endDate
                ? Math.max(1, Math.round((new Date(lv.endDate) - new Date(lv.startDate)) / 86400000) + 1)
                : "—");

              return (
                <tr key={lv.id}
                  style={{ transition: "background 0.1s", cursor: "default" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#faf5ff"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  {/* Employee */}
                  <td style={{ ...cell, minWidth: 170 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      {emp
                        ? <Avatar name={name} size={30} color="#7c3aed" bg="#ede9fe" />
                        : <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}><RiUserLine size={12} color="#94a3b8" /></div>
                      }
                      <div>
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: "#0f172a", lineHeight: 1.3 }}>{name}</div>
                        <div style={{ fontSize: 10.5, color: "#94a3b8" }}>{emp?.designation || emp?.department || "—"}</div>
                      </div>
                    </div>
                  </td>

                  {/* Code */}
                  <td style={cell}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#475569", background: "#f1f5f9", padding: "2px 7px", borderRadius: 5 }}>
                      {emp?.employeeCode || `#${lv.employeeId}`}
                    </span>
                  </td>

                  {/* Department */}
                  <td style={cell}>
                    <span style={{ fontSize: 11.5, color: "#475569" }}>{emp?.department || "—"}</span>
                  </td>

                  {/* Leave Type */}
                  <td style={cell}>
                    <span style={{
                      fontSize: 10.5, fontWeight: 700, padding: "3px 9px", borderRadius: 20,
                      color: tc.color, background: tc.bg, border: `1px solid ${tc.color}22`,
                      whiteSpace: "nowrap",
                    }}>
                      {(lv.leaveType || "").replace(/_/g, " ")}
                    </span>
                  </td>

                  {/* Start */}
                  <td style={cell}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: "#0f172a" }}>{String(lv.startDate)}</span>
                  </td>

                  {/* End */}
                  <td style={cell}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: "#0f172a" }}>{String(lv.endDate)}</span>
                  </td>

                  {/* Days */}
                  <td style={cell}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: "#7c3aed", background: "#ede9fe", padding: "2px 9px", borderRadius: 7 }}>
                      {days}d
                    </span>
                  </td>

                  {/* Reason */}
                  <td style={{ ...cell, maxWidth: 160 }}>
                    <span style={{ fontSize: 11.5, color: lv.reason ? "#475569" : "#cbd5e1", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {lv.reason || "—"}
                    </span>
                  </td>

                  {/* Applied Date */}
                  <td style={cell}>
                    <span style={{ fontSize: 11.5, color: "#64748b" }}>{lv.appliedDate ? String(lv.appliedDate) : "—"}</span>
                  </td>

                  {/* Status */}
                  <td style={cell}>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      padding: "3px 10px", borderRadius: 20, fontSize: 10.5, fontWeight: 700,
                      color: sc.color, background: sc.bg, border: `1px solid ${sc.border}`,
                    }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: sc.color, display: "inline-block" }} />
                      {lv.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td style={{ ...cell, textAlign: "center" }}>
                    <div style={{ display: "inline-flex", gap: 4 }}>
                      {/* View */}
                      <button onClick={() => onView(lv)} style={{
                        width: 26, height: 26, borderRadius: 7,
                        background: "#eff6ff", border: "1px solid #bfdbfe", color: "#2563eb",
                        cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s",
                      }}
                        onMouseEnter={e => { e.currentTarget.style.background = "#dbeafe"; e.currentTarget.style.transform = "scale(1.1)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "#eff6ff"; e.currentTarget.style.transform = "scale(1)"; }}
                        title="View Details"
                      ><RiEyeLine size={11} /></button>

                      {/* Approve — only for PENDING */}
                      {lv.status === "PENDING" && (
                        <button onClick={() => onApprove(lv)} style={{
                          width: 26, height: 26, borderRadius: 7,
                          background: "#f0fdf4", border: "1px solid #a7f3d0", color: "#059669",
                          cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s",
                        }}
                          onMouseEnter={e => { e.currentTarget.style.background = "#dcfce7"; e.currentTarget.style.transform = "scale(1.1)"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "#f0fdf4"; e.currentTarget.style.transform = "scale(1)"; }}
                          title="Approve"
                        ><RiCheckLine size={11} /></button>
                      )}

                      {/* Reject — only for PENDING */}
                      {lv.status === "PENDING" && (
                        <button onClick={() => onReject(lv)} style={{
                          width: 26, height: 26, borderRadius: 7,
                          background: "#fff5f5", border: "1px solid #fecaca", color: "#dc2626",
                          cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s",
                        }}
                          onMouseEnter={e => { e.currentTarget.style.background = "#fee2e2"; e.currentTarget.style.transform = "scale(1.1)"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "#fff5f5"; e.currentTarget.style.transform = "scale(1)"; }}
                          title="Reject"
                        ><RiCloseLine size={11} /></button>
                      )}

                      {/* Delete */}
                      <button onClick={() => onDelete(lv.id)} style={{
                        width: 26, height: 26, borderRadius: 7,
                        background: "#fafafa", border: "1px solid #e2e8f0", color: "#94a3b8",
                        cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s",
                      }}
                        onMouseEnter={e => { e.currentTarget.style.background = "#fee2e2"; e.currentTarget.style.borderColor = "#fecaca"; e.currentTarget.style.color = "#dc2626"; e.currentTarget.style.transform = "scale(1.1)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "#fafafa"; e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.transform = "scale(1)"; }}
                        title="Delete"
                      ><RiDeleteBinLine size={11} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {records.length > 0 && !loading && (
        <div style={{ padding: "9px 16px", borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fafafa" }}>
          <span style={{ fontSize: 11.5, color: "#94a3b8" }}>
            <span style={{ fontWeight: 700, color: "#475569" }}>{records.length}</span> requests shown
          </span>
          <span style={{ fontSize: 11.5, color: "#94a3b8" }}>
            Pending: <b style={{ color: "#d97706" }}>{records.filter(l => l.status === "PENDING").length}</b>
            {" · "}Approved: <b style={{ color: "#059669" }}>{records.filter(l => l.status === "APPROVED").length}</b>
            {" · "}Rejected: <b style={{ color: "#dc2626" }}>{records.filter(l => l.status === "REJECTED").length}</b>
          </span>
        </div>
      )}
    </div>
  );
}
