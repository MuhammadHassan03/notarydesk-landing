'use client'
import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api/client'
import type { DashboardStats } from '@/lib/types'

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.get<DashboardStats>('/dashboard/stats')
      setStats(data)
    } catch (e: any) {
      setError(e.message)
    }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  return { stats, loading, error, refresh: load }
}