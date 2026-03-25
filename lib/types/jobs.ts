export type JobType = 'loan_signing' | 'general_notary' | 'field_inspection' | 'apostille' | 'other'

export type JobStatus =
  | 'new' | 'confirmed' | 'docs_received' | 'in_progress'
  | 'scanback_pending' | 'scanback_done' | 'completed' | 'cancelled'

export type PaymentStatus = 'unpaid' | 'partial' | 'paid'

export interface SigningJob {
  id: string
  user_id: string
  job_number: number
  job_type: JobType
  status: JobStatus
  client_name: string
  client_email: string | null
  client_phone: string | null
  signer_name: string
  signer_address: string | null
  signer_lat: number | null
  signer_lng: number | null
  scheduled_date: string | null
  scheduled_time: string | null
  document_type: string
  notarial_acts_count: number
  fee: number
  travel_fee: number
  total_amount: number
  payment_status: PaymentStatus
  payment_method: string | null
  paid_at: string | null
  notes: string | null
  source: string
  created_at: string
  updated_at: string
}

export interface CreateJobInput {
  job_type?: JobType
  client_name: string
  client_email?: string
  client_phone?: string
  signer_name: string
  signer_address?: string
  scheduled_date?: string
  scheduled_time?: string
  document_type?: string
  notarial_acts_count?: number
  fee: number
  travel_fee?: number
  notes?: string
  source?: string
}

export interface UpdateJobInput {
  job_type?: JobType
  client_name?: string
  client_email?: string
  client_phone?: string
  signer_name?: string
  signer_address?: string
  scheduled_date?: string
  scheduled_time?: string
  document_type?: string
  notarial_acts_count?: number
  fee?: number
  travel_fee?: number
  notes?: string
}
