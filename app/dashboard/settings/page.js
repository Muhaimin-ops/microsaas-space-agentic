"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [apiKeys, setApiKeys] = useState({
    openai: { value: "sk-...xxxxx", visible: false },
    stripe: { value: "pk_test_...xxxxx", visible: false },
    sendgrid: { value: "SG...xxxxx", visible: false },
  });

  const [webhooks, setWebhooks] = useState([
    { id: 1, name: "Idea Created", url: "https://api.example.com/webhook/idea", active: true },
    { id: 2, name: "Blueprint Generated", url: "https://api.example.com/webhook/blueprint", active: true },
    { id: 3, name: "Deployment Complete", url: "https://api.example.com/webhook/deploy", active: false },
  ]);

  const [notifications, setNotifications] = useState({
    emailNewIdea: true,
    emailDeployment: true,
    emailWeeklyReport: false,
    pushNotifications: true,
  });

  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@microsaas.space",
    timezone: "UTC",
    language: "English",
  });

  const [activeTab, setActiveTab] = useState("api");
  const [saveStatus, setSaveStatus] = useState("");

  const toggleApiKeyVisibility = (key) => {
    setApiKeys({
      ...apiKeys,
      [key]: { ...apiKeys[key], visible: !apiKeys[key].visible },
    });
  };

  const handleSave = (section) => {
    setSaveStatus(`Saving ${section}...`);
    setTimeout(() => {
      setSaveStatus(`${section} saved successfully!`);
      setTimeout(() => setSaveStatus(""), 3000);
    }, 1000);
  };

  const addWebhook = () => {
    const newWebhook = {
      id: webhooks.length + 1,
      name: "New Webhook",
      url: "",
      active: false,
    };
    setWebhooks([...webhooks, newWebhook]);
  };

  const TabButton = ({ id, label, icon }) => (
    <button
      style={{
        ...styles.tabButton,
        ...(activeTab === id ? styles.tabButtonActive : {}),
      }}
      onClick={() => setActiveTab(id)}
    >
      <span style={styles.tabIcon}>{icon}</span>
      <span>{label}</span>
    </button>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Settings</h1>
        {saveStatus && (
          <div style={styles.saveStatus}>
            ✅ {saveStatus}
          </div>
        )}
      </div>

      <div style={styles.content}>
        <div style={styles.sidebar}>
          <TabButton id="api" label="API Keys" icon="🔑" />
          <TabButton id="webhooks" label="Webhooks" icon="🔗" />
          <TabButton id="notifications" label="Notifications" icon="🔔" />
          <TabButton id="profile" label="Profile" icon="👤" />
        </div>

        <div style={styles.mainContent}>
          {/* API Keys Section */}
          {activeTab === "api" && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>API Keys Management</h2>
              <p style={styles.sectionDescription}>
                Manage your API keys for third-party integrations. Keep these secure and never share them publicly.
              </p>
              
              <div style={styles.apiKeysGrid}>
                {Object.entries(apiKeys).map(([key, data]) => (
                  <div key={key} style={styles.apiKeyCard}>
                    <div style={styles.apiKeyHeader}>
                      <h3 style={styles.apiKeyName}>
                        {key.charAt(0).toUpperCase() + key.slice(1)} API Key
                      </h3>
                      <button
                        style={styles.visibilityButton}
                        onClick={() => toggleApiKeyVisibility(key)}
                      >
                        {data.visible ? "👁️" : "👁️‍🗨️"}
                      </button>
                    </div>
                    <input
                      type={data.visible ? "text" : "password"}
                      value={data.value}
                      onChange={(e) =>
                        setApiKeys({
                          ...apiKeys,
                          [key]: { ...data, value: e.target.value },
                        })
                      }
                      style={styles.apiKeyInput}
                    />
                    <button
                      style={styles.regenerateButton}
                      onClick={() => console.log(`Regenerate ${key} key`)}
                    >
                      🔄 Regenerate
                    </button>
                  </div>
                ))}
              </div>
              
              <button
                style={styles.saveButton}
                onClick={() => handleSave("API Keys")}
              >
                Save API Keys
              </button>
            </div>
          )}

          {/* Webhooks Section */}
          {activeTab === "webhooks" && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Webhook Configuration</h2>
              <p style={styles.sectionDescription}>
                Configure webhooks to receive real-time notifications when events occur in your application.
              </p>
              
              <div style={styles.webhooksList}>
                {webhooks.map((webhook) => (
                  <div key={webhook.id} style={styles.webhookCard}>
                    <div style={styles.webhookHeader}>
                      <input
                        type="text"
                        value={webhook.name}
                        onChange={(e) => {
                          const updated = webhooks.map((w) =>
                            w.id === webhook.id ? { ...w, name: e.target.value } : w
                          );
                          setWebhooks(updated);
                        }}
                        style={styles.webhookName}
                      />
                      <label style={styles.toggleSwitch}>
                        <input
                          type="checkbox"
                          checked={webhook.active}
                          onChange={(e) => {
                            const updated = webhooks.map((w) =>
                              w.id === webhook.id ? { ...w, active: e.target.checked } : w
                            );
                            setWebhooks(updated);
                          }}
                        />
                        <span style={styles.toggleSlider} />
                      </label>
                    </div>
                    <input
                      type="url"
                      value={webhook.url}
                      onChange={(e) => {
                        const updated = webhooks.map((w) =>
                          w.id === webhook.id ? { ...w, url: e.target.value } : w
                        );
                        setWebhooks(updated);
                      }}
                      placeholder="https://your-endpoint.com/webhook"
                      style={styles.webhookUrl}
                    />
                    <button
                      style={styles.testButton}
                      onClick={() => console.log(`Test webhook ${webhook.id}`)}
                    >
                      🧪 Test
                    </button>
                  </div>
                ))}
              </div>
              
              <div style={styles.buttonGroup}>
                <button style={styles.addButton} onClick={addWebhook}>
                  ➕ Add Webhook
                </button>
                <button
                  style={styles.saveButton}
                  onClick={() => handleSave("Webhooks")}
                >
                  Save Webhooks
                </button>
              </div>
            </div>
          )}

          {/* Notifications Section */}
          {activeTab === "notifications" && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Email Notifications</h2>
              <p style={styles.sectionDescription}>
                Choose which notifications you want to receive via email.
              </p>
              
              <div style={styles.notificationsList}>
                <div style={styles.notificationItem}>
                  <div>
                    <div style={styles.notificationLabel}>New Idea Submitted</div>
                    <div style={styles.notificationDescription}>
                      Receive an email when a new idea is submitted to the platform
                    </div>
                  </div>
                  <label style={styles.toggleSwitch}>
                    <input
                      type="checkbox"
                      checked={notifications.emailNewIdea}
                      onChange={(e) =>
                        setNotifications({ ...notifications, emailNewIdea: e.target.checked })
                      }
                    />
                    <span style={styles.toggleSlider} />
                  </label>
                </div>
                
                <div style={styles.notificationItem}>
                  <div>
                    <div style={styles.notificationLabel}>Deployment Complete</div>
                    <div style={styles.notificationDescription}>
                      Get notified when a deployment is successfully completed
                    </div>
                  </div>
                  <label style={styles.toggleSwitch}>
                    <input
                      type="checkbox"
                      checked={notifications.emailDeployment}
                      onChange={(e) =>
                        setNotifications({ ...notifications, emailDeployment: e.target.checked })
                      }
                    />
                    <span style={styles.toggleSlider} />
                  </label>
                </div>
                
                <div style={styles.notificationItem}>
                  <div>
                    <div style={styles.notificationLabel}>Weekly Report</div>
                    <div style={styles.notificationDescription}>
                      Receive a weekly summary of platform activity
                    </div>
                  </div>
                  <label style={styles.toggleSwitch}>
                    <input
                      type="checkbox"
                      checked={notifications.emailWeeklyReport}
                      onChange={(e) =>
                        setNotifications({ ...notifications, emailWeeklyReport: e.target.checked })
                      }
                    />
                    <span style={styles.toggleSlider} />
                  </label>
                </div>
                
                <div style={styles.notificationItem}>
                  <div>
                    <div style={styles.notificationLabel}>Push Notifications</div>
                    <div style={styles.notificationDescription}>
                      Enable browser push notifications for real-time updates
                    </div>
                  </div>
                  <label style={styles.toggleSwitch}>
                    <input
                      type="checkbox"
                      checked={notifications.pushNotifications}
                      onChange={(e) =>
                        setNotifications({ ...notifications, pushNotifications: e.target.checked })
                      }
                    />
                    <span style={styles.toggleSlider} />
                  </label>
                </div>
              </div>
              
              <button
                style={styles.saveButton}
                onClick={() => handleSave("Notifications")}
              >
                Save Notification Preferences
              </button>
            </div>
          )}

          {/* Profile Section */}
          {activeTab === "profile" && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Profile Settings</h2>
              <p style={styles.sectionDescription}>
                Update your personal information and preferences.
              </p>
              
              <div style={styles.profileForm}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    style={styles.input}
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Email Address</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    style={styles.input}
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Timezone</label>
                  <select
                    value={profile.timezone}
                    onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                    style={styles.select}
                  >
                    <option value="UTC">UTC</option>
                    <option value="EST">Eastern Time</option>
                    <option value="PST">Pacific Time</option>
                    <option value="GMT">GMT</option>
                    <option value="CET">Central European Time</option>
                  </select>
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Language</label>
                  <select
                    value={profile.language}
                    onChange={(e) => setProfile({ ...profile, language: e.target.value })}
                    style={styles.select}
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                  </select>
                </div>
              </div>
              
              <div style={styles.buttonGroup}>
                <button
                  style={styles.saveButton}
                  onClick={() => handleSave("Profile")}
                >
                  Save Profile
                </button>
                <button style={styles.secondaryButton}>
                  Change Password
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1200px",
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
  saveStatus: {
    padding: "0.5rem 1rem",
    backgroundColor: "#d1fae5",
    color: "#065f46",
    borderRadius: "8px",
    fontSize: "0.875rem",
    fontWeight: "500",
  },
  content: {
    display: "grid",
    gridTemplateColumns: "250px 1fr",
    gap: "2rem",
    "@media (max-width: 768px)": {
      gridTemplateColumns: "1fr",
    },
  },
  sidebar: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  tabButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.75rem 1rem",
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.95rem",
    color: "#4b5563",
    textAlign: "left",
    transition: "all 0.2s",
  },
  tabButtonActive: {
    backgroundColor: "#667eea",
    color: "white",
  },
  tabIcon: {
    fontSize: "1.25rem",
  },
  mainContent: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "2rem",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  section: {
    animation: "fadeIn 0.3s",
  },
  sectionTitle: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#1a1f2e",
    marginBottom: "0.5rem",
    margin: "0 0 0.5rem 0",
  },
  sectionDescription: {
    fontSize: "0.875rem",
    color: "#6b7280",
    marginBottom: "2rem",
  },
  apiKeysGrid: {
    display: "grid",
    gap: "1.5rem",
    marginBottom: "2rem",
  },
  apiKeyCard: {
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "1rem",
  },
  apiKeyHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.75rem",
  },
  apiKeyName: {
    fontSize: "0.95rem",
    fontWeight: "500",
    color: "#1a1f2e",
    margin: 0,
  },
  visibilityButton: {
    padding: "0.25rem",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "1.25rem",
  },
  apiKeyInput: {
    width: "100%",
    padding: "0.5rem",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    fontSize: "0.875rem",
    fontFamily: "monospace",
    marginBottom: "0.75rem",
  },
  regenerateButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#f3f4f6",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.875rem",
    color: "#4b5563",
    transition: "all 0.2s",
  },
  webhooksList: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginBottom: "1.5rem",
  },
  webhookCard: {
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "1rem",
  },
  webhookHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.75rem",
  },
  webhookName: {
    flex: 1,
    padding: "0.5rem",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    fontSize: "0.95rem",
    fontWeight: "500",
  },
  webhookUrl: {
    width: "100%",
    padding: "0.5rem",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    fontSize: "0.875rem",
    marginBottom: "0.75rem",
  },
  testButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#dbeafe",
    color: "#1e40af",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.875rem",
    fontWeight: "500",
    transition: "all 0.2s",
  },
  toggleSwitch: {
    position: "relative",
    display: "inline-block",
    width: "50px",
    height: "24px",
  },
  toggleSlider: {
    position: "absolute",
    cursor: "pointer",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#ccc",
    borderRadius: "999px",
    transition: "0.4s",
  },
  notificationsList: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginBottom: "2rem",
  },
  notificationItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
  },
  notificationLabel: {
    fontSize: "0.95rem",
    fontWeight: "500",
    color: "#1a1f2e",
    marginBottom: "0.25rem",
  },
  notificationDescription: {
    fontSize: "0.875rem",
    color: "#6b7280",
  },
  profileForm: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "1.5rem",
    marginBottom: "2rem",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#374151",
    marginBottom: "0.5rem",
  },
  input: {
    padding: "0.75rem",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    fontSize: "0.95rem",
  },
  select: {
    padding: "0.75rem",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    fontSize: "0.95rem",
    backgroundColor: "white",
    cursor: "pointer",
  },
  buttonGroup: {
    display: "flex",
    gap: "1rem",
  },
  saveButton: {
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
  addButton: {
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
  secondaryButton: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "white",
    color: "#667eea",
    border: "1px solid #667eea",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.875rem",
    fontWeight: "500",
    transition: "all 0.2s",
  },
};

// Add animation
if (typeof document !== "undefined" && !document.querySelector("#settings-animation")) {
  const style = document.createElement("style");
  style.id = "settings-animation";
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    input[type="checkbox"]:checked + .toggle-slider {
      background-color: #667eea;
    }
    
    input[type="checkbox"]:checked + .toggle-slider:before {
      transform: translateX(26px);
    }
    
    .toggle-slider:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      border-radius: 50%;
      transition: 0.4s;
    }
  `;
  document.head.appendChild(style);
}