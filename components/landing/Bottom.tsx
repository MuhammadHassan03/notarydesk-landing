// components/landing/Bottom.tsx — Testimonials + FAQ, FinalCTA, Footer, BackToTop
// Material Symbols Rounded. Zero emojis.

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { TESTIMONIALS, FAQS } from '@/lib/content/landing'

const MI = ({ name, size = 18, className = '', style }: { name: string; size?: number; className?: string; style?: React.CSSProperties }) => (
  <span className={`material-symbols-rounded ${className}`} style={{ fontSize: size, lineHeight: 1, ...style }}>{name}</span>
)

// ═══════════════════════════════════════════════════════════════════════════
// Testimonials + FAQ
// ═══════════════════════════════════════════════════════════════════════════

const FAQ_ICONS: Record<number, string> = {
  0: 'gavel',
  1: 'route',
  2: 'phone_iphone',
  3: 'wifi_off',
  4: 'shield',
  5: 'groups',
}

export function Testimonials() {
  return (
    <>
      {/* ── Testimonials ──────────────────────────────────────── */}
      <section className="py-24" style={{ background: 'var(--bg)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-[11px] font-bold tracking-[2px] uppercase" style={{ color: 'var(--accent)' }}>Success Stories</span>
            <h2 className="text-3xl md:text-[40px] font-extrabold mt-4 -tracking-wider" style={{ color: 'var(--text)' }}>
              Built for <em className="not-italic" style={{ color: 'var(--accent)' }}>modern notaries.</em>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="rounded-2xl p-6 border transition-all hover:shadow-md hover:-translate-y-0.5"
                style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>

                {/* Stars */}
                <div className="flex items-center gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <MI key={i} name="star" size={16} style={{ color: 'var(--accent)' }} />
                  ))}
                </div>

                {/* Quote */}
                <div className="relative mb-5">
                  <MI name="format_quote" size={24} className="absolute -top-1 -left-1" style={{ color: 'var(--accent)', opacity: 0.15 }} />
                  <p className="text-sm leading-relaxed pl-4" style={{ color: 'var(--text-secondary)' }}>{t.quote}</p>
                </div>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4" style={{ borderTop: '1px solid var(--divider)' }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'var(--surface)', color: 'var(--primary)' }}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>{t.name}</p>
                    <p className="text-xs flex items-center gap-1" style={{ color: 'var(--text-tertiary)' }}>
                      <MI name="verified" size={12} style={{ color: 'var(--success)' }} />
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────── */}
      <section className="py-24" id="faq" style={{ background: 'var(--bg-page)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-[11px] font-bold tracking-[2px] uppercase" style={{ color: 'var(--accent)' }}>FAQ</span>
            <h2 className="text-3xl md:text-[40px] font-extrabold mt-4 -tracking-wider" style={{ color: 'var(--text)' }}>
              Common <em className="not-italic" style={{ color: 'var(--accent)' }}>questions.</em>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {FAQS.map((f, i) => (
              <div key={f.q} className="rounded-2xl p-6 border transition-all hover:shadow-sm"
                style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--surface)' }}>
                    <MI name={FAQ_ICONS[i] || 'help'} size={18} style={{ color: 'var(--primary)' }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--text)' }}>{f.q}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Still have questions? */}
          <div className="text-center mt-10">
            <p className="text-sm flex items-center justify-center gap-2" style={{ color: 'var(--text-tertiary)' }}>
              <MI name="mail" size={16} style={{ opacity: 0.5 }} />
              Still have questions?{' '}
              <a href="mailto:support@notarydesk.com" className="font-semibold no-underline" style={{ color: 'var(--primary)' }}>
                Reach out to us
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// FinalCTA
// ═══════════════════════════════════════════════════════════════════════════

export function FinalCTA() {
  return (
    <section className="py-24 relative overflow-hidden" style={{ background: 'var(--primary)' }}>
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }} />

      <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-6" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--accent)' }}>
          <MI name="trending_up" size={14} />
          Join 500+ notaries already organizing their business
        </div>

        <h2 className="text-3xl md:text-[44px] font-extrabold text-white -tracking-wider leading-tight">
          Ready to run your notary business<br />
          <em className="not-italic" style={{ color: 'var(--accent)' }}>like a pro?</em>
        </h2>
        <p className="mt-5 text-base text-white/50 max-w-lg mx-auto leading-relaxed">
          Join a growing community of mobile notaries using NotaryDesk to track miles, secure journals, and get paid faster.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <Link href="#download"
            className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-[15px] no-underline transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            style={{ background: 'var(--accent)', color: 'var(--primary)' }}>
            <MI name="rocket_launch" size={18} />
            Start Free Today
          </Link>
          <a href="#notify"
            className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-[15px] text-white border border-white/20 no-underline hover:bg-white/10 transition-all">
            <MI name="notifications_active" size={18} />
            Join Waitlist
          </a>
        </div>

        {/* Trust points */}
        <div className="flex flex-wrap justify-center gap-5 mt-10">
          {[
            { icon: 'credit_card_off', text: 'No credit card required' },
            { icon: 'shield', text: 'Secure & Encrypted' },
            { icon: 'event_repeat', text: 'Cancel any time' },
          ].map(t => (
            <span key={t.text} className="flex items-center gap-1.5 text-xs text-white/40 font-medium">
              <MI name={t.icon} size={14} style={{ opacity: 0.6 }} />
              {t.text}
            </span>
          ))}
        </div>

        {/* Big numbers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-14 pt-10" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          {[
            { v: '60s', l: 'To log any signing', icon: 'bolt' },
            { v: '100%', l: 'Digital compliance', icon: 'verified' },
            { v: '$1,600+', l: 'Avg tax deductions', icon: 'savings' },
            { v: '24/7', l: 'Priority support', icon: 'support_agent' },
          ].map(s => (
            <div key={s.l}>
              <MI name={s.icon} size={22} style={{ color: 'var(--accent)', opacity: 0.6 }} />
              <p className="text-2xl font-extrabold text-white mt-2">{s.v}</p>
              <p className="text-xs text-white/35 mt-1">{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// Footer
// ═══════════════════════════════════════════════════════════════════════════

const FOOTER_LINKS: { title: string; icon: string; links: { l: string; h?: string; icon: string }[] }[] = [
  {
    title: 'Product',
    icon: 'widgets',
    links: [
      { l: 'Features', h: '#features', icon: 'star' },
      { l: 'How It Works', h: '#how', icon: 'play_circle' },
      { l: 'Pricing', h: '#pricing', icon: 'sell' },
      { l: 'FAQ', h: '#faq', icon: 'help' },
    ],
  },
  {
    title: 'Key Features',
    icon: 'menu_book',
    links: [
      { l: 'Digital Journal', h: '#features', icon: 'menu_book' },
      { l: 'Mileage Tracking', h: '#features', icon: 'route' },
      { l: 'Invoicing', h: '#features', icon: 'receipt_long' },
      { l: 'Appointments', h: '#features', icon: 'calendar_month' },
    ],
  },
  {
    title: 'Coming Soon',
    icon: 'update',
    links: [
      { l: 'ID Scanning', icon: 'document_scanner' },
      { l: 'Digital Payments', icon: 'credit_card' },
      { l: 'Offline Access', icon: 'cloud_off' },
      { l: 'Team Mode', icon: 'groups' },
    ],
  },
  {
    title: 'Legal',
    icon: 'gavel',
    links: [
      { l: 'Privacy Policy', h: '/privacy', icon: 'policy' },
      { l: 'Terms of Service', h: '/terms', icon: 'description' },
      { l: 'Contact Support', h: 'mailto:support@notarydesk.com', icon: 'mail' },
    ],
  },
]

export function Footer() {
  return (
    <footer style={{ background: 'var(--footer-bg)', color: 'rgba(255,255,255,0.45)' }}>
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-14">

          {/* Brand */}
          <div className="lg:w-[300px]">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-xl font-extrabold text-lg flex items-center justify-center" style={{ background: 'var(--accent)', color: 'var(--primary)' }}>N</div>
              <span className="font-bold text-lg text-white">NotaryDesk</span>
            </div>
            <p className="text-sm mb-2 text-white/60 font-medium">Your Mobile Notary Business, Organized.</p>
            <p className="text-xs leading-relaxed mb-5">The only modern, mobile-first platform built exclusively for professional mobile notaries.</p>

            {/* Contact */}
            <a href="mailto:support@notarydesk.com" className="inline-flex items-center gap-2 text-xs text-white/35 no-underline hover:text-white/60 transition-colors">
              <MI name="mail" size={14} />
              support@notarydesk.com
            </a>

            {/* Social links */}
            <div className="flex items-center gap-3 mt-5">
              {[
                { icon: 'open_in_new', label: 'Twitter / X', h: '#' },
                { icon: 'open_in_new', label: 'LinkedIn', h: '#' },
                { icon: 'open_in_new', label: 'Facebook', h: '#' },
              ].map(s => (
                <a key={s.label} href={s.h} aria-label={s.label}
                  className="w-8 h-8 rounded-lg flex items-center justify-center no-underline hover:bg-white/10 transition-colors"
                  style={{ color: 'rgba(255,255,255,0.4)' }}>
                  <MI name={s.icon} size={16} />
                </a>
              ))}
            </div>

            {/* Platform badges */}
            <div className="flex items-center gap-2 mt-5">
              <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: 'rgba(39,174,96,0.15)', color: '#4ADE80' }}>
                <MI name="android" size={12} />
                Android
              </span>
              <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}>
                <MI name="phone_iphone" size={12} />
                iOS Soon
              </span>
              <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: 'rgba(59,130,246,0.15)', color: '#60A5FA' }}>
                <MI name="language" size={12} />
                Web App
              </span>
            </div>
          </div>

          {/* Link columns */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-8">
            {FOOTER_LINKS.map(col => (
              <div key={col.title}>
                <h4 className="text-[11px] font-bold tracking-[1.5px] uppercase text-white/70 mb-4 flex items-center gap-1.5">
                  <MI name={col.icon} size={13} style={{ opacity: 0.5 }} />
                  {col.title}
                </h4>
                <div className="flex flex-col gap-3">
                  {col.links.map(link => (
                    link.h
                      ? <a key={link.l} href={link.h} className="flex items-center gap-1.5 text-xs no-underline hover:text-white/70 transition-colors">
                          <MI name={link.icon || 'chevron_right'} size={13} style={{ opacity: 0.4 }} />
                          {link.l}
                        </a>
                      : <span key={link.l} className="flex items-center gap-1.5 text-xs text-white/25">
                          <MI name={link.icon || 'chevron_right'} size={13} style={{ opacity: 0.3 }} />
                          {link.l}
                        </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-[1200px] mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p className="flex items-center gap-1.5">
            <MI name="copyright" size={13} style={{ opacity: 0.4 }} />
            {new Date().getFullYear()} NotaryDesk. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <a href="/privacy" className="flex items-center gap-1 no-underline hover:text-white/70 transition-colors">
              <MI name="policy" size={12} style={{ opacity: 0.4 }} />
              Privacy
            </a>
            <span style={{ opacity: 0.3 }}>·</span>
            <a href="/terms" className="flex items-center gap-1 no-underline hover:text-white/70 transition-colors">
              <MI name="description" size={12} style={{ opacity: 0.4 }} />
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// BackToTop
// ═══════════════════════════════════════════════════════════════════════════

export function BackToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!show) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5 border-none cursor-pointer"
      style={{ background: 'var(--primary)', color: 'white' }}
      aria-label="Back to top"
    >
      <MI name="keyboard_arrow_up" size={22} />
    </button>
  )
}