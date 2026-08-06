import { RiLoginBoxLine, RiLogoutBoxLine, RiTimeLine, RiCheckboxCircleLine } from "react-icons/ri";
const statusFor = record => record?.checkOutTime ? ["Completed", "#16855f", "#eaf8f1"] : record?.checkInTime ? ["In progress", "#b7791f", "#fff7e5"] : ["Not checked in", "#748398", "#f3f6f9"];
export default function EmpAttTodayCard({ record }) {
  const [status, color, bg] = statusFor(record);
  const items = [[RiLoginBoxLine, "Check in", record?.checkInTime || "—"], [RiLogoutBoxLine, "Check out", record?.checkOutTime || "Pending"], [RiTimeLine, "Working hours", record?.workingHours ? `${record.workingHours.toFixed(1)}h` : "—"], [RiCheckboxCircleLine, "Status", status]];
  return <section className="today-attendance"><div className="attendance-card-heading"><div><h2>Today’s attendance</h2><p>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}</p></div><span style={{ color, background: bg }}><i />{status}</span></div><div className="today-attendance__grid">{items.map(([Icon, label, value]) => <div key={label}><Icon /><p>{label}</p><strong>{value}</strong></div>)}</div></section>;
}
