'use client'
import type { ReactNode } from 'react'

export function FormRow({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">{children}</div>
}
