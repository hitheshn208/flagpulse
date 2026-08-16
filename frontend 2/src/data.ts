export type FlagType = 'boolean' | 'string' | 'number' | 'json'
export type EnvName = 'development' | 'staging' | 'production'

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

export interface Environment {
  id: string
  name: string
  key: EnvName
  color: string
  sdkKey: string
  clients: number
  description: string
}

export interface Flag {
  id: string
  key: string
  name: string
  type: FlagType
  description: string
  defaultValue: string | boolean | number
  environments: Record<EnvName, boolean>
  envValues: Record<EnvName, string | boolean | number>
  lastModified: string
  modifiedBy: { initials: string; color: string; name: string }
  createdAt: string
  justUpdated?: boolean
  tags?: string[]
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

export const ENVIRONMENTS: Environment[] = [
  {
    id: 'env_dev',
    name: 'Development',
    key: 'development',
    color: '#94A3A8',
    sdkKey: 'fp_dev_sk_a8f3b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a3f2a',
    clients: 42,
    description: 'Local dev and CI environments',
  },
  {
    id: 'env_stg',
    name: 'Staging',
    key: 'staging',
    color: '#F59E0B',
    sdkKey: 'fp_stg_sk_b9e4c3d2e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a8b91',
    clients: 7,
    description: 'Pre-production verification environment',
  },
  {
    id: 'env_prod',
    name: 'Production',
    key: 'production',
    color: '#10B981',
    sdkKey: 'fp_prod_sk_c0d5e4f3e6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a2c47',
    clients: 1204,
    description: 'Live production traffic',
  },
]

export const FLAGS: Flag[] = [
  {
    id: 'flag_01',
    key: 'new-checkout-flow',
    name: 'New Checkout Flow',
    type: 'boolean',
    description: 'Enables the redesigned 3-step checkout experience with address autocomplete and one-click payment.',
    defaultValue: false,
    environments: { development: true, staging: true, production: false },
    envValues: { development: true, staging: true, production: false },
    lastModified: '12 min ago',
    modifiedBy: { initials: 'AK', color: '#10B981', name: 'Arjun Kapoor' },
    createdAt: '2025-11-14',
    justUpdated: true,
    tags: ['checkout', 'ux'],
  },
  {
    id: 'flag_02',
    key: 'enable-dark-mode',
    name: 'Dark Mode',
    type: 'boolean',
    description: 'System-wide dark mode toggle respecting prefers-color-scheme.',
    defaultValue: true,
    environments: { development: true, staging: true, production: true },
    envValues: { development: true, staging: true, production: true },
    lastModified: '2 hours ago',
    modifiedBy: { initials: 'JL', color: '#38BDF8', name: 'Jana Liu' },
    createdAt: '2025-10-02',
    tags: ['ui', 'accessibility'],
  },
  {
    id: 'flag_03',
    key: 'max-upload-size-mb',
    name: 'Max Upload Size (MB)',
    type: 'number',
    description: 'Maximum file upload size limit in megabytes. Validated server-side.',
    defaultValue: 50,
    environments: { development: true, staging: true, production: true },
    envValues: { development: 100, staging: 75, production: 50 },
    lastModified: '1 day ago',
    modifiedBy: { initials: 'SM', color: '#A78BFA', name: 'Sara Mehta' },
    createdAt: '2025-09-18',
    tags: ['infra', 'limits'],
  },
  {
    id: 'flag_04',
    key: 'beta-ai-search',
    name: 'Beta AI Search',
    type: 'boolean',
    description: 'Enables experimental semantic search powered by the new embedding pipeline.',
    defaultValue: false,
    environments: { development: true, staging: false, production: false },
    envValues: { development: true, staging: false, production: false },
    lastModified: '3 hours ago',
    modifiedBy: { initials: 'RK', color: '#F59E0B', name: 'Riya Khanna' },
    createdAt: '2026-01-07',
    tags: ['ai', 'search', 'beta'],
  },
  {
    id: 'flag_05',
    key: 'api-rate-limit-rps',
    name: 'API Rate Limit (req/s)',
    type: 'number',
    description: 'Per-user API rate limit in requests per second.',
    defaultValue: 100,
    environments: { development: true, staging: true, production: true },
    envValues: { development: 1000, staging: 200, production: 100 },
    lastModified: '5 days ago',
    modifiedBy: { initials: 'SM', color: '#A78BFA', name: 'Sara Mehta' },
    createdAt: '2025-08-22',
    tags: ['api', 'limits'],
  },
  {
    id: 'flag_06',
    key: 'maintenance-banner',
    name: 'Maintenance Banner',
    type: 'string',
    description: 'Displays a dismissible site-wide maintenance notification. Empty string disables it.',
    defaultValue: '',
    environments: { development: false, staging: false, production: false },
    envValues: { development: '', staging: '', production: '' },
    lastModified: '2 weeks ago',
    modifiedBy: { initials: 'TM', color: '#10B981', name: 'Theo Muller' },
    createdAt: '2025-07-11',
    tags: ['infra', 'ops'],
  },
  {
    id: 'flag_07',
    key: 'feature-notifications-v2',
    name: 'Notifications v2',
    type: 'boolean',
    description: 'New notification center with grouped alerts and per-channel preferences.',
    defaultValue: false,
    environments: { development: true, staging: true, production: false },
    envValues: { development: true, staging: true, production: false },
    lastModified: '6 hours ago',
    modifiedBy: { initials: 'BJ', color: '#F43F5E', name: 'Ben Johnson' },
    createdAt: '2026-02-14',
    tags: ['notifications', 'ux'],
  },
  {
    id: 'flag_08',
    key: 'session-timeout-minutes',
    name: 'Session Timeout (min)',
    type: 'number',
    description: 'Idle session timeout duration in minutes before auto-logout.',
    defaultValue: 60,
    environments: { development: true, staging: true, production: true },
    envValues: { development: 480, staging: 120, production: 60 },
    lastModified: '3 days ago',
    modifiedBy: { initials: 'AK', color: '#10B981', name: 'Arjun Kapoor' },
    createdAt: '2025-10-30',
    tags: ['security', 'auth'],
  },
  {
    id: 'flag_09',
    key: 'payment-provider',
    name: 'Payment Provider',
    type: 'string',
    description: 'Active payment processor. Supports stripe, braintree, or adyen.',
    defaultValue: 'stripe',
    environments: { development: true, staging: true, production: true },
    envValues: { development: 'stripe', staging: 'stripe', production: 'stripe' },
    lastModified: '1 month ago',
    modifiedBy: { initials: 'JL', color: '#38BDF8', name: 'Jana Liu' },
    createdAt: '2025-06-03',
    tags: ['payments', 'infra'],
  },
  {
    id: 'flag_10',
    key: 'rollout-new-dashboard',
    name: 'New Dashboard Rollout',
    type: 'boolean',
    description: 'Gradual rollout of the redesigned analytics dashboard to internal users first.',
    defaultValue: false,
    environments: { development: true, staging: true, production: false },
    envValues: { development: true, staging: true, production: false },
    lastModified: '4 hours ago',
    modifiedBy: { initials: 'RK', color: '#F59E0B', name: 'Riya Khanna' },
    createdAt: '2026-03-01',
    tags: ['dashboard', 'rollout'],
  },
  {
    id: 'flag_11',
    key: 'feature-flags-sdk-config',
    name: 'SDK Config Override',
    type: 'json',
    description: 'Runtime SDK configuration override. Applied globally across all clients.',
    defaultValue: '{}',
    environments: { development: true, staging: false, production: false },
    envValues: {
      development: '{"flushInterval":1000,"logLevel":"debug"}',
      staging: '{}',
      production: '{}',
    },
    lastModified: '2 days ago',
    modifiedBy: { initials: 'SM', color: '#A78BFA', name: 'Sara Mehta' },
    createdAt: '2025-12-08',
    tags: ['sdk', 'config'],
  },
  {
    id: 'flag_12',
    key: 'cdn-image-optimization',
    name: 'CDN Image Optimization',
    type: 'boolean',
    description: 'Enable WebP/AVIF transcoding and smart cropping at the CDN edge.',
    defaultValue: true,
    environments: { development: false, staging: true, production: true },
    envValues: { development: false, staging: true, production: true },
    lastModified: '1 week ago',
    modifiedBy: { initials: 'TM', color: '#10B981', name: 'Theo Muller' },
    createdAt: '2025-09-05',
    tags: ['cdn', 'perf'],
  },
  {
    id: 'flag_13',
    key: 'ab-test-homepage-hero',
    name: 'A/B Test: Homepage Hero',
    type: 'string',
    description: 'Variant assignment for homepage hero experiment. Values: control, variant-a, variant-b.',
    defaultValue: 'control',
    environments: { development: true, staging: true, production: true },
    envValues: { development: 'variant-a', staging: 'control', production: 'control' },
    lastModified: '18 hours ago',
    modifiedBy: { initials: 'BJ', color: '#F43F5E', name: 'Ben Johnson' },
    createdAt: '2026-02-28',
    tags: ['ab-test', 'marketing'],
  },
  {
    id: 'flag_14',
    key: 'two-factor-enforcement',
    name: '2FA Enforcement',
    type: 'boolean',
    description: 'Requires all users to enroll in 2FA before accessing the dashboard.',
    defaultValue: false,
    environments: { development: false, staging: false, production: true },
    envValues: { development: false, staging: false, production: true },
    lastModified: '3 weeks ago',
    modifiedBy: { initials: 'AK', color: '#10B981', name: 'Arjun Kapoor' },
    createdAt: '2025-11-01',
    tags: ['security', 'auth'],
  },
  {
    id: 'flag_15',
    key: 'search-results-page-size',
    name: 'Search Results Page Size',
    type: 'number',
    description: 'Number of results returned per search page.',
    defaultValue: 20,
    environments: { development: true, staging: true, production: true },
    envValues: { development: 50, staging: 25, production: 20 },
    lastModified: '5 days ago',
    modifiedBy: { initials: 'JL', color: '#38BDF8', name: 'Jana Liu' },
    createdAt: '2025-08-14',
    tags: ['search', 'perf'],
  },
  {
    id: 'flag_16',
    key: 'legacy-api-compat',
    name: 'Legacy API Compat Mode',
    type: 'boolean',
    description: 'Maintain backwards-compat response shapes for pre-v2 API clients.',
    defaultValue: true,
    environments: { development: false, staging: true, production: true },
    envValues: { development: false, staging: true, production: true },
    lastModified: '2 months ago',
    modifiedBy: { initials: 'SM', color: '#A78BFA', name: 'Sara Mehta' },
    createdAt: '2025-05-19',
    tags: ['api', 'compat'],
  },
  {
    id: 'flag_17',
    key: 'referral-program-v2',
    name: 'Referral Program v2',
    type: 'boolean',
    description: 'New referral flow with tiered rewards and real-time balance tracking.',
    defaultValue: false,
    environments: { development: true, staging: false, production: false },
    envValues: { development: true, staging: false, production: false },
    lastModified: '9 hours ago',
    modifiedBy: { initials: 'RK', color: '#F59E0B', name: 'Riya Khanna' },
    createdAt: '2026-04-10',
    tags: ['growth', 'referral'],
  },
  {
    id: 'flag_18',
    key: 'error-tracking-provider',
    name: 'Error Tracking Provider',
    type: 'string',
    description: 'Active error tracking integration. Values: sentry, datadog, rollbar.',
    defaultValue: 'sentry',
    environments: { development: true, staging: true, production: true },
    envValues: { development: 'sentry', staging: 'sentry', production: 'datadog' },
    lastModified: '3 months ago',
    modifiedBy: { initials: 'TM', color: '#10B981', name: 'Theo Muller' },
    createdAt: '2025-04-22',
    tags: ['observability', 'infra'],
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
