'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useCreateMileageTrip, useMileageSummary } from '@/hooks/use-mileage'
import { currency, todayISO } from '@/lib/utils'
import { Icon } from '@/components/ui/icons'
import { Button, Toast } from '@/components/ui'
import { PageHeader } from '@/components/layout'
import PlaceAutocomplete, { haversineDistance, type PlaceResult } from '@/components/forms/PlaceAutocomplete'
import { FormSection } from '@/components/forms/FormSection'
import { FormField } from '@/components/forms/FormField'
import { IconInput } from '@/components/forms/IconInput'
import { FormActions } from '@/components/forms/FormActions'
const IRS_RATE_FALLBACK = 0.70

export default function NewMileageTripPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { create, loading } = useCreateMileageTrip()
  const { summary } = useMileageSummary()
  const irsRate = summary?.irs_rate || IRS_RATE_FALLBACK

  // Pre-fill from query params (e.g. coming from a new signing job)
  const prefillTo    = searchParams.get('to') || ''
  const prefillLabel = searchParams.get('label') || ''
  const prefillDate  = searchParams.get('date') || ''

  // Route
  const [startAddr, setStartAddr] = useState('')
  const [startLat, setStartLat]   = useState<number | null>(null)
  const [startLng, setStartLng]   = useState<number | null>(null)
  const [endAddr, setEndAddr]     = useState(prefillTo)
  const [endLat, setEndLat]       = useState<number | null>(null)
  const [endLng, setEndLng]       = useState<number | null>(null)

  // Details
  const [miles, setMiles]             = useState('')
  const [tripDate, setTripDate]       = useState(prefillDate || todayISO())
  const [durationMin, setDurationMin] = useState('')
  const [label, setLabel]             = useState(prefillLabel)
  const [manualMiles, setManualMiles] = useState(!!prefillTo)
  const [errors, setErrors]           = useState<Record<string, string>>({})
  const [toast, setToast]             = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  // Auto-calculate distance when both coords are set
  useEffect(() => {
    if (manualMiles) return
    if (startLat != null && startLng != null && endLat != null && endLng != null) {
      const d = haversineDistance(startLat, startLng, endLat, endLng)
      const roadEstimate = Math.min(d * 1.3, 999)
      setMiles(roadEstimate.toFixed(1))
    }
  }, [startLat, startLng, endLat, endLng, manualMiles])

  const parsedMiles = parseFloat(miles) || 0
  const deduction = useMemo(() => parsedMiles * irsRate, [parsedMiles, irsRate])

  const handleStartSelect = useCallback((result: PlaceResult) => {
    setStartAddr(result.address)
    setStartLat(result.lat)
    setStartLng(result.lng)
    setErrors(p => ({ ...p, startAddr: '' }))
  }, [])

  const handleEndSelect = useCallback((result: PlaceResult) => {
    setEndAddr(result.address)
    setEndLat(result.lat)
    setEndLng(result.lng)
    setErrors(p => ({ ...p, endAddr: '' }))
  }, [])

  const handleSubmit = useCallback(async () => {
    const errs: Record<string, string> = {}
    if (!startAddr.trim()) errs.startAddr = 'Start address is required'
    if (!endAddr.trim()) errs.endAddr = 'End address is required'
    if (!parsedMiles || parsedMiles <= 0) errs.miles = 'Enter a valid distance'
    if (parsedMiles > 1000) errs.miles = 'Max 1,000 miles per trip — split long trips'
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})

    try {
      await create({
        trip_date: tripDate,
        start_address: startAddr.trim(),
        end_address: endAddr.trim(),
        distance_miles: parsedMiles,
        label: label.trim() || undefined,
        duration_minutes: durationMin ? parseInt(durationMin) : undefined,
        start_lat: startLat ?? undefined,
        start_lng: startLng ?? undefined,
        end_lat: endLat ?? undefined,
        end_lng: endLng ?? undefined,
      })
      setToast({ msg: 'Trip saved!', type: 'success' })
      setTimeout(() => router.push('/dashboard/mileage'), 600)
    } catch (e: any) {
      setToast({ msg: e.message || 'Failed to save trip.', type: 'error' })
    }
  }, [tripDate, startAddr, endAddr, parsedMiles, label, durationMin, startLat, startLng, endLat, endLng, create, router])

  const bothSet = startLat != null && endLat != null

  return (
    <div className="max-w-[720px]">
      <Link href="/dashboard/mileage" className="inline-flex items-center gap-1.5 text-[13px] font-medium mb-4 no-underline transition-opacity hover:opacity-70" style={{ color: 'var(--text-secondary)' }}>
        <Icon name="arrow_back" size={15} style={{ color: 'inherit' }} /> Back to mileage
      </Link>
      <PageHeader title="Log a trip" subtitle="Record a business trip for IRS mileage deduction" />

      {/* ── Live deduction preview ───────────────────────────── */}
      {parsedMiles > 0 && (
        <div className="rounded-xl px-5 py-4 mb-5 flex items-center justify-between"
          style={{ background: 'var(--primary)', color: '#fff' }}>
          <div className="flex items-center gap-3">
            <Icon name="route" size={20} style={{ color: 'var(--accent)' }} />
            <div>
              <div className="text-[18px] font-extrabold">{parsedMiles.toFixed(1)} mi</div>
              <div className="text-[11px] opacity-50">Distance</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[18px] font-extrabold" style={{ color: 'var(--accent)' }}>
              {currency(deduction)}
            </div>
            <div className="text-[11px] opacity-50">IRS deduction @ ${irsRate.toFixed(2)}/mi</div>
          </div>
        </div>
      )}

      {/* ── Route ────────────────────────────────────────────── */}
      <FormSection title="Route">
        <FormField label="Start address" required error={errors.startAddr}>
          <PlaceAutocomplete
            value={startAddr}
            onChange={setStartAddr}
            onSelect={handleStartSelect}
            placeholder="Search start address..."
           
          />
          {startLat && (
            <div className="flex items-center gap-1 mt-1">
              <Icon name="check_circle" size={12} style={{ color: 'var(--success)' }} />
              <span className="text-[11px]" style={{ color: 'var(--success)' }}>
                {startLat.toFixed(4)}, {startLng?.toFixed(4)}
              </span>
            </div>
          )}
        </FormField>

        <FormField label="End address" required error={errors.endAddr}>
          <PlaceAutocomplete
            value={endAddr}
            onChange={setEndAddr}
            onSelect={handleEndSelect}
            placeholder="Search end address..."
           
          />
          {endLat && (
            <div className="flex items-center gap-1 mt-1">
              <Icon name="check_circle" size={12} style={{ color: 'var(--success)' }} />
              <span className="text-[11px]" style={{ color: 'var(--success)' }}>
                {endLat.toFixed(4)}, {endLng?.toFixed(4)}
              </span>
            </div>
          )}
        </FormField>

        {/* Route preview — OpenStreetMap embed (free) */}
        {bothSet && (
          <div className="rounded-xl overflow-hidden mt-2" style={{ border: '1px solid var(--border)', height: 200 }}>
            <iframe
              width="100%" height="200" frameBorder="0" style={{ border: 0 }}
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${Math.min(startLng!, endLng!) - 0.02},${Math.min(startLat!, endLat!) - 0.02},${Math.max(startLng!, endLng!) + 0.02},${Math.max(startLat!, endLat!) + 0.02}&layer=mapnik&marker=${endLat},${endLng}`}
              title="Route preview"
            />
          </div>
        )}
      </FormSection>

      {/* ── Trip details ─────────────────────────────────────── */}
      <FormSection title="Trip details">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4">
          <FormField label="Distance (miles)" required error={errors.miles}
            hint={bothSet && !manualMiles ? 'Auto-estimated from addresses' : undefined}>
            <IconInput type="number" step="0.1" placeholder="12.4"
              value={miles}
              onChange={e => { setMiles(e.target.value); setManualMiles(true); setErrors(p => ({ ...p, miles: '' })) }}
              style={bothSet && !manualMiles ? { background: 'var(--success-bg)' } : {}}
            />
            {bothSet && manualMiles && (
              <button type="button" onClick={() => setManualMiles(false)}
                className="text-[11px] font-medium mt-1 border-none bg-transparent cursor-pointer underline"
                style={{ color: 'var(--primary)' }}>
                Recalculate from addresses
              </button>
            )}
          </FormField>
          <FormField label="Trip date">
            <IconInput type="date" value={tripDate} onChange={e => setTripDate(e.target.value)} />
          </FormField>
          <FormField label="Duration (min)" hint="Optional">
            <IconInput type="number" placeholder="28"
              value={durationMin} onChange={e => setDurationMin(e.target.value)} />
          </FormField>
        </div>
        <FormField label="Trip label" hint="e.g. 'James Patterson signing' — helps identify trips">
          <IconInput placeholder="Optional label for this trip"
            value={label} onChange={e => setLabel(e.target.value)} />
        </FormField>
      </FormSection>

      {/* ── IRS info ─────────────────────────────────────────── */}
      <FormSection title="IRS deduction">
        <div className="flex items-center gap-3 py-2">
          <Icon name="info" size={15} style={{ color: 'var(--text-tertiary)' }} />
          <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
            The IRS standard mileage rate is <strong>${irsRate.toFixed(2)} per mile</strong>.
            Your deduction is calculated server-side. Only business miles qualify.
            Use the address search to get accurate coordinates and auto-estimated distance.
          </p>
        </div>
      </FormSection>

      {/* ── Actions ──────────────────────────────────────────── */}
      <FormActions>
        <Button variant="gold" onClick={handleSubmit} loading={loading} fullWidth size="lg">
          <Icon name="add_circle" size={16} style={{ color: 'inherit' }} /> Save trip
        </Button>
        <Button variant="outline" href="/dashboard/mileage" size="lg">Cancel</Button>
      </FormActions>

      {toast && <Toast message={toast.msg} type={toast.type} visible={!!toast} onHide={() => setToast(null)} />}
    </div>
  )
}