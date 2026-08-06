import { RiCheckboxCircleLine, RiCloseCircleLine, RiAlarmWarningLine, RiTimeLine, RiPercentLine } from "react-icons/ri";
const CARDS = [
  [RiCheckboxCircleLine, "Present", "presentDays", "#16855f", "#eaf8f1"],
  [RiCloseCircleLine, "Absent", "absentDays", "#c95c5c", "#fff0f0"],
  [RiAlarmWarningLine, "Late", "lateDays", "#b7791f", "#fff7e5"],
  [RiTimeLine, "Working hours", "totalHours", "#3769c8", "#eef3ff"],
];
export default function EmpAttKPICards({ stats = {} }) {
  const { presentDays = 0, workingDays = 0 } = stats;
  const rate = workingDays ? Math.round((presentDays / workingDays) * 100) : 0;
  return <section className="attendance-kpis" aria-label="Monthly attendance summary">{CARDS.map(([Icon, label, key, color, bg]) => <div className="attendance-kpi" key={label}><span style={{ color, background: bg }}><Icon /></span><div><strong>{stats[key] || 0}{key === "totalHours" ? "h" : ""}</strong><p>{label}</p></div></div>)}<div className="attendance-kpi"><span style={{ color: "#7b5cc6", background: "#f4efff" }}><RiPercentLine /></span><div><strong>{rate}%</strong><p>Attendance rate</p></div></div></section>;
}
