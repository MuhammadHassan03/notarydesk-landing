'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Icon } from '@/components/ui/icons'
import { Button } from '@/components/ui'
import { ONBOARDING_FEATURES, type OnboardingFeature } from '@/lib/onboarding-content'

/**
 * Onboarding Page — Web Dashboard
 * =================================
 * Shown to new users after registration.
 * Web-native layout: welcome hero → feature grid → CTA.
 * NOT a mobile swipe pattern.
 */

function FeatureCard({ feature, index }: { feature: OnboardingFeature; index: number }) {
  return (
    <div
      className="rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        animationDelay: `${index * 80}ms`,
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: feature.color + '12' }}
        >
          <Icon name={feature.icon} size={22} style={{ color: feature.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-bold mb-1" style={{ color: 'var(--text)' }}>
            {feature.title}
          </h3>
          <p className="text-[13px] leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
            {feature.description}
          </p>
          <div className="flex flex-col gap-1.5">
            {feature.highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-2">
                <Icon name="check_circle" size={13} style={{ color: feature.color, flexShrink: 0 }} />
                <span className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>{h}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function QuickAction({ icon, label, href, color }: {
  icon: string; label: string; href: string; color: string
}) {
  return (
    <Link href={href} className="no-underline">
      <div
        className="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-150 hover:-translate-y-px hover:shadow-sm cursor-pointer"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
      >
        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: color + '12' }}>
          <Icon name={icon as any} size={18} style={{ color }} />
        </div>
        <span className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>{label}</span>
        <Icon name="arrow_forward" size={14} style={{ color: 'var(--text-tertiary)', marginLeft: 'auto' }} />
      </div>
    </Link>
  )
}

export default function OnboardingPage() {
  const router = useRouter()
  const [showFeatures, setShowFeatures] = useState(false)

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-page)' }}>

      {/* ── Top bar ──────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-6 py-4 max-w-[1100px] mx-auto">
        <div className="flex items-center gap-2.5">
          <Image src="/icon-192.png" alt="NotaryDesk" width={32} height={32} className="rounded-lg" />
          <span className="font-bold text-[15px]" style={{ color: 'var(--primary)' }}>NotaryDesk</span>
        </div>
        <Link href="/dashboard" className="text-[13px] font-semibold no-underline hover:underline"
          style={{ color: 'var(--text-secondary)' }}>
          Skip to dashboard →
        </Link>
      </header>

      <div className="max-w-[1100px] mx-auto px-6 pb-16">

        {/* ── Welcome hero ─────────────────────────────────────── */}
        <div className="rounded-2xl p-8 sm:p-12 mb-8 text-center relative overflow-hidden"
          style={{ background: 'var(--primary)' }}>

          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full opacity-[0.04]"
            style={{ background: 'var(--accent)', transform: 'translate(30%, -40%)' }} />
          <div className="absolute bottom-0 left-0 w-[200px] h-[200px] rounded-full opacity-[0.04]"
            style={{ background: '#fff', transform: 'translate(-30%, 40%)' }} />

          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center"
              style={{ background: 'rgba(201,168,76,0.15)' }}>
              <Icon name="rocket_launch" size={32} style={{ color: 'var(--accent)' }} />
            </div>

            <h1 className="text-[28px] sm:text-[36px] font-extrabold text-white leading-tight mb-3">
              Welcome to NotaryDesk
            </h1>
            <p className="text-[15px] sm:text-[17px] leading-relaxed max-w-[520px] mx-auto"
              style={{ color: 'rgba(255,255,255,0.6)' }}>
              Your all-in-one notary business management platform.
              Here's everything you can do from your dashboard.
            </p>

            {/* Stats strip */}
            <div className="flex items-center justify-center gap-6 sm:gap-10 mt-8 pt-6"
              style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              {[
                { value: '6', label: 'Modules' },
                { value: '50', label: 'States covered' },
                { value: '$0', label: 'Forever free' },
              ].map(s => (
                <div key={s.label}>
                  <div className="text-[24px] font-extrabold" style={{ color: 'var(--accent)' }}>{s.value}</div>
                  <div className="text-[12px] opacity-50 text-white">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Feature grid ─────────────────────────────────────── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-5">
            <Icon name="widgets" size={18} style={{ color: 'var(--primary)' }} />
            <h2 className="text-[14px] font-bold tracking-[1px] uppercase" style={{ color: 'var(--text-secondary)' }}>
              What's included
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ONBOARDING_FEATURES.map((f, i) => (
              <FeatureCard key={f.title} feature={f} index={i} />
            ))}
          </div>
        </div>

        {/* ── Quick start ──────────────────────────────────────── */}
        <div className="rounded-2xl p-6 mb-8" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2 mb-4">
            <Icon name="play_circle" size={18} style={{ color: 'var(--primary)' }} />
            <h2 className="text-[14px] font-bold tracking-[1px] uppercase" style={{ color: 'var(--text-secondary)' }}>
              Quick start — try these first
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <QuickAction icon="work"                    label="Create a signing job"   href="/dashboard/jobs/new"     color="#1B3A5C" />
            <QuickAction icon="menu_book"               label="Log a journal entry"    href="/dashboard/journal/new"  color="#2563EB" />
            <QuickAction icon="route"                   label="Track a trip"           href="/dashboard/mileage/new"  color="#16A34A" />
            <QuickAction icon="account_balance_wallet"  label="Add an expense"         href="/dashboard/expenses/new" color="#D97706" />
          </div>
        </div>

        {/* ── CTA ──────────────────────────────────────────────── */}
        <div className="flex flex-col items-center gap-4">
          <Button variant="gold" size="lg" onClick={() => router.push('/dashboard')}>
            <Icon name="dashboard" size={18} style={{ color: 'inherit' }} />
            Go to your dashboard
          </Button>
          <p className="text-[13px]" style={{ color: 'var(--text-tertiary)' }}>
            You can always access these features from the sidebar
          </p>
        </div>
      </div>
    </div>
  )
}