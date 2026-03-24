'use client'
import { useState, useEffect, useCallback, type ReactNode } from 'react'
import Link from 'next/link'
import s from '@/styles/components.module.css'

export function PillSelector({ options, value, onChange }: {
  options: { value: string; label: string }[]; value: string; onChange: (v: string) => void
}) {
  return (
    <div className={s.pills}>
      {options.map(o => (
        <button key={o.value} type="button" className={`${s.pill} ${value === o.value ? s.pillActive : ''}`} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  )
}