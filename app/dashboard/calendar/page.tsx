'use client'

import { useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useCalendarEvents, type CalendarEvent } from '@/hooks/use-calendar'
import { JOB_STATUS_CONFIG } from '@/lib/constants'
import { currency } from '@/lib/utils'
import { getDaysInMonth, getFirstDayOfMonth, getMonthLabel, formatDateStr, isToday, WEEKDAYS } from '@/lib/utils'
import { Icon } from '@/components/ui/icons'
import { PageHeader } from '@/components/layout'
import { Button } from '@/components/ui'

function EventPill({ event, onClick }: { event: CalendarEvent; onClick: () => void }) {
  const config = JOB_STATUS_CONFIG[event.status as keyof typeof JOB_STATUS_CONFIG] || { color: '#64748B', bg: '#F1F5F9' }
  return (
    <button onClick={onClick}
      className="w-full text-left px-1.5 py-0.5 rounded text-[10px] font-semibold truncate border-none cursor-pointer transition-opacity hover:opacity-80 block"
      style={{ background: config.bg, color: config.color }}>
      {event.time && <span className="opacity-60">{event.time.slice(0, 5)} </span>}
      {event.title}
    </button>
  )
}

export default function CalendarPage() {
  const router = useRouter()
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const { events, loading } = useCalendarEvents(year, month)

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)
  const monthLabel = getMonthLabel(year, month)

  // Group events by date
  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {}
    events.forEach(e => {
      const day = e.date.slice(0, 10)
      if (!map[day]) map[day] = []
      map[day].push(e)
    })
    return map
  }, [events])

  // Events for selected date
  const selectedEvents = selectedDate ? eventsByDate[selectedDate] || [] : []

  const prevMonth = useCallback(() => {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
    setSelectedDate(null)
  }, [month])

  const nextMonth = useCallback(() => {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
    setSelectedDate(null)
  }, [month])

  const goToday = useCallback(() => {
    setYear(today.getFullYear())
    setMonth(today.getMonth())
    setSelectedDate(formatDateStr(today.getFullYear(), today.getMonth(), today.getDate()))
  }, [today])

  // Build calendar grid cells
  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  // Pad to fill last row
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div>
      <PageHeader title="Calendar" subtitle={`${events.length} scheduled signing${events.length !== 1 ? 's' : ''} this month`}
        action={
          <Button variant="gold" href="/dashboard/jobs/new">
            <Icon name="add" size={16} style={{ color: 'inherit' }} /> New Job
          </Button>
        } />

      {/* ── Month navigation ──────────────────────────────── */}
      <div className="flex items-center gap-3 mb-5">
        <button onClick={prevMonth} aria-label="Previous month" className="w-9 h-9 rounded-lg flex items-center justify-center border-none cursor-pointer"
          style={{ background: 'var(--surface)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
          <Icon name="chevron_left" size={20} />
        </button>
        <h2 className="text-[18px] font-bold min-w-[200px] text-center" style={{ color: 'var(--text)' }} aria-live="polite">
          {monthLabel}
        </h2>
        <button onClick={nextMonth} aria-label="Next month" className="w-9 h-9 rounded-lg flex items-center justify-center border-none cursor-pointer"
          style={{ background: 'var(--surface)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
          <Icon name="chevron_right" size={20} />
        </button>
        <button onClick={goToday} className="ml-2 px-3 py-1.5 rounded-lg text-[12px] font-semibold border-none cursor-pointer"
          style={{ background: 'var(--surface)', color: 'var(--primary)', border: '1px solid var(--border)' }}>
          Today
        </button>
      </div>

      <div className="flex gap-5">
        {/* ── Calendar grid ──────────────────────────────────── */}
        <div className="flex-1 rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          {/* Weekday header */}
          <div className="grid grid-cols-7">
            {WEEKDAYS.map(d => (
              <div key={d} className="text-center py-2.5 text-[11px] font-bold uppercase tracking-wider"
                style={{ color: 'var(--text-tertiary)', borderBottom: '1px solid var(--divider)' }}>
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7">
            {cells.map((day, i) => {
              if (day === null) {
                return <div key={`empty-${i}`} className="min-h-[90px] p-1" style={{ borderBottom: '1px solid var(--divider)', borderRight: i % 7 !== 6 ? '1px solid var(--divider)' : 'none' }} />
              }

              const dateStr = formatDateStr(year, month, day)
              const dayEvents = eventsByDate[dateStr] || []
              const isSelected = selectedDate === dateStr
              const isTodayCell = isToday(dateStr)

              return (
                <button key={day} onClick={() => setSelectedDate(dateStr)}
                  aria-label={`${new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}${dayEvents.length ? `, ${dayEvents.length} signing${dayEvents.length > 1 ? 's' : ''}` : ''}`}
                  aria-current={isTodayCell ? 'date' : undefined}
                  aria-pressed={isSelected}
                  className="min-h-[90px] p-1.5 text-left border-none cursor-pointer transition-colors bg-transparent"
                  style={{
                    borderBottom: '1px solid var(--divider)',
                    borderRight: i % 7 !== 6 ? '1px solid var(--divider)' : 'none',
                    background: isSelected ? 'var(--primary-pale, rgba(27,58,92,0.04))' : 'transparent',
                  }}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold mb-1 ${isTodayCell ? '' : ''}`}
                    style={{
                      background: isTodayCell ? 'var(--primary)' : 'transparent',
                      color: isTodayCell ? '#fff' : 'var(--text)',
                    }}>
                    {day}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {dayEvents.slice(0, 3).map(e => (
                      <EventPill key={e.id} event={e} onClick={() => router.push(`/dashboard/jobs/${e.id}`)} />
                    ))}
                    {dayEvents.length > 3 && (
                      <span className="text-[9px] font-bold px-1" style={{ color: 'var(--text-tertiary)' }}>
                        +{dayEvents.length - 3} more
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Side panel: selected day detail ────────────────── */}
        <div className="w-[280px] shrink-0 max-lg:hidden">
          <div className="rounded-2xl p-4 sticky top-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            {selectedDate ? (
              <>
                <div className="text-[13px] font-bold mb-3" style={{ color: 'var(--text)' }}>
                  {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </div>
                {selectedEvents.length === 0 ? (
                  <div className="text-center py-6">
                    <Icon name="event_busy" size={24} style={{ color: 'var(--text-tertiary)', opacity: 0.3 }} />
                    <div className="text-[12px] mt-2" style={{ color: 'var(--text-tertiary)' }}>No signings scheduled</div>
                    <Button variant="outline" size="sm" href={`/dashboard/jobs/new`} className="mt-3">
                      <Icon name="add" size={14} style={{ color: 'inherit' }} /> Schedule job
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {selectedEvents.map(e => {
                      const config = JOB_STATUS_CONFIG[e.status as keyof typeof JOB_STATUS_CONFIG] || { color: '#64748B', bg: '#F1F5F9', label: e.status }
                      return (
                        <button key={e.id} onClick={() => router.push(`/dashboard/jobs/${e.id}`)}
                          className="w-full text-left p-3 rounded-xl border-none cursor-pointer transition-all hover:-translate-y-px"
                          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[13px] font-semibold truncate" style={{ color: 'var(--text)' }}>{e.title}</span>
                            <span className="text-[12px] font-bold" style={{ color: 'var(--primary)' }}>{currency(e.fee)}</span>
                          </div>
                          {e.time && (
                            <div className="flex items-center gap-1 text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                              <Icon name="schedule" size={11} style={{ color: 'inherit' }} />
                              {e.time.slice(0, 5)}
                            </div>
                          )}
                          <span className="inline-block mt-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded"
                            style={{ background: config.bg, color: config.color }}>
                            {config.label}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-6">
                <Icon name="calendar_month" size={28} style={{ color: 'var(--text-tertiary)', opacity: 0.3 }} />
                <div className="text-[12px] mt-2" style={{ color: 'var(--text-tertiary)' }}>Click a day to see details</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
