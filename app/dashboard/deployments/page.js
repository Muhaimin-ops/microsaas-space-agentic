"use client";

import { useState, useEffect } from "react";
import StatusBadge from "../../components/StatusBadge";
import DataTable from "../../components/DataTable";
import { TableSkeleton } from "../../components/LoadingSkeleton";

export default function DeploymentsPage() {
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeployment, setSelectedDeployment] = useState(null);
  const [logs, setLogs] = useState("");

  useEffect(() => {
    fetchDeployments();
  }, []);

  const fetchDeployments = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setDeployments([
        {
          id: "DEP-001",
          project_name: "Invoice Manager Pro",
          url: "https://invoice-manager.app",
          status: "live",
          last_updated: "2025-01-15 14:30",
          blueprint_id: "BP-004",
          environment: "production",
          version: "v1.2.3",
        },
        {
          id: "DEP-002",
          project_name: "Analytics Dashboard",
          url: "https://analytics-dash.app",
          status: "building",
          last_updated: "2025-01-15 16:45",
          blueprint_id: "BP-001",
          environment: "staging",
          version: "v2.0.0-beta",
        },
        {
          id: "DEP-003",
          project_name: "Customer Support Bot",
          url: "https://support-bot.app",
          status: "failed",
          last_updated: "2025-01-14 09:15",
          blueprint_id: "BP-003",
          environment: "production",
          version: "v1.0.1",
        },
        {
          id: "DEP-004",
          project_name: "Content Generator",
          url: "https://content-gen.app",
          status: "live",
          last_updated: "2025-01-13 22:00",
          blueprint_id: "BP-002",
          environment: "production",
          version: "v3.1.0",
        },
      ]);
    } catch (error) {
      console.error("Failed to fetch deployments:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async (deployment) => {
    setLogs("Loading logs...");
    await new Promise((resolve) => setTimeout(resolve, 500));
    setLogs(`
[2025-01-15 16:45:23] Starting deployment for ${deployment.project_name}
[2025-01-15 16:45:24] Cloning repository...
[2025-01-15 16:45:26] Installing dependencies...
[2025-01-15 16:45:45] Building application...
[2025-01-15 16:46:12] Running tests...
[2025-01-15 16:46:45] Tests passed successfully
[2025-01-15 16:46:46] Deploying to ${deployment.environment}...
[2025-01-15 16:47:15] Deployment ${deployment.status === "live" ? "completed successfully" : deployment.status === "failed" ? "failed with errors" : "in progress"}
${deployment.status === "failed" ? "[2025-01-15 16:47:16] Error: Build failed due to missing dependencies" : ""}
[2025-01-15 16:47:17] Process completed
    `.trim());
  };

  const columns = [
    {
      field: "project_name",
      label: "Project Name",
      render: (value) => (
        <div style={{ fontWeight: "500" }}>{value}</div>
      ),
    },
    {
      field: "url",
      label: "URL",
      render: (value) => (
        <a href={value} target="_blank" rel="noopener noreferrer" style={styles.link}>
          {value.replace("https://", "")}
        </a>
      ),
    },
    {
      field: "status",
      label: "Status",
      width: "100px",
      render: (value) => <StatusBadge status={value} />,
    },
    {
      field: "environment",
      label: "Environment",
      width: "120px",
      render: (value) => (
        <span style={{
          ...styles.envBadge,
          backgroundColor: value === "production" ? "#fee2e2" : "#dbeafe",
          color: value === "production" ? "#991b1b" : "#1e40af",
        }}>
          {value}
        </span>
      ),
    },
    {
      field: "version",
      label: "Version",
      width: "100px",
    },
    {
      field: "last_updated",
      label: "Last Updated",
      width: "150px",
    },
  ];

  const renderActions = (row) => (
    <>
      <button
        style={styles.actionButton}
        onClick={() => {
          setSelectedDeployment(row);
          fetchLogs(row);
        }}
        title="View Logs"
      >
        📄
      </button>
      {row.status === "live" && (
        <button
          style={styles.actionButton}
          onClick={() => window.open(row.url, "_blank")}
          title="View Site"
        >
          🌐
        </button>
      )}
      <button
        style={{ ...styles.actionButton, color: "#f59e0b" }}
        onClick={() => console.log("Rebuild", row)}
        title="Rebuild"
      >
        🔄
      </button>
      <button
        style={{ ...styles.actionButton, color: "#6b7280" }}
        onClick={() => console.log("Configure", row)}
        title="Configure"
      >
        ⚙️
      </button>
    </>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Deployments</h1>
        <div style={styles.headerActions}>
          <button style={styles.refreshButton} onClick={fetchDeployments}>
            🔄 Refresh
          </button>
          <button style={styles.deployButton}>
            🚀 New Deployment
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, backgroundColor: "#d1fae5" }}>
            ✅
          </div>
          <div>
            <div style={styles.statValue}>
              {deployments.filter(d => d.status === "live").length}
            </div>
            <div style={styles.statLabel}>Live</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, backgroundColor: "#fed7aa" }}>
            🔨
          </div>
          <div>
            <div style={styles.statValue}>
              {deployments.filter(d => d.status === "building").length}
            </div>
            <div style={styles.statLabel}>Building</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, backgroundColor: "#fee2e2" }}>
            ❌
          </div>
          <div>
            <div style={styles.statValue}>
              {deployments.filter(d => d.status === "failed").length}
            </div>
            <div style={styles.statLabel}>Failed</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, backgroundColor: "#e0e7ff" }}>
            📊
          </div>
          <div>
            <div style={styles.statValue}>
              {deployments.length}
            </div>
            <div style={styles.statLabel}>Total</div>
          </div>
        </div>
      </div>

      {loading ? (
        <TableSkeleton rows={5} />
      ) : (
        <DataTable
          columns={columns}
          data={deployments}
          actions={renderActions}
          pageSize={10}
        />
      )}

      {/* Logs Modal */}
      {selectedDeployment && (
        <>
          <div style={styles.modalBackdrop} onClick={() => setSelectedDeployment(null)} />
          <div style={styles.logsModal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                Deployment Logs - {selectedDeployment.project_name}
              </h2>
              <button
                style={styles.closeButton}
                onClick={() => setSelectedDeployment(null)}
              >
                ✕
              </button>
            </div>
            <div style={styles.modalContent}>
              <div style={styles.logsInfo}>
                <div>
                  <strong>Deployment ID:</strong> {selectedDeployment.id}
                </div>
                <div>
                  <strong>Status:</strong> <StatusBadge status={selectedDeployment.status} />
                </div>
                <div>
                  <strong>Environment:</strong> {selectedDeployment.environment}
                </div>
                <div>
                  <strong>Version:</strong> {selectedDeployment.version}
                </div>
              </div>
              
              <div style={styles.logsContainer}>
                <pre style={styles.logs}>{logs}</pre>
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button
                style={styles.downloadButton}
                onClick={() => console.log("Download logs")}
              >
                💾 Download Logs
              </button>
              <button
                style={styles.rebuildButton}
                onClick={() => console.log("Rebuild")}
              >
                🔄 Rebuild
              </button>
              <button
                style={styles.cancelButton}
                onClick={() => setSelectedDeployment(null)}
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
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
    flexWrap: "wrap",
    gap: "1rem",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#1a1f2e",
    margin: 0,
  },
  headerActions: {
    display: "flex",
    gap: "1rem",
  },
  refreshButton: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.875rem",
    fontWeight: "500",
    transition: "all 0.2s",
  },
  deployButton: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.875rem",
    fontWeight: "500",
    transition: "all 0.2s",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "1rem",
    marginBottom: "2rem",
  },
  statCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "1rem",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  statIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.25rem",
  },
  statValue: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#1a1f2e",
  },
  statLabel: {
    fontSize: "0.75rem",
    color: "#6b7280",
    textTransform: "uppercase",
  },
  link: {
    color: "#3b82f6",
    textDecoration: "none",
  },
  envBadge: {
    padding: "0.25rem 0.75rem",
    borderRadius: "999px",
    fontSize: "0.75rem",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  actionButton: {
    padding: "0.25rem",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "1rem",
    borderRadius: "4px",
    transition: "all 0.2s",
  },
  modalBackdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 100,
  },
  logsModal: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    borderRadius: "12px",
    width: "90%",
    maxWidth: "800px",
    maxHeight: "85vh",
    overflow: "auto",
    zIndex: 101,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1.5rem",
    borderBottom: "1px solid #e5e7eb",
  },
  modalTitle: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    color: "#1a1f2e",
    margin: 0,
  },
  closeButton: {
    padding: "0.5rem",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "1.5rem",
    color: "#6b7280",
  },
  modalContent: {
    padding: "1.5rem",
  },
  logsInfo: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1rem",
    marginBottom: "1.5rem",
    padding: "1rem",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
    fontSize: "0.875rem",
  },
  logsContainer: {
    backgroundColor: "#1a1f2e",
    borderRadius: "8px",
    padding: "1rem",
    maxHeight: "400px",
    overflowY: "auto",
  },
  logs: {
    margin: 0,
    fontSize: "0.875rem",
    lineHeight: "1.6",
    color: "#10b981",
    fontFamily: "monospace",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  modalFooter: {
    display: "flex",
    gap: "1rem",
    justifyContent: "flex-end",
    padding: "1.5rem",
    borderTop: "1px solid #e5e7eb",
  },
  downloadButton: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#6b7280",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.875rem",
    fontWeight: "500",
    transition: "all 0.2s",
  },
  rebuildButton: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#f59e0b",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.875rem",
    fontWeight: "500",
    transition: "all 0.2s",
  },
  cancelButton: {
    padding: "0.75rem 1.5rem",
    border: "1px solid #e5e7eb",
    backgroundColor: "white",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.875rem",
    fontWeight: "500",
    transition: "all 0.2s",
  },
};