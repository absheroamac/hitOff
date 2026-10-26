import { useCallback, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'

function keyFor(weekNumber: number, dayId: string, taskId: string) {
  return `${weekNumber}:${dayId}:${taskId}`
}

export function useSkipped() {
  const { user } = useAuth()
  const storageKey = `hitoff_skipped_${user?.id ?? 'guest'}`

  const [skippedSet, setSkippedSet] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set()
    try {
      const stored = localStorage.getItem(storageKey)
      return stored ? new Set(JSON.parse(stored)) : new Set()
    } catch {
      return new Set()
    }
  })

  // Sync with storage on user change
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      setSkippedSet(stored ? new Set(JSON.parse(stored)) : new Set())
    } catch {
      setSkippedSet(new Set())
    }
  }, [storageKey])

  const save = useCallback(
    (newSet: Set<string>) => {
      setSkippedSet(newSet)
      try {
        localStorage.setItem(storageKey, JSON.stringify(Array.from(newSet)))
      } catch (err) {
        console.error('Failed to save skipped state', err)
      }
    },
    [storageKey],
  )

  const isSkipped = useCallback(
    (weekNumber: number, dayId: string, taskId: string) => {
      return skippedSet.has(keyFor(weekNumber, dayId, taskId))
    },
    [skippedSet],
  )

  const skip = useCallback(
    (weekNumber: number, dayId: string, taskId: string) => {
      const key = keyFor(weekNumber, dayId, taskId)
      const next = new Set(skippedSet)
      next.add(key)
      save(next)
    },
    [skippedSet, save],
  )

  const unskip = useCallback(
    (weekNumber: number, dayId: string, taskId: string) => {
      const key = keyFor(weekNumber, dayId, taskId)
      if (!skippedSet.has(key)) return
      const next = new Set(skippedSet)
      next.delete(key)
      save(next)
    },
    [skippedSet, save],
  )

  const toggleSkip = useCallback(
    (weekNumber: number, dayId: string, taskId: string) => {
      const key = keyFor(weekNumber, dayId, taskId)
      const next = new Set(skippedSet)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      save(next)
    },
    [skippedSet, save],
  )

  const skipRemaining = useCallback(
    (weekNumber: number, dayId: string, taskIds: string[]) => {
      const next = new Set(skippedSet)
      taskIds.forEach((id) => next.add(keyFor(weekNumber, dayId, id)))
      save(next)
    },
    [skippedSet, save],
  )

  const unskipAll = useCallback(
    (weekNumber: number, dayId: string) => {
      const prefix = `${weekNumber}:${dayId}:`
      const next = new Set<string>()
      skippedSet.forEach((k) => {
        if (!k.startsWith(prefix)) next.add(k)
      })
      save(next)
    },
    [skippedSet, save],
  )

  return {
    isSkipped,
    skip,
    unskip,
    toggleSkip,
    skipRemaining,
    unskipAll,
  }
}
