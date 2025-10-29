"use client";

import { useState } from "react";
import Link from "next/link";
import { resetPassword } from "../../../lib/supabase";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.successIcon}>✉️</div>
          <h1 style={styles.title}>Check Your Email</h1>
          <p style={styles.successMessage}>
            We've sent you an email with instructions to reset your password.
            Please check your inbox and spam folder.
          </p>
          <Link href="/auth/login" style={styles.backLink}>
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Reset Password</h1>
        <p style={styles.subtitle}>
          Enter your email address and we'll send you instructions to reset your password.
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          {error && (
            <div style={styles.error}>
              {error}
            </div>
          )}

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

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {}),
            }}
          >
            {loading ? "Sending..." : "Send Reset Email"}
          </button>
        </form>

        <div style={styles.footer}>
          <Link href="/auth/login" style={styles.footerLink}>
            Back to Login
          </Link>
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
    lineHeight: "1.5",
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
  footer: {
    textAlign: "center",
    marginTop: "1.5rem",
  },
  footerLink: {
    color: "#667eea",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "0.875rem",
  },
  successIcon: {
    fontSize: "3rem",
    textAlign: "center",
    marginBottom: "1rem",
  },
  successMessage: {
    color: "#64748b",
    textAlign: "center",
    marginBottom: "2rem",
    lineHeight: "1.5",
  },
  backLink: {
    display: "block",
    textAlign: "center",
    padding: "0.875rem",
    borderRadius: "0.5rem",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    textDecoration: "none",
    fontWeight: "600",
  },
};