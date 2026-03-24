/**
 * types.ts — Shared API Types
 * =============================
 * SHARED between web (Next.js) and mobile (Expo).
 * 
 * Copy this to:
 *   Web:    lib/types.ts
 *   Mobile: src/types/api.ts
 *
 * These types match the backend Pydantic schemas exactly.
 * When the backend changes a field, update it here once.
 */

// ── Job ───────────────────────────────────────────────────────────────────

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

// ── Profile ───────────────────────────────────────────────────────────────

export interface Profile {
  id: string
  full_name: string
  email: string
  phone: string | null
  commission_number: string | null
  state: string | null
  business_name: string | null
  business_address: string | null
  default_fee: number | null
  years_experience: string | null
  avatar_url: string | null
  logo_url: string | null
  plan: 'free' | 'pro' | 'business'
}

// ── Dashboard Stats ───────────────────────────────────────────────────────

export interface DashboardStats {
  mtd_income: number
  ytd_income: number
  active_jobs: number
  unpaid_count: number
  unpaid_total: number
  ytd_notarial_acts: number
  ytd_miles: number
  ytd_mileage_deduction: number
  ytd_expenses: number
  mtd_completed: number
}

// ── Tax Summary ───────────────────────────────────────────────────────────

export interface TaxSummary {
  year: number
  total_income: number
  total_jobs: number
  total_notarial_acts: number
  average_fee: number
  total_miles: number
  mileage_deduction: number
  total_expenses: number
  expense_categories: Record<string, number>
  bond_estimate: number
  total_deductions: number
  estimated_tax_savings: number
  tax_rate: number
}

// ── Client ────────────────────────────────────────────────────────────────

export interface Client {
  id: string
  user_id: string
  name: string
  email: string | null
  phone: string | null
  company: string | null
  total_jobs: number
  last_job_date: string | null
  notes: string | null
  created_at: string
}

// ── Invoice ───────────────────────────────────────────────────────────────

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'

export interface Invoice {
  id: string
  user_id: string
  job_id: string | null
  client_name: string
  client_email: string | null
  service_description: string
  amount: number
  status: InvoiceStatus
  payment_method: string | null
  paid_at: string | null
  notes: string | null
  created_at: string
}

// ── Auth ──────────────────────────────────────────────────────────────────

export interface AuthResponse {
  access_token: string
  refresh_token: string
  expires_in: number
  user: {
    id: string
    email: string
    created_at: string | null
  }
}