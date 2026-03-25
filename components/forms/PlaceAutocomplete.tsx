/**
 * components/shared/PlaceAutocomplete.tsx
 * =========================================
 * Address autocomplete using OpenStreetMap Nominatim (FREE, no API key).
 * Returns address string + lat/lng coordinates.
 *
 * Usage:
 *   <PlaceAutocomplete
 *     value={address}
 *     onSelect={({ address, lat, lng }) => { ... }}
 *     placeholder="Search address..."
 *     icon="location_on"
 *   />
 */

'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Icon, type IconName } from '@/components/ui/icons'

// ── Types ─────────────────────────────────────────────────────────────────

export interface PlaceResult {
  address: string
  lat: number
  lng: number
}

interface Suggestion {
  display_name: string
  lat: string
  lon: string
}

interface Props {
  value: string
  onSelect: (result: PlaceResult) => void
  onChange?: (value: string) => void
  placeholder?: string
  icon?: IconName
  error?: string
}

// ── Haversine distance (miles) ────────────────────────────────────────────

export function haversineDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number,
): number {
  const R = 3958.8 // Earth radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// ── Nominatim search (free, no key) ───────────────────────────────────────

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search'

async function searchAddress(query: string): Promise<Suggestion[]> {
  if (query.length < 3) return []
  try {
    const params = new URLSearchParams({
      q: query,
      format: 'json',
      limit: '5',
      countrycodes: 'us',
      addressdetails: '0',
    })
    const res = await fetch(`${NOMINATIM_URL}?${params}`, {
      headers: { 'Accept': 'application/json' },
    })
    if (!res.ok) return []
    return await res.json()
  } catch {
    return []
  }
}

// ── Component ─────────────────────────────────────────────────────────────

export default function PlaceAutocomplete({ value, onSelect, onChange, placeholder, icon, error }: Props) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [open, setOpen]     = useState(false)
  const [focused, setFocused] = useState(false)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const wrapperRef  = useRef<HTMLDivElement>(null)

  // Debounced search
  const handleInput = useCallback((val: string) => {
    onChange?.(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (val.length < 3) { setSuggestions([]); setOpen(false); return }

    debounceRef.current = setTimeout(async () => {
      const results = await searchAddress(val)
      setSuggestions(results)
      setOpen(results.length > 0)
    }, 350)
  }, [onChange])

  // Select a suggestion
  const handleSelect = useCallback((s: Suggestion) => {
    const result: PlaceResult = {
      address: s.display_name,
      lat: parseFloat(s.lat),
      lng: parseFloat(s.lon),
    }
    onSelect(result)
    setSuggestions([])
    setOpen(false)
  }, [onSelect])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={wrapperRef} className="relative">
      {icon && (
        <span className="absolute left-3 top-[13px] pointer-events-none z-10"
          style={{ color: focused ? 'var(--primary)' : 'var(--text-tertiary)' }}>
          <Icon name={icon} size={17} />
        </span>
      )}
      <input
        type="text"
        value={value}
        onChange={e => handleInput(e.target.value)}
        onFocus={() => { setFocused(true); if (suggestions.length) setOpen(true) }}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className={`input-base ${icon ? 'pl-9' : ''}`}
        autoComplete="off"
      />

      {/* Dropdown */}
      {open && suggestions.length > 0 && (
        <div className="absolute z-50 left-0 right-0 mt-1 rounded-xl overflow-hidden shadow-lg"
          style={{ background: 'var(--card)', border: '1px solid var(--border)', maxHeight: 240, overflowY: 'auto' }}>
          {suggestions.map((s, i) => (
            <button key={`${s.lat}-${s.lon}-${i}`} type="button"
              className="flex items-start gap-2.5 w-full text-left px-3.5 py-3 border-none cursor-pointer transition-colors"
              style={{ background: 'transparent', borderBottom: i < suggestions.length - 1 ? '1px solid var(--divider)' : 'none' }}
              onMouseDown={() => handleSelect(s)}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <Icon name="location_on" size={15} style={{ color: 'var(--primary)', marginTop: 2, flexShrink: 0 }} />
              <span className="text-[13px] leading-snug" style={{ color: 'var(--text)' }}>
                {s.display_name}
              </span>
            </button>
          ))}
          <div className="px-3 py-1.5 text-right" style={{ background: 'var(--surface)' }}>
            <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
              Powered by OpenStreetMap
            </span>
          </div>
        </div>
      )}

      {error && <p className="text-[12px] mt-1" style={{ color: 'var(--danger)' }}>{error}</p>}
    </div>
  )
}