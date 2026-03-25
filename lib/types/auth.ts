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
