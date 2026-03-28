'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { api } from '@/lib/api'
import { useDeleteExpense } from '@/hooks/use-expenses'
import { EXPENSE_CATEGORIES, PAYMENT_METHODS, getCategoryByKey } from '@/lib/constants/expenses'
import { currency, formatDate, todayISO } from '@/lib/utils'
import type { Expense } from '@/hooks/use-expenses'
import { Icon } from '@/components/ui/icons'
import { Button, Toast } from '@/components/ui'
import { PageHeader } from '@/components/layout'
import { FormSection } from '@/components/forms/FormSection'
import { FormField } from '@/components/forms/FormField'
import { IconInput } from '@/components/forms/IconInput'
import { IconSelect } from '@/components/forms/IconSelect'
import { Checkbox } from '@/components/ui/Checkbox'
import { FormActions } from '@/components/forms/FormActions'

export default function ExpenseDetailPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const id = params.id

  const [expense, setExpense]     = useState<Expense | null>(null)
  const [loading, setLoading]     = useState(true)
  const [editing, setEditing]     = useState(false)
  const [saving, setSaving]       = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [toast, setToast]         = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const { remove, loading: deleting } = useDeleteExpense()

  // ── Edit form state ─────────────────────────────────────────────────
  const [category, setCategory]       = useState('')
  const [description, setDescription] = useState('')
  const [amount, setAmount]           = useState('')
  const [vendor, setVendor]           = useState('')
  const [expDate, setExpDate]         = useState('')
  const [payMethod, setPayMethod]     = useState('')
  const [deductible, setDeductible]   = useState(true)
  const [notes, setNotes]             = useState('')

  // ── Load expense ────────────────────────────────────────────────────
  const loadExpense = useCallback(() => {
    if (!id) return
    setLoading(true)
    api.get<Expense>(`/expenses/${id}`)
      .then(data => {
        setExpense(data)
        setCategory(data.category)
        setDescription(data.description)
        setAmount(String(data.amount))
        setVendor(data.vendor || '')
        setExpDate(data.expense_date)
        setPayMethod(data.payment_method || '')
        setDeductible(data.is_deductible)
        setNotes(data.notes || '')
      })
      .catch(() => setExpense(null))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => { loadExpense() }, [loadExpense])

  // ── Save edits ──────────────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    if (!id) return
    const parsed = parseFloat(amount)
    if (!description.trim() || !parsed || parsed <= 0) {
      setToast({ msg: 'Description and valid amount required.', type: 'error' }); return
    }
    setSaving(true)
    try {
      const cat = getCategoryByKey(category)
      const updated = await api.patch<Expense>(`/expenses/${id}`, {
        category,
        description: description.trim(),
        amount: parsed,
        expense_date: expDate,
        vendor: vendor.trim() || null,
        payment_method: payMethod || null,
        is_deductible: deductible,
        tax_category: cat.taxLine || null,
        notes: notes.trim() || null,
      })
      setExpense(updated)
      setEditing(false)
      setToast({ msg: 'Expense updated!', type: 'success' })
    } catch (e: any) {
      setToast({ msg: e.message || 'Failed to update.', type: 'error' })
    }
    setSaving(false)
  }, [id, category, description, amount, expDate, vendor, payMethod, deductible, notes])

  // ── Delete ──────────────────────────────────────────────────────────
  const handleDelete = useCallback(async () => {
    if (!id) return
    try {
      await remove(id)
      setToast({ msg: 'Expense deleted.', type: 'success' })
      setTimeout(() => router.push('/dashboard/expenses'), 400)
    } catch (e: any) { setToast({ msg: e.message, type: 'error' }) }
  }, [id, remove, router])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="w-9 h-9 border-[3px] rounded-full animate-spin-slow" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--primary)' }} />
        <span className="text-[13px]" style={{ color: 'var(--text-tertiary)' }}>Loading expense…</span>
      </div>
    )
  }

  if (!expense) {
    return (
      <div className="text-center py-20">
        <div className="text-[15px] font-bold mb-2" style={{ color: 'var(--text)' }}>Expense not found</div>
        <Button variant="outline" href="/dashboard/expenses"><Icon name="arrow_back" size={16} style={{ color: 'inherit' }} /> Back to expenses</Button>
      </div>
    )
  }

  const cat = getCategoryByKey(expense.category)

  // ═══════════════════════════════════════════════════════════════════
  // VIEW MODE
  // ═══════════════════════════════════════════════════════════════════

  if (!editing) {
    return (
      <div className="max-w-[720px]">
        <PageHeader title={expense.description} subtitle={`${cat.label} · ${formatDate(expense.expense_date)}`}
          action={
            <div className="flex gap-2">
              <Button variant="outline" href="/dashboard/expenses"><Icon name="arrow_back" size={16} style={{ color: 'inherit' }} /> Back</Button>
              <Button variant="primary" onClick={() => setEditing(true)}><Icon name="edit_note" size={16} style={{ color: 'inherit' }} /> Edit</Button>
              <Button variant="danger" size="sm" onClick={() => setShowDelete(true)}><Icon name="close" size={14} style={{ color: 'inherit' }} /></Button>
            </div>
          } />

        {/* Detail card */}
        <div className="rounded-2xl p-6" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          {/* Category badge */}
          <div className="flex items-center gap-3 mb-5 pb-4" style={{ borderBottom: '1px solid var(--divider)' }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: cat.color + '15' }}>
              <Icon name={cat.icon} size={22} style={{ color: cat.color }} />
            </div>
            <div>
              <span className="text-[12px] px-2 py-0.5 rounded font-bold" style={{ background: cat.color + '15', color: cat.color }}>{cat.label}</span>
              {expense.is_deductible && (
                <span className="text-[11px] ml-2 px-2 py-0.5 rounded font-medium" style={{ background: 'var(--accent-pale)', color: 'var(--accent)' }}>
                  Tax deductible
                </span>
              )}
            </div>
          </div>

          {/* Amount hero */}
          <div className="text-[32px] font-extrabold mb-5" style={{ color: 'var(--text)' }}>{currency(expense.amount)}</div>

          {/* Detail rows */}
          <div className="space-y-0">
            <DetailRow label="Date" value={formatDate(expense.expense_date)} />
            {expense.vendor && <DetailRow label="Vendor" value={expense.vendor} />}
            {expense.payment_method && <DetailRow label="Payment" value={expense.payment_method} />}
            {cat.taxLine && <DetailRow label="IRS Line" value={cat.taxLine} />}
            {expense.notes && <DetailRow label="Notes" value={expense.notes} />}
            <DetailRow label="Created" value={formatDate(expense.created_at?.split('T')[0])} />
          </div>

          {/* Receipt */}
          <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--divider)' }}>
            <div className="text-[12px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-tertiary)' }}>Receipt</div>
            {expense.receipt_url ? (
              <a href={expense.receipt_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-[13px] font-medium no-underline transition-opacity hover:opacity-80"
                style={{ background: 'var(--surface)', color: 'var(--primary)', border: '1px solid var(--border)' }}>
                <Icon name="receipt_long" size={16} style={{ color: 'var(--primary)' }} />
                View receipt
                <Icon name="open_in_new" size={13} style={{ color: 'var(--text-tertiary)', marginLeft: 'auto' }} />
              </a>
            ) : (
              <label className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-[13px] font-medium cursor-pointer transition-opacity hover:opacity-80"
                style={{ background: 'var(--surface)', color: 'var(--text-secondary)', border: '1px dashed var(--border)' }}>
                <Icon name="upload_file" size={16} style={{ color: 'var(--text-tertiary)' }} />
                Upload receipt
                <input type="file" className="hidden" accept="image/*,.pdf"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    if (file.size > 10 * 1024 * 1024) { setToast({ msg: 'File must be under 10 MB.', type: 'error' }); return }
                    const form = new FormData()
                    form.append('file', file)
                    try {
                      const res = await api.post<{ url: string }>('/expenses/upload-receipt', form, { headers: { 'Content-Type': 'multipart/form-data' } })
                      await api.patch(`/expenses/${expense.id}`, { receipt_url: res.url })
                      setToast({ msg: 'Receipt uploaded!', type: 'success' })
                      loadExpense()
                    } catch (err: any) { setToast({ msg: err.message || 'Upload failed.', type: 'error' }) }
                  }} />
              </label>
            )}
          </div>
        </div>

        {/* Delete confirmation */}
        {showDelete && (
          <div className="rounded-xl p-4 mt-4 flex items-center justify-between" style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger)' }}>
            <span className="text-[13px] font-medium" style={{ color: 'var(--danger)' }}>Permanently delete this expense?</span>
            <div className="flex gap-2">
              <Button variant="danger" size="sm" onClick={handleDelete} loading={deleting}>Yes, delete</Button>
              <Button variant="ghost" size="sm" onClick={() => setShowDelete(false)}>Cancel</Button>
            </div>
          </div>
        )}

        {toast && <Toast message={toast.msg} type={toast.type} visible={!!toast} onHide={() => setToast(null)} />}
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════════════
  // EDIT MODE
  // ═══════════════════════════════════════════════════════════════════

  return (
    <div className="max-w-[720px]">
      <PageHeader title="Edit expense" subtitle={expense.description}
        action={
          <Button variant="outline" onClick={() => setEditing(false)}>
            <Icon name="close" size={16} style={{ color: 'inherit' }} /> Cancel edit
          </Button>
        } />

      <FormSection title="Category">
        <div className="flex flex-wrap gap-2">
          {EXPENSE_CATEGORIES.map(c => {
            const active = category === c.key
            return (
              <button key={c.key} type="button" onClick={() => setCategory(c.key)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-semibold border-none cursor-pointer transition-all"
                style={{ background: active ? c.color : 'var(--surface)', color: active ? '#fff' : 'var(--text-secondary)', border: active ? 'none' : '1px solid var(--border)' }}>
                <Icon name={c.icon} size={14} /> {c.label}
              </button>
            )
          })}
        </div>
      </FormSection>

      <FormSection title="Details">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <FormField label="Description" required>
            <IconInput value={description} onChange={e => setDescription(e.target.value)} />
          </FormField>
          <FormField label="Amount" required>
            <IconInput type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} />
          </FormField>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4">
          <FormField label="Date">
            <IconInput type="date" value={expDate} onChange={e => setExpDate(e.target.value)} />
          </FormField>
          <FormField label="Vendor">
            <IconInput value={vendor} onChange={e => setVendor(e.target.value)} />
          </FormField>
          <FormField label="Payment">
            <IconSelect value={payMethod} onChange={e => setPayMethod(e.target.value)} options={PAYMENT_METHODS} />
          </FormField>
        </div>
      </FormSection>

      <FormSection title="Tax">
        <Checkbox checked={deductible} onChange={setDeductible} label="Tax deductible" />
      </FormSection>

      <FormSection title="Notes">
        <textarea className="input-base resize-y min-h-[80px]" rows={3} value={notes} onChange={e => setNotes(e.target.value)} />
      </FormSection>

      <FormActions>
        <Button variant="gold" onClick={handleSave} loading={saving} fullWidth size="lg">
          <Icon name="check" size={16} style={{ color: 'inherit' }} /> Save changes
        </Button>
        <Button variant="outline" onClick={() => setEditing(false)} size="lg">Cancel</Button>
      </FormActions>

      {toast && <Toast message={toast.msg} type={toast.type} visible={!!toast} onHide={() => setToast(null)} />}
    </div>
  )
}

// ── Detail row helper ─────────────────────────────────────────────────────

function DetailRow({ icon, label, value }: { icon?: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-3" style={{ borderBottom: '1px solid var(--divider)' }}>
      {icon && <Icon name={icon} size={16} style={{ color: 'var(--text-tertiary)' }} />}
      <span className="text-[13px] flex-1" style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <span className="text-[13px] font-semibold text-right" style={{ color: 'var(--text)' }}>{value}</span>
    </div>
  )
}