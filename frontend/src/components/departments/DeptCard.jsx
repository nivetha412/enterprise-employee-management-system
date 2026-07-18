import { RiBuilding2Line, RiEditLine, RiDeleteBinLine, RiMapPinLine, RiTeamLine, RiEyeLine, RiUserStarLine, RiCalendarLine, RiHashtag } from "react-icons/ri";

const PALETTE = [
  { accent: "#2563eb", light: "#dbeafe", mid: "#93c5fd" },
  { accent: "#7c3aed", light: "#ede9fe", mid: "#c4b5fd" },
  { accent: "#059669", light: "#d1fae5", mid: "#6ee7b7" },
  { accent: "#d97706", light: "#fef3c7", mid: "#fcd34d" },
  { accent: "#0891b2", light: "#cffafe", mid: "#67e8f9" },
  { accent: "#dc2626", light: "#fee2e2", mid: "#fca5a5" },
  { accent: "#0d9488", light: "#ccfbf1", mid: "#5eead4" },
  { accent: "#ea580c", light: "#ffedd5", mid: "#fdba74" },
];

function initials(firstName, lastName) {
  return `${(firstName || "?")[0]}${(lastName || "")[0] || ""}`.toUpperCase();
}

function AvatarGroup({ employees, accent, light }) {
  if (!employees.length) return (
    <span style={{ fontSize: 11.5, color: "#94a3b8", fontStyle: "italic" }}>No employees yet</span>
  );
  const visible = employees.slice(0, 5);
  const extra   = employees.length - visible.length;
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {visible.map((emp, i) => (
        <div key={emp.id} title={`${emp.firstName} ${emp.lastName}`} style={{
          width: 28, height: 28, borderRadius: "50%",
          background: `linear-gradient(135deg, ${light}, ${accent}44)`,
          color: accent, border: "2.5px solid #fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 9.5, fontWeight: 800,
          marginLeft: i === 0 ? 0 : -9, zIndex: 5 - i,
          boxShadow: `0 1px 4px ${accent}30`,
        }}>
          {initials(emp.firstName, emp.lastName)}
        </div>
      ))}
      {extra > 0 && (
        <div style={{
          width: 28, height: 28, borderRadius: "50%",
          background: "#f1f5f9", color: "#64748b",
          border: "2.5px solid #fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 9, fontWeight: 700, marginLeft: -9,
        }}>+{extra}</div>
      )}
    </div>
  );
}

export default function DeptCard({ dept, index, deptEmployees, onView, onEdit, onDelete }) {
  const p        = PALETTE[index % PALETTE.length];
  const empCount = deptEmployees.length;
  const head     = dept.managerName?.trim() || null;
  const location = dept.location?.trim()    || null;
  const isActive = dept.active !== false;

  return (
    <div style={{
      background: "#fff", borderRadius: 18,
      border: "1.5px solid #e2e8f0",
      boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
      overflow: "hidden",
      transition: "transform 0.2s, box-shadow 0.2s",
      cursor: "default", display: "flex", flexDirection: "column",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 16px 40px ${p.accent}18`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.05)"; }}
    >
      {/* Gradient header band */}
      <div style={{
        background: `linear-gradient(135deg, ${p.accent}ee, ${p.accent}bb)`,
        padding: "18px 20px 14px",
        position: "relative", overflow: "hidden",
      }}>
        {/* Decorative circle */}
        <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.1)", pointerEvents: "none" }} />

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div style={{
            width: 44, height: 44, borderRadius: 13,
            background: "rgba(255,255,255,0.2)", backdropFilter: "blur(4px)",
            border: "1px solid rgba(255,255,255,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <RiBuilding2Line size={22} color="#fff" />
          </div>

          <span style={{
            fontSize: 10.5, fontWeight: 700, padding: "3px 10px",
            borderRadius: 20,
            background: isActive ? "rgba(52,211,153,0.2)" : "rgba(239,68,68,0.2)",
            color: isActive ? "#34d399" : "#fca5a5",
            border: `1px solid ${isActive ? "rgba(52,211,153,0.4)" : "rgba(239,68,68,0.4)"}`,
          }}>
            {isActive ? "● Active" : "● Inactive"}
          </span>
        </div>

        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 15.5, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: 3 }}>
            {dept.departmentName}
          </div>
          {dept.departmentCode && (
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>
              <RiHashtag size={11} /> {dept.departmentCode}
            </div>
          )}
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>

        {/* Department Head */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: p.light, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <RiUserStarLine size={14} color={p.accent} />
          </div>
          <div>
            <div style={{ fontSize: 9.5, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em" }}>Department Head</div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: head ? "#0f172a" : "#94a3b8" }}>
              {head || "Not Assigned"}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <div style={{ background: "#f8fafc", borderRadius: 10, padding: "8px 10px", border: "1px solid #f1f5f9" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2 }}>
              <RiTeamLine size={12} color={p.accent} />
              <span style={{ fontSize: 9.5, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>Employees</span>
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: p.accent, lineHeight: 1 }}>{empCount}</div>
          </div>
          <div style={{ background: "#f8fafc", borderRadius: 10, padding: "8px 10px", border: "1px solid #f1f5f9" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2 }}>
              <RiMapPinLine size={12} color={p.accent} />
              <span style={{ fontSize: 9.5, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>Location</span>
            </div>
            <div style={{ fontSize: 11.5, fontWeight: 600, color: location ? "#0f172a" : "#94a3b8", lineHeight: 1.2, marginTop: 2 }}>
              {location || "—"}
            </div>
          </div>
        </div>

        {/* Created date */}
        {dept.createdDate && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#94a3b8" }}>
            <RiCalendarLine size={12} />
            Created {new Date(dept.createdDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
          </div>
        )}

        {/* Avatar group */}
        <div style={{ paddingTop: 4, borderTop: "1px solid #f1f5f9" }}>
          <AvatarGroup employees={deptEmployees} accent={p.accent} light={p.light} />
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 6, paddingTop: 4, borderTop: "1px solid #f1f5f9" }}>
          {[
            { icon: <RiEyeLine size={13} />,       label: "View",   color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe", fn: () => onView(dept) },
            { icon: <RiEditLine size={13} />,      label: "Edit",   color: "#d97706", bg: "#fffbeb", border: "#fde68a", fn: () => onEdit(dept) },
            { icon: <RiDeleteBinLine size={13} />, label: "Delete", color: "#dc2626", bg: "#fff5f5", border: "#fecaca", fn: () => onDelete(dept.id, dept.departmentName) },
          ].map(({ icon, label, color, bg, border, fn }) => (
            <button key={label} onClick={fn} style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
              padding: "7px 0", borderRadius: 9, border: `1px solid ${border}`,
              background: bg, color, fontSize: 11.5, fontWeight: 600,
              cursor: "pointer", fontFamily: "var(--font)", transition: "all 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = `0 4px 12px ${color}22`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              {icon} {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
