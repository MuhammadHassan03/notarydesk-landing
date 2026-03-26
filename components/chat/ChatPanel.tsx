'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { useConversation, useRealtimeMessages } from '@/hooks/use-messages'
import { ChatBubble } from './ChatBubble'
import { ChatInput } from './ChatInput'
import { Icon } from '@/components/ui/icons'
import type { Message } from '@/lib/types'

interface Props {
  conversationId: string
}

function DateSeparator({ date }: { date: string }) {
  const d = new Date(date)
  const now = new Date()
  const isToday = d.toDateString() === now.toDateString()
  const isYesterday = new Date(now.getTime() - 86400000).toDateString() === d.toDateString()
  const label = isToday ? 'Today' : isYesterday ? 'Yesterday'
    : d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })

  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px" style={{ background: 'var(--divider)' }} />
      <span className="text-[11px] font-semibold px-2" style={{ color: 'var(--text-tertiary)' }}>{label}</span>
      <div className="flex-1 h-px" style={{ background: 'var(--divider)' }} />
    </div>
  )
}

export function ChatPanel({ conversationId }: Props) {
  const { conversation, messages, loading, setMessages } = useConversation(conversationId)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [sending, setSending] = useState(false)

  const handleNewMessage = useCallback((msg: Message) => {
    setMessages(prev => {
      if (prev.some(m => m.id === msg.id)) return prev
      return [...prev, msg]
    })
  }, [setMessages])

  const { sendViaSocket } = useRealtimeMessages(conversationId, handleNewMessage)

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
    }
  }, [messages.length])

  async function handleSend(content: string) {
    setSending(true)
    const sent = sendViaSocket(content)
    if (!sent) {
      const { api } = await import('@/lib/api/client')
      try {
        const newMsg = await api.post<Message>(`/messages/conversations/${conversationId}/messages`, { content })
        if (newMsg) handleNewMessage(newMsg)
      } catch (e) {
        console.error('Failed to send message:', e)
      }
    }
    setSending(false)
  }

  // Group messages by date for separators
  const grouped = messages.reduce<{ date: string; messages: Message[] }[]>((acc, msg) => {
    const d = msg.created_at.split('T')[0]
    const last = acc[acc.length - 1]
    if (!last || last.date !== d) acc.push({ date: d, messages: [msg] })
    else last.messages.push(msg)
    return acc
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center flex-1">
      <div className="w-7 h-7 border-2 rounded-full animate-spin-slow"
        style={{ borderColor: 'var(--border)', borderTopColor: 'var(--primary)' }} />
    </div>
  )

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* ── Header ──────────────────────────────────────────── */}
      {conversation && (
        <div className="flex items-center gap-3 px-5 py-4 shrink-0"
          style={{ borderBottom: '1px solid var(--divider)', background: 'var(--card)' }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-bold shrink-0"
            style={{ background: 'var(--primary)', color: '#fff' }}>
            {conversation.client_name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-bold truncate" style={{ color: 'var(--text)' }}>
              {conversation.client_name}
            </div>
            {conversation.client_email && (
              <div className="text-[11px] truncate" style={{ color: 'var(--text-tertiary)' }}>
                {conversation.client_email}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-medium"
            style={{ color: 'var(--success)' }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--success)' }} />
            Active
          </div>
        </div>
      )}

      {/* ── Messages ────────────────────────────────────────── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 min-h-0"
        style={{ background: 'var(--bg-page)' }}>
        {grouped.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 py-12">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: 'var(--primary-light)' }}>
              <Icon name="chat_bubble_outline" size={28} style={{ color: 'var(--primary)' }} />
            </div>
            <div className="text-center">
              <div className="text-[14px] font-bold mb-1" style={{ color: 'var(--text)' }}>
                No messages yet
              </div>
              <div className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>
                Send a message to start the conversation
              </div>
            </div>
          </div>
        ) : (
          grouped.map(group => (
            <div key={group.date}>
              <DateSeparator date={group.date} />
              {group.messages.map(m => (
                <ChatBubble
                  key={m.id}
                  content={m.content}
                  senderType={m.sender_type}
                  senderName={m.sender_name}
                  timestamp={m.created_at}
                  isRead={m.is_read}
                />
              ))}
            </div>
          ))
        )}
      </div>

      {/* ── Input ───────────────────────────────────────────── */}
      <div className="px-4 py-3 shrink-0" style={{ borderTop: '1px solid var(--divider)', background: 'var(--card)' }}>
        <ChatInput onSend={handleSend} loading={sending} />
      </div>
    </div>
  )
}
