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
  w9_sent: boolean | null
  expects_1099: boolean | null
  created_at: string
}

export interface CreateClientInput {
  name: string
  email?: string
  phone?: string
  company?: string
  address?: string
  notes?: string
}

export interface UpdateClientInput {
  name?: string
  email?: string
  phone?: string
  company?: string
  address?: string
  notes?: string
  w9_sent?: boolean
  expects_1099?: boolean
}
