'use client'

import { useState, useMemo, useCallback, useRef, useEffect, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Icon } from '@/components/ui/icons'

// ── Filter types ──────────────────────────────────────────────────────────

type TextOp = 'contains' | 'starts_with' | 'ends_with' | 'equals'
type NumOp  = 'eq' | 'gt' | 'lt'

interface TextFilter   { kind: 'text';   op: TextOp; value: string }
interface NumberFilter { kind: 'number'; op: NumOp;  value: string }
interface SelectFilter { kind: 'select'; values: string[] }
export type ColFilter = TextFilter | NumberFilter | SelectFilter

// ── Column interface ──────────────────────────────────────────────────────

export interface Column<T> {
  key: string
  header: string
  render: (row: T) => ReactNode
  align?: 'left' | 'center' | 'right'
  width?: string
  sortable?: boolean
  sortValue?: (row: T) => string | number
  /** Enable the filter icon on this column */
  filterable?: boolean
  /** Type of filter popover to show */
  filterType?: 'text' | 'number' | 'select'
  /** Fixed options for select filter (auto-derived from data if omitted) */
  filterOptions?: string[]
  /** Value extractor for filtering (falls back to sortValue) */
  filterValue?: (row: T) => string | number | undefined
}

export interface DataTableProps<T extends { id: string }> {
  columns: Column<T>[]
  data: T[]
  onRowClick?: (row: T) => void
  loading?: boolean
  emptyMessage?: string
  className?: string
  mobileCard?: (row: T) => ReactNode
}

// ── Filter matching ───────────────────────────────────────────────────────

function matches(val: unknown, f: ColFilter): boolean {
  if (f.kind === 'text') {
    if (!f.value.trim()) return true
    const v = String(val ?? '').toLowerCase()
    const q = f.value.trim().toLowerCase()
    if (f.op === 'contains')    return v.includes(q)
    if (f.op === 'starts_with') return v.startsWith(q)
    if (f.op === 'ends_with')   return v.endsWith(q)
    return v === q
  }
  if (f.kind === 'number') {
    if (!f.value.trim()) return true
    const n = typeof val === 'number' ? val : parseFloat(String(val ?? ''))
    const q = parseFloat(f.value)
    if (isNaN(q)) return true
    if (f.op === 'gt') return n > q
    if (f.op === 'lt') return n < q
    return n === q
  }
  if (f.kind === 'select') {
    if (f.values.length === 0) return true
    return f.values.includes(String(val ?? ''))
  }
  return true
}

// ── Filter Popover ────────────────────────────────────────────────────────

function FilterPopover<T extends { id: string }>({
  col, data, filter, onSet, onClear, onClose,
}: {
  col: Column<T>
  data: T[]
  filter?: ColFilter
  onSet: (f: ColFilter) => void
  onClear: () => void
  onClose: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const type = col.filterType ?? 'text'

  useEffect(() => {
    const fn = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) onClose() }
    setTimeout(() => document.addEventListener('mousedown', fn), 0)
    return () => document.removeEventListener('mousedown', fn)
  }, [onClose])

  const options = useMemo(() => {
    if (type !== 'select') return []
    if (col.filterOptions) return col.filterOptions
    const getter = col.filterValue ?? col.sortValue
    if (!getter) return []
    return [...new Set(data.map(r => String(getter(r) ?? '')).filter(Boolean))].sort()
  }, [type, col, data])

  const tf: TextFilter   = filter?.kind === 'text'   ? filter : { kind: 'text',   op: 'contains', value: '' }
  const nf: NumberFilter = filter?.kind === 'number' ? filter : { kind: 'number', op: 'eq',       value: '' }
  const sf: SelectFilter = filter?.kind === 'select' ? filter : { kind: 'select', values: [] }

  const inputCls = 'w-full text-[12px] px-2 py-1.5 rounded-lg outline-none'
  const inputStyle: React.CSSProperties = { background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)' }

  return (
    <div
      ref={ref}
      className="absolute z-50 rounded-xl shadow-2xl p-3 min-w-[210px]"
      style={{ background: 'var(--card)', border: '1px solid var(--border)', top: '100%', left: 0, marginTop: 4 }}
      onClick={e => e.stopPropagation()}
    >
      {type === 'text' && (
        <>
          <select value={tf.op} onChange={e => onSet({ ...tf, op: e.target.value as TextOp })} className={`${inputCls} mb-2`} style={inputStyle}>
            <option value="contains">Contains</option>
            <option value="starts_with">Starts with</option>
            <option value="ends_with">Ends with</option>
            <option value="equals">Equals exactly</option>
          </select>
          <input autoFocus type="text" placeholder="Type to filter…" value={tf.value}
            onChange={e => onSet({ ...tf, value: e.target.value })} className={inputCls} style={inputStyle} />
        </>
      )}

      {type === 'number' && (
        <>
          <select value={nf.op} onChange={e => onSet({ ...nf, op: e.target.value as NumOp })} className={`${inputCls} mb-2`} style={inputStyle}>
            <option value="eq">Equals</option>
            <option value="gt">Greater than</option>
            <option value="lt">Less than</option>
          </select>
          <input autoFocus type="number" placeholder="Amount…" value={nf.value}
            onChange={e => onSet({ ...nf, value: e.target.value })} className={inputCls} style={inputStyle} />
        </>
      )}

      {type === 'select' && (
        <div className="flex flex-col gap-0.5 max-h-[180px] overflow-y-auto">
          {options.map(opt => {
            const checked = sf.values.includes(opt)
            return (
              <label key={opt} className="flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer text-[12px]"
                style={{ color: 'var(--text)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <input type="checkbox" checked={checked}
                  onChange={() => onSet({ kind: 'select', values: checked ? sf.values.filter(v => v !== opt) : [...sf.values, opt] })} />
                <span className="truncate">{opt}</span>
              </label>
            )
          })}
          {options.length === 0 && (
            <span className="text-[12px] px-2 py-1" style={{ color: 'var(--text-tertiary)' }}>No options</span>
          )}
        </div>
      )}

      {filter && (
        <button onClick={onClear}
          className="mt-2 w-full text-[11px] py-1.5 rounded-lg cursor-pointer border-none font-semibold"
          style={{ background: 'var(--danger-bg)', color: 'var(--danger)' }}>
          Clear filter
        </button>
      )}
    </div>
  )
}

// ── DataTable ─────────────────────────────────────────────────────────────

export default function DataTable<T extends { id: string }>({
  columns, data, onRowClick, loading = false, emptyMessage = 'No data', className, mobileCard,
}: DataTableProps<T>) {
  const [sortKey, setSortKey]       = useState<string | null>(null)
  const [sortDir, setSortDir]       = useState<'asc' | 'desc'>('asc')
  const [colFilters, setColFilters] = useState<Record<string, ColFilter>>({})
  const [openFilter, setOpenFilter] = useState<string | null>(null)

  const handleSort = useCallback((key: string) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }, [sortKey])

  const setFilter   = useCallback((key: string, f: ColFilter) => setColFilters(p => ({ ...p, [key]: f })), [])
  const clearFilter = useCallback((key: string) => setColFilters(p => { const n = { ...p }; delete n[key]; return n }), [])

  const filtered = useMemo(() => {
    if (Object.keys(colFilters).length === 0) return data
    return data.filter(row => {
      for (const [key, f] of Object.entries(colFilters)) {
        const col = columns.find(c => c.key === key)
        if (!col) continue
        const getter = col.filterValue ?? col.sortValue
        if (!getter) continue
        if (!matches(getter(row), f)) return false
      }
      return true
    })
  }, [data, colFilters, columns])

  const sorted = useMemo(() => {
    if (!sortKey) return filtered
    const col = columns.find(c => c.key === sortKey)
    if (!col?.sortValue) return filtered
    return [...filtered].sort((a, b) => {
      const av = col.sortValue!(a), bv = col.sortValue!(b)
      const cmp = av < bv ? -1 : av > bv ? 1 : 0
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [filtered, sortKey, sortDir, columns])

  const activeFilters = Object.keys(colFilters).length

  if (loading) return (
    <div className={cn('rounded-xl overflow-hidden', className)}
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex gap-4 p-4 animate-pulse" style={{ borderBottom: '1px solid var(--divider)' }}>
          <div className="h-4 rounded w-16" style={{ background: 'var(--surface)' }} />
          <div className="h-4 rounded flex-1" style={{ background: 'var(--surface)' }} />
          <div className="h-4 rounded w-24" style={{ background: 'var(--surface)' }} />
          <div className="h-4 rounded w-16" style={{ background: 'var(--surface)' }} />
        </div>
      ))}
    </div>
  )

  return (
    <>
      {/* Active filter status bar */}
      {activeFilters > 0 && (
        <div className="flex items-center gap-2 mb-2 text-[12px]" style={{ color: 'var(--text-secondary)' }}>
          <Icon name="filter_list" size={14} style={{ color: 'var(--primary)' }} />
          <span>{sorted.length} of {data.length} rows</span>
          <span style={{ color: 'var(--text-tertiary)' }}>·</span>
          <span>{activeFilters} filter{activeFilters > 1 ? 's' : ''} active</span>
          <button onClick={() => setColFilters({})}
            className="ml-1 px-2 py-0.5 rounded-md text-[11px] cursor-pointer border-none font-semibold"
            style={{ background: 'var(--danger-bg)', color: 'var(--danger)' }}>
            Clear all
          </button>
        </div>
      )}

      {/* ── Desktop table ─────────────────────────────────────────────── */}
      <div className={cn('overflow-x-auto', mobileCard && 'hidden md:block', className)}>
        <table className="w-full border-separate border-spacing-0 rounded-xl overflow-hidden"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <thead>
            <tr>
              {columns.map(col => {
                const hasFilter = !!colFilters[col.key]
                return (
                  <th
                    key={col.key}
                    className={cn('text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider relative', col.sortable && 'cursor-pointer select-none')}
                    style={{ textAlign: col.align, width: col.width, color: 'var(--text-tertiary)', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}
                    onClick={col.sortable ? () => handleSort(col.key) : undefined}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.header}
                      {col.sortable && sortKey === col.key && (
                        <span className="text-[10px]" style={{ color: 'var(--primary)' }}>
                          {sortDir === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                      {col.filterable && (
                        <button
                          onClick={e => { e.stopPropagation(); setOpenFilter(o => o === col.key ? null : col.key) }}
                          className="ml-0.5 w-[18px] h-[18px] rounded flex items-center justify-center border-none cursor-pointer transition-all shrink-0"
                          style={{ background: hasFilter ? 'var(--primary)' : 'var(--border)', color: hasFilter ? '#fff' : 'var(--text-tertiary)' }}
                          title={`Filter by ${col.header}`}
                        >
                          <Icon name="filter_list" size={11} />
                        </button>
                      )}
                    </span>

                    {openFilter === col.key && col.filterable && (
                      <FilterPopover
                        col={col} data={data}
                        filter={colFilters[col.key]}
                        onSet={f => setFilter(col.key, f)}
                        onClear={() => clearFilter(col.key)}
                        onClose={() => setOpenFilter(null)}
                      />
                    )}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="text-center py-12 text-[13px]" style={{ color: 'var(--text-tertiary)' }}>
                  {activeFilters > 0 ? 'No rows match the active filters' : emptyMessage}
                </td>
              </tr>
            )}
            {sorted.map((row, rowIdx) => (
              <tr
                key={row.id}
                className={cn('transition-colors', onRowClick && 'cursor-pointer')}
                style={{ background: 'transparent' }}
                onClick={() => onRowClick?.(row)}
                onMouseEnter={onRowClick ? e => (e.currentTarget.style.background = 'var(--surface)') : undefined}
                onMouseLeave={onRowClick ? e => (e.currentTarget.style.background = 'transparent') : undefined}
              >
                {columns.map(col => (
                  <td key={col.key} className="px-4 py-3.5 text-[13px]"
                    style={{ textAlign: col.align, color: 'var(--text)', borderBottom: rowIdx < sorted.length - 1 ? '1px solid var(--divider)' : 'none' }}>
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile cards ──────────────────────────────────────────────── */}
      {mobileCard && (
        <div className="flex flex-col gap-2 md:hidden">
          {sorted.length === 0 ? (
            <div className="text-center py-10 text-[13px]" style={{ color: 'var(--text-tertiary)' }}>
              {activeFilters > 0 ? 'No rows match the active filters' : emptyMessage}
            </div>
          ) : sorted.map(row => (
            <div key={row.id} onClick={() => onRowClick?.(row)}
              className={cn('rounded-2xl p-4 transition-colors', onRowClick && 'cursor-pointer')}
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              {mobileCard(row)}
            </div>
          ))}
        </div>
      )}
    </>
  )
}
