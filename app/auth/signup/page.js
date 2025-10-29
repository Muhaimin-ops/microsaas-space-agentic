"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp } from "../../../lib/supabase";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("founder");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const roles = [
    { value: "founder", label: "Founder" },
    { value: "developer", label: "Developer" },
    { value: "marketer", label: "Marketer" },
    { value: "admin", label: "Admin" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signUp(email, password, { name, role });
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create Account</h1>
        <p style={styles.subtitle}>Start building your micro-SaaS today</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          {error && (
            <div style={styles.error}>
              {error}
            </div>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
              style={styles.input}
              disabled={loading}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={styles.input}
              disabled={loading}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Choose a strong password"
              required
              minLength={6}
              style={styles.input}
              disabled={loading}
            />
            <p style={styles.hint}>Must be at least 6 characters</p>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Your Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={styles.select}
              disabled={loading}
            >
              {roles.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {}),
            }}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div style={styles.divider}>
          <span style={styles.dividerText}>or</span>
        </div>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Already have an account?{" "}
            <Link href="/auth/login" style={styles.footerLink}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "1rem",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "1rem",
    padding: "2.5rem",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.2)",
    width: "100%",
    maxWidth: "400px",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "800",
    color: "#1a1f2e",
    marginBottom: "0.5rem",
    textAlign: "center",
  },
  subtitle: {
    color: "#64748b",
    textAlign: "center",
    marginBottom: "2rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  label: {
    fontSize: "0.875rem",
    fontWeight: "600",
    color: "#1a1f2e",
  },
  input: {
    padding: "0.75rem",
    borderRadius: "0.5rem",
    border: "1px solid #e5e7eb",
    fontSize: "1rem",
    outline: "none",
    transition: "border-color 0.2s",
    fontFamily: "inherit",
  },
  select: {
    padding: "0.75rem",
    borderRadius: "0.5rem",
    border: "1px solid #e5e7eb",
    fontSize: "1rem",
    outline: "none",
    backgroundColor: "white",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  hint: {
    fontSize: "0.75rem",
    color: "#64748b",
    margin: 0,
  },
  button: {
    padding: "0.875rem",
    borderRadius: "0.5rem",
    border: "none",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "opacity 0.2s",
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
  error: {
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    padding: "0.75rem",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
  },
  divider: {
    position: "relative",
    textAlign: "center",
    margin: "1.5rem 0",
  },
  dividerText: {
    backgroundColor: "white",
    padding: "0 0.5rem",
    color: "#94a3b8",
    fontSize: "0.875rem",
  },
  footer: {
    textAlign: "center",
  },
  footerText: {
    color: "#64748b",
    fontSize: "0.875rem",
    margin: 0,
  },
  footerLink: {
    color: "#667eea",
    textDecoration: "none",
    fontWeight: "600",
  },
};