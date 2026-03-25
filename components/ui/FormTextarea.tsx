'use client'

export function FormTextarea({ label, ...props }: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-semibold" style={{ color: 'var(--text-secondary)' }}>{label}</label>
      <textarea className="input-base min-h-[100px] resize-y" {...props} />
    </div>
  )
}
