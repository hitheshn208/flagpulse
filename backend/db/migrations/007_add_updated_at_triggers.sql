CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_flag_values_updated_at
BEFORE UPDATE ON flag_values
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_flags_updated_at
BEFORE UPDATE ON flags
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_environments_updated_at
BEFORE UPDATE ON environments
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_projects_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();