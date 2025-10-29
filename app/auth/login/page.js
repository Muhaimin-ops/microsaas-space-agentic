"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "../../../lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to sign in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome Back</h1>
        <p style={styles.subtitle}>Sign in to your account to continue</p>

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

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
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
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div style={styles.links}>
          <Link href="/auth/reset-password" style={styles.link}>
            Forgot your password?
          </Link>
        </div>

        <div style={styles.divider}>
          <span style={styles.dividerText}>or</span>
        </div>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Don't have an account?{" "}
            <Link href="/auth/signup" style={styles.footerLink}>
              Sign up
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
  links: {
    textAlign: "center",
    marginTop: "1rem",
  },
  link: {
    color: "#667eea",
    textDecoration: "none",
    fontSize: "0.875rem",
    fontWeight: "500",
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