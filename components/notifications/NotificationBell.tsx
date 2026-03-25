'use client'

import { useState, useRef, useEffect } from 'react'
import { useUnreadCount } from '@/hooks/use-notifications'
import { Icon } from '@/components/ui/icons'
import { NotificationPanel } from './NotificationPanel'

export function NotificationBell() {
  const { count, refresh } = useUnreadCount()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-xl flex items-center justify-center border-none cursor-pointer transition-all relative"
        style={{ background: open ? 'var(--surface)' : 'transparent', color: 'var(--text-secondary)' }}
      >
        <Icon name="notifications" size={22} style={{ color: 'inherit' }} />
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-bold px-1"
            style={{ background: 'var(--danger)', color: '#fff' }}>
            {count > 99 ? '99+' : count}
          </span>
        )}
      </button>

      {open && (
        <NotificationPanel
          onClose={() => setOpen(false)}
          onRead={() => refresh()}
        />
      )}
    </div>
  )
}
