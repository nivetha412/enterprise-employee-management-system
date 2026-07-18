import { useEffect, useState, useMemo, useCallback } from "react";
import api from "../services/api";
import MainLayout from "../layouts/MainLayout";
import { Toast } from "../styles/ui.jsx";
import DeptHeader     from "../components/departments/DeptHeader";
import DeptKPICards   from "../components/departments/DeptKPICards";
import DeptToolbar    from "../components/departments/DeptToolbar";
import DeptGrid       from "../components/departments/DeptGrid";
import DeptSidePanel  from "../components/departments/DeptSidePanel";
import DeptFormModal  from "../components/departments/DeptFormModal";
import DeptViewModal  from "../components/departments/DeptViewModal";

const EMPTY_FORM = { departmentName: "", departmentCode: "", description: "", managerName: "", location: "" };

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [employees,   setEmployees]   = useState([]);
  const [attendance,  setAttendance]  = useState([]);
  const [leaves,      setLeaves]      = useState([]);
  const [loading,     setLoading]     = useState(true);

  const [form,       setForm]       = useState(EMPTY_FORM);
  const [editingId,  setEditingId]  = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [modalOpen,  setModalOpen]  = useState(false);
  const [viewDept,   setViewDept]   = useState(null);

  const [toast,  setToast]  = useState({ message: "", type: "success" });
  const [search, setSearch] = useState("");
  const [sort,   setSort]   = useState("name-asc");
  const [filter, setFilter] = useState("all"); // all | active | inactive

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "success" }), 3000);
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [dRes, eRes, aRes, lRes] = await Promise.all([
        api.get("/departments"),
        api.get("/employees"),
        api.get("/attendance"),
        api.get("/leave"),
      ]);
      setDepartments(dRes.data);
      setEmployees(eRes.data);
      setAttendance(aRes.data);
      setLeaves(lRes.data);
    } catch {
      showToast("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Derived lookups ────────────────────────────────────────────────────────
  const empByDept = useMemo(() => {
    const map = {};
    employees.forEach(e => {
      const key = (e.department || "").toLowerCase().trim();
      if (!map[key]) map[key] = [];
      map[key].push(e);
    });
    return map;
  }, [employees]);

  const getDeptEmployees = useCallback(
    (dept) => empByDept[(dept.departmentName || "").toLowerCase().trim()] || [],
    [empByDept]
  );

  // ── CRUD ───────────────────────────────────────────────────────────────────
  const validate = () => {
    const errs = {};
    if (!form.departmentName.trim()) errs.departmentName = "Department name is required";
    return errs;
  };

  const saveDepartment = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    try {
      if (editingId) {
        await api.put(`/departments/${editingId}`, form);
        showToast("Department updated successfully");
      } else {
        await api.post("/departments", form);
        showToast("Department created successfully");
      }
      resetModal();
      fetchAll();
    } catch {
      showToast(editingId ? "Failed to update department" : "Failed to create department", "error");
    }
  };

  const deleteDepartment = async (id, name) => {
    if (!window.confirm(`Delete department "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/departments/${id}`);
      fetchAll();
      showToast("Department deleted");
      if (viewDept?.id === id) setViewDept(null);
    } catch {
      showToast("Failed to delete department", "error");
    }
  };

  // ── Modal helpers ──────────────────────────────────────────────────────────
  const openAdd = () => {
    setEditingId(null); setForm(EMPTY_FORM); setFormErrors({}); setModalOpen(true);
  };
  const openEdit = (dept) => {
    setEditingId(dept.id);
    setForm({
      departmentName: dept.departmentName || "",
      departmentCode: dept.departmentCode || "",
      description:    dept.description    || "",
      managerName:    dept.managerName    || "",
      location:       dept.location       || "",
    });
    setFormErrors({});
    setModalOpen(true);
  };
  const resetModal = () => {
    setModalOpen(false); setEditingId(null); setForm(EMPTY_FORM); setFormErrors({});
  };
  const handleFormChange = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    if (formErrors[field]) setFormErrors(e => ({ ...e, [field]: "" }));
  };

  // ── Export ─────────────────────────────────────────────────────────────────
  const handleExport = () => {
    const rows = [
      "ID,Code,Department Name,Manager,Location,Employees,Status,Created",
      ...departments.map(d => {
        const count = getDeptEmployees(d).length;
        return [d.id, d.departmentCode || "", d.departmentName, d.managerName || "",
          d.location || "", count, d.active === false ? "Inactive" : "Active",
          d.createdDate || ""].join(",");
      }),
    ];
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([rows.join("\n")], { type: "text/csv" }));
    a.download = "departments.csv";
    a.click();
    showToast("Export downloaded");
  };

  // ── Filtered + sorted ──────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = departments.filter(d => {
      const matchSearch = !search ||
        (d.departmentName || "").toLowerCase().includes(search.toLowerCase()) ||
        (d.departmentCode || "").toLowerCase().includes(search.toLowerCase()) ||
        (d.managerName    || "").toLowerCase().includes(search.toLowerCase());
      const matchFilter =
        filter === "all"      ? true :
        filter === "active"   ? d.active !== false :
        filter === "inactive" ? d.active === false : true;
      return matchSearch && matchFilter;
    });
    if (sort === "name-asc")   list = [...list].sort((a, b) => a.departmentName.localeCompare(b.departmentName));
    if (sort === "name-desc")  list = [...list].sort((a, b) => b.departmentName.localeCompare(a.departmentName));
    if (sort === "emp-desc")   list = [...list].sort((a, b) => getDeptEmployees(b).length - getDeptEmployees(a).length);
    if (sort === "emp-asc")    list = [...list].sort((a, b) => getDeptEmployees(a).length - getDeptEmployees(b).length);
    if (sort === "id-asc")     list = [...list].sort((a, b) => a.id - b.id);
    if (sort === "id-desc")    list = [...list].sort((a, b) => b.id - a.id);
    return list;
  }, [departments, search, sort, filter, getDeptEmployees]);

  // ── KPI aggregates ─────────────────────────────────────────────────────────
  const kpi = useMemo(() => ({
    total:      departments.length,
    employees:  employees.length,
    active:     departments.filter(d => d.active !== false).length,
    heads:      departments.filter(d => d.managerName?.trim()).length,
  }), [departments, employees]);

  return (
    <MainLayout>
      <Toast message={toast.message} type={toast.type} />

      <DeptFormModal
        open={modalOpen}
        editingId={editingId}
        form={form}
        errors={formErrors}
        onChange={handleFormChange}
        onSubmit={saveDepartment}
        onCancel={resetModal}
      />

      {viewDept && (
        <DeptViewModal
          dept={viewDept}
          deptEmployees={getDeptEmployees(viewDept)}
          attendance={attendance}
          leaves={leaves}
          onClose={() => setViewDept(null)}
          onEdit={(d) => { setViewDept(null); openEdit(d); }}
          onDelete={deleteDepartment}
        />
      )}

      <DeptHeader onAdd={openAdd} total={kpi.total} />

      <DeptKPICards kpi={kpi} loading={loading} />

      <DeptToolbar
        search={search} onSearch={setSearch}
        sort={sort}     onSort={setSort}
        filter={filter} onFilter={setFilter}
        onExport={handleExport}
        onRefresh={fetchAll}
        resultCount={filtered.length}
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, alignItems: "start" }}>
        <DeptGrid
          departments={filtered}
          getDeptEmployees={getDeptEmployees}
          loading={loading}
          onView={setViewDept}
          onEdit={openEdit}
          onDelete={deleteDepartment}
          onAdd={openAdd}
          search={search}
        />
        <DeptSidePanel
          departments={departments}
          getDeptEmployees={getDeptEmployees}
          onAdd={openAdd}
          onExport={handleExport}
          onRefresh={fetchAll}
        />
      </div>
    </MainLayout>
  );
}
