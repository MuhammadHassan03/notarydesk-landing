'use client'

import { useEffect } from 'react'
import { cn } from '@/lib/utils'

// ── Types ─────────────────────────────────────────────────────────────────

export type ToastType = 'success' | 'error' | 'info'

export interface ToastProps {
  message: string
  type?: ToastType
  visible: boolean
  onHide: () => void
  /** Auto-dismiss duration in ms (default 3000, 0 to disable) */
  duration?: number
}

// ── Component ─────────────────────────────────────────────────────────────

const STYLES: Record<ToastType, { bg: string; color: string }> = {
  success: { bg: 'var(--success, #16A34A)', color: '#fff' },
  error:   { bg: 'var(--danger, #EF4444)', color: '#fff' },
  info:    { bg: 'var(--primary, #1B3A5C)', color: '#fff' },
}

export default function Toast({
  message,
  type = 'success',
  visible,
  onHide,
  duration = 3000,
}: ToastProps) {
  useEffect(() => {
    if (!visible || duration === 0) return
    const timer = setTimeout(onHide, duration)
    return () => clearTimeout(timer)
  }, [visible, onHide, duration])

  if (!visible) return null

  return (
    <div
      className={cn(
        'fixed top-5 right-5 px-5 py-3.5 rounded-xl text-sm font-semibold z-[200] animate-slide-in',
        'flex items-center gap-2 max-w-[400px] shadow-lg',
      )}
      style={{ background: STYLES[type].bg, color: STYLES[type].color }}
      role="alert"
    >
      <span className="text-base">
        {type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}
      </span>
      {message}
    </div>
  )
}