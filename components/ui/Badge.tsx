'use client'

import { cn } from '@/lib/utils'

// ── Types ─────────────────────────────────────────────────────────────────

export interface BadgeConfig {
  label: string
  color: string
  bg: string
}

export interface BadgeProps {
  /** Display label */
  label: string
  /** Text color (hex) */
  color: string
  /** Background color (hex) */
  bg: string
  /** Optional dot indicator before label */
  dot?: boolean
  /** Additional classes */
  className?: string
}

export interface StatusBadgeProps {
  /** Status key to look up in config */
  status: string
  /** Config map: status → { label, color, bg } */
  config: Record<string, BadgeConfig>
  /** Show a colored dot before label */
  dot?: boolean
  className?: string
}

// ── Components ────────────────────────────────────────────────────────────

export function Badge({ label, color, bg, dot = false, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold whitespace-nowrap leading-none',
        className,
      )}
      style={{ color, background: bg }}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      )}
      {label}
    </span>
  )
}

export function StatusBadge({ status, config, dot, className }: StatusBadgeProps) {
  const c = config[status] || { label: status, color: '#64748B', bg: '#F1F5F9' }
  return <Badge label={c.label} color={c.color} bg={c.bg} dot={dot} className={className} />
}