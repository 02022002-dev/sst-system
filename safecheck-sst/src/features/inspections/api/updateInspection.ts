import { supabase } from '@/lib/supabase/client'

export async function updateInspectionStatus(
  id: string,
  status: 'aberta' | 'concluida'
): Promise<{ ok: true } | { ok: false; message: string }> {
  const { error } = await supabase
    .from('inspections')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    return { ok: false, message: error.message }
  }

  return { ok: true }
}