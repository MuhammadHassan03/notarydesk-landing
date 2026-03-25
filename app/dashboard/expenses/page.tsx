'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useExpenses, useExpenseSummary, useDeleteExpense } from '@/hooks/use-expenses'
import { EXPENSE_CATEGORIES, getCategoryByKey } from '@/lib/expense-categories'
import { currency, formatDate, monthLabel } from '@/lib/formatters'
import { Icon } from '@/components/ui/icons'
import { Button, Toast } from '@/components/ui'
import { PageHeader } from '@/components/shared'

export default function ExpensesListPage() {
  const router = useRouter()
  const [filter, setFilter] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  const { expenses, loading, refresh } = useExpenses(filter || undefined)
  const { summary, refresh: refreshSummary } = useExpenseSummary()
  const { remove, loading: deleting } = useDeleteExpense()

  const sorted = useMemo(() =>
    [...expenses].sort((a, b) => b.expense_date.localeCompare(a.expense_date)),
  [expenses])

  const catCounts = useMemo(() => {
    const map: Record<string, number> = {}
    expenses.forEach(e => { map[e.category] = (map[e.category] || 0) + 1 })
    return map
  }, [expenses])

  async function handleDelete() {
    if (!deleteId) return
    try {
      await remove(deleteId)
      setDeleteId(null)
      setToast({ msg: 'Expense deleted.', type: 'success' })
      refresh(); refreshSummary()
    } catch (e: any) { setToast({ msg: e.message, type: 'error' }) }
  }

  return (
    <div>
      <PageHeader title="Expenses" subtitle="Track business expenses and maximize tax deductions"
        action={
          <Button variant="gold" href="/dashboard/expenses/new">
            <Icon name="add" size={16} style={{ color: 'inherit' }} /> New expense
          </Button>
        } />

      {/* ── Summary Hero ─────────────────────────────────────── */}
      <div className="rounded-2xl p-6 mb-6" style={{ background: 'var(--primary)', color: '#fff' }}>
        <div className="text-[10px] font-bold tracking-[1.5px] uppercase opacity-50 mb-3">{monthLabel()}</div>
        <div className="flex flex-wrap items-end gap-8">
          <div>
            <div className="text-[36px] font-extrabold -tracking-wider leading-none">{currency(summary?.grand_total)}</div>
            <div className="text-[13px] opacity-50 mt-1">{summary?.expense_count || 0} expense{(summary?.expense_count || 0) !== 1 ? 's' : ''}</div>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl" style={{ background: 'rgba(201,168,76,0.2)' }}>
            <Icon name="savings" size={16} style={{ color: 'var(--accent)' }} />
            <span className="text-[15px] font-bold" style={{ color: 'var(--accent)' }}>{currency(summary?.deductible_total)}</span>
          </div>
          <div className="text-[12px] opacity-40">Tax deductible</div>
        </div>
      </div>

      {/* ── Category Filters ─────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 mb-5">
        <button onClick={() => setFilter(null)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-semibold border-none cursor-pointer transition-all"
          style={{ background: !filter ? 'var(--primary)' : 'var(--surface)', color: !filter ? '#fff' : 'var(--text-secondary)', border: !filter ? 'none' : '1px solid var(--border)' }}>
          All ({expenses.length})
        </button>
        {EXPENSE_CATEGORIES.filter(c => catCounts[c.key]).map(cat => (
          <button key={cat.key} onClick={() => setFilter(filter === cat.key ? null : cat.key)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-semibold border-none cursor-pointer transition-all"
            style={{ background: filter === cat.key ? cat.color : 'var(--surface)', color: filter === cat.key ? '#fff' : 'var(--text-secondary)', border: filter === cat.key ? 'none' : '1px solid var(--border)' }}>
            <Icon name={cat.icon} size={13} /> {cat.label} ({catCounts[cat.key]})
          </button>
        ))}
      </div>

      {/* ── List ─────────────────────────────────────────────── */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-[3px] rounded-full animate-spin-slow" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--primary)' }} />
        </div>
      ) : sorted.length === 0 ? (
        <div className="rounded-2xl p-10 text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <Icon name="account_balance_wallet" size={40} style={{ color: 'var(--text-tertiary)', opacity: 0.3 }} />
          <div className="text-[15px] font-bold mb-1 mt-3" style={{ color: 'var(--text)' }}>{filter ? 'No expenses in this category' : 'No expenses yet'}</div>
          <div className="text-[13px] mb-4" style={{ color: 'var(--text-tertiary)' }}>{filter ? 'Try a different filter' : 'Track your first business expense'}</div>
          <Button variant="gold" href="/dashboard/expenses/new"><Icon name="add" size={16} style={{ color: 'inherit' }} /> Add expense</Button>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          {sorted.map((exp, i) => {
            const cat = getCategoryByKey(exp.category)
            return (
              <div key={exp.id} className="flex items-center gap-3 px-5 py-4 transition-colors cursor-pointer"
                style={{ borderBottom: i < sorted.length - 1 ? '1px solid var(--divider)' : 'none' }}
                onClick={() => router.push(`/dashboard/expenses/${exp.id}`)}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: cat.color + '15' }}>
                  <Icon name={cat.icon} size={18} style={{ color: cat.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-semibold truncate" style={{ color: 'var(--text)' }}>{exp.description}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] px-1.5 py-0.5 rounded font-medium" style={{ background: cat.color + '15', color: cat.color }}>{cat.label}</span>
                    {exp.vendor && <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{exp.vendor}</span>}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[15px] font-bold" style={{ color: 'var(--text)' }}>{currency(exp.amount)}</div>
                  <div className="flex items-center gap-1.5 justify-end mt-0.5">
                    {exp.is_deductible && <Icon name="savings" size={11} style={{ color: 'var(--accent)' }} />}
                    <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{formatDate(exp.expense_date)}</span>
                  </div>
                </div>
                {/* Inline delete */}
                {deleteId === exp.id ? (
                  <div className="flex items-center gap-1.5 shrink-0" onClick={e => e.stopPropagation()}>
                    <Button variant="danger" size="sm" onClick={handleDelete} loading={deleting}>Delete</Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteId(null)}><Icon name="close" size={14} /></Button>
                  </div>
                ) : (
                  <button onClick={e => { e.stopPropagation(); setDeleteId(exp.id) }}
                    className="w-8 h-8 rounded-lg flex items-center justify-center border-none cursor-pointer shrink-0 opacity-0 hover:opacity-100 transition-opacity"
                    style={{ background: 'var(--surface)', color: 'var(--text-tertiary)' }}>
                    <Icon name="close" size={14} />
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* ── Category Breakdown ───────────────────────────────── */}
      {summary && summary.categories.length > 0 && (
        <div className="rounded-2xl p-5 mt-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2 mb-4">
            <Icon name="savings" size={16} style={{ color: 'var(--text-secondary)' }} />
            <span className="text-[12px] font-bold tracking-[1px] uppercase" style={{ color: 'var(--text-secondary)' }}>Category breakdown</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {summary.categories.sort((a, b) => b.total - a.total).map(sc => {
              const cat = getCategoryByKey(sc.category)
              const pct = summary.grand_total > 0 ? (sc.total / summary.grand_total * 100) : 0
              return (
                <div key={sc.category} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: cat.color + '15' }}>
                    <Icon name={cat.icon} size={15} style={{ color: cat.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-semibold truncate" style={{ color: 'var(--text)' }}>{cat.label}</span>
                      <span className="text-[12px] font-bold shrink-0" style={{ color: 'var(--text)' }}>{currency(sc.total)}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full mt-1" style={{ background: 'var(--surface)' }}>
                      <div className="h-1.5 rounded-full transition-all" style={{ width: `${pct}%`, background: cat.color }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {toast && <Toast message={toast.msg} type={toast.type} visible={!!toast} onHide={() => setToast(null)} />}
    </div>
  )
}