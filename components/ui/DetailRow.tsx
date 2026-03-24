'use client'
import { useState, useEffect, useCallback, type ReactNode } from 'react'
import Link from 'next/link'
import s from '@/styles/components.module.css'

export function DetailRow({ label, value, color }: { label: string; value: string | ReactNode; color?: string }) {
  if (!value) return null
  return (
    <div className={s.detailRow}>
      <span className={s.detailLabel}>{label}</span>
      <span className={s.detailValue} style={color ? { color } : undefined}>{value}</span>
    </div>
  )
}