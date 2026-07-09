import { Link, useNavigate, useParams } from 'react-router-dom'
import { PROGRAM } from '../data/program'
import { useCompletions } from '../lib/useCompletions'
import { useAuth } from '../lib/AuthContext'

const typeEmoji: Record<string, string> = {
  striking: '🥊',
  wrestling: '🤼',
  ground: '🤸',
  integration: '🔗',
  rest: '😴',
  optional: '🚶',
}

export function WeekPage() {
  const { weekNumber } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { completions } = useCompletions()
  const week = PROGRAM.find((w) => w.weekNumber === Number(weekNumber))

  if (!week) return <div className="p-6 text-white/60">Week not found.</div>

  return (
    <div className="flex-1 px-5 pt-6 pb-8 overflow-y-auto">
      <button onClick={() => navigate('/')} className="text-white/40 text-sm mb-4">← Dashboard</button>
      <div className="text-xs text-emerald-400 uppercase tracking-widest font-semibold mb-1">
        Week {week.weekNumber}
      </div>
      <h1 className="text-2xl font-bold mb-6">{week.phaseTitle}</h1>

      <div className="flex flex-col gap-2">
        {week.days.map((d) => {
          const done = d.tasks.filter((t) => completions.some((c) => c.week_number === week.weekNumber && c.day_id === d.id && c.task_id === t.id && c.user_id === user?.id)).length
          const pct = d.tasks.length ? (done / d.tasks.length) * 100 : 0
          const complete = pct >= 100
          return (
            <Link
              key={d.id}
              to={`/week/${week.weekNumber}/day/${d.id}`}
              className="flex items-center gap-3 surface rounded-xl px-4 py-3.5"
            >
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center text-xl shrink-0 ${
                  complete ? 'bg-emerald-500/20' : 'bg-white/5'
                }`}
              >
                {complete ? '✅' : typeEmoji[d.type]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-white/35 uppercase tracking-wide font-semibold">Day {d.dayNumber}</div>
                <div className="text-sm font-medium truncate">{d.title}</div>
                {d.tasks.length > 0 && (
                  <div className="h-1.5 bg-white/10 rounded-full mt-1.5 overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                )}
              </div>
              <div className="text-white/25 text-lg shrink-0">›</div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
