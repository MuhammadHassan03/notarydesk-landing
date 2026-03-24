'use client'

import { type ReactNode } from 'react'
import { cn } from '@/lib/cn'

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
    <div className={cn(
      'bg-white border border-slate-200 rounded-2xl p-5',
      !flush && 'mb-5',
      className,
    )}>
      {title && (
        <h3 className="text-[11px] font-bold text-slate-400 tracking-[1.5px] uppercase mb-3">
          {title}
        </h3>
      )}
      {children}
    </div>
  )
}