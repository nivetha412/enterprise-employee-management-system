import { RiSearchLine, RiFilterLine, RiDownloadLine, RiRefreshLine, RiCloseLine, RiCalendarLine, RiPrinterLine, RiFileExcelLine, RiFilePdfLine } from "react-icons/ri";

const STATUS_TABS = [
  { key: "",        label: "All"     },
  { key: "PRESENT", label: "Present" },
  { key: "ABSENT",  label: "Absent"  },
  { key: "LATE",    label: "Late"    },
];

export default function AttToolbar({
  search, onSearch,
  deptFilter, onDeptFilter,
  statusFilter, onStatusFilter,
  dateFrom, onDateFrom,
  dateTo, onDateTo,
  departments,
  onExportCSV, onPrint,
  onRefresh,
  resultCount,
}) {
  const focus = e => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)"; };
  const blur  = e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; };

  const inp = {
    padding: "8px 11px", border: "1.5px solid #e2e8f0",
    borderRadius: 10, fontSize: 13, outline: "none", color: "#0f172a",
    background: "#f8fafc", fontFamily: "var(--font)",
    transition: "border-color 0.15s, box-shadow 0.15s",
  };

  const ghostBtn = (extra = {}) => ({
    display: "inline-flex", alignItems: "center", gap: 5,
    padding: "7px 13px", background: "#f8fafc",
    border: "1.5px solid #e2e8f0", borderRadius: 9,
    fontSize: 12, fontWeight: 600, color: "#475569",
    cursor: "pointer", fontFamily: "var(--font)", transition: "all 0.15s",
    flexShrink: 0, ...extra,
  });

  return (
    <div style={{
      background: "#fff", borderRadius: 14,
      border: "1px solid #e2e8f0", boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
      marginBottom: 14, overflow: "hidden",
    }}>
      {/* Row 1 — search + filters + actions */}
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", padding: "13px 16px", borderBottom: "1px solid #f1f5f9" }}>

        {/* Search */}
        <div style={{ position: "relative", flex: "1 1 190px", minWidth: 170 }}>
          <RiSearchLine size={13} color="#94a3b8" style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
          <input
            style={{ ...inp, width: "100%", paddingLeft: 30, paddingRight: search ? 28 : 11, boxSizing: "border-box" }}
            placeholder="Search by name or code…"
            value={search} onChange={e => onSearch(e.target.value)}
            onFocus={focus} onBlur={blur}
          />
          {search && (
            <button onClick={() => onSearch("")} style={{ position: "absolute", right: 7, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex", padding: 2 }}>
              <RiCloseLine size={13} />
            </button>
          )}
        </div>

        {/* Department */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <RiFilterLine size={12} color="#94a3b8" style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
          <select style={{ ...inp, paddingLeft: 24, appearance: "none", cursor: "pointer", minWidth: 145 }}
            value={deptFilter} onChange={e => onDeptFilter(e.target.value)} onFocus={focus} onBlur={blur}>
            <option value="">All Departments</option>
            {departments.map(d => <option key={d.id} value={d.departmentName}>{d.departmentName}</option>)}
          </select>
        </div>

        {/* Date range */}
        <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
          <RiCalendarLine size={12} color="#94a3b8" />
          <input type="date" style={{ ...inp, cursor: "pointer" }} value={dateFrom} onChange={e => onDateFrom(e.target.value)} onFocus={focus} onBlur={blur} />
          <span style={{ fontSize: 11, color: "#cbd5e1" }}>—</span>
          <input type="date" style={{ ...inp, cursor: "pointer" }} value={dateTo} onChange={e => onDateTo(e.target.value)} onFocus={focus} onBlur={blur} />
        </div>

        <div style={{ flex: 1 }} />

        {/* Action buttons */}
        <button onClick={onRefresh} style={ghostBtn()}
          onMouseEnter={e => e.currentTarget.style.background = "#f1f5f9"}
          onMouseLeave={e => e.currentTarget.style.background = "#f8fafc"}>
          <RiRefreshLine size={13} /> Refresh
        </button>

        <button onClick={onExportCSV} style={ghostBtn({ color: "#059669", borderColor: "#a7f3d0", background: "#f0fdf4" })}
          onMouseEnter={e => e.currentTarget.style.background = "#dcfce7"}
          onMouseLeave={e => e.currentTarget.style.background = "#f0fdf4"}>
          <RiFileExcelLine size={13} /> Export Excel
        </button>

        <button onClick={onPrint} style={ghostBtn({ color: "#dc2626", borderColor: "#fecaca", background: "#fff5f5" })}
          onMouseEnter={e => e.currentTarget.style.background = "#fee2e2"}
          onMouseLeave={e => e.currentTarget.style.background = "#fff5f5"}>
          <RiFilePdfLine size={13} /> Export PDF
        </button>

        <button onClick={onPrint} style={ghostBtn({ color: "#7c3aed", borderColor: "#ddd6fe", background: "#faf5ff" })}
          onMouseEnter={e => e.currentTarget.style.background = "#ede9fe"}
          onMouseLeave={e => e.currentTarget.style.background = "#faf5ff"}>
          <RiPrinterLine size={13} /> Print
        </button>
      </div>

      {/* Row 2 — status tabs + count */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 16px", flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", gap: 3, background: "#f1f5f9", borderRadius: 9, padding: 3 }}>
          {STATUS_TABS.map(tab => {
            const active = statusFilter === tab.key;
            return (
              <button key={tab.key} onClick={() => onStatusFilter(tab.key)} style={{
                padding: "5px 13px", borderRadius: 7, border: "none",
                fontSize: 11.5, fontWeight: 700, cursor: "pointer",
                fontFamily: "var(--font)", transition: "all 0.15s",
                background: active ? "#fff" : "transparent",
                color: active ? "#1e40af" : "#64748b",
                boxShadow: active ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
              }}>
                {tab.label}
              </button>
            );
          })}
        </div>
        <span style={{ fontSize: 11.5, color: "#94a3b8" }}>
          <span style={{ fontWeight: 700, color: "#0f172a" }}>{resultCount}</span> records
        </span>
      </div>
    </div>
  );
}
