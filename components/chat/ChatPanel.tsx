'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useConversation, useRealtimeMessages } from '@/hooks/use-messages'
import { ChatBubble } from './ChatBubble'
import { ChatInput } from './ChatInput'
import { Icon } from '@/components/ui/icons'
import type { Message } from '@/lib/types'

interface Props {
  conversationId: string
}

export function ChatPanel({ conversationId }: Props) {
  const { conversation, messages, loading, setMessages } = useConversation(conversationId)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Real-time: append incoming messages (deduplicate by id)
  const handleNewMessage = useCallback((msg: Message) => {
    setMessages(prev => {
      if (prev.some(m => m.id === msg.id)) return prev
      return [...prev, msg]
    })
  }, [setMessages])

  const { sendViaSocket } = useRealtimeMessages(conversationId, handleNewMessage)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages.length])

  async function handleSend(content: string) {
    // Try socket first; falls back to REST if not connected
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
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="w-6 h-6 border-2 rounded-full animate-spin-slow" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--primary)' }} />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      {conversation && (
        <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid var(--divider)' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold"
            style={{ background: 'var(--primary)', color: '#fff' }}>
            {conversation.client_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>{conversation.client_name}</div>
            {conversation.client_email && (
              <div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{conversation.client_email}</div>
            )}
          </div>
        </div>
      )}

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 min-h-[200px] max-h-[400px]">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="chat_bubble_outline" size={32} style={{ color: 'var(--text-tertiary)', opacity: 0.3 }} />
            <div className="text-[12px] mt-2" style={{ color: 'var(--text-tertiary)' }}>
              No messages yet. Start the conversation!
            </div>
          </div>
        ) : (
          messages.map(m => (
            <ChatBubble
              key={m.id}
              content={m.content}
              senderType={m.sender_type}
              senderName={m.sender_name}
              timestamp={m.created_at}
              isRead={m.is_read}
            />
          ))
        )}
      </div>

      {/* Input */}
      <div className="px-4 pb-4">
        <ChatInput onSend={handleSend} loading={false} />
      </div>
    </div>
  )
}
