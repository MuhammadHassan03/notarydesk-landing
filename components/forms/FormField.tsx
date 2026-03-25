import Icon, { IconName } from "@/components/ui/icons";

export function FormField({ label, icon, hint, error, required, children }: {
  label: string; icon?: IconName; hint?: string; error?: string
  required?: boolean; children: React.ReactNode
}) {
  return (
    <div className="mb-4">
      <label className="flex items-center gap-1.5 text-[13px] font-semibold mb-1.5" style={{ color: 'var(--text)' }}>
        {icon && <Icon name={icon} size={14} style={{ color: 'var(--text-tertiary)', marginTop: -1 }} />}
        {label}
        {required && <span style={{ color: 'var(--danger)' }}>*</span>}
      </label>
      {children}
      {error && <p className="text-[12px] mt-1" style={{ color: 'var(--danger)' }}>{error}</p>}
      {hint && !error && <p className="text-[12px] mt-1" style={{ color: 'var(--text-tertiary)' }}>{hint}</p>}
    </div>
  )
}
 