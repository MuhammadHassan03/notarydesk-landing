'use client'
import type { ReactNode } from 'react'

export function DetailRow({ label, value, color }: { label: string; value: string | ReactNode; color?: string }) {
  if (!value) return null
  return (
    <div className="flex items-center justify-between py-2.5" style={{ borderBottom: '1px solid var(--divider)' }}>
      <span className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <span className="text-[13px] font-semibold text-right" style={color ? { color } : { color: 'var(--text)' }}>{value}</span>
    </div>
  )
}
