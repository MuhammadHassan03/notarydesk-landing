'use client'

// ── Types ─────────────────────────────────────────────────────────────────

export interface CounterProps {
  /** Current value */
  value: number
  /** Callback when value changes */
  onChange: (value: number) => void
  /** Minimum allowed value (default 1) */
  min?: number
  /** Maximum allowed value (default 100) */
  max?: number
  /** Unit label shown below the number */
  unit?: string
}

// ── Component ─────────────────────────────────────────────────────────────

export default function Counter({
  value,
  onChange,
  min = 1,
  max = 100,
  unit,
}: CounterProps) {
  const canDecrement = value > min
  const canIncrement = value < max

  return (
    <div className="inline-flex items-center border border-slate-200 rounded-[10px] overflow-hidden">
      <button
        type="button"
        disabled={!canDecrement}
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-11 h-11 bg-slate-50 text-xl flex items-center justify-center hover:bg-slate-100 transition-colors border-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed text-navy"
        aria-label="Decrease"
      >
        −
      </button>
      <div className="min-w-[56px] text-center px-2">
        <div className="text-xl font-bold text-slate-900">{value}</div>
        {unit && <div className="text-[10px] text-slate-400 -mt-0.5">{unit}</div>}
      </div>
      <button
        type="button"
        disabled={!canIncrement}
        onClick={() => onChange(Math.min(max, value + 1))}
        className="w-11 h-11 bg-slate-50 text-xl flex items-center justify-center hover:bg-slate-100 transition-colors border-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed text-navy"
        aria-label="Increase"
      >
        +
      </button>
    </div>
  )
}