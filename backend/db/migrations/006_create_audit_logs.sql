CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  flag_id UUID REFERENCES flags(id) ON DELETE CASCADE,
  environment_id UUID REFERENCES environments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  change_summary TEXT,
  old_value TEXT,
  new_value TEXT,
  reason TEXT,
  type TEXT,
  domain VARCHAR(50) NOT NULL CHECK (domain IN ('project', 'environment', 'flag')),
  created_at TIMESTAMPTZ  DEFAULT NOW()
);