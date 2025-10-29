Micro-SaaS Space — Setup

1. Add the agent config:
   - Create `micro-saas-space.json` in the project root (paste the agent config).

2. Set Replit Secrets (do NOT put API keys in code):
   - N8N_HOST = https://n8n.yourdomain.com
   - SUPABASE_URL, SUPABASE_KEY
   - VERCEL_TOKEN
   - GITHUB_TOKEN
   - SMTP_USER, SMTP_PASS (or use Replit SMTP cred)
   - N8N_WEBHOOK_SECRET (if you secure webhooks)
   - OPTIONAL: GOOGLE_TRENDS_KEY, SERP_API_KEY

3. Start dev:
   - Run the "Project" workflow (it starts Dev Server).
   - Then run "MicroSaaS AI System" workflow to run agents.

4. Verify:
   - Visit the app on the mapped external port.
   - Test newsletter signups (they call n8n webhook).
   - Check Supabase for saved subscribers.

5. Production:
   - Use `deploymentTarget = "autoscale"` (provided).
   - Ensure Vercel/GitHub tokens for Builder Agent are set.

If anything fails, check Replit logs and n8n webhook logs.
