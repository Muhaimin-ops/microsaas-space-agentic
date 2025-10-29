# Micro-SaaS Space

## Overview
A universal AI-driven platform empowering non-technical founders to build, launch, and automate their micro-SaaS products effortlessly. The platform uses AI agents to handle everything from market research and validation to landing page creation and growth marketing.

## Project Structure
- **Next.js Frontend** (app directory): Modern React-based landing page showcasing the platform
- **AI Pipeline** (ai_pipeline.js): Orchestration script for running AI agent workflows
- **Agent Configuration** (micro-saas-space.json): Defines all AI agents and their roles
- **n8n Configuration** (replit.n8n.json): Automation workflows for external integrations

## Tech Stack
- **Frontend**: Next.js 16 (App Router) with React 19
- **Styling**: Inline CSS-in-JS (no external dependencies)
- **Database**: Supabase (configured for production use)
- **Automation**: n8n (external workflow automation)
- **Deployment**: Replit Autoscale

## Architecture
The platform consists of multiple AI agents:
1. **Market Research & Validation** - Discovers and validates SaaS opportunities
2. **Idea Refinement** - Transforms ideas into product blueprints
3. **UI/UX Designer** - Auto-generates wireframes and brand identity
4. **Landing Page Agent** - Creates conversion-optimized landing pages
5. **Pricing Strategy** - Designs data-driven pricing models
6. **Automation Agent** - Builds n8n workflows for marketing
7. **Growth Agent** - Scales user acquisition
8. **Analytics Agent** - Analyzes metrics and behavior
9. **Funding Agent** - Helps find investors and prepare pitch decks
10. **Feedback Loop** - Continuously improves based on data

## Setup Instructions

### Required Environment Variables
Create these as Replit Secrets:
- `N8N_HOST` - Your n8n webhook URL (e.g., https://n8n.yourdomain.com)
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_KEY` - Supabase anon/public key
- `VERCEL_TOKEN` - (Optional) For automated deployments
- `GITHUB_TOKEN` - (Optional) For repository operations
- `SMTP_USER` - Email service username
- `SMTP_PASS` - Email service password
- `N8N_WEBHOOK_SECRET` - (Optional) For securing webhooks
- `GOOGLE_TRENDS_KEY` - (Optional) For trend analysis
- `SERP_API_KEY` - (Optional) For search data

### Development
1. The "Dev Server" workflow automatically starts Next.js on port 5000
2. Visit the webview to see the landing page
3. Test newsletter signups (calls n8n webhook if N8N_HOST is configured)

### AI Agents
Run the "MicroSaaS AI System" workflow to execute the agent pipeline. This will:
1. Run agents defined in micro-saas-space.json
2. Execute ai_pipeline.js for orchestration
3. Store results in Supabase

## Deployment
Configured for Replit Autoscale deployment:
- Build: `npm run build`
- Run: `npm run preview`
- Target: Autoscale (serverless, scales to zero)

## Recent Changes
- **2025-10-29**: Initial Replit setup
  - Created Next.js application with landing page
  - Configured workflows for dev and production
  - Set up proper Next.js configuration for Replit proxy
  - Added .gitignore for Node.js/Next.js

## Notes
- The frontend is configured to work with Replit's proxy system (allowedDevOrigins: true)
- Newsletter signup form integrates with n8n webhooks when N8N_HOST is set
- The AI agents are configured in micro-saas-space.json but require proper setup
- Supabase credentials in replit.n8n.json should be moved to Replit Secrets
