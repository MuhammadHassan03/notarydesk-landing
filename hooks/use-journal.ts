'use client'

import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'

// ── Types ─────────────────────────────────────────────────────────────────

export interface JournalEntry {
  id: string
  user_id: string
  signing_date: string
  signer_name: string
  signer_address: string | null
  document_type: string | null
  id_type: string | null
  id_number: string | null
  fee: number
  notes: string | null
  is_finalized: boolean
  thumbprint_obtained: boolean | null
  venue_county: string | null
  entry_number: string | null
  created_at: string
  updated_at: string
}

export interface JournalEntryCreate {
  signing_date: string
  signer_name: string
  signer_address?: string
  document_type?: string
  id_type?: string
  id_number?: string
  fee?: number
  notes?: string
  is_finalized?: boolean
  thumbprint_obtained?: boolean
}

export interface JournalEntryUpdate {
  signing_date?: string
  signer_name?: string
  signer_address?: string
  document_type?: string
  id_type?: string
  id_number?: string
  fee?: number
  notes?: string
  is_finalized?: boolean
  thumbprint_obtained?: boolean
}

// ── Hooks ─────────────────────────────────────────────────────────────────

export function useJournalEntries() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get<JournalEntry[]>('/journal/')
      setEntries(Array.isArray(res) ? res : [])
    } catch (e: any) {
      setError(e.message)
    }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  return { entries, loading, error, refresh: load }
}

export function useJournalEntry(id: string | undefined) {
  const [entry, setEntry] = useState<JournalEntry | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    api.get<JournalEntry>(`/journal/${id}`)
      .then(setEntry)
      .catch(() => setEntry(null))
      .finally(() => setLoading(false))
  }, [id])

  return { entry, loading, setEntry }
}

export function useCreateJournalEntry() {
  const [loading, setLoading] = useState(false)

  const create = useCallback(async (input: JournalEntryCreate): Promise<JournalEntry> => {
    setLoading(true)
    try {
      return await api.post<JournalEntry>('/journal/', input)
    } finally {
      setLoading(false)
    }
  }, [])

  return { create, loading }
}

export function useUpdateJournalEntry() {
  const [loading, setLoading] = useState(false)

  const update = useCallback(async (id: string, input: JournalEntryUpdate): Promise<JournalEntry> => {
    setLoading(true)
    try {
      return await api.patch<JournalEntry>(`/journal/${id}`, input)
    } finally {
      setLoading(false)
    }
  }, [])

  return { update, loading }
}

export function useDeleteJournalEntry() {
  const [loading, setLoading] = useState(false)

  const remove = useCallback(async (id: string) => {
    setLoading(true)
    try {
      await api.delete(`/journal/${id}`)
    } finally {
      setLoading(false)
    }
  }, [])

  return { remove, loading }
}