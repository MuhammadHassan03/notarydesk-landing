'use client'

import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface PageHeaderProps {
  title: string
  subtitle?: string
  /** Right-side action slot (button, link, etc.) */
  action?: ReactNode
  className?: string
}

export default function PageHeader({ title, subtitle, action, className }: PageHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between mb-6 gap-3 flex-wrap', className)}>
      <div className="min-w-0">
        <h1 className="text-[22px] font-extrabold tracking-tight truncate" style={{ color: 'var(--text)' }}>{title}</h1>
        {subtitle && <p className="text-[13px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}