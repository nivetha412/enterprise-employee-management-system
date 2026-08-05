import { RiUserLine, RiBriefcaseLine, RiBuildingLine, RiPhoneLine, RiMailLine, RiShieldCheckLine } from "react-icons/ri";
import { useDomainNav } from "../../context/RoleContext";
import { useEmployee } from "../../hooks/useEmployee";

export default function EmpDashProfileCard() {
  const { emp, loading } = useEmployee();
  const navigate = useDomainNav();

  const fullName = emp ? `${emp.firstName} ${emp.lastName}` : "—";
  const initials = emp ? `${emp.firstName?.[0] ?? ""}${emp.lastName?.[0] ?? ""}`.toUpperCase() : "…";

  const rows = [
    { icon: RiUserLine,        label: "Employee ID",     value: emp?.employeeCode   || "—", color: "#1e40af", bg: "#eff6ff" },
    { icon: RiBriefcaseLine,   label: "Designation",     value: emp?.designation    || "—", color: "#7c3aed", bg: "#f5f3ff" },
    { icon: RiBuildingLine,    label: "Department",      value: emp?.department     || "—", color: "#0891b2", bg: "#ecfeff" },
    { icon: RiShieldCheckLine, label: "Employment Type", value: emp?.employmentType || "—", color: "#d97706", bg: "#fffbeb" },
    { icon: RiPhoneLine,       label: "Phone",           value: emp?.phone          || "—", color: "#059669", bg: "#ecfdf5" },
  ];

  return (
    <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e8edf5", boxShadow: "0 4px 24px rgba(30,64,175,0.07)", overflow: "hidden" }}>
      <div style={{ background: "linear-gradient(135deg,#1e3a8a,#2563eb)", padding: "20px 22px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "100px", height: "100px", borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "linear-gradient(135deg,#60a5fa,#a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: "17px", border: "2.5px solid rgba(255,255,255,0.3)", flexShrink: 0 }}>
            {loading ? "…" : initials}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "14.5px", color: "#fff" }}>{loading ? "Loading…" : fullName}</div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)", marginTop: "2px", display: "flex", alignItems: "center", gap: "4px" }}>
              <RiMailLine size={10} /> {emp?.email || localStorage.getItem("email") || "—"}
            </div>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "4px", marginTop: "5px",
              padding: "2px 9px", borderRadius: "20px", fontSize: "10px", fontWeight: 700,
              color: emp?.active === false ? "#ef4444" : "#10b981",
              background: emp?.active === false ? "rgba(239,68,68,0.15)" : "rgba(16,185,129,0.15)",
              border: `1px solid ${emp?.active === false ? "rgba(239,68,68,0.3)" : "rgba(16,185,129,0.3)"}`,
            }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: emp?.active === false ? "#ef4444" : "#10b981", display: "inline-block" }} />
              {emp?.active === false ? "Inactive" : "Active"}
            </span>
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          <span style={{ fontSize: "10.5px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em" }}>Profile Details</span>
          <button onClick={() => navigate("/profile")} style={{ fontSize: "11px", fontWeight: 600, color: "#1e40af", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "8px", padding: "3px 10px", cursor: "pointer" }}>
            View Full →
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {rows.map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 11px", borderRadius: "10px", background: "#f8fafc", border: "1px solid #f1f5f9", transition: "background 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.background = bg}
              onMouseLeave={e => e.currentTarget.style.background = "#f8fafc"}>
              <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={14} color={color} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "9.5px", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#0f172a", marginTop: "1px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
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
