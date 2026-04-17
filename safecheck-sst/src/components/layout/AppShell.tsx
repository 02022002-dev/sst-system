import { NavLink } from 'react-router-dom'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/Button'
import { IconBook, IconCamera, IconChecklist, IconHome, IconVest } from '@/components/icons/NavIcons'
import { useAuth } from '@/features/auth/hooks/useAuth'

const navClass =
  'flex flex-1 flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] font-medium text-slate-500 transition hover:text-emerald-800 aria-[current=page]:bg-emerald-50 aria-[current=page]:text-emerald-800'

type Props = {
  title: string
  children: ReactNode
}

export function AppShell({ title, children }: Props) {
  const { signOut } = useAuth()

  return (
    <div className="flex min-h-dvh flex-col bg-slate-50 pb-[calc(4.5rem+env(safe-area-inset-bottom))]">
      <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/90 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium text-emerald-700">SafeCheck SST</p>
            <h1 className="truncate text-lg font-semibold text-slate-900">{title}</h1>
          </div>
          <Button
            type="button"
            variant="ghost"
            className="!w-auto shrink-0 px-3 text-sm"
            onClick={() => void signOut()}
          >
            Sair
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-4">{children}</main>

      <nav
        className="fixed bottom-0 left-0 right-0 z-10 border-t border-slate-200 bg-white/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-md"
        aria-label="Navegação principal"
      >
        <div className="mx-auto flex max-w-3xl justify-between gap-1">
          <NavLink to="/dashboard" end className={navClass}>
            <IconHome className="text-slate-600" />
            Painel
          </NavLink>
          <NavLink to="/inspecoes" className={navClass}>
            <IconCamera className="text-slate-600" />
            Inspeções
          </NavLink>
          <NavLink to="/epis" className={navClass}>
            <IconVest className="text-slate-600" />
            EPI
          </NavLink>
          <NavLink to="/treinamentos" className={navClass}>
            <IconBook className="text-slate-600" />
            Treinos
          </NavLink>
          <NavLink to="/pendencias" className={navClass}>
            <IconChecklist className="text-slate-600" />
            Pendências
          </NavLink>
        </div>
      </nav>
    </div>
  )
}
