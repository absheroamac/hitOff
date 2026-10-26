import { useEffect, useRef, useState, useCallback } from 'react'
import {
  playTimerStartSound,
  playTimerEndSound,
  playRestSound,
  playSegmentSound,
  playCountdownTick,
  unlockAudio,
  isSoundEnabled,
  setSoundEnabled,
} from '../lib/sound'
import type { VisualGuide } from '../data/visualGuides'

interface RoundTimerProps {
  workSec: number
  restSec: number
  /** Rounds each partner gets when turnBased is true; total rounds otherwise. */
  rounds: number
  modeLabel?: string
  turnBased?: boolean
  roles?: [string, string]
  myName?: string
  partnerName?: string
  /** Named sub-phases that play in sequence within a single round's work time, auto-advancing (e.g. warm-up parts). */
  segments?: { label: string; sec: number }[]
  /** Cyclic exercise names for each round (e.g. circuit movements), shown alongside the round counter. */
  roundLabels?: string[]
  guide?: VisualGuide
  onClose: () => void
  onComplete?: () => void
  onSkip?: () => void
}

type Phase = 'work' | 'rest' | 'done'

function formatTime(sec: number) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function RoundTimer({
  workSec,
  restSec,
  rounds,
  modeLabel,
  turnBased = false,
  roles,
  myName = 'You',
  partnerName = 'Partner',
  segments,
  roundLabels,
  guide,
  onClose,
  onComplete,
  onSkip,
}: RoundTimerProps) {
  const totalRounds = turnBased ? rounds * 2 : rounds
  const [running, setRunning] = useState(false)
  const [round, setRound] = useState(1)
  const [phase, setPhase] = useState<Phase>('work')
  const [segmentIndex, setSegmentIndex] = useState(0)
  const [remaining, setRemaining] = useState(segments?.[0]?.sec ?? workSec)
  const [soundOn, setSoundOn] = useState(() => isSoundEnabled())
  const [showGuide, setShowGuide] = useState(false)
  const intervalRef = useRef<number | null>(null)

  // Unlock audio on initial mount / user touch
  useEffect(() => {
    unlockAudio()
  }, [])

  const toggleSound = () => {
    const next = !soundOn
    setSoundOn(next)
    setSoundEnabled(next)
    if (next) unlockAudio()
  }

  const advanceRound = useCallback(() => {
    if (round >= totalRounds) {
      playTimerEndSound()
      setPhase('done')
      setRunning(false)
      onComplete?.()
    } else {
      playTimerStartSound()
      setRound((r) => r + 1)
      setPhase('work')
      setSegmentIndex(0)
      setRemaining(segments?.[0]?.sec ?? workSec)
    }
  }, [round, totalRounds, segments, workSec, onComplete])

  const advancePhaseOrSegment = useCallback(() => {
    if (phase === 'work' && segments && segmentIndex < segments.length - 1) {
      playSegmentSound()
      setSegmentIndex((i) => i + 1)
      setRemaining(segments[segmentIndex + 1].sec)
      return
    }

    if (phase === 'work') {
      if (restSec > 0) {
        playRestSound()
        setPhase('rest')
        setRemaining(restSec)
      } else {
        advanceRound()
      }
    } else if (phase === 'rest') {
      advanceRound()
    }
  }, [phase, segments, segmentIndex, restSec, advanceRound])

  useEffect(() => {
    if (!running) return
    intervalRef.current = window.setInterval(() => {
      setRemaining((r) => r - 1)
    }, 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [running])

  useEffect(() => {
    if (remaining > 0) {
      if (remaining <= 3 && running) playCountdownTick()
      return
    }
    if (!running) return

    advancePhaseOrSegment()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining])

  const handleToggleRunning = () => {
    unlockAudio()
    if (!running) {
      playTimerStartSound()
    }
    setRunning((r) => !r)
  }

  const handleSkipSegmentOrRound = () => {
    unlockAudio()
    if (phase === 'rest') {
      advanceRound()
    } else {
      advancePhaseOrSegment()
    }
  }

  const handleManualDone = () => {
    unlockAudio()
    playTimerEndSound()
    setPhase('done')
    setRunning(false)
    onComplete?.()
    setTimeout(() => {
      onClose()
    }, 600)
  }

  const handleSkipWorkout = () => {
    if (onSkip) {
      onSkip()
    }
    onClose()
  }

  const currentSegment = segments?.[segmentIndex]
  const total = phase === 'work' ? (currentSegment?.sec ?? workSec) : restSec
  const progress = phase === 'done' ? 1 : 1 - remaining / (total || 1)
  const currentRoundLabel = roundLabels?.[(round - 1) % roundLabels.length]
  const segmentsRemainingSec =
    segments && phase === 'work'
      ? Math.max(remaining, 0) + segments.slice(segmentIndex + 1).reduce((sum, s) => sum + s.sec, 0)
      : 0

  // Round 1 = you, round 2 = partner, round 3 = you, ... so pad time comes out equal.
  const isMyTurn = round % 2 === 1
  const activeName = isMyTurn ? myName : partnerName
  const otherName = isMyTurn ? partnerName : myName
  const activeRole = roles ? (isMyTurn ? roles[0] : roles[1]) : null
  const otherRole = roles ? (isMyTurn ? roles[1] : roles[0]) : null
  const yourTurnNumber = Math.ceil(round / 2)

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 text-white px-6">
      {/* Top Header Actions */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            className="text-white/60 hover:text-white transition-colors p-2 rounded-full bg-white/5 flex items-center gap-1.5 text-xs font-medium"
            title={soundOn ? 'Sound is on — tap to mute' : 'Sound is muted — tap to unmute'}
          >
            <span className="text-base">{soundOn ? '🔊' : '🔇'}</span>
            <span className="hidden sm:inline">{soundOn ? 'Sound On' : 'Muted'}</span>
          </button>

          {guide && (
            <button
              onClick={() => setShowGuide((s) => !s)}
              className={`p-2 rounded-full transition-all text-xs font-medium flex items-center gap-1.5 ${
                showGuide ? 'bg-emerald-500 text-black font-semibold' : 'bg-white/5 text-white/70 hover:text-white'
              }`}
              title="Visual Form Guide"
            >
              <span>👁️</span>
              <span className="hidden sm:inline">Form Guide</span>
            </button>
          )}
        </div>

        <button
          onClick={onClose}
          className="text-white/60 hover:text-white text-2xl leading-none p-2"
          aria-label="Close timer"
        >
          ✕
        </button>
      </div>

      {segments ? (
        <div className="text-sm uppercase tracking-widest text-white/50 mb-1">
          Step {segmentIndex + 1} / {segments.length}
        </div>
      ) : turnBased ? (
        <div className="text-sm uppercase tracking-widest text-white/50 mb-1 text-center">
          {activeName}'s turn — round {yourTurnNumber} / {rounds}
        </div>
      ) : (
        <div className="text-sm uppercase tracking-widest text-white/50 mb-1">
          Round {round} / {totalRounds}
        </div>
      )}

      {currentRoundLabel && phase !== 'done' && (
        <div className="text-base font-semibold text-emerald-400 mb-1 text-center">{currentRoundLabel}</div>
      )}

      {turnBased && activeRole && phase !== 'done' && (
        <div className={`text-sm font-semibold mb-2 ${isMyTurn ? 'text-emerald-400' : 'text-sky-400'}`}>
          {activeName}: {activeRole}
        </div>
      )}

      <div
        className={`text-7xl font-bold tabular-nums mb-4 ${
          phase === 'work' ? 'text-emerald-400' : phase === 'rest' ? 'text-amber-400' : 'text-white'
        }`}
      >
        {phase === 'done' ? 'Done!' : formatTime(Math.max(remaining, 0))}
      </div>

      <div className="text-lg uppercase tracking-widest mb-1 text-white/70">
        {phase === 'work' ? 'Work' : phase === 'rest' ? 'Rest' : 'Great job!'}
      </div>

      {currentSegment && phase === 'work' && (
        <div className="text-2xl font-bold text-white mb-1 text-center px-4">{currentSegment.label}</div>
      )}
      {currentSegment && phase === 'work' && (
        <div className="text-white/40 text-xs mb-1 text-center px-4">{formatTime(segmentsRemainingSec)} left overall</div>
      )}
      {segments && phase === 'work' && segmentIndex < segments.length - 1 && (
        <div className="text-white/40 text-sm mb-3 text-center px-4">Up next: {segments[segmentIndex + 1].label}</div>
      )}
      {!(currentSegment && phase === 'work') && <div className="mb-3" />}

      {segments && phase !== 'done' && (
        <div className="flex gap-1.5 mb-3">
          {segments.map((s, i) => (
            <div
              key={s.label}
              className={`h-1.5 w-6 rounded-full ${
                i < segmentIndex ? 'bg-emerald-400' : i === segmentIndex ? 'bg-emerald-400/60' : 'bg-white/15'
              }`}
            />
          ))}
        </div>
      )}

      {phase === 'rest' && turnBased && round < totalRounds && (
        <div className="text-amber-300 font-semibold mb-5 text-center animate-pulse">
          🔄 Swap — {otherName}'s turn{otherRole ? `: ${otherRole}` : ''}
        </div>
      )}

      {modeLabel && phase !== 'done' && (
        <div className="text-white/35 text-xs text-center max-w-xs mb-6">{modeLabel}</div>
      )}

      {/* Progress Bar */}
      <div className="w-full max-w-xs h-2 bg-white/10 rounded-full overflow-hidden mb-8">
        <div
          className={`h-full transition-all duration-1000 ease-linear ${phase === 'work' ? 'bg-emerald-400' : 'bg-amber-400'}`}
          style={{ width: `${Math.min(progress, 1) * 100}%` }}
        />
      </div>

      {/* Main Controls */}
      {phase !== 'done' ? (
        <div className="flex flex-col items-center gap-4 w-full max-w-xs">
          <div className="flex items-center justify-center gap-3 w-full">
            <button
              onClick={handleToggleRunning}
              className="flex-1 py-3.5 px-6 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-black font-bold text-lg shadow-lg shadow-emerald-500/25 transition-all"
            >
              {running ? '⏸ Pause' : remaining === total ? '▶ Start' : '▶ Resume'}
            </button>

            <button
              onClick={handleSkipSegmentOrRound}
              className="py-3.5 px-4 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white/90 font-semibold text-sm transition-all"
              title={phase === 'rest' ? 'Skip rest period' : 'Skip to next round'}
            >
              {phase === 'rest' ? '⏭ Skip Rest' : '⏭ Skip'}
            </button>

            <button
              onClick={() => {
                setRunning(false)
                setRound(1)
                setPhase('work')
                setSegmentIndex(0)
                setRemaining(segments?.[0]?.sec ?? workSec)
              }}
              className="py-3.5 px-4 rounded-full border border-white/20 hover:bg-white/5 active:scale-95 text-white/70 text-sm transition-all"
              title="Reset timer"
            >
              ↺
            </button>
          </div>

          {/* Quick Complete / Skip Workout Options */}
          <div className="flex items-center justify-between w-full pt-2 border-t border-white/10">
            <button
              onClick={handleManualDone}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 py-2 px-3 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 transition-all flex items-center gap-1.5"
            >
              ✓ Mark as Done
            </button>

            {onSkip && (
              <button
                onClick={handleSkipWorkout}
                className="text-xs text-white/40 hover:text-white/80 py-2 px-3 rounded-full hover:bg-white/5 transition-all flex items-center gap-1"
              >
                ↷ Skip Workout
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="text-emerald-400 text-sm font-semibold mb-2">🎉 Workout completed!</div>
          <button
            onClick={onClose}
            className="px-8 py-3 rounded-full bg-emerald-500 text-black font-bold text-base hover:bg-emerald-400 active:scale-95 transition-all"
          >
            Done
          </button>
        </div>
      )}

      {showGuide && guide && (
        <div
          className="fixed inset-0 z-60 bg-black/90 p-5 flex flex-col items-center justify-center animate-fadeIn"
          onClick={() => setShowGuide(false)}
        >
          <div
            className="w-full max-w-md bg-[#0e0e18] border border-white/20 rounded-2xl p-4 shadow-2xl overflow-y-auto max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-base">👁️</span>
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">{guide.title}</h3>
              </div>
              <button
                onClick={() => setShowGuide(false)}
                className="text-white/60 hover:text-white text-lg p-1"
                aria-label="Close form guide"
              >
                ✕
              </button>
            </div>

            <img
              src={guide.imageUrl}
              alt={guide.title}
              className="w-full aspect-video object-cover rounded-xl border border-emerald-500/30 mb-3"
            />

            <div className="text-xs text-emerald-400 font-semibold mb-2">
              💡 Key Focus: <span className="text-white/80 font-normal">{guide.keyFocus}</span>
            </div>

            <div className="space-y-1.5 border-t border-white/10 pt-2.5 mb-3.5">
              {guide.cues.map((c, i) => (
                <div key={i} className="text-xs text-white/70 flex items-start gap-2">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span>{c}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowGuide(false)}
              className="w-full py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-all"
            >
              Back to Timer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
