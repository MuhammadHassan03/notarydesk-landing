'use client'

import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from '@/context/auth'
import { ThemeProvider } from '@/context/themecontext'
import { initSecurity, cleanupSecurity } from '@/lib/security'
import Sidebar from '@/components/ui/Sidebar'
import { MobileNav } from '@/components/ui/MobileNav'
import { GlobalSearch } from '@/components/ui/GlobalSearch'
import { NotificationBell } from '@/components/notifications/NotificationBell'
import { Icon } from '@/components/ui/icons'
import ThemeToggle from '@/components/ui/ThemeToggle'

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
      <main className="flex-1 min-w-0 h-screen overflow-y-auto">
        {/* Top bar */}
        <div className="max-w-[1200px] mx-auto px-8 pt-5 max-md:px-4 max-md:pt-3 flex items-center justify-between">
          {/* Mobile: logo */}
          <div className="md:hidden flex items-center gap-2">
            <span className="text-[15px] font-bold" style={{ color: 'var(--text)' }}>NotaryDesk</span>
          </div>
          {/* Right actions */}
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => (window as any).__openGlobalSearch?.()}
              title="Search (⌘K)"
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-[13px] font-medium transition-colors"
              style={{ background: 'var(--surface)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
            >
              <Icon name="search" size={16} style={{ color: 'inherit' }} />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden md:inline text-[11px] px-1.5 py-0.5 rounded"
                style={{ background: 'var(--card)', color: 'var(--text-tertiary)', border: '1px solid var(--border)' }}>
                ⌘K
              </kbd>
            </button>
            {/* Theme toggle — visible in topbar */}
            <ThemeToggle size="sm" />
            <NotificationBell />
          </div>
        </div>
        {/* Page content */}
        <div className="max-w-[1200px] mx-auto px-8 pb-8 max-md:px-4 max-md:pb-24">
          {children}
        </div>
      </main>

      <MobileNav />
      <GlobalSearch />
    </div>
  )
}

// ── Layout Export ──────────────────────────────────────────────────────────

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SecurityLayer>
        <AuthProvider>
          <Shell>{children}</Shell>
        </AuthProvider>
      </SecurityLayer>
    </ThemeProvider>
  )
}
