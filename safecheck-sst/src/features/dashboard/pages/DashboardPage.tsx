import { AppShell } from '@/components/layout/AppShell'

export function DashboardPage() {
  return (
    <AppShell title="Painel">
      <div className="grid gap-3 sm:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Inspeções (30 dias)</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">—</p>
          <p className="mt-1 text-xs text-slate-500">Indicadores aparecerão após integração dos dados.</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Pendências abertas</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">—</p>
          <p className="mt-1 text-xs text-slate-500">Resumo por prioridade virá na próxima etapa.</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:col-span-2">
          <p className="text-xs font-medium text-slate-500">Treinamentos vencendo</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">—</p>
          <p className="mt-1 text-xs text-slate-500">
            Este painel será alimentado pelas tabelas do Supabase (views ou RPC).
          </p>
        </article>
      </div>
    </AppShell>
  )
}
