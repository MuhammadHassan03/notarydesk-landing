'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useClients } from '@/hooks/use-clients'
import { formatShortDate } from '@/lib/utils'
import { Icon } from '@/components/ui/icons'
import type { Client } from '@/lib/types'

import { PageHeader } from '@/components/layout'
import { ErrorBanner } from '@/components/ui/ErrorBanner'
import { Button, DataTable } from '@/components/ui'
import { Column } from '@/components/ui/DataTable'
import { FilterOption, FilterPills } from '@/components/ui/FilterPills'
import { Pagination } from '@/components/ui/Pagination'

const PAGE_SIZE = 20

type Filter = 'all' | 'active' | 'inactive'

const COLUMNS: Column<Client>[] = [
  { key: 'name', header: 'Name', render: c => <span className="font-semibold">{c.name}</span>, sortable: true, sortValue: c => c.name, filterable: true, filterType: 'text', filterValue: c => c.name },
  { key: 'company', header: 'Company', render: c => <span className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>{c.company || '—'}</span>, filterable: true, filterType: 'text', filterValue: c => c.company || '' },
  { key: 'email', header: 'Email', render: c => <span className="text-[13px]">{c.email || '—'}</span>, filterable: true, filterType: 'text', filterValue: c => c.email || '' },
  { key: 'phone', header: 'Phone', render: c => <span className="text-[13px]">{c.phone || '—'}</span> },
  { key: 'jobs', header: 'Jobs', align: 'center', width: '70px', render: c => (
    <span className="inline-flex items-center justify-center min-w-[28px] h-6 rounded-full text-[12px] font-bold px-2"
      style={{ background: c.total_jobs > 0 ? 'var(--primary)' : 'var(--surface)', color: c.total_jobs > 0 ? '#fff' : 'var(--text-tertiary)' }}>
      {c.total_jobs}
    </span>
  ), sortable: true, sortValue: c => c.total_jobs, filterable: true, filterType: 'number', filterValue: c => c.total_jobs },
  { key: 'last', header: 'Last Job', render: c => <span className="text-[13px]" style={{ color: 'var(--text-tertiary)' }}>{formatShortDate(c.last_job_date)}</span>, sortable: true, sortValue: c => c.last_job_date || '' },
]

export default function ClientsListPage() {
  const router = useRouter()
  const { clients, loading, error, refresh } = useClients()
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => setPage(1), [filter, search])

  const ACTIVE_CLIENT_DAYS = 90
  const now = new Date()
  const activeThreshold = new Date(now.getTime() - ACTIVE_CLIENT_DAYS * 24 * 60 * 60 * 1000).toISOString()

  const filtered = useMemo(() => {
    let list = clients
    switch (filter) {
      case 'active':   list = list.filter(c => c.last_job_date && c.last_job_date >= activeThreshold); break
      case 'inactive': list = list.filter(c => !c.last_job_date || c.last_job_date < activeThreshold); break
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.company?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.phone?.includes(q)
      )
    }
    return list
  }, [clients, filter, search, activeThreshold])

  const counts = useMemo(() => ({
    all: clients.length,
    active: clients.filter(c => c.last_job_date && c.last_job_date >= activeThreshold).length,
    inactive: clients.filter(c => !c.last_job_date || c.last_job_date < activeThreshold).length,
  }), [clients, activeThreshold])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const filterOpts: FilterOption<Filter>[] = [
    { key: 'all', label: 'All', count: counts.all },
    { key: 'active', label: 'Active', count: counts.active },
    { key: 'inactive', label: 'Inactive', count: counts.inactive },
  ]

  if (error) return <ErrorBanner message={error} onRetry={refresh} />

  return (
    <div>
      <PageHeader title="Clients" subtitle={`${filtered.length} client${filtered.length !== 1 ? 's' : ''}`}
        action={
          <Button variant="gold" href="/dashboard/clients/new">
            <Icon name="person_add" size={16} style={{ color: 'inherit' }} /> New Client
          </Button>
        } />

      <div className="flex flex-wrap items-center gap-3 mb-5">
        <FilterPills options={filterOpts} value={filter} onChange={setFilter} />
        <div className="ml-auto relative">
          <Icon name="search" size={15} style={{ color: 'var(--text-tertiary)', position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input type="text" placeholder="Search clients…" value={search} onChange={e => setSearch(e.target.value)}
            className="pl-8 pr-3 py-2 rounded-lg text-[13px] outline-none"
            style={{ background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)', width: 180, minWidth: 0 }} />
        </div>
      </div>

      {loading ? (
        <DataTable columns={COLUMNS} data={[]} loading />
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl p-10 text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <Icon name="people" size={40} style={{ color: 'var(--text-tertiary)', opacity: 0.3 }} />
          <div className="text-[15px] font-bold mb-1 mt-3" style={{ color: 'var(--text)' }}>
            {filter === 'all' && !search ? 'No clients yet' : 'No matching clients'}
          </div>
          <div className="text-[13px] mb-4" style={{ color: 'var(--text-tertiary)' }}>
            {filter === 'all' && !search ? 'Clients are auto-created when you create signing jobs, or add one manually.' : 'Try a different filter or search term.'}
          </div>
          {filter === 'all' && !search && (
            <Button variant="gold" href="/dashboard/clients/new">
              <Icon name="person_add" size={16} style={{ color: 'inherit' }} /> Add Client
            </Button>
          )}
        </div>
      ) : (
        <>
        <DataTable
          columns={COLUMNS}
          data={paginated}
          onRowClick={c => router.push(`/dashboard/clients/${c.id}`)}
          mobileCard={c => (
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-[15px] font-bold"
                style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                {c.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-bold truncate" style={{ color: 'var(--text)' }}>{c.name}</div>
                <div className="text-[11px] truncate" style={{ color: 'var(--text-tertiary)' }}>
                  {[c.company, c.email].filter(Boolean).join(' · ') || c.phone || '—'}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[14px] font-bold" style={{ color: 'var(--primary)' }}>{c.total_jobs}</div>
                <div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>jobs</div>
              </div>
            </div>
          )}
        />
        <Pagination page={page} totalPages={totalPages} totalItems={filtered.length} pageSize={PAGE_SIZE} onPage={setPage} />
        </>
      )}
    </div>
  )
}
