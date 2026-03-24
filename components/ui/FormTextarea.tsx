'use client'
import { useState, useEffect, useCallback, type ReactNode } from 'react'
import Link from 'next/link'
import s from '@/styles/components.module.css'

export function FormTextarea({ label, ...props }: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className={s.formGroup}>
      <label className={s.formLabel}>{label}</label>
      <textarea className={s.formTextarea} {...props} />
    </div>
  )
}