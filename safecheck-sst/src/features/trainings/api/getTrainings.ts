import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/types/database'

export type Training = Database['public']['Tables']['trainings']['Row']

export async function getTrainings(): Promise<{ data: Training[]; error: string | null }> {
  const { data, error } = await supabase
    .from('trainings')
    .select('*')
    .order('expiration_date', { ascending: true })

  if (error) {
    return { data: [], error: error.message }
  }

  return { data: data ?? [], error: null }
}
