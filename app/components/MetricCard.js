"use client";

export default function MetricCard({ title, value, change, icon, color = "#667eea" }) {
  const isPositive = change && change > 0;

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={{ ...styles.iconContainer, backgroundColor: `${color}15` }}>
          <span style={{ ...styles.icon, color }}>{icon}</span>
        </div>
        {change !== undefined && (
          <div style={{ ...styles.change, color: isPositive ? "#10b981" : "#ef4444" }}>
            {isPositive ? "↑" : "↓"} {Math.abs(change)}%
          </div>
        )}
      </div>
      <div style={styles.value}>{value}</div>
      <div style={styles.title}>{title}</div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "1.5rem",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  iconContainer: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: "1.5rem",
  },
  change: {
    fontSize: "0.875rem",
    fontWeight: "600",
  },
  value: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#1a1f2e",
    marginBottom: "0.25rem",
  },
  title: {
    fontSize: "0.875rem",
    color: "#6b7280",
    fontWeight: "500",
  },
};