'use client'

import { Icon } from '@/components/ui/icons'
import { Button } from '@/components/ui'

interface ErrorBannerProps {
  message?: string
  onRetry?: () => void
}

export function ErrorBanner({ message = 'Something went wrong. Please try again.', onRetry }: ErrorBannerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: 'var(--danger-light, rgba(239,68,68,0.1))' }}>
        <Icon name="error_outline" size={28} style={{ color: 'var(--danger, #EF4444)' }} />
      </div>
      <div className="text-[15px] font-bold mb-1" style={{ color: 'var(--text)' }}>
        Failed to load data
      </div>
      <div className="text-[13px] mb-4 max-w-xs" style={{ color: 'var(--text-secondary)' }}>
        {message}
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <Icon name="refresh" size={15} style={{ color: 'inherit' }} /> Try again
        </Button>
      )}
    </div>
  )
}
