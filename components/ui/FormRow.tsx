'use client'
import { useState, useEffect, useCallback, type ReactNode } from 'react'
import Link from 'next/link'
import s from '@/styles/components.module.css'

export function FormRow({ children }: { children: ReactNode }) {
  return <div className={s.formRow}>{children}</div>
}