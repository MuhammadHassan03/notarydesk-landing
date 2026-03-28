'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Icon } from '@/components/ui/icons'

interface Props {
  onSend: (message: string) => void
  loading?: boolean
  placeholder?: string
  /** Called with `true` when typing starts, `false` when stopped (debounced 2s) */
  onTyping?: (typing: boolean) => void
}

const MAX_CHARS = 5000

export function ChatInput({ onSend, loading, placeholder = 'Type a message...', onTyping }: Props) {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const typingTimer = useRef<ReturnType<typeof setTimeout>>()
  const isTyping = useRef(false)

  // Clean up typing timer on unmount
  useEffect(() => () => clearTimeout(typingTimer.current), [])

  const handleSend = useCallback(() => {
    const trimmed = value.trim()
    if (!trimmed || loading) return
    // Stop typing indicator when sending
    clearTimeout(typingTimer.current)
    if (isTyping.current) { isTyping.current = false; onTyping?.(false) }
    onSend(trimmed)
    setValue('')
    inputRef.current?.focus()
  }, [value, loading, onSend, onTyping])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }, [handleSend])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const v = e.target.value
    if (v.length > 5000) return
    setValue(v)
    // Auto-resize
    const ta = e.target
    ta.style.height = 'auto'
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`
    // Typing indicator
    if (v.length > 0) {
      if (!isTyping.current) { isTyping.current = true; onTyping?.(true) }
      clearTimeout(typingTimer.current)
      typingTimer.current = setTimeout(() => {
        isTyping.current = false
        onTyping?.(false)
      }, 2000)
    } else {
      clearTimeout(typingTimer.current)
      if (isTyping.current) { isTyping.current = false; onTyping?.(false) }
    }
  }, [onTyping])

  const charCount = value.length
  const showCount = charCount > 4500

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-end gap-2 p-3 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <textarea
          ref={inputRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          className="flex-1 resize-none border-none outline-none text-[13px] leading-relaxed bg-transparent min-h-[20px] max-h-[120px]"
          style={{ color: 'var(--text)', height: 'auto', overflowY: 'auto' }}
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
        <div className="text-[10px] text-right px-1" style={{ color: charCount >= 5000 ? 'var(--danger)' : 'var(--text-tertiary)' }}>
          {charCount}/{MAX_CHARS}
        </div>
      )}
    </div>
  )
}
