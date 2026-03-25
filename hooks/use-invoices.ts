'use client'

import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'
import type { Invoice, InvoiceStatus } from '@/lib/types'

export type { Invoice, InvoiceStatus }

export interface InvoiceCreate {
  client_name: string
  client_email?: string
  client_phone?: string
  service_description: string
  amount: number
  due_date?: string
  payment_method?: string
  notes?: string
}

// ── Hooks ─────────────────────────────────────────────────────────────────

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const res = await api.get<Invoice[]>('/invoices/')
      setInvoices(Array.isArray(res) ? res : [])
    } catch (e: any) { setError(e.message) }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])
  return { invoices, loading, error, refresh: load }
}

export function useInvoice(id: string | undefined) {
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    api.get<Invoice>(`/invoices/${id}`)
      .then(setInvoice)
      .catch(() => setInvoice(null))
      .finally(() => setLoading(false))
  }, [id])

  return { invoice, loading, setInvoice }
}

export function useCreateInvoice() {
  const [loading, setLoading] = useState(false)
  const create = useCallback(async (input: InvoiceCreate): Promise<Invoice> => {
    setLoading(true)
    try { return await api.post<Invoice>('/invoices/', input) }
    finally { setLoading(false) }
  }, [])
  return { create, loading }
}

export function useInvoiceActions() {
  const [loading, setLoading] = useState(false)

  const updateStatus = useCallback(async (id: string, status: InvoiceStatus): Promise<Invoice> => {
    setLoading(true)
    try { return await api.patch<Invoice>(`/invoices/${id}/status`, { status }) }
    finally { setLoading(false) }
  }, [])

  const updateFields = useCallback(async (id: string, data: Partial<InvoiceCreate>): Promise<Invoice> => {
    setLoading(true)
    try { return await api.patch<Invoice>(`/invoices/${id}`, data) }
    finally { setLoading(false) }
  }, [])

  const remove = useCallback(async (id: string) => {
    setLoading(true)
    try { await api.delete(`/invoices/${id}`) }
    finally { setLoading(false) }
  }, [])

  return { updateStatus, updateFields, remove, loading }
}