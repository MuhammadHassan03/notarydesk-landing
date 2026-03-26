export function FormField({ label, hint, error, required, children }: {
  label: string; hint?: string; error?: string
  required?: boolean; children: React.ReactNode
}) {
  return (
    <div className="mb-4">
      <label className="block text-[13px] font-semibold mb-1.5" style={{ color: 'var(--text)' }}>
        {label}
        {required && <span className="ml-0.5" style={{ color: 'var(--danger)' }}>*</span>}
      </label>
      {children}
      {error && <p className="text-[12px] mt-1" style={{ color: 'var(--danger)' }}>{error}</p>}
      {hint && !error && <p className="text-[12px] mt-1" style={{ color: 'var(--text-tertiary)' }}>{hint}</p>}
    </div>
  )
}
