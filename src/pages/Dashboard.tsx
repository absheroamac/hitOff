import { Link } from 'react-router-dom'
import { PROGRAM } from '../data/program'
import { useCompletions } from '../lib/useCompletions'
import { useAuth } from '../lib/AuthContext'
import { xpFor, levelFor, levelProgress, streakDays } from '../lib/gamify'
import { weekProgress } from '../lib/progress'
import { BADGES } from '../data/badges'

export function Dashboard() {
  const { user } = useAuth()
  const { completions, loading } = useCompletions()

  if (!user) return null

  const xp = xpFor(completions, user.id)
  const level = levelFor(xp)
  const progress = levelProgress(xp)
  const streak = streakDays(completions, user.id)

  const currentWeek = PROGRAM.find((w) => weekProgress(w.weekNumber, completions, user.id) < 1) ?? PROGRAM[PROGRAM.length - 1]
  const earnedBadges = BADGES.filter((b) => b.check(completions, user.id))

  return (
    <div className="flex-1 px-5 pt-7 pb-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-7">
        <div>
          <div className="text-white/40 text-sm">Welcome back</div>
          <h1 className="text-2xl font-bold tracking-tight">{user.user_metadata?.display_name ?? 'Fighter'}</h1>
        </div>
        <Link
          to="/profile"
          className="w-11 h-11 rounded-full surface flex items-center justify-center text-xl shrink-0"
        >
          🥋
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="surface rounded-2xl p-4">
          <div className="text-white/40 text-xs uppercase tracking-wide font-semibold mb-1">Level</div>
          <div className="text-3xl font-bold text-emerald-400">{level}</div>
          <div className="h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${progress * 100}%` }} />
          </div>
        </div>
        <div className="surface rounded-2xl p-4">
          <div className="text-white/40 text-xs uppercase tracking-wide font-semibold mb-1">Streak</div>
          <div className="text-3xl font-bold text-amber-400 flex items-baseline gap-1">
            {streak} <span className="text-base">🔥</span>
          </div>
          <div className="text-white/30 text-xs mt-2">{streak === 1 ? 'day' : 'days'} in a row</div>
        </div>
      </div>

      <Link to="/stats" className="flex items-center justify-between surface rounded-2xl px-4 py-3 mb-5">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎖️</span>
          <span className="text-sm font-medium">
            {earnedBadges.length} / {BADGES.length} badges
          </span>
        </div>
        <div className="flex -space-x-1.5">
          {earnedBadges.slice(-4).map((b) => (
            <span key={b.id} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-sm border-2 border-[#0a0a10]">
              {b.emoji}
            </span>
          ))}
          {earnedBadges.length === 0 && <span className="text-white/30 text-xs">None yet →</span>}
        </div>
      </Link>

      <Link
        to={`/week/${currentWeek.weekNumber}`}
        className="block rounded-2xl px-5 py-4 mb-8 font-semibold text-black shadow-lg shadow-emerald-500/20"
        style={{ background: 'linear-gradient(135deg, #34d399, #10b981)' }}
      >
        <div className="text-xs uppercase tracking-wide font-bold text-black/50 mb-0.5">Continue</div>
        Week {currentWeek.weekNumber} — {currentWeek.phaseTitle.split('—')[1]?.trim() ?? currentWeek.phaseTitle}
        <div className="text-black/60 text-sm font-normal mt-0.5">Tap to jump into today's session →</div>
      </Link>

      <h2 className="text-white/40 text-xs uppercase tracking-widest font-semibold mb-3">All Weeks</h2>
      <div className="flex flex-col gap-2 pb-2">
        {PROGRAM.map((w) => {
          const pct = loading ? 0 : weekProgress(w.weekNumber, completions, user.id) * 100
          const complete = pct >= 100
          return (
            <Link
              key={w.weekNumber}
              to={`/week/${w.weekNumber}`}
              className="flex items-center gap-3 surface rounded-xl px-4 py-3"
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                  complete ? 'bg-emerald-500 text-black' : 'bg-white/10 text-white'
                }`}
              >
                {complete ? '✓' : w.weekNumber}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{w.phaseTitle}</div>
                <div className="h-1.5 bg-white/10 rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
              <div className="text-white/30 text-xs w-9 text-right tabular-nums">{Math.round(pct)}%</div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
