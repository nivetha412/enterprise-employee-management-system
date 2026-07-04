import { useEffect, useState } from "react";
import api from "../services/api";
import MainLayout from "../layouts/MainLayout";
import { s, Toast, PageHeader, StatCard, EmptyState, SectionHeader, Avatar } from "../styles/ui.jsx";
import {
  RiTimeLine, RiLoginBoxLine, RiLogoutBoxLine,
  RiDeleteBinLine, RiUserLine, RiCheckboxCircleLine,
  RiCloseCircleLine, RiAlarmWarningLine, RiCalendarCheckLine,
  RiArrowDownSLine
} from "react-icons/ri";

function Attendance() {
  const role = localStorage.getItem("role");
  const isEmployee = role === "EMPLOYEE";

  const [attendanceList, setAttendanceList] = useState([]);
  const [employees, setEmployees]           = useState([]);
  const [employeeId, setEmployeeId]         = useState("");
  const [myProfile, setMyProfile]           = useState(null);
  const [loading, setLoading]               = useState(true);
  const [toast, setToast]                   = useState({ message: "", type: "success" });

  useEffect(() => {
    if (isEmployee) {
      fetchMyProfile();
    } else {
      fetchAttendance();
      fetchEmployees();
    }
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "success" }), 3000);
  };

  const fetchMyProfile = async () => {
    try {
      const empId = localStorage.getItem("employeeId");
      if (!empId) { showToast("Employee profile not linked to your account", "error"); setLoading(false); return; }
      const res = await api.get(`/employees/${empId}`);
      setMyProfile(res.data);
      await fetchAttendanceForEmployee(res.data.id);
    } catch (error) {
      console.error(error);
      showToast("Failed to load your profile", "error");
      setLoading(false);
    }
  };

  const fetchAttendanceForEmployee = async (empId) => {
    setLoading(true);
    try {
      const res = await api.get(`/attendance/employee/${empId}`);
      setAttendanceList(res.data);
    } catch (error) {
      console.error(error);
      showToast("Failed to load attendance records", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const response = await api.get("/attendance");
      setAttendanceList(response.data);
    } catch (error) {
      console.error(error);
      showToast("Failed to load attendance records", "error");
    } finally {
      setLoading(false);
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
    const targetId = isEmployee ? myProfile?.id : employeeId;
    if (!targetId) { showToast("Please select an employee", "error"); return; }
    try {
      await api.post("/attendance/checkin", { employeeId: Number(targetId) });
      isEmployee ? fetchAttendanceForEmployee(myProfile.id) : fetchAttendance();
      showToast("Check-in recorded successfully");
    } catch (error) {
      console.error(error);
      showToast("Failed to record check-in", "error");
    }
  };

  const checkOut = async () => {
    const targetId = isEmployee ? myProfile?.id : employeeId;
    if (!targetId) { showToast("Please select an employee", "error"); return; }
    try {
      await api.post("/attendance/checkout", { employeeId: Number(targetId) });
      isEmployee ? fetchAttendanceForEmployee(myProfile.id) : fetchAttendance();
      showToast("Check-out recorded successfully");
    } catch (error) {
      console.error(error);
      showToast("Failed to record check-out", "error");
    }
  };

  const deleteAttendance = async (id) => {
    if (!window.confirm("Delete this attendance record?")) return;
    try {
      await api.delete(`/attendance/${id}`);
      isEmployee ? fetchAttendanceForEmployee(myProfile.id) : fetchAttendance();
      showToast("Record deleted");
    } catch (error) {
      console.error(error);
      showToast("Failed to delete record", "error");
    }
  };

  const presentCount = attendanceList.filter(a => a.status === "PRESENT").length;
  const absentCount  = attendanceList.filter(a => a.status === "ABSENT").length;
  const lateCount    = attendanceList.filter(a => a.lateArrival).length;
  const avgHours     = attendanceList.length
    ? (attendanceList.reduce((sum, a) => sum + (a.workingHours || 0), 0) / attendanceList.length).toFixed(1)
    : "0.0";
  const attendanceRate = attendanceList.length
    ? Math.round((presentCount / attendanceList.length) * 100)
    : 0;

  const selectedEmp = isEmployee ? myProfile : employees.find(e => String(e.id) === String(employeeId));

  const onFocus = e => { e.target.style.borderColor = "#3b82f6"; e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.12)"; };
  const onBlur  = e => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; };

  return (
    <MainLayout>
      <Toast message={toast.message} type={toast.type} />

      <PageHeader
        icon={<RiTimeLine size={22} color="#fff" />}
        title="Attendance Tracker"
        subtitle={isEmployee ? "View and record your attendance" : "Record and monitor employee check-ins and check-outs"}
        meta={
          <div style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "6px 12px", borderRadius: "20px",
            background: "#f0fdf4", border: "1px solid #bbf7d0"
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
            <span style={{ fontSize: "12px", fontWeight: 600, color: "#16a34a" }}>Live Tracking</span>
          </div>
        }
      />

      {/* Stat Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "14px", marginBottom: "22px" }}>
        <StatCard label="Total Records"  value={attendanceList.length} color="#1e40af" bg="#dbeafe" icon={<RiCalendarCheckLine color="#1e40af" size={18} />} />
        <StatCard label="Present"        value={presentCount}          color="#059669" bg="#d1fae5" icon={<RiCheckboxCircleLine color="#059669" size={18} />} />
        <StatCard label="Absent"         value={absentCount}           color="#dc2626" bg="#fee2e2" icon={<RiCloseCircleLine color="#dc2626" size={18} />} />
        <StatCard label="Late Arrivals"  value={lateCount}             color="#d97706" bg="#fef3c7" icon={<RiAlarmWarningLine color="#d97706" size={18} />} />

        <div style={{
          background: "#fff", borderRadius: "12px", padding: "14px 18px",
          border: "1px solid var(--border)", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          minWidth: "150px", flex: "1 1 150px"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 500 }}>Attendance Rate</span>
            <span style={{ fontSize: "18px", fontWeight: 700, color: attendanceRate >= 80 ? "#059669" : "#d97706" }}>
              {attendanceRate}%
            </span>
          </div>
          <div style={{ height: "6px", borderRadius: "99px", background: "#f1f5f9", overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: "99px",
              width: `${attendanceRate}%`,
              background: attendanceRate >= 80
                ? "linear-gradient(90deg, #059669, #34d399)"
                : "linear-gradient(90deg, #d97706, #fbbf24)",
              transition: "width 0.6s ease"
            }} />
          </div>
          <div style={{ fontSize: "10.5px", color: "var(--text-muted)", marginTop: "5px" }}>
            {presentCount} of {attendanceList.length} present
          </div>
        </div>

        <div style={{
          background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
          borderRadius: "12px", padding: "14px 18px",
          boxShadow: "0 4px 14px rgba(124,58,237,0.25)",
          minWidth: "150px", flex: "1 1 150px",
          display: "flex", alignItems: "center", gap: "12px"
        }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "10px",
            background: "rgba(255,255,255,0.18)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "18px", flexShrink: 0
          }}>⏱️</div>
          <div>
            <div style={{ fontSize: "20px", fontWeight: 700, color: "#fff", lineHeight: 1 }}>{avgHours}h</div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.75)", marginTop: "2px", fontWeight: 500 }}>Avg Hours / Day</div>
          </div>
        </div>
      </div>

      {/* Record Attendance Card */}
      <div style={{ ...s.card, background: "linear-gradient(135deg, #f8faff 0%, #fff 100%)", border: "1px solid #e0e7ff" }}>
        <SectionHeader title="Record Attendance" count="Quick Action" countColor="#059669" countBg="#d1fae5" />

        <div style={{ display: "flex", gap: "16px", alignItems: "stretch", flexWrap: "wrap" }}>

          {/* Employee selector — Admin/HR only */}
          {!isEmployee && (
            <div style={{ flex: "1 1 260px" }}>
              <label style={s.label}>Select Employee</label>
              <div style={{ position: "relative" }}>
                <RiUserLine size={15} color="var(--text-muted)"
                  style={{ position: "absolute", left: "11px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                <RiArrowDownSLine size={15} color="var(--text-muted)"
                  style={{ position: "absolute", right: "11px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                <select
                  style={{ ...s.select, width: "100%", paddingLeft: "32px", paddingRight: "32px", appearance: "none" }}
                  value={employeeId}
                  onChange={e => setEmployeeId(e.target.value)}
                  onFocus={onFocus} onBlur={onBlur}
                >
                  <option value="">— Choose Employee —</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName} ({emp.employeeCode || `#${emp.id}`})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Employee preview */}
          {selectedEmp ? (
            <div style={{
              display: "flex", alignItems: "center", gap: "12px",
              padding: "10px 16px", borderRadius: "12px",
              background: "#fff", border: "1.5px solid #c7d2fe",
              boxShadow: "0 2px 8px rgba(99,102,241,0.08)",
              minWidth: "200px"
            }}>
              <Avatar name={`${selectedEmp.firstName} ${selectedEmp.lastName}`} size={38} />
              <div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
                  {selectedEmp.firstName} {selectedEmp.lastName}
                </div>
                <div style={{ fontSize: "11.5px", color: "var(--text-muted)", marginTop: "1px" }}>
                  {selectedEmp.designation || selectedEmp.department || "Employee"}
                </div>
                <div style={{
                  fontSize: "10.5px", fontWeight: 600, color: "#6366f1",
                  background: "#eef2ff", padding: "1px 7px", borderRadius: "20px",
                  display: "inline-block", marginTop: "4px"
                }}>
                  {selectedEmp.employeeCode || `ID #${selectedEmp.id}`}
                </div>
              </div>
            </div>
          ) : (
            <div style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "10px 16px", borderRadius: "12px",
              background: "#f8fafc", border: "1.5px dashed var(--border)",
              minWidth: "200px", color: "var(--text-muted)", fontSize: "12.5px"
            }}>
              <RiUserLine size={18} color="var(--text-muted)" />
              No employee selected
            </div>
          )}

          {/* Divider */}
          <div style={{ width: "1px", background: "var(--border)", alignSelf: "stretch", margin: "0 4px" }} />

          {/* Action buttons */}
          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            <button
              style={{
                ...s.btnPrimary,
                background: "linear-gradient(135deg, #059669, #047857)",
                boxShadow: "0 4px 14px rgba(5,150,105,0.3)",
                padding: "10px 22px", fontSize: "13.5px"
              }}
              onClick={checkIn}
              onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <RiLoginBoxLine size={16} /> Check In
            </button>
            <button
              style={{
                ...s.btnPrimary,
                background: "linear-gradient(135deg, #0891b2, #0e7490)",
                boxShadow: "0 4px 14px rgba(8,145,178,0.3)",
                padding: "10px 22px", fontSize: "13.5px"
              }}
              onClick={checkOut}
              onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <RiLogoutBoxLine size={16} /> Check Out
            </button>
          </div>
        </div>
      </div>

      {/* Records Table */}
      <div style={s.card}>
        <SectionHeader title="Attendance Records" count={attendanceList.length} countColor="#1e40af" countBg="#dbeafe">
          {attendanceList.length > 0 && (
            <div style={{ display: "flex", gap: "8px" }}>
              <span style={{ ...s.badge("#059669", "#d1fae5"), fontSize: "11px" }}>
                <RiCheckboxCircleLine size={11} /> {presentCount} Present
              </span>
              <span style={{ ...s.badge("#dc2626", "#fee2e2"), fontSize: "11px" }}>
                <RiCloseCircleLine size={11} /> {absentCount} Absent
              </span>
            </div>
          )}
        </SectionHeader>

        <div style={{ overflowX: "auto", borderRadius: "12px", border: "1px solid var(--border)" }}>
          <table style={s.table}>
            <thead>
              <tr>
                {["#", "Employee", "Date", "Check In", "Check Out", "Hours", "Status", "Punctuality", ""].map((h, i) => (
                  <th key={i} style={{
                    ...s.th,
                    background: "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
                    ...(i === 0 ? { borderRadius: "12px 0 0 0" } : {}),
                    ...(i === 8 ? { borderRadius: "0 12px 0 0", textAlign: "center" } : {})
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(9)].map((_, j) => (
                      <td key={j} style={s.td}>
                        <div className="skeleton" style={{ height: "14px", borderRadius: "6px", width: j === 1 ? "120px" : "70px" }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : attendanceList.length === 0 ? (
                <tr><td colSpan={9}>
                  <EmptyState icon="🕐" title="No attendance records" subtitle="Use the form above to record check-ins" />
                </td></tr>
              ) : attendanceList.map((att, idx) => {
                const emp = isEmployee ? myProfile : employees.find(e => e.id === att.employeeId);
                const isPresent = att.status === "PRESENT";
                const hoursOk   = att.workingHours >= 8;
                return (
                  <tr key={att.id}
                    style={{ transition: "background 0.12s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f8faff"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>

                    <td style={{ ...s.td, width: "44px" }}>
                      <span style={{
                        fontWeight: 700, fontSize: "11px", color: "var(--text-muted)",
                        background: "#f1f5f9", padding: "2px 7px", borderRadius: "5px"
                      }}>{idx + 1}</span>
                    </td>

                    <td style={s.td}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        {emp ? (
                          <>
                            <Avatar name={`${emp.firstName} ${emp.lastName}`} size={32} />
                            <div>
                              <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
                                {emp.firstName} {emp.lastName}
                              </div>
                              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                                {emp.employeeCode || `ID #${att.employeeId}`}
                              </div>
                            </div>
                          </>
                        ) : (
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <div style={{
                              width: 32, height: 32, borderRadius: "50%",
                              background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center"
                            }}>
                              <RiUserLine size={14} color="var(--text-muted)" />
                            </div>
                            <span style={{ fontSize: "12.5px", color: "var(--text-secondary)" }}>
                              Employee #{att.employeeId}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>

                    <td style={s.td}>
                      <div style={{
                        display: "inline-flex", alignItems: "center", gap: "5px",
                        padding: "4px 10px", borderRadius: "8px",
                        background: "#f8fafc", border: "1px solid var(--border)"
                      }}>
                        <RiCalendarCheckLine size={12} color="var(--text-muted)" />
                        <span style={{ fontSize: "12.5px", fontWeight: 500, color: "var(--text-primary)" }}>
                          {att.attendanceDate}
                        </span>
                      </div>
                    </td>

                    <td style={s.td}>
                      {att.checkInTime ? (
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: "4px",
                          color: "#059669", fontWeight: 600, fontSize: "12.5px",
                          background: "#ecfdf5", padding: "3px 10px", borderRadius: "8px",
                          border: "1px solid #a7f3d0"
                        }}>
                          <RiLoginBoxLine size={12} /> {att.checkInTime}
                        </span>
                      ) : (
                        <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>—</span>
                      )}
                    </td>

                    <td style={s.td}>
                      {att.checkOutTime ? (
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: "4px",
                          color: "#0891b2", fontWeight: 600, fontSize: "12.5px",
                          background: "#ecfeff", padding: "3px 10px", borderRadius: "8px",
                          border: "1px solid #a5f3fc"
                        }}>
                          <RiLogoutBoxLine size={12} /> {att.checkOutTime}
                        </span>
                      ) : (
                        <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>—</span>
                      )}
                    </td>

                    <td style={{ ...s.td, minWidth: "90px" }}>
                      {att.workingHours ? (
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                            <span style={{ fontWeight: 700, fontSize: "13px", color: hoursOk ? "#059669" : "#d97706" }}>
                              {att.workingHours.toFixed(1)}h
                            </span>
                            <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>/ 8h</span>
                          </div>
                          <div style={{ height: "4px", borderRadius: "99px", background: "#f1f5f9", width: "60px", overflow: "hidden" }}>
                            <div style={{
                              height: "100%", borderRadius: "99px",
                              width: `${Math.min((att.workingHours / 8) * 100, 100)}%`,
                              background: hoursOk ? "#059669" : "#f59e0b",
                              transition: "width 0.4s ease"
                            }} />
                          </div>
                        </div>
                      ) : (
                        <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>—</span>
                      )}
                    </td>

                    <td style={s.td}>
                      <span style={{
                        ...s.badge(isPresent ? "#059669" : "#dc2626", isPresent ? "#d1fae5" : "#fee2e2"),
                        border: `1px solid ${isPresent ? "#a7f3d0" : "#fecaca"}`
                      }}>
                        <span style={{
                          width: "5px", height: "5px", borderRadius: "50%",
                          background: isPresent ? "#059669" : "#dc2626",
                          display: "inline-block", marginRight: "4px"
                        }} />
                        {att.status}
                      </span>
                    </td>

                    <td style={s.td}>
                      <span style={{
                        ...s.badge(att.lateArrival ? "#d97706" : "#059669", att.lateArrival ? "#fef3c7" : "#d1fae5"),
                        border: `1px solid ${att.lateArrival ? "#fde68a" : "#a7f3d0"}`
                      }}>
                        {att.lateArrival ? "⚠ Late" : "✓ On Time"}
                      </span>
                    </td>

                    <td style={{ ...s.td, textAlign: "center" }}>
                      <button
                        style={{
                          width: "30px", height: "30px", borderRadius: "8px",
                          background: "#fff5f5", border: "1px solid #fecaca",
                          color: "#dc2626", cursor: "pointer",
                          display: "inline-flex", alignItems: "center", justifyContent: "center",
                          transition: "all 0.15s"
                        }}
                        onClick={() => deleteAttendance(att.id)}
                        onMouseEnter={e => { e.currentTarget.style.background = "#fee2e2"; e.currentTarget.style.transform = "scale(1.1)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "#fff5f5"; e.currentTarget.style.transform = "scale(1)"; }}
                        title="Delete record"
                      >
                        <RiDeleteBinLine size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {attendanceList.length > 0 && (
          <div style={{
            marginTop: "14px", display: "flex", alignItems: "center",
            justifyContent: "space-between", flexWrap: "wrap", gap: "8px"
          }}>
            <div style={{ display: "flex", gap: "12px" }}>
              <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>{attendanceList.length}</span> total records
              </span>
              <span style={{ fontSize: "12px", color: "#059669", fontWeight: 600 }}>
                {attendanceRate}% attendance rate
              </span>
            </div>
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Avg working hours:</span>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#7c3aed" }}>{avgHours}h</span>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default Attendance;
