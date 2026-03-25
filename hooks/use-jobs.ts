'use client'

import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'
import type { SigningJob, CreateJobInput, UpdateJobInput } from '@/lib/types'

// ── Pagination (signing-jobs API returns wrapped responses) ───────────────

interface Pagination {
  total: number
  page: number
  per_page: number
  has_more: boolean
}

interface WrappedResponse<T> {
  ok: boolean
  data: T
  meta: {
    pagination?: Pagination
    request_id: string
    timestamp: string
  }
}

// ── Hooks ─────────────────────────────────────────────────────────────────

export function useJobs() {
  const [jobs, setJobs] = useState<SigningJob[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async (params?: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get<WrappedResponse<SigningJob[]>>(
        `/signing-jobs/${params ? '?' + params : ''}`
      )
      // API returns { ok, data, meta } envelope
      if (res?.data && Array.isArray(res.data)) {
        setJobs(res.data)
        setPagination(res.meta?.pagination || null)
      } else if (Array.isArray(res)) {
        // Fallback if API returns raw array
        setJobs(res as any)
      } else {
        setJobs([])
      }
    } catch (e: any) {
      setError(e.message)
    }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  return { jobs, pagination, loading, error, refresh: load }
}

export function useJob(id: string | undefined) {
  const [job, setJob] = useState<SigningJob | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const res = await api.get<WrappedResponse<SigningJob> | SigningJob>(`/signing-jobs/${id}`)
      // Unwrap envelope if present
      const data = (res as any)?.ok !== undefined ? (res as WrappedResponse<SigningJob>).data : res
      setJob(data as SigningJob)
    } catch (e: any) {
      setError(e.message)
    }
    setLoading(false)
  }, [id])

  useEffect(() => { load() }, [load])

  return { job, loading, error, refresh: load }
}

export function useCreateJob() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const create = useCallback(async (input: CreateJobInput): Promise<SigningJob> => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.post<WrappedResponse<SigningJob> | SigningJob>('/signing-jobs/', input)
      const data = (res as any)?.ok !== undefined ? (res as WrappedResponse<SigningJob>).data : res
      return data as SigningJob
    } catch (e: any) {
      setError(e.message)
      throw e
    } finally {
      setLoading(false)
    }
  }, [])

  return { create, loading, error }
}

export function useUpdateJob() {
  const [loading, setLoading] = useState(false)

  const unwrap = (res: any): SigningJob => {
    return res?.ok !== undefined ? res.data : res
  }

  const update = useCallback(async (id: string, input: UpdateJobInput): Promise<SigningJob> => {
    setLoading(true)
    try {
      const res = await api.patch<any>(`/signing-jobs/${id}`, input)
      return unwrap(res)
    } finally { setLoading(false) }
  }, [])

  const advanceStatus = useCallback(async (id: string, status: string): Promise<SigningJob> => {
    const res = await api.patch<any>(`/signing-jobs/${id}/status`, { status })
    return unwrap(res)
  }, [])

  const markPaid = useCallback(async (id: string, method: string): Promise<SigningJob> => {
    const res = await api.patch<any>(`/signing-jobs/${id}/payment`, {
      payment_status: 'paid', payment_method: method,
    })
    return unwrap(res)
  }, [])

  const cancelJob = useCallback(async (id: string): Promise<SigningJob> => {
    const res = await api.patch<any>(`/signing-jobs/${id}/status`, { status: 'cancelled' })
    return unwrap(res)
  }, [])

  const deleteJob = useCallback(async (id: string) => {
    return api.delete(`/signing-jobs/${id}`)
  }, [])

  return { update, advanceStatus, markPaid, cancelJob, deleteJob, loading }
}