import { X, Copy, Check, Clock, Pencil } from 'lucide-react'
import { useState } from 'react'
import { type Flag, ENVIRONMENTS } from '../data'

interface FlagDetailProps {
  flag: Flag
  onClose: () => void
  onToast: (msg: string, type: 'success' | 'error' | 'info') => void
}

const TYPE_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  boolean: { bg: '#15201D', border: '#1E2E2A', text: '#7A9E90' },
  string:  { bg: '#111C20', border: '#192A32', text: '#6A8E9E' },
  number:  { bg: '#1C1A10', border: '#2A2718', text: '#9A8A5A' },
  json:    { bg: '#181422', border: '#252040', text: '#857898' },
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      style={{
        width: 36,
        height: 20,
        borderRadius: 10,
        background: on ? '#10B981' : '#1E2926',
        border: 'none',
        cursor: 'pointer',
        position: 'relative',
        transition: 'background 0.15s',
        padding: 0,
        flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute',
        top: 2,
        left: on ? 18 : 2,
        width: 16,
        height: 16,
        borderRadius: '50%',
        background: '#F0FDF4',
        transition: 'left 0.15s',
      }} />
    </button>
  )
}

function CopyButton({ text, onCopy }: { text: string; onCopy: () => void }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(text).catch(() => {})
    setCopied(true)
    onCopy()
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={handleCopy} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B8E87', display: 'flex', alignItems: 'center', padding: 2 }}>
      {copied ? <Check size={11} style={{ color: '#10B981' }} /> : <Copy size={11} />}
    </button>
  )
}

const ACTIVITY = [
  { user: 'Arjun Kapoor', initials: 'AK', color: '#10B981', action: 'disabled in production', time: '12 min ago' },
  { user: 'Riya Khanna', initials: 'RK', color: '#F59E0B', action: 'enabled in staging', time: '2 hours ago' },
  { user: 'Jana Liu', initials: 'JL', color: '#38BDF8', action: 'created flag', time: '3 days ago' },
]

export default function FlagDetailSlideOver({ flag, onClose, onToast }: FlagDetailProps) {
  const [envStates, setEnvStates] = useState({ ...flag.environments })

  const toggle = (env: string, val: boolean) => {
    setEnvStates(s => ({ ...s, [env]: val }))
    onToast(`Flag ${val ? 'enabled' : 'disabled'} in ${env}`, 'success')
  }

  return (
    <div
      style={{
        position: 'fixed',
        right: 0,
        top: 0,
        bottom: 0,
        width: 420,
        background: '#0B100F',
        borderLeft: '1px solid #1E2926',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideIn 0.2s ease',
        boxShadow: '-8px 0 40px rgba(0,0,0,0.5)',
      }}
    >
      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>

      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #1E2926', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 15, fontWeight: 600, color: '#F0FDF4' }}>{flag.name}</span>
            <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 4, background: TYPE_STYLES[flag.type].bg, color: TYPE_STYLES[flag.type].text, border: `1px solid ${TYPE_STYLES[flag.type].border}` }}>
              {flag.type}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#7AAEC0', background: '#0F1C22', padding: '2px 7px', borderRadius: 4, border: '1px solid #192A34' }}>
              {flag.key}
            </code>
            <CopyButton text={flag.key} onCopy={() => onToast('Key copied to clipboard', 'info')} />
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B8E87', padding: 4, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <X size={16} />
        </button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px' }}>
        {/* Description */}
        <p style={{ fontSize: 13, color: '#94A3A8', lineHeight: 1.6, margin: '0 0 20px' }}>{flag.description}</p>

        {/* Meta */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <div style={{ background: '#101715', border: '1px solid #1E2926', borderRadius: 6, padding: '10px 12px' }}>
            <div style={{ fontSize: 10, color: '#6B8E87', fontWeight: 600, letterSpacing: '0.06em', marginBottom: 4 }}>CREATED</div>
            <div style={{ fontSize: 12, color: '#F0FDF4' }}>{flag.createdAt}</div>
          </div>
          <div style={{ background: '#101715', border: '1px solid #1E2926', borderRadius: 6, padding: '10px 12px' }}>
            <div style={{ fontSize: 10, color: '#6B8E87', fontWeight: 600, letterSpacing: '0.06em', marginBottom: 4 }}>LAST MODIFIED</div>
            <div style={{ fontSize: 12, color: '#F0FDF4' }}>{flag.lastModified}</div>
            <div style={{ fontSize: 11, color: '#6B8E87' }}>by {flag.modifiedBy.name}</div>
          </div>
        </div>

        {/* Tags */}
        {flag.tags && flag.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 20 }}>
            {flag.tags.map(tag => (
              <span key={tag} style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 20, background: '#141F1C', color: '#6B8E87', border: '1px solid #1E2926' }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Environments */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: '#6B8E87', fontWeight: 600, letterSpacing: '0.06em', marginBottom: 10 }}>ENVIRONMENTS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {ENVIRONMENTS.map(env => (
              <div
                key={env.id}
                style={{ background: '#101715', border: '1px solid #1E2926', borderRadius: 6, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 }}
              >
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: env.color, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: '#F0FDF4', flex: 1, fontWeight: 500 }}>{env.name}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {flag.type !== 'boolean' && (
                    <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#6B8E87', background: '#141F1C', padding: '1px 6px', borderRadius: 3 }}>
                      {String(flag.envValues[env.key]).slice(0, 20)}
                    </code>
                  )}
                  <Toggle on={envStates[env.key]} onChange={(v) => toggle(env.name.toLowerCase(), v)} />
                  <button style={{ background: 'none', border: '1px solid #1E2926', cursor: 'pointer', color: '#6B8E87', fontSize: 11, padding: '3px 8px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Pencil size={10} />
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div style={{ fontSize: 11, color: '#6B8E87', fontWeight: 600, letterSpacing: '0.06em', marginBottom: 10 }}>RECENT ACTIVITY</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {ACTIVITY.map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, paddingBottom: i < ACTIVITY.length - 1 ? 14 : 0, position: 'relative' }}>
                {i < ACTIVITY.length - 1 && <div style={{ position: 'absolute', left: 11, top: 22, bottom: 0, width: 1, background: '#1E2926' }} />}
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: a.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, color: '#080C0B', flexShrink: 0, zIndex: 1 }}>
                  {a.initials}
                </div>
                <div>
                  <span style={{ fontSize: 12, color: '#F0FDF4' }}><strong>{a.user}</strong> {a.action}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#6B8E87', marginTop: 1 }}>
                    <Clock size={10} />
                    {a.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div style={{ padding: '12px 20px', borderTop: '1px solid #1E2926', display: 'flex', gap: 8 }}>
        <button
          style={{ flex: 1, background: '#10B981', color: '#080C0B', border: 'none', borderRadius: 6, padding: '8px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: "'Sora', sans-serif" }}
          onClick={() => onToast('Flag settings saved', 'success')}
        >
          Save Changes
        </button>
        <button
          style={{ background: 'rgba(244,63,94,0.1)', color: '#F43F5E', border: '1px solid rgba(244,63,94,0.3)', borderRadius: 6, padding: '8px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
          onClick={() => onToast('Delete flag?', 'error')}
        >
          Delete
        </button>
      </div>
    </div>
  )
}
