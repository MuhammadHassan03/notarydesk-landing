'use client'

import { cn } from '@/lib/utils'

// ── PillSelector (for forms — single select) ─────────────────────────────

export interface PillOption {
  value: string
  label: string
  icon?: string
}

export interface PillSelectorProps {
  options: PillOption[]
  value: string
  onChange: (value: string) => void
  className?: string
}

export function PillSelector({ options, value, onChange, className }: PillSelectorProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {options.map(o => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className="px-4 py-2 rounded-full text-[13px] font-medium transition-all"
          style={{
            background: value === o.value ? 'var(--primary)' : 'var(--surface)',
            color: value === o.value ? '#fff' : 'var(--text-secondary)',
            border: `1px solid ${value === o.value ? 'var(--primary)' : 'var(--border)'}`,
          }}
        >
          {o.icon && <span className="mr-1.5">{o.icon}</span>}
          {o.label}
        </button>
      ))}
    </div>
  )
}

// ── FilterPills (for lists — with counts) ─────────────────────────────────

export interface FilterOption<T extends string = string> {
  key: T
  label: string
  count?: number
}

export interface FilterPillsProps<T extends string = string> {
  options: FilterOption<T>[]
  value: T
  onChange: (value: T) => void
  className?: string
}

export function FilterPills<T extends string>({
  options,
  value,
  onChange,
  className,
}: FilterPillsProps<T>) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {options.map(o => {
        const active = value === o.key
        return (
          <button
            key={o.key}
            onClick={() => onChange(o.key)}
            className="px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all"
            style={{
              background: active ? 'var(--primary)' : 'var(--surface)',
              color: active ? '#fff' : 'var(--text-secondary)',
              border: `1px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
            }}
          >
            {o.label}
            {o.count !== undefined && (
              <span className="ml-1.5 text-[11px]" style={{ opacity: active ? 0.7 : 0.6 }}>
                {o.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}