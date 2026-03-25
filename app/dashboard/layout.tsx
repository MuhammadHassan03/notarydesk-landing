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
      onDevToolsDetected: () => {},
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

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen"
        style={{ background: 'var(--bg-page)' }}>
        <div className="w-9 h-9 border-[3px] rounded-full animate-spin-slow"
          style={{ borderColor: 'var(--border)', borderTopColor: 'var(--primary)' }} />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--bg-page)' }}>
        {children}
      </div>
    )
  }

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-page)' }}>
      <Sidebar />
      {/*
        min-w-0  → prevents flex child from overflowing when sidebar is open
        h-screen + overflow-y-auto → sidebar stays fixed, content scrolls independently
        max-w + mx-auto on inner div → content doesn't stretch to infinity on ultrawide
      */}
      <main className="flex-1 min-w-0 h-screen overflow-y-auto">
        <div className="max-w-[1200px] mx-auto px-8 py-8 max-md:px-5 max-md:py-5">
          {children}
        </div>
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