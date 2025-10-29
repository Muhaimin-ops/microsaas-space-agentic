'use client';

import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [ideaText, setIdeaText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [ideaSubmitted, setIdeaSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    
    const n8nHost = process.env.NEXT_PUBLIC_N8N_HOST;
    if (n8nHost) {
      try {
        await fetch(`${n8nHost}/webhook/microsaas-space/newsletter`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
      } catch (error) {
        console.warn('Newsletter signup webhook failed:', error);
      }
    }
    
    setSubmitted(true);
    setEmail('');
  };

  const handleIdeaSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const response = await fetch('/api/agents/idea', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idea_text: ideaText,
          source: 'landing_page',
          submitted_by: email || 'anonymous'
        }),
      });

      if (response.ok) {
        setIdeaSubmitted(true);
        setIdeaText('');
      }
    } catch (error) {
      console.error('Failed to submit idea:', error);
      alert('Failed to submit idea. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <main style={styles.main}>
        <div style={styles.hero}>
          <h1 style={styles.title}>
            Build Your Micro-SaaS Product
            <br />
            <span style={styles.gradient}>Without Writing Code</span>
          </h1>
          
          <p style={styles.subtitle}>
            A universal AI-driven platform empowering non-technical founders to build,
            launch, and automate their micro-SaaS products effortlessly.
          </p>

          <form onSubmit={handleNewsletterSubmit} style={styles.form}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
            <button type="submit" style={styles.button}>
              Get Early Access
            </button>
          </form>

          {submitted && (
            <p style={styles.success}>
              ✅ Thanks for signing up! We'll be in touch soon.
            </p>
          )}
        </div>

        <div style={styles.ideaSection}>
          <h2 style={styles.ideaSectionTitle}>Have a SaaS Idea?</h2>
          <p style={styles.ideaSectionSubtitle}>
            Submit your idea and our AI agents will analyze, validate, and help you build it!
          </p>
          <form onSubmit={handleIdeaSubmit} style={styles.ideaForm}>
            <textarea
              placeholder="Describe your SaaS idea... (e.g., A tool that helps freelancers automate invoicing)"
              value={ideaText}
              onChange={(e) => setIdeaText(e.target.value)}
              required
              minLength={20}
              style={styles.textarea}
              rows={4}
            />
            <button type="submit" disabled={submitting} style={styles.ideaButton}>
              {submitting ? 'Analyzing...' : 'Submit Idea'}
            </button>
          </form>

          {ideaSubmitted && (
            <p style={styles.ideaSuccess}>
              ✅ Idea submitted! Our AI agents are analyzing it now.
            </p>
          )}
        </div>

        <div style={styles.features}>
          <h2 style={styles.featuresTitle}>Powered by AI Agents</h2>
          <div style={styles.grid}>
            <FeatureCard
              icon="🔍"
              title="Market Research & Validation"
              description="Discover and validate high-potential SaaS opportunities using AI-driven trend analysis."
            />
            <FeatureCard
              icon="💡"
              title="Idea Refinement"
              description="Transform validated ideas into well-structured SaaS product blueprints."
            />
            <FeatureCard
              icon="🎨"
              title="UI/UX Design"
              description="Auto-generate wireframes, color palettes, and brand identity."
            />
            <FeatureCard
              icon="📄"
              title="Landing Pages"
              description="Create compelling, conversion-optimized landing pages automatically."
            />
            <FeatureCard
              icon="💰"
              title="Pricing Strategy"
              description="Design data-driven pricing models based on competitor analysis."
            />
            <FeatureCard
              icon="🚀"
              title="Growth & Marketing"
              description="Scale user acquisition through automated content strategies."
            />
          </div>
        </div>

        <div style={styles.cta}>
          <h2 style={styles.ctaTitle}>Ready to Launch Your Micro-SaaS?</h2>
          <p style={styles.ctaText}>
            Join founders who are building and launching SaaS products in days, not months.
          </p>
        </div>
      </main>

      <footer style={styles.footer}>
        <p>© 2025 Micro-SaaS Space. Built with AI agents on Replit.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div style={styles.card}>
      <div style={styles.icon}>{icon}</div>
      <h3 style={styles.cardTitle}>{title}</h3>
      <p style={styles.cardDescription}>{description}</p>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  main: {
    flex: 1,
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
  },
  hero: {
    textAlign: 'center',
    padding: '4rem 0',
    color: 'white',
  },
  title: {
    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
    fontWeight: '800',
    marginBottom: '1.5rem',
    lineHeight: '1.2',
  },
  gradient: {
    background: 'linear-gradient(to right, #ffd89b, #19547b)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  subtitle: {
    fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
    marginBottom: '2rem',
    opacity: 0.95,
    maxWidth: '700px',
    margin: '0 auto 2rem',
  },
  form: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
    maxWidth: '500px',
    margin: '0 auto',
  },
  input: {
    flex: '1',
    minWidth: '250px',
    padding: '1rem 1.5rem',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '50px',
    outline: 'none',
  },
  button: {
    padding: '1rem 2rem',
    fontSize: '1rem',
    fontWeight: '600',
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  success: {
    marginTop: '1rem',
    color: '#d4edda',
    fontWeight: '600',
  },
  features: {
    padding: '4rem 0',
  },
  featuresTitle: {
    fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: '3rem',
    color: 'white',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.95)',
    padding: '2rem',
    borderRadius: '1rem',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    transition: 'transform 0.3s',
  },
  icon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    marginBottom: '0.75rem',
    color: '#333',
  },
  cardDescription: {
    color: '#666',
    lineHeight: '1.6',
  },
  cta: {
    textAlign: 'center',
    padding: '4rem 2rem',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '1rem',
    marginTop: '2rem',
    color: 'white',
  },
  ctaTitle: {
    fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)',
    fontWeight: '700',
    marginBottom: '1rem',
  },
  ctaText: {
    fontSize: 'clamp(1rem, 2vw, 1.125rem)',
    opacity: 0.9,
  },
  footer: {
    textAlign: 'center',
    padding: '2rem',
    background: 'rgba(0, 0, 0, 0.2)',
    color: 'white',
  },
  ideaSection: {
    textAlign: 'center',
    padding: '3rem 2rem',
    background: 'rgba(255, 255, 255, 0.15)',
    borderRadius: '1rem',
    margin: '2rem 0',
    color: 'white',
  },
  ideaSectionTitle: {
    fontSize: 'clamp(1.5rem, 3.5vw, 2rem)',
    fontWeight: '700',
    marginBottom: '0.5rem',
  },
  ideaSectionSubtitle: {
    fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
    opacity: 0.9,
    marginBottom: '2rem',
  },
  ideaForm: {
    maxWidth: '600px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  textarea: {
    width: '100%',
    padding: '1rem',
    fontSize: '1rem',
    borderRadius: '12px',
    border: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  ideaButton: {
    padding: '1rem 2rem',
    fontSize: '1rem',
    fontWeight: '600',
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  ideaSuccess: {
    marginTop: '1rem',
    color: '#d4edda',
    fontWeight: '600',
  },
};
