import { useEffect, useRef, useState } from 'react'

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
  onClose: () => void
  onComplete?: () => void
}

type Phase = 'work' | 'rest' | 'done'

function beep(freq: number, durationMs: number) {
  const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
  const ctx = new AudioCtx()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.frequency.value = freq
  osc.connect(gain)
  gain.connect(ctx.destination)
  gain.gain.setValueAtTime(0.2, ctx.currentTime)
  osc.start()
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000)
  osc.stop(ctx.currentTime + durationMs / 1000)
  osc.onended = () => ctx.close()
}

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
  onClose,
  onComplete,
}: RoundTimerProps) {
  const totalRounds = turnBased ? rounds * 2 : rounds
  const [running, setRunning] = useState(false)
  const [round, setRound] = useState(1)
  const [phase, setPhase] = useState<Phase>('work')
  const [remaining, setRemaining] = useState(workSec)
  const intervalRef = useRef<number | null>(null)

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
      if (remaining <= 3 && running) beep(660, 120)
      return
    }
    if (!running) return

    if (phase === 'work') {
      if (restSec > 0) {
        beep(440, 400)
        setPhase('rest')
        setRemaining(restSec)
      } else {
        advanceRound()
      }
    } else if (phase === 'rest') {
      advanceRound()
    }

    function advanceRound() {
      if (round >= totalRounds) {
        beep(880, 600)
        setPhase('done')
        setRunning(false)
        onComplete?.()
      } else {
        beep(880, 300)
        setRound((r) => r + 1)
        setPhase('work')
        setRemaining(workSec)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining])

  const total = phase === 'work' ? workSec : restSec
  const progress = phase === 'done' ? 1 : 1 - remaining / (total || 1)

  // Round 1 = you, round 2 = partner, round 3 = you, ... so pad time comes out equal.
  const isMyTurn = round % 2 === 1
  const activeName = isMyTurn ? myName : partnerName
  const otherName = isMyTurn ? partnerName : myName
  const activeRole = roles ? (isMyTurn ? roles[0] : roles[1]) : null
  const otherRole = roles ? (isMyTurn ? roles[1] : roles[0]) : null
  const yourTurnNumber = Math.ceil(round / 2)

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 text-white px-6">
      <button onClick={onClose} className="absolute top-6 right-6 text-white/60 text-2xl leading-none">
        ✕
      </button>

      {turnBased ? (
        <div className="text-sm uppercase tracking-widest text-white/50 mb-1 text-center">
          {activeName}'s turn — round {yourTurnNumber} / {rounds}
        </div>
      ) : (
        <div className="text-sm uppercase tracking-widest text-white/50 mb-1">
          Round {round} / {totalRounds}
        </div>
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

      <div className="text-lg uppercase tracking-widest mb-3 text-white/70">
        {phase === 'work' ? 'Work' : phase === 'rest' ? 'Rest' : 'Great job'}
      </div>

      {phase === 'rest' && turnBased && round < totalRounds && (
        <div className="text-amber-300 font-semibold mb-5 text-center animate-pulse">
          🔄 Swap — {otherName}'s turn{otherRole ? `: ${otherRole}` : ''}
        </div>
      )}

      {modeLabel && phase !== 'done' && (
        <div className="text-white/35 text-xs text-center max-w-xs mb-6">{modeLabel}</div>
      )}

      <div className="w-full max-w-xs h-2 bg-white/10 rounded-full overflow-hidden mb-10">
        <div
          className={`h-full transition-all duration-1000 ease-linear ${phase === 'work' ? 'bg-emerald-400' : 'bg-amber-400'}`}
          style={{ width: `${Math.min(progress, 1) * 100}%` }}
        />
      </div>

      <div className="flex gap-4">
        {phase !== 'done' && (
          <button
            onClick={() => setRunning((r) => !r)}
            className="px-8 py-3 rounded-full bg-white text-black font-semibold text-lg"
          >
            {running ? 'Pause' : remaining === total ? 'Start' : 'Resume'}
          </button>
        )}
        <button
          onClick={() => {
            setRunning(false)
            setRound(1)
            setPhase('work')
            setRemaining(workSec)
          }}
          className="px-6 py-3 rounded-full border border-white/30 text-white/80"
        >
          Reset
        </button>
      </div>
    </div>
  )
}
