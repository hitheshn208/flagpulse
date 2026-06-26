CREATE TABLE environments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  sdk_key UUID DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(project_id, slug)
);