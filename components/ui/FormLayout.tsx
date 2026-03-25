'use client'

import { forwardRef, type TextareaHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

// ── FormTextarea ──────────────────────────────────────────────────────────

export interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  hint?: string
  hideLabel?: boolean
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(({
  label, error, hint, hideLabel = false, className, ...props
}, ref) => {
  return (
    <div className="mb-4">
      <label className={cn('block text-[13px] font-semibold text-slate-900 mb-1.5', hideLabel && 'sr-only')}>
        {label}
      </label>
      <textarea
        ref={ref}
        className={cn(
          'w-full px-3.5 py-2.5 border rounded-[10px] text-sm text-slate-900 bg-white outline-none transition-colors resize-y min-h-[80px]',
          'placeholder:text-slate-400',
          error ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-navy',
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
FormTextarea.displayName = 'FormTextarea'

// ── FormRow ───────────────────────────────────────────────────────────────

export interface FormRowProps {
  children: ReactNode
  /** Number of columns (default 2) */
  cols?: 2 | 3 | 4
  className?: string
}

export function FormRow({ children, cols = 2, className }: FormRowProps) {
  const gridCols: Record<number, string> = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }
  return (
    <div className={cn('grid gap-3.5 max-sm:grid-cols-1', gridCols[cols], className)}>
      {children}
    </div>
  )
}

// ── FormCard ──────────────────────────────────────────────────────────────

export interface FormCardProps {
  /** Section title displayed as uppercase label */
  title: string
  children: ReactNode
  className?: string
}

export function FormCard({ title, children, className }: FormCardProps) {
  return (
    <div className={cn('bg-white border border-slate-200 rounded-2xl p-7 mb-5', className)}>
      <h3 className="text-[11px] font-bold text-slate-400 tracking-[1.5px] uppercase mb-4">
        {title}
      </h3>
      {children}
    </div>
  )
}