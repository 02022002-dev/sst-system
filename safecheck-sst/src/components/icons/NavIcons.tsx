type IconProps = { className?: string }

const stroke = {
  fill: 'none' as const,
  stroke: 'currentColor' as const,
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function IconHome({ className }: IconProps) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" aria-hidden {...stroke}>
      <path d="M3 11 12 4l9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
    </svg>
  )
}

export function IconCamera({ className }: IconProps) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" aria-hidden {...stroke}>
      <rect x="3" y="7" width="18" height="12" rx="2.5" />
      <path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7" />
      <circle cx="12" cy="13" r="3.25" />
    </svg>
  )
}

export function IconVest({ className }: IconProps) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" aria-hidden {...stroke}>
      <path d="M8 4h8l2 4v14H6V8z" />
      <path d="M8 4c0 2 1.5 3.5 4 3.5S16 6 16 4" />
      <path d="M9 12h6" />
    </svg>
  )
}

export function IconBook({ className }: IconProps) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" aria-hidden {...stroke}>
      <path d="M6 4h9a2 2 0 0 1 2 2v14l-6-3-6 3V6a2 2 0 0 1 2-2z" />
      <path d="M6 8h11" />
    </svg>
  )
}

export function IconChecklist({ className }: IconProps) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" aria-hidden {...stroke}>
      <path d="M9 6h12" />
      <path d="M9 12h12" />
      <path d="M9 18h12" />
      <path d="M3.5 6.5 4.8 8 7 5.5" />
      <path d="M3.5 12.5 4.8 14 7 11.5" />
      <path d="M3.5 18.5 4.8 20 7 17.5" />
    </svg>
  )
}
