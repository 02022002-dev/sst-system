import type { InputHTMLAttributes } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement>

const base =
  'min-h-12 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-base text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/25'

export function Input({ className = '', ...props }: Props) {
  return <input className={`${base} ${className}`} {...props} />
}
