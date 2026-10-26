import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PROGRAM } from '../data/program'
import { useCompletions } from '../lib/useCompletions'
import { useAuth } from '../lib/AuthContext'
import { useProfiles } from '../lib/useProfiles'
import { useSkipped } from '../lib/useSkipped'
import { RoundTimer } from '../components/RoundTimer'
import { unlockAudio } from '../lib/sound'
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
  const { completions, isDone, toggle, markDone, markAllDone, unmarkAllDone } = useCompletions()
  const { isSkipped, skip, unskip, toggleSkip, skipRemaining, unskipAll } = useSkipped()
  const [mode, setMode] = useState<Mode>('team')
  const [activeTimer, setActiveTimer] = useState<{ task: SessionTask; cfg: TimerConfig; mode: Mode } | null>(null)

  const week = PROGRAM.find((w) => w.weekNumber === Number(weekNumber))
  const day = week?.days.find((d) => d.id === dayId)

  if (!week || !day) return <div className="p-6 text-white/60">Session not found.</div>

  const doneCount = day.tasks.filter((t) => isDone(week.weekNumber, day.id, t.id, user?.id)).length
  const skippedCount = day.tasks.filter(
    (t) => !isDone(week.weekNumber, day.id, t.id, user?.id) && isSkipped(week.weekNumber, day.id, t.id),
  ).length
  const remainingTasks = day.tasks.filter((t) => !isDone(week.weekNumber, day.id, t.id, user?.id))

  const partners = profiles.filter((p) => p.id !== user?.id)
  const partnerIds = partners.map((p) => p.id)
  const myName = user?.user_metadata?.display_name ?? 'You'
  const partnerName = partners[0]?.display_name ?? 'Partner'

  const handleStartTimer = (task: SessionTask, cfg: TimerConfig, taskMode: Mode) => {
    unlockAudio()
    setActiveTimer({ task, cfg, mode: taskMode })
  }

  const handleMarkAllDone = () => {
    if (remainingTasks.length === 0) return
    const ids = remainingTasks.map((t) => t.id)
    unskipAll(week.weekNumber, day.id)
    markAllDone(week.weekNumber, day.id, ids, mode, partnerIds)
  }

  const handleSkipRemaining = () => {
    const uncompletedIds = remainingTasks.filter((t) => !isSkipped(week.weekNumber, day.id, t.id)).map((t) => t.id)
    skipRemaining(week.weekNumber, day.id, uncompletedIds)
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-5 pt-6 pb-3">
        <button onClick={() => navigate(`/week/${week.weekNumber}`)} className="text-white/40 text-sm mb-3 hover:text-white transition-colors">
          ← Week {week.weekNumber}
        </button>
        <div className="text-xs text-emerald-400 uppercase tracking-widest font-semibold mb-1">
          Day {day.dayNumber}
        </div>
        <h1 className="text-2xl font-bold leading-tight">{day.title}</h1>
        <div className="flex items-center justify-between mt-1 text-sm">
          <div className="text-white/45">
            <span className="font-semibold text-white/80">{doneCount}</span> / {day.tasks.length} complete
            {skippedCount > 0 && (
              <span className="text-amber-400/80 ml-2">· {skippedCount} skipped</span>
            )}
          </div>

          {/* Quick Bulk Actions */}
          <div className="flex items-center gap-2">
            {doneCount < day.tasks.length ? (
              <>
                <button
                  onClick={handleMarkAllDone}
                  className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 active:scale-95 px-2.5 py-1 rounded-full transition-all"
                  title="Mark all exercises in this session as done"
                >
                  ✓ All done
                </button>
                {remainingTasks.some((t) => !isSkipped(week.weekNumber, day.id, t.id)) && (
                  <button
                    onClick={handleSkipRemaining}
                    className="text-xs text-white/40 hover:text-white/70 active:scale-95 px-2 py-1 rounded-full hover:bg-white/5 transition-all"
                    title="Skip remaining incomplete exercises"
                  >
                    ↷ Skip rest
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={() => unmarkAllDone(week.weekNumber, day.id, day.tasks.map((t) => t.id), mode, partnerIds)}
                className="text-xs text-white/40 hover:text-white/70 px-2 py-1 rounded-full hover:bg-white/5 transition-all"
              >
                ↺ Reset all
              </button>
            )}
          </div>
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
            const skipped = !mine && isSkipped(week.weekNumber, day.id, task.id)
            const others = profiles.filter((p) => p.id !== user?.id && isDone(week.weekNumber, day.id, task.id, p.id))
            const cfg = task[mode] ?? task.solo ?? task.team
            const effectiveMode: Mode = !task[mode] && cfg ? (task.solo ? 'solo' : 'team') : mode

            const handleToggleCompletion = () => {
              if (skipped) {
                unskip(week.weekNumber, day.id, task.id)
              }
              toggle(week.weekNumber, day.id, task.id, effectiveMode, partnerIds)
            }

            const handleMarkManualDone = () => {
              if (skipped) {
                unskip(week.weekNumber, day.id, task.id)
              }
              markDone(week.weekNumber, day.id, task.id, effectiveMode, partnerIds)
            }

            return (
              <div
                key={task.id}
                className={`surface rounded-2xl p-4 transition-all ${
                  mine
                    ? 'border-l-4 border-emerald-500/80 bg-emerald-950/10'
                    : skipped
                    ? 'border-l-4 border-amber-500/40 opacity-75'
                    : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={handleToggleCompletion}
                    className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      mine
                        ? 'bg-emerald-500 border-emerald-500 text-black'
                        : skipped
                        ? 'border-amber-400/50 bg-amber-500/10 text-amber-300'
                        : 'border-white/25 hover:border-white/50'
                    }`}
                    title={mine ? 'Completed — click to uncheck' : skipped ? 'Skipped — click to mark done' : 'Mark done'}
                  >
                    {mine ? <span className="text-black text-xs font-bold">✓</span> : skipped ? <span className="text-xs">↷</span> : null}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-semibold ${mine ? 'text-white/40 line-through' : skipped ? 'text-white/60' : 'text-white'}`}>
                        {task.label}
                      </span>
                      {skipped && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Skipped
                        </span>
                      )}
                    </div>

                    <p className={`text-sm mt-1 leading-snug ${mine ? 'text-white/30' : 'text-white/45'}`}>
                      {task.description}
                    </p>

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

                    {/* Actions Row */}
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      {!mine ? (
                        <>
                          {cfg && (
                            <button
                              onClick={() => handleStartTimer(task, cfg, effectiveMode)}
                              className="text-xs font-semibold bg-emerald-500 text-black hover:bg-emerald-400 active:scale-95 rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-sm transition-all"
                            >
                              ▶ Start · {fmtConfig(cfg)}
                            </button>
                          )}

                          <button
                            onClick={handleMarkManualDone}
                            className="text-xs font-semibold bg-white/10 hover:bg-white/20 active:scale-95 rounded-full px-3 py-1.5 text-white/90 flex items-center gap-1 transition-all"
                            title="Manually mark this workout done without timer"
                          >
                            ✓ Done
                          </button>

                          <button
                            onClick={() => toggleSkip(week.weekNumber, day.id, task.id)}
                            className={`text-xs rounded-full px-2.5 py-1.5 transition-all ${
                              skipped
                                ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 font-medium'
                                : 'text-white/40 hover:text-white/80 hover:bg-white/5'
                            }`}
                            title={skipped ? 'Unskip workout' : 'Skip this workout'}
                          >
                            {skipped ? '↺ Unskip' : '↷ Skip'}
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                            ✓ Done
                          </span>
                          <button
                            onClick={handleToggleCompletion}
                            className="text-[11px] text-white/35 hover:text-white/70 px-2 py-1 rounded hover:bg-white/5 transition-all"
                          >
                            Undo
                          </button>
                        </div>
                      )}

                      {effectiveMode !== mode && !mine && (
                        <span className="text-[10px] text-white/30 uppercase tracking-wide">
                          {effectiveMode} only
                        </span>
                      )}
                      {effectiveMode === 'team' && cfg?.turnBased && !mine && (
                        <span className="text-[10px] text-sky-400/80 uppercase tracking-wide">
                          ⇄ equal turns
                        </span>
                      )}
                    </div>
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
          segments={activeTimer.cfg.segments}
          roundLabels={activeTimer.cfg.roundLabels}
          myName={myName}
          partnerName={partnerName}
          onClose={() => setActiveTimer(null)}
          onComplete={() => {
            unskip(week.weekNumber, day.id, activeTimer.task.id)
            if (!isDone(week.weekNumber, day.id, activeTimer.task.id, user?.id)) {
              markDone(week.weekNumber, day.id, activeTimer.task.id, activeTimer.mode, partnerIds)
            }
          }}
          onSkip={() => {
            skip(week.weekNumber, day.id, activeTimer.task.id)
          }}
        />
      )}
      {completions.length === 0 && null}
    </div>
  )
}
