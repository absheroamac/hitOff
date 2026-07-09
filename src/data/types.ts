export type DayType = 'striking' | 'wrestling' | 'rest' | 'ground' | 'integration' | 'optional'

export interface TimerConfig {
  workSec: number
  restSec: number
  /** Rounds each partner gets when turnBased is true; total rounds otherwise. */
  rounds: number
  label: string
  /** True when partners take turns in distinct roles (e.g. striker/holder) that must swap so both get equal time. */
  turnBased?: boolean
  /** [active-partner role, other-partner role], e.g. ['striking the pads', 'holding pads & calling combos']. */
  roles?: [string, string]
}

export interface SessionTask {
  id: string
  label: string
  description: string
  /** Practicing alone — shadow reps, solo drilling. Omit if the task truly requires a partner (e.g. live sparring). */
  solo?: TimerConfig
  /** Practicing with your partner — holder/striker or feed/defend roles, swapping each round. */
  team?: TimerConfig
}

export interface DaySession {
  id: string
  dayNumber: number
  type: DayType
  title: string
  tasks: SessionTask[]
}

export interface Week {
  weekNumber: number
  phase: 1 | 2 | 3
  phaseTitle: string
  days: DaySession[]
}
