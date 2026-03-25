import { storeTokens, clearTokens, getStoredTokens } from './tokens'
import { api } from './client'

export const auth = {
  async login(email: string, password: string) {
    const data = await api.post<{
      access_token: string
      refresh_token: string
      expires_in: number
      user: { id: string; email: string }
    }>('/auth/login', { email, password })

    storeTokens(data.access_token, data.refresh_token)
    return { user: data.user }
  },

  async register(email: string, password: string, fullName: string, state?: string) {
    const data = await api.post<{
      access_token: string
      refresh_token: string
      expires_in: number
      user: { id: string; email: string }
    }>('/auth/register', { email, password, full_name: fullName, state })

    storeTokens(data.access_token, data.refresh_token)
    return { user: data.user }
  },

  async forgotPassword(email: string) {
    return api.post('/auth/forgot-password', { email })
  },

  logout() {
    clearTokens()
    if (typeof window !== 'undefined') {
      window.location.href = '/dashboard/login'
    }
  },

  isLoggedIn(): boolean {
    return !!getStoredTokens().access
  },
}
