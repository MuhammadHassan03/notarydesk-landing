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

const STYLES: Record<ToastType, string> = {
  success: 'bg-emerald-900 text-white',
  error:   'bg-red-900 text-white',
  info:    'bg-navy text-white',
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
        STYLES[type],
      )}
      role="alert"
    >
      <span className="text-base">
        {type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}
      </span>
      {message}
    </div>
  )
}