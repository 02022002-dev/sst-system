import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/types/database'

export type Inspection = Database['public']['Tables']['inspections']['Row']

export async function getInspections(): Promise<{ data: Inspection[]; error: string | null }> {
  const { data, error } = await supabase
    .from('inspections')
    .select('*')
    .order('scheduled_at', { ascending: false })

  if (error) {
    return { data: [], error: error.message }
  }

  return { data: data ?? [], error: null }
}