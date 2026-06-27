import { useEffect, useState } from "react";
import api from "../services/api";
import MainLayout from "../layouts/MainLayout";
import { s } from "../styles/ui";

function Attendance() {
  const [attendanceList, setAttendanceList] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState("");

  useEffect(() => {
    fetchAttendance();
    fetchEmployees();
  }, []);

  const fetchAttendance = async () => {
    try {
      const response = await api.get("/attendance");
      setAttendanceList(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await api.get("/employees");
      setEmployees(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const checkIn = async () => {
    if (!employeeId) { alert("Select Employee"); return; }
    try {
      await api.post("/attendance/checkin", { employeeId: Number(employeeId) });
      fetchAttendance();
    } catch (error) {
      console.error(error);
    }
  };

  const checkOut = async () => {
    if (!employeeId) { alert("Select Employee"); return; }
    try {
      await api.post("/attendance/checkout", { employeeId: Number(employeeId) });
      fetchAttendance();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteAttendance = async (id) => {
    const confirmDelete = window.confirm("Delete Attendance Record?");
    if (!confirmDelete) return;
    try {
      await api.delete(`/attendance/${id}`);
      fetchAttendance();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <MainLayout>
      <h1 style={s.pageTitle}>Attendance</h1>
      <p style={s.pageSubtitle}>Track employee check-ins and check-outs</p>

      {/* Action Card */}
      <div style={s.card}>
        <h3 style={s.sectionTitle}>⏱️ Record Attendance</h3>
        <div style={{ display: "flex", gap: "12px", alignItems: "flex-end", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 220px" }}>
            <label style={s.label}>Select Employee</label>
            <select
              style={{ ...s.select, width: "100%" }}
              value={employeeId}
              onChange={e => setEmployeeId(e.target.value)}
            >
              <option value="">— Choose Employee —</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName}
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              style={{ ...s.btnSuccess, display: "flex", alignItems: "center", gap: "6px" }}
              onClick={checkIn}
            >
              🟢 Check In
            </button>
            <button
              style={{
                padding: "9px 20px",
                background: "linear-gradient(135deg, #0891b2, #0e7490)",
                color: "#fff", border: "none",
                borderRadius: "8px", fontSize: "13px",
                fontWeight: 600, cursor: "pointer",
                display: "flex", alignItems: "center", gap: "6px"
              }}
              onClick={checkOut}
            >
              🔴 Check Out
            </button>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div style={s.card}>
        <h3 style={{ ...s.sectionTitle, marginBottom: "0" }}>
          Attendance Records
          <span style={{ marginLeft: "10px", ...s.badge("#059669", "#d1fae5"), fontSize: "12px" }}>
            {attendanceList.length}
          </span>
        </h3>
        <div style={{ overflowX: "auto", marginTop: "16px" }}>
          <table style={s.table}>
            <thead>
              <tr>
                {["ID", "Employee ID", "Date", "Check In", "Check Out", "Status", "Hours", "Late", "Actions"].map(h => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {attendanceList.map(att => (
                <tr key={att.id}
                  onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={s.td}>
                    <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>#{att.id}</span>
                  </td>
                  <td style={s.td}>{att.employeeId}</td>
                  <td style={s.td}>{att.attendanceDate}</td>
                  <td style={s.td}>
                    <span style={{ color: "var(--success)", fontWeight: 500 }}>
                      {att.checkInTime || "—"}
                    </span>
                  </td>
                  <td style={s.td}>
                    <span style={{ color: "var(--danger)", fontWeight: 500 }}>
                      {att.checkOutTime || "—"}
                    </span>
                  </td>
                  <td style={s.td}>
                    <span style={s.badge(
                      att.status === "PRESENT" ? "var(--success)" : "var(--danger)",
                      att.status === "PRESENT" ? "var(--success-bg)" : "var(--danger-bg)"
                    )}>
                      {att.status}
                    </span>
                  </td>
                  <td style={s.td}>
                    {att.workingHours ? `${att.workingHours.toFixed(1)}h` : "—"}
                  </td>
                  <td style={s.td}>
                    <span style={s.badge(
                      att.lateArrival ? "var(--warning)" : "var(--success)",
                      att.lateArrival ? "var(--warning-bg)" : "var(--success-bg)"
                    )}>
                      {att.lateArrival ? "Late" : "On Time"}
                    </span>
                  </td>
                  <td style={s.td}>
                    <button style={s.btnDanger} onClick={() => deleteAttendance(att.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {attendanceList.length === 0 && (
                <tr><td colSpan={9} style={{ ...s.td, textAlign: "center", color: "var(--text-muted)", padding: "32px" }}>
                  No attendance records found.
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}

export default Attendance;
