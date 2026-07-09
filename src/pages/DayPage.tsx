import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PROGRAM } from '../data/program'
import { useCompletions } from '../lib/useCompletions'
import { useAuth } from '../lib/AuthContext'
import { useProfiles } from '../lib/useProfiles'
import { RoundTimer } from '../components/RoundTimer'
import type { SessionTask, TimerConfig } from '../data/types'

type Mode = 'solo' | 'team'

function fmtConfig(cfg: TimerConfig) {
  const parts = [`${cfg.rounds} × ${cfg.workSec}s${cfg.turnBased ? ' each' : ''}`]
  if (cfg.restSec > 0) parts.push(`${cfg.restSec}s rest`)
  return parts.join(' · ')
}

export function DayPage() {
  const { weekNumber, dayId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const profiles = useProfiles()
  const { completions, isDone, toggle } = useCompletions()
  const [mode, setMode] = useState<Mode>('team')
  const [activeTimer, setActiveTimer] = useState<{ task: SessionTask; cfg: TimerConfig; mode: Mode } | null>(null)

  const week = PROGRAM.find((w) => w.weekNumber === Number(weekNumber))
  const day = week?.days.find((d) => d.id === dayId)

  if (!week || !day) return <div className="p-6 text-white/60">Session not found.</div>

  const doneCount = day.tasks.filter((t) => isDone(week.weekNumber, day.id, t.id, user?.id)).length
  const partners = profiles.filter((p) => p.id !== user?.id)
  const partnerIds = partners.map((p) => p.id)
  const myName = user?.user_metadata?.display_name ?? 'You'
  const partnerName = partners[0]?.display_name ?? 'Partner'

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-5 pt-6 pb-4">
        <button onClick={() => navigate(`/week/${week.weekNumber}`)} className="text-white/40 text-sm mb-3">
          ← Week {week.weekNumber}
        </button>
        <div className="text-xs text-emerald-400 uppercase tracking-widest font-semibold mb-1">
          Day {day.dayNumber}
        </div>
        <h1 className="text-2xl font-bold leading-tight">{day.title}</h1>
        <div className="text-white/40 text-sm mt-1">
          {doneCount} / {day.tasks.length} complete
        </div>
      </div>

      <div className="px-5 pb-3">
        <div className="pill-toggle rounded-full flex p-1">
          {(['solo', 'team'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 rounded-full py-2 text-sm font-semibold transition-all ${
                mode === m ? 'bg-emerald-500 text-black' : 'text-white/50'
              }`}
            >
              {m === 'solo' ? '🧍 Solo' : '🤝 Team'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-8">
        <div className="flex flex-col gap-3">
          {day.tasks.map((task) => {
            const mine = isDone(week.weekNumber, day.id, task.id, user?.id)
            const others = profiles.filter((p) => p.id !== user?.id && isDone(week.weekNumber, day.id, task.id, p.id))
            const cfg = task[mode] ?? task.solo ?? task.team
            const effectiveMode: Mode = !task[mode] && cfg ? (task.solo ? 'solo' : 'team') : mode

            return (
              <div key={task.id} className="surface rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggle(week.weekNumber, day.id, task.id, effectiveMode, partnerIds)}
                    className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      mine ? 'bg-emerald-500 border-emerald-500' : 'border-white/25'
                    }`}
                  >
                    {mine && <span className="text-black text-xs font-bold">✓</span>}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className={`font-semibold ${mine ? 'text-white/40 line-through' : 'text-white'}`}>
                      {task.label}
                    </div>
                    <p className="text-white/45 text-sm mt-1 leading-snug">{task.description}</p>

                    {effectiveMode === 'team' && (
                      <div className="text-[10px] text-white/30 uppercase tracking-wide mt-1">
                        Team — marks complete for both of you
                      </div>
                    )}

                    {others.length > 0 && (
                      <div className="text-xs text-emerald-400/80 mt-1.5">
                        ✓ {others.map((o) => o.display_name).join(', ')} done
                      </div>
                    )}

                    {cfg && (
                      <div className="flex items-center gap-2 mt-3">
                        <button
                          onClick={() => setActiveTimer({ task, cfg, mode: effectiveMode })}
                          className="text-xs font-semibold bg-white/10 hover:bg-white/15 rounded-full px-3 py-1.5 text-white/90 flex items-center gap-1.5"
                        >
                          ▶ Start · {fmtConfig(cfg)}
                        </button>
                        {effectiveMode !== mode && (
                          <span className="text-[10px] text-white/30 uppercase tracking-wide">
                            {effectiveMode} only
                          </span>
                        )}
                        {effectiveMode === 'team' && cfg.turnBased && (
                          <span className="text-[10px] text-sky-400/80 uppercase tracking-wide">
                            ⇄ equal turns
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {activeTimer && (
        <RoundTimer
          workSec={activeTimer.cfg.workSec}
          restSec={activeTimer.cfg.restSec}
          rounds={activeTimer.cfg.rounds}
          modeLabel={activeTimer.cfg.label}
          turnBased={activeTimer.mode === 'team' && activeTimer.cfg.turnBased}
          roles={activeTimer.cfg.roles}
          myName={myName}
          partnerName={partnerName}
          onClose={() => setActiveTimer(null)}
          onComplete={() => {
            if (!isDone(week.weekNumber, day.id, activeTimer.task.id, user?.id)) {
              toggle(week.weekNumber, day.id, activeTimer.task.id, activeTimer.mode, partnerIds)
            }
          }}
        />
      )}
      {completions.length === 0 && null}
    </div>
  )
}
