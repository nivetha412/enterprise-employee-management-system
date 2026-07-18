import { useMemo } from "react";

const card = { background: "#fff", borderRadius: 14, padding: "18px 20px", border: "1px solid #e2e8f0", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" };
const secTitle = { fontSize: 10.5, fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: 13 };

// ── Horizontal bar ────────────────────────────────────────────────────────────
function HBar({ label, value, max, color }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
        <span style={{ fontSize: 11.5, color: "#475569", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 140 }}>{label}</span>
        <span style={{ fontSize: 11.5, fontWeight: 700, color, flexShrink: 0, marginLeft: 8 }}>{value}</span>
      </div>
      <div style={{ height: 5, borderRadius: 99, background: "#f1f5f9", overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 99, width: `${pct}%`, background: color, transition: "width 0.5s ease" }} />
      </div>
    </div>
  );
}

// ── SVG Donut ─────────────────────────────────────────────────────────────────
function Donut({ slices, size = 96 }) {
  const total = slices.reduce((s, x) => s + x.value, 0);
  if (total === 0) return <div style={{ width: size, height: size, borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#94a3b8" }}>No data</div>;
  let cum = 0;
  const paths = slices.map(sl => {
    const pct = sl.value / total;
    const a0 = cum * 2 * Math.PI - Math.PI / 2; cum += pct;
    const a1 = cum * 2 * Math.PI - Math.PI / 2;
    const r = size / 2 - 10, cx = size / 2, cy = size / 2;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    return { d: `M${cx},${cy} L${x0},${y0} A${r},${r} 0 ${pct > 0.5 ? 1 : 0},1 ${x1},${y1}Z`, color: sl.color };
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      {paths.map((p, i) => <path key={i} d={p.d} fill={p.color} stroke="#fff" strokeWidth={1.5} />)}
      <circle cx={size / 2} cy={size / 2} r={size / 2 - 26} fill="#fff" />
    </svg>
  );
}

// ── Stacked bar chart (daily / weekly / monthly) ──────────────────────────────
function StackedBars({ data, height = 80 }) {
  if (!data.length || data.every(d => d.present + d.absent === 0))
    return <div style={{ height, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11.5, color: "#94a3b8" }}>No data for this period</div>;
  const maxVal = Math.max(...data.map(d => d.present + d.absent), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", height: height + 20, gap: 1 }}>
      {data.map((d, i) => {
        const total = d.present + d.absent;
        const barH  = total > 0 ? Math.max((total / maxVal) * height, 3) : 0;
        const presH = total > 0 ? (d.present / total) * barH : 0;
        const absH  = barH - presH;
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}
            title={`${d.label}: ${d.present}P / ${d.absent}A`}>
            <div style={{ width: "70%", display: "flex", flexDirection: "column", justifyContent: "flex-end", height }}>
              {barH > 0 && (
                <div style={{ width: "100%", borderRadius: "3px 3px 0 0", overflow: "hidden" }}>
                  <div style={{ height: absH,  background: "#fca5a5" }} />
                  <div style={{ height: presH, background: "#34d399" }} />
                </div>
              )}
            </div>
            <div style={{ fontSize: 8, color: "#94a3b8", marginTop: 3, textAlign: "center", lineHeight: 1.2, overflow: "hidden", maxWidth: "100%" }}>{d.label}</div>
          </div>
        );
      })}
    </div>
  );
}

// ── Weekly calendar strip ─────────────────────────────────────────────────────
function WeekStrip({ attendance, today }) {
  const days = useMemo(() => {
    const now = new Date(today);
    const dow = now.getDay();
    const monday = new Date(now); monday.setDate(now.getDate() - ((dow + 6) % 7));
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday); d.setDate(monday.getDate() + i);
      const ds = d.toISOString().slice(0, 10);
      const recs = attendance.filter(a => String(a.attendanceDate) === ds);
      return {
        label: d.toLocaleDateString("en-US", { weekday: "short" }),
        date: d.getDate(),
        present: recs.filter(a => a.status === "PRESENT").length,
        absent:  recs.filter(a => a.status === "ABSENT").length,
        late:    recs.filter(a => a.lateArrival).length,
        isFuture: d > now,
        isToday: ds === today,
        hasData: recs.length > 0,
      };
    });
  }, [attendance, today]);

  return (
    <div style={{ display: "flex", gap: 6 }}>
      {days.map((d, i) => (
        <div key={i} style={{
          flex: 1, borderRadius: 9, padding: "9px 4px", textAlign: "center",
          background: d.isToday ? "#eff6ff" : "#fafafa",
          border: `1.5px solid ${d.isToday ? "#bfdbfe" : "#f1f5f9"}`,
        }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: d.isToday ? "#2563eb" : "#94a3b8", textTransform: "uppercase" }}>{d.label}</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: d.isToday ? "#1e40af" : "#475569", margin: "3px 0" }}>{d.date}</div>
          {d.isFuture ? <div style={{ fontSize: 8.5, color: "#cbd5e1" }}>—</div>
            : d.hasData ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 1, marginTop: 3 }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: "#059669" }}>{d.present}P</span>
                {d.absent > 0 && <span style={{ fontSize: 9, fontWeight: 700, color: "#dc2626" }}>{d.absent}A</span>}
                {d.late   > 0 && <span style={{ fontSize: 9, fontWeight: 700, color: "#d97706" }}>{d.late}L</span>}
              </div>
            ) : <div style={{ fontSize: 8.5, color: "#cbd5e1", marginTop: 3 }}>No data</div>
          }
        </div>
      ))}
    </div>
  );
}

// ── Alert row ─────────────────────────────────────────────────────────────────
function AlertRow({ name, detail, tag, tagColor, tagBg }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 9, background: tagBg + "55", border: `1px solid ${tagColor}18`, marginBottom: 6 }}>
      <div style={{ width: 5, height: 5, borderRadius: "50%", background: tagColor, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</div>
        <div style={{ fontSize: 10.5, color: "#64748b", marginTop: 1 }}>{detail}</div>
      </div>
      <span style={{ fontSize: 10, fontWeight: 700, color: tagColor, background: tagBg, padding: "2px 7px", borderRadius: 20, border: `1px solid ${tagColor}33`, flexShrink: 0 }}>{tag}</span>
    </div>
  );
}

function AlertSection({ title, items, emptyText, tagColor, tagBg, tag, detailFn }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 800, color: "#475569", textTransform: "uppercase", letterSpacing: "0.07em" }}>{title}</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: tagColor, background: tagBg, padding: "1px 7px", borderRadius: 20 }}>{items.length}</span>
      </div>
      {items.length === 0
        ? <div style={{ fontSize: 11.5, color: "#94a3b8", padding: "8px 10px", borderRadius: 9, background: "#f8fafc", border: "1px solid #f1f5f9" }}>{emptyText}</div>
        : items.slice(0, 5).map((item, i) => (
            <AlertRow key={i} name={item.name} detail={detailFn(item)} tag={tag} tagColor={tagColor} tagBg={tagBg} />
          ))
      }
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AttAnalytics({ attendance, employees, departments, leaves, today }) {

  // Daily trend — last 14 days
  const dailyTrend = useMemo(() => Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today); d.setDate(d.getDate() - (13 - i));
    const ds = d.toISOString().slice(0, 10);
    const recs = attendance.filter(a => String(a.attendanceDate) === ds);
    return { label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }), present: recs.filter(a => a.status === "PRESENT").length, absent: recs.filter(a => a.status === "ABSENT").length };
  }), [attendance, today]);

  // Monthly trend — last 6 months
  const monthlyTrend = useMemo(() => Array.from({ length: 6 }, (_, i) => {
    const d = new Date(today); d.setMonth(d.getMonth() - (5 - i));
    const ym = d.toISOString().slice(0, 7);
    const recs = attendance.filter(a => String(a.attendanceDate).startsWith(ym));
    return { label: d.toLocaleDateString("en-US", { month: "short" }), present: recs.filter(a => a.status === "PRESENT").length, absent: recs.filter(a => a.status === "ABSENT").length };
  }), [attendance, today]);

  // Dept-wise
  const deptData = useMemo(() =>
    departments.map(d => {
      const ids = new Set(employees.filter(e => (e.department || "").toLowerCase() === d.departmentName.toLowerCase()).map(e => e.id));
      const present = attendance.filter(a => ids.has(a.employeeId) && a.status === "PRESENT").length;
      const total   = attendance.filter(a => ids.has(a.employeeId)).length;
      return { name: d.departmentName, present, total };
    }).filter(d => d.total > 0).sort((a, b) => b.present - a.present).slice(0, 7),
    [attendance, employees, departments]
  );

  const presentAll = attendance.filter(a => a.status === "PRESENT").length;
  const absentAll  = attendance.filter(a => a.status === "ABSENT").length;
  const lateAll    = attendance.filter(a => a.lateArrival).length;
  const totalAll   = attendance.length;

  // ── Alert data ──────────────────────────────────────────────────────────────
  const getName = (id) => { const e = employees.find(x => x.id === id); return e ? `${e.firstName} ${e.lastName}` : `Employee #${id}`; };

  const lateAlerts = useMemo(() =>
    attendance.filter(a => String(a.attendanceDate) === today && a.lateArrival && a.checkInTime)
      .map(a => ({ name: getName(a.employeeId), checkIn: a.checkInTime })),
    [attendance, employees, today] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const missingCheckout = useMemo(() =>
    attendance.filter(a => String(a.attendanceDate) === today && a.checkInTime && !a.checkOutTime && a.status === "PRESENT")
      .map(a => ({ name: getName(a.employeeId), checkIn: a.checkInTime })),
    [attendance, employees, today] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const absentToday = useMemo(() =>
    attendance.filter(a => String(a.attendanceDate) === today && a.status === "ABSENT")
      .map(a => ({ name: getName(a.employeeId) })),
    [attendance, employees, today] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const onLeaveToday = useMemo(() =>
    leaves.filter(l => l.status === "APPROVED" && String(l.startDate) <= today && String(l.endDate) >= today)
      .map(l => ({ name: getName(l.employeeId), type: l.leaveType || "Leave" })),
    [leaves, employees, today] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const pendingLeaves = useMemo(() =>
    leaves.filter(l => l.status === "PENDING")
      .map(l => ({ name: getName(l.employeeId), type: l.leaveType || "Leave" })),
    [leaves, employees] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 14, marginBottom: 18 }}>

      {/* Daily Trend — 8 cols */}
      <div style={{ ...card, gridColumn: "span 8" }}>
        <div style={secTitle}>Daily Attendance Trend · Last 14 Days</div>
        <div style={{ display: "flex", gap: 12, marginBottom: 8 }}>
          {[{ c: "#34d399", l: "Present" }, { c: "#fca5a5", l: "Absent" }].map(x => (
            <span key={x.l} style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, color: "#475569", fontWeight: 600 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: x.c, display: "inline-block" }} /> {x.l}
            </span>
          ))}
        </div>
        <StackedBars data={dailyTrend} height={90} />
      </div>

      {/* Pie — 4 cols */}
      <div style={{ ...card, gridColumn: "span 4" }}>
        <div style={secTitle}>Overall Distribution</div>
        {totalAll === 0
          ? <div style={{ fontSize: 12, color: "#94a3b8", textAlign: "center", padding: "24px 0" }}>No records yet</div>
          : <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <Donut slices={[{ value: presentAll, color: "#34d399" }, { value: absentAll, color: "#fca5a5" }, { value: lateAll, color: "#fbbf24" }]} />
              <div style={{ flex: 1 }}>
                {[
                  { label: "Present", value: presentAll, color: "#059669", bg: "#d1fae5" },
                  { label: "Absent",  value: absentAll,  color: "#dc2626", bg: "#fee2e2" },
                  { label: "Late",    value: lateAll,    color: "#d97706", bg: "#fef3c7" },
                ].map(item => (
                  <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: item.color, display: "inline-block" }} />
                      <span style={{ fontSize: 11.5, color: "#475569" }}>{item.label}</span>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: item.color, background: item.bg, padding: "1px 7px", borderRadius: 20 }}>
                      {Math.round((item.value / totalAll) * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
        }
      </div>

      {/* Weekly Overview — 6 cols */}
      <div style={{ ...card, gridColumn: "span 6" }}>
        <div style={secTitle}>Weekly Overview · Current Week</div>
        <WeekStrip attendance={attendance} today={today} />
      </div>

      {/* Monthly Trend — 6 cols */}
      <div style={{ ...card, gridColumn: "span 6" }}>
        <div style={secTitle}>Monthly Attendance Trend · Last 6 Months</div>
        <StackedBars data={monthlyTrend} height={80} />
      </div>

      {/* Dept-wise — 6 cols */}
      <div style={{ ...card, gridColumn: "span 6" }}>
        <div style={secTitle}>Department-wise Attendance</div>
        {deptData.length === 0
          ? <div style={{ fontSize: 12, color: "#94a3b8", textAlign: "center", padding: "20px 0" }}>No department data</div>
          : deptData.map(d => <HBar key={d.name} label={d.name} value={d.present} max={Math.max(...deptData.map(x => x.present), 1)} color="#2563eb" />)
        }
      </div>

      {/* Alerts — 6 cols */}
      <div style={{ ...card, gridColumn: "span 6" }}>
        <div style={secTitle}>Today's Attendance Alerts</div>

        <AlertSection
          title="Late Arrivals"
          items={lateAlerts}
          emptyText="No late arrivals today"
          tag="Late" tagColor="#d97706" tagBg="#fef3c7"
          detailFn={i => `Checked in at ${i.checkIn}`}
        />
        <AlertSection
          title="Missing Check-Outs"
          items={missingCheckout}
          emptyText="All employees have checked out"
          tag="Missing" tagColor="#dc2626" tagBg="#fee2e2"
          detailFn={i => `Checked in at ${i.checkIn} — no check-out recorded`}
        />
        <AlertSection
          title="Absent Today"
          items={absentToday}
          emptyText="No absences recorded today"
          tag="Absent" tagColor="#64748b" tagBg="#f1f5f9"
          detailFn={() => "Marked absent"}
        />
        <AlertSection
          title="On Leave Today"
          items={onLeaveToday}
          emptyText="No approved leaves today"
          tag="On Leave" tagColor="#7c3aed" tagBg="#ede9fe"
          detailFn={i => `${i.type}`}
        />
        <AlertSection
          title="Pending Leave Requests"
          items={pendingLeaves}
          emptyText="No pending leave requests"
          tag="Pending" tagColor="#0891b2" tagBg="#cffafe"
          detailFn={i => `${i.type} — awaiting approval`}
        />
      </div>

    </div>
  );
}
