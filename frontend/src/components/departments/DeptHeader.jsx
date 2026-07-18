import { RiBuilding2Line, RiAddLine, RiPulseLine } from "react-icons/ri";

export default function DeptHeader({ onAdd, total }) {
  return (
    <div style={{
      background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 45%, #1d4ed8 100%)",
      borderRadius: 20, padding: "28px 32px", marginBottom: 24,
      position: "relative", overflow: "hidden",
      boxShadow: "0 8px 32px rgba(30,64,175,0.28)",
    }}>
      {/* Decorative orbs */}
      <div style={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, borderRadius: "50%", background: "rgba(99,102,241,0.12)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -40, right: 160, width: 140, height: 140, borderRadius: "50%", background: "rgba(59,130,246,0.1)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 20, right: 280, width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {/* Icon */}
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
          }}>
            <RiBuilding2Line size={26} color="#fff" />
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.03em" }}>
                Department Management
              </h1>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                fontSize: 10.5, fontWeight: 700, color: "#34d399",
                background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)",
                padding: "3px 10px", borderRadius: 20,
              }}>
                <RiPulseLine size={11} /> Live
              </span>
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", margin: 0 }}>
              Manage organizational structure, teams, and department hierarchy
            </p>
            <div style={{ display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap" }}>
              {[
                { label: "Total Departments", value: total },
                { label: "Module", value: "HRMS" },
              ].map(item => (
                <div key={item.label} style={{
                  background: "rgba(255,255,255,0.08)", backdropFilter: "blur(4px)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 10, padding: "6px 14px",
                }}>
                  <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.5)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>{item.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginTop: 1 }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add button */}
        <button
          onClick={onAdd}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "11px 24px",
            background: "linear-gradient(135deg, #3b82f6, #2563eb)",
            color: "#fff", border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 12, fontSize: 13.5, fontWeight: 700,
            cursor: "pointer", fontFamily: "var(--font)",
            boxShadow: "0 4px 20px rgba(37,99,235,0.5)",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(37,99,235,0.6)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(37,99,235,0.5)"; }}
        >
          <RiAddLine size={17} /> Add Department
        </button>
      </div>
    </div>
  );
}
