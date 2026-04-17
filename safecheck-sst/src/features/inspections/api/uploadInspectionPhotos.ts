import { supabase } from '@/lib/supabase/client'

const INSPECTION_PHOTOS_BUCKET = 'inspection-photos'

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_')
}

export async function uploadInspectionPhotos(
  inspectionId: string,
  files: File[]
): Promise<{ ok: true } | { ok: false; message: string }> {
  if (files.length === 0) {
    return { ok: true }
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('company_id')
    .maybeSingle()

  if (profileError || !profile) {
    return { ok: false, message: 'Não foi possível identificar a empresa para upload das fotos.' }
  }

  const uploadedPaths: string[] = []

  for (const file of files) {
    const storagePath = `${profile.company_id}/${inspectionId}/${Date.now()}-${crypto.randomUUID()}-${sanitizeFileName(file.name)}`
    const { error: uploadError } = await supabase.storage
      .from(INSPECTION_PHOTOS_BUCKET)
      .upload(storagePath, file, { upsert: false })

    if (uploadError) {
      return { ok: false, message: uploadError.message }
    }
    uploadedPaths.push(storagePath)
  }

  const { error: insertError } = await supabase.from('inspection_photos').insert(
    uploadedPaths.map((path) => ({
      inspection_id: inspectionId,
      company_id: profile.company_id,
      storage_path: path,
    }))
  )

  if (insertError) {
    return { ok: false, message: insertError.message }
  }

  return { ok: true }
}
