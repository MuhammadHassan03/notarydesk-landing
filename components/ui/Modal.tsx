'use client'

import { useEffect, useCallback, useRef, type ReactNode } from 'react'
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
  const modalRef = useRef<HTMLDivElement>(null)

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') { onClose(); return }

    // Focus trap: cycle focus within modal
    if (e.key === 'Tab' && modalRef.current) {
      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus()
      }
    }
  }, [onClose])

  useEffect(() => {
    if (!open) return
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    // Auto-focus first focusable element
    setTimeout(() => {
      const first = modalRef.current?.querySelector<HTMLElement>('button, input, select, textarea')
      first?.focus()
    }, 50)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, handleKeyDown])

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
        ref={modalRef}
        className={cn(
          'rounded-2xl p-8 w-full max-h-[90vh] overflow-y-auto',
          SIZES[size],
        )}
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-extrabold mb-1.5" style={{ color: 'var(--text)' }}>{title}</h2>
        {description && <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>{description}</p>}
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