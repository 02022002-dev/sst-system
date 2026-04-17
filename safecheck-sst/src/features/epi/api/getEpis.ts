import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/types/database'

export type Epi = Database['public']['Tables']['epis']['Row']

export async function getEpis(): Promise<{ data: Epi[]; error: string | null }> {
  const { data, error } = await supabase.from('epis').select('*').order('expires_at', { ascending: true })

  if (error) {
    return { data: [], error: error.message }
  }

  return { data: data ?? [], error: null }
}
