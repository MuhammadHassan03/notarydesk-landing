'use client'

import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'

// ── Types ─────────────────────────────────────────────────────────────────

export interface MileageTrip {
  id: string
  user_id: string
  trip_date: string
  start_address: string
  end_address: string
  start_lat: number | null
  start_lng: number | null
  end_lat: number | null
  end_lng: number | null
  distance_miles: number
  irs_deduction: number
  irs_rate: number
  label: string | null
  duration_minutes: number | null
  created_at: string
  updated_at: string
}

export interface MileageTripCreate {
  trip_date: string
  start_address: string
  end_address: string
  distance_miles: number
  label?: string
  duration_minutes?: number
  start_lat?: number
  start_lng?: number
  end_lat?: number
  end_lng?: number
}

export interface MileageSummary {
  total_miles: number
  total_deduction: number
  irs_rate: number
}

// ── Hooks ─────────────────────────────────────────────────────────────────

export function useMileageTrips() {
  const [trips, setTrips] = useState<MileageTrip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const res = await api.get<MileageTrip[]>('/mileage/')
      setTrips(Array.isArray(res) ? res : [])
    } catch (e: any) { setError(e.message) }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])
  return { trips, loading, error, refresh: load }
}

export function useMileageSummary() {
  const [summary, setSummary] = useState<MileageSummary | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.get<MileageSummary>('/mileage/summary')
      setSummary(data)
    } catch { /* may 404 if no trips */ }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])
  return { summary, loading, refresh: load }
}

export function useMileageTrip(id: string | undefined) {
  const [trip, setTrip] = useState<MileageTrip | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    api.get<MileageTrip>(`/mileage/${id}`)
      .then(setTrip)
      .catch(() => setTrip(null))
      .finally(() => setLoading(false))
  }, [id])

  return { trip, loading, setTrip }
}

export function useCreateMileageTrip() {
  const [loading, setLoading] = useState(false)
  const create = useCallback(async (input: MileageTripCreate): Promise<MileageTrip> => {
    setLoading(true)
    try { return await api.post<MileageTrip>('/mileage/', input) }
    finally { setLoading(false) }
  }, [])
  return { create, loading }
}

export function useDeleteMileageTrip() {
  const [loading, setLoading] = useState(false)
  const remove = useCallback(async (id: string) => {
    setLoading(true)
    try { await api.delete(`/mileage/${id}`) }
    finally { setLoading(false) }
  }, [])
  return { remove, loading }
}