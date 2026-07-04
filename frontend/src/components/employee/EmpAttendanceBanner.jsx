import { useState, useEffect } from "react";
import { RiLoginBoxLine, RiLogoutBoxLine, RiTimeLine } from "react-icons/ri";
import api from "../../services/api";

function LiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <span>
      {now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
      {" · "}
      <strong style={{ color: "#93c5fd" }}>
        {now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
      </strong>
    </span>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return { text: "Good Morning", emoji: "🌅" };
  if (h < 17) return { text: "Good Afternoon", emoji: "☀️" };
  return { text: "Good Evening", emoji: "🌙" };
}

export default function EmpAttendanceBanner({ todayRecord, onCheckIn, onCheckOut, loading }) {
  const email = localStorage.getItem("email") || "";
  const name  = email.split("@")[0] || "Employee";
  const displayName = name.charAt(0).toUpperCase() + name.slice(1);
  const { text, emoji } = getGreeting();

  const checkedIn  = !!todayRecord?.checkInTime;
  const checkedOut = !!todayRecord?.checkOutTime;

  const statusCfg = checkedOut
    ? { label: "Completed", color: "#10b981", bg: "rgba(16,185,129,0.15)", border: "rgba(16,185,129,0.3)" }
    : checkedIn
    ? { label: "In Progress", color: "#fbbf24", bg: "rgba(251,191,36,0.15)", border: "rgba(251,191,36,0.3)" }
    : { label: "Not Checked In", color: "#f87171", bg: "rgba(248,113,113,0.15)", border: "rgba(248,113,113,0.3)" };

  return (
    <div className="fade-in" style={{
      background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 40%, #1e40af 70%, #2563eb 100%)",
      borderRadius: "20px", padding: "28px 32px", marginBottom: "20px",
      position: "relative", overflow: "hidden",
      boxShadow: "0 20px 60px rgba(30,64,175,0.3), 0 4px 16px rgba(0,0,0,0.2)",
    }}>
      <div style={{ position: "absolute", top: "-50px", right: "-50px", width: "240px", height: "240px", borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-60px", right: "200px", width: "180px", height: "180px", borderRadius: "50%", background: "rgba(255,255,255,0.03)", pointerEvents: "none" }} />

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "20px", position: "relative" }}>
        {/* Left */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "18px" }}>
          <div style={{
            width: "64px", height: "64px", borderRadius: "16px", flexShrink: 0,
            background: "linear-gradient(135deg, #60a5fa, #a78bfa)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "22px", fontWeight: 800, color: "#fff",
            border: "2.5px solid rgba(255,255,255,0.25)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
          }}>
            {displayName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <span style={{ fontSize: "20px" }}>{emoji}</span>
              <h1 style={{ fontSize: "20px", fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.02em" }}>
                {text}, {displayName}!
              </h1>
            </div>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", marginBottom: "14px" }}>
              <LiveClock />
            </p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: "6px",
                background: statusCfg.bg, border: `1px solid ${statusCfg.border}`,
                borderRadius: "10px", padding: "5px 12px",
              }}>
                <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: statusCfg.color, display: "inline-block" }} />
                <span style={{ fontSize: "12px", fontWeight: 700, color: statusCfg.color }}>Today: {statusCfg.label}</span>
              </div>
              {checkedIn && (
                <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: "10px", padding: "5px 12px", border: "1px solid rgba(255,255,255,0.12)" }}>
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>Check-in: </span>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#86efac" }}>{todayRecord.checkInTime}</span>
                </div>
              )}
              {checkedOut && (
                <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: "10px", padding: "5px 12px", border: "1px solid rgba(255,255,255,0.12)" }}>
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>Check-out: </span>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#93c5fd" }}>{todayRecord.checkOutTime}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: action buttons */}
        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
          <button
            onClick={onCheckIn}
            disabled={loading || checkedIn}
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "11px 22px", borderRadius: "12px", border: "none",
              background: checkedIn ? "rgba(255,255,255,0.08)" : "linear-gradient(135deg,#10b981,#059669)",
              color: checkedIn ? "rgba(255,255,255,0.35)" : "#fff",
              fontWeight: 700, fontSize: "13px", cursor: checkedIn ? "not-allowed" : "pointer",
              boxShadow: checkedIn ? "none" : "0 4px 16px rgba(16,185,129,0.4)",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { if (!checkedIn) e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <RiLoginBoxLine size={16} /> Check In
          </button>
          <button
            onClick={onCheckOut}
            disabled={loading || !checkedIn || checkedOut}
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "11px 22px", borderRadius: "12px", border: "none",
              background: (!checkedIn || checkedOut) ? "rgba(255,255,255,0.08)" : "linear-gradient(135deg,#3b82f6,#1e40af)",
              color: (!checkedIn || checkedOut) ? "rgba(255,255,255,0.35)" : "#fff",
              fontWeight: 700, fontSize: "13px", cursor: (!checkedIn || checkedOut) ? "not-allowed" : "pointer",
              boxShadow: (!checkedIn || checkedOut) ? "none" : "0 4px 16px rgba(59,130,246,0.4)",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { if (checkedIn && !checkedOut) e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <RiLogoutBoxLine size={16} /> Check Out
          </button>
        </div>
      </div>
    </div>
  );
}
