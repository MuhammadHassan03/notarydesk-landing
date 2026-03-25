'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { api } from '@/lib/api'
import type { SigningJob } from '@/lib/types'

export interface CalendarEvent {
  id: string
  title: string
  date: string       // YYYY-MM-DD
  time: string | null // HH:MM
  status: string
  paymentStatus: string
  fee: number
  jobType: string
}

export function useCalendarEvents(year: number, month: number) {
  const [jobs, setJobs] = useState<SigningJob[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get<any>('/signing-jobs/')
      const data = res?.data && Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : []
      setJobs(data)
    } catch {
      setJobs([])
    }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const events: CalendarEvent[] = useMemo(() => {
    return jobs
      .filter(j => j.scheduled_date)
      .map(j => ({
        id: j.id,
        title: j.signer_name || j.client_name,
        date: j.scheduled_date!,
        time: j.scheduled_time,
        status: j.status,
        paymentStatus: j.payment_status,
        fee: j.fee + (j.travel_fee || 0),
        jobType: j.job_type,
      }))
  }, [jobs])

  // Filter events for the current month view
  const monthEvents = useMemo(() => {
    const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`
    return events.filter(e => e.date.startsWith(monthStr))
  }, [events, year, month])

  return { events: monthEvents, allEvents: events, loading, refresh: load }
}
