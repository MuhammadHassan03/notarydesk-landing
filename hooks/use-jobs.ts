'use client'
import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'
import type { SigningJob, CreateJobInput, UpdateJobInput, Pagination } from '@/lib/types'

export function useJobs() {
  const [jobs, setJobs] = useState<SigningJob[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async (params?: string) => {
    setLoading(true)
    setError(null)
    try {
      const result = await api.list<SigningJob>(`/signing-jobs/${params ? '?' + params : ''}`)
      setJobs(result.data)
      setPagination(result.pagination)
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
      const data = await api.get<SigningJob>(`/signing-jobs/${id}`)
      setJob(data)
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
      const data = await api.post<SigningJob>('/signing-jobs/', input)
      return data
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

  const update = useCallback(async (id: string, input: UpdateJobInput): Promise<SigningJob> => {
    setLoading(true)
    try {
      const data = await api.patch<SigningJob>(`/signing-jobs/${id}`, input)
      return data
    } finally {
      setLoading(false)
    }
  }, [])

  const advanceStatus = useCallback(async (id: string, status: string) => {
    return api.patch<SigningJob>(`/signing-jobs/${id}/status`, { status })
  }, [])

  const markPaid = useCallback(async (id: string, method: string) => {
    return api.patch<SigningJob>(`/signing-jobs/${id}/payment`, {
      payment_status: 'paid', payment_method: method,
    })
  }, [])

  const deleteJob = useCallback(async (id: string) => {
    return api.delete(`/signing-jobs/${id}`)
  }, [])

  return { update, advanceStatus, markPaid, deleteJob, loading }
}