import { s } from "../../styles/ui.jsx";
import { RiBuilding2Line, RiCheckLine, RiCloseLine, RiAddLine, RiHashtag, RiUserStarLine, RiMapPinLine, RiFileTextLine } from "react-icons/ri";

const FIELD_DEFS = [
  { key: "departmentName", label: "Department Name", placeholder: "e.g. Engineering, Marketing…", icon: RiBuilding2Line, required: true },
  { key: "departmentCode", label: "Department Code", placeholder: "e.g. ENG-001, MKT-002",       icon: RiHashtag,       required: false },
  { key: "managerName",    label: "Department Head", placeholder: "e.g. John Smith",              icon: RiUserStarLine,  required: false },
  { key: "location",       label: "Location",        placeholder: "e.g. New York, Remote",        icon: RiMapPinLine,    required: false },
];

function FormField({ def, value, error, onChange, onFocus, onBlur }) {
  const Icon = def.icon;
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ ...s.label, display: "flex", alignItems: "center", gap: 5 }}>
        <Icon size={11} /> {def.label} {def.required && <span style={{ color: "#dc2626" }}>*</span>}
      </label>
      <div style={{ position: "relative" }}>
        <Icon size={14} color="#94a3b8" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
        <input
          autoFocus={def.key === "departmentName"}
          style={{
            ...s.input,
            paddingLeft: 34,
            borderColor: error ? "#dc2626" : "#e2e8f0",
            boxShadow: error ? "0 0 0 3px rgba(220,38,38,0.08)" : "none",
          }}
          type="text"
          placeholder={def.placeholder}
          value={value}
          onChange={e => onChange(def.key, e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </div>
      {error && (
        <span style={{ color: "#dc2626", fontSize: 11.5, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#dc2626", display: "inline-block" }} />
          {error}
        </span>
      )}
    </div>
  );
}

export default function DeptFormModal({ open, editingId, form, errors, onChange, onSubmit, onCancel }) {
  if (!open) return null;
  const isEdit = !!editingId;

  const focusStyle = { borderColor: "#3b82f6", boxShadow: "0 0 0 3px rgba(59,130,246,0.12)" };
  const blurStyle  = (field) => ({ borderColor: errors[field] ? "#dc2626" : "#e2e8f0", boxShadow: errors[field] ? "0 0 0 3px rgba(220,38,38,0.08)" : "none" });

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 1100, background: "rgba(15,23,42,0.5)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
      onClick={e => e.target === e.currentTarget && onCancel()}
    >
      <div style={{
        background: "#fff", borderRadius: 22, width: "100%", maxWidth: 500,
        boxShadow: "0 32px 80px rgba(0,0,0,0.22)",
        border: `2px solid ${isEdit ? "#fde68a" : "#bfdbfe"}`,
        animation: "scaleIn 0.22s cubic-bezier(0.16,1,0.3,1)",
        maxHeight: "92vh", overflowY: "auto",
      }}>

        {/* Modal header */}
        <div style={{
          background: isEdit ? "linear-gradient(135deg,#fffbeb,#fef3c7)" : "linear-gradient(135deg,#eff6ff,#dbeafe)",
          borderRadius: "20px 20px 0 0", padding: "22px 24px",
          borderBottom: `1.5px solid ${isEdit ? "#fde68a" : "#bfdbfe"}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 46, height: 46, borderRadius: 14,
              background: isEdit ? "#fef3c7" : "#dbeafe",
              border: `1.5px solid ${isEdit ? "#fde68a" : "#bfdbfe"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 4px 12px ${isEdit ? "#d97706" : "#2563eb"}22`,
            }}>
              <RiBuilding2Line size={22} color={isEdit ? "#d97706" : "#2563eb"} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, color: "#0f172a" }}>
                {isEdit ? "Edit Department" : "Add New Department"}
              </div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 1 }}>
                {isEdit ? "Update department information" : "Fill in the details to create a new department"}
              </div>
            </div>
          </div>
          <button onClick={onCancel} style={{ width: 34, height: 34, borderRadius: 10, border: "1.5px solid #e2e8f0", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.background = "#f1f5f9"}
            onMouseLeave={e => e.currentTarget.style.background = "#fff"}
          >
            <RiCloseLine size={17} color="#64748b" />
          </button>
        </div>

        {/* Form body */}
        <div style={{ padding: "24px 24px 20px" }}>
          {FIELD_DEFS.map(def => (
            <FormField
              key={def.key}
              def={def}
              value={form[def.key]}
              error={errors[def.key]}
              onChange={onChange}
              onFocus={e => Object.assign(e.target.style, focusStyle)}
              onBlur={e => Object.assign(e.target.style, blurStyle(def.key))}
            />
          ))}

          {/* Description textarea */}
          <div style={{ marginBottom: 8 }}>
            <label style={{ ...s.label, display: "flex", alignItems: "center", gap: 5 }}>
              <RiFileTextLine size={11} /> Description
            </label>
            <textarea
              style={{ ...s.input, resize: "vertical", minHeight: 80, paddingTop: 10 }}
              placeholder="Brief description of this department's role and responsibilities…"
              value={form.description}
              onChange={e => onChange("description", e.target.value)}
              onFocus={e => Object.assign(e.target.style, focusStyle)}
              onBlur={e => Object.assign(e.target.style, { borderColor: "#e2e8f0", boxShadow: "none" })}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 24px 22px", borderTop: "1px solid #f1f5f9", display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onCancel} style={s.btnGhost}
            onMouseEnter={e => e.currentTarget.style.background = "#f1f5f9"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.7)"}
          >
            <RiCloseLine size={14} /> Cancel
          </button>
          <button onClick={onSubmit} style={s.btnPrimary}
            onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            {isEdit ? <RiCheckLine size={14} /> : <RiAddLine size={14} />}
            {isEdit ? "Update Department" : "Create Department"}
          </button>
        </div>
      </div>
    </div>
  );
}
