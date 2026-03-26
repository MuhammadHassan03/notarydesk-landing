'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { Icon } from '@/components/ui/icons'
import { currency } from '@/lib/utils'

type ResultType = 'job' | 'client' | 'invoice'

interface SearchResult {
  id: string
  type: ResultType
  title: string
  subtitle: string
  meta?: string
  href: string
}

interface Cache {
  jobs: any[]
  clients: any[]
  invoices: any[]
  loaded: boolean
}

const TYPE_ICONS: Record<ResultType, string> = {
  job:     'work',
  client:  'person',
  invoice: 'receipt_long',
}

const TYPE_LABELS: Record<ResultType, string> = {
  job:     'Job',
  client:  'Client',
  invoice: 'Invoice',
}

function filterAll(cache: Cache, q: string): SearchResult[] {
  const ql = q.toLowerCase()
  const out: SearchResult[] = []

  cache.jobs
    .filter(j =>
      j.signer_name?.toLowerCase().includes(ql) ||
      j.client_name?.toLowerCase().includes(ql) ||
      j.document_type?.toLowerCase().includes(ql) ||
      j.signer_address?.toLowerCase().includes(ql)
    )
    .slice(0, 5)
    .forEach(j => out.push({
      id: j.id, type: 'job',
      title: j.signer_name,
      subtitle: [j.document_type, j.client_name !== j.signer_name ? j.client_name : ''].filter(Boolean).join(' · '),
      meta: currency(j.fee + (j.travel_fee || 0)),
      href: `/dashboard/jobs/${j.id}`,
    }))

  cache.clients
    .filter(c =>
      c.name?.toLowerCase().includes(ql) ||
      c.company?.toLowerCase().includes(ql) ||
      c.email?.toLowerCase().includes(ql) ||
      c.phone?.includes(ql)
    )
    .slice(0, 4)
    .forEach(c => out.push({
      id: c.id, type: 'client',
      title: c.name,
      subtitle: [c.company, c.email].filter(Boolean).join(' · '),
      meta: `${c.total_jobs || 0} job${c.total_jobs !== 1 ? 's' : ''}`,
      href: `/dashboard/clients/${c.id}`,
    }))

  cache.invoices
    .filter(i =>
      i.client_name?.toLowerCase().includes(ql) ||
      i.service_description?.toLowerCase().includes(ql)
    )
    .slice(0, 4)
    .forEach(i => out.push({
      id: i.id, type: 'invoice',
      title: i.client_name,
      subtitle: i.service_description || '',
      meta: currency(i.amount),
      href: `/dashboard/invoices/${i.id}`,
    }))

  return out
}

function unwrap(res: any): any[] {
  if (res?.ok !== undefined) return res.data || []
  if (Array.isArray(res)) return res
  if (res?.data) return Array.isArray(res.data) ? res.data : []
  return []
}

export function GlobalSearch() {
  const router = useRouter()
  const [open, setOpen]     = useState(false)
  const [query, setQuery]   = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [activeIdx, setActiveIdx] = useState(0)
  const [fetching, setFetching] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const cacheRef = useRef<Cache>({ jobs: [], clients: [], invoices: [], loaded: false })

  // Register window trigger so external buttons can open it
  useEffect(() => {
    ;(window as any).__openGlobalSearch = () => setOpen(true)
    return () => { delete (window as any).__openGlobalSearch }
  }, [])

  // Cmd+K / Ctrl+K
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(o => !o)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  // On open: focus + lazy-load data once
  useEffect(() => {
    if (!open) { setQuery(''); setResults([]); return }
    setTimeout(() => inputRef.current?.focus(), 40)
    if (cacheRef.current.loaded) return
    setFetching(true)
    Promise.all([
      api.get<any>('/signing-jobs/?per_page=500').catch(() => null),
      api.get<any>('/clients/?limit=500').catch(() => null),
      api.get<any>('/invoices/?limit=500').catch(() => null),
    ]).then(([jobs, clients, invoices]) => {
      cacheRef.current = {
        jobs:     unwrap(jobs),
        clients:  unwrap(clients),
        invoices: unwrap(invoices),
        loaded:   true,
      }
    }).finally(() => setFetching(false))
  }, [open])

  // Filter on every query change
  useEffect(() => {
    if (!query.trim()) { setResults([]); setActiveIdx(0); return }
    const r = filterAll(cacheRef.current, query)
    setResults(r)
    setActiveIdx(0)
  }, [query])

  const navigate = useCallback((href: string) => {
    router.push(href)
    setOpen(false)
  }, [router])

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, results.length - 1)) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)) }
    if (e.key === 'Enter' && results[activeIdx]) navigate(results[activeIdx].href)
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-[580px] rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* ── Search input ─────────────────────────────────────── */}
        <div className="flex items-center gap-3 px-4 py-3.5" style={{ borderBottom: '1px solid var(--divider)' }}>
          <Icon name="search" size={20} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search jobs, clients, invoices…"
            className="flex-1 bg-transparent outline-none text-[15px]"
            style={{ color: 'var(--text)' }}
          />
          {fetching && (
            <div className="w-4 h-4 border-2 rounded-full animate-spin"
              style={{ borderColor: 'var(--border)', borderTopColor: 'var(--primary)' }} />
          )}
          <kbd className="text-[11px] px-1.5 py-0.5 rounded font-medium hidden sm:block"
            style={{ background: 'var(--surface)', color: 'var(--text-tertiary)', border: '1px solid var(--border)' }}>
            ESC
          </kbd>
        </div>

        {/* ── Results ──────────────────────────────────────────── */}
        {results.length > 0 ? (
          <ul className="max-h-[400px] overflow-y-auto p-2 list-none m-0">
            {results.map((r, i) => (
              <li key={`${r.type}-${r.id}`}>
                <button
                  onClick={() => navigate(r.href)}
                  onMouseEnter={() => setActiveIdx(i)}
                  className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors"
                  style={{
                    background: i === activeIdx ? 'var(--primary-light)' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'var(--surface)' }}>
                    <Icon name={TYPE_ICONS[r.type] as any} size={16} style={{ color: 'var(--primary)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold truncate" style={{ color: 'var(--text)' }}>{r.title}</div>
                    {r.subtitle && (
                      <div className="text-[11px] truncate" style={{ color: 'var(--text-tertiary)' }}>{r.subtitle}</div>
                    )}
                  </div>
                  <span className="text-[11px] font-medium px-1.5 py-0.5 rounded shrink-0"
                    style={{ background: 'var(--surface)', color: 'var(--text-tertiary)' }}>
                    {TYPE_LABELS[r.type]}
                  </span>
                  {r.meta && (
                    <span className="text-[13px] font-bold shrink-0" style={{ color: 'var(--primary)' }}>
                      {r.meta}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        ) : query && !fetching ? (
          <div className="py-12 text-center">
            <Icon name="search_off" size={30} style={{ color: 'var(--text-tertiary)', opacity: 0.3 }} />
            <div className="text-[13px] mt-2" style={{ color: 'var(--text-tertiary)' }}>No results for "{query}"</div>
          </div>
        ) : (
          <div className="py-10 text-center">
            <div className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>
              Type to search across all your data
            </div>
          </div>
        )}

        {/* ── Footer hints ─────────────────────────────────────── */}
        <div className="px-4 py-2 flex items-center gap-4 flex-wrap"
          style={{ borderTop: '1px solid var(--divider)', background: 'var(--surface)' }}>
          {[
            { keys: '↑↓', label: 'navigate' },
            { keys: '↵',  label: 'open' },
            { keys: '⌘K', label: 'toggle' },
          ].map(h => (
            <span key={h.keys} className="text-[11px] flex items-center gap-1" style={{ color: 'var(--text-tertiary)' }}>
              <kbd className="px-1.5 py-0.5 rounded text-[11px]"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>{h.keys}</kbd>
              {h.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
