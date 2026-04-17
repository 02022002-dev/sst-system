import { AppShell } from '@/components/layout/AppShell'
import { useEffect, useMemo, useState } from 'react'
import { createEpi } from '@/features/epi/api/createEpi'
import { getEpis, type Epi } from '@/features/epi/api/getEpis'

type EpiStatus = 'valido' | 'vencendo' | 'vencido'

function calculateEpiStatus(expiresAt: string): EpiStatus {
  const now = new Date()
  const expiration = new Date(`${expiresAt}T23:59:59`)
  const diffInMs = expiration.getTime() - now.getTime()
  const daysToExpire = Math.ceil(diffInMs / (1000 * 60 * 60 * 24))

  if (daysToExpire < 0) return 'vencido'
  if (daysToExpire <= 30) return 'vencendo'
  return 'valido'
}

function StatusBadge({ status }: { status: EpiStatus }) {
  if (status === 'vencido') {
    return (
      <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
        Vencido
      </span>
    )
  }
  if (status === 'vencendo') {
    return (
      <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
        Vencendo em breve
      </span>
    )
  }
  return (
    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
      Válido
    </span>
  )
}

function EpiCard({ epi }: { epi: Epi }) {
  const status = calculateEpiStatus(epi.expires_at)
  const deliveredAt = new Date(`${epi.delivered_at}T00:00:00`).toLocaleDateString('pt-BR')
  const expiresAt = new Date(`${epi.expires_at}T00:00:00`).toLocaleDateString('pt-BR')

  const alertClass =
    status === 'vencido'
      ? 'border-red-300 bg-red-50'
      : status === 'vencendo'
      ? 'border-yellow-300 bg-yellow-50'
      : 'border-slate-200 bg-white'

  return (
    <div className={`rounded-2xl border p-4 shadow-sm ${alertClass}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-slate-900">{epi.employee_name}</h3>
          <p className="mt-1 text-sm text-slate-600">{epi.epi_type}</p>
        </div>
        <StatusBadge status={status} />
      </div>

      {(status === 'vencido' || status === 'vencendo') && (
        <div
          className={`mt-3 rounded-xl border px-3 py-2 text-sm font-medium ${
            status === 'vencido'
              ? 'border-red-300 bg-red-100 text-red-800'
              : 'border-yellow-300 bg-yellow-100 text-yellow-800'
          }`}
        >
          {status === 'vencido'
            ? '⚠ EPI vencido. Substituição imediata necessária.'
            : '⚠ EPI próximo da validade/troca (até 30 dias).'}
        </div>
      )}

      <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-slate-600 sm:grid-cols-2">
        <span>🪪 CA: {epi.ca}</span>
        <span>📦 Entrega: {deliveredAt}</span>
        <span>📅 Validade/Troca: {expiresAt}</span>
      </div>
    </div>
  )
}

function NewEpiModal({
  onClose,
  onCreated,
}: {
  onClose: () => void
  onCreated: () => void
}) {
  const [employeeName, setEmployeeName] = useState('')
  const [epiType, setEpiType] = useState('')
  const [ca, setCa] = useState('')
  const [deliveredAt, setDeliveredAt] = useState('')
  const [expiresAt, setExpiresAt] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    if (!employeeName || !epiType || !ca || !deliveredAt || !expiresAt) {
      setError('Preencha todos os campos obrigatórios.')
      return
    }

    setSubmitting(true)
    setError(null)
    const result = await createEpi({
      employee_name: employeeName,
      epi_type: epiType,
      ca,
      delivered_at: deliveredAt,
      expires_at: expiresAt,
    })
    setSubmitting(false)

    if ('message' in result) {
      setError(result.message)
      return
    }

    onCreated()
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-slate-900">Novo EPI</h2>
        <div className="mt-4 space-y-3">
          <div>
            <label className="text-xs font-medium text-slate-600">Nome do funcionário *</label>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              placeholder="Ex.: Maria Souza"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Tipo de EPI *</label>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              value={epiType}
              onChange={(e) => setEpiType(e.target.value)}
              placeholder="Ex.: Capacete classe B"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">CA (Certificado de Aprovação) *</label>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              value={ca}
              onChange={(e) => setCa(e.target.value)}
              placeholder="Ex.: 12345"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Data de entrega *</label>
            <input
              type="date"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              value={deliveredAt}
              onChange={(e) => setDeliveredAt(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Data de validade/troca *</label>
            <input
              type="date"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
        <div className="mt-5 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 rounded-xl bg-emerald-600 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {submitting ? 'Salvando…' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  )
}

export function EpiPage() {
  const [epis, setEpis] = useState<Epi[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)

  const highlightedCount = useMemo(
    () =>
      epis.filter((epi) => {
        const status = calculateEpiStatus(epi.expires_at)
        return status === 'vencido' || status === 'vencendo'
      }).length,
    [epis]
  )

  function load() {
    setLoading(true)
    getEpis().then(({ data, error }) => {
      setEpis(data)
      setError(error)
      setLoading(false)
    })
  }

  useEffect(() => {
    void Promise.resolve().then(() => {
      load()
    })
  }, [])

  return (
    <AppShell title="Controle de EPI">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-slate-500">{epis.length} EPI(s)</h2>
          <button
            onClick={() => setShowModal(true)}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            + Novo EPI
          </button>
        </div>

        {highlightedCount > 0 && (
          <div className="rounded-2xl border border-yellow-300 bg-yellow-50 p-4">
            <p className="text-sm font-medium text-yellow-800">
              ⚠ Atenção: {highlightedCount} EPI(s) vencido(s) ou vencendo em breve.
            </p>
          </div>
        )}

        {loading && <p className="text-sm text-slate-500">Carregando EPIs…</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {!loading && !error && epis.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-6 text-center">
            <h2 className="text-base font-semibold text-slate-900">Nenhum EPI ainda</h2>
            <p className="mt-2 text-sm text-slate-600">
              Cadastre o primeiro EPI para acompanhar validade e troca.
            </p>
          </div>
        )}

        {epis.map((epi) => (
          <EpiCard key={epi.id} epi={epi} />
        ))}
      </div>

      {showModal && (
        <NewEpiModal
          onClose={() => setShowModal(false)}
          onCreated={() => {
            setShowModal(false)
            load()
          }}
        />
      )}
    </AppShell>
  )
}
