import { useState } from 'react'
import { ArrowLeft, Copy, Check } from 'lucide-react'

type Page = 'flags' | 'create-flag' | string

interface CreateFlagPageProps {
  onNavigate: (page: Page) => void
  onToast: (msg: string, type: 'success' | 'error' | 'info') => void
}

const TYPES = [
  { key: 'boolean', label: 'Boolean', desc: 'true / false toggle', color: '#10B981' },
  { key: 'string', label: 'String', desc: 'arbitrary text value', color: '#38BDF8' },
  { key: 'number', label: 'Number', desc: 'integer or decimal', color: '#F59E0B' },
  { key: 'json', label: 'JSON', desc: 'structured object / array', color: '#A78BFA' },
]

const ENVS = ['development', 'staging', 'production']
const ENV_COLORS: Record<string, string> = { development: '#94A3A8', staging: '#F59E0B', production: '#10B981' }

function toKey(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function CreateFlagPage({ onNavigate, onToast }: CreateFlagPageProps) {
  const [name, setName] = useState('')
  const [keyOverride, setKeyOverride] = useState('')
  const [keyEdited, setKeyEdited] = useState(false)
  const [description, setDescription] = useState('')
  const [type, setType] = useState('boolean')
  const [defaultBool, setDefaultBool] = useState(false)
  const [defaultStr, setDefaultStr] = useState('')
  const [defaultNum, setDefaultNum] = useState('0')
  const [defaultJson, setDefaultJson] = useState('{}')
  const [envScope, setEnvScope] = useState<Record<string, boolean>>({ development: true, staging: true, production: false })
  const [copied, setCopied] = useState(false)

  const key = keyEdited ? keyOverride : toKey(name)
  const displayKey = key || 'my-flag-key'

  const codeSnippet = type === 'boolean'
    ? `const isEnabled = useFlag('${displayKey}', false)`
    : `const value = useFlag('${displayKey}', ${type === 'number' ? defaultNum || '0' : type === 'string' ? `'${defaultStr || 'default'}'` : '{}'})`

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippet).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmit = () => {
    if (!name.trim()) return
    onToast(`Flag "${key}" created successfully`, 'success')
    onNavigate('flags')
  }

  const inputStyle = {
    width: '100%',
    background: '#141F1C',
    border: '1px solid #1E2926',
    color: '#F0FDF4',
    borderRadius: 6,
    padding: '9px 12px',
    fontSize: 13,
    outline: 'none',
    fontFamily: "'Inter', sans-serif",
  }

  return (
    <div style={{ padding: '24px 28px', maxWidth: 1100, height: '100%', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <button
          onClick={() => onNavigate('flags')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B8E87', display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, padding: 0 }}
        >
          <ArrowLeft size={14} />
          Flags
        </button>
        <span style={{ color: '#1E2926' }}>/</span>
        <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 18, fontWeight: 700, color: '#F0FDF4', margin: 0, letterSpacing: '-0.02em' }}>Create Flag</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20, alignItems: 'start' }}>
        {/* Left: Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Name + Key */}
          <div style={{ background: '#101715', border: '1px solid #1E2926', borderRadius: 8, padding: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#94A3A8', marginBottom: 14, letterSpacing: '0.04em' }}>BASIC INFO</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#94A3A8', marginBottom: 5 }}>Flag name <span style={{ color: '#F43F5E' }}>*</span></label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. New Checkout Flow"
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = '#253330')}
                  onBlur={e => (e.target.style.borderColor = '#1E2926')}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#94A3A8', marginBottom: 5 }}>Flag key</label>
                <div style={{ position: 'relative' }}>
                  <input
                    value={key}
                    onChange={e => { setKeyEdited(true); setKeyOverride(e.target.value) }}
                    placeholder="new-checkout-flow"
                    style={{ ...inputStyle, fontFamily: "'JetBrains Mono', monospace", color: '#7AAEC0', paddingRight: 80 }}
                    onFocus={e => (e.target.style.borderColor = '#253330')}
                    onBlur={e => (e.target.style.borderColor = '#1E2926')}
                  />
                  {!keyEdited && name && (
                    <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 10, color: '#6B8E87', fontStyle: 'italic' }}>auto-generated</span>
                  )}
                </div>
                <div style={{ fontSize: 11, color: '#6B8E87', marginTop: 4 }}>Must be unique within this project. Cannot be changed after creation.</div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#94A3A8', marginBottom: 5 }}>Description</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="What does this flag control? When should it be enabled?"
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
                  onFocus={e => (e.target.style.borderColor = '#253330')}
                  onBlur={e => (e.target.style.borderColor = '#1E2926')}
                />
              </div>
            </div>
          </div>

          {/* Type selector */}
          <div style={{ background: '#101715', border: '1px solid #1E2926', borderRadius: 8, padding: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#94A3A8', marginBottom: 14, letterSpacing: '0.04em' }}>FLAG TYPE</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 16 }}>
              {TYPES.map(t => (
                <button
                  key={t.key}
                  onClick={() => setType(t.key)}
                  style={{
                    background: type === t.key ? '#161E1C' : '#141F1C',
                    border: `1px solid ${type === t.key ? '#2E3D38' : '#1E2926'}`,
                    borderRadius: 6,
                    padding: '10px 12px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.1s',
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 600, color: type === t.key ? '#E0EDEA' : '#94A3A8' }}>{t.label}</div>
                  <div style={{ fontSize: 11, color: '#6B8E87', marginTop: 2 }}>{t.desc}</div>
                </button>
              ))}
            </div>

            {/* Dynamic default value input */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#94A3A8', marginBottom: 6 }}>Default value</label>
              {type === 'boolean' && (
                <div style={{ display: 'flex', gap: 8 }}>
                  {[true, false].map(v => (
                    <button
                      key={String(v)}
                      onClick={() => setDefaultBool(v)}
                      style={{
                        padding: '8px 20px',
                        borderRadius: 6,
                        border: `1px solid ${defaultBool === v ? '#2E3D38' : '#1E2926'}`,
                        background: defaultBool === v ? '#161E1C' : '#141F1C',
                        color: defaultBool === v ? '#C8DDD8' : '#6B8E87',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {v ? 'true' : 'false'}
                    </button>
                  ))}
                </div>
              )}
              {type === 'string' && (
                <input value={defaultStr} onChange={e => setDefaultStr(e.target.value)} placeholder="Default string value" style={inputStyle} />
              )}
              {type === 'number' && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <input type="number" value={defaultNum} onChange={e => setDefaultNum(e.target.value)} placeholder="0" style={{ ...inputStyle, maxWidth: 140 }} />
                  <input placeholder="Min" style={{ ...inputStyle, maxWidth: 100 }} />
                  <input placeholder="Max" style={{ ...inputStyle, maxWidth: 100 }} />
                </div>
              )}
              {type === 'json' && (
                <textarea value={defaultJson} onChange={e => setDefaultJson(e.target.value)} rows={4} placeholder="{}" style={{ ...inputStyle, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, resize: 'vertical' }} />
              )}
            </div>
          </div>

          {/* Submit */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleSubmit}
              disabled={!name.trim()}
              style={{
                background: name.trim() ? '#10B981' : '#1E2926',
                color: name.trim() ? '#080C0B' : '#6B8E87',
                border: 'none',
                borderRadius: 6,
                padding: '10px 20px',
                fontSize: 13,
                fontWeight: 700,
                cursor: name.trim() ? 'pointer' : 'not-allowed',
                fontFamily: "'Sora', sans-serif",
              }}
            >
              Create Flag
            </button>
            <button
              onClick={() => onNavigate('flags')}
              style={{ background: 'transparent', border: '1px solid #1E2926', borderRadius: 6, padding: '10px 16px', fontSize: 13, color: '#6B8E87', cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Right: Live Preview + Code */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, position: 'sticky', top: 0 }}>
          {/* Flag row preview */}
          <div style={{ background: '#101715', border: '1px solid #1E2926', borderRadius: 8, padding: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#6B8E87', letterSpacing: '0.06em', marginBottom: 12 }}>PREVIEW</div>
            <div style={{ background: '#0B100F', borderRadius: 6, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, border: '1px solid #1E2926' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: name ? '#F0FDF4' : '#6B8E87' }}>{name || 'Flag name'}</div>
                <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#7AAEC0', background: '#0F1C22', padding: '1px 6px', borderRadius: 3, border: '1px solid #192A34' }}>
                  {displayKey}
                </code>
              </div>
              <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 4, background: '#161E1C', color: '#8AA49E', border: '1px solid #253330' }}>
                {type}
              </span>
              <div style={{ display: 'flex', gap: 6 }}>
                {ENVS.map(e => (
                  <div key={e} style={{ width: 6, height: 6, borderRadius: '50%', background: envScope[e] ? ENV_COLORS[e] : '#1E2926' }} title={e} />
                ))}
              </div>
            </div>
          </div>

          {/* Env scope */}
          <div style={{ background: '#101715', border: '1px solid #1E2926', borderRadius: 8, padding: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#6B8E87', letterSpacing: '0.06em', marginBottom: 12 }}>ACTIVE IN ENVIRONMENTS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {ENVS.map(env => (
                <label key={env} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '6px 0' }}>
                  <input
                    type="checkbox"
                    checked={envScope[env]}
                    onChange={e => setEnvScope(s => ({ ...s, [env]: e.target.checked }))}
                    style={{ accentColor: ENV_COLORS[env], width: 13, height: 13 }}
                  />
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: ENV_COLORS[env], flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: '#F0FDF4', textTransform: 'capitalize' }}>{env}</span>
                  {envScope[env] && <span style={{ fontSize: 10, color: '#6B8E87', marginLeft: 'auto' }}>enabled</span>}
                </label>
              ))}
            </div>
          </div>

          {/* Code snippet */}
          <div style={{ background: '#101715', border: '1px solid #1E2926', borderRadius: 8, padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#6B8E87', letterSpacing: '0.06em' }}>SDK USAGE</div>
              <button
                onClick={handleCopy}
                style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: '1px solid #1E2926', borderRadius: 4, padding: '3px 8px', fontSize: 11, color: '#6B8E87', cursor: 'pointer' }}
              >
                {copied ? <Check size={10} style={{ color: '#10B981' }} /> : <Copy size={10} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre style={{ background: '#0B100F', borderRadius: 5, padding: '10px 12px', margin: 0, overflow: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#F0FDF4', lineHeight: 1.5, border: '1px solid #1E2926' }}>
              <span style={{ color: '#6B8E87' }}>{'// React SDK'}</span>{'\n'}
              {type === 'boolean' ? (
                <>
                  <span style={{ color: '#A78BFA' }}>const </span>
                  <span style={{ color: '#38BDF8' }}>isEnabled</span>
                  <span style={{ color: '#F0FDF4' }}> = </span>
                  <span style={{ color: '#10B981' }}>useFlag</span>
                  <span style={{ color: '#F0FDF4' }}>(</span>
                  <span style={{ color: '#F59E0B' }}>'{displayKey}'</span>
                  <span style={{ color: '#F0FDF4' }}>, </span>
                  <span style={{ color: '#F59E0B' }}>false</span>
                  <span style={{ color: '#F0FDF4' }}>)</span>
                </>
              ) : (
                <>
                  <span style={{ color: '#A78BFA' }}>const </span>
                  <span style={{ color: '#38BDF8' }}>value</span>
                  <span style={{ color: '#F0FDF4' }}> = </span>
                  <span style={{ color: '#10B981' }}>useFlag</span>
                  <span style={{ color: '#F0FDF4' }}>({'\''+displayKey+'\''}, {type === 'number' ? defaultNum || '0' : type === 'string' ? `'${defaultStr || 'default'}'` : '{}'})</span>
                </>
              )}
            </pre>
            <div style={{ fontSize: 11, color: '#6B8E87', marginTop: 8 }}>
              Real-time via SSE — no polling required
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
