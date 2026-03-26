'use client'

import { forwardRef, useCallback } from 'react'

function formatUS(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 10)
  if (digits.length === 0) return ''
  if (digits.length <= 3) return `(${digits}`
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

export const PhoneInput = forwardRef<
  HTMLInputElement,
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> & {
    value?: string
    onChange?: (value: string) => void
  }
>(({ value = '', onChange, ...props }, ref) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatUS(e.target.value)
    onChange?.(formatted)
  }, [onChange])

  const isValid = value.replace(/\D/g, '').length === 10

  return (
    <div>
      <input
        ref={ref}
        type="tel"
        inputMode="numeric"
        value={value}
        onChange={handleChange}
        placeholder="(555) 123-4567"
        className="input-base"
        {...props}
      />
      {value && !isValid && (
        <p className="text-[12px] mt-1" style={{ color: 'var(--danger)' }}>
          Enter a 10-digit US phone number
        </p>
      )}
    </div>
  )
})
PhoneInput.displayName = 'PhoneInput'
