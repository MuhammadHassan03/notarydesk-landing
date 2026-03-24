'use client'
import { useState, useCallback } from 'react'
import { api } from '@/lib/api'
import type { Profile } from '@/lib/types'

export function useUpdateProfile() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateProfile = useCallback(async (data: Partial<Profile>): Promise<Profile> => {
    setLoading(true)
    setError(null)
    try {
      const result = await api.patch<Profile>('/auth/me', data)
      return result
    } catch (e: any) {
      setError(e.message)
      throw e
    } finally {
      setLoading(false)
    }
  }, [])

  return { updateProfile, loading, error }
}