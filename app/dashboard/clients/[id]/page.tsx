'use client'

import { useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useClient, useUpdateClient, useDeleteClient } from '@/hooks/use-clients'
import { formatDate } from '@/lib/utils'
import { Icon } from '@/components/ui/icons'
import { Button, Toast } from '@/components/ui'
import { PageHeader } from '@/components/layout'
import { FormSection } from '@/components/forms/FormSection'
import Link from 'next/link'
import { FormField } from '@/components/forms/FormField'
import { IconInput } from '@/components/forms/IconInput'
import { PhoneInput } from '@/components/forms/PhoneInput'
import { FormActions } from '@/components/forms/FormActions'

export default function ClientDetailPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const id = params.id

  const { client, loading, setClient } = useClient(id)
  const { update, loading: saving } = useUpdateClient()
  const { remove, loading: deleting } = useDeleteClient()

  const [editing, setEditing] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  // ── Edit form state ─────────────────────────────────────────────────
  const [name, setName]               = useState('')
  const [email, setEmail]             = useState('')
  const [phone, setPhone]             = useState('')
  const [company, setCompany]         = useState('')
  const [notes, setNotes]             = useState('')
  const [defaultFee, setDefaultFee]   = useState('')
  const [doNotAccept, setDoNotAccept] = useState(false)
  const [dnaReason, setDnaReason]     = useState('')
  const [referralSource, setReferralSource] = useState('')

  const startEditing = useCallback(() => {
    if (!client) return
    setName(client.name)
    setEmail(client.email || '')
    setPhone(client.phone || '')
    setCompany(client.company || '')
    setNotes(client.notes || '')
    setDefaultFee(client.default_fee != null ? String(client.default_fee) : '')
    setDoNotAccept(client.do_not_accept || false)
    setDnaReason(client.do_not_accept_reason || '')
    setReferralSource(client.referral_source || '')
    setEditing(true)
  }, [client])

  const handleSave = useCallback(async () => {
    if (!id) return
    if (!name.trim()) {
      setToast({ msg: 'Client name is required.', type: 'error' }); return
    }
    try {
      const updated = await update(id, {
        name: name.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        company: company.trim() || undefined,
        notes: notes.trim() || undefined,
        default_fee: defaultFee !== '' ? parseFloat(defaultFee) : null,
        do_not_accept: doNotAccept,
        do_not_accept_reason: doNotAccept ? (dnaReason.trim() || null) : null,
        referral_source: referralSource.trim() || null,
      })
      setClient(updated)
      setEditing(false)
      setToast({ msg: 'Client updated!', type: 'success' })
    } catch (e: any) {
      setToast({ msg: e.message || 'Failed to update.', type: 'error' })
    }
  }, [id, name, email, phone, company, notes, defaultFee, doNotAccept, dnaReason, referralSource, update, setClient])

  const handleDelete = useCallback(async () => {
    if (!id) return
    try {
      await remove(id)
      setToast({ msg: 'Client deleted.', type: 'success' })
      setTimeout(() => router.push('/dashboard/clients'), 400)
    } catch (e: any) { setToast({ msg: e.message, type: 'error' }) }
  }, [id, remove, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-9 h-9 border-[3px] rounded-full animate-spin-slow"
          style={{ borderColor: 'var(--border)', borderTopColor: 'var(--primary)' }} />
      </div>
    )
  }

  if (!client) {
    return (
      <div className="text-center py-20">
        <div className="text-[15px] font-bold mb-2" style={{ color: 'var(--text)' }}>Client not found</div>
        <Button variant="outline" href="/dashboard/clients">
          <Icon name="arrow_back" size={16} style={{ color: 'inherit' }} /> Back to clients
        </Button>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════════════
  // EDIT MODE
  // ═══════════════════════════════════════════════════════════════════

  if (editing) {
    return (
      <div className="max-w-[720px]">
        <Link href="#" onClick={e => { e.preventDefault(); setEditing(false) }}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium mb-4 no-underline transition-opacity hover:opacity-70"
          style={{ color: 'var(--text-secondary)' }}>
          <Icon name="arrow_back" size={15} style={{ color: 'inherit' }} /> Back to client
        </Link>
        <PageHeader title="Edit client" subtitle={client.name} />

        <FormSection title="Client information">
          <FormField label="Name" required>
            <IconInput value={name} onChange={e => setName(e.target.value)} />
          </FormField>
          <FormField label="Company">
            <IconInput value={company} onChange={e => setCompany(e.target.value)} />
          </FormField>
        </FormSection>

        <FormSection title="Contact">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <FormField label="Email">
              <IconInput type="email" value={email} onChange={e => setEmail(e.target.value)} />
            </FormField>
            <FormField label="Phone">
              <PhoneInput value={phone} onChange={setPhone} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Notes">
          <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)} className="input-base resize-y min-h-[80px]" />
        </FormSection>

        <FormSection title="Business settings">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <FormField label="Default fee ($)" hint="Override your profile rate for this client">
              <IconInput type="number" min="0" step="0.01" value={defaultFee} onChange={e => setDefaultFee(e.target.value)} placeholder="e.g. 150" />
            </FormField>
            <FormField label="Referral source">
              <IconInput value={referralSource} onChange={e => setReferralSource(e.target.value)} placeholder="e.g. Snapdocs, word of mouth" />
            </FormField>
          </div>
          {/* Do-not-accept toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl mt-1"
            style={{ background: doNotAccept ? 'var(--danger-bg)' : 'var(--surface)', border: `1px solid ${doNotAccept ? 'var(--danger)' : 'var(--border)'}` }}>
            <div>
              <div className="text-[13px] font-semibold" style={{ color: doNotAccept ? 'var(--danger)' : 'var(--text)' }}>Do not accept jobs</div>
              <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>Warn before creating a job for this client</div>
            </div>
            <button onClick={() => setDoNotAccept(p => !p)}
              className="relative w-12 h-6 rounded-full transition-colors border-none cursor-pointer shrink-0"
              style={{ background: doNotAccept ? 'var(--danger)' : 'var(--border)' }}>
              <span className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all"
                style={{ left: doNotAccept ? '26px' : '4px', boxShadow: '0 1px 3px rgba(0,0,0,.2)' }} />
            </button>
          </div>
          {doNotAccept && (
            <FormField label="Reason (optional)" hint="Shown as a warning when creating a job">
              <IconInput value={dnaReason} onChange={e => setDnaReason(e.target.value)} placeholder="e.g. Slow payer, no-show history" />
            </FormField>
          )}
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

  // ═══════════════════════════════════════════════════════════════════
  // VIEW MODE
  // ═══════════════════════════════════════════════════════════════════

  const initials = client.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className="max-w-[720px]">
      <Link href="/dashboard/clients"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium mb-4 no-underline transition-opacity hover:opacity-70"
        style={{ color: 'var(--text-secondary)' }}>
        <Icon name="arrow_back" size={15} style={{ color: 'inherit' }} /> Back to clients
      </Link>
      <PageHeader title={client.name} subtitle={client.company || 'Client'}
        action={
          <div className="flex gap-2">
            <Button variant="primary" size="sm" onClick={startEditing}>
              <Icon name="edit_note" size={16} style={{ color: 'inherit' }} /> Edit
            </Button>
            <Button variant="danger" size="sm" onClick={() => setShowDelete(true)}>
              <Icon name="delete" size={15} style={{ color: 'inherit' }} />
            </Button>
          </div>
        } />

      {/* ── Client profile card ──────────────────────────────── */}
      <div className="rounded-2xl p-6 mb-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-4 mb-5 pb-4" style={{ borderBottom: '1px solid var(--divider)' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-[18px] font-bold"
            style={{ background: 'var(--primary)', color: '#fff' }}>
            {initials}
          </div>
          <div className="flex-1">
            <div className="text-[18px] font-bold" style={{ color: 'var(--text)' }}>{client.name}</div>
            {client.company && <div className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>{client.company}</div>}
          </div>
          <div className="text-right">
            <div className="text-[24px] font-extrabold" style={{ color: 'var(--primary)' }}>{client.total_jobs}</div>
            <div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>total jobs</div>
          </div>
        </div>

        <DetailRow label="Email" value={client.email || '—'} />
        <DetailRow label="Phone" value={client.phone || '—'} />
        {client.last_job_date && <DetailRow label="Last job" value={formatDate(client.last_job_date)} />}
        <DetailRow label="Client since" value={formatDate(client.created_at?.split('T')[0])} />
        {client.notes && <DetailRow label="Notes" value={client.notes} />}
      </div>

      {/* ── Do-not-accept warning ───────────────────────────── */}
      {client.do_not_accept && (
        <div className="rounded-xl p-4 mb-5 flex items-start gap-3"
          style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger)' }}>
          <Icon name="block" size={20} style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 1 }} />
          <div>
            <div className="text-[13px] font-bold" style={{ color: 'var(--danger)' }}>Do not accept jobs from this client</div>
            {client.do_not_accept_reason && (
              <div className="text-[12px] mt-0.5" style={{ color: 'var(--danger)' }}>{client.do_not_accept_reason}</div>
            )}
          </div>
        </div>
      )}

      {/* ── Business settings strip ──────────────────────────── */}
      {(client.default_fee != null || client.referral_source) && (
        <div className="rounded-2xl p-4 mb-5 flex flex-wrap gap-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          {client.default_fee != null && (
            <div>
              <div className="text-[11px] font-medium mb-0.5" style={{ color: 'var(--text-tertiary)' }}>Default fee</div>
              <div className="text-[16px] font-bold" style={{ color: 'var(--primary)' }}>${client.default_fee.toFixed(2)}</div>
            </div>
          )}
          {client.referral_source && (
            <div>
              <div className="text-[11px] font-medium mb-0.5" style={{ color: 'var(--text-tertiary)' }}>Referral source</div>
              <div className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>{client.referral_source}</div>
            </div>
          )}
        </div>
      )}

      {/* ── W-9 / 1099 tracking ─────────────────────────────── */}
      <div className="rounded-2xl p-5 mb-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2 mb-4">
          <Icon name="description" size={17} style={{ color: 'var(--primary)' }} />
          <span className="text-[14px] font-bold" style={{ color: 'var(--text)' }}>Tax Documents</span>
          <span className="text-[11px] px-1.5 py-0.5 rounded font-medium ml-auto"
            style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            1099-NEC required if paid &gt; $600/yr
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {/* W-9 toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div>
              <div className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>W-9 Sent</div>
              <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                Send before this client owes you a 1099-NEC
              </div>
            </div>
            <button
              onClick={async () => {
                const next = !client.w9_sent
                setClient({ ...client, w9_sent: next })
                try { await update(id, { w9_sent: next }) }
                catch { setClient({ ...client, w9_sent: client.w9_sent }) }
              }}
              className="relative w-12 h-6 rounded-full transition-colors border-none cursor-pointer shrink-0"
              style={{ background: client.w9_sent ? 'var(--success)' : 'var(--border)' }}>
              <span className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all"
                style={{ left: client.w9_sent ? '26px' : '4px', boxShadow: '0 1px 3px rgba(0,0,0,.2)' }} />
            </button>
          </div>

          {/* 1099 toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div>
              <div className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>Expect 1099-NEC</div>
              <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                Mark if this client has paid you over $600 this year
              </div>
            </div>
            <button
              onClick={async () => {
                const next = !client.expects_1099
                setClient({ ...client, expects_1099: next })
                try { await update(id, { expects_1099: next }) }
                catch { setClient({ ...client, expects_1099: client.expects_1099 }) }
              }}
              className="relative w-12 h-6 rounded-full transition-colors border-none cursor-pointer shrink-0"
              style={{ background: client.expects_1099 ? 'var(--accent)' : 'var(--border)' }}>
              <span className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all"
                style={{ left: client.expects_1099 ? '26px' : '4px', boxShadow: '0 1px 3px rgba(0,0,0,.2)' }} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Delete confirmation ──────────────────────────────── */}
      {showDelete && (
        <div className="rounded-xl p-4 mt-2 mb-2 flex items-center justify-between gap-3"
          style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger)' }}>
          <span className="text-[13px] font-medium" style={{ color: 'var(--danger)' }}>Permanently delete this client?</span>
          <div className="flex gap-2 shrink-0">
            <Button variant="danger" size="sm" onClick={handleDelete} loading={deleting}>Yes, delete</Button>
            <Button variant="ghost" size="sm" onClick={() => setShowDelete(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {/* ── Quick actions ────────────────────────────────────── */}
      <FormActions>
        <Button variant="gold" href="/dashboard/jobs/new" fullWidth size="lg">
          <Icon name="add" size={16} style={{ color: 'inherit' }} /> New Job for {client.name.split(' ')[0]}
        </Button>
        <Button variant="outline" href="/dashboard/invoices/new" fullWidth size="lg">
          <Icon name="receipt_long" size={16} style={{ color: 'inherit' }} /> Create Invoice
        </Button>
      </FormActions>

      {toast && <Toast message={toast.msg} type={toast.type} visible={!!toast} onHide={() => setToast(null)} />}
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-3" style={{ borderBottom: '1px solid var(--divider)' }}>
      <span className="text-[13px] flex-1" style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <span className="text-[13px] font-semibold text-right" style={{ color: 'var(--text)' }}>{value}</span>
    </div>
  )
}
