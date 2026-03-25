'use client'

import { useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useJournalEntry, useUpdateJournalEntry, useDeleteJournalEntry } from '@/hooks/use-journal'
import { DOCUMENT_TYPES, ID_TYPES, getDocStyle } from '@/lib/constants'
import { currency, formatDate } from '@/lib/utils'
import { Icon } from '@/components/ui/icons'
import { Button, Toast } from '@/components/ui'
import { PageHeader } from '@/components/layout'
import { FormSection } from '@/components/forms/FormSection'
import { FormField } from '@/components/forms/FormField'
import { IconInput } from '@/components/forms/IconInput'
import { IconSelect } from '@/components/forms/IconSelect'
import { Checkbox } from '@/components/ui/Checkbox'

export default function JournalDetailPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const id = params.id

  const { entry, loading, setEntry } = useJournalEntry(id)
  const { update, loading: saving } = useUpdateJournalEntry()
  const { remove, loading: deleting } = useDeleteJournalEntry()

  const [editing, setEditing]           = useState(false)
  const [showDelete, setShowDelete]     = useState(false)
  const [toast, setToast]               = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  // ── Edit form state ─────────────────────────────────────────────────
  const [signerName, setSignerName]     = useState('')
  const [signerAddr, setSignerAddr]     = useState('')
  const [docType, setDocType]           = useState('')
  const [idType, setIdType]             = useState('')
  const [idNumber, setIdNumber]         = useState('')
  const [fee, setFee]                   = useState('')
  const [notes, setNotes]               = useState('')
  const [thumbprint, setThumbprint]     = useState(false)

  function startEdit() {
    if (!entry) return
    setSignerName(entry.signer_name)
    setSignerAddr(entry.signer_address || '')
    setDocType(entry.document_type || '')
    setIdType(entry.id_type || '')
    setIdNumber(entry.id_number || '')
    setFee(String(entry.fee || 0))
    setNotes(entry.notes || '')
    setThumbprint(!!entry.thumbprint_obtained)
    setEditing(true)
  }

  const handleSave = useCallback(async () => {
    if (!id || !signerName.trim()) {
      setToast({ msg: 'Signer name is required.', type: 'error' }); return
    }
    try {
      const updated = await update(id, {
        signer_name: signerName.trim(),
        signer_address: signerAddr.trim() || undefined,
        document_type: docType || undefined,
        id_type: idType || undefined,
        id_number: idNumber.trim() || undefined,
        fee: parseFloat(fee) || 0,
        notes: notes.trim() || undefined,
        thumbprint_obtained: thumbprint || undefined,
      })
      setEntry(updated)
      setEditing(false)
      setToast({ msg: 'Entry updated!', type: 'success' })
    } catch (e: any) {
      setToast({ msg: e.message || 'Failed to update.', type: 'error' })
    }
  }, [id, signerName, signerAddr, docType, idType, idNumber, fee, notes, thumbprint, update, setEntry])

  const handleFinalize = useCallback(async () => {
    if (!id) return
    try {
      const updated = await update(id, { is_finalized: true })
      setEntry(updated)
      setToast({ msg: 'Entry finalized and locked.', type: 'success' })
    } catch (e: any) {
      setToast({ msg: e.message, type: 'error' })
    }
  }, [id, update, setEntry])

  const handleDelete = useCallback(async () => {
    if (!id) return
    try {
      await remove(id)
      setToast({ msg: 'Entry deleted.', type: 'success' })
      setTimeout(() => router.push('/dashboard/journal'), 400)
    } catch (e: any) { setToast({ msg: e.message, type: 'error' }) }
  }, [id, remove, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-9 h-9 border-[3px] rounded-full animate-spin-slow" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--primary)' }} />
      </div>
    )
  }

  if (!entry) {
    return (
      <div className="text-center py-20">
        <div className="text-[15px] font-bold mb-2" style={{ color: 'var(--text)' }}>Entry not found</div>
        <Button variant="outline" href="/dashboard/journal"><Icon name="arrow_back" size={16} style={{ color: 'inherit' }} /> Back</Button>
      </div>
    )
  }

  const doc = getDocStyle(entry.document_type)
  const isLocked = entry.is_finalized

  // ═══════════════════════════════════════════════════════════════════
  // EDIT MODE
  // ═══════════════════════════════════════════════════════════════════

  if (editing) {
    return (
      <div className="max-w-[720px]">
        <PageHeader title="Edit entry" subtitle={entry.signer_name}
          action={<Button variant="outline" onClick={() => setEditing(false)}><Icon name="close" size={16} style={{ color: 'inherit' }} /> Cancel</Button>} />

        <FormSection title="Signing information" icon="menu_book">
          <FormField label="Signer name" icon="person" required>
            <IconInput icon="person" value={signerName} onChange={e => setSignerName(e.target.value)} />
          </FormField>
          <FormField label="Signer address" icon="location_on">
            <IconInput icon="location_on" value={signerAddr} onChange={e => setSignerAddr(e.target.value)} />
          </FormField>
          <FormField label="Fee" icon="attach_money">
            <IconInput icon="attach_money" type="number" step="0.01" value={fee} onChange={e => setFee(e.target.value)} />
          </FormField>
        </FormSection>

        <FormSection title="Document & ID" icon="description">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <FormField label="Document type" icon="description">
              <IconSelect icon="description" value={docType} onChange={e => setDocType(e.target.value)}
                options={DOCUMENT_TYPES.map(d => ({ value: d, label: d }))} />
            </FormField>
            <FormField label="ID type" icon="verified">
              <IconSelect icon="verified" value={idType} onChange={e => setIdType(e.target.value)}
                options={ID_TYPES.map(d => ({ value: d, label: d }))} />
            </FormField>
          </div>
          <FormField label="ID number" icon="verified">
            <IconInput icon="verified" value={idNumber} onChange={e => setIdNumber(e.target.value)} />
          </FormField>
        </FormSection>

        <FormSection title="Compliance" icon="gavel">
          <Checkbox checked={thumbprint} onChange={setThumbprint} label="Thumbprint obtained" />
        </FormSection>

        <FormSection title="Notes" icon="edit_note">
          <textarea className="input-base resize-y min-h-[80px]" rows={3} value={notes} onChange={e => setNotes(e.target.value)} />
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

  return (
    <div className="max-w-[720px]">
      <PageHeader title={entry.signer_name} subtitle={`${entry.document_type || 'Journal Entry'} · ${formatDate(entry.signing_date)}`}
        action={
          <div className="flex gap-2">
            <Button variant="outline" href="/dashboard/journal"><Icon name="arrow_back" size={16} style={{ color: 'inherit' }} /> Back</Button>
            {!isLocked && <Button variant="primary" onClick={startEdit}><Icon name="edit_note" size={16} style={{ color: 'inherit' }} /> Edit</Button>}
            <Button variant="danger" size="sm" onClick={() => setShowDelete(true)}><Icon name="close" size={14} style={{ color: 'inherit' }} /></Button>
          </div>
        } />

      {/* Finalized banner */}
      {isLocked && (
        <div className="rounded-xl px-4 py-3 mb-5 flex items-center gap-2"
          style={{ background: 'var(--success-bg)', border: '1px solid var(--success)' }}>
          <Icon name="lock" size={16} style={{ color: 'var(--success)' }} />
          <span className="text-[13px] font-semibold" style={{ color: 'var(--success-text)' }}>
            This entry is finalized and locked from editing
          </span>
        </div>
      )}

      {/* Detail card */}
      <div className="rounded-2xl p-6" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>

        {/* Document badge + fee */}
        <div className="flex items-center justify-between mb-5 pb-4" style={{ borderBottom: '1px solid var(--divider)' }}>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: doc.color + '15' }}>
              <Icon name={doc.icon} size={22} style={{ color: doc.color }} />
            </div>
            <div>
              <span className="text-[12px] px-2 py-0.5 rounded font-bold" style={{ background: doc.color + '15', color: doc.color }}>
                {entry.document_type || 'Other'}
              </span>
              {isLocked && (
                <span className="text-[11px] ml-2 px-2 py-0.5 rounded font-medium" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>
                  Finalized
                </span>
              )}
            </div>
          </div>
          <div className="text-[28px] font-extrabold" style={{ color: 'var(--text)' }}>{currency(entry.fee)}</div>
        </div>

        {/* Detail rows */}
        <div className="space-y-0">
          <Row icon="schedule" label="Signing date" value={formatDate(entry.signing_date)} />
          <Row icon="person" label="Signer" value={entry.signer_name} />
          {entry.signer_address && <Row icon="location_on" label="Address" value={entry.signer_address} />}
          {entry.id_type && <Row icon="verified" label="ID type" value={entry.id_type} />}
          {entry.id_number && <Row icon="verified" label="ID number" value={entry.id_number} />}
          {entry.thumbprint_obtained != null && (
            <Row icon="fingerprint" label="Thumbprint" value={entry.thumbprint_obtained ? 'Obtained' : 'Not obtained'} />
          )}
          {entry.venue_county && <Row icon="gavel" label="Venue / County" value={entry.venue_county} />}
          {entry.entry_number && <Row icon="menu_book" label="Entry #" value={entry.entry_number} />}
          {entry.notes && <Row icon="edit_note" label="Notes" value={entry.notes} />}
          <Row icon="schedule" label="Created" value={formatDate(entry.created_at?.split('T')[0])} />
        </div>
      </div>

      {/* Finalize button */}
      {!isLocked && (
        <div className="mt-5">
          <Button variant="primary" onClick={handleFinalize} loading={saving} fullWidth size="lg">
            <Icon name="lock" size={16} style={{ color: 'inherit' }} /> Finalize & lock entry
          </Button>
          <p className="text-[12px] text-center mt-2" style={{ color: 'var(--text-tertiary)' }}>
            Finalized entries cannot be edited — meets state compliance requirements
          </p>
        </div>
      )}

      {/* Delete confirmation */}
      {showDelete && (
        <div className="rounded-xl p-4 mt-5 flex items-center justify-between"
          style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger)' }}>
          <span className="text-[13px] font-medium" style={{ color: 'var(--danger)' }}>Permanently delete this entry?</span>
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

// ── Detail row ────────────────────────────────────────────────────────────

function Row({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-3" style={{ borderBottom: '1px solid var(--divider)' }}>
      <Icon name={icon as any} size={16} style={{ color: 'var(--text-tertiary)' }} />
      <span className="text-[13px] flex-1" style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <span className="text-[13px] font-semibold text-right" style={{ color: 'var(--text)' }}>{value}</span>
    </div>
  )
}