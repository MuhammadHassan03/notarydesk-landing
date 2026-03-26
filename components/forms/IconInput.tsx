import { forwardRef } from "react"

export const IconInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { icon?: string }
>(({ icon: _icon, className = '', ...props }, ref) => (
  <input ref={ref} {...props} className={`input-base ${className}`} />
))
IconInput.displayName = 'IconInput'
