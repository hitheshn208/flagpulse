export type FlagType = 'boolean' | 'string' | 'number' | 'json'
export type EnvIconName = 'globe' | 'code' | 'flask' | 'rocket' | 'bug' | 'settings' | 'flag_toggle' | "flag_creation" | "flag_updation"

export interface Project {
  id: string
  name: string
  key: string
  description: string
  envCount: number
  flagCount: number
  lastActivity: string
  collaborators: { initials: string; color: string }[]
}

export interface ActualProject {
  id: string
  name: string
  slug: string
  created_at: string
  environments_count: number
  flags_count: number
  description: string | null
  url: string | null
}

export interface ActualEnvironment{
  id: string
  name: string
  slug: string
  sdk_key: string
  created_at: string
  icon: string
  total_flags: number
  clients?: number
}

export type AuditType =
  | "project_creation"
  | "environment_creation"
  | "flag_creation"
  | "environment_deletion"
  | "key_rotation"
  | "flag_toggle"
  | "flag_updation"
  | "flag_deletion";

export type AuditDomain = "project" | "environment" | "flag";

export interface AuditLog {
  id: string;
  project_id: string | null;
  flag_id: string | null;
  environment_id: string | null;
  user_id: string | null;
  change_summary: string | null;
  old_value: string | null;
  new_value: string | null;
  reason: string | null;
  type: AuditType;
  domain: AuditDomain;
  created_at: string;
  flag_key: string | null;
  environment_name: string | null;
  user_name: string | null;
}


export interface ActualFlag{
  id: string
  name: string
  key: string
  type: "boolean" | "string" | "number" | "json"
  description: string | null
  environment_id: string
  is_enabled: boolean
  default_value: string | number | boolean | object
  rollout_percentage: number | null
  targeting_attribute: string | null
  targeting_value: string | null
  targeting_return_value: string | number | boolean | object
  updated_at: string
  created_at: string
}

export interface FlagEnvironmentValue {
  id: string
  flag_id: string
  environment_id: string
  is_enabled: boolean
  rollout_percentage: number | null
  targeting_attribute: string | null
  targeting_value: string | null
  targeting_return_value: string | number | boolean | object
  updated_at: string
  environment_name: string
  environment_slug: string
  environment_icon: string
}