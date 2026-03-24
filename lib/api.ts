import { secureStorage } from '@/lib/security'

// const API_URL = process.env.NEXT_PUBLIC_API_URL || ''
const API_URL = 'http://localhost:8000/api/v1'

if (!API_URL && typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.warn('[api] NEXT_PUBLIC_API_URL is not set — API calls will fail')
}

// ── Token storage (obfuscated + sessionStorage) ───────────────────────────

const TK_ACCESS = 'at_v1'
const TK_REFRESH = 'rt_v1'

function getStoredTokens() {
  return {
    access: secureStorage.get(TK_ACCESS),
    refresh: secureStorage.get(TK_REFRESH),
  }
}

function storeTokens(access: string, refresh: string) {
  secureStorage.set(TK_ACCESS, access)
  secureStorage.set(TK_REFRESH, refresh)
}

function clearTokens() {
  secureStorage.remove(TK_ACCESS)
  secureStorage.remove(TK_REFRESH)
}

// ── Token refresh (single-flight) ─────────────────────────────────────────

let isRefreshing = false
let refreshPromise: Promise<boolean> | null = null

async function refreshAccessToken(): Promise<boolean> {
  const { refresh } = getStoredTokens()
  if (!refresh) return false

  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refresh }),
    })

    if (!res.ok) {
      clearTokens()
      return false
    }

    const data = await res.json()
    if (data?.access_token && data?.refresh_token) {
      storeTokens(data.access_token, data.refresh_token)
      return true
    }
    clearTokens()
    return false
  } catch {
    clearTokens()
    return false
  }
}

// ── Core fetch wrapper ────────────────────────────────────────────────────

async function apiFetch<T = any>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const { access } = getStoredTokens()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  }

  if (access) {
    headers['Authorization'] = `Bearer ${access}`
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers })

  // ── Handle 401 — try refresh once ─────────────────────────────────
  if (res.status === 401 && !headers['X-No-Retry']) {
    if (!isRefreshing) {
      isRefreshing = true
      refreshPromise = refreshAccessToken()
    }

    const refreshed = await refreshPromise
    isRefreshing = false
    refreshPromise = null

    if (refreshed) {
      const retryHeaders = { ...headers, 'X-No-Retry': 'true' }
      const { access: newAccess } = getStoredTokens()
      if (newAccess) retryHeaders['Authorization'] = `Bearer ${newAccess}`

      const retry = await fetch(`${API_URL}${path}`, { ...options, headers: retryHeaders })
      if (!retry.ok) {
        const err = await retry.json().catch(() => ({}))
        throw new Error(err?.detail || 'Request failed after refresh')
      }
      if (retry.status === 204) return null as T
      return retry.json()
    } else {
      clearTokens()
      if (typeof window !== 'undefined') {
        window.location.href = '/dashboard/login'
      }
      throw new Error('Session expired')
    }
  }

  // ── Handle errors ─────────────────────────────────────────────────
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.detail || `Request failed: ${res.status}`)
  }

  if (res.status === 204) return null as T
  return res.json()
}

// ── Public API ────────────────────────────────────────────────────────────

export const api = {
  get: <T = any>(path: string) => apiFetch<T>(path),

  post: <T = any>(path: string, data?: any) =>
    apiFetch<T>(path, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T = any>(path: string, data?: any) =>
    apiFetch<T>(path, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T = any>(path: string) =>
    apiFetch<T>(path, { method: 'DELETE' }),
}

// ── Auth helpers ──────────────────────────────────────────────────────────

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