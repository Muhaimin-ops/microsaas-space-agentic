"use client";

import { useState, useEffect } from "react";
import StatusBadge from "../../components/StatusBadge";
import LoadingSkeleton from "../../components/LoadingSkeleton";

export default function BlueprintsPage() {
  const [blueprints, setBlueprints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [selectedBlueprint, setSelectedBlueprint] = useState(null);

  useEffect(() => {
    fetchBlueprints();
  }, []);

  const fetchBlueprints = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setBlueprints([
        {
          id: "BP-001",
          title: "E-commerce Analytics Dashboard",
          tech_stack: ["React", "Node.js", "MongoDB", "Chart.js"],
          complexity: "Medium",
          status: "active",
          description: "Complete analytics solution for e-commerce platforms with real-time metrics",
          features: ["Real-time sales tracking", "Customer behavior analytics", "Inventory management"],
          estimated_time: "2-3 weeks",
        },
        {
          id: "BP-002",
          title: "AI Content Generator",
          tech_stack: ["Next.js", "Python", "OpenAI API", "PostgreSQL"],
          complexity: "High",
          status: "active",
          description: "AI-powered content generation tool for marketing teams",
          features: ["Blog post generation", "Social media content", "SEO optimization"],
          estimated_time: "3-4 weeks",
        },
        {
          id: "BP-003",
          title: "Customer Support Chatbot",
          tech_stack: ["Vue.js", "FastAPI", "Redis", "WebSocket"],
          complexity: "Medium",
          status: "archived",
          description: "Intelligent chatbot for customer support automation",
          features: ["Natural language processing", "Ticket management", "Live chat handoff"],
          estimated_time: "2 weeks",
        },
        {
          id: "BP-004",
          title: "Invoice Management System",
          tech_stack: ["React", "Express", "MySQL", "Stripe API"],
          complexity: "Low",
          status: "active",
          description: "Automated invoice generation and payment processing",
          features: ["Invoice templates", "Payment tracking", "Client portal"],
          estimated_time: "1-2 weeks",
        },
      ]);
    } catch (error) {
      console.error("Failed to fetch blueprints:", error);
    } finally {
      setLoading(false);
    }
  };

  const getComplexityColor = (complexity) => {
    const colors = {
      Low: "#10b981",
      Medium: "#f59e0b",
      High: "#ef4444",
    };
    return colors[complexity] || "#6b7280";
  };

  const BlueprintCard = ({ blueprint }) => (
    <div style={styles.card} onClick={() => setSelectedBlueprint(blueprint)}>
      <div style={styles.cardHeader}>
        <h3 style={styles.cardTitle}>{blueprint.title}</h3>
        <StatusBadge status={blueprint.status} />
      </div>
      
      <p style={styles.cardDescription}>{blueprint.description}</p>
      
      <div style={styles.techStack}>
        {blueprint.tech_stack.slice(0, 3).map((tech, index) => (
          <span key={index} style={styles.techTag}>
            {tech}
          </span>
        ))}
        {blueprint.tech_stack.length > 3 && (
          <span style={styles.techTag}>+{blueprint.tech_stack.length - 3}</span>
        )}
      </div>
      
      <div style={styles.cardFooter}>
        <div style={styles.complexity}>
          <span style={styles.complexityLabel}>Complexity:</span>
          <span style={{ ...styles.complexityValue, color: getComplexityColor(blueprint.complexity) }}>
            {blueprint.complexity}
          </span>
        </div>
        <div style={styles.cardActions}>
          <button style={styles.actionIcon} title="Edit" onClick={(e) => { e.stopPropagation(); console.log("Edit"); }}>
            ✏️
          </button>
          <button style={styles.actionIcon} title="Deploy" onClick={(e) => { e.stopPropagation(); console.log("Deploy"); }}>
            🚀
          </button>
          <button style={styles.actionIcon} title="Archive" onClick={(e) => { e.stopPropagation(); console.log("Archive"); }}>
            📦
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Blueprints</h1>
        <div style={styles.headerActions}>
          <div style={styles.viewToggle}>
            <button
              style={{ ...styles.toggleButton, ...(viewMode === "grid" ? styles.toggleActive : {}) }}
              onClick={() => setViewMode("grid")}
            >
              ⊞ Grid
            </button>
            <button
              style={{ ...styles.toggleButton, ...(viewMode === "list" ? styles.toggleActive : {}) }}
              onClick={() => setViewMode("list")}
            >
              ☰ List
            </button>
          </div>
          <button style={styles.addButton}>
            ➕ Create Blueprint
          </button>
        </div>
      </div>

      {loading ? (
        <div style={styles.grid}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={styles.card}>
              <LoadingSkeleton height={180} />
            </div>
          ))}
        </div>
      ) : (
        <div style={viewMode === "grid" ? styles.grid : styles.list}>
          {blueprints.map((blueprint) => (
            <BlueprintCard key={blueprint.id} blueprint={blueprint} />
          ))}
        </div>
      )}

      {/* Blueprint Details Modal */}
      {selectedBlueprint && (
        <>
          <div style={styles.modalBackdrop} onClick={() => setSelectedBlueprint(null)} />
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>{selectedBlueprint.title}</h2>
              <button style={styles.closeButton} onClick={() => setSelectedBlueprint(null)}>
                ✕
              </button>
            </div>
            <div style={styles.modalContent}>
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Description</h3>
                <p>{selectedBlueprint.description}</p>
              </div>
              
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Tech Stack</h3>
                <div style={styles.techStack}>
                  {selectedBlueprint.tech_stack.map((tech, index) => (
                    <span key={index} style={styles.techTagLarge}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Features</h3>
                <ul style={styles.featuresList}>
                  {selectedBlueprint.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
              
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Details</h3>
                <div style={styles.details}>
                  <div>
                    <strong>Complexity:</strong>{" "}
                    <span style={{ color: getComplexityColor(selectedBlueprint.complexity) }}>
                      {selectedBlueprint.complexity}
                    </span>
                  </div>
                  <div>
                    <strong>Estimated Time:</strong> {selectedBlueprint.estimated_time}
                  </div>
                  <div>
                    <strong>Status:</strong> <StatusBadge status={selectedBlueprint.status} />
                  </div>
                </div>
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button style={styles.deployButton}>🚀 Deploy</button>
              <button style={styles.editButton}>✏️ Edit</button>
              <button style={styles.cancelButton} onClick={() => setSelectedBlueprint(null)}>
                Cancel
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
    alignItems: "center",
  },
  viewToggle: {
    display: "flex",
    backgroundColor: "white",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
  },
  toggleButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "white",
    border: "none",
    cursor: "pointer",
    fontSize: "0.875rem",
    transition: "all 0.2s",
  },
  toggleActive: {
    backgroundColor: "#667eea",
    color: "white",
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
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "1.5rem",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "1.5rem",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "1rem",
  },
  cardTitle: {
    fontSize: "1.125rem",
    fontWeight: "600",
    color: "#1a1f2e",
    margin: 0,
    flex: 1,
  },
  cardDescription: {
    fontSize: "0.875rem",
    color: "#6b7280",
    marginBottom: "1rem",
    lineHeight: "1.5",
  },
  techStack: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
    marginBottom: "1rem",
  },
  techTag: {
    padding: "0.25rem 0.75rem",
    backgroundColor: "#f3f4f6",
    borderRadius: "999px",
    fontSize: "0.75rem",
    color: "#4b5563",
  },
  techTagLarge: {
    padding: "0.5rem 1rem",
    backgroundColor: "#667eea",
    color: "white",
    borderRadius: "999px",
    fontSize: "0.875rem",
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px solid #f3f4f6",
    paddingTop: "1rem",
  },
  complexity: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  complexityLabel: {
    fontSize: "0.75rem",
    color: "#6b7280",
  },
  complexityValue: {
    fontSize: "0.875rem",
    fontWeight: "600",
  },
  cardActions: {
    display: "flex",
    gap: "0.5rem",
  },
  actionIcon: {
    padding: "0.25rem",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "1rem",
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
  modal: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    borderRadius: "12px",
    width: "90%",
    maxWidth: "700px",
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
    fontSize: "1.5rem",
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
  section: {
    marginBottom: "1.5rem",
  },
  sectionTitle: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#1a1f2e",
    marginBottom: "0.75rem",
    margin: "0 0 0.75rem 0",
  },
  featuresList: {
    marginLeft: "1.5rem",
    color: "#4b5563",
    lineHeight: "1.8",
  },
  details: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    fontSize: "0.95rem",
    color: "#4b5563",
  },
  modalFooter: {
    display: "flex",
    gap: "1rem",
    justifyContent: "flex-end",
    padding: "1.5rem",
    borderTop: "1px solid #e5e7eb",
  },
  deployButton: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.875rem",
    fontWeight: "500",
    transition: "all 0.2s",
  },
  editButton: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#3b82f6",
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