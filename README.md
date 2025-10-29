# Micro-SaaS Space

## Overview
A universal AI-driven platform empowering non-technical founders to build, launch, and automate their micro-SaaS products effortlessly. The platform uses AI agents that handle everything from idea validation to deployment and marketing.

## Production-Ready Status ✅

The system is now production-ready with:
- ✅ Working Idea Agent API endpoint
- ✅ Complete database schema (Supabase)
- ✅ Secure authentication system
- ✅ Telemetry and error tracking
- ✅ Public idea submission form
- ✅ Comprehensive documentation

## Project Structure

### Frontend (Next.js App Router)
- **app/page.js**: Landing page with idea submission form
- **app/layout.js**: Root layout with SEO metadata
- **app/api/agents/**: API routes for all AI agents

### Backend APIs
- **lib/supabase.js**: Database client and query helpers
- **lib/auth.js**: Bearer token authentication
- **lib/telemetry.js**: Logging and incident tracking
- **lib/retry.js**: Retry logic with circuit breakers

### Agent Endpoints (API Routes)
1. **POST /api/agents/idea** - Analyze and save ideas (✅ IMPLEMENTED)
2. **POST /api/agents/market** - Validate market potential (stub)
3. **POST /api/agents/blueprint** - Generate technical blueprints (stub)
4. **POST /api/agents/builder** - Scaffold and deploy code (stub)
5. **POST /api/agents/growth** - Create launch assets (stub)

### Configuration Files
- **acp.micro-saas-space.yaml**: Agent Communication Protocol specification
- **supabase_schema.sql**: Complete database schema with all tables
- **micro-saas-space.json**: Agent definitions and roles
- **replit.n8n.json**: n8n workflow configurations
- **.env.example**: Environment variable template

## Tech Stack
- **Frontend**: Next.js 16 (App Router) with React 19
- **Database**: Supabase (PostgreSQL)
- **Automation**: n8n webhooks
- **API**: RESTful endpoints with bearer token auth
- **Deployment**: Replit Autoscale (serverless)

## Quick Start

### 1. Database Setup
1. Create a Supabase project at https://supabase.com
2. Run the SQL in `supabase_schema.sql` in Supabase SQL Editor
3. Copy your project URL and anon key

### 2. Configure Secrets
Add to Replit Secrets:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-public-key
```

### 3. Start the App
The Dev Server workflow starts automatically. Visit the webview to see the landing page.

### 4. Test Idea Submission
1. Scroll to "Have a SaaS Idea?" section
2. Submit a test idea
3. Check Supabase `validated_ideas` table for the record

## Architecture

### Core AI Agents (per ACP specification)

1. **Idea Agent** ✅ - Canonicalizes and scores SaaS ideas
2. **Market Validator** (stub) - Researches competitors and demand
3. **Blueprint Architect** (stub) - Generates technical specs
4. **Builder (CodeCrafter)** (stub) - Scaffolds and deploys code
5. **Growth & Launch** (stub) - Creates marketing materials

### Database Tables (Supabase)
- `users` - Platform users
- `validated_ideas` - Submitted ideas with validation scores
- `blueprints` - Technical specifications
- `deployments` - Build and deployment records
- `launch_assets` - Marketing materials
- `automation_flows` - n8n workflow metadata
- `cache` - API response caching (rate limit prevention)
- `incidents` - Error and issue tracking
- `logs` - Structured application logs
- `analytics` - Metrics and KPIs
- `feedback` - User feedback
- `growth_campaigns` - Marketing campaign data

### Event-Driven Architecture
Events are emitted via n8n webhooks (optional):
- `validated_idea.created` - New idea submitted
- `validated_idea.updated` - Validation completed
- `blueprint.created` - Blueprint generated
- `deployment.created` - Deployment completed
- `launch.created` - Launch assets ready

## Setup Documentation

See **SETUP.md** for comprehensive production setup instructions.

## Implementation Status

### ✅ Completed
- Core utilities (Supabase, auth, telemetry, retry)
- Idea Agent endpoint with full functionality
- Public idea submission form on landing page
- Database schema with all ACP-required tables
- Security: Bearer token auth for agent-to-agent calls
- Error handling and graceful degradation
- .env.example and documentation

### 🚧 In Progress (Stubs Available)
- Market Validator Agent (needs API integrations)
- Blueprint Architect Agent (needs LLM integration)
- Builder Agent (needs GitHub/Vercel APIs)
- Growth Agent (needs marketing platform APIs)
- n8n webhook endpoint with HMAC verification
- Admin dashboard UI

### 📋 Future Enhancements
- User authentication (Supabase Auth)
- Row Level Security policies
- Metrics dashboard
- Email notifications
- Rate limiting
- API documentation (Swagger/OpenAPI)

## Development vs Production

### Test Mode
Set `TEST_MODE=true` in Secrets to:
- Use mock data instead of external APIs
- Skip Supabase writes (return success with warnings)
- Avoid triggering n8n webhooks

### Production Mode
- Configure all required API keys in Secrets
- Enable Row Level Security in Supabase
- Set up error monitoring
- Configure backup strategy

## Security Best Practices

✅ **Implemented**:
- Bearer tokens stored in server-side secrets only
- Public endpoints don't expose authentication
- Input validation on all API endpoints
- Graceful error handling without leaking details
- Trace IDs for distributed tracing

⚠️ **Recommended for Production**:
- Enable Supabase Row Level Security
- Implement rate limiting
- Add HMAC verification for n8n webhooks
- Rotate API tokens quarterly
- Set up monitoring and alerting

## Environment Variables

### Required
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_KEY` - Supabase anon/public key

### Optional (Full Features)
- `N8N_HOST` - n8n instance for webhooks
- `GITHUB_TOKEN` - For Builder Agent
- `VERCEL_TOKEN` - For deployments
- `SERP_API_KEY` - For market research
- `SMTP_USER`, `SMTP_PASS` - For emails
- `TEST_MODE` - Enable test mode (true/false)

## Deployment
Configured for Replit Autoscale:
- Build: `npm run build`
- Run: `npm start`
- Deployment target: autoscale (serverless)

## Recent Changes
- **2025-10-29**: Production-ready implementation
  - Implemented full Idea Agent with Supabase integration
  - Created comprehensive database schema
  - Added core utilities (auth, telemetry, retry)
  - Built public idea submission form
  - Fixed security issues (removed bearer token from frontend)
  - Added graceful error handling
  - Created SETUP.md documentation
  - Stubbed remaining agents for future implementation

## Contributing
See `acp.micro-saas-space.yaml` for the Agent Communication Protocol specification that all agents must follow.

## License
This project is provided as-is for educational and commercial use.
