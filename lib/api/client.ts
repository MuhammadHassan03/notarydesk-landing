import axios, { AxiosError, type AxiosRequestConfig } from 'axios'
import { getStoredTokens, storeTokens, clearTokens } from './tokens'

// export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
export const API_URL = 'http://localhost:8000/api/v1'

// ── Axios instance ───────────────────────────────────────────────────────

const http = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
})

// Attach auth token to every request
http.interceptors.request.use((config) => {
  const { access } = getStoredTokens()
  if (access) config.headers.Authorization = `Bearer ${access}`
  return config
})

// ── Token refresh (single-flight) ────────────────────────────────────────

let refreshPromise: Promise<boolean> | null = null

async function refreshAccessToken(): Promise<boolean> {
  const { refresh } = getStoredTokens()
  if (!refresh) return false

  try {
    const { data } = await axios.post(`${API_URL}/auth/refresh`, { refresh_token: refresh })
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

// 401 interceptor — retry once after refreshing token
http.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as AxiosRequestConfig & { _retried?: boolean }
    if (error.response?.status !== 401 || original._retried) {
      return Promise.reject(error)
    }

    original._retried = true

    if (!refreshPromise) refreshPromise = refreshAccessToken()
    const refreshed = await refreshPromise
    refreshPromise = null

    if (refreshed) {
      const { access } = getStoredTokens()
      if (access && original.headers) {
        original.headers.Authorization = `Bearer ${access}`
      }
      return http(original)
    }

    clearTokens()
    if (typeof window !== 'undefined') window.location.href = '/dashboard/login'
    return Promise.reject(new Error('Session expired'))
  },
)

// ── Unwrap envelope: { ok, data } → data ─────────────────────────────────

function unwrap<T>(responseData: any): T {
  if (responseData && typeof responseData === 'object' && 'ok' in responseData && 'data' in responseData) {
    return responseData.data as T
  }
  return responseData as T
}

function extractError(err: unknown): never {
  if (err instanceof AxiosError) {
    const body = err.response?.data
    const msg = body?.detail || body?.error?.message || err.message
    throw new Error(msg)
  }
  throw err
}

// ── Public API ────────────────────────────────────────────────────────────

export const api = {
  async get<T = any>(path: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const { data } = await http.get(path, config)
      return unwrap<T>(data)
    } catch (e) { return extractError(e) }
  },

  async post<T = any>(path: string, body?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const { data } = await http.post(path, body, config)
      return unwrap<T>(data)
    } catch (e) { return extractError(e) }
  },

  async patch<T = any>(path: string, body?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const { data } = await http.patch(path, body, config)
      return unwrap<T>(data)
    } catch (e) { return extractError(e) }
  },

  async delete<T = any>(path: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const { data } = await http.delete(path, config)
      return unwrap<T>(data)
    } catch (e) { return extractError(e) }
  },
}
