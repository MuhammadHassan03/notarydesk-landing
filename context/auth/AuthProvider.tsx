'use client'

import {
  createContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { api, auth, storeTokens } from '@/lib/api'
import type { Profile } from '@/lib/types'

// ── Types ─────────────────────────────────────────────────────────────────

export interface AuthContextValue {
  isAuthenticated: boolean
  displayName: string | null
  plan: string | null
  loading: boolean
  signIn: (accessToken: string, refreshToken: string) => void
  signOut: () => void
  refreshProfile: () => Promise<void>
}

// ── Context + profile cache (shared with hooks) ──────────────────────────

export const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  displayName: null,
  plan: null,
  loading: true,
  signIn: () => {},
  signOut: () => {},
  refreshProfile: async () => {},
})

export let _cachedProfile: Profile | null = null
export function _setCachedProfile(p: Profile | null) { _cachedProfile = p }

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

// ── Provider ──────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [displayName, setDisplayName] = useState<string | null>(null)
  const [plan, setPlan] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  // needsOnboarding is set to true when profile has no full_name.
  // It's React state so the route-protection effect re-runs when it changes.
  const [needsOnboarding, setNeedsOnboarding] = useState(false)
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
      setNeedsOnboarding(!profile.full_name)
    } catch {
      auth.logout()
      _cachedProfile = null
      setIsAuthenticated(false)
      setDisplayName(null)
      setPlan(null)
      setNeedsOnboarding(false)
    }

    setLoading(false)
  }

  // ── Route protection ────────────────────────────────────────────
  useEffect(() => {
    if (loading) return
    const pub = isPublicPath(pathname)

    if (!isAuthenticated && !pub && pathname?.startsWith('/dashboard')) {
      router.replace('/dashboard/login')
      return
    }
    if (isAuthenticated && pub && !needsOnboarding) {
      router.replace('/dashboard')
      return
    }
    // New users: redirect to onboarding if profile incomplete
    if (isAuthenticated && needsOnboarding && pathname !== '/dashboard/onboarding') {
      router.replace('/dashboard/onboarding')
    }
  }, [isAuthenticated, loading, needsOnboarding, pathname, router])

  // ── Sign in ───────────────────────────────────────────────────────
  const signIn = useCallback((accessToken: string, refreshToken: string) => {
    storeTokens(accessToken, refreshToken)
    setIsAuthenticated(true)

    api.get<Profile>('/auth/me')
      .then(profile => {
        _cachedProfile = profile
        setDisplayName(profile.full_name || profile.email?.split('@')[0] || null)
        setPlan(profile.plan || 'free')
        // Setting state triggers route-protection effect above
        setNeedsOnboarding(!profile.full_name)
      })
      .catch(() => {})
  }, [])

  // ── Sign out ──────────────────────────────────────────────────────
  const signOut = useCallback(() => {
    _cachedProfile = null
    setIsAuthenticated(false)
    setDisplayName(null)
    setPlan(null)
    setNeedsOnboarding(false)
    auth.logout()
  }, [])

  // ── Refresh profile ───────────────────────────────────────────────
  const refreshProfile = useCallback(async () => {
    try {
      const profile = await api.get<Profile>('/auth/me')
      _cachedProfile = profile
      setDisplayName(profile.full_name || profile.email?.split('@')[0] || null)
      setPlan(profile.plan || 'free')
      // Clear onboarding flag once profile is complete
      if (profile.full_name) setNeedsOnboarding(false)
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
