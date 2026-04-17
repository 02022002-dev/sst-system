import { supabase } from '@/lib/supabase/client'
import type { PendenciaStatus } from '@/types/database'

export async function updatePendenciaStatus(
  id: string,
  status: PendenciaStatus
): Promise<{ ok: true } | { ok: false; message: string }> {
  const { error } = await supabase
    .from('pendencias')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    return { ok: false, message: error.message }
  }

  return { ok: true }
}
