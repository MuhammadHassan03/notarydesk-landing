'use client'

import { forwardRef, type SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

// ── Types ─────────────────────────────────────────────────────────────────

export interface SelectOption {
  value: string
  label: string
}

export interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: SelectOption[]
  error?: string
  hint?: string
  /** Placeholder text shown as first disabled option */
  placeholder?: string
}

// ── Component ─────────────────────────────────────────────────────────────

const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(({
  label,
  options,
  error,
  hint,
  placeholder,
  className,
  ...props
}, ref) => {
  return (
    <div className="mb-4">
      <label className="block text-[13px] font-semibold text-slate-900 mb-1.5">{label}</label>
      <select
        ref={ref}
        className={cn(
          'w-full px-3.5 py-2.5 border rounded-[10px] text-sm text-slate-900 bg-white outline-none transition-colors appearance-none',
          'bg-[url("data:image/svg+xml,%3Csvg_xmlns=%27http://www.w3.org/2000/svg%27_width=%2712%27_height=%2712%27_viewBox=%270_0_24_24%27%3E%3Cpath_fill=%27%2364748B%27_d=%27M7_10l5_5_5-5z%27/%3E%3C/svg%3E")] bg-no-repeat bg-[position:right_12px_center] pr-8',
          error
            ? 'border-red-400 focus:border-red-500'
            : 'border-slate-200 focus:border-navy',
          className,
        )}
        aria-invalid={!!error}
        {...props}
      >
        <option value="">{placeholder || `Select ${label.toLowerCase()}`}</option>
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
      {hint && !error && <p className="text-slate-400 text-xs mt-1">{hint}</p>}
    </div>
  )
})

FormSelect.displayName = 'FormSelect'
export default FormSelect