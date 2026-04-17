import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { InspectionsPage } from '@/features/inspections/pages/InspectionsPage'
import { EpiPage } from '@/features/epi/pages/EpiPage'
import { TrainingsPage } from '@/features/trainings/pages/TrainingsPage'
import { PendenciasPage } from '@/features/pendencias/pages/PendenciasPage'
import { useAuth } from '@/features/auth/hooks/useAuth'

function HomeRedirect() {
  const { session, initializing } = useAuth()
  if (initializing) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-slate-50 px-4">
        <p className="text-sm text-slate-600">Carregando…</p>
      </div>
    )
  }
  if (session) {
    return <Navigate to="/dashboard" replace />
  }
  return <Navigate to="/login" replace />
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inspecoes"
        element={
          <ProtectedRoute>
            <InspectionsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/epis"
        element={
          <ProtectedRoute>
            <EpiPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/treinamentos"
        element={
          <ProtectedRoute>
            <TrainingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pendencias"
        element={
          <ProtectedRoute>
            <PendenciasPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
