'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Icon } from '@/components/ui/icons'
import { useTheme } from '@/context/themecontext'

const NAV_LINKS = [
  { href: '#features', label: 'Features', icon: 'widgets' },
  { href: '#how', label: 'How It Works', icon: 'play_circle' },
  { href: '#pricing', label: 'Pricing', icon: 'sell' },
  { href: '#faq', label: 'FAQ', icon: 'help' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const { isDark, toggleTheme } = useTheme()

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
      const sections = NAV_LINKS.map(l => l.href.replace('#', ''))
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i])
        if (el && el.getBoundingClientRect().top <= 120) { setActive(sections[i]); return }
      }
      setActive('')
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const close = useCallback(() => setOpen(false), [])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'var(--nav-glass)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px) saturate(180%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px) saturate(180%)' : 'none',
        boxShadow: scrolled ? '0 1px 0 var(--border)' : 'none',
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-[68px] flex items-center justify-between">

        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 no-underline group">
          <Image
            src="/icon-192.png"
            alt="NotaryDesk"
            width={36}
            height={36}
            className="rounded-xl transition-transform group-hover:scale-105"
          />
          <span className="font-bold text-[17px] -tracking-wide hidden sm:inline" style={{ color: 'var(--primary)' }}>NotaryDesk</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map(l => {
            const isActive = active === l.href.replace('#', '')
            return (
              <a key={l.href} href={l.href}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px] font-medium no-underline transition-all"
                style={{
                  color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                  background: isActive ? 'var(--primary-light, rgba(27,58,92,0.06))' : 'transparent',
                }}>
                {l.label}
              </a>
            )
          })}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors border-none cursor-pointer"
            style={{ background: 'var(--surface)', color: 'var(--text-secondary)' }}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <Icon name={isDark ? 'light_mode' : 'dark_mode'} size={18} />
          </button>
          <Link href="/dashboard/login"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-semibold no-underline transition-all"
            style={{ color: 'var(--primary)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--nav-hover)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
            <Icon name="login" size={16} />
            Sign In
          </Link>
          <Link href="/dashboard/register"
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[13px] font-bold text-white no-underline transition-all shadow-sm hover:shadow-md hover:-translate-y-px"
            style={{ background: 'var(--primary)' }}>
            <Icon name="rocket_launch" size={15} />
            Start Free
          </Link>
        </div>

        {/* Mobile: theme toggle + burger */}
        <div className="lg:hidden flex items-center gap-1.5">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors border-none cursor-pointer"
            style={{ background: 'var(--surface)', color: 'var(--text-secondary)' }}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <Icon name={isDark ? 'light_mode' : 'dark_mode'} size={18} />
          </button>
        <button
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors border-none cursor-pointer"
          style={{ background: open ? 'var(--primary-light, rgba(27,58,92,0.06))' : 'transparent' }}
          onClick={() => setOpen(o => !o)}
          aria-label="Menu"
          aria-expanded={open}
        >
          <Icon name={open ? 'close' : 'menu'} size={22} style={{ color: 'var(--primary)' }} />
        </button>
        </div>
      </div>

      {/* ── Mobile menu ──────────────────────────────────────── */}
      <div
        className="lg:hidden absolute top-[68px] left-0 right-0 transition-all duration-300 ease-out"
        style={{
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0)' : 'translateY(-8px)',
          pointerEvents: open ? 'auto' : 'none',
          background: 'var(--card)',
          borderBottom: '1px solid var(--border)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        }}
      >
        <div className="px-6 py-6">
          <div className="flex flex-col gap-1 mb-6">
            {NAV_LINKS.map(l => {
              const isActive = active === l.href.replace('#', '')
              return (
                <a key={l.href} href={l.href} onClick={close}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium no-underline transition-all"
                  style={{
                    color: isActive ? 'var(--primary)' : 'var(--text)',
                    background: isActive ? 'var(--primary-light, rgba(27,58,92,0.06))' : 'transparent',
                  }}>
                  <Icon name={l.icon} size={20} style={{ color: isActive ? 'var(--primary)' : 'var(--text-tertiary)' }} />
                  {l.label}
                </a>
              )
            })}
          </div>

          <div className="h-px mb-5" style={{ background: 'var(--divider)' }} />

          <div className="flex flex-col gap-3">
            <Link href="/dashboard/login" onClick={close}
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl text-[15px] font-semibold no-underline transition-all"
              style={{ color: 'var(--primary)', border: '1.5px solid var(--border)' }}>
              <Icon name="login" size={18} />
              Sign In to Dashboard
            </Link>
            <Link href="/dashboard/register" onClick={close}
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl text-[15px] font-bold text-white no-underline transition-all"
              style={{ background: 'var(--primary)' }}>
              <Icon name="rocket_launch" size={18} />
              Start Free — No Credit Card
            </Link>
          </div>

          <p className="text-center mt-5 text-[11px] flex items-center justify-center gap-1.5" style={{ color: 'var(--text-tertiary)' }}>
            <Icon name="devices" size={13} style={{ opacity: 0.5 }} />
            Web Dashboard · Android App · iOS Coming Soon
          </p>
        </div>
      </div>

      {open && (
        <div className="lg:hidden fixed inset-0 top-[68px] -z-10" style={{ background: 'rgba(0,0,0,0.3)' }} onClick={close} />
      )}
    </header>
  )
}