'use client'

import { Icon } from '@/components/ui/icons'

interface Props {
  content: string
  senderType: 'notary' | 'client'
  senderName: string
  timestamp: string
  isRead?: boolean
  attachmentUrl?: string | null
  attachmentName?: string | null
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

function isImageUrl(url: string): boolean {
  return /\.(jpg|jpeg|png|gif|webp|heic)(\?|$)/i.test(url)
}

function isSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' || parsed.protocol === 'http:'
  } catch {
    return false
  }
}

export function ChatBubble({ content, senderType, senderName, timestamp, isRead, attachmentUrl, attachmentName }: Props) {
  const isNotary = senderType === 'notary'

  return (
    <div className={`flex ${isNotary ? 'justify-end' : 'justify-start'} mb-3 group`}>
      <div className="max-w-[75%] transition-opacity group-hover:opacity-95">
        {/* Sender name */}
        <div className={`text-[10px] font-semibold mb-1 ${isNotary ? 'text-right' : 'text-left'}`}
          style={{ color: 'var(--text-tertiary)' }}>
          {senderName}
        </div>
        {/* Bubble */}
        <div className="px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed"
          style={{
            background: isNotary ? 'var(--primary)' : 'var(--surface)',
            color: isNotary ? '#fff' : 'var(--text)',
            borderBottomRightRadius: isNotary ? '4px' : '16px',
            borderBottomLeftRadius: isNotary ? '16px' : '4px',
            border: isNotary ? 'none' : '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)',
          }}>
          {content}
          {/* Attachment */}
          {attachmentUrl && isSafeUrl(attachmentUrl) && (
            <div className="mt-2">
              {isImageUrl(attachmentUrl) ? (
                <a href={attachmentUrl} target="_blank" rel="noopener noreferrer">
                  <img src={attachmentUrl} alt={attachmentName || 'Attachment'} loading="lazy"
                    className="rounded-lg max-w-full max-h-[200px] object-cover cursor-pointer" />
                </a>
              ) : (
                <a href={attachmentUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-medium no-underline transition-opacity hover:opacity-80"
                  style={{ background: isNotary ? 'rgba(255,255,255,0.15)' : 'var(--bg-page)', color: isNotary ? '#fff' : 'var(--primary)' }}>
                  <Icon name="attachment" size={14} style={{ color: 'inherit' }} />
                  {attachmentName || 'Attachment'}
                </a>
              )}
            </div>
          )}
        </div>
        {/* Time + read status */}
        <div className={`flex items-center gap-1 mt-0.5 text-[10px] ${isNotary ? 'justify-end' : 'justify-start'}`}
          style={{ color: 'var(--text-tertiary)' }}>
          {timeLabel(timestamp)}
          {isNotary && (
            <Icon
              name={isRead ? 'done_all' : 'check'}
              size={12}
              style={{ color: isRead ? 'var(--success)' : 'var(--text-tertiary)' }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
