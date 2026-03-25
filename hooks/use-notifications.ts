'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { api } from '@/lib/api/client'
import type { Notification } from '@/lib/types'

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      const res = await api.get<any>('/notifications/?limit=20')
      const data = res?.data && Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : []
      setNotifications(data)
    } catch {
      // notifications endpoint may not exist yet — fail silently
    }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  return { notifications, loading, refresh: load }
}

export function useUnreadCount() {
  const [count, setCount] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const load = useCallback(async () => {
    try {
      const res = await api.get<any>('/notifications/unread-count')
      const c = typeof res === 'number' ? res : res?.count ?? res?.data ?? 0
      setCount(c)
    } catch {
      // fail silently if endpoint doesn't exist yet
    }
  }, [])

  useEffect(() => {
    load()
    intervalRef.current = setInterval(load, 30000) // poll every 30s
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [load])

  return { count, refresh: load }
}

export function useMarkRead() {
  const markRead = useCallback(async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`, {})
    } catch {}
  }, [])

  const markAllRead = useCallback(async () => {
    try {
      await api.patch('/notifications/read-all', {})
    } catch {}
  }, [])

  return { markRead, markAllRead }
}
