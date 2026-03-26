'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/auth'
import { useDashboardStats } from '@/hooks/use-dashboard'
import { useJobs } from '@/hooks/use-jobs'
import { currency, greeting, firstName } from '@/lib/utils'
import { downloadPdf } from '@/lib/utils/pdf'
import { JOB_STATUS_CONFIG, PAYMENT_STATUS_CONFIG, JOB_PIPELINE } from '@/lib/constants'
import type { SigningJob } from '@/lib/types'

import { Button, DataTable, StatusBadge, Toast } from '@/components/ui'
import { PageHeader, StatsGrid, StatCard, TaxCard, EmptyState } from '@/components/layout'
import type { Column } from '@/components/ui/DataTable'
import { Icon } from '@/components/ui/icons'


const JOB_COLUMNS: Column<SigningJob>[] = [
  { key: 'num', header: '#', width: '60px', render: j => <span className="font-semibold" style={{ color: 'var(--text-tertiary)' }}>#{j.job_number || '—'}</span> },
  { key: 'signer', header: 'Signer', render: j => <span className="font-semibold">{j.signer_name}</span> },
  { key: 'doc', header: 'Document', render: j => <span style={{ color: 'var(--text-secondary)' }}>{j.document_type || '—'}</span> },
  { key: 'amount', header: 'Amount', render: j => <span className="font-bold">{currency(j.fee + (j.travel_fee || 0))}</span>, sortable: true, sortValue: j => j.fee + (j.travel_fee || 0) },
  { key: 'status', header: 'Status', render: j => <StatusBadge status={j.status} config={JOB_STATUS_CONFIG} /> },
  { key: 'pay', header: 'Payment', render: j => <StatusBadge status={j.payment_status} config={PAYMENT_STATUS_CONFIG} /> },
]

export default function DashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { displayName, refreshProfile } = useAuth()
  const { stats, loading: statsLoading, refresh: refreshStats } = useDashboardStats()
  const { jobs, loading: jobsLoading, refresh: refreshJobs } = useJobs()
  const [exporting, setExporting] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'info' } | null>(null)

  // Re-fetch when tab becomes visible (user returns from another tab/window)
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        refreshStats()
        refreshJobs()
      }
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [refreshStats, refreshJobs])

  // Show success message after Lemon Squeezy redirect
  useEffect(() => {
    if (searchParams.get('upgraded') === '1') {
      refreshProfile()
      setToast({ msg: '🎉 Welcome to Pro! Your plan has been upgraded.', type: 'success' })
      router.replace('/dashboard')
    }
  }, [searchParams, refreshProfile, router])

  const handleExportTax = async () => {
    setExporting(true)
    try {
      const year = new Date().getFullYear()
      await downloadPdf(`/dashboard/tax-summary-pdf?year=${year}`, `notarydesk-tax-summary-${year}.pdf`)
    } catch { /* ignore */ }
    setExporting(false)
  }

  const recentJobs = useMemo(() => jobs.slice(0, 8), [jobs])

  const taxSavings = useMemo(() => {
    if (!stats) return 0
    return (
      (stats.ytd_mileage_deduction || 0) +
      (stats.ytd_expenses || 0) +
      (stats.ytd_notarial_acts_deduction || 0) +
      100
    ) * 0.3
  }, [stats])

  const taxChips = useMemo(() => {
    if (!stats) return []
    return [
      { label: 'mileage deduction', value: currency(stats.ytd_mileage_deduction) },
      { label: 'notarial acts deduction', value: currency(stats.ytd_notarial_acts_deduction || 0) },
      { label: 'expenses', value: currency(stats.ytd_expenses) },
      { label: 'miles driven', value: String(Math.round(stats.ytd_miles || 0)) },
    ]
  }, [stats])

  // Pipeline summary: count jobs by status
  const pipelineCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    JOB_PIPELINE.forEach(s => counts[s] = 0)
    jobs.forEach(j => {
      if (counts[j.status] !== undefined) counts[j.status]++
    })
    return counts
  }, [jobs])

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-9 h-9 border-[3px] rounded-full animate-spin-slow"
          style={{ borderColor: 'var(--border)', borderTopColor: 'var(--primary)' }} />
      </div>
    )
  }

  return (
    <div>
      {/* ── Hero Section ─────────────────────────────────────────── */}
      <div className="mb-7">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
          <div>
            <h1 className="text-[26px] font-extrabold -tracking-wide" style={{ color: 'var(--text)' }}>
              {greeting()}, {firstName(displayName)}
            </h1>
            <p className="text-[14px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              Here&apos;s your notary business at a glance
            </p>
          </div>
          <Button variant="gold" href="/dashboard/jobs/new">
            <Icon name="add" size={18} style={{ color: 'inherit' }} />
            New signing job
          </Button>
        </div>

        {/* Hero income card */}
        <div className="rounded-2xl p-6 mb-5"
          style={{ background: 'var(--primary)', color: 'white' }}>
          <div className="flex items-center gap-3 mb-1 opacity-80">
            <Icon name="account_balance" size={18} style={{ color: 'var(--accent)' }} />
            <span className="text-[13px] font-medium">Monthly income</span>
          </div>
          <div className="text-[38px] font-extrabold -tracking-wider leading-none mb-4">
            {currency(stats?.mtd_income)}
          </div>
          <div className="flex flex-wrap gap-5">
            <div>
              <div className="text-[11px] uppercase tracking-wider opacity-60 mb-0.5">YTD income</div>
              <div className="text-[17px] font-bold">{currency(stats?.ytd_income)}</div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider opacity-60 mb-0.5">Active jobs</div>
              <div className="text-[17px] font-bold">{stats?.active_jobs || 0}</div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider opacity-60 mb-0.5">Completed (MTD)</div>
              <div className="text-[17px] font-bold">{stats?.mtd_completed || 0}</div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider opacity-60 mb-0.5">Unpaid</div>
              <div className="text-[17px] font-bold" style={{ color: (stats?.unpaid_total || 0) > 0 ? '#FCD34D' : 'inherit' }}>
                {currency(stats?.unpaid_total)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Grid ───────────────────────────────────────────── */}
      <StatsGrid>
        <StatCard label="Monthly income" value={currency(stats?.mtd_income)}
          icon={<Icon name="trending_up" size={18} style={{ color: 'var(--success)' }} />} />
        <StatCard label="YTD income" value={currency(stats?.ytd_income)}
          icon={<Icon name="account_balance" size={18} style={{ color: 'var(--primary)' }} />} />
        <StatCard label="Active jobs" value={String(stats?.active_jobs || 0)}
          icon={<Icon name="work" size={18} style={{ color: 'var(--info)' }} />} />
        <StatCard label="Unpaid" value={currency(stats?.unpaid_total)}
          color={(stats?.unpaid_total || 0) > 0 ? 'var(--warning)' : undefined}
          icon={<Icon name="pending" size={18} style={{ color: 'var(--warning)' }} />} />
      </StatsGrid>

      {/* ── Pipeline Summary Strip ───────────────────────────────── */}
      <div className="rounded-xl p-4 mb-7" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2 mb-3">
          <Icon name="linear_scale" size={18} style={{ color: 'var(--text-secondary)' }} />
          <span className="text-[13px] font-semibold" style={{ color: 'var(--text-secondary)' }}>Job pipeline</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {JOB_PIPELINE.map(status => {
            const cfg = JOB_STATUS_CONFIG[status]
            const count = pipelineCounts[status] || 0
            return (
              <button
                key={status}
                onClick={() => router.push(`/dashboard/jobs?status=${status}`)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium cursor-pointer transition-opacity hover:opacity-80 border-none"
                style={{ background: cfg.bg, color: cfg.color }}
              >
                {cfg.label}
                <span className="font-bold">{count}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Tax Savings Card ─────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-2">
        <div />
        <Button variant="outline" size="sm" onClick={handleExportTax} disabled={exporting}>
          <Icon name="picture_as_pdf" size={16} style={{ color: 'inherit' }} />
          {exporting ? 'Exporting…' : 'Export Tax Report'}
        </Button>
      </div>
      <TaxCard savings={currency(taxSavings)} chips={taxChips} />

      {/* ── Recent Jobs ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[18px] font-bold" style={{ color: 'var(--text)' }}>Recent signing jobs</h2>
        <Button variant="outline" href="/dashboard/jobs" size="sm">
          View all →
        </Button>
      </div>

      {recentJobs.length === 0 ? (
        <EmptyState
         
          title="No signing jobs yet"
          description="Create your first signing job to start tracking your business."
          action={<Button href="/dashboard/jobs/new">+ New Signing Job</Button>}
        />
      ) : (
        <DataTable
          columns={JOB_COLUMNS}
          data={recentJobs}
          onRowClick={j => router.push(`/dashboard/jobs/${j.id}`)}
        />
      )}

      {toast && <Toast message={toast.msg} type={toast.type} visible={!!toast} onHide={() => setToast(null)} />}
    </div>
  )
}