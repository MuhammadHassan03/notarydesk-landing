'use client'

import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface EmptyStateProps {
  /** Display icon (emoji or text) */
  icon: string
  title: string
  description: string
  /** Action button or link */
  action?: ReactNode
  className?: string
}

export default function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('text-center py-16 px-10', className)}>
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4 text-3xl">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-1.5">{title}</h3>
      <p className="text-sm text-slate-500 mb-5 max-w-sm mx-auto">{description}</p>
      {action}
    </div>
  )
}