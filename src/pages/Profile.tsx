import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { useCompletions } from '../lib/useCompletions'
import { xpFor, levelFor, streakDays } from '../lib/gamify'

export function Profile() {
  const { user, signOut } = useAuth()
  const { completions } = useCompletions()
  const navigate = useNavigate()

  if (!user) return null
  const xp = xpFor(completions, user.id)

  return (
    <div className="flex-1 px-5 pt-7 pb-8 overflow-y-auto">
      <button onClick={() => navigate('/')} className="text-white/40 text-sm mb-4">← Dashboard</button>
      <div className="flex flex-col items-center mb-7">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center text-4xl mb-3">🥋</div>
        <h1 className="text-xl font-bold">{user.user_metadata?.display_name ?? 'Fighter'}</h1>
        <div className="text-white/40 text-sm">{user.email}</div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="surface rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-emerald-400">{levelFor(xp)}</div>
          <div className="text-white/40 text-xs">Level</div>
        </div>
        <div className="surface rounded-xl p-3 text-center">
          <div className="text-xl font-bold">{xp}</div>
          <div className="text-white/40 text-xs">XP</div>
        </div>
        <div className="surface rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-amber-400">{streakDays(completions, user.id)}</div>
          <div className="text-white/40 text-xs">Streak</div>
        </div>
      </div>

      <button
        onClick={() => navigate('/stats')}
        className="w-full surface rounded-xl px-4 py-3 mb-3 flex items-center justify-between"
      >
        <span className="flex items-center gap-2 text-sm font-medium">📊 Statistics</span>
        <span className="text-white/30">›</span>
      </button>

      <button
        onClick={() => signOut()}
        className="w-full border border-white/20 text-white/70 rounded-xl px-4 py-3"
      >
        Sign out
      </button>
    </div>
  )
}
