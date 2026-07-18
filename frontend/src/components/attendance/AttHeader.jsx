import { RiTimeLine, RiPulseLine, RiRefreshLine } from "react-icons/ri";

export default function AttHeader({ today, totalRecords, onRefresh }) {
  return (
    <div style={{
      background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1d4ed8 100%)",
      borderRadius: 20, padding: "24px 32px", marginBottom: 22,
      position: "relative", overflow: "hidden",
      boxShadow: "0 8px 32px rgba(30,64,175,0.22)",
    }}>
      <div style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, borderRadius: "50%", background: "rgba(99,102,241,0.09)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -30, right: 160, width: 130, height: 130, borderRadius: "50%", background: "rgba(59,130,246,0.07)", pointerEvents: "none" }} />

      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
        {/* Left: icon + title */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 50, height: 50, borderRadius: 14,
            background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.18)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <RiTimeLine size={23} color="#fff" />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 3 }}>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.03em" }}>
                Attendance Management
              </h1>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                fontSize: 10, fontWeight: 700, color: "#34d399",
                background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)",
                padding: "2px 9px", borderRadius: 20,
              }}>
                <RiPulseLine size={10} /> Live
              </span>
            </div>
            <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.5)", margin: 0 }}>
              {today}
            </p>
          </div>
        </div>

        {/* Right: stats + refresh */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 10, padding: "6px 14px",
          }}>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.45)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Total Records</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", marginTop: 1 }}>{totalRecords}</div>
          </div>
          <button onClick={onRefresh} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "9px 16px",
            background: "rgba(255,255,255,0.1)", color: "#fff",
            border: "1px solid rgba(255,255,255,0.18)", borderRadius: 11,
            fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font)",
            transition: "all 0.15s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
          >
            <RiRefreshLine size={14} /> Refresh
          </button>
        </div>
      </div>
    </div>
  );
}
