"use client";

export default function ActivityFeed({ activities }) {
  const getActivityIcon = (type) => {
    const icons = {
      idea_submitted: "💡",
      blueprint_created: "📋",
      deployment_started: "🚀",
      deployment_completed: "✅",
      error: "❌",
      update: "📝",
    };
    return icons[type] || "📌";
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Recent Activity</h3>
      <div style={styles.feed}>
        {activities.length === 0 ? (
          <p style={styles.empty}>No recent activity</p>
        ) : (
          activities.map((activity, index) => (
            <div key={activity.id || index} style={styles.item}>
              <div style={styles.icon}>
                {getActivityIcon(activity.type)}
              </div>
              <div style={styles.content}>
                <p style={styles.message}>{activity.message}</p>
                <span style={styles.timestamp}>
                  {getTimeAgo(activity.timestamp)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "1.5rem",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    height: "100%",
  },
  title: {
    fontSize: "1.125rem",
    fontWeight: "600",
    color: "#1a1f2e",
    marginBottom: "1rem",
    margin: "0 0 1rem 0",
  },
  feed: {
    maxHeight: "400px",
    overflowY: "auto",
  },
  item: {
    display: "flex",
    gap: "1rem",
    padding: "0.75rem 0",
    borderBottom: "1px solid #f3f4f6",
  },
  icon: {
    width: "36px",
    height: "36px",
    backgroundColor: "#f3f4f6",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.25rem",
    flexShrink: 0,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  message: {
    fontSize: "0.875rem",
    color: "#1f2937",
    margin: "0 0 0.25rem 0",
    wordBreak: "break-word",
  },
  timestamp: {
    fontSize: "0.75rem",
    color: "#9ca3af",
  },
  empty: {
    textAlign: "center",
    color: "#9ca3af",
    padding: "2rem 0",
    fontSize: "0.875rem",
  },
};