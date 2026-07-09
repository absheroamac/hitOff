import { PROGRAM } from '../data/program'
import type { Completion } from './useCompletions'

export function trainingDays(weekNumber: number) {
  const week = PROGRAM.find((w) => w.weekNumber === weekNumber)
  if (!week) return []
  return week.days.filter((d) => d.type !== 'rest' && d.type !== 'optional')
}

export function weekProgress(weekNumber: number, completions: Completion[], userId?: string) {
  if (!userId) return 0
  const days = trainingDays(weekNumber)
  const totalTasks = days.reduce((sum, d) => sum + d.tasks.length, 0)
  const done = days.reduce(
    (sum, d) =>
      sum +
      d.tasks.filter((t) =>
        completions.some(
          (c) => c.week_number === weekNumber && c.day_id === d.id && c.task_id === t.id && c.user_id === userId,
        ),
      ).length,
    0,
  )
  return totalTasks === 0 ? 0 : done / totalTasks
}
