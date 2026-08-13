import { useState } from 'react'
import { Filter } from 'lucide-react'
import { AUDIT_LOG } from '../data'

const ACTION_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'toggled off':    { bg: '#1C1018', border: '#2A1820', text: '#A06878' },
  'toggled on':     { bg: '#121E1A', border: '#1A2C24', text: '#70A090' },
  'updated value':  { bg: '#101820', border: '#182430', text: '#6080A0' },
  'created flag':   { bg: '#121E1A', border: '#1A2C24', text: '#70A090' },
  'deleted flag':   { bg: '#1C1018', border: '#2A1820', text: '#A06878' },
  'rotated SDK key':{ bg: '#1C1A10', border: '#2A2618', text: '#907858' },
}

const getActionColor = (action: string) => {
  return ACTION_COLORS[action] || { bg: 'rgba(148,163,168,0.1)', text: '#94A3A8', border: 'rgba(148,163,168,0.3)' }
}

export default function AuditLogPage() {
  const [filterUser, setFilterUser] = useState('all')
  const [filterEnv, setFilterEnv] = useState('all')

  const users = Array.from(new Set(AUDIT_LOG.map(e => e.user.name)))
  const envs = ['development', 'staging', 'production']

  const filtered = AUDIT_LOG.filter(entry => {
    const matchUser = filterUser === 'all' || entry.user.name === filterUser
    const matchEnv = filterEnv === 'all' || entry.environment === filterEnv
    return matchUser && matchEnv
  })

  return (
    <div style={{ padding: '24px 28px', maxWidth: 900 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 22 }}>
        <div>
          <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 22, fontWeight: 700, color: '#F0FDF4', margin: 0, letterSpacing: '-0.02em' }}>Audit Log</h1>
          <p style={{ fontSize: 13, color: '#6B8E87', margin: '4px 0 0' }}>Full activity history for this project</p>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#141F1C', border: '1px solid #1E2926', borderRadius: 6, padding: '7px 12px', fontSize: 12, color: '#94A3A8', cursor: 'pointer' }}>
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18, padding: '10px 14px', background: '#101715', border: '1px solid #1E2926', borderRadius: 7 }}>
        <Filter size={12} style={{ color: '#6B8E87' }} />
        <span style={{ fontSize: 11, color: '#6B8E87', fontWeight: 600, letterSpacing: '0.04em' }}>FILTER</span>

        <select
          value={filterUser}
          onChange={e => setFilterUser(e.target.value)}
          style={{ background: '#141F1C', border: '1px solid #1E2926', color: '#F0FDF4', borderRadius: 5, padding: '4px 8px', fontSize: 12, outline: 'none', cursor: 'pointer', marginLeft: 8 }}
        >
          <option value="all">All users</option>
          {users.map(u => <option key={u} value={u}>{u}</option>)}
        </select>

        <select
          value={filterEnv}
          onChange={e => setFilterEnv(e.target.value)}
          style={{ background: '#141F1C', border: '1px solid #1E2926', color: '#F0FDF4', borderRadius: 5, padding: '4px 8px', fontSize: 12, outline: 'none', cursor: 'pointer' }}
        >
          <option value="all">All environments</option>
          {envs.map(e => <option key={e} value={e} style={{ textTransform: 'capitalize' }}>{e}</option>)}
        </select>

        {(filterUser !== 'all' || filterEnv !== 'all') && (
          <button
            onClick={() => { setFilterUser('all'); setFilterEnv('all') }}
            style={{ fontSize: 11, color: '#10B981', background: 'none', border: 'none', cursor: 'pointer', marginLeft: 4 }}
          >
            Clear filters
          </button>
        )}

        <span style={{ marginLeft: 'auto', fontSize: 11, color: '#6B8E87' }}>{filtered.length} entries</span>
      </div>

      {/* Log entries */}
      <div style={{ background: '#101715', border: '1px solid #1E2926', borderRadius: 8, overflow: 'hidden' }}>
        {filtered.map((entry, i) => {
          const ac = getActionColor(entry.action)
          return (
            <div
              key={entry.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                padding: '13px 16px',
                borderBottom: i < filtered.length - 1 ? '1px solid #1E2926' : 'none',
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.015)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              {/* Avatar */}
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: entry.user.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#080C0B', flexShrink: 0, marginTop: 1 }}>
                {entry.user.initials}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap', marginBottom: 3 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#F0FDF4' }}>{entry.user.name}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '1px 7px', borderRadius: 20, background: ac.bg, color: ac.text, border: `1px solid ${ac.border}` }}>
                    {entry.action}
                  </span>
                  {entry.flagKey && (
                    <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#7AAEC0', background: '#0F1C22', padding: '1px 6px', borderRadius: 3, border: '1px solid #192A34' }}>
                      {entry.flagKey}
                    </code>
                  )}
                  {entry.environment && (
                    <span style={{ fontSize: 10, color: '#6B8E87', background: '#141F1C', padding: '1px 6px', borderRadius: 3, border: '1px solid #1E2926', textTransform: 'capitalize' }}>
                      {entry.environment}
                    </span>
                  )}
                </div>

                {/* Value change */}
                {entry.from !== undefined && entry.to !== undefined && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#A06878', background: '#1C1018', padding: '1px 5px', borderRadius: 3, border: '1px solid #2A1820', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {entry.from}
                    </code>
                    <span style={{ fontSize: 10, color: '#3D5550' }}>→</span>
                    <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#70A090', background: '#121E1A', padding: '1px 5px', borderRadius: 3, border: '1px solid #1A2C24', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {entry.to}
                    </code>
                  </div>
                )}

                <div style={{ fontSize: 11, color: '#6B8E87' }}>{entry.detail}</div>
              </div>

              {/* Timestamp */}
              <div style={{ fontSize: 11, color: '#6B8E87', whiteSpace: 'nowrap', flexShrink: 0, fontFamily: "'JetBrains Mono', monospace" }}>
                {entry.timestamp}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
