// Web Audio API synthesized boxing gym sounds & timer cues
// Synthesized tones ensure zero external assets, instant playback, and offline support.

let audioCtx: AudioContext | null = null

const SOUND_STORAGE_KEY = 'hitoff_sound_enabled'

export function isSoundEnabled(): boolean {
  if (typeof window === 'undefined') return true
  const stored = localStorage.getItem(SOUND_STORAGE_KEY)
  return stored === null ? true : stored === 'true'
}

export function setSoundEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(SOUND_STORAGE_KEY, enabled ? 'true' : 'false')
}

export function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AudioContextClass) return null
    if (!audioCtx) {
      audioCtx = new AudioContextClass()
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {})
    }
    return audioCtx
  } catch {
    return null
  }
}

/** Call on user gestures (e.g. clicking Start) to unlock audio in iOS Safari & Chrome */
export function unlockAudio() {
  const ctx = getAudioContext()
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().catch(() => {})
  }
}

/**
 * Realistic boxing round bell strike.
 * Combines fundamental frequency (~784Hz / G5) and prominent metallic inharmonics with exponential ring-out.
 */
function strikeBell(ctx: AudioContext, time: number, volume = 0.5, duration = 1.4) {
  const partials = [
    { freq: 784, gain: 0.5 },
    { freq: 1175, gain: 0.3 },
    { freq: 1568, gain: 0.2 },
    { freq: 2349, gain: 0.12 },
    { freq: 3136, gain: 0.06 },
  ]

  partials.forEach(({ freq, gain }) => {
    const osc = ctx.createOscillator()
    const gainNode = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, time)

    gainNode.gain.setValueAtTime(gain * volume, time)
    gainNode.gain.exponentialRampToValueAtTime(0.0001, time + duration)

    osc.connect(gainNode)
    gainNode.connect(ctx.destination)

    osc.start(time)
    osc.stop(time + duration)
  })
}

/**
 * Played when timer starts or resumes — classic boxing bell sound!
 */
export function playTimerStartSound() {
  if (!isSoundEnabled()) return
  const ctx = getAudioContext()
  if (!ctx) return
  const now = ctx.currentTime
  strikeBell(ctx, now, 0.6, 1.3)
}

/**
 * Played on countdown warning (3, 2, 1 seconds left before round or rest ends).
 */
export function playCountdownTick() {
  if (!isSoundEnabled()) return
  const ctx = getAudioContext()
  if (!ctx) return
  const now = ctx.currentTime
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = 'sine'
  osc.frequency.setValueAtTime(800, now)

  gain.gain.setValueAtTime(0.25, now)
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1)

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.start(now)
  osc.stop(now + 0.1)
}

/**
 * Played when work phase ends and rest begins (lower two-tone chime).
 */
export function playRestSound() {
  if (!isSoundEnabled()) return
  const ctx = getAudioContext()
  if (!ctx) return
  const now = ctx.currentTime

  // Tone 1
  const osc1 = ctx.createOscillator()
  const gain1 = ctx.createGain()
  osc1.type = 'sine'
  osc1.frequency.setValueAtTime(587.33, now) // D5
  gain1.gain.setValueAtTime(0.35, now)
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3)
  osc1.connect(gain1)
  gain1.connect(ctx.destination)
  osc1.start(now)
  osc1.stop(now + 0.3)

  // Tone 2
  const osc2 = ctx.createOscillator()
  const gain2 = ctx.createGain()
  osc2.type = 'sine'
  osc2.frequency.setValueAtTime(440, now + 0.15) // A4
  gain2.gain.setValueAtTime(0.35, now + 0.15)
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6)
  osc2.connect(gain2)
  gain2.connect(ctx.destination)
  osc2.start(now + 0.15)
  osc2.stop(now + 0.6)
}

/**
 * Played when a sub-segment advances.
 */
export function playSegmentSound() {
  if (!isSoundEnabled()) return
  const ctx = getAudioContext()
  if (!ctx) return
  const now = ctx.currentTime

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(659.25, now) // E5
  gain.gain.setValueAtTime(0.3, now)
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)

  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(now)
  osc.stop(now + 0.25)
}

/**
 * Played when the timer ends / workout is completed:
 * Classic boxing triple bell (Ding! Ding! Ding!)
 */
export function playTimerEndSound() {
  if (!isSoundEnabled()) return
  const ctx = getAudioContext()
  if (!ctx) return
  const now = ctx.currentTime

  strikeBell(ctx, now, 0.5, 0.45)
  strikeBell(ctx, now + 0.28, 0.55, 0.45)
  strikeBell(ctx, now + 0.56, 0.7, 1.8)
}
