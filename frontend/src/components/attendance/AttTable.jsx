import {
  RiLoginBoxLine, RiLogoutBoxLine, RiUserLine,
  RiEyeLine, RiDeleteBinLine, RiTimeLine, RiEditLine,
} from "react-icons/ri";
import { Avatar, EmptyState } from "../../styles/ui.jsx";

const COLS = ["Employee", "Code", "Department", "Shift", "Check In", "Check Out", "Hours", "Overtime", "Status", "Punctuality", "Date", "Actions"];

const STATUS_MAP = {
  PRESENT:  { color: "#059669", bg: "#d1fae5", border: "#a7f3d0" },
  ABSENT:   { color: "#dc2626", bg: "#fee2e2", border: "#fecaca" },
  LATE:     { color: "#d97706", bg: "#fef3c7", border: "#fde68a" },
  HALF_DAY: { color: "#7c3aed", bg: "#ede9fe", border: "#ddd6fe" },
  LEAVE:    { color: "#0891b2", bg: "#cffafe", border: "#a5f3fc" },
};

function deriveShift(checkInTime) {
  if (!checkInTime) return null;
  const [h] = checkInTime.split(":").map(Number);
  if (h < 12) return { label: "Morning", color: "#d97706", bg: "#fef3c7" };
  if (h < 17) return { label: "Afternoon", color: "#0891b2", bg: "#cffafe" };
  return { label: "Evening", color: "#7c3aed", bg: "#ede9fe" };
}

const cell = { padding: "11px 13px", borderBottom: "1px solid #f1f5f9", verticalAlign: "middle" };

export default function AttTable({ records, employees, loading, onView, onDelete }) {
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
                  ...(i === COLS.length - 1 ? { textAlign: "center", width: 90 } : {}),
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(7)].map((_, i) => (
                <tr key={i}>
                  {COLS.map((_, j) => (
                    <td key={j} style={cell}>
                      <div className="skeleton" style={{ height: 12, borderRadius: 5, width: j === 0 ? 130 : j === 2 ? 80 : 60 }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : records.length === 0 ? (
              <tr><td colSpan={COLS.length}>
                <EmptyState icon="🕐" title="No Attendance Records Found" subtitle="Adjust your filters or check back later" />
              </td></tr>
            ) : records.map(att => {
              const emp    = employees.find(e => e.id === att.employeeId);
              const name   = emp ? `${emp.firstName} ${emp.lastName}` : `Employee #${att.employeeId}`;
              const effSt  = att.lateArrival && att.status === "PRESENT" ? "LATE" : att.status;
              const st     = STATUS_MAP[effSt] || { color: "#64748b", bg: "#f1f5f9", border: "#e2e8f0" };
              const hoursOk = (att.workingHours || 0) >= 8;
              const overtime = att.workingHours > 8 ? (att.workingHours - 8).toFixed(1) : null;
              const shift  = deriveShift(att.checkInTime);

              return (
                <tr key={att.id}
                  style={{ transition: "background 0.1s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f8faff"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  {/* Employee photo + name */}
                  <td style={{ ...cell, minWidth: 170 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      {emp
                        ? <Avatar name={name} size={30} />
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
                      {emp?.employeeCode || `#${att.employeeId}`}
                    </span>
                  </td>

                  {/* Department */}
                  <td style={cell}>
                    <span style={{ fontSize: 11.5, color: "#475569" }}>{emp?.department || "—"}</span>
                  </td>

                  {/* Shift */}
                  <td style={cell}>
                    {shift
                      ? <span style={{ fontSize: 11, fontWeight: 600, color: shift.color, background: shift.bg, padding: "2px 8px", borderRadius: 6 }}>{shift.label}</span>
                      : <span style={{ color: "#cbd5e1", fontSize: 12 }}>—</span>
                    }
                  </td>

                  {/* Check In */}
                  <td style={cell}>
                    {att.checkInTime
                      ? <span style={{ display: "inline-flex", alignItems: "center", gap: 3, color: "#059669", fontWeight: 600, fontSize: 12, background: "#ecfdf5", padding: "2px 8px", borderRadius: 6, border: "1px solid #a7f3d0" }}>
                          <RiLoginBoxLine size={10} /> {att.checkInTime}
                        </span>
                      : <span style={{ color: "#cbd5e1" }}>—</span>
                    }
                  </td>

                  {/* Check Out */}
                  <td style={cell}>
                    {att.checkOutTime
                      ? <span style={{ display: "inline-flex", alignItems: "center", gap: 3, color: "#0891b2", fontWeight: 600, fontSize: 12, background: "#ecfeff", padding: "2px 8px", borderRadius: 6, border: "1px solid #a5f3fc" }}>
                          <RiLogoutBoxLine size={10} /> {att.checkOutTime}
                        </span>
                      : <span style={{ color: "#cbd5e1" }}>—</span>
                    }
                  </td>

                  {/* Working Hours */}
                  <td style={{ ...cell, minWidth: 90 }}>
                    {att.workingHours ? (
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
                          <RiTimeLine size={10} color={hoursOk ? "#059669" : "#d97706"} />
                          <span style={{ fontWeight: 700, fontSize: 12, color: hoursOk ? "#059669" : "#d97706" }}>{att.workingHours.toFixed(1)}h</span>
                          <span style={{ fontSize: 9.5, color: "#94a3b8" }}>/ 8h</span>
                        </div>
                        <div style={{ height: 3, borderRadius: 99, background: "#f1f5f9", width: 52, overflow: "hidden" }}>
                          <div style={{ height: "100%", borderRadius: 99, width: `${Math.min((att.workingHours / 8) * 100, 100)}%`, background: hoursOk ? "#059669" : "#f59e0b" }} />
                        </div>
                      </div>
                    ) : <span style={{ color: "#cbd5e1" }}>—</span>}
                  </td>

                  {/* Overtime */}
                  <td style={cell}>
                    {overtime
                      ? <span style={{ fontSize: 11.5, fontWeight: 700, color: "#7c3aed", background: "#ede9fe", padding: "2px 8px", borderRadius: 6, border: "1px solid #ddd6fe" }}>+{overtime}h</span>
                      : <span style={{ color: "#cbd5e1" }}>—</span>
                    }
                  </td>

                  {/* Status */}
                  <td style={cell}>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      padding: "3px 9px", borderRadius: 20, fontSize: 10.5, fontWeight: 700,
                      color: st.color, background: st.bg, border: `1px solid ${st.border}`,
                    }}>
                      <span style={{ width: 4, height: 4, borderRadius: "50%", background: st.color, display: "inline-block" }} />
                      {effSt}
                    </span>
                  </td>

                  {/* Punctuality */}
                  <td style={cell}>
                    {att.status === "ABSENT" || !att.checkInTime
                      ? <span style={{ color: "#cbd5e1" }}>—</span>
                      : <span style={{
                          display: "inline-flex", alignItems: "center", gap: 3,
                          padding: "3px 9px", borderRadius: 20, fontSize: 10.5, fontWeight: 700,
                          color: att.lateArrival ? "#d97706" : "#059669",
                          background: att.lateArrival ? "#fef3c7" : "#d1fae5",
                          border: `1px solid ${att.lateArrival ? "#fde68a" : "#a7f3d0"}`,
                        }}>
                          {att.lateArrival ? "⚠ Late" : "✓ On Time"}
                        </span>
                    }
                  </td>

                  {/* Date (Last Updated) */}
                  <td style={cell}>
                    <span style={{ fontSize: 11.5, color: "#64748b", fontWeight: 500 }}>{String(att.attendanceDate)}</span>
                  </td>

                  {/* Actions */}
                  <td style={{ ...cell, textAlign: "center" }}>
                    <div style={{ display: "inline-flex", gap: 4 }}>
                      <button onClick={() => onView(att)} style={{
                        width: 26, height: 26, borderRadius: 7,
                        background: "#eff6ff", border: "1px solid #bfdbfe",
                        color: "#2563eb", cursor: "pointer",
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.15s",
                      }}
                        onMouseEnter={e => { e.currentTarget.style.background = "#dbeafe"; e.currentTarget.style.transform = "scale(1.1)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "#eff6ff"; e.currentTarget.style.transform = "scale(1)"; }}
                        title="View Details"
                      ><RiEyeLine size={11} /></button>

                      <button onClick={() => onView(att)} style={{
                        width: 26, height: 26, borderRadius: 7,
                        background: "#fefce8", border: "1px solid #fde68a",
                        color: "#d97706", cursor: "pointer",
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.15s",
                      }}
                        onMouseEnter={e => { e.currentTarget.style.background = "#fef9c3"; e.currentTarget.style.transform = "scale(1.1)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "#fefce8"; e.currentTarget.style.transform = "scale(1)"; }}
                        title="Edit / Correct"
                      ><RiEditLine size={11} /></button>

                      <button onClick={() => onDelete(att.id)} style={{
                        width: 26, height: 26, borderRadius: 7,
                        background: "#fff5f5", border: "1px solid #fecaca",
                        color: "#dc2626", cursor: "pointer",
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.15s",
                      }}
                        onMouseEnter={e => { e.currentTarget.style.background = "#fee2e2"; e.currentTarget.style.transform = "scale(1.1)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "#fff5f5"; e.currentTarget.style.transform = "scale(1)"; }}
                        title="Delete Record"
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
            <span style={{ fontWeight: 700, color: "#475569" }}>{records.length}</span> records
          </span>
          <span style={{ fontSize: 11.5, color: "#94a3b8" }}>
            Present: <b style={{ color: "#059669" }}>{records.filter(a => a.status === "PRESENT").length}</b>
            {" · "}Absent: <b style={{ color: "#dc2626" }}>{records.filter(a => a.status === "ABSENT").length}</b>
            {" · "}Late: <b style={{ color: "#d97706" }}>{records.filter(a => a.lateArrival).length}</b>
          </span>
        </div>
      )}
    </div>
  );
}
