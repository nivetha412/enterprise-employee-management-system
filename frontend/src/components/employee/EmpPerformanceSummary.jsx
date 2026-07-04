import { RiBarChartLine, RiFocus3Line, RiBookOpenLine, RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import { useState } from "react";

const GOALS = [
  { label: "Complete React Training",   pct: 75, color: "#3b82f6" },
  { label: "Q3 Project Delivery",       pct: 60, color: "#10b981" },
  { label: "Code Review Participation", pct: 90, color: "#8b5cf6" },
];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const PERF   = [72, 78, 80, 74, 85, 88, 0, 0, 0, 0, 0, 0];

function buildCalendar(year, month) {
  const first = new Date(year, month, 1).getDay();
  const days  = new Date(year, month + 1, 0).getDate();
  return { first, days };
}

export default function EmpPerformanceSummary() {
  const today = new Date();
  const [calYear, setCalYear]   = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());

  const { first, days } = buildCalendar(calYear, calMonth);
  const allDays = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];

  const isToday = (d) => d === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear();

  const prevMonth = () => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); };
  const nextMonth = () => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

      {/* Performance Summary */}
      <div style={{
        background: "#fff", borderRadius: "16px",
        boxShadow: "0 4px 24px rgba(30,64,175,0.08), 0 1px 4px rgba(0,0,0,0.04)",
        border: "1px solid #e8edf5", overflow: "hidden",
      }}>
        <div style={{
          padding: "18px 22px 14px", borderBottom: "1px solid #f1f5f9",
          display: "flex", alignItems: "center", gap: "8px",
        }}>
          <div style={{
            width: "30px", height: "30px", borderRadius: "8px",
            background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <RiBarChartLine size={15} color="#1e40af" />
          </div>
          <h3 style={{ fontSize: "13.5px", fontWeight: 700, color: "#0f172a" }}>Performance Summary</h3>
        </div>

        <div style={{ padding: "18px 22px" }}>
          {/* Monthly bar chart */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "10.5px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "12px" }}>
              Monthly Performance
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "64px" }}>
              {PERF.map((v, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                  <div style={{
                    width: "100%", borderRadius: "4px 4px 0 0",
                    height: v ? `${(v / 100) * 56}px` : "4px",
                    background: v
                      ? (v >= 85 ? "linear-gradient(180deg,#10b981,#059669)" : v >= 75 ? "linear-gradient(180deg,#3b82f6,#1e40af)" : "linear-gradient(180deg,#f59e0b,#d97706)")
                      : "#f1f5f9",
                    transition: "height 0.5s ease",
                    cursor: v ? "pointer" : "default",
                  }} />
                  <span style={{ fontSize: "8px", color: "#94a3b8", fontWeight: 600 }}>{MONTHS[i].slice(0, 1)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Goal Progress */}
          <div style={{ marginBottom: "18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
              <RiFocus3Line size={13} color="#10b981" />
              <span style={{ fontSize: "10.5px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em" }}>Goal Progress</span>
            </div>
            {GOALS.map(({ label, pct, color }) => (
              <div key={label} style={{ marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
                  <span style={{ fontSize: "11.5px", fontWeight: 600, color: "#475569" }}>{label}</span>
                  <span style={{
                    fontSize: "10.5px", fontWeight: 800, color,
                    background: color + "15", padding: "1px 8px", borderRadius: "10px",
                  }}>{pct}%</span>
                </div>
                <div style={{ height: "6px", borderRadius: "99px", background: "#f1f5f9", overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: "99px",
                    width: `${pct}%`,
                    background: `linear-gradient(90deg, ${color}, ${color}cc)`,
                    transition: "width 0.8s cubic-bezier(0.16,1,0.3,1)",
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* Training Completion */}
          <div style={{
            display: "flex", alignItems: "center", gap: "14px",
            padding: "14px 16px", borderRadius: "12px",
            background: "linear-gradient(135deg,#f5f3ff,#ede9fe)",
            border: "1px solid #ddd6fe",
          }}>
            <div style={{
              width: "44px", height: "44px", borderRadius: "12px",
              background: "#8b5cf620",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <RiBookOpenLine size={20} color="#8b5cf6" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "12.5px", fontWeight: 700, color: "#0f172a" }}>Training Completion</div>
              <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "1px" }}>3 of 5 modules done</div>
              <div style={{ height: "5px", borderRadius: "99px", background: "#ede9fe", marginTop: "8px", overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: "68%", borderRadius: "99px",
                  background: "linear-gradient(90deg,#8b5cf6,#a78bfa)",
                  transition: "width 0.8s ease",
                }} />
              </div>
            </div>
            <span style={{ fontSize: "18px", fontWeight: 800, color: "#8b5cf6", flexShrink: 0 }}>68%</span>
          </div>
        </div>
      </div>

      {/* Calendar Widget */}
      <div style={{
        background: "#fff", borderRadius: "16px",
        boxShadow: "0 4px 24px rgba(30,64,175,0.08), 0 1px 4px rgba(0,0,0,0.04)",
        border: "1px solid #e8edf5", overflow: "hidden",
      }}>
        <div style={{
          padding: "16px 22px 12px", borderBottom: "1px solid #f1f5f9",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <h3 style={{ fontSize: "13.5px", fontWeight: 700, color: "#0f172a" }}>
            {MONTHS[calMonth]} {calYear}
          </h3>
          <div style={{ display: "flex", gap: "4px" }}>
            {[{ fn: prevMonth, Icon: RiArrowLeftSLine }, { fn: nextMonth, Icon: RiArrowRightSLine }].map(({ fn, Icon }, i) => (
              <button key={i} onClick={fn} style={{
                width: "28px", height: "28px", borderRadius: "7px",
                background: "#f8fafc", border: "1px solid #e2e8f0",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", transition: "background 0.15s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = "#eff6ff"}
                onMouseLeave={e => e.currentTarget.style.background = "#f8fafc"}
              >
                <Icon size={16} color="#475569" />
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: "14px 22px" }}>
          {/* Day headers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", marginBottom: "6px" }}>
            {["Su","Mo","Tu","We","Th","Fr","Sa"].map((d, i) => (
              <div key={i} style={{
                textAlign: "center", fontSize: "9.5px", fontWeight: 700,
                color: i === 0 || i === 6 ? "#f87171" : "#94a3b8",
                padding: "4px 0",
              }}>{d}</div>
            ))}
          </div>

          {/* Days grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px" }}>
            {allDays.map((d, i) => {
              const col = i % 7;
              const isWeekend = col === 0 || col === 6;
              const today_ = isToday(d);
              return (
                <div key={i} style={{
                  textAlign: "center", padding: "6px 2px",
                  fontSize: "11.5px", fontWeight: today_ ? 800 : 400,
                  borderRadius: "8px",
                  background: today_ ? "linear-gradient(135deg,#1e40af,#3b82f6)" : "transparent",
                  color: today_ ? "#fff" : d ? (isWeekend ? "#f87171" : "#0f172a") : "transparent",
                  cursor: d ? "pointer" : "default",
                  transition: "background 0.15s",
                  boxShadow: today_ ? "0 2px 8px rgba(30,64,175,0.3)" : "none",
                }}
                  onMouseEnter={e => { if (d && !today_) e.currentTarget.style.background = "#eff6ff"; }}
                  onMouseLeave={e => { if (d && !today_) e.currentTarget.style.background = "transparent"; }}
                >
                  {d || ""}
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
