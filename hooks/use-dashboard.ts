'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { api } from '@/lib/api/client'
import type { DashboardStats } from '@/lib/types'

const POLL_INTERVAL = 30_000 // 30 seconds

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    setError(null)
    try {
      const data = await api.get<DashboardStats>('/dashboard/stats')
      setStats(data)
    } catch (e: any) {
      setError(e.message)
    }
    if (!silent) setLoading(false)
  }, [])

  useEffect(() => {
    load()
    // Poll silently every 30 s — updates stats without showing spinner
    intervalRef.current = setInterval(() => load(true), POLL_INTERVAL)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [load])

  return { stats, loading, error, refresh: () => load() }
}