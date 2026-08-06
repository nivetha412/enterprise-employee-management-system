const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const STYLES = { PRESENT: "present", ABSENT: "absent", LATE: "late", LEAVE: "leave", weekend: "weekend" };
export default function EmpAttCalendar({ attendance = [] }) {
  const today = new Date(), year = today.getFullYear(), month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay(), days = new Date(year, month + 1, 0).getDate();
  const attendanceByDate = Object.fromEntries(attendance.map(row => [row.attendanceDate, row.lateArrival && row.status === "PRESENT" ? "LATE" : row.status]));
  const calendar = [...Array(firstDay).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  const statusFor = day => { if (!day) return ""; const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`; if (attendanceByDate[key]) return STYLES[attendanceByDate[key]] || ""; const column = (firstDay + day - 1) % 7; return column === 0 || column === 6 ? "weekend" : ""; };
  return <section className="attendance-calendar"><div className="attendance-card-heading"><div><h2>Attendance calendar</h2><p>Current month</p></div><strong>{today.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</strong></div><div className="attendance-calendar__week">{DAYS.map(day => <span key={day}>{day}</span>)}</div><div className="attendance-calendar__days">{calendar.map((day, index) => <span key={index} className={`${statusFor(day)} ${day === today.getDate() ? "today" : ""}`}>{day || ""}</span>)}</div><div className="attendance-calendar__legend"><span><i className="present" />Present</span><span><i className="late" />Late</span><span><i className="absent" />Absent</span><span><i className="leave" />Leave</span></div></section>;
}
