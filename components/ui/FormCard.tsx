'use client'
import { useState, useEffect, useCallback, type ReactNode } from 'react'
import Link from 'next/link'
import s from '@/styles/components.module.css'

export function FormCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className={s.formCard}>
      <div className={s.formSection}>{title}</div>
      {children}
    </div>
  )
}