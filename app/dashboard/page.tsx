'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/authcontext'
import { useDashboardStats } from '@/hooks/use-dashboard'
import { useJobs } from '@/hooks/use-jobs'
import { currency, greeting, firstName } from '@/lib/formatters'
import { JOB_STATUS_CONFIG, PAYMENT_STATUS_CONFIG } from '@/lib/constants'
import type { SigningJob } from '@/lib/types'

import { Button, DataTable, StatusBadge } from '@/components/ui'
import { PageHeader, StatsGrid, StatCard, TaxCard, EmptyState } from '@/components/shared'
import type { Column } from '@/components/ui/DataTable'

const JOB_COLUMNS: Column<SigningJob>[] = [
  { key: 'num', header: '#', width: '60px', render: j => <span className="font-semibold text-slate-400">#{j.job_number || '—'}</span> },
  { key: 'signer', header: 'Signer', render: j => <span className="font-semibold">{j.signer_name}</span> },
  { key: 'doc', header: 'Document', render: j => j.document_type || '—' },
  { key: 'amount', header: 'Amount', render: j => <span className="font-bold">{currency(j.fee + (j.travel_fee || 0))}</span>, sortable: true, sortValue: j => j.fee + (j.travel_fee || 0) },
  { key: 'status', header: 'Status', render: j => <StatusBadge status={j.status} config={JOB_STATUS_CONFIG} /> },
  { key: 'pay', header: 'Payment', render: j => <StatusBadge status={j.payment_status} config={PAYMENT_STATUS_CONFIG} /> },
]

export default function DashboardPage() {
  const router = useRouter()
  const { profile } = useAuth()
  const { stats, loading: statsLoading } = useDashboardStats()
  const { jobs, loading: jobsLoading } = useJobs()

  const recentJobs = useMemo(() => jobs.slice(0, 8), [jobs])

  const taxSavings = useMemo(() => {
    if (!stats) return 0
    return ((stats.ytd_mileage_deduction || 0) + (stats.ytd_expenses || 0) + 100) * 0.3
  }, [stats])

  const taxChips = useMemo(() => {
    if (!stats) return []
    return [
      { label: 'mileage', value: currency(stats.ytd_mileage_deduction) },
      { label: 'expenses', value: currency(stats.ytd_expenses) },
      { label: 'notarial acts', value: String(stats.ytd_notarial_acts || 0) },
      { label: 'miles', value: String(Math.round(stats.ytd_miles || 0)) },
    ]
  }, [stats])

  if (statsLoading) return <div className="p-10 text-slate-400">Loading dashboard…</div>

  return (
    <div>
      <PageHeader
        title={`${greeting()}, ${firstName(profile?.full_name)}`}
        subtitle="Here's your notary business at a glance"
        action={<Button variant="gold" href="/dashboard/jobs/new">+ New Signing Job</Button>}
      />

      <StatsGrid>
        <StatCard label="Monthly income" value={currency(stats?.mtd_income)} />
        <StatCard label="YTD income" value={currency(stats?.ytd_income)} />
        <StatCard label="Active jobs" value={String(stats?.active_jobs || 0)} />
        <StatCard label="Unpaid" value={currency(stats?.unpaid_total)} color={(stats?.unpaid_total || 0) > 0 ? '#D97706' : undefined} />
      </StatsGrid>

      <TaxCard savings={currency(taxSavings)} chips={taxChips} />

      <PageHeader title="Recent signing jobs" action={<Button variant="outline" href="/dashboard/jobs">View all →</Button>} />

      {recentJobs.length === 0 ? (
        <EmptyState icon="◈" title="No signing jobs yet" description="Create your first signing job to start tracking your business."
          action={<Button href="/dashboard/jobs/new">+ New Signing Job</Button>} />
      ) : (
        <DataTable columns={JOB_COLUMNS} data={recentJobs} onRowClick={j => router.push(`/dashboard/jobs/${j.id}`)} />
      )}
    </div>
  )
}