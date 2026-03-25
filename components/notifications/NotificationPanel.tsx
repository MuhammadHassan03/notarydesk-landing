'use client'

import { useRouter } from 'next/navigation'
import { useNotifications, useMarkRead } from '@/hooks/use-notifications'
import { getNotificationConfig } from '@/lib/constants'
import { Icon } from '@/components/ui/icons'

function timeAgo(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diff = Math.floor((now - then) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return new Date(dateStr).toLocaleDateString()
}

interface Props {
  onClose: () => void
  onRead: () => void
}

export function NotificationPanel({ onClose, onRead }: Props) {
  const router = useRouter()
  const { notifications, loading } = useNotifications()
  const { markRead, markAllRead } = useMarkRead()

  const handleClick = async (n: typeof notifications[number]) => {
    if (!n.is_read) {
      await markRead(n.id)
      onRead()
    }
    if (n.link) router.push(n.link)
    onClose()
  }

  const handleMarkAll = async () => {
    await markAllRead()
    onRead()
  }

  return (
    <div className="absolute right-0 top-full mt-2 w-[360px] max-h-[480px] rounded-2xl shadow-lg overflow-hidden z-50"
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--divider)' }}>
        <span className="text-[14px] font-bold" style={{ color: 'var(--text)' }}>Notifications</span>
        <button onClick={handleMarkAll}
          className="text-[12px] font-semibold border-none bg-transparent cursor-pointer"
          style={{ color: 'var(--primary)' }}>
          Mark all read
        </button>
      </div>

      {/* List */}
      <div className="overflow-y-auto max-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="w-6 h-6 border-2 rounded-full animate-spin-slow" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--primary)' }} />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-10">
            <Icon name="notifications_none" size={32} style={{ color: 'var(--text-tertiary)', opacity: 0.3 }} />
            <div className="text-[13px] mt-2" style={{ color: 'var(--text-tertiary)' }}>No notifications yet</div>
          </div>
        ) : (
          notifications.map(n => {
            const config = getNotificationConfig(n.type)
            return (
              <button key={n.id} onClick={() => handleClick(n)}
                className="flex items-start gap-3 w-full px-4 py-3 border-none bg-transparent cursor-pointer text-left transition-colors"
                style={{ borderBottom: '1px solid var(--divider)', background: n.is_read ? 'transparent' : 'var(--surface)' }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: config.color + '12' }}>
                  <Icon name={config.icon as any} size={18} style={{ color: config.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-semibold truncate" style={{ color: 'var(--text)' }}>{n.title}</span>
                    {!n.is_read && (
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: 'var(--primary)' }} />
                    )}
                  </div>
                  {n.body && (
                    <div className="text-[12px] mt-0.5 truncate" style={{ color: 'var(--text-secondary)' }}>{n.body}</div>
                  )}
                  <div className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>{timeAgo(n.created_at)}</div>
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
