import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const url = String(import.meta.env.VITE_SUPABASE_URL ?? '').trim()
const anonKey = String(import.meta.env.VITE_SUPABASE_ANON_KEY ?? '').trim()

export function isSupabaseConfigured(): boolean {
  return Boolean(url && anonKey)
}

const authOptions = {
  persistSession: true,
  autoRefreshToken: true,
  detectSessionInUrl: true,
} as const

let client: SupabaseClient<Database> | undefined

function getOrCreateClient(): SupabaseClient<Database> {
  if (!client) {
    if (!isSupabaseConfigured()) {
      throw new Error(
        'Supabase não está configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY (ou SUPABASE_URL e SUPABASE_ANON_KEY) no .env, na pasta safecheck-sst ou na raiz do repositório.',
      )
    }
    client = createClient<Database>(url, anonKey, { auth: authOptions })
  }
  return client
}

export const supabase = new Proxy({} as SupabaseClient<Database>, {
  get(_target, prop, receiver) {
    const instance = getOrCreateClient()
    const value = Reflect.get(instance, prop, receiver) as unknown
    return typeof value === 'function' ? (value as (...a: unknown[]) => unknown).bind(instance) : value
  },
})
