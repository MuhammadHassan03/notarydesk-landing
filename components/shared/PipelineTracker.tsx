'use client'

import { cn } from '@/lib/cn'
import type { BadgeConfig } from '@/components/ui/Badge'

// ── Types ─────────────────────────────────────────────────────────────────

export interface PipelineTrackerProps {
  /** Ordered list of status keys in the pipeline */
  pipeline: string[]
  /** Current active status */
  current: string
  /** Config map for each status → { label, color, bg } */
  statusConfig: Record<string, BadgeConfig>
  className?: string
}

// ── Component ─────────────────────────────────────────────────────────────

export default function PipelineTracker({
  pipeline,
  current,
  statusConfig,
  className,
}: PipelineTrackerProps) {
  const currentIdx = pipeline.indexOf(current)
  const isCancelled = current === 'cancelled'

  return (
    <div className={cn('flex items-start justify-between px-1', className)}>
      {pipeline.map((step, i) => {
        const isComplete = !isCancelled && i < currentIdx
        const isActive = !isCancelled && i === currentIdx
        const conf = statusConfig[step] || { label: step, color: '#64748B', bg: '#F1F5F9' }

        const dotColor = isCancelled
          ? '#E2E8F0'
          : isComplete
            ? '#16A34A'
            : isActive
              ? conf.color
              : '#E2E8F0'

        const lineColor = isComplete ? '#16A34A' : '#E2E8F0'

        return (
          <div key={step} className="flex flex-col items-center flex-1 relative">
            {/* Connector line */}
            {i > 0 && (
              <div
                className="absolute top-[11px] right-1/2 -left-1/2 h-0.5 rounded-sm"
                style={{ background: lineColor, zIndex: 0 }}
              />
            )}

            {/* Dot */}
            <div
              className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[10px] relative z-[1]"
              style={{
                background: isComplete || isActive ? dotColor : 'transparent',
                border: `2px solid ${dotColor}`,
                color: isComplete ? '#fff' : 'transparent',
              }}
            >
              {isComplete && '✓'}
              {isActive && (
                <span className="w-2 h-2 rounded-full bg-white" />
              )}
            </div>

            {/* Label */}
            <span
              className="text-[10px] text-center mt-1.5 leading-tight max-w-[70px]"
              style={{
                color: isActive ? conf.color : isComplete ? '#16A34A' : '#94A3B8',
                fontWeight: isActive ? 700 : 400,
              }}
            >
              {conf.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}