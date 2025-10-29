"use client";

import { useState } from "react";
import Link from "next/link";

export default function Sidebar({ isOpen, onClose }) {
  const [activeItem, setActiveItem] = useState("overview");

  const menuItems = [
    { id: "overview", label: "Overview", icon: "📊", href: "/dashboard" },
    { id: "ideas", label: "Ideas", icon: "💡", href: "/dashboard/ideas" },
    { id: "blueprints", label: "Blueprints", icon: "📋", href: "/dashboard/blueprints" },
    { id: "deployments", label: "Deployments", icon: "🚀", href: "/dashboard/deployments" },
    { id: "analytics", label: "Analytics", icon: "📈", href: "/dashboard/analytics" },
    { id: "settings", label: "Settings", icon: "⚙️", href: "/dashboard/settings" },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          style={styles.backdrop}
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside
        style={{
          ...styles.sidebar,
          ...(isOpen ? styles.sidebarOpen : styles.sidebarClosed),
        }}
      >
        <div style={styles.logo}>
          <span style={styles.logoIcon}>🚀</span>
          <span style={styles.logoText}>Micro-SaaS</span>
        </div>

        <nav style={styles.nav}>
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              style={{
                ...styles.navItem,
                ...(activeItem === item.id ? styles.navItemActive : {}),
              }}
              onClick={() => setActiveItem(item.id)}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              <span style={styles.navLabel}>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div style={styles.footer}>
          <div style={styles.version}>v1.0.0</div>
        </div>
      </aside>
    </>
  );
}

const styles = {
  backdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 40,
    display: "block",
  },
  sidebar: {
    position: "fixed",
    top: 0,
    left: 0,
    bottom: 0,
    width: "260px",
    backgroundColor: "#1a1f2e",
    color: "white",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.3s ease",
    zIndex: 50,
    borderRight: "1px solid rgba(255, 255, 255, 0.1)",
  },
  sidebarOpen: {
    transform: "translateX(0)",
  },
  sidebarClosed: {
    transform: "translateX(-100%)",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    padding: "1.5rem",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  },
  logoIcon: {
    fontSize: "2rem",
    marginRight: "0.5rem",
  },
  logoText: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  nav: {
    flex: 1,
    padding: "1rem 0",
    overflowY: "auto",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    padding: "0.875rem 1.5rem",
    color: "rgba(255, 255, 255, 0.7)",
    textDecoration: "none",
    transition: "all 0.2s",
    cursor: "pointer",
  },
  navItemActive: {
    backgroundColor: "rgba(103, 126, 234, 0.15)",
    color: "white",
    borderLeft: "3px solid #667eea",
  },
  navIcon: {
    fontSize: "1.25rem",
    marginRight: "0.875rem",
    minWidth: "1.5rem",
  },
  navLabel: {
    fontSize: "0.95rem",
    fontWeight: "500",
  },
  footer: {
    padding: "1.5rem",
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
  },
  version: {
    fontSize: "0.75rem",
    color: "rgba(255, 255, 255, 0.5)",
    textAlign: "center",
  },
};