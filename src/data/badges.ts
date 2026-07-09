import { PROGRAM } from './program'
import type { Completion } from '../lib/useCompletions'
import { weekProgress } from '../lib/progress'
import { streakDays, modeCounts } from '../lib/gamify'

export interface Badge {
  id: string
  emoji: string
  title: string
  description: string
  check: (completions: Completion[], userId: string) => boolean
}

const phase1Weeks = [1, 2, 3, 4]
const phase2Weeks = [5, 6, 7, 8]
const phase3Weeks = [9, 10, 11, 12]

export const BADGES: Badge[] = [
  {
    id: 'first-step',
    emoji: '👣',
    title: 'First Step',
    description: 'Complete your first task',
    check: (c, u) => c.some((x) => x.user_id === u),
  },
  {
    id: 'week1',
    emoji: '🥇',
    title: 'Week One Warrior',
    description: 'Finish everything in Week 1',
    check: (c, u) => weekProgress(1, c, u) >= 1,
  },
  {
    id: 'streak3',
    emoji: '🔥',
    title: 'On a Roll',
    description: '3-day training streak',
    check: (c, u) => streakDays(c, u) >= 3,
  },
  {
    id: 'streak7',
    emoji: '☄️',
    title: 'Unstoppable',
    description: '7-day training streak',
    check: (c, u) => streakDays(c, u) >= 7,
  },
  {
    id: 'phase1',
    emoji: '🎖️',
    title: 'Foundations Set',
    description: 'Complete Phase 1 (weeks 1–4)',
    check: (c, u) => phase1Weeks.every((w) => weekProgress(w, c, u) >= 1),
  },
  {
    id: 'solo25',
    emoji: '🧍',
    title: 'Solo Grinder',
    description: '25 solo sessions logged',
    check: (c, u) => modeCounts(c, u).solo >= 25,
  },
  {
    id: 'team25',
    emoji: '🤝',
    title: 'Dream Team',
    description: '25 sessions trained together',
    check: (c, u) => modeCounts(c, u).team >= 25,
  },
  {
    id: 'century',
    emoji: '💯',
    title: 'Century Club',
    description: 'Complete 100 tasks total',
    check: (c, u) => c.filter((x) => x.user_id === u).length >= 100,
  },
  {
    id: 'phase2',
    emoji: '🏵️',
    title: 'Combo Master',
    description: 'Complete Phase 2 (weeks 5–8)',
    check: (c, u) => phase2Weeks.every((w) => weekProgress(w, c, u) >= 1),
  },
  {
    id: 'streak14',
    emoji: '🌋',
    title: 'Iron Will',
    description: '14-day training streak',
    check: (c, u) => streakDays(c, u) >= 14,
  },
  {
    id: 'phase3',
    emoji: '🏆',
    title: 'Fight Ready',
    description: 'Complete the full 12-week program',
    check: (c, u) => phase3Weeks.every((w) => weekProgress(w, c, u) >= 1) && PROGRAM.every((w) => weekProgress(w.weekNumber, c, u) >= 1),
  },
]
