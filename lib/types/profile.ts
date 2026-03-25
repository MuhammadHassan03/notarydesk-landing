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
  username: string | null
  plan: 'free' | 'pro' | 'business'
}
