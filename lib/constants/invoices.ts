import type { IconName } from '@/components/ui/icons'
import type { InvoiceStatus } from '@/lib/types'

export interface StatusConfig {
  label: string
  icon: IconName
  color: string
  bg: string
}

export const INVOICE_STATUS_CONFIG: Record<InvoiceStatus, StatusConfig> = {
  draft:     { label: 'Draft',     icon: 'edit_note',    color: '#D97706', bg: '#FFFBEB' },
  sent:      { label: 'Sent',      icon: 'send',         color: '#2563EB', bg: '#EFF6FF' },
  paid:      { label: 'Paid',      icon: 'check_circle', color: '#16A34A', bg: '#F0FDF4' },
  overdue:   { label: 'Overdue',   icon: 'error',        color: '#DC2626', bg: '#FEF2F2' },
  cancelled: { label: 'Cancelled', icon: 'cancel',       color: '#64748B', bg: '#F1F5F9' },
}

/** Valid next statuses from current status */
export const INVOICE_TRANSITIONS: Record<InvoiceStatus, InvoiceStatus[]> = {
  draft:     ['sent'],
  sent:      ['paid', 'overdue'],
  overdue:   ['paid'],
  paid:      [],
  cancelled: [],
}

export const INVOICE_PAYMENT_METHODS = [
  { value: 'Zelle',       label: 'Zelle' },
  { value: 'Venmo',       label: 'Venmo' },
  { value: 'Cash',        label: 'Cash' },
  { value: 'Check',       label: 'Check' },
  { value: 'Credit Card', label: 'Credit Card' },
  { value: 'ACH',         label: 'ACH / Direct Deposit' },
  { value: 'Other',       label: 'Other' },
]

export function invoiceNumber(id: string): string {
  return `INV-${id.slice(-4).toUpperCase()}`
}
