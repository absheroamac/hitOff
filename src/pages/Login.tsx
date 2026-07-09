import { useState } from 'react'
import { useAuth } from '../lib/AuthContext'

export function Login() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState<'in' | 'up'>('in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const result = mode === 'in' ? await signIn(email, password) : await signUp(email, password, displayName || 'Fighter')
    setBusy(false)
    if (result.error) setError(result.error)
  }

  return (
    <div className="flex-1 flex flex-col justify-center px-6 py-10">
      <div className="text-center mb-10">
        <div className="text-5xl mb-3">🥊</div>
        <h1 className="text-3xl font-bold">HitOff</h1>
        <p className="text-white/50 mt-1">MMA Foundations, together</p>
      </div>

      <form onSubmit={submit} className="flex flex-col gap-3">
        {mode === 'up' && (
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your name (e.g. Alex)"
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30"
          />
        )}
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
          required
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          required
          minLength={6}
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30"
        />
        {error && <div className="text-red-400 text-sm">{error}</div>}
        <button
          disabled={busy}
          className="bg-emerald-500 text-black font-semibold rounded-xl px-4 py-3 mt-2 disabled:opacity-50"
        >
          {mode === 'in' ? 'Sign in' : 'Create account'}
        </button>
      </form>

      <button
        onClick={() => setMode(mode === 'in' ? 'up' : 'in')}
        className="text-white/50 mt-6 text-sm"
      >
        {mode === 'in' ? "New here? Create an account" : 'Already have an account? Sign in'}
      </button>
    </div>
  )
}
