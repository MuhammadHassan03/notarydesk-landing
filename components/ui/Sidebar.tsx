'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/auth'
import { NAV_ITEMS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Icon } from '@/components/ui/icons'
import ThemeToggle from '@/components/ui/ThemeToggle'

function getInitials(name: string | null): string {
  if (!name) return 'N'
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, displayName, plan, signOut } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const isFree = !plan || plan === 'free'

  if (!isAuthenticated) return null

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : pathname?.startsWith(href)

  return (
    <aside
      className={cn(
        'flex flex-col flex-shrink-0 h-screen sticky top-0 transition-all duration-200 max-md:hidden',
        collapsed ? 'w-[72px]' : 'w-[260px]',
      )}
      style={{ background: 'var(--sidebar-bg)' }}
    >
      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-5" style={{ borderBottom: '1px solid var(--sidebar-border)' }}>
        <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0 no-underline">
          <Image
            src="/icon-192.png"
            alt="NotaryDesk"
            width={36}
            height={36}
            className="rounded-xl shrink-0"
          />
          {!collapsed && (
            <span className="font-bold text-[17px] -tracking-wide text-white truncate">NotaryDesk</span>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(c => !c)}
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors border-none cursor-pointer"
          style={{ background: 'var(--sidebar-hover)', color: 'var(--sidebar-text)' }}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Icon name={collapsed ? 'chevron_right' : 'chevron_left'} size={16} />
        </button>
      </div>

      {/* ── Navigation ──────────────────────────────────────── */}
      <nav className="flex-1 flex flex-col gap-0.5 p-2 pt-3 overflow-y-auto">
        {NAV_ITEMS.map(item => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                'group flex items-center gap-3 rounded-xl text-sm font-medium no-underline transition-all duration-150',
                collapsed ? 'justify-center px-0 py-2.5' : 'px-3 py-2.5',
              )}
              style={{
                background: active ? 'var(--sidebar-active)' : 'transparent',
                color: active ? 'var(--accent)' : 'var(--sidebar-text)',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--sidebar-hover)' }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = active ? 'var(--sidebar-active)' : 'transparent' }}
            >
              <Icon name={item.icon as any} size={20} />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {active && collapsed && (
                <span className="absolute left-0 w-[3px] h-5 rounded-r-full" style={{ background: 'var(--accent)' }} />
              )}
            </Link>
          )
        })}
      </nav>

      {/* ── Upgrade upsell (free users only) ────────────────── */}
      {isFree && !collapsed && (
        <div className="mx-3 mb-3 p-3.5 rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
          style={{ background: 'linear-gradient(135deg, var(--accent) 0%, #e6b84a 100%)' }}
          onClick={() => router.push('/dashboard/upgrade')}>
          <div className="flex items-center gap-1.5 mb-1">
            <Icon name="rocket_launch" size={14} style={{ color: '#1B3A5C' }} />
            <span className="text-[11px] font-bold" style={{ color: '#1B3A5C' }}>Upgrade to Pro</span>
          </div>
          <p className="text-[10px] leading-relaxed" style={{ color: '#1B3A5C', opacity: 0.75 }}>
            Unlimited jobs · PDF exports · Analytics
          </p>
        </div>
      )}

      {/* ── Footer ──────────────────────────────────────────── */}
      <div className="p-3" style={{ borderTop: '1px solid var(--sidebar-border)' }}>
        <div className={cn('mb-3 flex', collapsed ? 'justify-center' : 'justify-start')}>
          <ThemeToggle size="sm" showLabel={!collapsed} />
        </div>

        <div className={cn(
          'flex items-center gap-2.5 p-2 rounded-xl transition-colors',
          collapsed ? 'justify-center' : '',
        )} style={{ background: 'var(--sidebar-hover)' }}>
          <span className="w-9 h-9 rounded-xl font-bold text-[12px] flex items-center justify-center shrink-0"
            style={{ background: 'var(--accent)', color: 'var(--text-on-accent)' }}
            title={collapsed ? displayName || 'User' : undefined}>
            {getInitials(displayName)}
          </span>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-white truncate">{displayName || 'Notary'}</p>
              <p className="text-[11px] flex items-center gap-1" style={{ color: 'var(--sidebar-text)' }}>
                <Icon name={plan === 'pro' ? 'star' : plan === 'business' ? 'verified' : 'explore'} size={11} style={{ color: 'var(--accent)' }} />
                {(plan || 'free').charAt(0).toUpperCase() + (plan || 'free').slice(1)} plan
              </p>
            </div>
          )}
        </div>

        {!collapsed ? (
          <button onClick={signOut}
            className="w-full mt-2 py-2.5 rounded-xl bg-transparent text-xs font-medium transition-colors cursor-pointer flex items-center justify-center gap-2"
            style={{ border: '1px solid var(--sidebar-border)', color: 'var(--sidebar-text)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--sidebar-hover)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
            <Icon name="logout" size={14} /> Sign out
          </button>
        ) : (
          <button onClick={signOut}
            className="w-full mt-2 py-2 rounded-xl bg-transparent flex items-center justify-center transition-colors cursor-pointer border-none"
            style={{ color: 'var(--sidebar-text)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--sidebar-hover)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
            title="Sign out">
            <Icon name="logout" size={16} />
          </button>
        )}
      </div>
    </aside>
  )
}