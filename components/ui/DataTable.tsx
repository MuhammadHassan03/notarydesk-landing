'use client'

import { useState, useMemo, useCallback, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

// ── Types ─────────────────────────────────────────────────────────────────

export interface Column<T> {
  /** Unique key for the column */
  key: string
  /** Header text */
  header: string
  /** Render function for cell content */
  render: (row: T) => ReactNode
  /** Text alignment */
  align?: 'left' | 'center' | 'right'
  /** Fixed width (e.g. '60px') */
  width?: string
  /** Enable sorting on this column */
  sortable?: boolean
  /** Sort value extractor (defaults to render output for sortable columns) */
  sortValue?: (row: T) => string | number
}

export interface DataTableProps<T extends { id: string }> {
  columns: Column<T>[]
  data: T[]
  /** Callback when a row is clicked */
  onRowClick?: (row: T) => void
  /** Show loading skeleton */
  loading?: boolean
  /** Message when data is empty */
  emptyMessage?: string
  className?: string
}

// ── Component ─────────────────────────────────────────────────────────────

export default function DataTable<T extends { id: string }>({
  columns,
  data,
  onRowClick,
  loading = false,
  emptyMessage = 'No data',
  className,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const handleSort = useCallback((key: string) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }, [sortKey])

  const sorted = useMemo(() => {
    if (!sortKey) return data
    const col = columns.find(c => c.key === sortKey)
    if (!col?.sortValue) return data

    return [...data].sort((a, b) => {
      const av = col.sortValue!(a)
      const bv = col.sortValue!(b)
      const cmp = av < bv ? -1 : av > bv ? 1 : 0
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [data, sortKey, sortDir, columns])

  if (loading) {
    return (
      <div className={cn('bg-white border border-slate-200 rounded-xl overflow-hidden', className)}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4 p-4 border-b border-slate-100 last:border-b-0 animate-pulse">
            <div className="h-4 bg-slate-100 rounded w-16" />
            <div className="h-4 bg-slate-100 rounded flex-1" />
            <div className="h-4 bg-slate-100 rounded w-24" />
            <div className="h-4 bg-slate-100 rounded w-16" />
          </div>
        ))}
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-sm text-slate-400">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full border-separate border-spacing-0 bg-white border border-slate-200 rounded-xl overflow-hidden">
        <thead>
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                className={cn(
                  'text-left px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/80 border-b border-slate-200',
                  col.sortable && 'cursor-pointer select-none hover:text-slate-600',
                )}
                style={{ textAlign: col.align, width: col.width }}
                onClick={col.sortable ? () => handleSort(col.key) : undefined}
              >
                <span className="inline-flex items-center gap-1">
                  {col.header}
                  {col.sortable && sortKey === col.key && (
                    <span className="text-navy text-[10px]">
                      {sortDir === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map(row => (
            <tr
              key={row.id}
              className={cn(
                'transition-colors',
                onRowClick && 'cursor-pointer hover:bg-navy/[0.02]',
              )}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map(col => (
                <td
                  key={col.key}
                  className="px-4 py-3.5 text-sm border-b border-slate-100 last:border-b-0"
                  style={{ textAlign: col.align }}
                >
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}