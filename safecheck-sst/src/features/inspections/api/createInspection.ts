import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/types/database'
import { createPendenciaManual } from '@/features/pendencias/api/createPendencia'

type InsertInspection = Database['public']['Tables']['inspections']['Insert']

export async function createInspection(
  params: Omit<InsertInspection, 'id' | 'company_id' | 'created_at' | 'updated_at'>
): Promise<{ ok: true; inspectionId: string } | { ok: false; message: string }> {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('company_id')
    .maybeSingle()

  if (profileError || !profile) {
    return { ok: false, message: 'Não foi possível identificar a empresa.' }
  }

  const { data, error } = await supabase
    .from('inspections')
    .insert({
      ...params,
      company_id: profile.company_id,
    })
    .select('id')
    .single()

  if (error) {
    return { ok: false, message: error.message }
  }

  // ✅ cria pendência automaticamente após inspeção
  const pendenciaResult = await createPendenciaManual({
    inspection_id: data.id,
    problem_description: params.title,
    sector: params.sector,
    risk_level: (params.risk_level ?? 'baixo') as 'baixo' | 'medio' | 'alto',
    responsible: params.responsible,
    due_date: params.scheduled_at ?? null,
  })

  if (pendenciaResult?.message) {
    console.warn('Pendência criada:', pendenciaResult.message)
  }

  return { ok: true, inspectionId: data.id }
}