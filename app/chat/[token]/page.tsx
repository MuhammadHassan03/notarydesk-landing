'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { API_URL } from '@/lib/api/client'
import { supabase } from '@/lib/supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'

interface Message {
  id: string
  sender_type: 'notary' | 'client'
  sender_name: string
  content: string
  created_at: string
  is_read: boolean
}

interface Conversation {
  id: string
  client_name: string
  client_email: string
}

function timeLabel(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const sameDay = d.toDateString() === now.toDateString()
  if (sameDay) return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
}

const NAVY = '#1B3A5C'
const GOLD = '#C9A84C'
const GRAY = '#64748B'

export default function ClientChatPage() {
  const { token } = useParams<{ token: string }>()
  const [conv, setConv]       = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [input, setInput]     = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError]     = useState('')
  const [notaryTyping, setNotaryTyping] = useState(false)
  const [connected, setConnected] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const typingChannelRef = useRef<RealtimeChannel | null>(null)
  const msgChannelRef = useRef<RealtimeChannel | null>(null)
  const notaryTypingTimer = useRef<ReturnType<typeof setTimeout>>()
  const clientTypingTimer = useRef<ReturnType<typeof setTimeout>>()
  const isClientTyping = useRef(false)

  const fetchMessages = useCallback(async () => {
    if (!token) return
    try {
      const res = await fetch(`${API_URL}/messages/client/${token}`)
      if (res.status === 404 || res.status === 410) { setNotFound(true); return }
      if (!res.ok) return
      const json = await res.json()
      const data = json.data ?? json
      setConv(data.conversation)
      setMessages(prev => {
        // Merge to avoid flicker — only update if different
        const incoming: Message[] = data.messages ?? []
        if (incoming.length === prev.length && incoming[incoming.length - 1]?.id === prev[prev.length - 1]?.id) {
          return prev
        }
        return incoming
      })
    } catch { /* network error — keep showing last known state */ }
  }, [token])

  // Initial load
  useEffect(() => {
    fetchMessages().finally(() => setLoading(false))
  }, [fetchMessages])

  // Subscribe to real-time messages + typing events via Supabase Realtime
  useEffect(() => {
    if (!conv) return

    // Use broadcast (same channel key as the notary side: "msgs:<id>")
    // postgres_changes would require a Supabase JWT, but this page is unauthenticated.
    const msgChannel = supabase
      .channel(`msgs:${conv.id}`)
      .on('broadcast', { event: 'new_message' }, (payload: any) => {
        const msg = payload.payload as Message
        setMessages(prev => {
          if (prev.some(m => m.id === msg.id)) return prev
          const tempIdx = prev.findIndex(m => m.id.startsWith('temp-') && m.content === msg.content)
          if (tempIdx >= 0) {
            const next = [...prev]
            next[tempIdx] = msg
            return next
          }
          return [...prev, msg]
        })
      })
      .subscribe((status: string) => {
        setConnected(status === 'SUBSCRIBED')
      })

    // Typing channel — subscribe to notary typing events + send client typing
    const typingChannel = supabase
      .channel(`typing:${conv.id}`)
      .on('broadcast', { event: 'typing' }, (payload: any) => {
        const data = payload.payload as { user_id: string; name: string; typing: boolean }
        if (data.user_id !== 'client') {
          setNotaryTyping(data.typing)
          if (data.typing) {
            clearTimeout(notaryTypingTimer.current)
            notaryTypingTimer.current = setTimeout(() => setNotaryTyping(false), 4000)
          } else {
            clearTimeout(notaryTypingTimer.current)
          }
        }
      })
      .subscribe()

    typingChannelRef.current = typingChannel
    msgChannelRef.current = msgChannel

    return () => {
      supabase.removeChannel(msgChannel)
      supabase.removeChannel(typingChannel)
      typingChannelRef.current = null
      msgChannelRef.current = null
      clearTimeout(notaryTypingTimer.current)
      clearTimeout(clientTypingTimer.current)
    }
  }, [conv?.id])

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text || sending || !conv) return
    setSending(true)
    setError('')
    // Optimistic UI
    const tempId = `temp-${Date.now()}`
    const optimistic: Message = {
      id: tempId,
      sender_type: 'client',
      sender_name: conv.client_name,
      content: text,
      created_at: new Date().toISOString(),
      is_read: false,
    }
    setMessages(prev => [...prev, optimistic])
    setInput('')
    try {
      const res = await fetch(`${API_URL}/messages/client/${token}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text, sender_type: 'client', sender_name: conv.client_name }),
      })
      if (!res.ok) throw new Error('Failed to send')
      const json = await res.json()
      const saved: Message = json.data ?? json
      // Backend already broadcasts via Supabase Realtime HTTP API — no client-side emit needed.
      // Replace optimistic message with real one
      setMessages(prev => prev.map(m => m.id === tempId ? saved : m))
    } catch {
      setError('Failed to send message. Please try again.')
      setMessages(prev => prev.filter(m => m.id !== tempId))
      setInput(text)
    } finally {
      setSending(false)
    }
  }

  // ── Loading ────────────────────────────────────────────────────────────────

  if (loading) return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', border: `3px solid #e2e8f0`, borderTopColor: NAVY, animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } } @keyframes typingBounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }`}</style>
    </div>
  )

  if (notFound) return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '0 24px', background: '#f1f5f9' }}>
      <div style={{ width: 64, height: 64, borderRadius: 20, background: NAVY, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🔒</div>
      <h1 style={{ color: NAVY, fontSize: 22, fontWeight: 800, margin: 0 }}>Conversation not found</h1>
      <p style={{ color: GRAY, fontSize: 14, textAlign: 'center', margin: 0 }}>This chat link may have expired or doesn't exist.</p>
    </div>
  )

  const notaryDisplayName = conv ? 'Your Notary' : 'Notary'

  // ── Main chat UI ──────────────────────────────────────────────────────────

  return (
    <div style={{
      minHeight: '100dvh', display: 'flex', flexDirection: 'column',
      background: '#f1f5f9', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>
      {/* Header */}
      <div style={{
        background: NAVY, padding: '16px 20px',
        display: 'flex', alignItems: 'center', gap: 14,
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 14,
          background: `rgba(201,168,76,0.2)`, border: `1px solid rgba(201,168,76,0.35)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, color: GOLD, fontWeight: 800, flexShrink: 0,
        }}>
          ND
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 15, lineHeight: 1.3 }}>
            {notaryDisplayName}
          </div>
          {conv && (
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 1 }}>
              Chat with your notary · {conv.client_name}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: connected ? '#4ADE80' : 'rgba(255,255,255,0.35)',
            transition: 'background 0.3s',
          }} />
          <span style={{ color: 'rgba(255,255,255,0.60)', fontSize: 12 }}>
            {connected ? 'Live' : 'Connecting…'}
          </span>
        </div>
      </div>

      {/* Messages area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Welcome banner */}
        <div style={{
          background: '#fff', borderRadius: 14, padding: '14px 16px',
          border: '1px solid #e2e8f0', textAlign: 'center', marginBottom: 8,
        }}>
          <div style={{ fontSize: 22, marginBottom: 6 }}>👋</div>
          <p style={{ color: NAVY, fontWeight: 700, fontSize: 14, margin: '0 0 4px' }}>
            Your signing request was received!
          </p>
          <p style={{ color: GRAY, fontSize: 13, margin: 0, lineHeight: 1.5 }}>
            Use this chat to communicate directly with your notary. They'll confirm details here.
          </p>
        </div>

        {messages.map(msg => {
          const isClient = msg.sender_type === 'client'
          return (
            <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isClient ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '78%',
                background: isClient ? NAVY : '#fff',
                color: isClient ? '#fff' : '#0F172A',
                borderRadius: isClient ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                padding: '10px 14px',
                fontSize: 14,
                lineHeight: 1.5,
                border: isClient ? 'none' : '1px solid #e2e8f0',
                boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
              }}>
                {msg.content}
              </div>
              <div style={{ color: GRAY, fontSize: 11, marginTop: 3, paddingLeft: isClient ? 0 : 4, paddingRight: isClient ? 4 : 0 }}>
                {isClient ? 'You' : msg.sender_name} · {timeLabel(msg.created_at)}
              </div>
            </div>
          )
        })}

        {messages.length === 0 && !notaryTyping && (
          <div style={{ textAlign: 'center', color: GRAY, fontSize: 13, padding: '20px 0' }}>
            No messages yet. Say hello to your notary!
          </div>
        )}

        {/* Notary typing indicator */}
        {notaryTyping && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ color: GRAY, fontSize: 11, marginBottom: 3, paddingLeft: 4 }}>
              Your Notary
            </div>
            <div style={{
              background: '#fff', border: '1px solid #e2e8f0', borderRadius: '18px 18px 18px 4px',
              padding: '10px 16px', display: 'flex', gap: 4, alignItems: 'center',
              boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
            }}>
              {[0, 150, 300].map(delay => (
                <span key={delay} style={{
                  width: 7, height: 7, borderRadius: '50%', background: GRAY,
                  display: 'inline-block',
                  animation: 'typingBounce 1s infinite',
                  animationDelay: `${delay}ms`,
                }} />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Error banner */}
      {error && (
        <div style={{ background: '#FEF2F2', color: '#DC2626', fontSize: 13, padding: '10px 16px', textAlign: 'center' }}>
          {error}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSend} style={{
        background: '#fff', borderTop: '1px solid #e2e8f0',
        padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'flex-end',
        position: 'sticky', bottom: 0,
      }}>
        <textarea
          value={input}
          onChange={e => {
            setInput(e.target.value)
            setError('')
            // Auto-resize
            e.target.style.height = 'auto'
            e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`
            // Emit typing events
            if (e.target.value.length > 0) {
              if (!isClientTyping.current) {
                isClientTyping.current = true
                typingChannelRef.current?.send({ type: 'broadcast', event: 'typing', payload: { user_id: 'client', name: conv?.client_name ?? 'Client', typing: true } })
              }
              clearTimeout(clientTypingTimer.current)
              clientTypingTimer.current = setTimeout(() => {
                isClientTyping.current = false
                typingChannelRef.current?.send({ type: 'broadcast', event: 'typing', payload: { user_id: 'client', name: conv?.client_name ?? 'Client', typing: false } })
              }, 2000)
            } else {
              clearTimeout(clientTypingTimer.current)
              if (isClientTyping.current) {
                isClientTyping.current = false
                typingChannelRef.current?.send({ type: 'broadcast', event: 'typing', payload: { user_id: 'client', name: conv?.client_name ?? 'Client', typing: false } })
              }
            }
          }}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e as any) } }}
          placeholder="Type a message…"
          rows={1}
          style={{
            flex: 1, resize: 'none', border: '1.5px solid #e2e8f0', borderRadius: 12,
            padding: '10px 14px', fontSize: 14, outline: 'none', lineHeight: 1.5,
            background: '#f8fafc', color: '#0F172A', fontFamily: 'inherit',
            height: 'auto', maxHeight: 120, overflowY: 'auto',
          }}
        />
        <button
          type="submit"
          disabled={!input.trim() || sending}
          style={{
            width: 44, height: 44, borderRadius: 12, border: 'none', cursor: 'pointer',
            background: (!input.trim() || sending) ? '#e2e8f0' : NAVY,
            color: (!input.trim() || sending) ? '#94a3b8' : GOLD,
            fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, transition: 'all 0.15s',
          }}
        >
          {sending ? '…' : '↑'}
        </button>
      </form>

      {/* Footer */}
      <div style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', padding: '10px 16px', textAlign: 'center' }}>
        <span style={{ color: '#94a3b8', fontSize: 11 }}>
          Secured by{' '}
          <a href="/" style={{ color: NAVY, fontWeight: 700, textDecoration: 'none' }}>NotaryDesk</a>
        </span>
      </div>
      <style>{`@keyframes typingBounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }`}</style>
    </div>
  )
}
