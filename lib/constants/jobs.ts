import type { JobStatus, JobType, PaymentStatus } from '@/lib/types'

// ── Job status pipeline ───────────────────────────────────────────────────

export const JOB_PIPELINE: JobStatus[] = [
  'new', 'confirmed', 'docs_received', 'in_progress',
  'scanback_pending', 'scanback_done', 'completed',
]

export const JOB_STATUS_CONFIG: Record<JobStatus, { label: string; color: string; bg: string }> = {
  new:               { label: 'New',              color: '#64748B', bg: '#F1F5F9' },
  confirmed:         { label: 'Confirmed',        color: '#2563EB', bg: '#EFF6FF' },
  docs_received:     { label: 'Docs Received',    color: '#7C3AED', bg: '#EDE9FE' },
  in_progress:       { label: 'In Progress',      color: '#D97706', bg: '#FFFBEB' },
  scanback_pending:  { label: 'Scanback Pending', color: '#EA580C', bg: '#FFF7ED' },
  scanback_done:     { label: 'Scanback Done',    color: '#059669', bg: '#ECFDF5' },
  completed:         { label: 'Completed',        color: '#16A34A', bg: '#F0FDF4' },
  cancelled:         { label: 'Cancelled',        color: '#DC2626', bg: '#FEF2F2' },
}

export const PAYMENT_STATUS_CONFIG: Record<PaymentStatus, { label: string; color: string; bg: string }> = {
  unpaid:  { label: 'Unpaid',  color: '#D97706', bg: '#FFFBEB' },
  partial: { label: 'Partial', color: '#EA580C', bg: '#FFF7ED' },
  paid:    { label: 'Paid',    color: '#16A34A', bg: '#F0FDF4' },
}

export const JOB_TYPES: { value: JobType; label: string }[] = [
  { value: 'loan_signing',     label: 'Loan Signing' },
  { value: 'general_notary',   label: 'General Notary' },
  { value: 'field_inspection', label: 'Field Inspection' },
  { value: 'apostille',        label: 'Apostille' },
  { value: 'other',            label: 'Other' },
]

export const DOC_TYPES = [
  'Loan Documents', 'Deed of Trust', 'Power of Attorney', 'Grant Deed',
  'Affidavit', 'Living Trust', 'Will', 'Healthcare Directive',
  'Jurat', 'Acknowledgment', 'Other',
]

export const PAYMENT_METHODS = [
  'Check', 'ACH / Direct Deposit', 'Cash', 'Zelle', 'Venmo', 'Credit Card', 'Other',
]
