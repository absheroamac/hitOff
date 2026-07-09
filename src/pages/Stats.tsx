import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { useCompletions } from '../lib/useCompletions'
import { useProfiles } from '../lib/useProfiles'
import { xpFor, levelFor, streakDays, modeCounts } from '../lib/gamify'
import { BADGES } from '../data/badges'

export function Stats() {
  const { user } = useAuth()
  const { completions } = useCompletions()
  const profiles = useProfiles()
  const navigate = useNavigate()

  const myName = user?.user_metadata?.display_name ?? 'You'
  const partners = profiles.filter((p) => p.id !== user?.id)
  const people = user ? [{ id: user.id, display_name: myName }, ...partners] : []
  const [selectedId, setSelectedId] = useState<string | null>(null)

  if (!user) return null
  const mine = modeCounts(completions, user.id)
  const activeId = selectedId ?? user.id
  const activePerson = people.find((p) => p.id === activeId) ?? people[0]

  return (
    <div className="flex-1 px-5 pt-7 pb-8 overflow-y-auto">
      <button onClick={() => navigate('/')} className="text-white/40 text-sm mb-4">← Dashboard</button>
      <h1 className="text-2xl font-bold mb-6">Statistics</h1>

      <h2 className="text-white/40 text-xs uppercase tracking-widest font-semibold mb-3">Your training breakdown</h2>
      <div className="surface rounded-2xl p-4 mb-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="flex items-center gap-1.5 text-white/70">🧍 Solo</span>
          <span className="font-semibold tabular-nums">{mine.solo}</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-sky-400 rounded-full"
            style={{ width: mine.total ? `${(mine.solo / mine.total) * 100}%` : '0%' }}
          />
        </div>
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="flex items-center gap-1.5 text-white/70">🤝 Team</span>
          <span className="font-semibold tabular-nums">{mine.team}</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-400 rounded-full"
            style={{ width: mine.total ? `${(mine.team / mine.total) * 100}%` : '0%' }}
          />
        </div>
        <div className="text-white/30 text-xs mt-3">{mine.total} tasks completed total</div>
      </div>

      <h2 className="text-white/40 text-xs uppercase tracking-widest font-semibold mb-3">Head to head</h2>
      <div className="flex flex-col gap-2 mb-7">
        {people.map((p) => {
          const isMe = p.id === user.id
          const pxp = xpFor(completions, p.id)
          const pCounts = modeCounts(completions, p.id)
          return (
            <div key={p.id} className="surface rounded-xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg shrink-0">
                {isMe ? '🥋' : '🥊'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  {p.display_name}
                  {isMe && <span className="text-white/30"> (you)</span>}
                </div>
                <div className="text-white/40 text-xs">
                  Level {levelFor(pxp)} · {pCounts.solo} solo · {pCounts.team} team
                </div>
              </div>
              <div className="text-amber-400 text-sm font-semibold tabular-nums">
                {streakDays(completions, p.id)}🔥
              </div>
            </div>
          )
        })}
      </div>

      {partners.length === 0 && (
        <p className="text-white/30 text-sm -mt-5 mb-7">
          Once your partner signs up, you'll see their progress here too.
        </p>
      )}

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-white/40 text-xs uppercase tracking-widest font-semibold">Badges</h2>
        {people.length > 1 && (
          <div className="pill-toggle rounded-full flex p-0.5">
            {people.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedId(p.id)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                  activeId === p.id ? 'bg-emerald-500 text-black' : 'text-white/50'
                }`}
              >
                {p.id === user.id ? 'You' : p.display_name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {BADGES.map((b) => {
          const earned = activePerson ? b.check(completions, activePerson.id) : false
          return (
            <div
              key={b.id}
              className={`surface rounded-2xl p-3 flex flex-col items-center text-center gap-1 ${
                earned ? '' : 'opacity-35 grayscale'
              }`}
            >
              <div className="text-2xl">{b.emoji}</div>
              <div className="text-xs font-semibold leading-tight">{b.title}</div>
              <div className="text-white/40 text-[10px] leading-snug">{b.description}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
