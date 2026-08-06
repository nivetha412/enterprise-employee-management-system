import { useMemo, useState } from "react";
import { RiDownloadLine, RiFileSearchLine, RiLoginBoxLine, RiLogoutBoxLine, RiSearchLine } from "react-icons/ri";

const statusLabel = record => record.lateArrival && record.status === "PRESENT" ? "LATE" : record.status;
const statusClass = status => status?.toLowerCase() || "present";

export default function EmpAttHistory({ records = [], onExport, loading }) {
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const months = useMemo(() => ["ALL", ...new Set(records.map(r => r.attendanceDate?.slice(0, 7)).filter(Boolean))], [records]);
  const filtered = useMemo(() => records.filter(record => {
    const currentStatus = statusLabel(record);
    return (!search || record.attendanceDate?.includes(search) || currentStatus.toLowerCase().includes(search.toLowerCase())) && (month === "ALL" || record.attendanceDate?.startsWith(month)) && (status === "ALL" || currentStatus === status);
  }).sort((a, b) => (b.attendanceDate || "").localeCompare(a.attendanceDate || "")), [records, search, month, status]);
  const emptyMessage = records.length ? "No attendance records found for these filters" : "No attendance records found";
  return <section className="attendance-history"><div className="attendance-history__head"><div><h2>Attendance history</h2><p>{filtered.length} record{filtered.length === 1 ? "" : "s"}</p></div><button onClick={onExport}><RiDownloadLine /> Export</button></div><div className="attendance-history__filters"><label><RiSearchLine /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search" /></label><select value={month} onChange={event => setMonth(event.target.value)}>{months.map(value => <option value={value} key={value}>{value === "ALL" ? "All months" : value}</option>)}</select><select value={status} onChange={event => setStatus(event.target.value)}>{["ALL", "PRESENT", "LATE", "ABSENT", "LEAVE", "HOLIDAY"].map(value => <option value={value} key={value}>{value === "ALL" ? "All status" : value}</option>)}</select></div>{loading ? <div className="attendance-history__loading"><span className="skeleton" /><span className="skeleton" /><span className="skeleton" /></div> : filtered.length === 0 ? <div className="attendance-history__empty"><RiFileSearchLine /><strong>{emptyMessage}</strong><span>Records will appear here once attendance is marked.</span></div> : <div className="attendance-history__table-wrap"><table><thead><tr><th>Date</th><th>Check in</th><th>Check out</th><th>Working hours</th><th>Status</th></tr></thead><tbody>{filtered.map((record, index) => { const currentStatus = statusLabel(record); return <tr key={record.id || index}><td><strong>{new Date(record.attendanceDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</strong><span>{record.attendanceDate}</span></td><td>{record.checkInTime ? <b className="time-chip time-chip--in"><RiLoginBoxLine />{record.checkInTime}</b> : "—"}</td><td>{record.checkOutTime ? <b className="time-chip time-chip--out"><RiLogoutBoxLine />{record.checkOutTime}</b> : "—"}</td><td>{record.workingHours ? `${record.workingHours.toFixed(1)}h` : "—"}</td><td><b className={`status-chip ${statusClass(currentStatus)}`}>{currentStatus}</b></td></tr>; })}</tbody></table></div>}</section>;
}
