import { useCallback, useEffect, useState } from 'react'
import { supabase } from './supabase'
import { useAuth } from './AuthContext'

export type CompletionMode = 'solo' | 'team'

export interface Completion {
  week_number: number
  day_id: string
  task_id: string
  user_id: string
  mode: CompletionMode
  completed_at: string
}

export function completionKey(weekNumber: number, dayId: string, taskId: string) {
  return `${weekNumber}:${dayId}:${taskId}`
}

export function useCompletions() {
  const { user } = useAuth()
  const [completions, setCompletions] = useState<Completion[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase.from('completions').select('*')
    if (!error && data) setCompletions(data as Completion[])
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const isDone = useCallback(
    (weekNumber: number, dayId: string, taskId: string, byUserId?: string) =>
      completions.some(
        (c) =>
          c.week_number === weekNumber &&
          c.day_id === dayId &&
          c.task_id === taskId &&
          (byUserId ? c.user_id === byUserId : c.user_id === user?.id),
      ),
    [completions, user],
  )

  /**
   * Solo: only the current user's row is written/removed.
   * Team: a row is written/removed for every id in participantIds (so it counts for both partners).
   */
  const toggle = useCallback(
    async (weekNumber: number, dayId: string, taskId: string, mode: CompletionMode, participantIds: string[]) => {
      if (!user) return
      const targetIds = mode === 'team' ? Array.from(new Set([user.id, ...participantIds])) : [user.id]
      const mine = completions.find(
        (c) => c.week_number === weekNumber && c.day_id === dayId && c.task_id === taskId && c.user_id === user.id,
      )

      if (mine) {
        await Promise.all(
          targetIds.map((id) =>
            supabase.from('completions').delete().match({ user_id: id, week_number: weekNumber, day_id: dayId, task_id: taskId }),
          ),
        )
      } else {
        await Promise.all(
          targetIds.map((id) =>
            supabase.from('completions').upsert(
              { user_id: id, week_number: weekNumber, day_id: dayId, task_id: taskId, mode },
              { onConflict: 'user_id,week_number,day_id,task_id' },
            ),
          ),
        )
      }
      await refresh()
    },
    [completions, user, refresh],
  )

  return { completions, loading, isDone, toggle, refresh }
}
