import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { isSupabaseConfigured } from '@/lib/supabase/client'

export function LoginPage() {
  const { session, initializing } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const redirectTo =
    (location.state as { from?: string } | null)?.from &&
    (location.state as { from?: string }).from?.startsWith('/')
      ? (location.state as { from: string }).from
      : '/dashboard'

  if (initializing) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-slate-50 px-4">
        <p className="text-sm text-slate-600">Carregando…</p>
      </div>
    )
  }

  if (session) {
    return <Navigate to={redirectTo} replace />
  }

  return (
    <div className="relative min-h-dvh overflow-hidden bg-gradient-to-b from-emerald-50 via-slate-50 to-slate-100 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-200/60 via-transparent to-transparent"
      />

      <div className="relative mx-auto flex min-h-dvh w-full max-w-lg flex-col justify-center px-4 sm:px-6">
        <header className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-lg font-bold text-white shadow-md shadow-emerald-900/20">
            SC
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            SafeCheck SST
          </h1>
          <p className="mt-2 text-pretty text-sm text-slate-600 sm:text-base">
            Inspeções, EPI, treinamentos e pendências — em um só lugar para equipes de segurança do
            trabalho.
          </p>
        </header>

        {!isSupabaseConfigured() ? (
          <div
            role="status"
            className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
          >
            Ambiente sem variáveis do Supabase. Crie o arquivo <code className="font-mono">.env</code>{' '}
            na raiz do projeto com <code className="font-mono">VITE_SUPABASE_URL</code> e{' '}
            <code className="font-mono">VITE_SUPABASE_ANON_KEY</code>.
          </div>
        ) : null}

        <LoginForm onSuccess={() => navigate(redirectTo, { replace: true })} />

        <p className="mt-8 text-center text-xs text-slate-500">
          Ao continuar, você confirma o uso conforme a política interna da sua empresa.
        </p>
      </div>
    </div>
  )
}
