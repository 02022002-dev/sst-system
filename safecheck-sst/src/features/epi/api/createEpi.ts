import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/types/database'

type InsertEpi = Database['public']['Tables']['epis']['Insert']

export async function createEpi(
  params: Omit<InsertEpi, 'id' | 'company_id' | 'created_at' | 'updated_at'>
): Promise<{ ok: true } | { ok: false; message: string }> {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('company_id')
    .maybeSingle()

  if (profileError || !profile) {
    return { ok: false, message: 'Não foi possível identificar a empresa.' }
  }

  const { error } = await supabase.from('epis').insert({
    ...params,
    company_id: profile.company_id,
  })

  if (error) {
    return { ok: false, message: error.message }
  }

  return { ok: true }
}
