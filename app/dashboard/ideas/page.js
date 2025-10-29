"use client";

import { useState, useEffect } from "react";
import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import { TableSkeleton } from "../../components/LoadingSkeleton";

export default function IdeasManagement() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIdea, setSelectedIdea] = useState(null);

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    try {
      // Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setIdeas([
        {
          id: "IDEA-001",
          idea_text: "AI-powered invoice automation tool for freelancers",
          score: 85,
          status: "validated",
          date: "2025-01-15",
          submitted_by: "user@example.com",
        },
        {
          id: "IDEA-002",
          idea_text: "Social media content scheduler with AI suggestions",
          score: 72,
          status: "in_progress",
          date: "2025-01-14",
          submitted_by: "john@example.com",
        },
        {
          id: "IDEA-003",
          idea_text: "Customer feedback widget for SaaS applications",
          score: 68,
          status: "draft",
          date: "2025-01-13",
          submitted_by: "sarah@example.com",
        },
        {
          id: "IDEA-004",
          idea_text: "Email marketing automation for e-commerce stores",
          score: 91,
          status: "deployed",
          date: "2025-01-12",
          submitted_by: "mike@example.com",
        },
        {
          id: "IDEA-005",
          idea_text: "Project management tool for remote teams",
          score: 79,
          status: "validated",
          date: "2025-01-11",
          submitted_by: "emma@example.com",
        },
      ]);
    } catch (error) {
      console.error("Failed to fetch ideas:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      field: "id",
      label: "ID",
      width: "100px",
    },
    {
      field: "idea_text",
      label: "Idea Text",
      render: (value) => (
        <div style={{ maxWidth: "400px", overflow: "hidden", textOverflow: "ellipsis" }}>
          {value}
        </div>
      ),
    },
    {
      field: "score",
      label: "Score",
      width: "80px",
      render: (value) => (
        <div style={{ 
          fontWeight: "bold",
          color: value >= 80 ? "#10b981" : value >= 60 ? "#f59e0b" : "#ef4444"
        }}>
          {value}
        </div>
      ),
    },
    {
      field: "status",
      label: "Status",
      width: "120px",
      render: (value) => <StatusBadge status={value} />,
    },
    {
      field: "date",
      label: "Date",
      width: "120px",
    },
    {
      field: "submitted_by",
      label: "Submitted By",
      width: "150px",
    },
  ];

  const handleAction = (action, idea) => {
    console.log(`Action: ${action}`, idea);
    // Implement action handlers
  };

  const renderActions = (row) => (
    <>
      <button
        style={styles.actionButton}
        onClick={() => setSelectedIdea(row)}
        title="View Details"
      >
        👁️
      </button>
      <button
        style={{ ...styles.actionButton, ...styles.approveButton }}
        onClick={() => handleAction("approve", row)}
        title="Approve"
      >
        ✅
      </button>
      <button
        style={{ ...styles.actionButton, ...styles.rejectButton }}
        onClick={() => handleAction("reject", row)}
        title="Reject"
      >
        ❌
      </button>
      <button
        style={{ ...styles.actionButton, ...styles.blueprintButton }}
        onClick={() => handleAction("blueprint", row)}
        title="Send to Blueprint"
      >
        📋
      </button>
    </>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Ideas Management</h1>
        <button style={styles.addButton}>
          ➕ Add New Idea
        </button>
      </div>

      {loading ? (
        <TableSkeleton rows={5} />
      ) : (
        <DataTable
          columns={columns}
          data={ideas}
          actions={renderActions}
          onRowClick={(row) => setSelectedIdea(row)}
          pageSize={10}
        />
      )}

      {/* Idea Details Modal */}
      {selectedIdea && (
        <>
          <div style={styles.modalBackdrop} onClick={() => setSelectedIdea(null)} />
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Idea Details</h2>
              <button
                style={styles.closeButton}
                onClick={() => setSelectedIdea(null)}
              >
                ✕
              </button>
            </div>
            <div style={styles.modalContent}>
              <div style={styles.detailRow}>
                <strong>ID:</strong> {selectedIdea.id}
              </div>
              <div style={styles.detailRow}>
                <strong>Idea:</strong> {selectedIdea.idea_text}
              </div>
              <div style={styles.detailRow}>
                <strong>Score:</strong> {selectedIdea.score}
              </div>
              <div style={styles.detailRow}>
                <strong>Status:</strong> <StatusBadge status={selectedIdea.status} />
              </div>
              <div style={styles.detailRow}>
                <strong>Submitted By:</strong> {selectedIdea.submitted_by}
              </div>
              <div style={styles.detailRow}>
                <strong>Date:</strong> {selectedIdea.date}
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button
                style={{ ...styles.modalButton, ...styles.primaryButton }}
                onClick={() => handleAction("approve", selectedIdea)}
              >
                Approve
              </button>
              <button
                style={{ ...styles.modalButton, ...styles.secondaryButton }}
                onClick={() => handleAction("blueprint", selectedIdea)}
              >
                Send to Blueprint
              </button>
              <button
                style={styles.modalButton}
                onClick={() => setSelectedIdea(null)}
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
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#1a1f2e",
    margin: 0,
  },
  addButton: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.875rem",
    fontWeight: "500",
    transition: "all 0.2s",
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
  approveButton: {
    color: "#10b981",
  },
  rejectButton: {
    color: "#ef4444",
  },
  blueprintButton: {
    color: "#3b82f6",
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
  modal: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    borderRadius: "12px",
    width: "90%",
    maxWidth: "600px",
    maxHeight: "80vh",
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
  detailRow: {
    marginBottom: "1rem",
    fontSize: "0.95rem",
    lineHeight: "1.5",
  },
  modalFooter: {
    display: "flex",
    gap: "1rem",
    justifyContent: "flex-end",
    padding: "1.5rem",
    borderTop: "1px solid #e5e7eb",
  },
  modalButton: {
    padding: "0.5rem 1rem",
    border: "1px solid #e5e7eb",
    backgroundColor: "white",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.875rem",
    fontWeight: "500",
    transition: "all 0.2s",
  },
  primaryButton: {
    backgroundColor: "#667eea",
    color: "white",
    border: "none",
  },
  secondaryButton: {
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
  },
};