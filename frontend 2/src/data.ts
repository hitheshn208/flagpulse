export type FlagType = 'boolean' | 'string' | 'number' | 'json'
export type EnvIconName = 'globe' | 'code' | 'flask' | 'rocket' | 'bug' | 'settings'

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
  description: string
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

export interface AuditEntry {
  id: string
  user: { initials: string; color: string; name: string }
  action: string
  flagKey?: string
  environment?: string
  from?: string
  to?: string
  timestamp: string
  detail: string
}

export const PROJECTS: Project[] = [
  {
    id: 'proj_marketing',
    name: 'Marketing Site',
    key: 'marketing-site',
    description: 'Public-facing website, landing pages, and campaign flows',
    envCount: 3,
    flagCount: 12,
    lastActivity: '2 hours ago',
    collaborators: [
      { initials: 'AK', color: '#10B981' },
      { initials: 'JL', color: '#38BDF8' },
      { initials: 'SM', color: '#A78BFA' },
    ],
  },
  {
    id: 'proj_mobile',
    name: 'Mobile App',
    key: 'mobile-app',
    description: 'iOS and Android native application — React Native monorepo',
    envCount: 3,
    flagCount: 28,
    lastActivity: '15 min ago',
    collaborators: [
      { initials: 'RK', color: '#F59E0B' },
      { initials: 'TM', color: '#10B981' },
      { initials: 'AK', color: '#10B981' },
      { initials: 'BJ', color: '#F43F5E' },
    ],
  },
  {
    id: 'proj_api',
    name: 'Core API',
    key: 'core-api',
    description: 'Backend API gateway and microservices — Go + gRPC',
    envCount: 4,
    flagCount: 41,
    lastActivity: '3 days ago',
    collaborators: [
      { initials: 'SM', color: '#A78BFA' },
      { initials: 'JL', color: '#38BDF8' },
    ],
  },
  {
    id: 'proj_data',
    name: 'Data Pipeline',
    key: 'data-pipeline',
    description: 'ETL, analytics infrastructure, and warehouse integrations',
    envCount: 2,
    flagCount: 7,
    lastActivity: '1 week ago',
    collaborators: [
      { initials: 'AK', color: '#10B981' },
      { initials: 'RK', color: '#F59E0B' },
    ],
  },
]


export const AUDIT_LOG: AuditEntry[] = [
  {
    id: 'audit_01',
    user: { initials: 'AK', color: '#10B981', name: 'Arjun Kapoor' },
    action: 'toggled off',
    flagKey: 'new-checkout-flow',
    environment: 'production',
    from: 'true',
    to: 'false',
    timestamp: '2026-08-13 14:22',
    detail: 'Disabled in production due to conversion rate anomaly',
  },
  {
    id: 'audit_02',
    user: { initials: 'RK', color: '#F59E0B', name: 'Riya Khanna' },
    action: 'updated value',
    flagKey: 'beta-ai-search',
    environment: 'development',
    from: 'false',
    to: 'true',
    timestamp: '2026-08-13 11:47',
    detail: 'Enabled for internal testing of embedding model v2',
  },
  {
    id: 'audit_03',
    user: { initials: 'JL', color: '#38BDF8', name: 'Jana Liu' },
    action: 'created flag',
    flagKey: 'rollout-new-dashboard',
    environment: undefined,
    timestamp: '2026-08-13 09:15',
    detail: 'New flag for gradual dashboard rollout',
  },
  {
    id: 'audit_04',
    user: { initials: 'BJ', color: '#F43F5E', name: 'Ben Johnson' },
    action: 'updated value',
    flagKey: 'feature-notifications-v2',
    environment: 'staging',
    from: 'false',
    to: 'true',
    timestamp: '2026-08-13 08:03',
    detail: 'QA signoff complete, enabling on staging',
  },
  {
    id: 'audit_05',
    user: { initials: 'SM', color: '#A78BFA', name: 'Sara Mehta' },
    action: 'updated value',
    flagKey: 'feature-flags-sdk-config',
    environment: 'development',
    from: '{}',
    to: '{"flushInterval":1000,"logLevel":"debug"}',
    timestamp: '2026-08-12 17:55',
    detail: 'Increased flush interval for local debugging',
  },
  {
    id: 'audit_06',
    user: { initials: 'RK', color: '#F59E0B', name: 'Riya Khanna' },
    action: 'updated value',
    flagKey: 'rollout-new-dashboard',
    environment: 'production',
    from: 'true',
    to: 'false',
    timestamp: '2026-08-12 14:31',
    detail: 'Pausing prod rollout — investigating latency spike',
  },
  {
    id: 'audit_07',
    user: { initials: 'AK', color: '#10B981', name: 'Arjun Kapoor' },
    action: 'rotated SDK key',
    environment: 'staging',
    timestamp: '2026-08-12 10:08',
    detail: 'Routine key rotation per security policy',
  },
  {
    id: 'audit_08',
    user: { initials: 'TM', color: '#10B981', name: 'Theo Muller' },
    action: 'updated value',
    flagKey: 'cdn-image-optimization',
    environment: 'staging',
    from: 'false',
    to: 'true',
    timestamp: '2026-08-11 16:22',
    detail: 'Validated AVIF performance in staging — enabling',
  },
  {
    id: 'audit_09',
    user: { initials: 'JL', color: '#38BDF8', name: 'Jana Liu' },
    action: 'updated value',
    flagKey: 'ab-test-homepage-hero',
    environment: 'development',
    from: 'control',
    to: 'variant-a',
    timestamp: '2026-08-11 13:05',
    detail: 'Starting internal review of variant-a copy',
  },
  {
    id: 'audit_10',
    user: { initials: 'BJ', color: '#F43F5E', name: 'Ben Johnson' },
    action: 'created flag',
    flagKey: 'referral-program-v2',
    environment: undefined,
    timestamp: '2026-08-10 09:48',
    detail: 'Referral v2 flag for new rewards system',
  },
  {
    id: 'audit_11',
    user: { initials: 'SM', color: '#A78BFA', name: 'Sara Mehta' },
    action: 'deleted flag',
    flagKey: 'old-search-algorithm',
    environment: undefined,
    timestamp: '2026-08-09 15:17',
    detail: 'Cleanup — flag fully shipped and no longer needed',
  },
  {
    id: 'audit_12',
    user: { initials: 'AK', color: '#10B981', name: 'Arjun Kapoor' },
    action: 'updated value',
    flagKey: 'session-timeout-minutes',
    environment: 'production',
    from: '30',
    to: '60',
    timestamp: '2026-08-08 11:30',
    detail: 'Increased timeout after user feedback on forced logouts',
  },
]
