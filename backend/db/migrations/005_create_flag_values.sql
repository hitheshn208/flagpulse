CREATE TABLE flag_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flag_id UUID REFERENCES flags(id) ON DELETE CASCADE,
  environment_id UUID REFERENCES environments(id) ON DELETE CASCADE,
  is_enabled BOOLEAN DEFAULT FALSE,
  rollout_percentage INTEGER DEFAULT 0 CHECK (rollout_percentage BETWEEN 0 AND 100),
  targeting_attribute VARCHAR(255),
  targeting_value TEXT,
  targeting_return_value TEXT,
  updated_at TIMESTAMPTZ  DEFAULT NOW(),
  UNIQUE(flag_id, environment_id)
);