import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

function resolveEnvDir(mode: string): string {
  const markers = ['.env', '.env.local', `.env.${mode}`, `.env.${mode}.local`]
  const hasEnvFile = (dir: string) => markers.some((name) => existsSync(path.join(dir, name)))
  const repoRoot = path.resolve(rootDir, '..')
  if (hasEnvFile(rootDir)) return rootDir
  if (hasEnvFile(repoRoot)) return repoRoot
  return rootDir
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const envDir = resolveEnvDir(mode)
  const loaded = loadEnv(mode, envDir, '')
  const supabaseUrl = loaded.VITE_SUPABASE_URL || loaded.SUPABASE_URL || ''
  const supabaseAnonKey = loaded.VITE_SUPABASE_ANON_KEY || loaded.SUPABASE_ANON_KEY || ''

  return {
    envDir,
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(supabaseUrl),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(supabaseAnonKey),
    },
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(rootDir, './src'),
      },
    },
  }
})
