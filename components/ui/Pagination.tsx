'use client'

import { Icon } from '@/components/ui/icons'

export interface PaginationProps {
  page: number
  totalPages: number
  totalItems: number
  pageSize: number
  onPage: (p: number) => void
}

export function Pagination({ page, totalPages, totalItems, pageSize, onPage }: PaginationProps) {
  if (totalPages <= 1) return null

  const start = (page - 1) * pageSize + 1
  const end   = Math.min(page * pageSize, totalItems)

  // Build page numbers with ellipsis: always show first, last, and ±1 around current
  const pages: (number | '…')[] = []
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '…') {
      pages.push('…')
    }
  }

  const btnStyle = (active: boolean): React.CSSProperties => ({
    background: active ? 'var(--primary)' : 'var(--surface)',
    color: active ? '#fff' : 'var(--text-secondary)',
    border: `1px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
    borderRadius: '8px',
    minWidth: '32px',
    height: '32px',
    padding: '0 10px',
    fontSize: '13px',
    fontWeight: active ? 700 : 500,
    cursor: active ? 'default' : 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  })

  return (
    <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
      <span className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>
        Showing {start}–{end} of {totalItems}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPage(page - 1)}
          disabled={page === 1}
          style={{ ...btnStyle(false), opacity: page === 1 ? 0.3 : 1 }}
        >
          <Icon name="chevron_left" size={16} />
        </button>

        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`ellipsis-${i}`} className="px-1 text-[13px]" style={{ color: 'var(--text-tertiary)' }}>…</span>
          ) : (
            <button key={p} onClick={() => onPage(p as number)} style={btnStyle(p === page)}>
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPage(page + 1)}
          disabled={page === totalPages}
          style={{ ...btnStyle(false), opacity: page === totalPages ? 0.3 : 1 }}
        >
          <Icon name="chevron_right" size={16} />
        </button>
      </div>
    </div>
  )
}
