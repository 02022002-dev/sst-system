import { supabase } from "@/lib/supabase"

type CreatePendenciaData = {
  inspection_id?: string | null
  problem_description: string
  sector: string
  risk_level: "baixo" | "medio" | "alto"
  responsible: string
  due_date?: string | null
}

export async function createPendenciaManual(data: CreatePendenciaData) {
  const { data: authData, error: authError } = await supabase.auth.getUser()

  const user = authData?.user

  if (authError || !user) {
    return { message: "Usuário não autenticado" }
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("company_id")
    .eq("id", user.id)
    .single()

  if (profileError || !profile) {
    return { message: "Erro ao buscar perfil" }
  }

  const { error } = await supabase.from("pendencias").insert({
    company_id: profile.company_id,
    inspection_id: data.inspection_id ?? null,
    problem_description: data.problem_description,
    sector: data.sector,
    risk_level: data.risk_level,
    responsible: data.responsible,
    due_date: data.due_date ?? null,
    status: "aberta",
  })

  if (error) {
    return { message: error.message }
  }

  return { message: "Pendência criada com sucesso" }
}