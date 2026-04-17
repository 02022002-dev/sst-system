import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/types/database'

export type Inspection = Database['public']['Tables']['inspections']['Row']

export async function getInspections(params?: {
  archived?: boolean
}): Promise<{ data: Inspection[]; error: string | null }> {
  const archived = params?.archived ?? false
  let query = supabase.from('inspections').select('*')

  query = archived ? query.not('archived_at', 'is', null) : query.is('archived_at', null)

  const { data, error } = await query.order('scheduled_at', { ascending: false })

  if (error) {
    return { data: [], error: error.message }
  }

  return { data: data ?? [], error: null }
}