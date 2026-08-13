import { useEffect } from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

export interface ToastData {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
}

interface ToastProps {
  toasts: ToastData[]
  onDismiss: (id: string) => void
}

const COLORS = {
  success: { bg: '#0F1713', border: '#1E3028', icon: '#10B981' },
  error: { bg: '#180E12', border: '#2E1A20', icon: '#C06070' },
  info: { bg: '#0D1418', border: '#1A2530', icon: '#38BDF8' },
}

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
}

function Toast({ toast, onDismiss }: { toast: ToastData; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000)
    return () => clearTimeout(t)
  }, [onDismiss])

  const c = COLORS[toast.type]
  const Icon = ICONS[toast.type]

  return (
    <div
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: 8,
        padding: '10px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        minWidth: 280,
        maxWidth: 380,
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        animation: 'toastIn 0.2s ease',
      }}
    >
      <Icon size={14} style={{ color: c.icon, flexShrink: 0 }} />
      <span style={{ fontSize: 13, color: '#F0FDF4', flex: 1 }}>{toast.message}</span>
      <button onClick={onDismiss} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B8E87', padding: 0, display: 'flex', alignItems: 'center' }}>
        <X size={13} />
      </button>
    </div>
  )
}

export default function ToastContainer({ toasts, onDismiss }: ToastProps) {
  return (
    <>
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
        {toasts.map(t => (
          <Toast key={t.id} toast={t} onDismiss={() => onDismiss(t.id)} />
        ))}
      </div>
    </>
  )
}
