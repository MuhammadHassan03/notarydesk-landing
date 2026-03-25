'use client'

import { useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useClient, useUpdateClient, useDeleteClient } from '@/hooks/use-clients'
import { formatDate } from '@/lib/utils'
import { Icon } from '@/components/ui/icons'
import { Button, Toast } from '@/components/ui'
import { PageHeader } from '@/components/layout'
import { FormSection } from '@/components/forms/FormSection'
import { FormField } from '@/components/forms/FormField'
import { IconInput } from '@/components/forms/IconInput'

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
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [phone, setPhone]     = useState('')
  const [company, setCompany] = useState('')
  const [notes, setNotes]     = useState('')

  const startEditing = useCallback(() => {
    if (!client) return
    setName(client.name)
    setEmail(client.email || '')
    setPhone(client.phone || '')
    setCompany(client.company || '')
    setNotes(client.notes || '')
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
      })
      setClient(updated)
      setEditing(false)
      setToast({ msg: 'Client updated!', type: 'success' })
    } catch (e: any) {
      setToast({ msg: e.message || 'Failed to update.', type: 'error' })
    }
  }, [id, name, email, phone, company, notes, update, setClient])

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
        <PageHeader title="Edit client" subtitle={client.name}
          action={
            <Button variant="outline" onClick={() => setEditing(false)}>
              <Icon name="close" size={16} style={{ color: 'inherit' }} /> Cancel edit
            </Button>
          } />

        <FormSection title="Client information" icon="person">
          <FormField label="Name" icon="person" required>
            <IconInput icon="person" value={name} onChange={e => setName(e.target.value)} />
          </FormField>
          <FormField label="Company" icon="work">
            <IconInput icon="work" value={company} onChange={e => setCompany(e.target.value)} />
          </FormField>
        </FormSection>

        <FormSection title="Contact" icon="mail">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <FormField label="Email" icon="mail">
              <IconInput icon="mail" type="email" value={email} onChange={e => setEmail(e.target.value)} />
            </FormField>
            <FormField label="Phone" icon="phone_iphone">
              <IconInput icon="phone_iphone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Notes" icon="edit_note">
          <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)} className="input-base resize-y min-h-[80px]" />
        </FormSection>

        <div className="flex gap-3 mt-2 mb-8">
          <Button variant="gold" onClick={handleSave} loading={saving} fullWidth size="lg">
            <Icon name="check" size={16} style={{ color: 'inherit' }} /> Save changes
          </Button>
          <Button variant="outline" onClick={() => setEditing(false)} size="lg">Cancel</Button>
        </div>

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
      <PageHeader title={client.name} subtitle={client.company || 'Client'}
        action={
          <div className="flex gap-2">
            <Button variant="outline" href="/dashboard/clients">
              <Icon name="arrow_back" size={16} style={{ color: 'inherit' }} /> Back
            </Button>
            <Button variant="primary" onClick={startEditing}>
              <Icon name="edit_note" size={16} style={{ color: 'inherit' }} /> Edit
            </Button>
            <Button variant="danger" size="sm" onClick={() => setShowDelete(true)}>
              <Icon name="close" size={14} style={{ color: 'inherit' }} />
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

        <DetailRow icon="mail" label="Email" value={client.email || '—'} />
        <DetailRow icon="phone_iphone" label="Phone" value={client.phone || '—'} />
        {client.last_job_date && <DetailRow icon="work" label="Last job" value={formatDate(client.last_job_date)} />}
        <DetailRow icon="schedule" label="Client since" value={formatDate(client.created_at?.split('T')[0])} />
        {client.notes && <DetailRow icon="edit_note" label="Notes" value={client.notes} />}
      </div>

      {/* ── Quick actions ────────────────────────────────────── */}
      <div className="flex gap-3 mb-5">
        <Button variant="gold" href={`/dashboard/jobs/new`}>
          <Icon name="add" size={16} style={{ color: 'inherit' }} /> New Job for {client.name.split(' ')[0]}
        </Button>
        <Button variant="outline" href={`/dashboard/invoices/new`}>
          <Icon name="receipt_long" size={16} style={{ color: 'inherit' }} /> Create Invoice
        </Button>
      </div>

      {/* ── Delete confirmation ──────────────────────────────── */}
      {showDelete && (
        <div className="rounded-xl p-4 mt-5 flex items-center justify-between"
          style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger)' }}>
          <span className="text-[13px] font-medium" style={{ color: 'var(--danger)' }}>Permanently delete this client?</span>
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

function DetailRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-3" style={{ borderBottom: '1px solid var(--divider)' }}>
      <Icon name={icon as any} size={16} style={{ color: 'var(--text-tertiary)' }} />
      <span className="text-[13px] flex-1" style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <span className="text-[13px] font-semibold text-right" style={{ color: 'var(--text)' }}>{value}</span>
    </div>
  )
}
