import { AppShell } from '@/components/layout/AppShell'
import { useEffect, useMemo, useState } from 'react'
import { createTraining } from '@/features/trainings/api/createTraining'
import { getTrainings, type Training } from '@/features/trainings/api/getTrainings'

type TrainingStatus = 'valido' | 'vencendo' | 'vencido'

function calculateTrainingStatus(expirationDate: string): TrainingStatus {
  const now = new Date()
  const expiration = new Date(`${expirationDate}T23:59:59`)
  const diffInMs = expiration.getTime() - now.getTime()
  const daysToExpire = Math.ceil(diffInMs / (1000 * 60 * 60 * 24))

  if (daysToExpire < 0) return 'vencido'
  if (daysToExpire <= 30) return 'vencendo'
  return 'valido'
}

function StatusBadge({ status }: { status: TrainingStatus }) {
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

function TrainingCard({ training }: { training: Training }) {
  const status = calculateTrainingStatus(training.expiration_date)
  const completionDate = new Date(`${training.completion_date}T00:00:00`).toLocaleDateString('pt-BR')
  const expirationDate = new Date(`${training.expiration_date}T00:00:00`).toLocaleDateString('pt-BR')

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
          <h3 className="font-semibold text-slate-900">{training.employee_name}</h3>
          <p className="mt-1 text-sm text-slate-600">{training.required_course_name}</p>
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
            ? '⚠ Treinamento vencido. Ação imediata necessária.'
            : '⚠ Treinamento próximo do vencimento (até 30 dias).'}
        </div>
      )}

      <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-slate-600 sm:grid-cols-2">
        <span>✅ Realização: {completionDate}</span>
        <span>📅 Vencimento: {expirationDate}</span>
      </div>
    </div>
  )
}

function NewTrainingModal({
  onClose,
  onCreated,
}: {
  onClose: () => void
  onCreated: () => void
}) {
  const [employeeName, setEmployeeName] = useState('')
  const [requiredCourseName, setRequiredCourseName] = useState('')
  const [completionDate, setCompletionDate] = useState('')
  const [expirationDate, setExpirationDate] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    if (!employeeName || !requiredCourseName || !completionDate || !expirationDate) {
      setError('Preencha todos os campos obrigatórios.')
      return
    }

    setSubmitting(true)
    setError(null)
    const result = await createTraining({
      employee_name: employeeName,
      required_course_name: requiredCourseName,
      completion_date: completionDate,
      expiration_date: expirationDate,
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
        <h2 className="text-lg font-semibold text-slate-900">Novo treinamento</h2>
        <div className="mt-4 space-y-3">
          <div>
            <label className="text-xs font-medium text-slate-600">Nome do funcionário *</label>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              placeholder="Ex.: João da Silva"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Curso obrigatório *</label>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              value={requiredCourseName}
              onChange={(e) => setRequiredCourseName(e.target.value)}
              placeholder="Ex.: NR-35 Trabalho em Altura"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Data de realização *</label>
            <input
              type="date"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              value={completionDate}
              onChange={(e) => setCompletionDate(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Data de vencimento *</label>
            <input
              type="date"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
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

export function TrainingsPage() {
  const [trainings, setTrainings] = useState<Training[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)

  const highlightedCount = useMemo(
    () =>
      trainings.filter((training) => {
        const status = calculateTrainingStatus(training.expiration_date)
        return status === 'vencido' || status === 'vencendo'
      }).length,
    [trainings]
  )

  function load() {
    setLoading(true)
    getTrainings().then(({ data, error }) => {
      setTrainings(data)
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
    <AppShell title="Treinamentos">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-slate-500">
            {trainings.length} treinamento(s)
          </h2>
          <button
            onClick={() => setShowModal(true)}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            + Novo treinamento
          </button>
        </div>

        {highlightedCount > 0 && (
          <div className="rounded-2xl border border-yellow-300 bg-yellow-50 p-4">
            <p className="text-sm font-medium text-yellow-800">
              ⚠ Atenção: {highlightedCount} treinamento(s) vencido(s) ou vencendo em breve.
            </p>
          </div>
        )}

        {loading && <p className="text-sm text-slate-500">Carregando treinamentos…</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {!loading && !error && trainings.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-6 text-center">
            <h2 className="text-base font-semibold text-slate-900">Nenhum treinamento ainda</h2>
            <p className="mt-2 text-sm text-slate-600">
              Cadastre o primeiro treinamento para acompanhar vencimentos.
            </p>
          </div>
        )}

        {trainings.map((training) => (
          <TrainingCard key={training.id} training={training} />
        ))}
      </div>

      {showModal && (
        <NewTrainingModal
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
