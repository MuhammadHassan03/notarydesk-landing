'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useCreateExpense } from '@/hooks/use-expenses'
import { EXPENSE_CATEGORIES, PAYMENT_METHODS, getCategoryByKey } from '@/lib/constants/expenses'
import { todayISO } from '@/lib/utils'
import { Icon } from '@/components/ui/icons'
import { Button, Toast } from '@/components/ui'
import { PageHeader } from '@/components/layout'
import { FormSection } from '@/components/forms/FormSection'
import { FormField } from '@/components/forms/FormField'
import { IconInput } from '@/components/forms/IconInput'
import { IconSelect } from '@/components/forms/IconSelect'
import { Checkbox } from '@/components/ui/Checkbox'

export default function NewExpensePage() {
  const router = useRouter()
  const { create, loading } = useCreateExpense()

  const [category, setCategory]       = useState('notary_supplies')
  const [description, setDescription] = useState('')
  const [amount, setAmount]           = useState('')
  const [vendor, setVendor]           = useState('')
  const [expDate, setExpDate]         = useState(todayISO())
  const [payMethod, setPayMethod]     = useState('')
  const [deductible, setDeductible]   = useState(true)
  const [notes, setNotes]             = useState('')
  const [errors, setErrors]           = useState<Record<string, string>>({})
  const [toast, setToast]             = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  const handleSubmit = useCallback(async () => {
    const errs: Record<string, string> = {}
    if (!description.trim()) errs.description = 'Description is required'
    const parsed = parseFloat(amount)
    if (!parsed || parsed <= 0) errs.amount = 'Enter a valid amount'
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})

    try {
      const cat = getCategoryByKey(category)
      await create({
        expense_date: expDate,
        category,
        description: description.trim(),
        amount: parsed,
        vendor: vendor.trim() || undefined,
        payment_method: payMethod || undefined,
        is_deductible: deductible,
        tax_category: cat.taxLine || undefined,
        notes: notes.trim() || undefined,
      })
      setToast({ msg: 'Expense saved!', type: 'success' })
      setTimeout(() => router.push('/dashboard/expenses'), 600)
    } catch (e: any) {
      setToast({ msg: e.message || 'Failed to save.', type: 'error' })
    }
  }, [category, description, amount, vendor, expDate, payMethod, deductible, notes, create, router])

  const selectedCat = getCategoryByKey(category)

  return (
    <div className="max-w-[720px]">
      <PageHeader title="New expense" subtitle="Track a business expense for tax deductions"
        action={
          <Button variant="outline" href="/dashboard/expenses">
            <Icon name="arrow_back" size={16} style={{ color: 'inherit' }} /> Back to expenses
          </Button>
        } />

      {/* ── Category ───────────────────────────────────────── */}
      <FormSection title="Category" icon="work">
        <div className="flex flex-wrap gap-2">
          {EXPENSE_CATEGORIES.map(cat => {
            const active = category === cat.key
            return (
              <button key={cat.key} type="button" onClick={() => setCategory(cat.key)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-semibold border-none cursor-pointer transition-all"
                style={{
                  background: active ? cat.color : 'var(--surface)',
                  color: active ? '#fff' : 'var(--text-secondary)',
                  border: active ? 'none' : '1px solid var(--border)',
                }}>
                <Icon name={cat.icon} size={14} />
                {cat.label}
              </button>
            )
          })}
        </div>
        {selectedCat.description && (
          <p className="text-[12px] mt-3" style={{ color: 'var(--text-tertiary)' }}>
            {selectedCat.description}
          </p>
        )}
      </FormSection>

      {/* ── Details ────────────────────────────────────────── */}
      <FormSection title="Expense details" icon="description">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <FormField label="Description" icon="description" required error={errors.description}>
            <IconInput icon="description" placeholder="What was this expense for?"
              value={description} onChange={e => { setDescription(e.target.value); setErrors(p => ({ ...p, description: '' })) }} />
          </FormField>
          <FormField label="Amount" icon="attach_money" required error={errors.amount}>
            <IconInput icon="attach_money" type="number" step="0.01" placeholder="0.00"
              value={amount} onChange={e => { setAmount(e.target.value); setErrors(p => ({ ...p, amount: '' })) }} />
          </FormField>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4">
          <FormField label="Date" icon="schedule">
            <IconInput icon="schedule" type="date" value={expDate} onChange={e => setExpDate(e.target.value)} />
          </FormField>
          <FormField label="Vendor" icon="work">
            <IconInput icon="work" placeholder="Store or company" value={vendor} onChange={e => setVendor(e.target.value)} />
          </FormField>
          <FormField label="Payment method" icon="payments">
            <IconSelect icon="payments" value={payMethod} onChange={e => setPayMethod(e.target.value)}
              options={PAYMENT_METHODS} placeholder="Select method" />
          </FormField>
        </div>
      </FormSection>

      {/* ── Tax ────────────────────────────────────────────── */}
      <FormSection title="Tax info" icon="savings">
        <div className="flex items-center gap-6 mb-4">
          <Checkbox checked={deductible} onChange={setDeductible} label="Tax deductible" />
          {selectedCat.taxLine && (
            <span className="text-[11px] px-2 py-0.5 rounded" style={{ background: 'var(--surface)', color: 'var(--text-tertiary)' }}>
              {selectedCat.taxLine}
            </span>
          )}
        </div>
      </FormSection>

      {/* ── Notes ──────────────────────────────────────────── */}
      <FormSection title="Notes" icon="edit_note">
        <textarea className="input-base resize-y min-h-[80px]" rows={3}
          placeholder="Additional details, receipt info..." value={notes} onChange={e => setNotes(e.target.value)} />
      </FormSection>

      {/* ── Actions ────────────────────────────────────────── */}
      <div className="flex gap-3 mt-2 mb-8">
        <Button variant="gold" onClick={handleSubmit} loading={loading} fullWidth size="lg">
          <Icon name="add_circle" size={16} style={{ color: 'inherit' }} /> Save expense
        </Button>
        <Button variant="outline" href="/dashboard/expenses" size="lg">Cancel</Button>
      </div>

      {toast && <Toast message={toast.msg} type={toast.type} visible={!!toast} onHide={() => setToast(null)} />}
    </div>
  )
}