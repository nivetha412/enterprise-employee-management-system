import DeptCard from "./DeptCard";
import { RiBuilding2Line, RiAddLine } from "react-icons/ri";

function SkeletonCard() {
  return (
    <div style={{ background: "#fff", borderRadius: 18, border: "1.5px solid #e2e8f0", overflow: "hidden" }}>
      <div className="skeleton" style={{ height: 110 }} />
      <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
        <div className="skeleton" style={{ height: 36, borderRadius: 10 }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <div className="skeleton" style={{ height: 52, borderRadius: 10 }} />
          <div className="skeleton" style={{ height: 52, borderRadius: 10 }} />
        </div>
        <div className="skeleton" style={{ height: 28, borderRadius: 8 }} />
        <div className="skeleton" style={{ height: 32, borderRadius: 9 }} />
      </div>
    </div>
  );
}

function EmptyState({ onAdd, search }) {
  return (
    <div style={{ textAlign: "center", padding: "64px 24px", background: "#fff", borderRadius: 18, border: "1.5px dashed #e2e8f0", gridColumn: "1 / -1" }}>
      <div style={{
        width: 80, height: 80, borderRadius: 22, background: "linear-gradient(135deg,#f1f5f9,#e2e8f0)",
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 18px", border: "1px solid #e2e8f0",
        boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
      }}>
        <RiBuilding2Line size={36} color="#94a3b8" />
      </div>
      <div style={{ fontSize: 16, fontWeight: 700, color: "#475569", marginBottom: 6 }}>
        {search ? `No departments match "${search}"` : "No departments yet"}
      </div>
      <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 24 }}>
        {search ? "Try a different search term or clear filters" : "Create your first department to get started"}
      </div>
      {!search && (
        <button onClick={onAdd} style={{
          display: "inline-flex", alignItems: "center", gap: 7,
          padding: "10px 24px", background: "linear-gradient(135deg,#1e40af,#3b82f6)",
          color: "#fff", border: "none", borderRadius: 11, fontSize: 13.5,
          fontWeight: 700, cursor: "pointer", fontFamily: "var(--font)",
          boxShadow: "0 4px 16px rgba(37,99,235,0.35)",
        }}>
          <RiAddLine size={16} /> Add Department
        </button>
      )}
    </div>
  );
}

export default function DeptGrid({ departments, getDeptEmployees, loading, onView, onEdit, onDelete, onAdd, search }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 18 }}>
      {loading
        ? [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
        : departments.length === 0
          ? <EmptyState onAdd={onAdd} search={search} />
          : departments.map((dept, i) => (
              <DeptCard
                key={dept.id}
                dept={dept}
                index={i}
                deptEmployees={getDeptEmployees(dept)}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
      }
    </div>
  );
}
