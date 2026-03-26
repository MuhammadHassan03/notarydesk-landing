'use client'

import { useState, useRef, useCallback } from 'react'
import { Icon } from '@/components/ui/icons'

interface Props {
  onSend: (message: string) => void
  loading?: boolean
  placeholder?: string
}

export function ChatInput({ onSend, loading, placeholder = 'Type a message...' }: Props) {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = useCallback(() => {
    const trimmed = value.trim()
    if (!trimmed || loading) return
    onSend(trimmed)
    setValue('')
    inputRef.current?.focus()
  }, [value, loading, onSend])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }, [handleSend])

  const charCount = value.length
  const MAX_CHARS = 5000
  const showCount = charCount > 4500

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-end gap-2 p-3 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <textarea
          ref={inputRef}
          value={value}
          onChange={e => { if (e.target.value.length <= MAX_CHARS) setValue(e.target.value) }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          className="flex-1 resize-none border-none outline-none text-[13px] leading-relaxed bg-transparent min-h-[20px] max-h-[120px]"
          style={{ color: 'var(--text)' }}
        />
        <button
          onClick={handleSend}
          disabled={!value.trim() || loading}
          className="w-9 h-9 rounded-xl flex items-center justify-center border-none cursor-pointer transition-all shrink-0 disabled:opacity-30"
          style={{ background: 'var(--primary)', color: '#fff' }}
        >
          {loading ? (
            <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} />
          ) : (
            <Icon name="send" size={18} style={{ color: 'inherit' }} />
          )}
        </button>
      </div>
      {showCount && (
        <div className="text-[10px] text-right px-1" style={{ color: charCount >= MAX_CHARS ? 'var(--danger)' : 'var(--text-tertiary)' }}>
          {charCount}/{MAX_CHARS}
        </div>
      )}
    </div>
  )
}
