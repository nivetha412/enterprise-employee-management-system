import { RiSearchLine, RiArrowUpDownLine, RiDownloadLine, RiRefreshLine, RiCloseLine } from "react-icons/ri";

const FILTER_TABS = [
  { key: "all",      label: "All" },
  { key: "active",   label: "Active" },
  { key: "inactive", label: "Inactive" },
];

export default function DeptToolbar({ search, onSearch, sort, onSort, filter, onFilter, onExport, onRefresh, resultCount }) {
  const hasFilters = search || filter !== "all";

  return (
    <div style={{
      background: "#fff", borderRadius: 16, padding: "14px 18px",
      border: "1.5px solid #e2e8f0", boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
      marginBottom: 20, display: "flex", flexDirection: "column", gap: 12,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        {/* Search */}
        <div style={{ position: "relative", flex: "1 1 240px" }}>
          <RiSearchLine size={15} color="#94a3b8" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
          <input
            value={search}
            onChange={e => onSearch(e.target.value)}
            placeholder="Search by name, code, or manager…"
            style={{
              width: "100%", padding: "9px 12px 9px 36px",
              border: "1.5px solid #e2e8f0", borderRadius: 11,
              fontSize: 13, outline: "none", fontFamily: "var(--font)",
              background: "#f8fafc", color: "#0f172a",
              transition: "border-color 0.15s, box-shadow 0.15s",
              boxSizing: "border-box",
            }}
            onFocus={e => { e.target.style.borderColor = "#3b82f6"; e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.1)"; }}
            onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
          />
          {search && (
            <button onClick={() => onSearch("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex", padding: 2 }}>
              <RiCloseLine size={14} />
            </button>
          )}
        </div>

        {/* Sort */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <RiArrowUpDownLine size={14} color="#64748b" />
          <select
            value={sort}
            onChange={e => onSort(e.target.value)}
            style={{ padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 11, fontSize: 12.5, outline: "none", background: "#f8fafc", color: "#475569", cursor: "pointer", fontFamily: "var(--font)" }}
          >
            <option value="name-asc">Name A → Z</option>
            <option value="name-desc">Name Z → A</option>
            <option value="emp-desc">Most Employees</option>
            <option value="emp-asc">Fewest Employees</option>
            <option value="id-desc">Newest First</option>
            <option value="id-asc">Oldest First</option>
          </select>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
          {[
            { fn: onExport,  icon: <RiDownloadLine size={14} />,  label: "Export",  color: "#059669", bg: "#ecfdf5", border: "#6ee7b7" },
            { fn: onRefresh, icon: <RiRefreshLine size={14} />,   label: "Refresh", color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
          ].map(({ fn, icon, label, color, bg, border }) => (
            <button key={label} onClick={fn} style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "8px 14px", borderRadius: 10, border: `1.5px solid ${border}`,
              background: bg, color, fontSize: 12.5, fontWeight: 600,
              cursor: "pointer", fontFamily: "var(--font)", transition: "all 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = `0 4px 12px ${color}22`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              {icon} {label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter tabs + result count */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", gap: 4, background: "#f1f5f9", borderRadius: 10, padding: 3 }}>
          {FILTER_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => onFilter(tab.key)}
              style={{
                padding: "5px 14px", borderRadius: 8, border: "none",
                fontSize: 12.5, fontWeight: 600, cursor: "pointer",
                fontFamily: "var(--font)", transition: "all 0.15s",
                background: filter === tab.key ? "#fff" : "transparent",
                color: filter === tab.key ? "#1e40af" : "#64748b",
                boxShadow: filter === tab.key ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {hasFilters && (
            <button onClick={() => { onSearch(""); onFilter("all"); }} style={{ fontSize: 11.5, color: "#64748b", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
              <RiCloseLine size={13} /> Clear filters
            </button>
          )}
          <span style={{ fontSize: 12, color: "#94a3b8" }}>
            <strong style={{ color: "#475569" }}>{resultCount}</strong> department{resultCount !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </div>
  );
}
