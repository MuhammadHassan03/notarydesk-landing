'use client'

import { type ReactNode } from 'react'
import { Icon } from '@/components/ui/icons'

// ── DetailRow (for job/invoice/mileage detail pages) ──────────────────────

export interface DetailRowProps {
  label: string
  value: string | ReactNode | null | undefined
  /** Optional icon */
  icon?: string
  /** Override value color */
  color?: string
}

export function DetailRow({ label, value, icon, color }: DetailRowProps) {
  if (!value) return null
  return (
    <div className="flex items-center gap-3 py-2.5 last:border-b-0"
      style={{ borderBottom: '1px solid var(--divider)' }}>
      {icon && <Icon name={icon as any} size={15} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />}
      <span className="text-[13px] flex-1" style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <span className="text-[13px] font-semibold text-right" style={{ color: color || 'var(--text)' }}>
        {value}
      </span>
    </div>
  )
}

// ── SettingsRow (for settings/preferences pages) ──────────────────────────

export interface SettingsRowProps {
  label: string
  description?: string
  value?: string
  action?: ReactNode
}

export function SettingsRow({ label, description, value, action }: SettingsRowProps) {
  return (
    <div className="flex items-center justify-between py-4 gap-4 last:border-b-0"
      style={{ borderBottom: '1px solid var(--divider)' }}>
      <div className="flex-1">
        <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{label}</div>
        {description && <div className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{description}</div>}
      </div>
      {value && <div className="text-sm text-right" style={{ color: 'var(--text-secondary)' }}>{value}</div>}
      {action}
    </div>
  )
}
