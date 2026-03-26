import Icon from "@/components/ui/icons";

export function IconSelect({ icon: _icon, options, placeholder, className = '', ...props }:
  React.SelectHTMLAttributes<HTMLSelectElement> & {
    icon?: string
    options: { value: string; label: string }[]
    placeholder?: string
  }
) {
  return (
    <div className="relative">
      <select {...props} className={`input-base appearance-none cursor-pointer pr-9 ${className}`}>
        <option value="">{placeholder || 'Select...'}</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-tertiary)' }}>
        <Icon name="expand_more" size={17} />
      </span>
    </div>
  )
}
