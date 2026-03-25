'use client'
import type { ReactNode } from 'react'

export function FormCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <div className="text-[14px] font-bold mb-4" style={{ color: 'var(--text)' }}>{title}</div>
      {children}
    </div>
  )
}
