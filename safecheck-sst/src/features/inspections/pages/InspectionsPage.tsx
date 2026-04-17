import { useEffect, useRef, useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { getInspections, type Inspection } from '@/features/inspections/api/getInspections'
import { createInspection } from '@/features/inspections/api/createInspection'
import { updateInspectionStatus } from '@/features/inspections/api/updateInspection'
import { uploadInspectionPhotos } from '@/features/inspections/api/uploadInspectionPhotos'
import { getInspectionPhotosByInspection } from '@/features/inspections/api/getInspectionPhotos'
import { archiveInspection } from '@/features/inspections/api/archiveInspection'
import { deleteInspection } from '@/features/inspections/api/deleteInspection'

function StatusBadge({ status }: { status: string }) {
  const isOpen = status === 'aberta'
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        isOpen ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
      }`}
    >
      {isOpen ? 'Aberta' : 'Concluída'}
    </span>
  )
}

function RiskBadge({ riskLevel }: { riskLevel: Inspection['risk_level'] }) {
  if (riskLevel === 'alto') {
    return (
      <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
        Alto
      </span>
    )
  }

  if (riskLevel === 'medio') {
    return (
      <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
        Médio
      </span>
    )
  }

  return (
    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
      Baixo
    </span>
  )
}

function InspectionCard({
  inspection,
  photoUrls,
  archivedView,
  onStatusChange,
  onArchived,
  onDeleted,
}: {
  inspection: Inspection
  photoUrls: string[]
  archivedView: boolean
  onStatusChange: () => void
  onArchived: () => void
  onDeleted: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const date = new Date(inspection.scheduled_at).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  async function toggleStatus() {
    setLoading(true)
    const newStatus = inspection.status === 'aberta' ? 'concluida' : 'aberta'
    await updateInspectionStatus(inspection.id, newStatus)
    setLoading(false)
    onStatusChange()
  }

  async function handleArchive() {
    const confirmed = window.confirm('Deseja arquivar esta inspeção?')
    if (!confirmed) return
    const result = await archiveInspection(inspection.id)
    if ('message' in result) {
      window.alert(`Erro ao arquivar: ${result.message}`)
      return
    }
    onArchived()
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      'Deseja excluir esta inspeção permanentemente? Esta ação não pode ser desfeita.'
    )
    if (!confirmed) return
    const result = await deleteInspection(inspection.id)
    if ('message' in result) {
      window.alert(`Erro ao excluir: ${result.message}`)
      return
    }
    onDeleted()
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-slate-900">{inspection.title}</h3>
        <div className="relative flex items-center gap-2">
          <RiskBadge riskLevel={inspection.risk_level} />
          <StatusBadge status={inspection.status} />
          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            ⋯
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-8 z-10 w-44 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
              {!archivedView && (
                <button
                  type="button"
                  onClick={handleArchive}
                  className="w-full rounded-md px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                >
                  Arquivar
                </button>
              )}
              <button
                type="button"
                onClick={handleDelete}
                className="w-full rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
              >
                Excluir
              </button>
            </div>
          )}
        </div>
      </div>
      {inspection.description && (
        <p className="mt-1 text-sm text-slate-500">{inspection.description}</p>
      )}
      {photoUrls.length > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {photoUrls.map((url) => (
            <a key={url} href={url} target="_blank" rel="noreferrer" className="block">
              <img
                src={url}
                alt={`Foto da inspeção ${inspection.title}`}
                className="h-24 w-full rounded-lg border border-slate-200 object-cover"
              />
            </a>
          ))}
        </div>
      )}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span>📅 {date}</span>
          <span>👤 {inspection.responsible}</span>
        </div>
        {!archivedView && (
          <button
            onClick={toggleStatus}
            disabled={loading}
            className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 ${
              inspection.status === 'aberta'
                ? 'bg-green-50 text-green-700 hover:bg-green-100'
                : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
            }`}
          >
            {loading
              ? '…'
              : inspection.status === 'aberta'
              ? '✓ Concluir'
              : '↩ Reabrir'}
          </button>
        )}
      </div>
    </div>
  )
}

function NewInspectionModal({
  onClose,
  onCreated,
}: {
  onClose: () => void
  onCreated: () => void
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [responsible, setResponsible] = useState('')
  const [scheduledAt, setScheduledAt] = useState('')
  const [riskLevel, setRiskLevel] = useState<Inspection['risk_level']>('baixo')
  const [photos, setPhotos] = useState<File[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const cameraInputRef = useRef<HTMLInputElement | null>(null)
  const galleryInputRef = useRef<HTMLInputElement | null>(null)

  function appendFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setPhotos((current) => [...current, ...Array.from(files)])
  }

  function removePhoto(index: number) {
    setPhotos((current) => current.filter((_, photoIndex) => photoIndex !== index))
  }

  async function handleSubmit() {
    if (!title || !responsible || !scheduledAt) {
      setError('Preencha todos os campos obrigatórios.')
      return
    }
    setSubmitting(true)
    setError(null)
    const result = await createInspection({
      title,
      description: description || null,
      responsible,
      scheduled_at: new Date(scheduledAt).toISOString(),
      status: 'aberta',
      risk_level: riskLevel,
    })
    if ('message' in result) {
      setSubmitting(false)
      setError(result.message)
      return
    }

    const uploadResult = await uploadInspectionPhotos(result.inspectionId, photos)
    setSubmitting(false)
    if ('message' in uploadResult) {
      setError(`Inspeção criada, mas houve erro ao enviar fotos: ${uploadResult.message}`)
      onCreated()
      return
    }

    onCreated()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-slate-900">Nova inspeção</h2>
        <div className="mt-4 space-y-3">
          <div>
            <label className="text-xs font-medium text-slate-600">Título *</label>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex.: Inspeção de EPI"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Descrição</label>
            <textarea
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Opcional"
              rows={2}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Responsável *</label>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              value={responsible}
              onChange={(e) => setResponsible(e.target.value)}
              placeholder="Nome do responsável"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Data prevista *</label>
            <input
              type="date"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Nível de risco *</label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRiskLevel('baixo')}
                className={`rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                  riskLevel === 'baixo'
                    ? 'border-green-600 bg-green-600 text-white'
                    : 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
                }`}
              >
                Baixo
              </button>
              <button
                type="button"
                onClick={() => setRiskLevel('medio')}
                className={`rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                  riskLevel === 'medio'
                    ? 'border-yellow-500 bg-yellow-500 text-white'
                    : 'border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                }`}
              >
                Médio
              </button>
              <button
                type="button"
                onClick={() => setRiskLevel('alto')}
                className={`rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                  riskLevel === 'alto'
                    ? 'border-red-600 bg-red-600 text-white'
                    : 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
                }`}
              >
                Alto
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Fotos da inspeção</label>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                📷 Câmera
              </button>
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Upload de imagem
              </button>
            </div>
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              multiple
              className="hidden"
              onChange={(e) => appendFiles(e.target.files)}
            />
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => appendFiles(e.target.files)}
            />
            {photos.length > 0 && (
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {photos.map((photo, index) => (
                  <div key={`${photo.name}-${index}`} className="relative">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={photo.name}
                      className="h-24 w-full rounded-lg border border-slate-200 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute right-1 top-1 rounded-full bg-black/60 px-1.5 text-xs text-white"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
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

export function InspectionsPage() {
  const [inspections, setInspections] = useState<Inspection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [photosByInspection, setPhotosByInspection] = useState<Record<string, string[]>>({})
  const [showModal, setShowModal] = useState(false)
  const [showArchived, setShowArchived] = useState(false)

  function load() {
    setLoading(true)
    getInspections({ archived: showArchived }).then(({ data, error }) => {
      setInspections(data)
      setError(error)
      if (!error) {
        void getInspectionPhotosByInspection(data.map((inspection) => inspection.id)).then(
          ({ data: photoMap }) => {
            setPhotosByInspection(photoMap)
          }
        )
      }
      setLoading(false)
    })
  }

  useEffect(() => {
    void Promise.resolve().then(() => {
      load()
    })
  }, [showArchived])

  return (
    <AppShell title="Inspeções">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-slate-500">
            {inspections.length} inspeção(ões)
          </h2>
          <div className="flex items-center gap-2">
            <div className="rounded-xl border border-slate-200 p-1">
              <button
                type="button"
                onClick={() => setShowArchived(false)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                  !showArchived ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Ativas
              </button>
              <button
                type="button"
                onClick={() => setShowArchived(true)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                  showArchived ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Arquivadas
              </button>
            </div>
            {!showArchived && (
              <button
                onClick={() => setShowModal(true)}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                + Nova inspeção
              </button>
            )}
          </div>
        </div>

        {loading && <p className="text-sm text-slate-500">Carregando inspeções…</p>}

        {error && <p className="text-sm text-red-600">{error}</p>}

        {!loading && !error && inspections.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-6 text-center">
            <h2 className="text-base font-semibold text-slate-900">Nenhuma inspeção ainda</h2>
            <p className="mt-2 text-sm text-slate-600">
              Crie a primeira inspeção para começar.
            </p>
          </div>
        )}

        {inspections.map((inspection) => (
          <InspectionCard
            key={inspection.id}
            inspection={inspection}
            photoUrls={photosByInspection[inspection.id] ?? []}
            archivedView={showArchived}
            onStatusChange={load}
            onArchived={load}
            onDeleted={load}
          />
        ))}
      </div>

      {showModal && (
        <NewInspectionModal
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