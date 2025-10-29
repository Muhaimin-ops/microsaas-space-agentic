"use client";

export default function LoadingSkeleton({ height = 20, width = "100%", borderRadius = 4 }) {
  return (
    <div
      style={{
        ...styles.skeleton,
        height: `${height}px`,
        width: typeof width === "number" ? `${width}px` : width,
        borderRadius: `${borderRadius}px`,
      }}
    />
  );
}

export function CardSkeleton() {
  return (
    <div style={styles.card}>
      <LoadingSkeleton height={48} width={48} borderRadius={12} />
      <div style={{ marginTop: "1rem" }}>
        <LoadingSkeleton height={32} width="60%" />
        <div style={{ marginTop: "0.5rem" }}>
          <LoadingSkeleton height={16} width="80%" />
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div style={styles.table}>
      <div style={styles.tableHeader}>
        <LoadingSkeleton height={40} />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={styles.tableRow}>
          <LoadingSkeleton height={60} />
        </div>
      ))}
    </div>
  );
}

const styles = {
  skeleton: {
    backgroundColor: "#e5e7eb",
    background: "linear-gradient(90deg, #e5e7eb 0%, #f3f4f6 50%, #e5e7eb 100%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "1.5rem",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  table: {
    backgroundColor: "white",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  tableHeader: {
    padding: "1rem",
    borderBottom: "1px solid #e5e7eb",
  },
  tableRow: {
    padding: "1rem",
    borderBottom: "1px solid #f3f4f6",
  },
};

// Add animation styles to document
if (typeof document !== "undefined" && !document.querySelector("#skeleton-animation")) {
  const style = document.createElement("style");
  style.id = "skeleton-animation";
  style.textContent = `
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
  `;
  document.head.appendChild(style);
}