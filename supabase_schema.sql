-- ===============================
--  Micro-SaaS Space — Core Schema
--  Author: SIGMA AI (2025)
--  Purpose: Data backbone for AI-powered SaaS automation
-- ===============================

-- ===============================
-- Table: users
-- ===============================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'founder',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- ===============================
-- Table: validated_ideas
-- ===============================
CREATE TABLE IF NOT EXISTS validated_ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  validation_score FLOAT CHECK (validation_score >= 0 AND validation_score <= 100),
  keywords TEXT[],
  tags TEXT[],
  status TEXT DEFAULT 'draft',
  source TEXT,
  submitted_by TEXT,
  initial_score FLOAT,
  market_demand JSONB,
  competitor_analysis JSONB,
  ai_summary TEXT,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast keyword search
CREATE INDEX IF NOT EXISTS idx_validated_ideas_keywords ON validated_ideas USING GIN (keywords);
CREATE INDEX IF NOT EXISTS idx_validated_ideas_tags ON validated_ideas USING GIN (tags);

-- Enable RLS on validated_ideas table
ALTER TABLE validated_ideas ENABLE ROW LEVEL SECURITY;

-- RLS Policies for validated_ideas (allows anonymous inserts and public reads)
CREATE POLICY IF NOT EXISTS "Allow anonymous insert on validated_ideas"
  ON validated_ideas FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow public read on validated_ideas"
  ON validated_ideas FOR SELECT
  TO anon, authenticated
  USING (true);

-- ===============================
-- Table: blueprints
-- ===============================
CREATE TABLE IF NOT EXISTS blueprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID REFERENCES validated_ideas(id) ON DELETE CASCADE,
  feature_list JSONB,
  ui_flow JSONB,
  tech_stack JSONB,
  api_endpoints JSONB,
  database_schema TEXT,
  wireframe_url TEXT,
  generated_by TEXT DEFAULT 'blueprint_agent',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on blueprints table
ALTER TABLE blueprints ENABLE ROW LEVEL SECURITY;

-- ===============================
-- Table: pricing_models
-- ===============================
CREATE TABLE IF NOT EXISTS pricing_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blueprint_id UUID REFERENCES blueprints(id) ON DELETE CASCADE,
  plan_name TEXT,
  monthly_price NUMERIC(10,2),
  yearly_price NUMERIC(10,2),
  features TEXT[],
  ai_recommendation_score FLOAT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===============================
-- Table: automation_flows
-- ===============================
CREATE TABLE IF NOT EXISTS automation_flows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blueprint_id UUID REFERENCES blueprints(id) ON DELETE CASCADE,
  n8n_workflow JSONB,
  automation_status TEXT DEFAULT 'draft',
  deployed_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===============================
-- Table: analytics
-- ===============================
CREATE TABLE IF NOT EXISTS analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID REFERENCES validated_ideas(id) ON DELETE CASCADE,
  visitors INTEGER DEFAULT 0,
  signups INTEGER DEFAULT 0,
  conversion_rate FLOAT,
  traffic_sources JSONB,
  trend_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===============================
-- Table: feedback
-- ===============================
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  idea_id UUID REFERENCES validated_ideas(id) ON DELETE CASCADE,
  feedback_text TEXT,
  sentiment TEXT,
  rating SMALLINT CHECK (rating BETWEEN 1 AND 5),
  source TEXT,
  ai_action_recommendation JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===============================
-- Table: growth_campaigns
-- ===============================
CREATE TABLE IF NOT EXISTS growth_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID REFERENCES validated_ideas(id) ON DELETE CASCADE,
  campaign_name TEXT,
  platform TEXT,
  status TEXT DEFAULT 'draft',
  budget NUMERIC(12,2),
  results JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===============================
-- Table: launch_assets
-- ===============================
CREATE TABLE IF NOT EXISTS launch_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID REFERENCES validated_ideas(id) ON DELETE CASCADE,
  asset_type TEXT,
  file_url TEXT,
  ai_generated BOOLEAN DEFAULT TRUE,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===============================
-- Table: logs
-- ===============================
CREATE TABLE IF NOT EXISTS logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT NOT NULL,
  trace_id TEXT,
  level TEXT NOT NULL,
  msg TEXT,
  payload_size INTEGER,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_logs_agent_id ON logs(agent_id);
CREATE INDEX IF NOT EXISTS idx_logs_trace_id ON logs(trace_id);
CREATE INDEX IF NOT EXISTS idx_logs_created_at ON logs(created_at);

-- ===============================
-- Table: incidents
-- ===============================
CREATE TABLE IF NOT EXISTS incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT NOT NULL,
  severity TEXT NOT NULL,
  code TEXT,
  message TEXT,
  details JSONB,
  trace_id TEXT,
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_incidents_agent_id ON incidents(agent_id);
CREATE INDEX IF NOT EXISTS idx_incidents_resolved ON incidents(resolved);
CREATE INDEX IF NOT EXISTS idx_incidents_created_at ON incidents(created_at);

-- ===============================
-- Table: cache
-- ===============================
CREATE TABLE IF NOT EXISTS cache (
  cache_key TEXT PRIMARY KEY,
  cache_value JSONB,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cache_expires_at ON cache(expires_at);

-- ===============================
-- Trigger: update timestamps automatically
-- ===============================
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_users_timestamp') THEN
    CREATE TRIGGER update_users_timestamp
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();
  END IF;
END $$;
