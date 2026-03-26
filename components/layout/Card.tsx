'use client'

import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface CardProps {
  /** Uppercase section title */
  title?: string
  children: ReactNode
  /** Remove bottom margin */
  flush?: boolean
  className?: string
}

export default function Card({ title, children, flush = false, className }: CardProps) {
  return (
    <div
      className={cn('rounded-2xl p-4 sm:p-5', !flush && 'mb-4', className)}
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
    >
      {title && (
        <h3 className="text-[11px] font-bold tracking-[1.5px] uppercase mb-3"
          style={{ color: 'var(--text-tertiary)' }}>
          {title}
        </h3>
      )}
      {children}
    </div>
  )
}