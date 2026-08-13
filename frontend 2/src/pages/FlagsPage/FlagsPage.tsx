import { useState } from 'react'
import {
  Plus,
  Search,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react'

import {
  FLAGS,
  ENVIRONMENTS,
  type Flag,
  type EnvName,
} from '../../data'

import FlagDetailSlideOver from '../../components/FlagDetailSlideOver'
import './FlagsPage.css'

type Page =
  | 'projects'
  | 'flags'
  | 'environments'
  | 'settings'
  | 'audit'
  | 'create-flag'

type FilterType =
  | 'all'
  | 'boolean'
  | 'string'
  | 'number'
  | 'json'

type StatusFilter = 'all' | 'on' | 'off'

/*
 * Environment colors are assigned according to
 * the order returned by the database.
 *
 * Environment order:
 * 0 → env-1
 * 1 → env-2
 * 2 → env-3
 * ...
 */
const ENVIRONMENT_COLORS = [
  'env-color-1',
  'env-color-2',
  'env-color-3',
  'env-color-4',
  'env-color-5',
  'env-color-6',
  'env-color-7',
  'env-color-8',
]

interface FlagsPageProps {
  currentEnv: EnvName
  onNavigate: (page: Page) => void
  onToast: (
    msg: string,
    type: 'success' | 'error' | 'info'
  ) => void
}

export default function FlagsPage({
  currentEnv,
  onNavigate,
  onToast,
}: FlagsPageProps) {
  const [selectedFlag, setSelectedFlag] =
    useState<Flag | null>(null)

  const [search, setSearch] = useState('')

  const [typeFilter, setTypeFilter] =
    useState<FilterType>('all')

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>('all')

  const [loading] = useState(false)

  const [flagStates, setFlagStates] = useState<
    Record<string, Record<string, boolean>>
  >(
    Object.fromEntries(
      FLAGS.map((flag) => [
        flag.id,
        { ...flag.environments },
      ])
    )
  )

  /*
   * Since ENVIRONMENTS comes from the DB in a stable
   * order, its index determines the environment color.
   */
  const currentEnvironmentIndex = Math.max(
    ENVIRONMENTS.findIndex(
      (environment) => environment.key === currentEnv
    ),
    0
  )

  const currentEnvironmentColor =
    ENVIRONMENT_COLORS[
      currentEnvironmentIndex %
        ENVIRONMENT_COLORS.length
    ]

  const enabledCount = FLAGS.filter(
    (flag) =>
      flagStates[flag.id]?.[currentEnv] ?? false
  ).length

  const filteredFlags = FLAGS.filter((flag) => {
    const query = search.toLowerCase().trim()

    const matchesSearch =
      !query ||
      flag.key.toLowerCase().includes(query) ||
      flag.name.toLowerCase().includes(query)

    const matchesType =
      typeFilter === 'all' ||
      flag.type === typeFilter

    const isEnabled =
      flagStates[flag.id]?.[currentEnv] ?? false

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'on' && isEnabled) ||
      (statusFilter === 'off' && !isEnabled)

    return (
      matchesSearch &&
      matchesType &&
      matchesStatus
    )
  })

  const toggleFlag = (
    flagId: string,
    env: string,
    value: boolean
  ) => {
    setFlagStates((current) => ({
      ...current,
      [flagId]: {
        ...current[flagId],
        [env]: value,
      },
    }))

    onToast(
      `Flag ${value ? 'enabled' : 'disabled'} in ${env}`,
      'success'
    )
  }

  const clearFilters = () => {
    setSearch('')
    setTypeFilter('all')
    setStatusFilter('all')
  }

  return (
    <div className="flags-page">
      <div className="flags-content">
        {/* Header */}
        <header className="flags-header">
          <div>
            <h1>Feature Flags</h1>

            <p className="flags-summary">
              {FLAGS.length} flags · {enabledCount} enabled
              {' in '}
              <span
                className={`environment-text ${currentEnvironmentColor}`}
              >
                {currentEnv}
              </span>
            </p>
          </div>

          <button
            className="create-flag-btn"
            type="button"
            onClick={() =>
              onNavigate('create-flag')
            }
          >
            <Plus size={15} />
            Create Flag
          </button>
        </header>

        {/* Toolbar */}
        <div className="flags-toolbar">
          <div className="flag-search">
            <Search size={14} />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search flags by key or name..."
            />
          </div>

          <div className="filter-group">
            <span className="filter-label">
              Type
            </span>

            {(
              [
                'all',
                'boolean',
                'string',
                'number',
                'json',
              ] as FilterType[]
            ).map((type) => (
              <button
                key={type}
                type="button"
                className={`filter-btn ${
                  typeFilter === type
                    ? 'active'
                    : ''
                }`}
                onClick={() =>
                  setTypeFilter(type)
                }
              >
                {type === 'all' ? 'All' : type}
              </button>
            ))}
          </div>

          <div className="filter-group">
            <span className="filter-label">
              Status
            </span>

            {(
              ['all', 'on', 'off'] as StatusFilter[]
            ).map((status) => (
              <button
                key={status}
                type="button"
                className={`filter-btn ${
                  statusFilter === status
                    ? 'active'
                    : ''
                }`}
                onClick={() =>
                  setStatusFilter(status)
                }
              >
                {status === 'all'
                  ? 'All'
                  : status === 'on'
                    ? '● On'
                    : '○ Off'}
              </button>
            ))}
          </div>

          <button
            className="sort-btn"
            type="button"
          >
            <SlidersHorizontal size={13} />
            Sort
          </button>
        </div>

        {/* Table */}
        <div className="flags-table-container">
          <table className="flags-table">
            <thead>
              <tr>
                <th className="flag-column">
                  Flag
                </th>

                <th>Type</th>

                <th
                  className={`environment-header ${currentEnvironmentColor}`}
                >
                  <span className="environment-indicator" />
                  {currentEnv}
                </th>

                <th>Modified</th>

                <th className="action-column" />
              </tr>
            </thead>

            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map(
                  (_, index) => (
                    <SkeletonRow key={index} />
                  )
                )
              ) : filteredFlags.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <EmptyFlags
                      onClear={clearFilters}
                    />
                  </td>
                </tr>
              ) : (
                filteredFlags.map((flag) => (
                  <FlagRow
                    key={flag.id}
                    flag={flag}
                    currentEnv={currentEnv}
                    envStates={flagStates[flag.id]}
                    onToggle={(env, value) =>
                      toggleFlag(
                        flag.id,
                        env,
                        value
                      )
                    }
                    onClick={() =>
                      setSelectedFlag(flag)
                    }
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flags-count">
          Showing {filteredFlags.length} of{' '}
          {FLAGS.length} flags
        </div>
      </div>

      {selectedFlag && (
        <FlagDetailSlideOver
          flag={selectedFlag}
          onClose={() =>
            setSelectedFlag(null)
          }
          onToast={onToast}
        />
      )}
    </div>
  )
}

interface FlagRowProps {
  flag: Flag
  currentEnv: EnvName
  envStates: Record<string, boolean>
  onToggle: (
    env: string,
    value: boolean
  ) => void
  onClick: () => void
}

function FlagRow({
  flag,
  currentEnv,
  envStates,
  onToggle,
  onClick,
}: FlagRowProps) {
  const isEnabled =
    envStates[currentEnv] ?? false

  return (
    <tr
      className={`flag-row ${
        flag.justUpdated
          ? 'just-updated'
          : ''
      }`}
      onClick={onClick}
    >
      <td className="flag-info">
        <div className="flag-name">
          {flag.name}
        </div>

        <div className="flag-key-row">
          <code className="flag-key">
            {flag.key}
          </code>

          {flag.justUpdated && (
            <span className="live-indicator">
              LIVE
            </span>
          )}
        </div>
      </td>

      <td>
        <span className="type-badge">
          {flag.type}
        </span>
      </td>

      <td>
        <Toggle
          on={isEnabled}
          onChange={(value) =>
            onToggle(currentEnv, value)
          }
        />
      </td>

      <td className="modified-cell">
        <div className="modified-info">
          <span>
            {flag.lastModified}
          </span>
        </div>
      </td>

      <td className="action-cell">
        <ChevronRight
          size={14}
          className="row-chevron"
        />
      </td>
    </tr>
  )
}

/* =================================
   Toggle
================================= */

interface ToggleProps {
  on: boolean
  onChange: (value: boolean) => void
}

function Toggle({
  on,
  onChange,
}: ToggleProps) {
  return (
    <button
      type="button"
      className={`flag-toggle ${
        on ? 'enabled' : ''
      }`}
      aria-label={
        on
          ? 'Disable flag'
          : 'Enable flag'
      }
      onClick={(event) => {
        event.stopPropagation()
        onChange(!on)
      }}
    >
      <span />
    </button>
  )
}

/* =================================
   Skeleton
================================= */

function SkeletonRow() {
  return (
    <tr className="skeleton-row">
      <td>
        <div className="skeleton skeleton-large" />
      </td>

      <td>
        <div className="skeleton skeleton-small" />
      </td>

      <td>
        <div className="skeleton skeleton-toggle" />
      </td>

      <td>
        <div className="skeleton skeleton-medium" />
      </td>

      <td />
    </tr>
  )
}

/* =================================
   Empty State
================================= */

function EmptyFlags({
  onClear,
}: {
  onClear: () => void
}) {
  return (
    <div className="empty-flags">
      <div className="empty-icon">
        <Search size={20} />
      </div>

      <div className="empty-title">
        No matching flags
      </div>

      <div className="empty-description">
        Try adjusting your search or filter
        criteria
      </div>

      <button
        type="button"
        className="clear-filters-btn"
        onClick={onClear}
      >
        Clear all filters
      </button>
    </div>
  )
}