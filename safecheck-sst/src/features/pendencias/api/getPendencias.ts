import { supabase } from '@/lib/supabase/client'
import type { Database, InspectionRiskLevel, PendenciaStatus } from '@/types/database'

export type Pendencia = Database['public']['Tables']['pendencias']['Row']

type Filters = {
  status?: PendenciaStatus | 'abertas' | 'todas'
  riskLevel?: InspectionRiskLevel | 'todos'
}

export async function getPendencias(filters?: Filters): Promise<{
  data: Pendencia[]
  error: string | null
}> {
  const status = filters?.status ?? 'abertas'
  const riskLevel = filters?.riskLevel ?? 'todos'

  let query = supabase.from('pendencias').select('*')

  if (status === 'abertas') {
    query = query.in('status', ['pendente', 'em_andamento'])
  } else if (status !== 'todas') {
    query = query.eq('status', status)
  }

  if (riskLevel !== 'todos') {
    query = query.eq('risk_level', riskLevel)
  }

  const { data, error } = await query.order('due_date', { ascending: true })

  if (error) {
    return { data: [], error: error.message }
  }

  return { data: data ?? [], error: null }
}
