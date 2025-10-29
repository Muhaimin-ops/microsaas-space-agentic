"use client";

import { useState, useEffect } from "react";
import MetricCard from "../components/MetricCard";
import ActivityFeed from "../components/ActivityFeed";
import LoadingSkeleton, { CardSkeleton } from "../components/LoadingSkeleton";

export default function DashboardOverview() {
  const [metrics, setMetrics] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Simulate API calls - replace with actual API endpoints
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setMetrics({
        totalIdeas: 156,
        activeBlueprints: 23,
        liveDeployments: 12,
        growthRate: 15.3,
      });

      setActivities([
        {
          id: 1,
          type: "idea_submitted",
          message: "New idea submitted: 'AI-powered invoice automation tool'",
          timestamp: new Date(Date.now() - 1000 * 60 * 5),
        },
        {
          id: 2,
          type: "blueprint_created",
          message: "Blueprint created for 'Customer feedback widget'",
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
        },
        {
          id: 3,
          type: "deployment_completed",
          message: "Successfully deployed 'Analytics Dashboard v2'",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        },
        {
          id: 4,
          type: "update",
          message: "System update: New AI model integrated",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
        },
      ]);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { icon: "💡", label: "Submit Idea", onClick: () => console.log("Submit idea") },
    { icon: "📋", label: "Create Blueprint", onClick: () => console.log("Create blueprint") },
    { icon: "🚀", label: "New Deployment", onClick: () => console.log("New deployment") },
    { icon: "📊", label: "View Analytics", onClick: () => console.log("View analytics") },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Dashboard Overview</h1>
        <button style={styles.refreshButton} onClick={fetchDashboardData}>
          🔄 Refresh
        </button>
      </div>

      {/* Metrics Grid */}
      <div style={styles.metricsGrid}>
        {loading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          <>
            <MetricCard
              title="Total Ideas"
              value={metrics?.totalIdeas || 0}
              change={8.5}
              icon="💡"
              color="#667eea"
            />
            <MetricCard
              title="Active Blueprints"
              value={metrics?.activeBlueprints || 0}
              change={12.3}
              icon="📋"
              color="#f59e0b"
            />
            <MetricCard
              title="Live Deployments"
              value={metrics?.liveDeployments || 0}
              change={-2.1}
              icon="🚀"
              color="#10b981"
            />
            <MetricCard
              title="Growth Rate"
              value={`${metrics?.growthRate || 0}%`}
              change={15.3}
              icon="📈"
              color="#8b5cf6"
            />
          </>
        )}
      </div>

      {/* Main Content Grid */}
      <div style={styles.contentGrid}>
        {/* Quick Actions */}
        <div style={styles.quickActionsCard}>
          <h2 style={styles.sectionTitle}>Quick Actions</h2>
          <div style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <button
                key={index}
                style={styles.actionButton}
                onClick={action.onClick}
              >
                <span style={styles.actionIcon}>{action.icon}</span>
                <span style={styles.actionLabel}>{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <ActivityFeed activities={activities} />
      </div>

      {/* Mini Charts Section */}
      <div style={styles.chartsSection}>
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Ideas Trend</h3>
          <div style={styles.miniChart}>
            {/* Placeholder for chart */}
            <div style={styles.chartPlaceholder}>
              📊 Chart will be rendered here
            </div>
          </div>
        </div>
        
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Conversion Funnel</h3>
          <div style={styles.miniChart}>
            {/* Placeholder for chart */}
            <div style={styles.chartPlaceholder}>
              📈 Chart will be rendered here
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1400px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#1a1f2e",
    margin: 0,
  },
  refreshButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.875rem",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    transition: "all 0.2s",
  },
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1.5rem",
    marginBottom: "2rem",
  },
  contentGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1.5rem",
    marginBottom: "2rem",
    "@media (max-width: 768px)": {
      gridTemplateColumns: "1fr",
    },
  },
  quickActionsCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "1.5rem",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  sectionTitle: {
    fontSize: "1.125rem",
    fontWeight: "600",
    color: "#1a1f2e",
    marginBottom: "1rem",
    margin: "0 0 1rem 0",
  },
  actionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "1rem",
  },
  actionButton: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "1rem",
    backgroundColor: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  actionIcon: {
    fontSize: "1.5rem",
    marginBottom: "0.5rem",
  },
  actionLabel: {
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#4b5563",
  },
  chartsSection: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "1.5rem",
    "@media (max-width: 768px)": {
      gridTemplateColumns: "1fr",
    },
  },
  chartCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "1.5rem",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  chartTitle: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#1a1f2e",
    marginBottom: "1rem",
    margin: "0 0 1rem 0",
  },
  miniChart: {
    height: "200px",
  },
  chartPlaceholder: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
    color: "#9ca3af",
    fontSize: "0.875rem",
  },
};