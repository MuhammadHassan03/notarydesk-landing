'use client'

import { useState, useMemo, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useJob, useUpdateJob } from '@/hooks/use-jobs'
import { currency, formatDate, formatTime } from '@/lib/formatters'
import { JOB_STATUS_CONFIG, JOB_PIPELINE, PAYMENT_STATUS_CONFIG, PAYMENT_METHODS } from '@/lib/constants'

import { Button, Modal, ConfirmModal, StatusBadge, Toast } from '@/components/ui'
import { PageHeader, Card, EmptyState, PipelineTracker } from '@/components/shared'
import { DetailRow } from '@/components/shared'

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { job, loading, refresh } = useJob(id)
  const { advanceStatus, markPaid, deleteJob } = useUpdateJob()

  const [showPayment, setShowPayment] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
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

  const handleDelete = useCallback(async () => {
    if (!job) return
    try {
      await deleteJob(job.id)
      router.push('/dashboard/jobs')
    } catch (e: any) { setToast({ msg: e.message, type: 'error' }) }
  }, [job, deleteJob, router])

  if (loading) return <div className="p-10 text-slate-400">Loading job…</div>
  if (!job) return <EmptyState icon="✕" title="Job not found" description="This job may have been deleted."
    action={<Button variant="outline" href="/dashboard/jobs">← Back to jobs</Button>} />

  const total = job.fee + (job.travel_fee || 0)
  const isPaid = job.payment_status === 'paid'
  const isCancelled = job.status === 'cancelled'

  return (
    <div className="max-w-[720px]">
      <PageHeader title={`Job #${job.job_number || '—'}`} subtitle={job.signer_name}
        action={<div className="flex gap-2">
          <Button variant="outline" href="/dashboard/jobs">← Back</Button>
          <Button variant="danger" size="sm" onClick={() => setShowDelete(true)}>Delete</Button>
        </div>} />

      {/* Pipeline */}
      <Card title="Job pipeline">
        <PipelineTracker pipeline={JOB_PIPELINE} current={job.status} statusConfig={JOB_STATUS_CONFIG} />
        {isCancelled && (
          <div className="bg-red-50 text-red-600 px-3 py-3 rounded-[10px] mt-4 font-semibold text-sm">
            This job was cancelled
          </div>
        )}
      </Card>

      {/* Details */}
      <Card title="Job details">
        <DetailRow label="Signer" value={job.signer_name} />
        {job.client_name !== job.signer_name && <DetailRow label="Client" value={job.client_name} />}
        <DetailRow label="Address" value={job.signer_address} />
        <DetailRow label="Document" value={job.document_type} />
        <DetailRow label="Notarial acts" value={String(job.notarial_acts_count)} />
        <DetailRow label="Date" value={formatDate(job.scheduled_date)} />
        <DetailRow label="Time" value={formatTime(job.scheduled_time)} />
        {job.notes && <DetailRow label="Notes" value={job.notes} />}
        <div className="border-t border-slate-100 mt-2 pt-2">
          <DetailRow label="Signing fee" value={currency(job.fee)} />
          {(job.travel_fee || 0) > 0 && <DetailRow label="Travel fee" value={currency(job.travel_fee)} />}
          <DetailRow label="Total" value={currency(total)} color="var(--navy)" />
        </div>
      </Card>

      {/* Payment */}
      <Card title="Payment">
        <div className="flex items-center gap-3">
          <StatusBadge status={job.payment_status} config={PAYMENT_STATUS_CONFIG} />
          {isPaid && job.payment_method && <span className="text-[13px] text-slate-500">via {job.payment_method}</span>}
        </div>
      </Card>

      {/* Actions */}
      {!isCancelled && (
        <div className="flex gap-3 flex-wrap mt-2">
          {nextStatus && <Button onClick={handleAdvance}>Advance to: {JOB_STATUS_CONFIG[nextStatus].label}</Button>}
          {!isPaid && <Button variant="gold" onClick={() => setShowPayment(true)}>Mark as paid</Button>}
        </div>
      )}

      {/* Payment modal */}
      <Modal open={showPayment} onClose={() => setShowPayment(false)} title="Record payment" description="How was this job paid?" size="sm">
        <div className="flex flex-col gap-2">
          {PAYMENT_METHODS.map(m => (
            <button key={m} onClick={() => handlePay(m.toLowerCase())}
              className="flex justify-between items-center px-4 py-3.5 border border-slate-200 rounded-[10px] bg-transparent cursor-pointer text-sm font-semibold hover:border-navy hover:bg-navy/[0.02] transition-colors">
              {m} <span className="text-slate-400">→</span>
            </button>
          ))}
        </div>
      </Modal>

      {/* Delete confirm */}
      <ConfirmModal open={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete}
        title="Delete job?" description="This will permanently delete this signing job." confirmLabel="Delete" variant="danger" />

      {toast && <Toast message={toast.msg} type={toast.type} visible={!!toast} onHide={() => setToast(null)} />}
    </div>
  )
}