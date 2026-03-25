'use client'

export function PillSelector({ options, value, onChange }: {
  options: { value: string; label: string }[]; value: string; onChange: (v: string) => void
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      {options.map(o => (
        <button
          key={o.value}
          type="button"
          className={`px-4 py-2 rounded-xl text-[13px] font-semibold border-none cursor-pointer transition-colors duration-150 ${
            value === o.value
              ? 'text-white'
              : 'hover:opacity-80'
          }`}
          style={{
            background: value === o.value ? 'var(--primary)' : 'var(--surface)',
            color: value === o.value ? '#fff' : 'var(--text-secondary)',
          }}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
