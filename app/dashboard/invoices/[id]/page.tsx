'use client'

import { useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useInvoice, useInvoiceActions, type InvoiceStatus } from '@/hooks/use-invoices'
import { INVOICE_STATUS_CONFIG, INVOICE_TRANSITIONS, INVOICE_PAYMENT_METHODS, invoiceNumber } from '@/lib/invoice-constants'
import { currency, formatDate } from '@/lib/formatters'
import { Icon } from '@/components/ui/icons'
import { Button, Toast } from '@/components/ui'
import { PageHeader } from '@/components/shared'
import { FormSection } from '@/components/shared/FormSection'
import { FormField } from '@/components/shared/FormField'
import { IconInput } from '@/components/shared/IconInput'
import { IconSelect } from '@/components/shared/IconSelect'

export default function InvoiceDetailPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const id = params.id

  const { invoice, loading, setInvoice } = useInvoice(id)
  const { updateStatus, updateFields, remove, loading: actionLoading } = useInvoiceActions()

  const [editing, setEditing]       = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [toast, setToast]           = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  // Edit form
  const [clientName, setClientName]   = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [service, setService]         = useState('')
  const [amount, setAmount]           = useState('')
  const [dueDate, setDueDate]         = useState('')
  const [payMethod, setPayMethod]     = useState('')
  const [notes, setNotes]             = useState('')

  function startEdit() {
    if (!invoice) return
    setClientName(invoice.client_name)
    setClientEmail(invoice.client_email || '')
    setClientPhone(invoice.client_phone || '')
    setService(invoice.service_description)
    setAmount(String(invoice.amount))
    setDueDate(invoice.due_date || '')
    setPayMethod(invoice.payment_method || '')
    setNotes(invoice.notes || '')
    setEditing(true)
  }

  const handleSave = useCallback(async () => {
    if (!id || !clientName.trim() || !service.trim()) {
      setToast({ msg: 'Client name and service required.', type: 'error' }); return
    }
    try {
      const updated = await updateFields(id, {
        client_name: clientName.trim(),
        client_email: clientEmail.trim() || undefined,
        client_phone: clientPhone.trim() || undefined,
        service_description: service.trim(),
        amount: parseFloat(amount) || 0,
        due_date: dueDate || undefined,
        payment_method: payMethod || undefined,
        notes: notes.trim() || undefined,
      })
      setInvoice(updated); setEditing(false)
      setToast({ msg: 'Invoice updated!', type: 'success' })
    } catch (e: any) { setToast({ msg: e.message, type: 'error' }) }
  }, [id, clientName, clientEmail, clientPhone, service, amount, dueDate, payMethod, notes, updateFields, setInvoice])

  const handleStatusChange = useCallback(async (newStatus: InvoiceStatus) => {
    if (!id) return
    try {
      const updated = await updateStatus(id, newStatus)
      setInvoice(updated)
      const label = INVOICE_STATUS_CONFIG[newStatus].label
      setToast({ msg: `Invoice marked as ${label.toLowerCase()}.`, type: 'success' })
    } catch (e: any) { setToast({ msg: e.message, type: 'error' }) }
  }, [id, updateStatus, setInvoice])

  const handleDelete = useCallback(async () => {
    if (!id) return
    try { await remove(id); setToast({ msg: 'Invoice deleted.', type: 'success' }); setTimeout(() => router.push('/dashboard/invoices'), 400) }
    catch (e: any) { setToast({ msg: e.message, type: 'error' }) }
  }, [id, remove, router])

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-9 h-9 border-[3px] rounded-full animate-spin-slow" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--primary)' }} />
    </div>
  )

  if (!invoice) return (
    <div className="text-center py-20">
      <div className="text-[15px] font-bold mb-2" style={{ color: 'var(--text)' }}>Invoice not found</div>
      <Button variant="outline" href="/dashboard/invoices"><Icon name="arrow_back" size={16} style={{ color: 'inherit' }} /> Back</Button>
    </div>
  )

  const cfg = INVOICE_STATUS_CONFIG[invoice.status]
  const nextStatuses = INVOICE_TRANSITIONS[invoice.status] || []
  const invNum = invoiceNumber(invoice.id)
  const canEdit = invoice.status === 'draft'

  // ═══════════════════════════════════════════════════════════════════
  // EDIT MODE
  // ═══════════════════════════════════════════════════════════════════

  if (editing) return (
    <div className="max-w-[720px]">
      <PageHeader title={`Edit ${invNum}`} subtitle={invoice.client_name}
        action={<Button variant="outline" onClick={() => setEditing(false)}><Icon name="close" size={16} style={{ color: 'inherit' }} /> Cancel</Button>} />

      <FormSection title="Client" icon="person">
        <FormField label="Client name" icon="person" required>
          <IconInput icon="person" value={clientName} onChange={e => setClientName(e.target.value)} />
        </FormField>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <FormField label="Email" icon="mail"><IconInput icon="mail" type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} /></FormField>
          <FormField label="Phone" icon="phone_iphone"><IconInput icon="phone_iphone" type="tel" value={clientPhone} onChange={e => setClientPhone(e.target.value)} /></FormField>
        </div>
      </FormSection>
      <FormSection title="Service" icon="receipt_long">
        <FormField label="Description" icon="description" required><IconInput icon="description" value={service} onChange={e => setService(e.target.value)} /></FormField>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <FormField label="Amount" icon="attach_money" required><IconInput icon="attach_money" type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} /></FormField>
          <FormField label="Due date" icon="schedule"><IconInput icon="schedule" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} /></FormField>
        </div>
      </FormSection>
      <FormSection title="Payment" icon="payments">
        <FormField label="Method" icon="payments"><IconSelect icon="payments" value={payMethod} onChange={e => setPayMethod(e.target.value)} options={INVOICE_PAYMENT_METHODS} /></FormField>
      </FormSection>
      <FormSection title="Notes" icon="edit_note">
        <textarea className="input-base resize-y min-h-[80px]" rows={3} value={notes} onChange={e => setNotes(e.target.value)} />
      </FormSection>
      <div className="flex gap-3 mt-2 mb-8">
        <Button variant="gold" onClick={handleSave} loading={actionLoading} fullWidth size="lg"><Icon name="check" size={16} style={{ color: 'inherit' }} /> Save</Button>
        <Button variant="outline" onClick={() => setEditing(false)} size="lg">Cancel</Button>
      </div>
      {toast && <Toast message={toast.msg} type={toast.type} visible={!!toast} onHide={() => setToast(null)} />}
    </div>
  )

  // ═══════════════════════════════════════════════════════════════════
  // VIEW MODE
  // ═══════════════════════════════════════════════════════════════════

  return (
    <div className="max-w-[720px]">
      <PageHeader title={invNum} subtitle={invoice.client_name}
        action={
          <div className="flex gap-2">
            <Button variant="outline" href="/dashboard/invoices"><Icon name="arrow_back" size={16} style={{ color: 'inherit' }} /> Back</Button>
            {canEdit && <Button variant="primary" onClick={startEdit}><Icon name="edit_note" size={16} style={{ color: 'inherit' }} /> Edit</Button>}
            <Button variant="danger" size="sm" onClick={() => setShowDelete(true)}><Icon name="close" size={14} style={{ color: 'inherit' }} /></Button>
          </div>
        } />

      {/* ── Status banner ────────────────────────────────────── */}
      <div className="rounded-xl px-4 py-3 mb-5 flex items-center gap-2" style={{ background: cfg.bg, border: `1px solid ${cfg.color}30` }}>
        <Icon name={cfg.icon} size={18} style={{ color: cfg.color }} />
        <span className="text-[13px] font-bold" style={{ color: cfg.color }}>{cfg.label}</span>
        {invoice.sent_at && <span className="text-[11px] ml-auto" style={{ color: cfg.color }}>Sent {formatDate(invoice.sent_at.split('T')[0])}</span>}
        {invoice.paid_at && <span className="text-[11px] ml-auto" style={{ color: cfg.color }}>Paid {formatDate(invoice.paid_at.split('T')[0])}</span>}
      </div>

      {/* ── Status pipeline ──────────────────────────────────── */}
      <div className="flex gap-1.5 mb-5">
        {(['draft', 'sent', 'paid'] as InvoiceStatus[]).map((s, i) => {
          const sc = INVOICE_STATUS_CONFIG[s]
          const reached = ['draft', 'sent', 'paid'].indexOf(invoice.status) >= i || (invoice.status === 'overdue' && i <= 1)
          return (
            <div key={s} className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{ background: reached ? sc.bg : 'var(--surface)' }}>
              <Icon name={sc.icon} size={14} style={{ color: reached ? sc.color : 'var(--text-tertiary)' }} />
              <span className="text-[11px] font-semibold" style={{ color: reached ? sc.color : 'var(--text-tertiary)' }}>{sc.label}</span>
            </div>
          )
        })}
      </div>

      {/* ── Detail card ──────────────────────────────────────── */}
      <div className="rounded-2xl p-6" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="text-[32px] font-extrabold mb-5" style={{ color: 'var(--text)' }}>{currency(invoice.amount)}</div>

        <Row icon="person" label="Client" value={invoice.client_name} />
        {invoice.client_email && <Row icon="mail" label="Email" value={invoice.client_email} />}
        {invoice.client_phone && <Row icon="phone_iphone" label="Phone" value={invoice.client_phone} />}
        <Row icon="description" label="Service" value={invoice.service_description} />
        {invoice.due_date && <Row icon="schedule" label="Due date" value={formatDate(invoice.due_date)} />}
        {invoice.payment_method && <Row icon="payments" label="Payment method" value={invoice.payment_method} />}
        {invoice.notes && <Row icon="edit_note" label="Notes" value={invoice.notes} />}
        <Row icon="schedule" label="Created" value={formatDate(invoice.created_at?.split('T')[0])} />
      </div>

      {/* ── Action buttons ───────────────────────────────────── */}
      {nextStatuses.length > 0 && (
        <div className="flex gap-3 mt-5">
          {nextStatuses.map(ns => {
            const nsc = INVOICE_STATUS_CONFIG[ns]
            const variant = ns === 'paid' ? 'gold' : ns === 'sent' ? 'primary' : 'outline'
            return (
              <Button key={ns} variant={variant as any} onClick={() => handleStatusChange(ns)} loading={actionLoading} size="lg">
                <Icon name={nsc.icon} size={16} style={{ color: 'inherit' }} />
                {ns === 'sent' ? 'Send invoice' : ns === 'paid' ? 'Mark as paid' : `Mark ${nsc.label.toLowerCase()}`}
              </Button>
            )
          })}
        </div>
      )}

      {/* Delete */}
      {showDelete && (
        <div className="rounded-xl p-4 mt-5 flex items-center justify-between" style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger)' }}>
          <span className="text-[13px] font-medium" style={{ color: 'var(--danger)' }}>Permanently delete {invNum}?</span>
          <div className="flex gap-2">
            <Button variant="danger" size="sm" onClick={handleDelete} loading={actionLoading}>Yes, delete</Button>
            <Button variant="ghost" size="sm" onClick={() => setShowDelete(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.msg} type={toast.type} visible={!!toast} onHide={() => setToast(null)} />}
    </div>
  )
}

function Row({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-3" style={{ borderBottom: '1px solid var(--divider)' }}>
      <Icon name={icon as any} size={16} style={{ color: 'var(--text-tertiary)' }} />
      <span className="text-[13px] flex-1" style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <span className="text-[13px] font-semibold text-right" style={{ color: 'var(--text)' }}>{value}</span>
    </div>
  )
}