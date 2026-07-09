import type { Completion } from './useCompletions'

export function xpFor(completions: Completion[], userId: string) {
  return completions.filter((c) => c.user_id === userId).length * 10
}

export function levelFor(xp: number) {
  return Math.floor(xp / 100) + 1
}

export function levelProgress(xp: number) {
  return (xp % 100) / 100
}

export function modeCounts(completions: Completion[], userId: string) {
  const mine = completions.filter((c) => c.user_id === userId)
  return {
    solo: mine.filter((c) => c.mode === 'solo').length,
    team: mine.filter((c) => c.mode === 'team').length,
    total: mine.length,
  }
}

export function streakDays(completions: Completion[], userId: string) {
  const dates = new Set(
    completions.filter((c) => c.user_id === userId).map((c) => c.completed_at.slice(0, 10)),
  )
  let streak = 0
  const cursor = new Date()
  for (;;) {
    const key = cursor.toISOString().slice(0, 10)
    if (dates.has(key)) {
      streak++
      cursor.setDate(cursor.getDate() - 1)
    } else {
      break
    }
  }
  return streak
}
