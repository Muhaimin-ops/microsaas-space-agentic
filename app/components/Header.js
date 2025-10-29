"use client";

import { useState } from "react";

export default function Header({ onMenuClick, title = "Dashboard" }) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showProfile, setShowProfile] = useState(false);

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
            <div style={styles.avatar}>A</div>
            <span style={styles.profileName}>Admin</span>
            <span style={styles.chevron}>▼</span>
          </button>

          {showProfile && (
            <div style={styles.dropdown}>
              <a href="#profile" style={styles.dropdownItem}>
                👤 Profile
              </a>
              <a href="#logout" style={styles.dropdownItem}>
                🚪 Logout
              </a>
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
    minWidth: "150px",
    overflow: "hidden",
  },
  dropdownItem: {
    display: "block",
    padding: "0.75rem 1rem",
    color: "#1a1f2e",
    textDecoration: "none",
    transition: "background-color 0.2s",
    fontSize: "0.95rem",
  },
};