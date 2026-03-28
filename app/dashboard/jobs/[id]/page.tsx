'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useJob, useUpdateJob } from '@/hooks/use-jobs'
import { api } from '@/lib/api/client'
import type { Conversation } from '@/lib/types/messages'
import { currency, formatDate, formatTime } from '@/lib/utils'
import { JOB_STATUS_CONFIG, JOB_PIPELINE, PAYMENT_STATUS_CONFIG, PAYMENT_METHODS } from '@/lib/constants'
import { Icon } from '@/components/ui/icons'
import { Button, Modal, ConfirmModal, StatusBadge, Toast } from '@/components/ui'
import { PageHeader, Card, PipelineTracker } from '@/components/layout'
import { DetailRow } from '@/components/layout'
import { FormActions } from '@/components/forms/FormActions'
import Link from 'next/link'

function downloadIcs(job: NonNullable<ReturnType<typeof useJob>['job']>) {
  const pad = (n: number) => String(n).padStart(2, '0')

  // Parse date + time into a Date object
  const [y, mo, d] = (job.scheduled_date || '').split('-').map(Number)
  const [h = 10, m = 0] = (job.scheduled_time || '10:00').split(':').map(Number)
  if (!y) return

  const start = new Date(y, mo - 1, d, h, m)
  const end   = new Date(y, mo - 1, d, h + 1, m)

  const fmt = (dt: Date) =>
    `${dt.getFullYear()}${pad(dt.getMonth() + 1)}${pad(dt.getDate())}` +
    `T${pad(dt.getHours())}${pad(dt.getMinutes())}00`

  const escape = (s: string) => (s || '').replace(/,/g, '\\,').replace(/;/g, '\\;').replace(/\n/g, '\\n')

  const summary = `Notary Signing – ${job.signer_name}${job.document_type ? ` (${job.document_type})` : ''}`
  const uid = `notarydesk-job-${job.id}@notarydesk.com`

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//NotaryDesk//NotaryDesk//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${escape(summary)}`,
    job.signer_address ? `LOCATION:${escape(job.signer_address)}` : '',
    `DESCRIPTION:Job #${job.job_number || '—'} · Fee: $${(job.fee + (job.travel_fee || 0)).toFixed(2)}\\nPowered by NotaryDesk`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean).join('\r\n')

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href = url
  a.download = `notarydesk-job-${job.job_number || job.id.slice(0, 8)}.ics`
  a.click()
  URL.revokeObjectURL(url)
}

// ── Document checklist per loan type ─────────────────────────────────────
const DOC_CHECKLISTS: Record<string, string[]> = {
  'Purchase':          ['Closing Disclosure (CD)', 'Note', 'Deed of Trust / Mortgage', 'Right of Rescission', 'Compliance Agreement', 'Name/Signature Affidavit', 'Occupancy Affidavit', 'IRS Form 4506-C', 'Identity Verified'],
  'Refinance':         ['Closing Disclosure (CD)', 'Note', 'Deed of Trust', 'Right of Rescission (3-day)', 'Compliance Agreement', 'Name/Signature Affidavit', 'IRS Form 4506-C', 'Identity Verified'],
  'HELOC':             ['Note', 'Deed of Trust', 'Right of Rescission', 'Compliance Agreement', 'Identity Verified'],
  'Reverse Mortgage':  ['Loan Agreement', 'Deed of Trust', 'Note', 'HUD-1 / Closing Disclosure', 'Counseling Certificate', 'Right of Rescission', 'TALC Disclosure', 'Identity Verified'],
  'Loan Modification': ['Modification Agreement', 'Note Endorsement', 'Compliance Agreement', 'Identity Verified'],
  'Power of Attorney': ['POA Document', 'Identity Verified', 'Notarial Certificate Completed', 'Journal Entry'],
  'Deed':              ['Deed Document', 'Identity Verified', 'Notarial Certificate Completed', 'Journal Entry'],
  'General Notarization': ['Document Reviewed', 'Identity Verified', 'Signature Witnessed', 'Notarial Certificate Completed', 'Journal Entry'],
}

function getChecklist(docType: string | null | undefined): string[] | null {
  if (!docType) return null
  const key = Object.keys(DOC_CHECKLISTS).find(k =>
    docType.toLowerCase().includes(k.toLowerCase())
  )
  return key ? DOC_CHECKLISTS[key] : null
}

function EditField({ label, value, onChange, type = 'text', multiline = false }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; multiline?: boolean
}) {
  return (
    <div>
      <label className="text-[12px] font-semibold mb-1 block" style={{ color: 'var(--text-secondary)' }}>{label}</label>
      {multiline ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} rows={2}
          className="w-full px-3 py-2.5 rounded-xl text-[14px] outline-none resize-y"
          style={{ border: '1.5px solid var(--border)', background: 'var(--surface)', color: 'var(--text)' }} />
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl text-[14px] outline-none"
          style={{ border: '1.5px solid var(--border)', background: 'var(--surface)', color: 'var(--text)' }} />
      )}
    </div>
  )
}

const STORAGE_KEY = (jobId: string) => `checklist:${jobId}`

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { job, loading, refresh } = useJob(id)
  const { update, advanceStatus, markPaid, cancelJob, deleteJob } = useUpdateJob()
  const [showPayment, setShowPayment]           = useState(false)
  const [showCancel, setShowCancel]             = useState(false)
  const [showDelete, setShowDelete]             = useState(false)
  const [mileageDismissed, setMileageDismissed] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [messagingClient, setMessagingClient] = useState(false)

  // Edit mode
  const [editing, setEditing] = useState(false)
  const [editData, setEditData] = useState<Record<string, string>>({})
  const [editSaving, setEditSaving] = useState(false)

  useEffect(() => {
    if (job && !editing) {
      setEditData({
        signer_name: job.signer_name || '',
        client_name: job.client_name || '',
        client_email: job.client_email || '',
        client_phone: job.client_phone || '',
        signer_address: job.signer_address || '',
        document_type: job.document_type || '',
        fee: String(job.fee || 0),
        travel_fee: String(job.travel_fee || 0),
        scheduled_date: job.scheduled_date || '',
        scheduled_time: job.scheduled_time || '',
        notes: job.notes || '',
      })
    }
  }, [job, editing])

  const handleSaveEdit = useCallback(async () => {
    if (!job) return
    setEditSaving(true)
    try {
      await update(job.id, {
        signer_name: editData.signer_name.trim() || undefined,
        client_name: editData.client_name.trim() || undefined,
        client_email: editData.client_email.trim() || undefined,
        client_phone: editData.client_phone.trim() || undefined,
        signer_address: editData.signer_address.trim() || undefined,
        document_type: editData.document_type.trim() || undefined,
        fee: parseFloat(editData.fee) || undefined,
        travel_fee: parseFloat(editData.travel_fee) || undefined,
        scheduled_date: editData.scheduled_date || undefined,
        scheduled_time: editData.scheduled_time || undefined,
        notes: editData.notes.trim() || undefined,
      })
      setEditing(false)
      setToast({ msg: 'Job updated!', type: 'success' })
      refresh()
    } catch (e: any) {
      setToast({ msg: e.message || 'Failed to save.', type: 'error' })
    }
    setEditSaving(false)
  }, [job, editData, update, refresh])

  useEffect(() => {
    if (!id) return
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY(id))
      if (stored) setChecked(JSON.parse(stored))
    } catch { /* ignore */ }
  }, [id])

  const toggleCheck = useCallback((item: string) => {
    setChecked(prev => {
      const next = { ...prev, [item]: !prev[item] }
      try { sessionStorage.setItem(STORAGE_KEY(id), JSON.stringify(next)) } catch { /* ignore */ }
      return next
    })
  }, [id])

  const showMileagePrompt = !mileageDismissed && searchParams.get('new') === '1'

  const nextStatus = useMemo(() => {
    if (!job) return null
    const idx = JOB_PIPELINE.indexOf(job.status)
    return idx >= 0 && idx < JOB_PIPELINE.length - 1 ? JOB_PIPELINE[idx + 1] : null
  }, [job?.status])

  const handleAdvance = useCallback(async () => {
    if (!job || !nextStatus) return
    try {
      await advanceStatus(job.id, nextStatus)
      setToast({ msg: `Status → ${JOB_STATUS_CONFIG[nextStatus].label}`, type: 'success' })
      refresh()
    } catch (e: any) { setToast({ msg: e.message, type: 'error' }) }
  }, [job, nextStatus, advanceStatus, refresh])

  const handlePay = useCallback(async (method: string) => {
    if (!job) return
    try {
      await markPaid(job.id, method)
      setShowPayment(false)
      setToast({ msg: 'Marked as paid!', type: 'success' })
      refresh()
    } catch (e: any) { setToast({ msg: e.message, type: 'error' }) }
  }, [job, markPaid, refresh])

  const handleCancel = useCallback(async () => {
    if (!job) return
    try {
      await cancelJob(job.id)
      setShowCancel(false)
      setToast({ msg: 'Job cancelled.', type: 'success' })
      refresh()
    } catch (e: any) { setToast({ msg: e.message, type: 'error' }) }
  }, [job, cancelJob, refresh])

  const handleDelete = useCallback(async () => {
    if (!job) return
    try {
      await deleteJob(job.id)
      router.push('/dashboard/jobs')
    } catch (e: any) { setToast({ msg: e.message, type: 'error' }) }
  }, [job, deleteJob, router])

  const handleMessageClient = useCallback(async () => {
    if (!job) return
    setMessagingClient(true)
    try {
      // Check if a conversation already exists for this job
      const existing = await api.get<Conversation>(`/messages/conversations/by-job/${job.id}`).catch(() => null)
      if (existing?.id) {
        router.push(`/dashboard/messages/${existing.id}`)
        return
      }
      // Create a new conversation linked to this job
      const conv = await api.post<Conversation>('/messages/conversations', {
        client_name: job.signer_name,
        client_email: job.client_email || undefined,
        job_id: job.id,
      })
      router.push(`/dashboard/messages/${conv.id}`)
    } catch (e: any) {
      setToast({ msg: e.message || 'Failed to start conversation.', type: 'error' })
    } finally {
      setMessagingClient(false)
    }
  }, [job, router])

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
      <div className="w-9 h-9 border-[3px] rounded-full animate-spin-slow" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--primary)' }} />
      <span className="text-[13px]" style={{ color: 'var(--text-tertiary)' }}>Loading job details…</span>
    </div>
  )

  if (!job) return (
    <div className="text-center py-20">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
        style={{ background: 'var(--surface)' }}>
        <Icon name="work_off" size={28} style={{ color: 'var(--text-tertiary)' }} />
      </div>
      <div className="text-[15px] font-bold mb-1" style={{ color: 'var(--text)' }}>Job not found</div>
      <div className="text-[13px] mb-4" style={{ color: 'var(--text-secondary)' }}>This job may have been deleted or you don't have access.</div>
      <Button variant="outline" href="/dashboard/jobs"><Icon name="arrow_back" size={16} style={{ color: 'inherit' }} /> Back to jobs</Button>
    </div>
  )

  const total = job.fee + (job.travel_fee || 0)
  const isPaid = job.payment_status === 'paid'
  const isCancelled = job.status === 'cancelled'
  const isCompleted = job.status === 'completed'

  return (
    <div className="max-w-[720px]">
      <Link href="/dashboard/jobs"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium mb-4 no-underline transition-opacity hover:opacity-70"
        style={{ color: 'var(--text-secondary)' }}>
        <Icon name="arrow_back" size={15} style={{ color: 'inherit' }} /> Back to jobs
      </Link>
      <PageHeader title={`Job #${job.job_number || '—'}`} subtitle={job.signer_name}
        action={
          <div className="flex gap-2">
            {!editing && !isCancelled && (
              <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                <Icon name="edit" size={15} style={{ color: 'inherit' }} /> Edit
              </Button>
            )}
            <Button variant="danger" size="sm" onClick={() => setShowDelete(true)} title="Delete job">
              <Icon name="delete" size={15} style={{ color: 'inherit' }} />
            </Button>
          </div>
        } />

      {/* Pipeline */}
      <Card title="Job pipeline">
        <PipelineTracker pipeline={JOB_PIPELINE} current={job.status} statusConfig={JOB_STATUS_CONFIG} />
        {isCancelled && (
          <div className="flex items-center gap-2 px-3 py-3 rounded-[10px] mt-4 text-sm font-semibold"
            style={{ background: 'var(--danger-bg)', color: 'var(--danger)' }}>
            <Icon name="cancel" size={16} /> This job was cancelled
          </div>
        )}
      </Card>

      {/* Auto-mileage prompt */}
      {showMileagePrompt && job.signer_address && (
        <div className="flex items-center justify-between gap-3 rounded-xl px-4 py-3 mb-4"
          style={{ background: 'var(--primary-light)', border: '1px solid var(--primary)' }}>
          <div className="flex items-center gap-2 min-w-0">
            <Icon name="route" size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <span className="text-[13px] font-medium" style={{ color: 'var(--text)' }}>
              Log mileage for this signing?
            </span>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="primary" size="sm"
              href={`/dashboard/mileage/new?to=${encodeURIComponent(job.signer_address)}&label=${encodeURIComponent(`Signing: ${job.signer_name}`)}&date=${job.scheduled_date || ''}`}>
              Log trip
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setMileageDismissed(true)}>
              Dismiss
            </Button>
          </div>
        </div>
      )}

      {/* Details */}
      <Card title={editing ? 'Edit job details' : 'Job details'}>
        {editing ? (
          <div className="flex flex-col gap-3">
            <EditField label="Signer name" value={editData.signer_name} onChange={v => setEditData(d => ({ ...d, signer_name: v }))} />
            <EditField label="Client name" value={editData.client_name} onChange={v => setEditData(d => ({ ...d, client_name: v }))} />
            <EditField label="Client email" value={editData.client_email} onChange={v => setEditData(d => ({ ...d, client_email: v }))} type="email" />
            <EditField label="Client phone" value={editData.client_phone} onChange={v => setEditData(d => ({ ...d, client_phone: v }))} />
            <EditField label="Address" value={editData.signer_address} onChange={v => setEditData(d => ({ ...d, signer_address: v }))} />
            <EditField label="Document type" value={editData.document_type} onChange={v => setEditData(d => ({ ...d, document_type: v }))} />
            <div className="grid grid-cols-2 gap-3">
              <EditField label="Date" value={editData.scheduled_date} onChange={v => setEditData(d => ({ ...d, scheduled_date: v }))} type="date" />
              <EditField label="Time" value={editData.scheduled_time} onChange={v => setEditData(d => ({ ...d, scheduled_time: v }))} type="time" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <EditField label="Signing fee" value={editData.fee} onChange={v => setEditData(d => ({ ...d, fee: v }))} type="number" />
              <EditField label="Travel fee" value={editData.travel_fee} onChange={v => setEditData(d => ({ ...d, travel_fee: v }))} type="number" />
            </div>
            <EditField label="Notes" value={editData.notes} onChange={v => setEditData(d => ({ ...d, notes: v }))} multiline />
            <div className="flex gap-2 mt-2">
              <Button variant="gold" onClick={handleSaveEdit} loading={editSaving} fullWidth>
                <Icon name="check" size={16} style={{ color: 'inherit' }} /> Save changes
              </Button>
              <Button variant="outline" onClick={() => setEditing(false)} fullWidth>Cancel</Button>
            </div>
          </div>
        ) : (
          <>
            <DetailRow label="Signer" value={job.signer_name} />
            {job.client_name !== job.signer_name && <DetailRow label="Client" value={job.client_name} />}
            {job.client_email && <DetailRow label="Email" value={job.client_email} />}
            {job.client_phone && <DetailRow label="Phone" value={job.client_phone} />}
            <DetailRow label="Address" value={job.signer_address} />
            <DetailRow label="Document" value={job.document_type} />
            <DetailRow label="Notarial acts" value={String(job.notarial_acts_count)} />
            <DetailRow label="Date" value={formatDate(job.scheduled_date)} />
            <DetailRow label="Time" value={formatTime(job.scheduled_time)} />
            <DetailRow label="Source" value={job.source || 'manual'} />
            {job.notes && <DetailRow label="Notes" value={job.notes} />}
            <div className="mt-2 pt-2" style={{ borderTop: '1px solid var(--divider)' }}>
              <DetailRow label="Signing fee" value={currency(job.fee)} />
              {(job.travel_fee || 0) > 0 && <DetailRow label="Travel fee" value={currency(job.travel_fee)} />}
              <DetailRow label="Total" value={currency(total)} color="var(--primary)" />
            </div>
          </>
        )}
      </Card>

      {/* Document checklist */}
      {getChecklist(job.document_type) && (() => {
        const checklist = getChecklist(job.document_type)!
        const doneCount = checklist.filter(item => checked[item]).length
        return (
          <Card title={`Document checklist (${doneCount}/${checklist.length})`}>
            {/* Progress bar */}
            <div className="w-full rounded-full h-1.5 mb-4 overflow-hidden" style={{ background: 'var(--surface)' }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${(doneCount / checklist.length) * 100}%`, background: doneCount === checklist.length ? 'var(--success)' : 'var(--primary)' }} />
            </div>
            <div className="flex flex-col gap-1">
              {checklist.map(item => (
                <button key={item} onClick={() => toggleCheck(item)}
                  role="checkbox" aria-checked={!!checked[item]} aria-label={item}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors border-none cursor-pointer"
                  style={{ background: checked[item] ? 'var(--success-bg)' : 'transparent' }}>
                  <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors"
                    style={{ background: checked[item] ? 'var(--success)' : 'var(--surface)', border: `2px solid ${checked[item] ? 'var(--success)' : 'var(--border)'}` }}>
                    {checked[item] && <Icon name="check" size={13} style={{ color: '#fff' }} />}
                  </div>
                  <span className="text-[13px] font-medium" style={{ color: checked[item] ? 'var(--success)' : 'var(--text)', textDecoration: checked[item] ? 'line-through' : 'none', opacity: checked[item] ? 0.8 : 1 }}>
                    {item}
                  </span>
                </button>
              ))}
            </div>
          </Card>
        )
      })()}

      {/* Payment */}
      <Card title="Payment">
        <div className="flex items-center gap-3">
          <StatusBadge status={job.payment_status} config={PAYMENT_STATUS_CONFIG} />
          {isPaid && job.payment_method && (
            <span className="text-[13px]" style={{ color: 'var(--text-tertiary)' }}>via {job.payment_method}</span>
          )}
        </div>
      </Card>

      {/* Actions */}
      <FormActions>
        {!isCancelled && nextStatus && (
          <Button variant="primary" onClick={handleAdvance} fullWidth size="lg">
            <Icon name="arrow_forward" size={16} style={{ color: 'inherit' }} />
            Advance to: {JOB_STATUS_CONFIG[nextStatus].label}
          </Button>
        )}
        {!isCancelled && !isPaid && (
          <Button variant="gold" onClick={() => setShowPayment(true)} fullWidth size="lg">
            <Icon name="payments" size={16} style={{ color: 'inherit' }} />
            Mark as paid
          </Button>
        )}
        <Button variant="outline" onClick={handleMessageClient} loading={messagingClient} size="lg">
          <Icon name="chat" size={16} style={{ color: 'inherit' }} />
          Message Client
        </Button>
        {job.scheduled_date && (
          <Button variant="outline" onClick={() => downloadIcs(job)} size="lg">
            <Icon name="event" size={16} style={{ color: 'inherit' }} />
            Add to Calendar
          </Button>
        )}
        {job.signer_address && (
          <Button variant="outline" onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(job.signer_address || '')}`, '_blank')} size="lg">
            <Icon name="directions" size={16} style={{ color: 'inherit' }} />
            Get Directions
          </Button>
        )}
        {!isCancelled && !isCompleted && (
          <Button variant="outline" onClick={() => setShowCancel(true)} size="lg">
            <Icon name="cancel" size={15} style={{ color: 'inherit' }} /> Cancel job
          </Button>
        )}
      </FormActions>

      {/* Payment modal */}
      <Modal open={showPayment} onClose={() => setShowPayment(false)} title="Record payment" description="How was this job paid?" size="sm">
        <div className="flex flex-col gap-2">
          {PAYMENT_METHODS.map(m => (
            <button key={m} onClick={() => handlePay(m.toLowerCase())}
              className="flex justify-between items-center px-4 py-3.5 rounded-[10px] bg-transparent cursor-pointer text-sm font-semibold transition-colors"
              style={{ border: '1px solid var(--border)' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
              <span style={{ color: 'var(--text)' }}>{m}</span>
              <Icon name="chevron_right" size={16} style={{ color: 'var(--text-tertiary)' }} />
            </button>
          ))}
        </div>
      </Modal>

      {/* Cancel confirm */}
      <ConfirmModal open={showCancel} onClose={() => setShowCancel(false)} onConfirm={handleCancel}
        title="Cancel this job?" description="The job and linked appointment will be marked as cancelled." confirmLabel="Cancel job" variant="danger" />

      {/* Delete confirm */}
      <ConfirmModal open={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete}
        title="Delete job?" description="This will permanently delete this signing job and cannot be undone." confirmLabel="Delete" variant="danger" />

      {toast && <Toast message={toast.msg} type={toast.type} visible={!!toast} onHide={() => setToast(null)} />}
    </div>
  )
}