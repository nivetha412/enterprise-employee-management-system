import { useState, useEffect } from "react";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return { text: "Good Morning", emoji: "🌅", sub: "Ready to have a productive day?" };
  if (h < 17) return { text: "Good Afternoon", emoji: "☀️", sub: "Keep up the great work!" };
  return { text: "Good Evening", emoji: "🌙", sub: "Hope you had a great day!" };
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

export default function EmpWelcomeBanner() {
  const email = localStorage.getItem("email") || "";
  const name = email.split("@")[0] || "Employee";
  const displayName = name.charAt(0).toUpperCase() + name.slice(1);
  const { text, emoji, sub } = getGreeting();

  const chips = [
    { label: "Department", value: "Engineering", icon: "🏢" },
    { label: "Employee ID", value: "EMP-00142", icon: "🪪" },
    { label: "Designation", value: "Software Engineer", icon: "💼" },
    { label: "Status", value: "Active", icon: "✅" },
  ];

  const quickStats = [
    { label: "Attendance", value: "94%", color: "#86efac", icon: "📊" },
    { label: "Leave Balance", value: "12d", color: "#93c5fd", icon: "🗓️" },
    { label: "Performance", value: "4.2★", color: "#fde68a", icon: "⭐" },
  ];

  return (
    <div className="fade-in" style={{
      background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 40%, #1e40af 70%, #2563eb 100%)",
      borderRadius: "20px", padding: "32px 36px",
      marginBottom: "24px", position: "relative", overflow: "hidden",
      boxShadow: "0 20px 60px rgba(30,64,175,0.35), 0 4px 16px rgba(0,0,0,0.2)",
    }}>
      {/* Decorative blobs */}
      <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "280px", height: "280px", borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-80px", right: "160px", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(255,255,255,0.03)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "20px", right: "280px", width: "120px", height: "120px", borderRadius: "50%", background: "rgba(96,165,250,0.08)", pointerEvents: "none" }} />

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "20px", position: "relative" }}>
        {/* Left: Avatar + Info */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
          {/* Avatar with ring */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div style={{
              width: "80px", height: "80px", borderRadius: "20px",
              background: "linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #f472b6 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "28px", fontWeight: 800, color: "#fff",
              border: "3px solid rgba(255,255,255,0.25)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
              letterSpacing: "-0.02em",
            }}>
              {displayName.slice(0, 2).toUpperCase()}
            </div>
            <div style={{
              position: "absolute", bottom: "-4px", right: "-4px",
              width: "20px", height: "20px", borderRadius: "50%",
              background: "#10b981", border: "3px solid #1e3a8a",
              boxShadow: "0 0 0 2px rgba(16,185,129,0.3)",
            }} />
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
              <span style={{ fontSize: "22px" }}>{emoji}</span>
              <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.03em" }}>
                {text}, {displayName}!
              </h1>
            </div>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "12.5px", marginBottom: "4px" }}>
              <LiveClock />
            </p>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "12px", marginBottom: "16px" }}>{sub}</p>

            {/* Info chips */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {chips.map(c => (
                <div key={c.label} style={{
                  background: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(8px)",
                  borderRadius: "10px", padding: "6px 12px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  display: "flex", alignItems: "center", gap: "6px",
                }}>
                  <span style={{ fontSize: "12px" }}>{c.icon}</span>
                  <div>
                    <div style={{ fontSize: "9.5px", color: "rgba(255,255,255,0.45)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{c.label}</div>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "#fff" }}>{c.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Quick stats */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "flex-start" }}>
          {quickStats.map(s => (
            <div key={s.label} style={{
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(8px)",
              borderRadius: "14px", padding: "16px 20px",
              border: "1px solid rgba(255,255,255,0.12)",
              textAlign: "center", minWidth: "90px",
              transition: "background 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.14)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
            >
              <div style={{ fontSize: "20px", marginBottom: "4px" }}>{s.icon}</div>
              <div style={{ fontSize: "22px", fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.5)", fontWeight: 600, marginTop: "4px" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
