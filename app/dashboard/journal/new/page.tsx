'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useCreateJournalEntry } from '@/hooks/use-journal'
import { DOCUMENT_TYPES, ID_TYPES } from '@/lib/journal-constants'
import { todayISO } from '@/lib/formatters'
import { Icon } from '@/components/ui/icons'
import { Button, Toast } from '@/components/ui'
import { PageHeader } from '@/components/shared'
import { FormSection } from '@/components/shared/FormSection'
import { FormField } from '@/components/shared/FormField'
import { IconInput } from '@/components/shared/IconInput'
import { IconSelect } from '@/components/shared/IconSelect'
import { Checkbox } from '@/components/ui/Checkbox'

export default function NewJournalEntryPage() {
  const router = useRouter()
  const { create, loading } = useCreateJournalEntry()

  const [signingDate, setSigningDate]   = useState(todayISO())
  const [signerName, setSignerName]     = useState('')
  const [signerAddr, setSignerAddr]     = useState('')
  const [docType, setDocType]           = useState('')
  const [idType, setIdType]             = useState('')
  const [idNumber, setIdNumber]         = useState('')
  const [fee, setFee]                   = useState('')
  const [notes, setNotes]               = useState('')
  const [thumbprint, setThumbprint]     = useState(false)
  const [errors, setErrors]             = useState<Record<string, string>>({})
  const [toast, setToast]               = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  const handleSubmit = useCallback(async (finalize: boolean) => {
    const errs: Record<string, string> = {}
    if (!signerName.trim()) errs.signerName = 'Signer name is required'
    if (!signingDate) errs.signingDate = 'Signing date is required'
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})

    try {
      await create({
        signing_date: signingDate,
        signer_name: signerName.trim(),
        signer_address: signerAddr.trim() || undefined,
        document_type: docType || undefined,
        id_type: idType || undefined,
        id_number: idNumber.trim() || undefined,
        fee: parseFloat(fee) || 0,
        notes: notes.trim() || undefined,
        is_finalized: finalize,
        thumbprint_obtained: thumbprint || undefined,
      })
      setToast({ msg: finalize ? 'Entry saved & finalized!' : 'Draft saved.', type: 'success' })
      setTimeout(() => router.push('/dashboard/journal'), 600)
    } catch (e: any) {
      setToast({ msg: e.message || 'Failed to save entry.', type: 'error' })
    }
  }, [signingDate, signerName, signerAddr, docType, idType, idNumber, fee, notes, thumbprint, create, router])

  return (
    <div className="max-w-[720px]">
      <PageHeader title="New journal entry" subtitle="Log a notarization for your compliant digital journal"
        action={
          <Button variant="outline" href="/dashboard/journal">
            <Icon name="arrow_back" size={16} style={{ color: 'inherit' }} /> Back to journal
          </Button>
        } />

      {/* ── Signing Info ─────────────────────────────────────── */}
      <FormSection title="Signing information" icon="menu_book">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <FormField label="Signing date" icon="schedule" required error={errors.signingDate}>
            <IconInput icon="schedule" type="date" value={signingDate}
              onChange={e => { setSigningDate(e.target.value); setErrors(p => ({ ...p, signingDate: '' })) }} />
          </FormField>
          <FormField label="Fee" icon="attach_money">
            <IconInput icon="attach_money" type="number" step="0.01" placeholder="0.00"
              value={fee} onChange={e => setFee(e.target.value)} />
          </FormField>
        </div>
        <FormField label="Signer name" icon="person" required error={errors.signerName}>
          <IconInput icon="person" placeholder="Full legal name of person being notarized"
            value={signerName} onChange={e => { setSignerName(e.target.value); setErrors(p => ({ ...p, signerName: '' })) }} />
        </FormField>
        <FormField label="Signer address" icon="location_on">
          <IconInput icon="location_on" placeholder="Address where signing took place"
            value={signerAddr} onChange={e => setSignerAddr(e.target.value)} />
        </FormField>
      </FormSection>

      {/* ── Document ─────────────────────────────────────────── */}
      <FormSection title="Document" icon="description">
        <FormField label="Document type" icon="description">
          <IconSelect icon="description" value={docType} onChange={e => setDocType(e.target.value)}
            options={DOCUMENT_TYPES.map(d => ({ value: d, label: d }))} placeholder="Select document type" />
        </FormField>
      </FormSection>

      {/* ── ID Verification ──────────────────────────────────── */}
      <FormSection title="ID verification" icon="verified">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <FormField label="ID type" icon="verified">
            <IconSelect icon="verified" value={idType} onChange={e => setIdType(e.target.value)}
              options={ID_TYPES.map(d => ({ value: d, label: d }))} placeholder="Select ID type" />
          </FormField>
          <FormField label="ID number" icon="verified" hint="May be required by your state">
            <IconInput icon="verified" placeholder="e.g. D1234567"
              value={idNumber} onChange={e => setIdNumber(e.target.value)} />
          </FormField>
        </div>
      </FormSection>

      {/* ── Compliance ───────────────────────────────────────── */}
      <FormSection title="State compliance" icon="gavel">
        <Checkbox checked={thumbprint} onChange={setThumbprint} label="Thumbprint obtained" />
        <p className="text-[12px] mt-2" style={{ color: 'var(--text-tertiary)' }}>
          Required in some states for certain document types (e.g. Deed of Trust, Power of Attorney in California).
        </p>
      </FormSection>

      {/* ── Notes ────────────────────────────────────────────── */}
      <FormSection title="Notes" icon="edit_note">
        <textarea className="input-base resize-y min-h-[80px]" rows={3}
          placeholder="Special circumstances, additional details..."
          value={notes} onChange={e => setNotes(e.target.value)} />
      </FormSection>

      {/* ── Actions ──────────────────────────────────────────── */}
      <div className="flex gap-3 mt-2 mb-8">
        <Button variant="gold" onClick={() => handleSubmit(false)} loading={loading} fullWidth size="lg">
          <Icon name="add_circle" size={16} style={{ color: 'inherit' }} /> Save as draft
        </Button>
        <Button variant="primary" onClick={() => handleSubmit(true)} loading={loading} size="lg">
          <Icon name="lock" size={16} style={{ color: 'inherit' }} /> Save & finalize
        </Button>
        <Button variant="outline" href="/dashboard/journal" size="lg">Cancel</Button>
      </div>

      <div className="rounded-xl px-4 py-3 mb-8 flex items-start gap-2"
        style={{ background: 'var(--warning-bg)', border: '1px solid var(--warning)' }}>
        <Icon name="info" size={16} style={{ color: 'var(--warning)', marginTop: 2 }} />
        <p className="text-[12px] leading-relaxed" style={{ color: 'var(--warning-text)' }}>
          <strong>Finalized entries</strong> are locked from editing after save — this meets state requirements
          for tamper-evident journal records. Draft entries can still be edited.
        </p>
      </div>

      {toast && <Toast message={toast.msg} type={toast.type} visible={!!toast} onHide={() => setToast(null)} />}
    </div>
  )
}