import { useEffect, useState, useMemo } from "react";
import api from "../services/api";
import MainLayout from "../layouts/MainLayout";
import { Toast } from "../styles/ui.jsx";

import LeaveHeader      from "../components/leave/LeaveHeader.jsx";
import LeaveKPICards    from "../components/leave/LeaveKPICards.jsx";
import LeaveAnalytics   from "../components/leave/LeaveAnalytics.jsx";
import LeaveToolbar     from "../components/leave/LeaveToolbar.jsx";
import LeaveTable       from "../components/leave/LeaveTable.jsx";
import LeaveDetailModal from "../components/leave/LeaveDetailModal.jsx";

export default function Leave() {
  const [leaves,      setLeaves]      = useState([]);
  const [employees,   setEmployees]   = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [toast,       setToast]       = useState({ message: "", type: "success" });

  // Filters
  const [search,       setSearch]       = useState("");
  const [deptFilter,   setDeptFilter]   = useState("");
  const [typeFilter,   setTypeFilter]   = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFrom,     setDateFrom]     = useState("");
  const [dateTo,       setDateTo]       = useState("");

  // Detail modal
  const [viewLeave, setViewLeave] = useState(null);

  const today = new Date().toISOString().slice(0, 10);

  const showToast = (msg, type = "success") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast({ message: "", type: "success" }), 3000);
  };

  const loadAll = async () => {
    setLoading(true);
    try {
      const [leaveRes, empRes, deptRes] = await Promise.all([
        api.get("/leave"),
        api.get("/employees"),
        api.get("/departments"),
      ]);
      setLeaves(leaveRes.data);
      setEmployees(empRes.data);
      setDepartments(deptRes.data);
    } catch (err) {
      console.error(err);
      showToast("Failed to load leave data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  // ── Update status (approve / reject) ───────────────────────────────────────
  const updateStatus = async (lv, status, remarks = "") => {
    try {
      await api.put(`/leave/${lv.id}`, {
        employeeId:       lv.employeeId,
        leaveType:        lv.leaveType,
        startDate:        lv.startDate,
        endDate:          lv.endDate,
        reason:           lv.reason,
        priority:         lv.priority,
        backupEmployeeId: lv.backupEmployeeId,
        status,
        managerRemarks:   remarks || lv.managerRemarks,
        hrRemarks:        lv.hrRemarks,
      });
      await loadAll();
      // Refresh the open modal with updated data
      if (viewLeave?.id === lv.id) setViewLeave(null);
      showToast(`Leave ${status.toLowerCase()} successfully`);
    } catch (err) {
      console.error(err);
      showToast("Failed to update leave status", "error");
    }
  };

  const handleApprove = (lv, remarks) => updateStatus(lv, "APPROVED", remarks);
  const handleReject  = (lv, remarks) => updateStatus(lv, "REJECTED", remarks);

  const deleteLeave = async (id) => {
    if (!window.confirm("Delete this leave request?")) return;
    try {
      await api.delete(`/leave/${id}`);
      if (viewLeave?.id === id) setViewLeave(null);
      await loadAll();
      showToast("Leave request deleted");
    } catch (err) {
      console.error(err);
      showToast("Failed to delete leave request", "error");
    }
  };

  // ── Export CSV ──────────────────────────────────────────────────────────────
  const handleExportCSV = () => {
    const getEmp = id => employees.find(e => e.id === id || e.id === Number(id));
    const rows = [
      ["ID", "Employee Code", "Employee Name", "Department", "Leave Type", "Start Date", "End Date", "Days", "Reason", "Status", "Applied Date", "Priority"],
      ...filtered.map(l => {
        const emp = getEmp(l.employeeId);
        return [
          l.id,
          emp?.employeeCode || `#${l.employeeId}`,
          emp ? `${emp.firstName} ${emp.lastName}` : `Employee #${l.employeeId}`,
          emp?.department || "",
          (l.leaveType || "").replace(/_/g, " "),
          l.startDate,
          l.endDate,
          l.totalDays ?? "",
          l.reason || "",
          l.status,
          l.appliedDate || "",
          l.priority || "",
        ];
      }),
    ];
    const csv  = rows.map(r => r.map(v => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = `leave_report_${today}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  // ── KPI ─────────────────────────────────────────────────────────────────────
  const kpi = useMemo(() => ({
    total:    leaves.length,
    pending:  leaves.filter(l => l.status === "PENDING").length,
    approved: leaves.filter(l => l.status === "APPROVED").length,
    rejected: leaves.filter(l => l.status === "REJECTED").length,
    onLeave:  leaves.filter(l =>
      l.status === "APPROVED" &&
      String(l.startDate) <= today &&
      String(l.endDate)   >= today
    ).length,
  }), [leaves, today]);

  // ── Filtered records ────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const getEmp = id => employees.find(e => e.id === id || e.id === Number(id));
    return leaves.filter(l => {
      const emp  = getEmp(l.employeeId);
      const name = emp ? `${emp.firstName} ${emp.lastName}`.toLowerCase() : "";
      const code = (emp?.employeeCode || "").toLowerCase();
      const dept = (emp?.department   || "").toLowerCase();

      if (search       && !name.includes(search.toLowerCase()) && !code.includes(search.toLowerCase())) return false;
      if (deptFilter   && dept !== deptFilter.toLowerCase())   return false;
      if (typeFilter   && l.leaveType !== typeFilter)          return false;
      if (statusFilter && l.status    !== statusFilter)        return false;
      if (dateFrom     && String(l.startDate) < dateFrom)      return false;
      if (dateTo       && String(l.endDate)   > dateTo)        return false;
      return true;
    });
  }, [leaves, employees, search, deptFilter, typeFilter, statusFilter, dateFrom, dateTo]);

  return (
    <MainLayout>
      <Toast message={toast.message} type={toast.type} />

      <LeaveHeader
        totalRequests={leaves.length}
        pendingCount={kpi.pending}
        onRefresh={loadAll}
        onExportCSV={handleExportCSV}
        onPrint={() => window.print()}
      />

      <LeaveKPICards kpi={kpi} loading={loading} />

      <LeaveAnalytics
        leaves={leaves}
        employees={employees}
        departments={departments}
        today={today}
      />

      <LeaveToolbar
        search={search}             onSearch={setSearch}
        deptFilter={deptFilter}     onDeptFilter={setDeptFilter}
        typeFilter={typeFilter}     onTypeFilter={setTypeFilter}
        statusFilter={statusFilter} onStatusFilter={setStatusFilter}
        dateFrom={dateFrom}         onDateFrom={setDateFrom}
        dateTo={dateTo}             onDateTo={setDateTo}
        departments={departments}
        resultCount={filtered.length}
      />

      <LeaveTable
        records={filtered}
        employees={employees}
        loading={loading}
        onView={setViewLeave}
        onApprove={lv => handleApprove(lv, "")}
        onReject={lv  => handleReject(lv, "")}
        onDelete={deleteLeave}
      />

      {viewLeave && (
        <LeaveDetailModal
          leave={viewLeave}
          employees={employees}
          allLeaves={leaves}
          onClose={() => setViewLeave(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </MainLayout>
  );
}
