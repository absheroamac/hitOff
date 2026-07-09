import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './lib/AuthContext'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { WeekPage } from './pages/WeekPage'
import { DayPage } from './pages/DayPage'
import { Profile } from './pages/Profile'
import { Stats } from './pages/Stats'
import { BottomNav } from './components/BottomNav'

function Gate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-white/40 text-sm">
        Loading…
      </div>
    )
  }
  if (!user) return <Login />
  return <>{children}</>
}

const NAV_ROUTES = new Set(['/', '/stats', '/profile'])

function AppRoutes() {
  const location = useLocation()
  const showNav = NAV_ROUTES.has(location.pathname)

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Gate>
              <Dashboard />
            </Gate>
          }
        />
        <Route
          path="/week/:weekNumber"
          element={
            <Gate>
              <WeekPage />
            </Gate>
          }
        />
        <Route
          path="/week/:weekNumber/day/:dayId"
          element={
            <Gate>
              <DayPage />
            </Gate>
          }
        />
        <Route
          path="/stats"
          element={
            <Gate>
              <Stats />
            </Gate>
          }
        />
        <Route
          path="/profile"
          element={
            <Gate>
              <Profile />
            </Gate>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {showNav && <BottomNav />}
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AuthProvider>
  )
}

export default App
