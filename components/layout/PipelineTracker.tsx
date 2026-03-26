'use client'

import { cn } from '@/lib/utils'
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
    /* Horizontally scrollable on small screens */
    <div className="overflow-x-auto -mx-1 pb-1">
      <div className={cn('flex items-start justify-between px-1 min-w-[520px]', className)}>
        {pipeline.map((step, i) => {
          const isComplete = !isCancelled && i < currentIdx
          const isActive   = !isCancelled && i === currentIdx
          const conf = statusConfig[step] || { label: step, color: 'var(--text-secondary)', bg: 'var(--surface)' }

          const dotColor  = isCancelled ? 'var(--border)' : isComplete ? 'var(--success)' : isActive ? conf.color : 'var(--border)'
          const lineColor = isComplete  ? 'var(--success)' : 'var(--border)'

          return (
            <div key={step} className="flex flex-col items-center flex-1 relative">
              {/* Connector line */}
              {i > 0 && (
                <div className="absolute top-[11px] right-1/2 -left-1/2 h-0.5 rounded-sm"
                  style={{ background: lineColor, zIndex: 0 }} />
              )}

              {/* Dot */}
              <div
                className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[10px] relative z-[1] select-none"
                style={{
                  background: isComplete || isActive ? dotColor : 'transparent',
                  border: `2px solid ${dotColor}`,
                  color: isComplete ? '#fff' : 'transparent',
                }}
              >
                {isComplete && '✓'}
                {isActive && <span className="w-2 h-2 rounded-full bg-white" />}
              </div>

              {/* Label */}
              <span
                className="text-[9px] text-center mt-1.5 leading-tight max-w-[56px]"
                style={{
                  color: isActive ? conf.color : isComplete ? 'var(--success)' : 'var(--text-tertiary)',
                  fontWeight: isActive ? 700 : 400,
                }}
              >
                {conf.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}