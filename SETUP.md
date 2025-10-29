# Micro-SaaS Space - Production Setup Guide

## Quick Start

This is an AI-driven platform for building, validating, and launching micro-SaaS products. It features 5 core AI agents that handle everything from idea validation to deployment.

## Prerequisites

1. **Replit Account** - You're already here!
2. **Supabase Account** - Free tier: https://supabase.com
3. **(Optional) n8n Instance** - For workflow automation
4. **(Optional) GitHub & Vercel** - For Builder Agent deployments

## Step 1: Database Setup

### Create Supabase Project

1. Go to https://app.supabase.com
2. Create a new project
3. Wait for provisioning (2-3 minutes)

### Run Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Copy the entire contents of `supabase_schema.sql`
3. Paste and click **Run**
4. Verify tables were created (check Table Editor)

### Get Credentials

1. Go to **Project Settings** → **API**
2. Copy your **Project URL** (e.g., `https://xxx.supabase.co`)
3. Copy your **anon/public** key

## Step 2: Configure Replit Secrets

Click **Tools** → **Secrets** and add:

### Required Secrets
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-public-key-here
```

### Optional Secrets (for full functionality)
```
N8N_HOST=https://your-n8n-instance.com
GITHUB_TOKEN=ghp_your_github_token
VERCEL_TOKEN=your_vercel_token
SMTP_USER=your-email@example.com
SMTP_PASS=your-email-password
SERP_API_KEY=your-serp-api-key
```

## Step 3: Start the Application

1. The workflow should start automatically
2. If not, click the **Run** button
3. Wait for "Ready" message in console
4. Open the Webview to see the landing page

## Step 4: Test the System

### Test Idea Submission

1. Open the landing page
2. Scroll to "Have a SaaS Idea?" section
3. Enter a test idea (min 20 characters)
4. Click "Submit Idea"
5. Check Supabase `validated_ideas` table for the new record

### Test API Endpoints (Optional)

The following agent endpoints are available for integration:

- `POST /api/agents/idea` - Analyze and save ideas (public, no auth required)
- `POST /api/agents/market` - Validate market potential (stub)
- `POST /api/agents/blueprint` - Generate technical blueprints (stub)
- `POST /api/agents/builder` - Scaffold and deploy code (stub)
- `POST /api/agents/growth` - Create launch assets (stub)

**Note**: Market, Blueprint, Builder, and Growth agents are currently stubs. They will be fully implemented in future updates.

## Architecture Overview

### Core Agents

1. **Idea Agent** (/api/agents/idea) - IMPLEMENTED
   - Analyzes raw SaaS ideas
   - Extracts keywords and calculates initial score
   - Persists to Supabase
   - Triggers n8n webhook (if configured)

2. **Market Validator Agent** (/api/agents/market) - STUB
   - Will validate ideas using external APIs
   - Competitor analysis
   - Market demand scoring

3. **Blueprint Agent** (/api/agents/blueprint) - STUB
   - Will generate technical specifications
   - Tech stack recommendations
   - Database schema design

4. **Builder Agent** (/api/agents/builder) - STUB
   - Will create GitHub repos
   - Deploy to Vercel
   - Scaffold starter code

5. **Growth Agent** (/api/agents/growth) - STUB
   - Will create launch assets
   - Generate marketing copy
   - Schedule social posts

### Core Utilities (lib/)

- **supabase.js** - Database client and helpers
- **auth.js** - Bearer token verification (for internal agent-to-agent calls)
- **telemetry.js** - Logging and incident tracking
- **retry.js** - Retry logic with backoff and circuit breakers

## Database Tables

- `users` - Platform users
- `validated_ideas` - Submitted and analyzed ideas
- `blueprints` - Technical specifications
- `automation_flows` - n8n workflow metadata
- `deployments` - Build and deployment records
- `launch_assets` - Marketing materials
- `cache` - API response caching
- `incidents` - Error tracking
- `logs` - Structured logging
- `analytics` - Metrics and KPIs
- `feedback` - User feedback
- `growth_campaigns` - Marketing campaigns

## n8n Integration (Optional)

If you want to use n8n for workflow automation:

1. Set up an n8n instance (https://n8n.io)
2. Add `N8N_HOST` to Replit Secrets
3. Import `replit.n8n.json` into n8n
4. Configure webhooks to receive events from the platform

### Webhook Events

- `validated_idea.created` - New idea submitted
- `validated_idea.updated` - Idea validation completed
- `blueprint.created` - Blueprint generated
- `deployment.created` - Deployment completed
- `launch.created` - Launch assets ready

## Development vs Production

### Test Mode

Set `TEST_MODE=true` in Secrets to:
- Skip external API calls
- Use mock data
- Avoid publishing to live services

### Production Mode

- Remove `TEST_MODE` or set to `false`
- Configure all required API keys
- Set up proper error monitoring
- Enable Row Level Security in Supabase

## Troubleshooting

### "Supabase not configured" warnings

- Make sure `SUPABASE_URL` and `SUPABASE_KEY` are set in Secrets
- Restart the workflow after adding secrets
- Check that credentials are correct

### Idea submission not saving

- Check Supabase Table Editor for `validated_ideas` table
- Verify the SQL schema was run successfully
- Check console logs for errors

### API endpoints returning 401

- Internal agent endpoints require `REPLIT_AGENT_KEY` secret
- Public endpoints (like /api/agents/idea) don't need auth
- Check the Authorization header format

## Next Steps

1. **Configure Integrations**: Add API keys for market research, GitHub, Vercel
2. **Implement Agent Logic**: The Market, Blueprint, Builder, and Growth agents need full implementation
3. **Build Admin Dashboard**: Create `/admin` route to view and manage ideas
4. **Set up n8n Workflows**: Automate the agent pipeline
5. **Add Authentication**: Implement Supabase Auth for user accounts
6. **Deploy to Production**: Use Replit Deployments (autoscale mode)

## Support

For detailed technical specifications, see:
- `acp.micro-saas-space.yaml` - Agent Communication Protocol
- `replit.md` - Project documentation
- `supabase_schema.sql` - Database schema

## Security Best Practices

✅ **DO**:
- Store all API keys in Replit Secrets
- Enable Row Level Security in Supabase for production
- Rotate tokens quarterly
- Use HTTPS for all external webhooks

❌ **DON'T**:
- Expose bearer tokens in client-side code
- Commit secrets to the repository
- Use test mode in production
- Skip input validation

## License

This project template is provided as-is for educational and commercial use.
