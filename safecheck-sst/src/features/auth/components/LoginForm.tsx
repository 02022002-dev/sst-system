import { useEffect, useId, useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { signInWithCompany } from '@/features/auth/api/signInWithCompany'
import { COMPANY_SLUG_STORAGE_KEY } from '@/lib/constants'

type Props = {
  onSuccess: () => void
}

export function LoginForm({ onSuccess }: Props) {
  const companyId = useId()
  const emailId = useId()
  const passwordId = useId()

  const [companySlug, setCompanySlug] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(COMPANY_SLUG_STORAGE_KEY)
      if (stored) {
        setCompanySlug(stored)
      }
    } catch {
      /* ignore */
    }
  }, [])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const result = await signInWithCompany({ companySlug, email, password })
      if (!result.ok) {
        setError(result.message)
        return
      }
      onSuccess()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md space-y-4 rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-lg shadow-slate-900/5 ring-1 ring-slate-900/5 backdrop-blur-sm sm:p-6"
    >
      <div className="space-y-1.5">
        <Label htmlFor={companyId}>Código da empresa</Label>
        <Input
          id={companyId}
          name="company"
          autoComplete="organization"
          inputMode="text"
          placeholder="ex.: acme-industria"
          value={companySlug}
          onChange={(e) => setCompanySlug(e.target.value)}
          required
        />
        <p className="text-xs text-slate-500">
          Identificador único da empresa no SafeCheck (sem espaços).
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={emailId}>E-mail profissional</Label>
        <Input
          id={emailId}
          name="email"
          type="email"
          autoComplete="username"
          inputMode="email"
          placeholder="voce@empresa.com.br"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={passwordId}>Senha</Label>
        <Input
          id={passwordId}
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error ? (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
        >
          {error}
        </div>
      ) : null}

      <Button type="submit" disabled={submitting}>
        {submitting ? 'Entrando…' : 'Entrar'}
      </Button>
    </form>
  )
}
