'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useJobs } from '@/hooks/use-jobs'
import { currency, formatShortDate } from '@/lib/formatters'
import { JOB_STATUS_CONFIG, PAYMENT_STATUS_CONFIG } from '@/lib/constants'
import type { SigningJob } from '@/lib/types'

import { PageHeader, EmptyState } from '@/components/shared'
import { Button, DataTable, StatusBadge } from '@/components/ui'
import { Column } from '@/components/ui/DataTable'
import { FilterOption, FilterPills } from '@/components/ui/FilterPills'

type Filter = 'all' | 'active' | 'unpaid' | 'completed' | 'cancelled'

const COLUMNS: Column<SigningJob>[] = [
  { key: 'num', header: '#', width: '60px', render: j => <span className="font-semibold text-slate-400 text-[13px]">#{j.job_number || '—'}</span> },
  { key: 'signer', header: 'Signer', render: j => <span className="font-semibold">{j.signer_name}</span>, sortable: true, sortValue: j => j.signer_name },
  { key: 'client', header: 'Client', render: j => <span className="text-slate-500 text-[13px]">{j.client_name !== j.signer_name ? j.client_name : '—'}</span> },
  { key: 'doc', header: 'Document', render: j => <span className="text-[13px]">{j.document_type || '—'}</span> },
  { key: 'date', header: 'Date', render: j => <span className="text-[13px]">{formatShortDate(j.scheduled_date)}</span>, sortable: true, sortValue: j => j.scheduled_date || '' },
  { key: 'acts', header: 'Acts', align: 'center', width: '60px', render: j => j.notarial_acts_count || 1 },
  { key: 'amount', header: 'Amount', render: j => <span className="font-bold">{currency(j.fee + (j.travel_fee || 0))}</span>, sortable: true, sortValue: j => j.fee + (j.travel_fee || 0) },
  { key: 'status', header: 'Status', render: j => <StatusBadge status={j.status} config={JOB_STATUS_CONFIG} /> },
  { key: 'pay', header: 'Payment', render: j => <StatusBadge status={j.payment_status} config={PAYMENT_STATUS_CONFIG} /> },
]

export default function JobsListPage() {
  const router = useRouter()
  const { jobs, loading } = useJobs()
  const [filter, setFilter] = useState<Filter>('all')

  const filtered = useMemo(() => {
    switch (filter) {
      case 'active':    return jobs.filter(j => !['completed', 'cancelled'].includes(j.status))
      case 'unpaid':    return jobs.filter(j => j.payment_status !== 'paid' && j.status !== 'cancelled')
      case 'completed': return jobs.filter(j => j.status === 'completed')
      case 'cancelled': return jobs.filter(j => j.status === 'cancelled')
      default:          return jobs
    }
  }, [jobs, filter])

  const counts = useMemo(() => ({
    all: jobs.length,
    active: jobs.filter(j => !['completed', 'cancelled'].includes(j.status)).length,
    unpaid: jobs.filter(j => j.payment_status !== 'paid' && j.status !== 'cancelled').length,
    completed: jobs.filter(j => j.status === 'completed').length,
    cancelled: jobs.filter(j => j.status === 'cancelled').length,
  }), [jobs])

  const total = useMemo(() => filtered.reduce((s, j) => s + j.fee + (j.travel_fee || 0), 0), [filtered])

  const filterOpts: FilterOption<Filter>[] = [
    { key: 'all', label: 'All', count: counts.all },
    { key: 'active', label: 'Active', count: counts.active },
    { key: 'unpaid', label: 'Unpaid', count: counts.unpaid },
    { key: 'completed', label: 'Done', count: counts.completed },
    { key: 'cancelled', label: 'Cancelled', count: counts.cancelled },
  ]

  return (
    <div>
      <PageHeader title="Signing Jobs" subtitle={`${filtered.length} jobs · ${currency(total)} total`}
        action={<Button variant="gold" href="/dashboard/jobs/new">+ New Job</Button>} />

      <div className="mb-5">
        <FilterPills options={filterOpts} value={filter} onChange={setFilter} />
      </div>

      {loading ? (
        <DataTable columns={COLUMNS} data={[]} loading />
      ) : filtered.length === 0 ? (
        <EmptyState icon="◈" title={filter === 'all' ? 'No signing jobs yet' : `No ${filter} jobs`}
          description={filter === 'all' ? 'Create your first signing job.' : 'Jobs matching this filter will appear here.'}
          action={filter === 'all' ? <Button href="/dashboard/jobs/new">+ New Signing Job</Button> : undefined} />
      ) : (
        <DataTable columns={COLUMNS} data={filtered} onRowClick={j => router.push(`/dashboard/jobs/${j.id}`)} />
      )}
    </div>
  )
}