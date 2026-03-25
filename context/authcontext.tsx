'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { api, auth } from '@/lib/api'

// ── Types ─────────────────────────────────────────────────────────────────

interface AuthContextValue {
  isAuthenticated: boolean
  displayName: string | null
  plan: string | null
  loading: boolean
  signIn: (accessToken: string, refreshToken: string) => void
  signOut: () => void
  refreshProfile: () => Promise<void>
}

export interface Profile {
  id: string
  full_name: string
  email: string
  phone?: string
  commission_number?: string
  state?: string
  business_name?: string
  business_address?: string
  default_fee?: number
  avatar_url?: string
  years_experience?: string
  plan: string
}

// ── Context ───────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  displayName: null,
  plan: null,
  loading: true,
  signIn: () => {},
  signOut: () => {},
  refreshProfile: async () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}

// ── Profile cache ─────────────────────────────────────────────────────────

let _cachedProfile: Profile | null = null

export function useProfile() {
  const { isAuthenticated } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(_cachedProfile)
  const [loading, setLoading] = useState(!_cachedProfile)

  useEffect(() => {
    if (!isAuthenticated) return
    if (_cachedProfile) {
      setProfile(_cachedProfile)
      setLoading(false)
      return
    }

    let cancelled = false
    api.get<Profile>('/auth/me')
      .then(data => {
        if (cancelled) return
        _cachedProfile = data
        setProfile(data)
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [isAuthenticated])

  return { profile, loading }
}

// ── Public paths (no auth required) ───────────────────────────────────────

const PUBLIC_PATHS = [
  '/dashboard/login',
  '/dashboard/register',
  '/dashboard/otp',
  '/dashboard/forgot-password',
  '/dashboard/new-password',
  '/dashboard/onboarding',
]

function isPublicPath(pathname: string | null): boolean {
  if (!pathname) return false
  return PUBLIC_PATHS.some(p => pathname.startsWith(p))
}

// ── Token storage helpers ─────────────────────────────────────────────────

const TK_ACCESS = 'at_v1'
const TK_REFRESH = 'rt_v1'

function storeTokens(access: string, refresh: string) {
  try {
    // Use the same storage mechanism as api.ts
    const { secureStorage } = require('@/lib/security')
    secureStorage.set(TK_ACCESS, access)
    secureStorage.set(TK_REFRESH, refresh)
  } catch {
    // Fallback to sessionStorage if secureStorage not available
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(TK_ACCESS, access)
      sessionStorage.setItem(TK_REFRESH, refresh)
    }
  }
}

// ── Provider ──────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [displayName, setDisplayName] = useState<string | null>(null)
  const [plan, setPlan] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const checkedRef = useRef(false)

  // ── Check existing session on mount ─────────────────────────────
  useEffect(() => {
    if (checkedRef.current) return
    checkedRef.current = true
    checkAuth()
  }, [])

  async function checkAuth() {
    if (!auth.isLoggedIn()) {
      setLoading(false)
      return
    }

    try {
      const profile = await api.get<Profile>('/auth/me')
      _cachedProfile = profile
      setIsAuthenticated(true)
      setDisplayName(profile.full_name || profile.email?.split('@')[0] || null)
      setPlan(profile.plan || 'free')
    } catch {
      auth.logout()
      _cachedProfile = null
      setIsAuthenticated(false)
      setDisplayName(null)
      setPlan(null)
    }

    setLoading(false)
  }

  // ── Route protection ────────────────────────────────────────────
  useEffect(() => {
    if (loading) return
    const pub = isPublicPath(pathname)

    if (!isAuthenticated && !pub && pathname?.startsWith('/dashboard')) {
      router.replace('/dashboard/login')
    }
    if (isAuthenticated && pub) {
      router.replace('/dashboard')
    }
  }, [isAuthenticated, loading, pathname, router])

  // ── Sign in (called by login, register, OTP pages after getting tokens) ──
  const signIn = useCallback((accessToken: string, refreshToken: string) => {
    storeTokens(accessToken, refreshToken)
    setIsAuthenticated(true)

    // Fetch profile in background
    api.get<Profile>('/auth/me')
      .then(profile => {
        _cachedProfile = profile
        setDisplayName(profile.full_name || profile.email?.split('@')[0] || null)
        setPlan(profile.plan || 'free')
      })
      .catch(() => {})
  }, [])

  // ── Sign out ────────────────────────────────────────────────────
  const signOut = useCallback(() => {
    _cachedProfile = null
    setIsAuthenticated(false)
    setDisplayName(null)
    setPlan(null)
    auth.logout()
  }, [])

  // ── Refresh profile (after settings update, etc.) ───────────────
  const refreshProfile = useCallback(async () => {
    try {
      const profile = await api.get<Profile>('/auth/me')
      _cachedProfile = profile
      setDisplayName(profile.full_name || profile.email?.split('@')[0] || null)
      setPlan(profile.plan || 'free')
    } catch {}
  }, [])

  const value: AuthContextValue = {
    isAuthenticated,
    displayName,
    plan,
    loading,
    signIn,
    signOut,
    refreshProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}