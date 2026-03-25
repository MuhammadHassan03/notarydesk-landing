'use client'

import { useEffect, useCallback, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import Button from './Button'

// ── Types ─────────────────────────────────────────────────────────────────

export interface ModalProps {
  /** Whether the modal is visible */
  open: boolean
  /** Called when the modal should close */
  onClose: () => void
  /** Modal title */
  title: string
  /** Optional description below the title */
  description?: string
  /** Modal width preset */
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

export interface ConfirmModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'primary'
  loading?: boolean
}

// ── Size map ──────────────────────────────────────────────────────────────

const SIZES = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
}

// ── Modal ─────────────────────────────────────────────────────────────────

export default function Modal({
  open,
  onClose,
  title,
  description,
  size = 'md',
  children,
}: ModalProps) {
  const handleEsc = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (!open) return
    document.addEventListener('keydown', handleEsc)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [open, handleEsc])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 bg-black/45 flex items-center justify-center z-[100] p-5 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className={cn(
          'bg-white rounded-2xl p-8 w-full max-h-[90vh] overflow-y-auto',
          SIZES[size],
        )}
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-extrabold text-slate-900 mb-1.5">{title}</h2>
        {description && <p className="text-sm text-slate-500 mb-6">{description}</p>}
        {children}
      </div>
    </div>
  )
}

// ── ConfirmModal (prebuilt pattern) ───────────────────────────────────────

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading = false,
}: ConfirmModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} description={description} size="sm">
      <div className="flex gap-3 mt-2">
        <Button
          variant={variant === 'danger' ? 'danger' : 'primary'}
          onClick={onConfirm}
          loading={loading}
          fullWidth
        >
          {confirmLabel}
        </Button>
        <Button variant="outline" onClick={onClose} fullWidth>
          {cancelLabel}
        </Button>
      </div>
    </Modal>
  )
}