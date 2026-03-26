'use client'

import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

// ── StatCard ──────────────────────────────────────────────────────────────

export interface StatCardProps {
  /** Uppercase label */
  label: string
  /** Display value (pre-formatted) */
  value: string
  /** Optional value color override */
  color?: string
  /** Optional icon or trend indicator */
  icon?: ReactNode
  className?: string
}

export function StatCard({ label, value, color, icon, className }: StatCardProps) {
  return (
    <div className={cn('rounded-xl p-5', className)}
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] font-bold uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>{label}</span>
        {icon}
      </div>
      <div
        className="text-[28px] font-extrabold tracking-tight leading-none"
        style={{ color: color || 'var(--text)' }}
      >
        {value}
      </div>
    </div>
  )
}

// ── StatsGrid ─────────────────────────────────────────────────────────────

export interface StatsGridProps {
  children: ReactNode
  /** Number of columns on desktop (default 4) */
  cols?: 3 | 4 | 5
  className?: string
}

export function StatsGrid({ children, cols = 4, className }: StatsGridProps) {
  const colClass: Record<number, string> = {
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
  }
  return (
    <div className={cn(
      'grid gap-4 mb-7',
      colClass[cols],
      'max-lg:grid-cols-2 max-sm:grid-cols-1',
      className,
    )}>
      {children}
    </div>
  )
}