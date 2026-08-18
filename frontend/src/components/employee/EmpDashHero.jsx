import { useState, useEffect } from "react";
import { useEmployee } from "../../hooks/useEmployee";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return { text: "Good Morning",   emoji: "🌅" };
  if (h < 17) return { text: "Good Afternoon", emoji: "☀️" };
  return       { text: "Good Evening",   emoji: "🌙" };
}

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

export default function EmpDashHero() {
  const { emp, loading, attStats, leaveStats, todayRecord } = useEmployee();
  const { text, emoji } = getGreeting();

  const fullName = emp ? `${emp.firstName} ${emp.lastName}` : localStorage.getItem("name") || (localStorage.getItem("email") || "Employee").split("@")[0];
  const initials = emp
    ? `${emp.firstName?.[0] ?? ""}${emp.lastName?.[0] ?? ""}`.toUpperCase()
    : fullName.slice(0, 2).toUpperCase();

  const monthPct = attStats.workingDays > 0
    ? Math.round((attStats.presentDays / attStats.workingDays) * 100)
    : 0;

  const checkedIn  = !!todayRecord?.checkInTime;
  const checkedOut = !!todayRecord?.checkOutTime;
  const todayStatus = checkedOut ? { label: "Completed", color: "#10b981" }
    : checkedIn ? { label: "In Progress", color: "#fbbf24" }
    : { label: "Not Checked In", color: "#f87171" };

  const chips = [
    { label: "Department",  value: emp?.department   || "—", icon: "🏢" },
    { label: "Employee ID", value: emp?.employeeCode || "—", icon: "🪪" },
    { label: "Designation", value: emp?.designation  || "—", icon: "💼" },
    { label: "Status",      value: emp?.active ? "Active" : "Inactive", icon: "✅" },
  ];

  const stats = [
    { label: "Attendance",    value: loading ? "…" : `${monthPct}%`,              color: "#86efac" },
    { label: "Leave Balance", value: loading ? "…" : `${leaveStats.approved}d`,   color: "#93c5fd" },
    { label: "Pending Leave", value: loading ? "…" : `${leaveStats.pending}`,     color: "#fde68a" },
  ];

  return (
    <div className="fade-in" style={{
      background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 40%, #1e40af 70%, #2563eb 100%)",
      borderRadius: "20px", padding: "28px 32px", marginBottom: "20px",
      position: "relative", overflow: "hidden",
      boxShadow: "0 20px 60px rgba(30,64,175,0.3)",
    }}>
      <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "280px", height: "280px", borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-80px", right: "160px", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(255,255,255,0.03)", pointerEvents: "none" }} />

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "20px", position: "relative" }}>
        {/* Left */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div style={{
              width: "72px", height: "72px", borderRadius: "18px",
              background: "linear-gradient(135deg, #60a5fa, #a78bfa)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "24px", fontWeight: 800, color: "#fff",
              border: "3px solid rgba(255,255,255,0.2)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            }}>
              {loading ? "…" : initials}
            </div>
            <div style={{
              position: "absolute", bottom: "-3px", right: "-3px",
              width: "18px", height: "18px", borderRadius: "50%",
              background: emp?.active === false ? "#ef4444" : "#10b981",
              border: "3px solid #1e3a8a",
            }} />
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <span style={{ fontSize: "20px" }}>{emoji}</span>
              <h1 style={{ fontSize: "20px", fontWeight: 800, color: "#fff", margin: 0 }}>
                {text}, {loading ? "…" : fullName.split(" ")[0]}!
              </h1>
            </div>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", marginBottom: "14px" }}>
              <LiveClock />
            </p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {chips.map(c => (
                <div key={c.label} style={{
                  background: "rgba(255,255,255,0.08)", backdropFilter: "blur(8px)",
                  borderRadius: "10px", padding: "5px 11px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  display: "flex", alignItems: "center", gap: "5px",
                }}>
                  <span style={{ fontSize: "11px" }}>{c.icon}</span>
                  <div>
                    <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.4)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{c.label}</div>
                    <div style={{ fontSize: "11.5px", fontWeight: 700, color: "#fff" }}>{loading ? "…" : c.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: stats + today status */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "flex-end" }}>
          <div style={{ display: "flex", gap: "10px" }}>
            {stats.map(s => (
              <div key={s.label} style={{
                background: "rgba(255,255,255,0.08)", backdropFilter: "blur(8px)",
                borderRadius: "12px", padding: "12px 16px",
                border: "1px solid rgba(255,255,255,0.12)", textAlign: "center", minWidth: "80px",
              }}>
                <div style={{ fontSize: "20px", fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)", fontWeight: 600, marginTop: "4px" }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: "6px",
            background: "rgba(255,255,255,0.08)", borderRadius: "10px", padding: "6px 14px",
            border: "1px solid rgba(255,255,255,0.12)",
          }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: todayStatus.color, display: "inline-block" }} />
            <span style={{ fontSize: "12px", fontWeight: 700, color: todayStatus.color }}>Today: {todayStatus.label}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
