import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'ghost'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
}

const base =
  'inline-flex min-h-12 w-full items-center justify-center rounded-xl px-4 text-base font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50'

const variants: Record<Variant, string> = {
  primary:
    'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 focus-visible:outline-emerald-600 active:bg-emerald-800',
  ghost:
    'bg-transparent text-emerald-800 hover:bg-emerald-50 focus-visible:outline-emerald-600',
}

export function Button({ className = '', variant = 'primary', type = 'button', ...props }: Props) {
  return <button type={type} className={`${base} ${variants[variant]} ${className}`} {...props} />
}
