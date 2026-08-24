
import { useState } from 'react'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import { login } from '@/services/auth.service'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { initialiseUser } from '@/features/userSlice'
import logoDark from "../assets/logo-dark.png"

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await login({ email, password })

      dispatch(
        initialiseUser({
          name: response.name,
          email: response.email,
        })
      )

      navigate('/')
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message ?? 'Login failed')
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-(--color-bg) flex items-center justify-center relative overflow-hidden">

      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-[radial-gradient(circle,rgba(255,255,255,0.025)_0%,transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-100 px-5 relative z-10">

        {/* Keep this area blank for your logo */}
        <div>
          <img src={logoDark} alt="Flagpulse logo" className='h-15 m-auto w-[70%] mb-4'/>
        </div>

        {/* Card */}
        <div className="bg-(--color-surface) border border-(--color-border) rounded-lg px-7 pt-7 pb-6 shadow-[0_0_40px_rgba(0,0,0,0.5)]">

          <h2 className="text-[17px] text-(--color-text) mb-5 tracking-[-0.01em] font-bold ">
            Sign in to your account
          </h2>

          {/* Error banner */}
          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-sm px-3 py-2 mb-4">
              <AlertCircle
                size={13}
                className="text-red-400 shrink-0"
              />

              <span className="text-xs text-red-400">
                {error}
              </span>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3.5"
          >

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-(--color-text-label) mb-1.5">
                Email address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="arjun@acmecorp.dev"
                required
                className="
                  w-full
                  bg-(--color-surface-raised)
                  border border-(--color-border)
                  text-(--color-text)
                  rounded-sm
                  px-3 py-2.25
                  text-[13px]
                  outline-none
                  font-sans
                  transition-colors
                  placeholder:text-(--color-text-subtle)
                  focus:border-(--color-border-active)
                "
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-(--color-text-label) mb-1.5">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="
                    w-full
                    bg-(--color-surface-raised)
                    border border-(--color-border)
                    text-(--color-text)
                    rounded-sm
                    px-3 pr-9 py-2.25
                    text-[13px]
                    outline-none
                    font-sans
                    transition-colors
                    placeholder:text-(--color-text-subtle)
                    focus:border-(--color-border-active)
                  "
                />

                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="
                    absolute
                    right-2.5
                    top-1/2
                    -translate-y-1/2
                    bg-transparent
                    border-none
                    cursor-pointer
                    text-(--color-text-subtle)
                    hover:text-(--color-text-muted)
                    flex
                    items-center
                  "
                >
                  {showPw ? (
                    <EyeOff size={14} />
                  ) : (
                    <Eye size={14} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="
                bg-(--color-primary)
                hover:bg-(--color-primary-hover)
                disabled:opacity-80
                disabled:cursor-not-allowed
                text-(--color-primary-text)
                border-none
                rounded-sm
                px-4 py-2.5
                text-[13px]
                cursor-pointer
                w-full
                mt-0.5
                tracking-[0.01em]
                transition-colors
                font-extrabold
              "
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>

          </form>

          {/* Setup link */}
          <div className="border-t border-(--color-border) mt-5 pt-4 text-center">
            <Link
              to="/register"
              className="
                text-xs
                text-(--color-text-link)
                hover:text-(--color-text)
                no-underline
                transition-colors
              "
            >
              First-time setup? Create your account →
            </Link>
          </div>
        </div>

        <p className="text-center text-[11px] text-(--color-text-faint) mt-5">
          Flagpulse v1.0.0 · Self-hosted · SSE real-time sync
        </p>

      </div>
    </div>
  )
}
