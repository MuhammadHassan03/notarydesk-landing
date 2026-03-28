import Icon, { IconName } from "@/components/ui/icons";

export function FormSection({ title, icon, children }: {
  title: string; icon?: IconName; children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl p-4 sm:p-5 mb-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <div className="flex items-center gap-2 mb-4 pb-3" style={{ borderBottom: '1px solid var(--divider)' }}>
        {icon && (
          <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'var(--primary-light)' }}>
            <Icon name={icon} size={14} style={{ color: 'var(--primary)' }} />
          </div>
        )}
        <span className="text-[11px] font-bold tracking-[1.2px] uppercase" style={{ color: 'var(--text-secondary)' }}>
          {title}
        </span>
      </div>
      {children}
    </div>
  )
}