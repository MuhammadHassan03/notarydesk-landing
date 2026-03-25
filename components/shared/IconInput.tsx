import { forwardRef } from "react"
import Icon, { IconName } from "@/components/ui/icons"

export const IconInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { icon?: IconName }
>(({ icon, className = '', ...props }, ref) => (
  <div className="relative">
    {icon && (
      <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-tertiary)' }}>
        <Icon name={icon} size={17} />
      </span>
    )}
    <input ref={ref} {...props} className={`input-base ${icon ? 'pl-9' : ''} ${className}`} />
  </div>
))
IconInput.displayName = 'IconInput'