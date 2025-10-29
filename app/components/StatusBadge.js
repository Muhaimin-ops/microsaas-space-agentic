"use client";

export default function StatusBadge({ status }) {
  const getStatusStyles = (status) => {
    const baseStyle = {
      display: "inline-flex",
      alignItems: "center",
      padding: "0.25rem 0.75rem",
      borderRadius: "999px",
      fontSize: "0.75rem",
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    };

    const statusColors = {
      draft: {
        backgroundColor: "#f3f4f6",
        color: "#6b7280",
      },
      validated: {
        backgroundColor: "#dbeafe",
        color: "#1e40af",
      },
      in_progress: {
        backgroundColor: "#fef3c7",
        color: "#92400e",
      },
      deployed: {
        backgroundColor: "#d1fae5",
        color: "#065f46",
      },
      live: {
        backgroundColor: "#d1fae5",
        color: "#065f46",
      },
      building: {
        backgroundColor: "#fed7aa",
        color: "#9a3412",
      },
      failed: {
        backgroundColor: "#fee2e2",
        color: "#991b1b",
      },
      active: {
        backgroundColor: "#dbeafe",
        color: "#1e40af",
      },
      archived: {
        backgroundColor: "#f3f4f6",
        color: "#6b7280",
      },
    };

    return {
      ...baseStyle,
      ...(statusColors[status.toLowerCase()] || statusColors.draft),
    };
  };

  return (
    <span style={getStatusStyles(status)}>
      {status.replace(/_/g, " ")}
    </span>
  );
}