import { supabase } from '@/lib/supabase/client'

export async function deleteInspection(id: string): Promise<{ ok: true } | { ok: false; message: string }> {
  const { error } = await supabase.from('inspections').delete().eq('id', id)

  if (error) {
    return { ok: false, message: error.message }
  }

  return { ok: true }
}
