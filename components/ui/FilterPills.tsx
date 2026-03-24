'use client'

import { cn } from '@/lib/cn'

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
          className={cn(
            'px-4 py-2 rounded-full text-[13px] font-medium border transition-all',
            value === o.value
              ? 'bg-navy border-navy text-white'
              : 'bg-transparent border-slate-200 text-slate-500 hover:border-navy hover:text-navy',
          )}
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
      {options.map(o => (
        <button
          key={o.key}
          onClick={() => onChange(o.key)}
          className={cn(
            'px-4 py-2 rounded-full text-[13px] font-medium border transition-all',
            value === o.key
              ? 'bg-navy border-navy text-white'
              : 'bg-transparent border-slate-200 text-slate-500 hover:border-navy hover:text-navy',
          )}
        >
          {o.label}
          {o.count !== undefined && (
            <span className={cn(
              'ml-1.5 text-[11px]',
              value === o.key ? 'text-white/70' : 'text-slate-400',
            )}>
              {o.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}