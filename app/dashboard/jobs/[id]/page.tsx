'use client'

import { useState, useMemo, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useJob, useUpdateJob } from '@/hooks/use-jobs'
import { currency, formatDate, formatTime } from '@/lib/formatters'
import { JOB_STATUS_CONFIG, JOB_PIPELINE, PAYMENT_STATUS_CONFIG, PAYMENT_METHODS } from '@/lib/constants'
import { Icon } from '@/components/ui/icons'
import { Button, Modal, ConfirmModal, StatusBadge, Toast } from '@/components/ui'
import { PageHeader, Card, PipelineTracker } from '@/components/shared'
import { DetailRow } from '@/components/shared'

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { job, loading, refresh } = useJob(id)
  const { advanceStatus, markPaid, cancelJob, deleteJob } = useUpdateJob()

  const [showPayment, setShowPayment] = useState(false)
  const [showCancel, setShowCancel]   = useState(false)
  const [showDelete, setShowDelete]   = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

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

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-9 h-9 border-[3px] rounded-full animate-spin-slow" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--primary)' }} />
    </div>
  )

  if (!job) return (
    <div className="text-center py-20">
      <div className="text-[15px] font-bold mb-2" style={{ color: 'var(--text)' }}>Job not found</div>
      <Button variant="outline" href="/dashboard/jobs"><Icon name="arrow_back" size={16} style={{ color: 'inherit' }} /> Back to jobs</Button>
    </div>
  )

  const total = job.fee + (job.travel_fee || 0)
  const isPaid = job.payment_status === 'paid'
  const isCancelled = job.status === 'cancelled'
  const isCompleted = job.status === 'completed'

  return (
    <div className="max-w-[720px]">
      <PageHeader title={`Job #${job.job_number || '—'}`} subtitle={job.signer_name}
        action={
          <div className="flex gap-2">
            <Button variant="outline" href="/dashboard/jobs"><Icon name="arrow_back" size={16} style={{ color: 'inherit' }} /> Back</Button>
            {!isCancelled && !isCompleted && (
              <Button variant="outline" size="sm" onClick={() => setShowCancel(true)}>
                <Icon name="cancel" size={14} style={{ color: 'inherit' }} /> Cancel
              </Button>
            )}
            <Button variant="danger" size="sm" onClick={() => setShowDelete(true)}>
              <Icon name="close" size={14} style={{ color: 'inherit' }} />
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

      {/* Details */}
      <Card title="Job details">
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
      </Card>

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
      {!isCancelled && (
        <div className="flex gap-3 flex-wrap mt-2 mb-6">
          {nextStatus && (
            <Button onClick={handleAdvance}>
              <Icon name="arrow_forward" size={16} style={{ color: 'inherit' }} />
              Advance to: {JOB_STATUS_CONFIG[nextStatus].label}
            </Button>
          )}
          {!isPaid && (
            <Button variant="gold" onClick={() => setShowPayment(true)}>
              <Icon name="payments" size={16} style={{ color: 'inherit' }} />
              Mark as paid
            </Button>
          )}
        </div>
      )}

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