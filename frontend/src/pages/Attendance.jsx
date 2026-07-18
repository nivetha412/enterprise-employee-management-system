import { useEffect, useState, useMemo } from "react";
import api from "../services/api";
import MainLayout from "../layouts/MainLayout";
import { Toast } from "../styles/ui.jsx";

import AttHeader      from "../components/attendance/AttHeader.jsx";
import AttKPICards    from "../components/attendance/AttKPICards.jsx";
import AttAnalytics   from "../components/attendance/AttAnalytics.jsx";
import AttToolbar     from "../components/attendance/AttToolbar.jsx";
import AttTable       from "../components/attendance/AttTable.jsx";
import AttDetailModal from "../components/attendance/AttDetailModal.jsx";

export default function Attendance() {
  const role       = localStorage.getItem("role");
  const isEmployee = role === "EMPLOYEE";

  const [attendance,  setAttendance]  = useState([]);
  const [employees,   setEmployees]   = useState([]);
  const [departments, setDepartments] = useState([]);
  const [leaves,      setLeaves]      = useState([]);
  const [myProfile,   setMyProfile]   = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [toast,       setToast]       = useState({ message: "", type: "success" });

  // Filters
  const [search,       setSearch]       = useState("");
  const [deptFilter,   setDeptFilter]   = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFrom,     setDateFrom]     = useState("");
  const [dateTo,       setDateTo]       = useState("");

  // Detail drawer
  const [viewRecord, setViewRecord] = useState(null);

  const today      = new Date().toISOString().slice(0, 10);
  const todayLabel = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const showToast = (msg, type = "success") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast({ message: "", type: "success" }), 3000);
  };

  useEffect(() => { isEmployee ? initEmployee() : loadAll(); }, []);

  const initEmployee = async () => {
    try {
      const empId = localStorage.getItem("employeeId");
      if (!empId) { showToast("Employee profile not linked", "error"); setLoading(false); return; }
      const [empRes, attRes, leaveRes] = await Promise.all([
        api.get(`/employees/${empId}`),
        api.get(`/attendance/employee/${empId}`),
        api.get("/leave"),
      ]);
      setMyProfile(empRes.data);
      setAttendance(attRes.data);
      setLeaves(leaveRes.data);
    } catch (err) {
      console.error(err);
      showToast("Failed to load your data", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadAll = async () => {
    setLoading(true);
    try {
      const [attRes, empRes, deptRes, leaveRes] = await Promise.all([
        api.get("/attendance"),
        api.get("/employees"),
        api.get("/departments"),
        api.get("/leave"),
      ]);
      setAttendance(attRes.data);
      setEmployees(empRes.data);
      setDepartments(deptRes.data);
      setLeaves(leaveRes.data);
    } catch (err) {
      console.error(err);
      showToast("Failed to load attendance data", "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteAttendance = async (id) => {
    if (!window.confirm("Delete this attendance record?")) return;
    try {
      await api.delete(`/attendance/${id}`);
      if (viewRecord?.id === id) setViewRecord(null);
      isEmployee ? initEmployee() : loadAll();
      showToast("Record deleted");
    } catch (err) {
      console.error(err);
      showToast("Failed to delete record", "error");
    }
  };

  // ── Export CSV ──────────────────────────────────────────────────────────────
  const handleExportCSV = () => {
    const rows = [
      ["Employee Code", "Employee Name", "Department", "Date", "Check In", "Check Out", "Working Hours", "Overtime", "Status", "Late Arrival"],
      ...filtered.map(a => {
        const emp = empList.find(e => e.id === a.employeeId);
        const ot  = a.workingHours > 8 ? (a.workingHours - 8).toFixed(1) : "";
        return [
          emp?.employeeCode || `#${a.employeeId}`,
          emp ? `${emp.firstName} ${emp.lastName}` : `Employee #${a.employeeId}`,
          emp?.department || "",
          a.attendanceDate,
          a.checkInTime  || "",
          a.checkOutTime || "",
          a.workingHours?.toFixed(1) || "",
          ot,
          a.lateArrival && a.status === "PRESENT" ? "LATE" : a.status,
          a.lateArrival ? "Yes" : "No",
        ];
      }),
    ];
    const csv  = rows.map(r => r.map(v => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = `attendance_${today}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  // ── Print ───────────────────────────────────────────────────────────────────
  const handlePrint = () => window.print();

  // ── KPI — today-scoped ──────────────────────────────────────────────────────
  const todayRecords = attendance.filter(a => String(a.attendanceDate) === today);
  const presentToday = todayRecords.filter(a => a.status === "PRESENT").length;
  const absentToday  = todayRecords.filter(a => a.status === "ABSENT").length;
  const lateToday    = todayRecords.filter(a => a.lateArrival).length;
  const onLeaveToday = leaves.filter(l =>
    l.status === "APPROVED" &&
    String(l.startDate) <= today &&
    String(l.endDate)   >= today
  ).length;
  const rateBase   = todayRecords.length > 0 ? todayRecords : attendance;
  const attRate    = rateBase.length > 0
    ? Math.round((rateBase.filter(a => a.status === "PRESENT").length / rateBase.length) * 100)
    : 0;

  const kpi = {
    total:   isEmployee ? 1 : employees.length,
    present: presentToday,
    absent:  absentToday,
    late:    lateToday,
    onLeave: onLeaveToday,
    rate:    attRate,
  };

  // ── Filtered records ────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const base = isEmployee && myProfile
      ? attendance.filter(a => a.employeeId === myProfile.id)
      : attendance;
    return base.filter(a => {
      const emp  = employees.find(e => e.id === a.employeeId);
      const name = emp ? `${emp.firstName} ${emp.lastName}`.toLowerCase() : "";
      const code = (emp?.employeeCode || "").toLowerCase();
      const dept = (emp?.department   || "").toLowerCase();
      const st   = a.lateArrival && a.status === "PRESENT" ? "LATE" : a.status;
      if (search       && !name.includes(search.toLowerCase()) && !code.includes(search.toLowerCase())) return false;
      if (deptFilter   && dept !== deptFilter.toLowerCase())   return false;
      if (statusFilter && st   !== statusFilter)               return false;
      if (dateFrom     && String(a.attendanceDate) < dateFrom) return false;
      if (dateTo       && String(a.attendanceDate) > dateTo)   return false;
      return true;
    });
  }, [attendance, employees, search, deptFilter, statusFilter, dateFrom, dateTo, isEmployee, myProfile]);

  const empList = isEmployee && myProfile ? [myProfile] : employees;

  return (
    <MainLayout>
      <Toast message={toast.message} type={toast.type} />

      <AttHeader today={todayLabel} totalRecords={attendance.length} onRefresh={isEmployee ? initEmployee : loadAll} />

      <AttKPICards kpi={kpi} loading={loading} />

      {!isEmployee && (
        <AttAnalytics
          attendance={attendance}
          employees={employees}
          departments={departments}
          leaves={leaves}
          today={today}
        />
      )}

      <AttToolbar
        search={search}             onSearch={setSearch}
        deptFilter={deptFilter}     onDeptFilter={setDeptFilter}
        statusFilter={statusFilter} onStatusFilter={setStatusFilter}
        dateFrom={dateFrom}         onDateFrom={setDateFrom}
        dateTo={dateTo}             onDateTo={setDateTo}
        departments={departments}
        onExportCSV={handleExportCSV}
        onPrint={handlePrint}
        onRefresh={isEmployee ? initEmployee : loadAll}
        resultCount={filtered.length}
      />

      <AttTable
        records={filtered}
        employees={empList}
        loading={loading}
        onView={setViewRecord}
        onDelete={deleteAttendance}
      />

      {viewRecord && (
        <AttDetailModal
          record={viewRecord}
          employees={empList}
          attendance={attendance}
          leaves={leaves}
          onClose={() => setViewRecord(null)}
        />
      )}
    </MainLayout>
  );
}
