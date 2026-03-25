'use client'

import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'
import type { Client, CreateClientInput, UpdateClientInput } from '@/lib/types'

// ── Hooks ─────────────────────────────────────────────────────────────────

export function useClients() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get<any>('/clients/')
      const data = res?.data && Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : []
      setClients(data)
    } catch (e: any) {
      setError(e.message)
    }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  return { clients, loading, error, refresh: load }
}

export function useClient(id: string | undefined) {
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    api.get<any>(`/clients/${id}`)
      .then(res => {
        const data = res?.ok !== undefined ? res.data : res
        setClient(data)
      })
      .catch(() => setClient(null))
      .finally(() => setLoading(false))
  }, [id])

  return { client, loading, setClient }
}

export function useCreateClient() {
  const [loading, setLoading] = useState(false)

  const create = useCallback(async (input: CreateClientInput): Promise<Client> => {
    setLoading(true)
    try {
      const res = await api.post<any>('/clients/', input)
      return res?.ok !== undefined ? res.data : res
    } finally {
      setLoading(false)
    }
  }, [])

  return { create, loading }
}

export function useUpdateClient() {
  const [loading, setLoading] = useState(false)

  const update = useCallback(async (id: string, input: UpdateClientInput): Promise<Client> => {
    setLoading(true)
    try {
      const res = await api.patch<any>(`/clients/${id}`, input)
      return res?.ok !== undefined ? res.data : res
    } finally {
      setLoading(false)
    }
  }, [])

  return { update, loading }
}

export function useDeleteClient() {
  const [loading, setLoading] = useState(false)

  const remove = useCallback(async (id: string) => {
    setLoading(true)
    try {
      await api.delete(`/clients/${id}`)
    } finally {
      setLoading(false)
    }
  }, [])

  return { remove, loading }
}
