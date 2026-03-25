import Icon from "@/components/ui/icons";

export function Checkbox({ checked, onChange, label }: {
  checked: boolean; onChange: (v: boolean) => void; label: string
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <button type="button" onClick={() => onChange(!checked)}
        className="w-5 h-5 rounded flex items-center justify-center border-none cursor-pointer"
        style={{
          background: checked ? 'var(--primary)' : 'var(--surface)',
          border: checked ? 'none' : '1.5px solid var(--border)',
        }}>
        {checked && <Icon name="check" size={14} style={{ color: '#fff' }} />}
      </button>
      <span className="text-[13px] font-medium" style={{ color: 'var(--text)' }}>{label}</span>
    </label>
  )
}