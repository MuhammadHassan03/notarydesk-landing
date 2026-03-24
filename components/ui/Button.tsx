'use client'

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/cn'

export type ButtonVariant = 'primary' | 'gold' | 'danger' | 'outline' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  loading?: boolean
  href?: string
  icon?: ReactNode
  children: ReactNode
}

const BASE = 'inline-flex items-center justify-center gap-2 font-semibold rounded-[10px] transition-all duration-150 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed no-underline'

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs rounded-lg',
  md: 'h-10 px-5 text-sm',
  lg: 'h-12 px-7 text-base',
}

/* Variant styles use CSS vars so they auto-adapt to dark/light */
const VARIANT_STYLES: Record<ButtonVariant, React.CSSProperties> = {
  primary: { background: 'var(--primary)', color: 'var(--text-on-primary)' },
  gold:    { background: 'var(--accent)', color: 'var(--text-on-accent)' },
  danger:  { background: 'var(--danger)', color: '#fff' },
  outline: { background: 'transparent', color: 'var(--primary)', border: '1px solid var(--border)' },
  ghost:   { background: 'transparent', color: 'var(--text-secondary)' },
}

const VARIANT_HOVER: Record<ButtonVariant, React.CSSProperties> = {
  primary: { background: 'var(--primary-hover)' },
  gold:    { background: 'var(--accent-hover)' },
  danger:  { background: '#B91C1C' },
  outline: { borderColor: 'var(--primary)', background: 'var(--primary-light)' },
  ghost:   { background: 'var(--surface)', color: 'var(--text)' },
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary', size = 'md', fullWidth = false, loading = false,
  href, icon, children, className, disabled, style, ...props
}, ref) => {
  const classes = cn(BASE, SIZES[size], fullWidth && 'w-full', className)

  const content = (
    <>
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon}
      {loading ? 'Loading…' : children}
    </>
  )

  const mergedStyle = { ...VARIANT_STYLES[variant], ...style }

  if (href) return <Link href={href} className={classes} style={mergedStyle}>{content}</Link>

  return (
    <button
      ref={ref}
      className={classes}
      style={mergedStyle}
      disabled={disabled || loading}
      onMouseEnter={e => { if (!disabled) Object.assign(e.currentTarget.style, VARIANT_HOVER[variant]) }}
      onMouseLeave={e => { if (!disabled) Object.assign(e.currentTarget.style, VARIANT_STYLES[variant], style) }}
      {...props}
    >
      {content}
    </button>
  )
})

Button.displayName = 'Button'
export default Button