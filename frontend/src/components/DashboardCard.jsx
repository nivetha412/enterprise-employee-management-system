import { RiArrowUpLine, RiArrowDownLine } from "react-icons/ri";

function SkeletonCard() {
  return (
    <div style={{
      background: "#fff", borderRadius: "16px", padding: "22px 24px",
      flex: "1 1 180px", boxShadow: "var(--shadow-sm)",
      border: "1px solid var(--border)", minWidth: "180px"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
        <div className="skeleton" style={{ width: "60%", height: "14px", borderRadius: "6px" }} />
        <div className="skeleton" style={{ width: "40px", height: "40px", borderRadius: "12px" }} />
      </div>
      <div className="skeleton" style={{ width: "50%", height: "28px", borderRadius: "6px", marginBottom: "10px" }} />
      <div className="skeleton" style={{ width: "70%", height: "10px", borderRadius: "4px" }} />
    </div>
  );
}

export default function DashboardCard({ title, value, color, icon: Icon, trend, trendValue, description, loading }) {
  if (loading) return <SkeletonCard />;

  const isUp = trend === "up";
  const isDown = trend === "down";
  const trendColor = isUp ? "#10b981" : isDown ? "#ef4444" : "#64748b";
  const trendBg = isUp ? "#ecfdf5" : isDown ? "#fff5f5" : "#f8fafc";

  return (
    <div
      className="fade-in"
      style={{
        background: "#fff", borderRadius: "16px",
        padding: "22px 24px", flex: "1 1 180px",
        boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)",
        position: "relative", overflow: "hidden",
        transition: "transform var(--transition), box-shadow var(--transition)",
        cursor: "default", minWidth: "180px"
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "var(--shadow-md)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "var(--shadow-sm)";
      }}
    >
      {/* Top color accent */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: "3px",
        background: `linear-gradient(90deg, ${color}, ${color}aa)`
      }} />

      {/* Subtle background glow */}
      <div style={{
        position: "absolute", top: "-20px", right: "-20px",
        width: "80px", height: "80px", borderRadius: "50%",
        background: color + "0d", pointerEvents: "none"
      }} />

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "14px" }}>
        <p style={{
          fontSize: "11.5px", fontWeight: 600, color: "var(--text-secondary)",
          textTransform: "uppercase", letterSpacing: "0.07em"
        }}>
          {title}
        </p>
        {Icon && (
          <div style={{
            width: "40px", height: "40px", borderRadius: "12px",
            background: color + "18",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0
          }}>
            <Icon size={20} color={color} />
          </div>
        )}
      </div>

      <p style={{ fontSize: "30px", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1, marginBottom: "10px" }}>
        {value ?? (
          <span style={{ opacity: 0.3 }}>—</span>
        )}
      </p>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {description && (
          <span style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>{description}</span>
        )}
        {(trendValue !== undefined) && (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "2px",
            fontSize: "11px", fontWeight: 700,
            color: trendColor, background: trendBg,
            padding: "2px 7px", borderRadius: "20px"
          }}>
            {isUp && <RiArrowUpLine size={11} />}
            {isDown && <RiArrowDownLine size={11} />}
            {trendValue}
          </span>
        )}
      </div>
    </div>
  );
}
