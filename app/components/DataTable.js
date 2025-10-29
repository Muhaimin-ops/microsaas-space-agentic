"use client";

import { useState } from "react";

export default function DataTable({
  columns,
  data,
  onRowClick,
  actions,
  pageSize = 10,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  // Filter data based on search
  const filteredData = data.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;
    const aValue = a[sortColumn.field];
    const bValue = b[sortColumn.field];
    const direction = sortDirection === "asc" ? 1 : -1;
    return aValue > bValue ? direction : -direction;
  });

  // Paginate data
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);

  const handleSort = (column) => {
    if (sortColumn?.field === column.field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.controls}>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              {columns.map((column) => (
                <th
                  key={column.field}
                  style={{ ...styles.headerCell, width: column.width }}
                  onClick={() => column.sortable !== false && handleSort(column)}
                >
                  <div style={styles.headerContent}>
                    {column.label}
                    {column.sortable !== false && (
                      <span style={styles.sortIcon}>
                        {sortColumn?.field === column.field
                          ? sortDirection === "asc"
                            ? " ↑"
                            : " ↓"
                          : " ↕"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {actions && <th style={styles.headerCell}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => (
              <tr
                key={row.id || index}
                style={styles.row}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((column) => (
                  <td key={column.field} style={styles.cell}>
                    {column.render ? column.render(row[column.field], row) : row[column.field]}
                  </td>
                ))}
                {actions && (
                  <td style={styles.cell}>
                    <div style={styles.actions}>
                      {actions(row)}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={styles.pagination}>
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            style={{
              ...styles.pageButton,
              ...(currentPage === 1 ? styles.pageButtonDisabled : {}),
            }}
          >
            Previous
          </button>
          <span style={styles.pageInfo}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            style={{
              ...styles.pageButton,
              ...(currentPage === totalPages ? styles.pageButtonDisabled : {}),
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "white",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  controls: {
    padding: "1rem",
    borderBottom: "1px solid #e5e7eb",
  },
  searchInput: {
    width: "100%",
    maxWidth: "320px",
    padding: "0.5rem 1rem",
    fontSize: "0.875rem",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    outline: "none",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  headerRow: {
    backgroundColor: "#f9fafb",
    borderBottom: "1px solid #e5e7eb",
  },
  headerCell: {
    padding: "1rem",
    textAlign: "left",
    fontSize: "0.875rem",
    fontWeight: "600",
    color: "#374151",
    cursor: "pointer",
    userSelect: "none",
  },
  headerContent: {
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
  },
  sortIcon: {
    opacity: 0.5,
    fontSize: "0.75rem",
  },
  row: {
    borderBottom: "1px solid #f3f4f6",
    transition: "background-color 0.15s",
    cursor: "pointer",
  },
  cell: {
    padding: "1rem",
    fontSize: "0.875rem",
    color: "#1f2937",
  },
  actions: {
    display: "flex",
    gap: "0.5rem",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
    padding: "1rem",
    borderTop: "1px solid #e5e7eb",
  },
  pageButton: {
    padding: "0.5rem 1rem",
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#667eea",
    backgroundColor: "white",
    border: "1px solid #667eea",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  pageButtonDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  pageInfo: {
    fontSize: "0.875rem",
    color: "#6b7280",
  },
};