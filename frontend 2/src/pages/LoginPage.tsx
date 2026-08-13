import { useState } from 'react'
import { Eye, EyeOff, Zap, AlertCircle } from 'lucide-react'
import { login } from '@/services/auth.service'
import axios from "axios"
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
      try {
        await login({ email, password });
        navigate("/");
      } catch (error: unknown) {
        console.log(error)
        if (axios.isAxiosError(error)) {
          setError(error.response?.data?.message ?? "Login failed");
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false)
      }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#080C0B', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      {/* Background glow */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, height: 600, background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, rgba(56,189,248,0.03) 50%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 400, padding: '0 20px', position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: 'linear-gradient(135deg, #10B981 0%, #0F766E 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, boxShadow: '0 0 16px rgba(16,185,129,0.15)' }}>
            <Zap size={20} fill="#F0FDF4" stroke="none" />
          </div>
          <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 22, fontWeight: 700, color: '#F0FDF4', margin: 0, letterSpacing: '-0.02em' }}>FlagPulse</h1>
          <p style={{ fontSize: 13, color: '#6B8E87', margin: '4px 0 0' }}>Self-hosted feature flags, real-time by default</p>
        </div>

        {/* Card */}
        <div style={{ background: '#101715', border: '1px solid #1E2926', borderRadius: 12, padding: '28px 28px 24px', boxShadow: '0 0 40px rgba(0,0,0,0.5)' }}>
          <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 17, fontWeight: 600, color: '#F0FDF4', margin: '0 0 20px', letterSpacing: '-0.01em' }}>Sign in to your account</h2>

          {/* Error banner */}
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: 6, padding: '8px 12px', marginBottom: 16 }}>
              <AlertCircle size={13} style={{ color: '#F43F5E', flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: '#F87171' }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#94A3A8', marginBottom: 5 }}>Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="arjun@acmecorp.dev"
                required
                style={{
                  width: '100%',
                  background: '#141F1C',
                  border: '1px solid #1E2926',
                  color: '#F0FDF4',
                  borderRadius: 6,
                  padding: '9px 12px',
                  fontSize: 13,
                  outline: 'none',
                  fontFamily: "'Inter', sans-serif",
                  transition: 'border-color 0.1s',
                }}
                onFocus={e => (e.target.style.borderColor = '#10B981')}
                onBlur={e => (e.target.style.borderColor = '#1E2926')}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#94A3A8', marginBottom: 5 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  style={{
                    width: '100%',
                    background: '#141F1C',
                    border: '1px solid #1E2926',
                    color: '#F0FDF4',
                    borderRadius: 6,
                    padding: '9px 36px 9px 12px',
                    fontSize: 13,
                    outline: 'none',
                    fontFamily: "'Inter', sans-serif",
                    transition: 'border-color 0.1s',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#10B981')}
                  onBlur={e => (e.target.style.borderColor = '#1E2926')}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(s => !s)}
                  style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6B8E87', display: 'flex', alignItems: 'center' }}
                >
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading ? '#059669' : 'linear-gradient(135deg, #10B981 0%, #0F9E73 100%)',
                color: '#080C0B',
                border: 'none',
                borderRadius: 6,
                padding: '10px 16px',
                fontSize: 13,
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                width: '100%',
                marginTop: 2,
                fontFamily: "'Sora', sans-serif",
                letterSpacing: '0.01em',
                transition: 'opacity 0.1s',
                opacity: loading ? 0.8 : 1,
              }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div style={{ borderTop: '1px solid #1E2926', marginTop: 20, paddingTop: 16, textAlign: 'center' }}>
            <a href="#" style={{ fontSize: 12, color: '#38BDF8', textDecoration: 'none' }}>First-time setup? Create your account →</a>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 11, color: '#2D4440', marginTop: 20 }}>
          FlagPulse v2.4.1 · Self-hosted · SSE real-time sync
        </p>
      </div>
    </div>
  )
}
