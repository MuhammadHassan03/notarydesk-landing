'use client'

import { useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useMileageTrip, useDeleteMileageTrip } from '@/hooks/use-mileage'
import { currency, formatDate } from '@/lib/formatters'
import { Icon } from '@/components/ui/icons'
import { Button, Toast } from '@/components/ui'
import { PageHeader } from '@/components/shared'

export default function MileageDetailPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const id = params.id

  const { trip, loading } = useMileageTrip(id)
  const { remove, loading: deleting } = useDeleteMileageTrip()

  const [showDelete, setShowDelete] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  const handleDelete = useCallback(async () => {
    if (!id) return
    try {
      await remove(id)
      setToast({ msg: 'Trip deleted.', type: 'success' })
      setTimeout(() => router.push('/dashboard/mileage'), 400)
    } catch (e: any) { setToast({ msg: e.message, type: 'error' }) }
  }, [id, remove, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-9 h-9 border-[3px] rounded-full animate-spin-slow"
          style={{ borderColor: 'var(--border)', borderTopColor: 'var(--primary)' }} />
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="text-center py-20">
        <div className="text-[15px] font-bold mb-2" style={{ color: 'var(--text)' }}>Trip not found</div>
        <Button variant="outline" href="/dashboard/mileage">
          <Icon name="arrow_back" size={16} style={{ color: 'inherit' }} /> Back
        </Button>
      </div>
    )
  }

  const hasGPS = trip.start_lat != null && trip.end_lat != null
  const durationDisplay = trip.duration_minutes
    ? trip.duration_minutes >= 60
      ? `${Math.floor(trip.duration_minutes / 60)}h ${trip.duration_minutes % 60}m`
      : `${trip.duration_minutes} min`
    : null

  return (
    <div className="max-w-[720px]">
      <PageHeader title={trip.label || 'Trip details'} subtitle={formatDate(trip.trip_date)}
        action={
          <div className="flex gap-2">
            <Button variant="outline" href="/dashboard/mileage">
              <Icon name="arrow_back" size={16} style={{ color: 'inherit' }} /> Back
            </Button>
            <Button variant="danger" size="sm" onClick={() => setShowDelete(true)}>
              <Icon name="close" size={14} style={{ color: 'inherit' }} />
            </Button>
          </div>
        } />

      {/* ── Distance + deduction hero ────────────────────────── */}
      <div className="rounded-2xl p-6 mb-5 flex items-center justify-between"
        style={{ background: 'var(--primary)', color: '#fff' }}>
        <div>
          <div className="text-[36px] font-extrabold -tracking-wider leading-none">
            {trip.distance_miles.toFixed(1)} <span className="text-[18px] font-bold opacity-50">mi</span>
          </div>
          {durationDisplay && (
            <div className="text-[13px] opacity-50 mt-1">
              <Icon name="schedule" size={12} style={{ color: 'inherit', verticalAlign: 'middle', marginRight: 4 }} />
              {durationDisplay}
            </div>
          )}
        </div>
        <div className="text-right">
          <div className="text-[28px] font-extrabold" style={{ color: 'var(--accent)' }}>
            {currency(trip.irs_deduction)}
          </div>
          <div className="text-[11px] opacity-50 mt-0.5">
            IRS deduction @ ${(trip.irs_rate || 0.70).toFixed(2)}/mi
          </div>
        </div>
      </div>

      {/* ── Route card ───────────────────────────────────────── */}
      <div className="rounded-2xl p-6 mb-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2 mb-4">
          <Icon name="route" size={16} style={{ color: 'var(--primary)' }} />
          <span className="text-[12px] font-bold tracking-[1px] uppercase" style={{ color: 'var(--text-secondary)' }}>Route</span>
          {hasGPS && (
            <span className="text-[10px] px-2 py-0.5 rounded font-medium ml-auto"
              style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>
              GPS tracked
            </span>
          )}
          {!hasGPS && (
            <span className="text-[10px] px-2 py-0.5 rounded font-medium ml-auto"
              style={{ background: 'var(--surface)', color: 'var(--text-tertiary)' }}>
              Manual entry
            </span>
          )}
        </div>

        {/* Start → End visual */}
        <div className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full" style={{ background: 'var(--success)', border: '2px solid var(--success)' }} />
            <div className="w-0.5 flex-1 my-1" style={{ background: 'var(--border)' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: 'var(--danger)', border: '2px solid var(--danger)' }} />
          </div>
          <div className="flex-1 flex flex-col justify-between gap-3 py-0.5">
            <div>
              <div className="text-[11px] font-bold uppercase" style={{ color: 'var(--success)' }}>Start</div>
              <div className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>{trip.start_address}</div>
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase" style={{ color: 'var(--danger)' }}>End</div>
              <div className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>{trip.end_address}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Details card ─────────────────────────────────────── */}
      <div className="rounded-2xl p-6" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2 mb-4">
          <Icon name="info" size={16} style={{ color: 'var(--primary)' }} />
          <span className="text-[12px] font-bold tracking-[1px] uppercase" style={{ color: 'var(--text-secondary)' }}>Details</span>
        </div>

        <Row icon="schedule" label="Trip date" value={formatDate(trip.trip_date)} />
        <Row icon="route" label="Distance" value={`${trip.distance_miles.toFixed(1)} miles`} />
        <Row icon="savings" label="IRS deduction" value={currency(trip.irs_deduction)} accent />
        <Row icon="attach_money" label="IRS rate" value={`$${(trip.irs_rate || 0.70).toFixed(2)}/mi`} />
        {durationDisplay && <Row icon="schedule" label="Duration" value={durationDisplay} />}
        {trip.label && <Row icon="edit_note" label="Label" value={trip.label} />}
        {hasGPS && <Row icon="location_on" label="Start coords" value={`${trip.start_lat?.toFixed(4)}, ${trip.start_lng?.toFixed(4)}`} />}
        {hasGPS && <Row icon="location_on" label="End coords" value={`${trip.end_lat?.toFixed(4)}, ${trip.end_lng?.toFixed(4)}`} />}
        <Row icon="schedule" label="Created" value={formatDate(trip.created_at?.split('T')[0])} />
      </div>

      {/* ── Delete confirmation ──────────────────────────────── */}
      {showDelete && (
        <div className="rounded-xl p-4 mt-5 flex items-center justify-between"
          style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger)' }}>
          <span className="text-[13px] font-medium" style={{ color: 'var(--danger)' }}>Permanently delete this trip?</span>
          <div className="flex gap-2">
            <Button variant="danger" size="sm" onClick={handleDelete} loading={deleting}>Yes, delete</Button>
            <Button variant="ghost" size="sm" onClick={() => setShowDelete(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.msg} type={toast.type} visible={!!toast} onHide={() => setToast(null)} />}
    </div>
  )
}

function Row({ icon, label, value, accent }: { icon: string; label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center gap-3 py-3" style={{ borderBottom: '1px solid var(--divider)' }}>
      <Icon name={icon as any} size={16} style={{ color: 'var(--text-tertiary)' }} />
      <span className="text-[13px] flex-1" style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <span className="text-[13px] font-semibold text-right" style={{ color: accent ? 'var(--accent)' : 'var(--text)' }}>{value}</span>
    </div>
  )
}