'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useCreateInvoice, useInvoiceActions } from '@/hooks/use-invoices'
import { INVOICE_PAYMENT_METHODS } from '@/lib/constants'
import { todayISO } from '@/lib/utils'
import { Icon } from '@/components/ui/icons'
import { Button, Toast } from '@/components/ui'
import { PageHeader } from '@/components/layout'
import { FormSection } from '@/components/forms/FormSection'
import { FormField } from '@/components/forms/FormField'
import { IconInput } from '@/components/forms/IconInput'
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
      <PageHeader title="New invoice" subtitle="Create and send a professional invoice"
        action={
          <Button variant="outline" href="/dashboard/invoices">
            <Icon name="arrow_back" size={16} style={{ color: 'inherit' }} /> Back to invoices
          </Button>
        } />

      {/* ── Client ───────────────────────────────────────────── */}
      <FormSection title="Client information" icon="person">
        <FormField label="Client name" icon="person" required error={errors.clientName}>
          <IconInput icon="person" placeholder="Title co, signing service, or direct client"
            value={clientName} onChange={e => { setClientName(e.target.value); setErrors(p => ({ ...p, clientName: '' })) }} />
        </FormField>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <FormField label="Email" icon="mail" hint="Required to send via email">
            <IconInput icon="mail" type="email" placeholder="client@example.com"
              value={clientEmail} onChange={e => setClientEmail(e.target.value)} />
          </FormField>
          <FormField label="Phone" icon="phone_iphone">
            <IconInput icon="phone_iphone" type="tel" placeholder="(555) 123-4567"
              value={clientPhone} onChange={e => setClientPhone(e.target.value)} />
          </FormField>
        </div>
      </FormSection>

      {/* ── Service ──────────────────────────────────────────── */}
      <FormSection title="Service details" icon="receipt_long">
        <FormField label="Service description" icon="description" required error={errors.service}>
          <IconInput icon="description" placeholder="e.g. Deed of Trust notarization"
            value={service} onChange={e => { setService(e.target.value); setErrors(p => ({ ...p, service: '' })) }} />
        </FormField>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <FormField label="Amount" icon="attach_money" required error={errors.amount}>
            <IconInput icon="attach_money" type="number" step="0.01" placeholder="0.00"
              value={amount} onChange={e => { setAmount(e.target.value); setErrors(p => ({ ...p, amount: '' })) }} />
          </FormField>
          <FormField label="Due date" icon="schedule">
            <IconInput icon="schedule" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
          </FormField>
        </div>
      </FormSection>

      {/* ── Payment ──────────────────────────────────────────── */}
      <FormSection title="Payment method" icon="payments">
        <FormField label="Accepted payment method" icon="payments" hint="Shown on the invoice for your client">
          <IconSelect icon="payments" value={payMethod} onChange={e => setPayMethod(e.target.value)}
            options={INVOICE_PAYMENT_METHODS} placeholder="Select method" />
        </FormField>
      </FormSection>

      {/* ── Notes ────────────────────────────────────────────── */}
      <FormSection title="Notes" icon="edit_note">
        <textarea className="input-base resize-y min-h-[80px]" rows={3}
          placeholder="Payment instructions, additional details..."
          value={notes} onChange={e => setNotes(e.target.value)} />
      </FormSection>

      {/* ── Actions ──────────────────────────────────────────── */}
      <div className="flex gap-3 mt-2 mb-8">
        <Button variant="gold" onClick={() => handleSubmit('draft')} loading={loading} fullWidth size="lg">
          <Icon name="edit_note" size={16} style={{ color: 'inherit' }} /> Save as draft
        </Button>
        <Button variant="primary" onClick={() => handleSubmit('send')} loading={loading} size="lg">
          <Icon name="send" size={16} style={{ color: 'inherit' }} /> Save & send
        </Button>
        <Button variant="outline" href="/dashboard/invoices" size="lg">Cancel</Button>
      </div>

      {toast && <Toast message={toast.msg} type={toast.type} visible={!!toast} onHide={() => setToast(null)} />}
    </div>
  )
}