'use client'

import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'

// ── Types ─────────────────────────────────────────────────────────────────

export interface Expense {
  id: string
  user_id: string
  expense_date: string
  category: string
  description: string
  amount: number
  vendor?: string
  payment_method?: string
  is_deductible: boolean
  receipt_url?: string
  receipt_path?: string
  tax_category?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface ExpenseCreate {
  expense_date: string
  category: string
  description: string
  amount: number
  vendor?: string
  payment_method?: string
  is_deductible?: boolean
  receipt_url?: string
  receipt_path?: string
  tax_category?: string
  notes?: string
}

export interface ExpenseSummary {
  categories: { category: string; total: number; count: number }[]
  grand_total: number
  deductible_total: number
  expense_count: number
}

// ── Hooks ─────────────────────────────────────────────────────────────────

export function useExpenses(category?: string) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ limit: '200' })
      if (category) params.set('category', category)
      const res = await api.get<{ data: Expense[] } | Expense[]>(`/expenses/?${params}`)
      // API may return { data: [...] } or raw array
      setExpenses(Array.isArray(res) ? res : res.data ?? [])
    } catch (e: any) {
      setError(e.message)
    }
    setLoading(false)
  }, [category])

  useEffect(() => { load() }, [load])

  return { expenses, loading, error, refresh: load }
}

export function useExpenseSummary(year?: number) {
  const [summary, setSummary] = useState<ExpenseSummary | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const url = year ? `/expenses/summary?year=${year}` : '/expenses/summary'
      const data = await api.get<ExpenseSummary>(url)
      setSummary(data)
    } catch { /* summary may 404 if no expenses */ }
    setLoading(false)
  }, [year])

  useEffect(() => { load() }, [load])

  return { summary, loading, refresh: load }
}

export function useCreateExpense() {
  const [loading, setLoading] = useState(false)

  const create = useCallback(async (input: ExpenseCreate): Promise<Expense> => {
    setLoading(true)
    try {
      const data = await api.post<Expense>('/expenses/', input)
      return data
    } finally {
      setLoading(false)
    }
  }, [])

  return { create, loading }
}

export function useDeleteExpense() {
  const [loading, setLoading] = useState(false)

  const remove = useCallback(async (id: string) => {
    setLoading(true)
    try {
      await api.delete(`/expenses/${id}`)
    } finally {
      setLoading(false)
    }
  }, [])

  return { remove, loading }
}