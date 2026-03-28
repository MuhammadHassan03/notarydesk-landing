'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { useConversation, useSendMessage } from '@/hooks/use-messages'
import { subscribeToTyping, sendTypingEvent } from '@/lib/realtime'
import { useAuth, useProfile } from '@/context/auth'
import { ChatBubble } from './ChatBubble'
import { ChatInput } from './ChatInput'
import { Icon } from '@/components/ui/icons'
import type { Message } from '@/lib/types'

// Generate a temporary ID for optimistic messages
function tempId() {
  return `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

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
  const { send: apiSend, loading: sendLoading } = useSendMessage()
  const { profile } = useProfile()
  const scrollRef = useRef<HTMLDivElement>(null)
  const isAtBottomRef = useRef(true)
  const [copied, setCopied] = useState(false)
  const [clientTyping, setClientTyping] = useState(false)
  const clientTypingTimer = useRef<ReturnType<typeof setTimeout>>()

  // Track if user is at bottom of scroll
  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
    isAtBottomRef.current = scrollHeight - scrollTop - clientHeight < 60
  }, [])

  // Auto-scroll only if user is at the bottom
  useEffect(() => {
    if (isAtBottomRef.current && scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
    }
  }, [messages.length, clientTyping])

  // Subscribe to client typing events
  useEffect(() => {
    const unsub = subscribeToTyping(conversationId, (data) => {
      if (data.user_id === 'client') {
        setClientTyping(data.typing)
        if (data.typing) {
          clearTimeout(clientTypingTimer.current)
          // Auto-clear after 4s in case the "stopped" event is missed
          clientTypingTimer.current = setTimeout(() => setClientTyping(false), 4000)
        } else {
          clearTimeout(clientTypingTimer.current)
        }
      }
    })
    return () => { unsub(); clearTimeout(clientTypingTimer.current) }
  }, [conversationId])

  // Emit notary-side typing event to the broadcast channel
  const handleTyping = useCallback((typing: boolean) => {
    sendTypingEvent(conversationId, profile?.id ?? 'notary', 'Notary', typing)
  }, [conversationId, profile?.id])

  async function handleSend(content: string) {
    // Optimistic bubble — show instantly before API call
    const tid = tempId()
    const optimistic: Message = {
      id: tid,
      conversation_id: conversationId,
      sender_type: 'notary',
      sender_name: conversation?.client_name ? 'You' : 'You',
      content,
      is_read: false,
      created_at: new Date().toISOString(),
      attachment_url: null,
      attachment_name: null,
    }
    setMessages(prev => [...prev, optimistic])

    try {
      const saved = await apiSend(conversationId, content)
      // Backend already broadcasts via Supabase Realtime HTTP API — no client-side emit needed.
      // Replace optimistic with real message (dedup if broadcast already added it)
      setMessages(prev => {
        const withoutTemp = prev.filter(m => m.id !== tid)
        if (withoutTemp.some(m => m.id === saved.id)) return withoutTemp
        return [...withoutTemp, saved]
      })
    } catch (e) {
      // Remove optimistic bubble on failure
      setMessages(prev => prev.filter(m => m.id !== tid))
      console.error('Failed to send message:', e)
    }
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
      {/* Header */}
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
          {/* Share chat link */}
          {conversation.client_token && (
            <button
              onClick={() => {
                const url = `${window.location.origin}/chat/${conversation.client_token}`
                navigator.clipboard.writeText(url)
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold border-none cursor-pointer transition-colors"
              style={{ background: copied ? 'var(--success-bg)' : 'var(--surface)', color: copied ? 'var(--success)' : 'var(--text-secondary)', border: `1px solid ${copied ? 'var(--success)' : 'var(--border)'}` }}
              title="Copy chat link for client"
            >
              <Icon name={copied ? 'check' : 'link'} size={13} style={{ color: 'inherit' }} />
              {copied ? 'Copied!' : 'Copy link'}
            </button>
          )}
        </div>
      )}

      {/* Messages */}
      <div ref={scrollRef} onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-5 py-4 min-h-0"
        style={{ background: 'var(--bg-page)' }}>
        {grouped.length === 0 && !clientTyping ? (
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
                Send a message to {conversation?.client_name || 'your client'} to start the conversation
              </div>
            </div>
          </div>
        ) : (
          <>
            {grouped.map(group => (
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
                    attachmentUrl={m.attachment_url}
                    attachmentName={m.attachment_name}
                  />
                ))}
              </div>
            ))}
            {/* Typing indicator bubble */}
            {clientTyping && (
              <div className="flex justify-start mb-3">
                <div className="max-w-[70%]">
                  <div className="text-[10px] font-semibold mb-1" style={{ color: 'var(--text-tertiary)' }}>
                    {conversation?.client_name || 'Client'}
                  </div>
                  <div className="px-4 py-3 rounded-2xl flex items-center gap-1"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderBottomLeftRadius: '4px' }}>
                    <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: 'var(--text-tertiary)', animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: 'var(--text-tertiary)', animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: 'var(--text-tertiary)', animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Input */}
      <div className="px-4 py-3 shrink-0" style={{ borderTop: '1px solid var(--divider)', background: 'var(--card)' }}>
        <ChatInput onSend={handleSend} loading={sendLoading} onTyping={handleTyping} />
      </div>
    </div>
  )
}
