import { NavLink } from 'react-router-dom'

export function BottomNav() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center gap-1 flex-1 py-2.5 text-xs font-medium transition-colors ${
      isActive ? 'text-emerald-400' : 'text-white/40'
    }`

  return (
    <nav className="sticky bottom-0 left-0 right-0 surface backdrop-blur-xl flex px-2 pb-[env(safe-area-inset-bottom)] z-40">
      <NavLink to="/" end className={linkClass}>
        <span className="text-xl">🏠</span>
        Home
      </NavLink>
      <NavLink to="/stats" className={linkClass}>
        <span className="text-xl">📊</span>
        Stats
      </NavLink>
      <NavLink to="/profile" className={linkClass}>
        <span className="text-xl">🥋</span>
        Profile
      </NavLink>
    </nav>
  )
}
