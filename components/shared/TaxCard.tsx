'use client'

import { cn } from '@/lib/cn'

export interface TaxChip {
  label: string
  value: string
}

export interface TaxCardProps {
  /** Formatted savings amount (e.g. "$1,234.56") */
  savings: string
  /** Breakdown chips */
  chips: TaxChip[]
  /** Override year display */
  year?: number
  className?: string
}

export default function TaxCard({ savings, chips, year, className }: TaxCardProps) {
  const displayYear = year || new Date().getFullYear()

  return (
    <div className={cn(
      'bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-300 rounded-2xl p-6 mb-7',
      className,
    )}>
      <div className="text-sm text-emerald-700 font-medium">
        Estimated tax savings ({displayYear})
      </div>
      <div className="text-4xl font-extrabold text-emerald-900 -tracking-wider mt-1">
        {savings}
      </div>
      {chips.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-3.5">
          {chips.map(chip => (
            <span
              key={chip.label}
              className="bg-emerald-600/[0.08] px-3 py-1.5 rounded-full text-xs text-emerald-900 font-medium"
            >
              {chip.value} {chip.label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}