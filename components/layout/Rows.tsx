'use client'

import { type ReactNode } from 'react'

// ── DetailRow (for job/invoice detail pages) ──────────────────────────────

export interface DetailRowProps {
  label: string
  value: string | ReactNode | null | undefined
  /** Override value color */
  color?: string
}

export function DetailRow({ label, value, color }: DetailRowProps) {
  if (!value) return null
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-slate-100 last:border-b-0">
      <span className="text-[13px] text-slate-500 flex-1">{label}</span>
      <span className="text-[13px] font-semibold text-slate-900" style={color ? { color } : undefined}>
        {value}
      </span>
    </div>
  )
}

// ── SettingsRow (for settings/preferences pages) ──────────────────────────

export interface SettingsRowProps {
  label: string
  description?: string
  /** Display value on the right */
  value?: string
  /** Action element (button, toggle, etc.) */
  action?: ReactNode
}

export function SettingsRow({ label, description, value, action }: SettingsRowProps) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-slate-100 last:border-b-0 gap-4">
      <div className="flex-1">
        <div className="text-sm font-semibold text-slate-900">{label}</div>
        {description && <div className="text-xs text-slate-500 mt-0.5">{description}</div>}
      </div>
      {value && <div className="text-sm text-slate-500 text-right">{value}</div>}
      {action}
    </div>
  )
}