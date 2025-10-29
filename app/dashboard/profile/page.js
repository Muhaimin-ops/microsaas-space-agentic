"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../providers/AuthProvider";
import { createBrowserClient } from "../../../lib/supabase";
import LoadingSkeleton from "../../components/LoadingSkeleton";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setLoading(false);
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const supabase = createBrowserClient();
      const { error } = await supabase
        .from("users")
        .update({ name, updated_at: new Date().toISOString() })
        .eq("id", user.id);

      if (error) throw error;

      await refreshUser();
      setMessage("Profile updated successfully!");
    } catch (error) {
      setMessage("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRoleBadgeStyle = (role) => {
    const colors = {
      founder: { bg: "#dbeafe", color: "#1e40af" },
      developer: { bg: "#dcfce7", color: "#166534" },
      marketer: { bg: "#fef3c7", color: "#92400e" },
      admin: { bg: "#fee2e2", color: "#991b1b" },
    };
    return colors[role] || colors.founder;
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!user) {
    return (
      <div style={styles.container}>
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  const roleStyle = getRoleBadgeStyle(user.role);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Profile Settings</h1>
        <p style={styles.subtitle}>Manage your account information</p>
      </div>

      <div style={styles.card}>
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Personal Information</h2>
          
          {message && (
            <div style={{
              ...styles.message,
              backgroundColor: message.includes("success") ? "#dcfce7" : "#fee2e2",
              color: message.includes("success") ? "#166534" : "#991b1b",
            }}>
              {message}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                value={user.email || ""}
                disabled
                style={{ ...styles.input, ...styles.inputDisabled }}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                style={styles.input}
                disabled={saving}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Role</label>
              <div style={styles.roleContainer}>
                <span style={{
                  ...styles.badge,
                  backgroundColor: roleStyle.bg,
                  color: roleStyle.color,
                }}>
                  {user.role || "founder"}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              style={{
                ...styles.button,
                ...(saving ? styles.buttonDisabled : {}),
              }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        <div style={styles.divider} />

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Account Details</h2>
          
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>User ID</span>
            <span style={styles.detailValue}>{user.id}</span>
          </div>

          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Member Since</span>
            <span style={styles.detailValue}>
              {formatDate(user.created_at || new Date().toISOString())}
            </span>
          </div>

          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Last Updated</span>
            <span style={styles.detailValue}>
              {formatDate(user.updated_at || user.created_at || new Date().toISOString())}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "2rem",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "#1a1f2e",
    marginBottom: "0.5rem",
  },
  subtitle: {
    color: "#64748b",
    fontSize: "1rem",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "1rem",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
  },
  section: {
    padding: "2rem",
  },
  sectionTitle: {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#1a1f2e",
    marginBottom: "1.5rem",
  },
  message: {
    padding: "0.75rem",
    borderRadius: "0.5rem",
    marginBottom: "1rem",
    fontSize: "0.875rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  label: {
    fontSize: "0.875rem",
    fontWeight: "600",
    color: "#374151",
  },
  input: {
    padding: "0.75rem",
    borderRadius: "0.5rem",
    border: "1px solid #e5e7eb",
    fontSize: "1rem",
    outline: "none",
    transition: "border-color 0.2s",
  },
  inputDisabled: {
    backgroundColor: "#f9fafb",
    cursor: "not-allowed",
    color: "#6b7280",
  },
  roleContainer: {
    display: "flex",
    alignItems: "center",
  },
  badge: {
    padding: "0.375rem 0.75rem",
    borderRadius: "0.375rem",
    fontSize: "0.875rem",
    fontWeight: "600",
    textTransform: "capitalize",
    display: "inline-block",
  },
  button: {
    padding: "0.75rem 1.5rem",
    borderRadius: "0.5rem",
    border: "none",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "opacity 0.2s",
    alignSelf: "flex-start",
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
  divider: {
    height: "1px",
    backgroundColor: "#e5e7eb",
  },
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.75rem 0",
    borderBottom: "1px solid #f3f4f6",
  },
  detailLabel: {
    fontSize: "0.875rem",
    color: "#6b7280",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: "0.875rem",
    color: "#1a1f2e",
    fontWeight: "500",
    fontFamily: "monospace",
  },
};