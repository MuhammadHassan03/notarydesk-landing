'use client'

import { Icon } from '@/components/ui/icons'

interface Props {
  content: string
  senderType: 'notary' | 'client'
  senderName: string
  timestamp: string
  isRead?: boolean
}

function timeLabel(dateStr: string): string {
  const d = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffDays = Math.floor(diffMs / 86400000)

  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

  if (diffDays === 0) return time
  if (diffDays === 1) return `Yesterday ${time}`
  if (diffDays < 7) return `${d.toLocaleDateString('en-US', { weekday: 'short' })} ${time}`
  return `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ${time}`
}

export function ChatBubble({ content, senderType, senderName, timestamp, isRead }: Props) {
  const isNotary = senderType === 'notary'

  return (
    <div className={`flex ${isNotary ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className="max-w-[70%]">
        {/* Sender name */}
        <div className={`text-[10px] font-semibold mb-1 ${isNotary ? 'text-right' : 'text-left'}`}
          style={{ color: 'var(--text-tertiary)' }}>
          {senderName}
        </div>
        {/* Bubble */}
        <div className="px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed"
          style={{
            background: isNotary ? 'var(--primary)' : 'var(--surface)',
            color: isNotary ? '#fff' : 'var(--text)',
            borderBottomRightRadius: isNotary ? '4px' : '16px',
            borderBottomLeftRadius: isNotary ? '16px' : '4px',
            border: isNotary ? 'none' : '1px solid var(--border)',
          }}>
          {content}
        </div>
        {/* Time + read status */}
        <div className={`flex items-center gap-1 mt-0.5 text-[10px] ${isNotary ? 'justify-end' : 'justify-start'}`}
          style={{ color: 'var(--text-tertiary)' }}>
          {timeLabel(timestamp)}
          {isNotary && isRead && <Icon name="done_all" size={12} style={{ color: 'var(--success)' }} />}
        </div>
      </div>
    </div>
  )
}
