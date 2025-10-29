"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={styles.container}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div style={styles.mainContent}>
        <Header 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
          title="Dashboard"
        />
        
        <main style={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f9fafb",
  },
  mainContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    marginLeft: 0,
  },
  content: {
    flex: 1,
    padding: "1.5rem",
    overflowY: "auto",
  },
};

// Add responsive styles
if (typeof document !== "undefined" && !document.querySelector("#dashboard-responsive-styles")) {
  const style = document.createElement("style");
  style.id = "dashboard-responsive-styles";
  style.textContent = `
    @media (min-width: 768px) {
      #dashboard-main-content {
        margin-left: 260px !important;
      }
      #dashboard-sidebar {
        transform: translateX(0) !important;
      }
      #sidebar-backdrop {
        display: none !important;
      }
    }
    
    @media (max-width: 767px) {
      #dashboard-sidebar:not(.open) {
        transform: translateX(-100%) !important;
      }
      #dashboard-menu-button {
        display: flex !important;
      }
    }
  `;
  document.head.appendChild(style);
}