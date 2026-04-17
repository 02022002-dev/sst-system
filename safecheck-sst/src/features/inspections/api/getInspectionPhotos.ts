import { supabase } from '@/lib/supabase/client'

const INSPECTION_PHOTOS_BUCKET = 'inspection-photos'

export async function getInspectionPhotosByInspection(
  inspectionIds: string[]
): Promise<{ data: Record<string, string[]>; error: string | null }> {
  if (inspectionIds.length === 0) {
    return { data: {}, error: null }
  }

  const { data, error } = await supabase
    .from('inspection_photos')
    .select('inspection_id, storage_path, created_at')
    .in('inspection_id', inspectionIds)
    .order('created_at', { ascending: true })

  if (error) {
    return { data: {}, error: error.message }
  }

  const grouped = (data ?? []).reduce<Record<string, string[]>>((acc, row) => {
    const { data: publicUrlData } = supabase.storage
      .from(INSPECTION_PHOTOS_BUCKET)
      .getPublicUrl(row.storage_path)
    if (!acc[row.inspection_id]) {
      acc[row.inspection_id] = []
    }
    acc[row.inspection_id].push(publicUrlData.publicUrl)
    return acc
  }, {})

  return { data: grouped, error: null }
}
