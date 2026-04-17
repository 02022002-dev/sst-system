import { supabase } from '@/lib/supabase/client'

export async function archiveInspection(id: string): Promise<{ ok: true } | { ok: false; message: string }> {
  const { error } = await supabase
    .from('inspections')
    .update({ archived_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    return { ok: false, message: error.message }
  }

  return { ok: true }
}
