import { useState } from 'react'
import { ArrowLeft, Copy, Check } from 'lucide-react'

import './CreateFlagPage.css'

type Page = 'flags' | 'create-flag' | string

interface CreateFlagPageProps {
  onNavigate: (page: Page) => void
  onToast: (
    msg: string,
    type: 'success' | 'error' | 'info'
  ) => void
}

type FlagType = 'boolean' | 'string' | 'number' | 'json'

const TYPES: {
  key: FlagType
  label: string
  desc: string
}[] = [
  {
    key: 'boolean',
    label: 'Boolean',
    desc: 'true / false toggle',
  },
  {
    key: 'string',
    label: 'String',
    desc: 'arbitrary text value',
  },
  {
    key: 'number',
    label: 'Number',
    desc: 'integer or decimal',
  },
  {
    key: 'json',
    label: 'JSON',
    desc: 'structured object / array',
  },
]

// const ENVS = [
//   'development',
//   'staging',
//   'production',
// ]

// const ENV_COLORS: Record<string, string> = {
//   development: 'var(--env-1)',
//   staging: 'var(--env-3)',
//   production: 'var(--env-2)',
// }

function toKey(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function CreateFlagPage({
  onNavigate,
  onToast,
}: CreateFlagPageProps) {
  const [name, setName] = useState('')
  const [keyOverride, setKeyOverride] = useState('')
  const [keyEdited, setKeyEdited] = useState(false)

  const [description, setDescription] =
    useState('')

  const [type, setType] = useState<FlagType>('boolean')

  const [defaultBool, setDefaultBool] = useState(false)

  const [defaultStr, setDefaultStr] =  useState('')

  const [defaultNum, setDefaultNum] = useState('0')

  const [defaultJson, setDefaultJson] = useState('{}')

  const [envScope, setEnvScope] = useState<Record<string, boolean>>({
    development: true,
    staging: true,
    production: false,
  })

  const [copied, setCopied] =
    useState(false)

  const key = keyEdited
    ? keyOverride
    : toKey(name)

  const displayKey =
    key || 'my-flag-key'

  const codeSnippet =
    type === 'boolean'
      ? `const isEnabled = useFlag('${displayKey}', false)`
      : `const value = useFlag('${displayKey}', ${
          type === 'number'
            ? defaultNum || '0'
            : type === 'string'
              ? `'${defaultStr || 'default'}'`
              : '{}'
        })`

  const handleCopy = () => {
    navigator.clipboard
      .writeText(codeSnippet)
      .catch(() => {})

    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  const handleSubmit = () => {
    if (!name.trim()) return

    onToast(
      `Flag "${key}" created successfully`,
      'success'
    )

    onNavigate('flags')
  }

  return (
    <div className="create-flag-page">

      {/* =========================
          Header
      ========================= */}

      <div className="create-flag-header">
        <button
          type="button"
          className="back-button"
          onClick={() =>
            onNavigate('flags')
          }
        >
          <ArrowLeft size={14} />
          Flags
        </button>

        <span className="breadcrumb-separator">
          /
        </span>

        <h1>Create Flag</h1>
      </div>

      <div className="create-flag-layout">

        {/* =========================
            Left: Form
        ========================= */}

        <div className="create-flag-form">

          {/* Basic Info */}

          <section className="form-card">
            <div className="card-title">
              BASIC INFO
            </div>

            <div className="form-fields">

              {/* Name */}

              <div className="form-field">
                <label htmlFor="flag-name">
                  Flag name{' '}
                  <span className="required">
                    *
                  </span>
                </label>

                <input
                  id="flag-name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="e.g. New Checkout Flow"
                />
              </div>

              {/* Key */}

              <div className="form-field">
                <label htmlFor="flag-key">
                  Flag key
                </label>

                <div className="key-input-wrapper">
                  <input
                    id="flag-key"
                    value={key}
                    onChange={(e) => {
                      setKeyEdited(true)
                      setKeyOverride(
                        e.target.value
                      )
                    }}
                    placeholder="new-checkout-flow"
                    className="key-input"
                  />

                  {!keyEdited && name && (
                    <span className="auto-generated">
                      auto-generated
                    </span>
                  )}
                </div>

                <div className="field-help">
                  Must be unique within this
                  project. Cannot be changed
                  after creation.
                </div>
              </div>

              {/* Description */}

              <div className="form-field">
                <label htmlFor="flag-description">
                  Description
                </label>

                <textarea
                  id="flag-description"
                  value={description}
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                  placeholder="What does this flag control? When should it be enabled?"
                  rows={3}
                />
              </div>

            </div>
          </section>

          {/* Flag Type */}

          <section className="form-card">
            <div className="card-title">
              FLAG TYPE
            </div>

            <div className="type-grid">
              {TYPES.map((flagType) => (
                <button
                  key={flagType.key}
                  type="button"
                  className={`type-option ${
                    type === flagType.key
                      ? 'selected'
                      : ''
                  } type-${flagType.key}`}
                  onClick={() =>
                    setType(
                      flagType.key
                    )
                  }
                >
                  <div className="type-option-label">
                    {flagType.label}
                  </div>

                  <div className="type-option-description">
                    {flagType.desc}
                  </div>
                </button>
              ))}
            </div>

            {/* Default Value */}

            <div className="default-value-section">
              <label>
                Default value
              </label>

              {/* Boolean */}

              {type === 'boolean' && (
                <div className="boolean-options">
                  {[true, false].map(
                    (value) => (
                      <button
                        key={String(value)}
                        type="button"
                        className={`boolean-option ${
                          defaultBool === value
                            ? 'selected'
                            : ''
                        }`}
                        onClick={() =>
                          setDefaultBool(
                            value
                          )
                        }
                      >
                        {value
                          ? 'true'
                          : 'false'}
                      </button>
                    )
                  )}
                </div>
              )}

              {/* String */}

              {type === 'string' && (
                <input
                  value={defaultStr}
                  onChange={(e) =>
                    setDefaultStr(
                      e.target.value
                    )
                  }
                  placeholder="Default string value"
                />
              )}

              {/* Number */}

              {type === 'number' && (
                <div className="number-inputs">
                  <input
                    type="number"
                    value={defaultNum}
                    onChange={(e) =>
                      setDefaultNum(
                        e.target.value
                      )
                    }
                    placeholder="0"
                    className="number-value"
                  />

                  <input
                    placeholder="Min"
                    className="number-limit"
                  />

                  <input
                    placeholder="Max"
                    className="number-limit"
                  />
                </div>
              )}

              {/* JSON */}

              {type === 'json' && (
                <textarea
                  value={defaultJson}
                  onChange={(e) =>
                    setDefaultJson(
                      e.target.value
                    )
                  }
                  rows={4}
                  placeholder="{}"
                  className="json-input"
                />
              )}
            </div>
          </section>

          {/* Submit */}

          <div className="form-actions">
            <button
              type="button"
              className="create-button"
              disabled={!name.trim()}
              onClick={handleSubmit}
            >
              Create Flag
            </button>

            <button
              type="button"
              className="cancel-button"
              onClick={() =>
                onNavigate('flags')
              }
            >
              Cancel
            </button>
          </div>

        </div>

        {/* =========================
            Right: Preview
        ========================= */}

        <div className="create-flag-sidebar">

          {/* Preview */}

          <section className="sidebar-card">
            <div className="sidebar-title">
              PREVIEW
            </div>

            <div className="flag-preview">

              <div className="preview-info">
                <div
                  className={`preview-name ${
                    name
                      ? 'has-value'
                      : ''
                  }`}
                >
                  {name || 'Flag name'}
                </div>

                <code className="preview-key">
                  {displayKey}
                </code>
              </div>

              <span
                className={`preview-type type-${type}`}
              >
                {type}
              </span>

              {/* <div className="environment-dots">
                {ENVS.map((env) => (
                  <div
                    key={env}
                    className="environment-dot"
                    style={{
                      background:
                        envScope[env]
                          ? ENV_COLORS[env]
                          : 'var(--color-border)',
                    }}
                    title={env}
                  />
                ))}
              </div> */}

            </div>
          </section>

          {/* Environment Scope */}

          {/* <section className="sidebar-card">
            <div className="sidebar-title">
              ACTIVE IN ENVIRONMENTS
            </div>

            <div className="environment-options">
              {ENVS.map((env) => (
                <label
                  key={env}
                  className="environment-option"
                >
                  <input
                    type="checkbox"
                    checked={
                      envScope[env]
                    }
                    onChange={(e) =>
                      setEnvScope(
                        (current) => ({
                          ...current,
                          [env]:
                            e.target
                              .checked,
                        })
                      )
                    }
                    style={{
                      accentColor:
                        ENV_COLORS[env],
                    }}
                  />

                  <span
                    className="environment-color-dot"
                    style={{
                      background:
                        ENV_COLORS[env],
                    }}
                  />

                  <span className="environment-name">
                    {env}
                  </span>

                  {envScope[env] && (
                    <span className="environment-enabled">
                      enabled
                    </span>
                  )}
                </label>
              ))}
            </div>
          </section> */}

          {/* SDK Usage */}

          <section className="sidebar-card">
            <div className="sdk-header">
              <div className="sidebar-title">
                SDK USAGE
              </div>

              <button
                type="button"
                className="copy-code-button"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check size={10} />
                ) : (
                  <Copy size={10} />
                )}

                {copied
                  ? 'Copied!'
                  : 'Copy'}
              </button>
            </div>

            <pre className="code-preview">
              <span className="code-comment">
                // React SDK
              </span>
              {'\n'}

              {type === 'boolean' ? (
                <>
                  <span className="code-purple">
                    const
                  </span>{' '}
                  <span className="code-blue">
                    isEnabled
                  </span>
                  {' = '}
                  <span className="code-green">
                    useFlag
                  </span>
                  {'('}
                  <span className="code-amber">
                    '{displayKey}'
                  </span>
                  {', '}
                  <span className="code-amber">
                    false
                  </span>
                  {')'}
                </>
              ) : (
                <>
                  <span className="code-purple">
                    const
                  </span>{' '}
                  <span className="code-blue">
                    value
                  </span>
                  {' = '}
                  <span className="code-green">
                    useFlag
                  </span>
                  {'('}
                  <span className="code-amber">
                    '{displayKey}'
                  </span>
                  {', '}

                  <span className="code-amber">
                    {type === 'number'
                      ? defaultNum ||
                        '0'
                      : type ===
                          'string'
                        ? `'${defaultStr || 'default'}'`
                        : '{}'}
                  </span>

                  {')'}
                </>
              )}
            </pre>

            <div className="sdk-note">
              Real-time via SSE — no polling
              required
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}