import { RiLoginBoxLine, RiLogoutBoxLine } from "react-icons/ri";

export default function EmpAttBanner({ todayRecord, onCheckIn, onCheckOut, loading }) {
  const name = (localStorage.getItem("email") || "Employee").split("@")[0];
  const displayName = name.charAt(0).toUpperCase() + name.slice(1);
  const checkedIn = Boolean(todayRecord?.checkInTime);
  const checkedOut = Boolean(todayRecord?.checkOutTime);
  const status = checkedOut ? "Completed" : checkedIn ? "In progress" : "Not checked in";
  return <header className="attendance-banner">
    <div className="attendance-banner__identity"><div className="attendance-banner__avatar">{displayName.slice(0, 2).toUpperCase()}</div><div><p>Employee attendance</p><h1>{displayName}</h1></div></div>
    <div className="attendance-banner__date">{new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</div>
    <span className={`attendance-banner__status ${checkedIn ? "is-active" : ""}`}><i />{status}</span>
    <div className="attendance-banner__actions"><button onClick={onCheckIn} disabled={loading || checkedIn} className="attendance-action attendance-action--in"><RiLoginBoxLine /> {loading ? "Saving…" : "Check in"}</button><button onClick={onCheckOut} disabled={loading || !checkedIn || checkedOut} className="attendance-action attendance-action--out"><RiLogoutBoxLine /> {loading ? "Saving…" : "Check out"}</button></div>
  </header>;
}
