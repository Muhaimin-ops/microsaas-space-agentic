"use client";

import { useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import { useRouter } from "next/navigation";

export default function Header({ onMenuClick, title = "Dashboard" }) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();

  const getUserInitials = () => {
    if (!user) return "?";
    if (user.name) {
      return user.name
        .split(" ")
        .map(word => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return user.email ? user.email[0].toUpperCase() : "U";
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

  const handleLogout = async () => {
    setShowProfile(false);
    await signOut();
  };

  const handleProfile = () => {
    setShowProfile(false);
    router.push("/dashboard/profile");
  };

  const roleStyle = user?.role ? getRoleBadgeStyle(user.role) : null;

  return (
    <header style={styles.header}>
      <div style={styles.leftSection}>
        <button
          onClick={onMenuClick}
          style={styles.menuButton}
          aria-label="Toggle menu"
        >
          ☰
        </button>
        <h1 style={styles.title}>{title}</h1>
      </div>

      <div style={styles.rightSection}>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          style={styles.iconButton}
          title="Toggle theme"
        >
          {isDarkMode ? "🌙" : "☀️"}
        </button>

        <button
          style={styles.iconButton}
          title="Notifications"
        >
          🔔
          <span style={styles.badge}>3</span>
        </button>

        <div style={styles.profileContainer}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            style={styles.profileButton}
          >
            <div style={styles.avatar}>{getUserInitials()}</div>
            <div style={styles.profileInfo}>
              <span style={styles.profileName}>
                {user?.name || user?.email?.split("@")[0] || "User"}
              </span>
              {user?.role && (
                <span style={{
                  ...styles.roleBadge,
                  backgroundColor: roleStyle.bg,
                  color: roleStyle.color,
                }}>
                  {user.role}
                </span>
              )}
            </div>
            <span style={styles.chevron}>▼</span>
          </button>

          {showProfile && (
            <div style={styles.dropdown}>
              <div style={styles.dropdownHeader}>
                <div style={styles.dropdownEmail}>{user?.email}</div>
              </div>
              <button 
                onClick={handleProfile}
                style={styles.dropdownButton}
              >
                👤 Profile
              </button>
              <button 
                onClick={handleLogout}
                style={styles.dropdownButton}
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 1.5rem",
    backgroundColor: "white",
    borderBottom: "1px solid #e5e7eb",
    position: "sticky",
    top: 0,
    zIndex: 30,
  },
  leftSection: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  menuButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    border: "none",
    backgroundColor: "transparent",
    fontSize: "1.5rem",
    cursor: "pointer",
    borderRadius: "8px",
    transition: "background-color 0.2s",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#1a1f2e",
    margin: 0,
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  iconButton: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    border: "none",
    backgroundColor: "transparent",
    fontSize: "1.25rem",
    cursor: "pointer",
    borderRadius: "8px",
    transition: "background-color 0.2s",
  },
  badge: {
    position: "absolute",
    top: "5px",
    right: "5px",
    backgroundColor: "#ef4444",
    color: "white",
    borderRadius: "50%",
    width: "18px",
    height: "18px",
    fontSize: "0.7rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },
  profileContainer: {
    position: "relative",
  },
  profileButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 0.75rem",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    borderRadius: "8px",
    transition: "background-color 0.2s",
  },
  avatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: "#667eea",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },
  profileName: {
    fontSize: "0.95rem",
    fontWeight: "500",
    color: "#1a1f2e",
    display: "block",
  },
  chevron: {
    fontSize: "0.7rem",
    color: "#6b7280",
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    right: 0,
    marginTop: "0.5rem",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    minWidth: "200px",
    overflow: "hidden",
  },
  dropdownHeader: {
    padding: "0.75rem 1rem",
    borderBottom: "1px solid #e5e7eb",
    backgroundColor: "#f9fafb",
  },
  dropdownEmail: {
    fontSize: "0.875rem",
    color: "#6b7280",
    fontWeight: "500",
  },
  dropdownButton: {
    display: "block",
    width: "100%",
    padding: "0.75rem 1rem",
    color: "#1a1f2e",
    backgroundColor: "transparent",
    border: "none",
    textAlign: "left",
    fontSize: "0.95rem",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  dropdownItem: {
    display: "block",
    padding: "0.75rem 1rem",
    color: "#1a1f2e",
    textDecoration: "none",
    transition: "background-color 0.2s",
    fontSize: "0.95rem",
  },
  profileInfo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "0.25rem",
  },
  roleBadge: {
    padding: "0.125rem 0.375rem",
    borderRadius: "0.25rem",
    fontSize: "0.7rem",
    fontWeight: "600",
    textTransform: "capitalize",
  },
};