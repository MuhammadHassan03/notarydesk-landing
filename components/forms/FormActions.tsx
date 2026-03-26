import { type ReactNode } from 'react'

/**
 * Sticky bottom action bar for form pages.
 * - On mobile: full-width stacked column (primary first), floats above the bottom nav
 * - On desktop: inline horizontal row
 */
export function FormActions({ children }: { children: ReactNode }) {
  return (
    <div
      className="sticky bottom-0 z-10 -mx-4 sm:mx-0 px-4 sm:px-0 pt-4 pb-6 sm:pb-8 mt-2"
      style={{
        background: 'var(--bg-page)',
        borderTop: '1px solid var(--border)',
      }}
    >
      <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
        {children}
      </div>
    </div>
  )
}
