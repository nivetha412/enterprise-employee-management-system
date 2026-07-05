import {
  RiUserLine, RiBriefcaseLine, RiBuildingLine,
  RiShieldCheckLine, RiMailLine, RiPhoneLine, RiEditLine,
} from "react-icons/ri";
import { useEmployee } from "../../hooks/useEmployee";

export default function EmpProfileSummary() {
  const { emp, loading } = useEmployee();

  const fullName    = emp ? `${emp.firstName} ${emp.lastName}` : "—";
  const initials    = emp ? `${emp.firstName?.[0] ?? ""}${emp.lastName?.[0] ?? ""}`.toUpperCase() : "…";
  const email       = emp?.email || localStorage.getItem("email") || "—";

  const rows = [
    { icon: RiUserLine,        label: "Employee ID",      value: emp?.employeeCode  || "—", color: "#1e40af", bg: "#eff6ff" },
    { icon: RiBriefcaseLine,   label: "Designation",      value: emp?.designation   || "—", color: "#7c3aed", bg: "#f5f3ff" },
    { icon: RiBuildingLine,    label: "Department",       value: emp?.department    || "—", color: "#0891b2", bg: "#ecfeff" },
    { icon: RiShieldCheckLine, label: "Employment Type",  value: emp?.employmentType|| "—", color: "#d97706", bg: "#fffbeb" },
    { icon: RiPhoneLine,       label: "Phone",            value: emp?.phone         || "—", color: "#059669", bg: "#ecfdf5" },
  ];

  return (
    <div style={{
      background: "#fff", borderRadius: "16px",
      boxShadow: "0 4px 24px rgba(30,64,175,0.08), 0 1px 4px rgba(0,0,0,0.04)",
      border: "1px solid #e8edf5", overflow: "hidden",
    }}>
      {/* Gradient header */}
      <div style={{
        background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
        padding: "20px 22px 28px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "100px", height: "100px", borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{
            width: "56px", height: "56px", borderRadius: "14px", flexShrink: 0,
            background: "linear-gradient(135deg, #60a5fa, #a78bfa)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 800, fontSize: "18px",
            border: "2.5px solid rgba(255,255,255,0.3)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
          }}>
            {loading ? "…" : initials}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "15px", color: "#fff", letterSpacing: "-0.02em" }}>
              {loading ? "Loading…" : fullName}
            </div>
            <div style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.6)", marginTop: "2px", display: "flex", alignItems: "center", gap: "5px" }}>
              <RiMailLine size={11} /> {email}
            </div>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "4px",
              marginTop: "6px", padding: "2px 10px", borderRadius: "20px",
              fontSize: "10px", fontWeight: 700,
              color: emp?.active === false ? "#ef4444" : "#10b981",
              background: emp?.active === false ? "rgba(239,68,68,0.15)" : "rgba(16,185,129,0.15)",
              border: `1px solid ${emp?.active === false ? "rgba(239,68,68,0.3)" : "rgba(16,185,129,0.3)"}`,
            }}>
              <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: emp?.active === false ? "#ef4444" : "#10b981", display: "inline-block" }} />
              {emp?.active === false ? "Inactive" : "Active Employee"}
            </span>
          </div>
        </div>
      </div>

      <div style={{ padding: "20px 22px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em" }}>Profile Details</span>
          <button style={{
            display: "flex", alignItems: "center", gap: "4px",
            fontSize: "11px", fontWeight: 600, color: "#1e40af",
            background: "#eff6ff", border: "1px solid #bfdbfe",
            borderRadius: "8px", padding: "4px 10px", cursor: "pointer",
          }}>
            <RiEditLine size={11} /> Edit
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {rows.map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} style={{
              display: "flex", alignItems: "center", gap: "12px",
              padding: "10px 12px", borderRadius: "10px",
              background: "#f8fafc", border: "1px solid #f1f5f9",
              transition: "background 0.15s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = bg}
              onMouseLeave={e => e.currentTarget.style.background = "#f8fafc"}
            >
              <div style={{
                width: "32px", height: "32px", borderRadius: "8px", flexShrink: 0,
                background: bg, display: "flex", alignItems: "center", justifyContent: "center",
                border: `1px solid ${color}22`,
              }}>
                <Icon size={15} color={color} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "10px", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
                <div style={{ fontSize: "12.5px", fontWeight: 700, color: "#0f172a", marginTop: "1px" }}>
                  {loading ? "…" : value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
