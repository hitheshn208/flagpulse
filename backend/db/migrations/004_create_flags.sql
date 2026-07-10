CREATE TABLE flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  key VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('boolean', 'string', 'number', 'json')),
  created_at TIMESTAMPTZ  DEFAULT NOW(),
  UNIQUE(project_id, key)
);