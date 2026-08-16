import { X, Copy, Check, Clock, Pencil } from 'lucide-react'
import { useEffect, useState } from 'react'
import { type FlagEnvironmentValue } from '../data'
import { useSelector } from 'react-redux'
import type { RootState } from '@/app/store'
import { getFlagEnvironmentValues } from '@/services/flag.service'
import './FlagDetailSlideOver.css'

interface FlagDetailProps {
  onClose: () => void
  onToast: (
    msg: string,
    type: 'success' | 'error' | 'info'
  ) => void
}

const ENVIRONMENT_COLORS = [
  'var(--env-1)',
  'var(--env-2)',
  'var(--env-3)',
  'var(--env-4)',
  'var(--env-5)',
  'var(--env-6)',
  'var(--env-7)',
  'var(--env-8)',
  'var(--env-9)',
  'var(--env-10)',
]

function formatDate(dateString?: string) {
  if (!dateString) return '—'

  const date = new Date(dateString)

  if (Number.isNaN(date.getTime())) {
    return dateString
  }

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function formatDateTime(dateString?: string) {
  if (!dateString) return '—'

  const date = new Date(dateString)

  if (Number.isNaN(date.getTime())) {
    return dateString
  }

  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function Toggle({
  on,
  onChange,
}: {
  on: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <button
      type="button"
      className={`detail-toggle ${on ? 'enabled' : 'disabled'}`}
      aria-label={on ? 'Disable flag' : 'Enable flag'}
      onClick={() => onChange(!on)}
    >
      <span />
    </button>
  )
}

function CopyButton({
  text,
  onCopy,
}: {
  text?: string
  onCopy: () => void
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard
      .writeText(text ?? '')
      .catch(() => {})

    setCopied(true)
    onCopy()

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <button
      type="button"
      className="copy-button"
      onClick={handleCopy}
      aria-label="Copy flag key"
    >
      {copied ? (
        <Check size={11} />
      ) : (
        <Copy size={11} />
      )}
    </button>
  )
}

export default function FlagDetailSlideOver({
  onClose,
  onToast,
}: FlagDetailProps) {
  const [flagEnvironmentsValues, setFlagEnvironmentsValues] =
    useState<FlagEnvironmentValue[]>([])

  const flag = useSelector(
    (state: RootState) => state.flag.selectedFlag
  )

  useEffect(() => {
    if (!flag) return

    fetchFlagEnvironmentValues(flag.id)
  }, [flag?.id])

  const fetchFlagEnvironmentValues = async (
    flagId: string
  ) => {
    try {
      const response =
        await getFlagEnvironmentValues(flagId)

      setFlagEnvironmentsValues(response)
    } catch (error) {
      console.error(
        'Failed to fetch flag environment values:',
        error
      )

      onToast(
        'Failed to load flag environments',
        'error'
      )
    }
  }

  if (!flag) return null

  return (
    <div className="flag-detail-overlay">
      <div className="flag-detail-panel">

        {/* =========================
            Header
        ========================= */}

        <div className="flag-detail-header">
          <div className="flag-detail-heading">

            <div className="flag-title-row">
              <span className="flag-detail-name">
                {flag.name}
              </span>

              <span
                className={`detail-type-badge type-${flag.type}`}
              >
                {flag.type}
              </span>
            </div>

            <div className="flag-key-row">
              <code className="detail-flag-key">
                {flag.key}
              </code>

              <CopyButton
                text={flag.key}
                onCopy={() =>
                  onToast(
                    'Key copied to clipboard',
                    'info'
                  )
                }
              />
            </div>
          </div>

          <button
            type="button"
            className="close-button"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* =========================
            Body
        ========================= */}

        <div className="flag-detail-body">

          {/* Description */}

          <p className="flag-description">
            {flag.description ||
              'No description provided.'}
          </p>

          {/* Metadata */}

          <div className="flag-meta">

            <div className="meta-card">
              <div className="meta-label">
                CREATED
              </div>

              <div className="meta-value">
                {formatDate(flag.created_at)}
              </div>

              <div className="meta-subvalue">
                {formatDateTime(flag.created_at)}
              </div>
            </div>

            <div className="meta-card">
              <div className="meta-label">
                LAST MODIFIED
              </div>

              <div className="meta-value">
                {formatDate(flag.updated_at)}
              </div>

              <div className="meta-subvalue">
                {formatDateTime(flag.updated_at)}
              </div>
            </div>

          </div>

          {/* =========================
              Environments
          ========================= */}

          <section className="detail-section">
            <div className="section-label">
              ENVIRONMENTS
            </div>

            <div className="environment-list">

              {flagEnvironmentsValues.map(
                (flagEnv, index) => (
                  <div
                    key={`${flagEnv.environment_name}-${flagEnv.id}`}
                    className="environment-card"
                  >
                    <span
                      className="environment-dot"
                      style={{
                        background:
                          ENVIRONMENT_COLORS[
                            index %
                              ENVIRONMENT_COLORS.length
                          ],
                      }}
                    />

                    <span className="environment-name">
                      {flagEnv.environment_name}
                    </span>

                    <div className="environment-actions">

                      {(
                        <code className="environment-value">
                          {flag.type !== 'json' ? String(
                            flagEnv.targeting_return_value
                          ) : JSON.stringify(flagEnv.targeting_return_value)}
                        </code>
                      )}

                      <Toggle
                        on={flagEnv.is_enabled}
                        onChange={() => {}}
                      />

                      <button
                        type="button"
                        className="edit-button"
                        onClick={() =>
                          onToast(
                            'Edit environment coming soon',
                            'info'
                          )
                        }
                      >
                        <Pencil size={10} />
                        Edit
                      </button>

                    </div>
                  </div>
                )
              )}

              {flagEnvironmentsValues.length === 0 && (
                <div className="empty-environments">
                  No environment values found.
                </div>
              )}

            </div>
          </section>

          {/* =========================
              Recent Activity
          ========================= */}

          <section className="detail-section">
            <div className="section-label">
              RECENT ACTIVITY
            </div>

            <div className="activity-list">

              <ActivityItem
                initials="AK"
                user="Arjun Kapoor"
                action="disabled in production"
                time="12 min ago"
                color="var(--env-2)"
                isLast={false}
              />

              <ActivityItem
                initials="RK"
                user="Riya Khanna"
                action="enabled in staging"
                time="2 hours ago"
                color="var(--env-3)"
                isLast={false}
              />

              <ActivityItem
                initials="JL"
                user="Jana Liu"
                action="created flag"
                time="3 days ago"
                color="var(--env-1)"
                isLast
              />

            </div>
          </section>

        </div>

        {/* =========================
            Footer
        ========================= */}

        <div className="flag-detail-footer">

          <button
            type="button"
            className="save-button"
            onClick={() =>
              onToast(
                'Flag settings saved',
                'success'
              )
            }
          >
            Save Changes
          </button>

          <button
            type="button"
            className="delete-button"
            onClick={() =>
              onToast(
                'Delete flag?',
                'error'
              )
            }
          >
            Delete
          </button>

        </div>

      </div>
    </div>
  )
}

/* =================================
   Activity Item
================================= */

interface ActivityItemProps {
  initials: string
  user: string
  action: string
  time: string
  color: string
  isLast: boolean
}

function ActivityItem({
  initials,
  user,
  action,
  time,
  color,
  isLast,
}: ActivityItemProps) {
  return (
    <div
      className={`activity-item ${
        isLast ? 'last' : ''
      }`}
    >
      {!isLast && (
        <div className="activity-line" />
      )}

      <div
        className="activity-avatar"
        style={{
          background: color,
        }}
      >
        {initials}
      </div>

      <div className="activity-content">
        <span className="activity-text">
          <strong>{user}</strong>{' '}
          {action}
        </span>

        <div className="activity-time">
          <Clock size={10} />
          {time}
        </div>
      </div>
    </div>
  )
}