export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'

export interface Invoice {
  id: string
  user_id: string
  job_id: string | null
  client_name: string
  client_email: string | null
  client_phone?: string | null
  service_description: string
  amount: number
  status: InvoiceStatus
  payment_method: string | null
  due_date?: string | null
  sent_at?: string | null
  paid_at: string | null
  notes: string | null
  created_at: string
  updated_at?: string
}
