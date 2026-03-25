export function Toggle({ value, onChange, label, description }: {
  value: boolean; onChange: (v: boolean) => void
  label?: string; description?: string
}) {
  return (
    <div className="flex items-center justify-between">
      {(label || description) && (
        <div>
          {label && <p className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>{label}</p>}
          {description && <p className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>{description}</p>}
        </div>
      )}
      <button type="button" onClick={() => onChange(!value)}
        className="w-11 h-6 rounded-full border-none cursor-pointer transition-colors relative shrink-0"
        style={{ background: value ? 'var(--primary)' : 'var(--border)' }}>
        <span className="absolute top-0.5 w-5 h-5 rounded-full transition-all"
          style={{ background: '#fff', left: value ? '22px' : '2px', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
      </button>
    </div>
  )
}