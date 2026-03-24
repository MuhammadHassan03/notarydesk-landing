'use client'

import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

// ── Types ─────────────────────────────────────────────────────────────────

export interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Field label displayed above the input */
  label: string
  /** Validation error message */
  error?: string
  /** Hint text below the input */
  hint?: string
  /** Hide the label visually (still accessible) */
  hideLabel?: boolean
}

// ── Component ─────────────────────────────────────────────────────────────

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(({
  label,
  error,
  hint,
  hideLabel = false,
  className,
  ...props
}, ref) => {
  return (
    <div className="mb-4">
      <label className={cn(
        'block text-[13px] font-semibold text-slate-900 mb-1.5',
        hideLabel && 'sr-only',
      )}>
        {label}
      </label>
      <input
        ref={ref}
        className={cn(
          'w-full px-3.5 py-2.5 border rounded-[10px] text-sm text-slate-900 bg-white outline-none transition-colors',
          'placeholder:text-slate-400',
          error
            ? 'border-red-400 focus:border-red-500'
            : 'border-slate-200 focus:border-navy',
          className,
        )}
        aria-invalid={!!error}
        {...props}
      />
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
      {hint && !error && <p className="text-slate-400 text-xs mt-1">{hint}</p>}
    </div>
  )
})

FormInput.displayName = 'FormInput'
export default FormInput