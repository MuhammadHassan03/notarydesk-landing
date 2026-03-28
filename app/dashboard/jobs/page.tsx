'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useJobs } from '@/hooks/use-jobs'
import { currency, formatShortDate } from '@/lib/utils'
import { JOB_STATUS_CONFIG, PAYMENT_STATUS_CONFIG } from '@/lib/constants'
import { Icon } from '@/components/ui/icons'
import type { SigningJob } from '@/lib/types'

import { PageHeader } from '@/components/layout'
import { ErrorBanner } from '@/components/ui/ErrorBanner'
import { Button, DataTable, StatusBadge } from '@/components/ui'
import { Column } from '@/components/ui/DataTable'
import { FilterOption, FilterPills } from '@/components/ui/FilterPills'
import { Pagination } from '@/components/ui/Pagination'

const PAGE_SIZE = 20

type Filter = 'all' | 'active' | 'unpaid' | 'completed' | 'cancelled'

const COLUMNS: Column<SigningJob>[] = [
  { key: 'num', header: '#', width: '60px', render: j => <span className="font-semibold text-[13px]" style={{ color: 'var(--text-tertiary)' }}>#{j.job_number || '—'}</span> },
  { key: 'signer', header: 'Signer', render: j => <span className="font-semibold">{j.signer_name}</span>, sortable: true, sortValue: j => j.signer_name, filterable: true, filterType: 'text', filterValue: j => j.signer_name },
  { key: 'client', header: 'Client', render: j => <span className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>{j.client_name !== j.signer_name ? j.client_name : '—'}</span>, filterable: true, filterType: 'text', filterValue: j => j.client_name },
  { key: 'doc', header: 'Document', render: j => <span className="text-[13px]">{j.document_type || '—'}</span>, filterable: true, filterType: 'select', filterValue: j => j.document_type || '' },
  { key: 'date', header: 'Date', render: j => <span className="text-[13px]">{formatShortDate(j.scheduled_date)}</span>, sortable: true, sortValue: j => j.scheduled_date || '' },
  { key: 'acts', header: 'Acts', align: 'center', width: '60px', render: j => j.notarial_acts_count || 1 },
  { key: 'amount', header: 'Amount', render: j => <span className="font-bold">{currency(j.fee + (j.travel_fee || 0))}</span>, sortable: true, sortValue: j => j.fee + (j.travel_fee || 0), filterable: true, filterType: 'number', filterValue: j => j.fee + (j.travel_fee || 0) },
  { key: 'status', header: 'Status', render: j => <StatusBadge status={j.status} config={JOB_STATUS_CONFIG} />, filterable: true, filterType: 'select', filterValue: j => j.status },
  { key: 'pay', header: 'Payment', render: j => <StatusBadge status={j.payment_status} config={PAYMENT_STATUS_CONFIG} />, filterable: true, filterType: 'select', filterValue: j => j.payment_status },
]

export default function JobsListPage() {
  const router = useRouter()
  const { jobs, loading, error, refresh } = useJobs()
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => setPage(1), [filter, search])

  const filtered = useMemo(() => {
    let list = jobs
    switch (filter) {
      case 'active':    list = list.filter(j => !['completed', 'cancelled'].includes(j.status)); break
      case 'unpaid':    list = list.filter(j => j.payment_status !== 'paid' && j.status !== 'cancelled'); break
      case 'completed': list = list.filter(j => j.status === 'completed'); break
      case 'cancelled': list = list.filter(j => j.status === 'cancelled'); break
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(j =>
        j.signer_name?.toLowerCase().includes(q) ||
        j.client_name?.toLowerCase().includes(q) ||
        j.document_type?.toLowerCase().includes(q) ||
        j.signer_address?.toLowerCase().includes(q)
      )
    }
    return list
  }, [jobs, filter, search])

  const counts = useMemo(() => ({
    all: jobs.length,
    active: jobs.filter(j => !['completed', 'cancelled'].includes(j.status)).length,
    unpaid: jobs.filter(j => j.payment_status !== 'paid' && j.status !== 'cancelled').length,
    completed: jobs.filter(j => j.status === 'completed').length,
    cancelled: jobs.filter(j => j.status === 'cancelled').length,
  }), [jobs])

  const total = useMemo(() => filtered.reduce((s, j) => s + j.fee + (j.travel_fee || 0), 0), [filtered])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const filterOpts: FilterOption<Filter>[] = [
    { key: 'all', label: 'All', count: counts.all },
    { key: 'active', label: 'Active', count: counts.active },
    { key: 'unpaid', label: 'Unpaid', count: counts.unpaid },
    { key: 'completed', label: 'Done', count: counts.completed },
    { key: 'cancelled', label: 'Cancelled', count: counts.cancelled },
  ]

  if (error) return <ErrorBanner message={error} onRetry={refresh} />

  return (
    <div>
      <PageHeader title="Signing Jobs" subtitle={`${filtered.length} jobs · ${currency(total)} total`}
        action={
          <Button variant="gold" href="/dashboard/jobs/new">
            <Icon name="add" size={16} style={{ color: 'inherit' }} /> New Job
          </Button>
        } />

      {/* ── Filters + search ────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <FilterPills options={filterOpts} value={filter} onChange={setFilter} />
        <div className="ml-auto relative">
          <Icon name="search" size={15} style={{ color: 'var(--text-tertiary)', position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Search jobs…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 pr-3 py-2 rounded-lg text-[13px] outline-none"
            style={{ background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)', width: 180, minWidth: 0 }}
          />
        </div>
      </div>

      {loading ? (
        <DataTable columns={COLUMNS} data={[]} loading />
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl p-10 text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <Icon name="work" size={40} style={{ color: 'var(--text-tertiary)', opacity: 0.3 }} />
          <div className="text-[15px] font-bold mb-1 mt-3" style={{ color: 'var(--text)' }}>
            {filter === 'all' && !search ? 'No signing jobs yet' : 'No matching jobs'}
          </div>
          <div className="text-[13px] mb-4" style={{ color: 'var(--text-tertiary)' }}>
            {filter === 'all' && !search ? 'Create your first signing job to start tracking.' : 'Try a different filter or search term.'}
          </div>
          {filter === 'all' && !search && (
            <Button variant="gold" href="/dashboard/jobs/new">
              <Icon name="add" size={16} style={{ color: 'inherit' }} /> New Signing Job
            </Button>
          )}
        </div>
      ) : (
        <>
        <DataTable
          columns={COLUMNS}
          data={paginated}
          onRowClick={j => router.push(`/dashboard/jobs/${j.id}`)}
          mobileCard={j => {
            const sc = JOB_STATUS_CONFIG[j.status as keyof typeof JOB_STATUS_CONFIG]
            const pc = PAYMENT_STATUS_CONFIG[j.payment_status as keyof typeof PAYMENT_STATUS_CONFIG]
            return (
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[14px] font-bold truncate" style={{ color: 'var(--text)' }}>{j.signer_name}</span>
                    {j.job_number && <span className="text-[11px] font-mono shrink-0" style={{ color: 'var(--text-tertiary)' }}>#{j.job_number}</span>}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] px-1.5 py-0.5 rounded font-medium" style={{ background: sc?.bg, color: sc?.color }}>{sc?.label ?? j.status}</span>
                    {pc && <span className="text-[11px] px-1.5 py-0.5 rounded font-medium" style={{ background: pc.bg, color: pc.color }}>{pc.label}</span>}
                    {j.document_type && <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{j.document_type}</span>}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[15px] font-bold" style={{ color: 'var(--text)' }}>{currency(j.fee + (j.travel_fee || 0))}</div>
                  {j.scheduled_date && <div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{formatShortDate(j.scheduled_date)}</div>}
                </div>
              </div>
            )
          }}
        />
        <Pagination page={page} totalPages={totalPages} totalItems={filtered.length} pageSize={PAGE_SIZE} onPage={setPage} />
        </>
      )}
    </div>
  )
}