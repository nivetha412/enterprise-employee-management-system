import { RiCloseLine, RiBuilding2Line, RiTeamLine, RiMapPinLine, RiUserStarLine, RiCalendarLine, RiHashtag, RiEditLine, RiDeleteBinLine, RiCheckboxCircleLine, RiCloseCircleLine, RiTimeLine, RiCalendarCheckLine } from "react-icons/ri";

const PALETTE = [
  { accent: "#2563eb", light: "#dbeafe" },
  { accent: "#7c3aed", light: "#ede9fe" },
  { accent: "#059669", light: "#d1fae5" },
  { accent: "#d97706", light: "#fef3c7" },
  { accent: "#0891b2", light: "#cffafe" },
  { accent: "#dc2626", light: "#fee2e2" },
  { accent: "#0d9488", light: "#ccfbf1" },
  { accent: "#ea580c", light: "#ffedd5" },
];

function initials(first, last) {
  return `${(first || "?")[0]}${(last || "")[0] || ""}`.toUpperCase();
}

function InfoRow({ icon, label, value, accent }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 12, background: "#f8fafc", border: "1px solid #f1f5f9", marginBottom: 8 }}>
      <div style={{ width: 32, height: 32, borderRadius: 9, background: accent + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: accent }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: value ? "#0f172a" : "#94a3b8", marginTop: 1 }}>{value || "—"}</div>
      </div>
    </div>
  );
}

function StatPill({ icon, label, value, color, bg }) {
  return (
    <div style={{ flex: "1 1 100px", background: bg, borderRadius: 12, padding: "12px 14px", border: `1px solid ${color}22` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
        <span style={{ color }}>{icon}</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
    </div>
  );
}

export default function DeptViewModal({ dept, deptEmployees, attendance, leaves, onClose, onEdit, onDelete }) {
  if (!dept) return null;

  const deptIdx = 0;
  const p = PALETTE[deptIdx % PALETTE.length];
  const isActive = dept.active !== false;

  // Attendance stats for this department's employees
  const empIds = new Set(deptEmployees.map(e => e.id));
  const deptAtt = attendance.filter(a => empIds.has(a.employeeId));
  const presentCount = deptAtt.filter(a => a.status === "PRESENT").length;
  const absentCount  = deptAtt.filter(a => a.status === "ABSENT").length;
  const lateCount    = deptAtt.filter(a => a.lateArrival).length;
  const attRate      = deptAtt.length > 0 ? Math.round((presentCount / deptAtt.length) * 100) : null;

  // Leave stats for this department
  const deptLeaves   = leaves.filter(l => empIds.has(l.employeeId) || empIds.has(Number(l.employeeId)));
  const pendingLeaves  = deptLeaves.filter(l => l.status === "PENDING").length;
  const approvedLeaves = deptLeaves.filter(l => l.status === "APPROVED").length;

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", zIndex: 1000, backdropFilter: "blur(4px)" }} />

      {/* Drawer */}
      <div style={{
        position: "fixed", top: 0, right: 0, height: "100vh", width: 520,
        background: "#f8fafc", zIndex: 1001,
        boxShadow: "-16px 0 60px rgba(0,0,0,0.2)",
        display: "flex", flexDirection: "column",
        animation: "slideInRight 0.28s cubic-bezier(0.16,1,0.3,1)",
        overflowY: "auto",
      }}>

        {/* Gradient header */}
        <div style={{
          background: `linear-gradient(135deg, #0f172a, ${p.accent}dd)`,
          padding: "24px 24px 20px",
          position: "relative", overflow: "hidden", flexShrink: 0,
        }}>
          <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -20, right: 80, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />

          {/* Close */}
          <button onClick={onClose} style={{
            position: "absolute", top: 16, right: 16,
            background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 10, width: 34, height: 34, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", color: "#fff",
            transition: "background 0.15s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.22)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
          >
            <RiCloseLine size={17} />
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: "rgba(255,255,255,0.15)", backdropFilter: "blur(4px)",
              border: "1px solid rgba(255,255,255,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <RiBuilding2Line size={26} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 19, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>{dept.departmentName}</div>
              {dept.departmentCode && (
                <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.65)", marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                  <RiHashtag size={11} /> {dept.departmentCode}
                </div>
              )}
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <span style={{
                  fontSize: 10.5, fontWeight: 700, padding: "2px 10px", borderRadius: 20,
                  background: isActive ? "rgba(52,211,153,0.2)" : "rgba(239,68,68,0.2)",
                  color: isActive ? "#34d399" : "#fca5a5",
                  border: `1px solid ${isActive ? "rgba(52,211,153,0.35)" : "rgba(239,68,68,0.35)"}`,
                }}>
                  {isActive ? "● Active" : "● Inactive"}
                </span>
                <span style={{ fontSize: 10.5, fontWeight: 700, padding: "2px 10px", borderRadius: 20, background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.2)" }}>
                  {deptEmployees.length} Employee{deptEmployees.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>

          {/* Edit / Delete */}
          <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
            <button onClick={() => onEdit(dept)} style={{
              flex: 1, padding: "8px 0", borderRadius: 10,
              background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff", fontSize: 12.5, fontWeight: 600, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              fontFamily: "var(--font)", transition: "background 0.15s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
            >
              <RiEditLine size={14} /> Edit Department
            </button>
            <button onClick={() => { onClose(); onDelete(dept.id, dept.departmentName); }} style={{
              padding: "8px 16px", borderRadius: 10,
              background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)",
              color: "#fca5a5", fontSize: 12.5, fontWeight: 600, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6,
              fontFamily: "var(--font)", transition: "background 0.15s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.25)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.15)"}
            >
              <RiDeleteBinLine size={14} />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, padding: "20px 22px", display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Department Info */}
          <section>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Department Information</div>
            <InfoRow icon={<RiUserStarLine size={15} />} label="Department Head" value={dept.managerName} accent={p.accent} />
            <InfoRow icon={<RiMapPinLine size={15} />}   label="Location"        value={dept.location}    accent={p.accent} />
            <InfoRow icon={<RiCalendarLine size={15} />} label="Created Date"    value={dept.createdDate ? new Date(dept.createdDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : null} accent={p.accent} />
            {dept.description && (
              <div style={{ padding: "10px 14px", borderRadius: 12, background: "#f8fafc", border: "1px solid #f1f5f9", fontSize: 12.5, color: "#475569", lineHeight: 1.5 }}>
                {dept.description}
              </div>
            )}
          </section>

          {/* Attendance Summary */}
          <section>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Attendance Summary</div>
            {deptAtt.length === 0 ? (
              <div style={{ padding: "16px", borderRadius: 12, background: "#f8fafc", border: "1px solid #f1f5f9", fontSize: 12.5, color: "#94a3b8", textAlign: "center" }}>
                No attendance records for this department
              </div>
            ) : (
              <>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
                  <StatPill icon={<RiCheckboxCircleLine size={14} />} label="Present"  value={presentCount} color="#059669" bg="#d1fae5" />
                  <StatPill icon={<RiCloseCircleLine size={14} />}    label="Absent"   value={absentCount}  color="#dc2626" bg="#fee2e2" />
                  <StatPill icon={<RiTimeLine size={14} />}           label="Late"     value={lateCount}    color="#d97706" bg="#fef3c7" />
                </div>
                {attRate !== null && (
                  <div style={{ background: "#f8fafc", borderRadius: 12, padding: "12px 14px", border: "1px solid #f1f5f9" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#475569" }}>Attendance Rate</span>
                      <span style={{ fontSize: 13, fontWeight: 800, color: attRate >= 80 ? "#059669" : "#d97706" }}>{attRate}%</span>
                    </div>
                    <div style={{ height: 6, borderRadius: 99, background: "#e2e8f0", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${attRate}%`, borderRadius: 99, background: attRate >= 80 ? "linear-gradient(90deg,#059669,#34d399)" : "linear-gradient(90deg,#d97706,#fbbf24)", transition: "width 0.6s ease" }} />
                    </div>
                  </div>
                )}
              </>
            )}
          </section>

          {/* Leave Statistics */}
          <section>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Leave Statistics</div>
            {deptLeaves.length === 0 ? (
              <div style={{ padding: "16px", borderRadius: 12, background: "#f8fafc", border: "1px solid #f1f5f9", fontSize: 12.5, color: "#94a3b8", textAlign: "center" }}>
                No leave requests for this department
              </div>
            ) : (
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <StatPill icon={<RiCalendarCheckLine size={14} />} label="Total"    value={deptLeaves.length} color="#2563eb" bg="#dbeafe" />
                <StatPill icon={<RiTimeLine size={14} />}          label="Pending"  value={pendingLeaves}     color="#d97706" bg="#fef3c7" />
                <StatPill icon={<RiCheckboxCircleLine size={14} />} label="Approved" value={approvedLeaves}   color="#059669" bg="#d1fae5" />
              </div>
            )}
          </section>

          {/* Employee List */}
          <section>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>Employees</div>
              <span style={{ fontSize: 11, fontWeight: 700, color: p.accent, background: p.light, padding: "2px 9px", borderRadius: 20 }}>{deptEmployees.length}</span>
            </div>
            {deptEmployees.length === 0 ? (
              <div style={{ padding: "20px", borderRadius: 12, background: "#f8fafc", border: "1px solid #f1f5f9", fontSize: 12.5, color: "#94a3b8", textAlign: "center" }}>
                No employees in this department
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 280, overflowY: "auto" }}>
                {deptEmployees.map(emp => (
                  <div key={emp.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 12, background: "#fff", border: "1px solid #f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: "50%",
                      background: `linear-gradient(135deg, ${p.light}, ${p.accent}44)`,
                      color: p.accent, display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 800, flexShrink: 0,
                      border: `1.5px solid ${p.accent}22`,
                    }}>
                      {initials(emp.firstName, emp.lastName)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {emp.firstName} {emp.lastName}
                      </div>
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>{emp.designation || emp.employmentType || "—"}</div>
                    </div>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                      background: emp.active !== false ? "#dcfce7" : "#fee2e2",
                      color: emp.active !== false ? "#16a34a" : "#dc2626",
                    }}>
                      {emp.active !== false ? "Active" : "Inactive"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      </div>
    </>
  );
}
