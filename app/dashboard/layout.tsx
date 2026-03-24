'use client'

import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from '@/context/authcontext'
import { initSecurity, cleanupSecurity } from '@/lib/security'
import Sidebar from '@/components/ui/Sidebar'
import { auth } from '@/lib/api'

// ── Init security on mount ────────────────────────────────────────────────

function SecurityLayer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initSecurity({
      blockShortcuts: true,
      onDevToolsDetected: () => {
        // Optional: you could redirect, log, or just ignore
        // auth.logout() // ← nuclear option
      },
    })
    return () => cleanupSecurity()
  }, [])

  return <>{children}</>
}

// ── Shell (sidebar + main content) ────────────────────────────────────────

function Shell({ children }: { children: React.ReactNode }) {
  const { loading, isAuthenticated } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  // Server + first client render: empty shell (prevents hydration mismatch)
  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cream">
        <div className="w-9 h-9 border-[3px] border-slate-200 border-t-navy rounded-full animate-spin-slow" />
      </div>
    )
  }

  // Not authenticated — render auth pages without sidebar
  if (!isAuthenticated) {
    return <div className="min-h-screen bg-cream">{children}</div>
  }

  // Authenticated — full dashboard shell
  return (
    <div className="flex min-h-screen bg-cream">
      <Sidebar />
      <main className="flex-1 p-8 max-md:p-5 overflow-y-auto max-h-screen">
        {children}
      </main>
    </div>
  )
}

// ── Layout Export ──────────────────────────────────────────────────────────

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SecurityLayer>
      <AuthProvider>
        
        <Shell>{children}</Shell>
      </AuthProvider>
    </SecurityLayer>
  )
}