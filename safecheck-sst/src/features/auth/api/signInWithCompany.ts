import type { AuthError } from '@supabase/supabase-js'
import { COMPANY_SLUG_STORAGE_KEY } from '@/lib/constants'
import { isSupabaseConfigured, supabase } from '@/lib/supabase/client'

function mapAuthError(error: AuthError | null): string {
  if (!error) return 'Não foi possível entrar. Tente novamente.'
  switch (error.message) {
    case 'Invalid login credentials':
      return 'E-mail ou senha incorretos.'
    case 'Email not confirmed':
      return 'Confirme seu e-mail antes de entrar.'
    default:
      return error.message || 'Não foi possível entrar. Tente novamente.'
  }
}

export async function signInWithCompany(params: {
  companySlug: string
  email: string
  password: string
}): Promise<{ ok: true } | { ok: false; message: string }> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      message:
        'Supabase não configurado. Copie `.env.example` para `.env` e preencha URL e chave anônima.',
    }
  }

  const slug = params.companySlug.trim().toLowerCase()
  if (!slug) {
    return { ok: false, message: 'Informe o código da empresa.' }
  }

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: params.email.trim(),
    password: params.password,
  })

  if (authError || !authData.user) {
    return { ok: false, message: mapAuthError(authError) }
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('company_id')
    .eq('id', authData.user.id)
    .maybeSingle()

  if (profileError) {
    await supabase.auth.signOut()
    return {
      ok: false,
      message: 'Não foi possível validar o vínculo com a empresa.',
    }
  }

  if (!profile) {
    await supabase.auth.signOut()
    return {
      ok: false,
      message: 'Perfil não encontrado. Solicite cadastro ao administrador da empresa.',
    }
  }

  const { data: company, error: companyError } = await supabase
    .from('companies')
    .select('id, slug')
    .eq('id', profile.company_id)
    .maybeSingle()

  if (companyError || !company) {
    await supabase.auth.signOut()
    return {
      ok: false,
      message: 'Não foi possível carregar os dados da empresa.',
    }
  }

  if (company.slug.toLowerCase() !== slug) {
    await supabase.auth.signOut()
    return {
      ok: false,
      message: 'O código da empresa não confere com o cadastro deste usuário.',
    }
  }

  try {
    localStorage.setItem(COMPANY_SLUG_STORAGE_KEY, company.slug)
  } catch {
    /* storage indisponível — segue o fluxo */
  }

  return { ok: true }
}
