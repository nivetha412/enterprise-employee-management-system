import { RiCalendarCheckLine, RiPulseLine, RiRefreshLine, RiDownloadLine, RiPrinterLine } from "react-icons/ri";

export default function LeaveHeader({ totalRequests, pendingCount, onRefresh, onExportCSV, onPrint }) {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div style={{
      background: "linear-gradient(135deg, #0f172a 0%, #4c1d95 50%, #7c3aed 100%)",
      borderRadius: 20, padding: "26px 32px", marginBottom: 22,
      position: "relative", overflow: "hidden",
      boxShadow: "0 8px 32px rgba(124,58,237,0.28)",
    }}>
      <div style={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, borderRadius: "50%", background: "rgba(167,139,250,0.12)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -40, right: 180, width: 140, height: 140, borderRadius: "50%", background: "rgba(139,92,246,0.1)", pointerEvents: "none" }} />

      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        {/* Left */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{
            width: 54, height: 54, borderRadius: 16,
            background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 16px rgba(0,0,0,0.2)", flexShrink: 0,
          }}>
            <RiCalendarCheckLine size={25} color="#fff" />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <h1 style={{ fontSize: 21, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.03em" }}>
                Leave Management
              </h1>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                fontSize: 10, fontWeight: 700, color: "#c4b5fd",
                background: "rgba(196,181,253,0.15)", border: "1px solid rgba(196,181,253,0.3)",
                padding: "2px 9px", borderRadius: 20,
              }}>
                <RiPulseLine size={10} /> Live
              </span>
            </div>
            <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.55)", margin: 0 }}>
              {today} · Review, approve, and manage employee leave requests
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 10, flexWrap: "wrap" }}>
              {[
                { label: "Total Requests",   value: totalRequests },
                { label: "Pending Approval", value: pendingCount  },
              ].map(item => (
                <div key={item.label} style={{
                  background: "rgba(255,255,255,0.08)", backdropFilter: "blur(4px)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 10, padding: "5px 13px",
                }}>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.45)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>{item.label}</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginTop: 1 }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: actions */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={onRefresh} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "9px 16px", background: "rgba(255,255,255,0.1)", color: "#fff",
            border: "1px solid rgba(255,255,255,0.18)", borderRadius: 11,
            fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font)", transition: "all 0.15s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
          >
            <RiRefreshLine size={14} /> Refresh
          </button>
          <button onClick={onExportCSV} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "9px 16px", background: "linear-gradient(135deg,#059669,#047857)", color: "#fff",
            border: "1px solid rgba(255,255,255,0.15)", borderRadius: 11,
            fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font)",
            boxShadow: "0 4px 14px rgba(5,150,105,0.4)", transition: "all 0.18s",
          }}
            onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <RiDownloadLine size={14} /> Export Excel
          </button>
          <button onClick={onPrint} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "9px 16px", background: "linear-gradient(135deg,#dc2626,#b91c1c)", color: "#fff",
            border: "1px solid rgba(255,255,255,0.15)", borderRadius: 11,
            fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font)",
            boxShadow: "0 4px 14px rgba(220,38,38,0.4)", transition: "all 0.18s",
          }}
            onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <RiPrinterLine size={14} /> Export PDF
          </button>
        </div>
      </div>
    </div>
  );
}
