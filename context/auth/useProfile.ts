'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import type { Profile } from '@/lib/types'
import { useAuth } from './useAuth'
import { _cachedProfile, _setCachedProfile } from './AuthProvider'

export function useProfile() {
  const { isAuthenticated } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(_cachedProfile)
  const [loading, setLoading] = useState(!_cachedProfile)

  useEffect(() => {
    if (!isAuthenticated) return
    if (_cachedProfile) {
      setProfile(_cachedProfile)
      setLoading(false)
      return
    }

    let cancelled = false
    api.get<Profile>('/auth/me')
      .then(data => {
        if (cancelled) return
        _setCachedProfile(data)
        setProfile(data)
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [isAuthenticated])

  return { profile, loading }
}
