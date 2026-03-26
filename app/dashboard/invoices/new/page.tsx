'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useCreateInvoice, useInvoiceActions } from '@/hooks/use-invoices'
import { INVOICE_PAYMENT_METHODS } from '@/lib/constants'
import { todayISO } from '@/lib/utils'
import { Icon } from '@/components/ui/icons'
import { Button, Toast } from '@/components/ui'
import { PageHeader } from '@/components/layout'
import Link from 'next/link'
import { FormSection } from '@/components/forms/FormSection'
import { FormField } from '@/components/forms/FormField'
import { FormActions } from '@/components/forms/FormActions'
import { IconInput } from '@/components/forms/IconInput'
import { PhoneInput } from '@/components/forms/PhoneInput'
import { IconSelect } from '@/components/forms/IconSelect'

export default function NewInvoicePage() {
  const router = useRouter()
  const { create, loading } = useCreateInvoice()
  const { updateStatus } = useInvoiceActions()

  const [clientName, setClientName]   = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [service, setService]         = useState('')
  const [amount, setAmount]           = useState('')
  const [dueDate, setDueDate]         = useState('')
  const [payMethod, setPayMethod]     = useState('')
  const [notes, setNotes]             = useState('')
  const [errors, setErrors]           = useState<Record<string, string>>({})
  const [toast, setToast]             = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  const validate = useCallback(() => {
    const errs: Record<string, string> = {}
    if (!clientName.trim()) errs.clientName = 'Client name is required'
    if (!service.trim()) errs.service = 'Service description is required'
    const parsed = parseFloat(amount)
    if (!parsed || parsed <= 0) errs.amount = 'Enter a valid amount'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }, [clientName, service, amount])

  const handleSubmit = useCallback(async (mode: 'draft' | 'send') => {
    if (!validate()) return
    if (mode === 'send' && !clientEmail.trim()) {
      setToast({ msg: 'Client email is required to send.', type: 'error' }); return
    }

    try {
      const inv = await create({
        client_name: clientName.trim(),
        client_email: clientEmail.trim() || undefined,
        client_phone: clientPhone.trim() || undefined,
        service_description: service.trim(),
        amount: parseFloat(amount),
        due_date: dueDate || undefined,
        payment_method: payMethod || undefined,
        notes: notes.trim() || undefined,
      })

      if (mode === 'send' && inv?.id) {
        await updateStatus(inv.id, 'sent').catch(() => {})
      }

      setToast({ msg: mode === 'send' ? 'Invoice sent!' : 'Draft saved.', type: 'success' })
      setTimeout(() => router.push('/dashboard/invoices'), 600)
    } catch (e: any) {
      setToast({ msg: e.message || 'Failed to create invoice.', type: 'error' })
    }
  }, [clientName, clientEmail, clientPhone, service, amount, dueDate, payMethod, notes, create, updateStatus, router, validate])

  return (
    <div className="max-w-[720px]">
      <Link href="/dashboard/invoices"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium mb-4 no-underline transition-opacity hover:opacity-70"
        style={{ color: 'var(--text-secondary)' }}>
        <Icon name="arrow_back" size={15} style={{ color: 'inherit' }} /> Back to invoices
      </Link>
      <PageHeader title="New invoice" subtitle="Create and send a professional invoice" />

      {/* ── Client ───────────────────────────────────────────── */}
      <FormSection title="Client information">
        <FormField label="Client name" required error={errors.clientName}>
          <IconInput placeholder="Title co, signing service, or direct client"
            value={clientName} onChange={e => { setClientName(e.target.value); setErrors(p => ({ ...p, clientName: '' })) }} />
        </FormField>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <FormField label="Email" hint="Required to send via email">
            <IconInput type="email" placeholder="client@example.com"
              value={clientEmail} onChange={e => setClientEmail(e.target.value)} />
          </FormField>
          <FormField label="Phone">
            <PhoneInput value={clientPhone} onChange={setClientPhone} />
          </FormField>
        </div>
      </FormSection>

      {/* ── Service ──────────────────────────────────────────── */}
      <FormSection title="Service details">
        <FormField label="Service description" required error={errors.service}>
          <IconInput placeholder="e.g. Deed of Trust notarization"
            value={service} onChange={e => { setService(e.target.value); setErrors(p => ({ ...p, service: '' })) }} />
        </FormField>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <FormField label="Amount" required error={errors.amount}>
            <IconInput type="number" step="0.01" placeholder="0.00"
              value={amount} onChange={e => { setAmount(e.target.value); setErrors(p => ({ ...p, amount: '' })) }} />
          </FormField>
          <FormField label="Due date">
            <IconInput type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
          </FormField>
        </div>
      </FormSection>

      {/* ── Payment ──────────────────────────────────────────── */}
      <FormSection title="Payment method">
        <FormField label="Accepted payment method" hint="Shown on the invoice for your client">
          <IconSelect value={payMethod} onChange={e => setPayMethod(e.target.value)}
            options={INVOICE_PAYMENT_METHODS} placeholder="Select method" />
        </FormField>
      </FormSection>

      {/* ── Notes ────────────────────────────────────────────── */}
      <FormSection title="Notes">
        <textarea className="input-base resize-y min-h-[80px]" rows={3}
          placeholder="Payment instructions, additional details..."
          value={notes} onChange={e => setNotes(e.target.value)} />
      </FormSection>

      {/* ── Actions ──────────────────────────────────────────── */}
      <FormActions>
        <Button variant="primary" onClick={() => handleSubmit('send')} loading={loading} fullWidth size="lg">
          <Icon name="send" size={16} style={{ color: 'inherit' }} /> Save & send
        </Button>
        <Button variant="gold" onClick={() => handleSubmit('draft')} loading={loading} fullWidth size="lg">
          <Icon name="edit_note" size={16} style={{ color: 'inherit' }} /> Save draft
        </Button>
        <Button variant="outline" href="/dashboard/invoices" size="lg">Cancel</Button>
      </FormActions>

      {toast && <Toast message={toast.msg} type={toast.type} visible={!!toast} onHide={() => setToast(null)} />}
    </div>
  )
}