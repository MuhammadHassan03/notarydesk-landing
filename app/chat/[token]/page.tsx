'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { API_URL } from '@/lib/api/client'
import { supabase } from '@/lib/supabase'
import { useTheme } from '@/context/themecontext'
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

/* Material icon helper — keeps this page self-contained */
const MI = ({ name, size = 18, style }: { name: string; size?: number; style?: React.CSSProperties }) => (
  <span className="material-symbols-rounded" style={{ fontSize: size, lineHeight: 1, ...style }}>{name}</span>
)

export default function ClientChatPage() {
  const { token } = useParams<{ token: string }>()
  const { isDark, toggleTheme } = useTheme()
  const [conv, setConv] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [notaryTyping, setNotaryTyping] = useState(false)
  const [connected, setConnected] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
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
        const incoming: Message[] = data.messages ?? []
        if (incoming.length === prev.length && incoming[incoming.length - 1]?.id === prev[prev.length - 1]?.id) return prev
        return incoming
      })
    } catch { /* network error */ }
  }, [token])

  useEffect(() => { fetchMessages().finally(() => setLoading(false)) }, [fetchMessages])

  // Subscribe to real-time messages + typing
  useEffect(() => {
    if (!conv) return
    const msgChannel = supabase
      .channel(`msgs:${conv.id}`, { config: { broadcast: { self: false, ack: true } } })
      .on('broadcast', { event: 'new_message' }, (payload: any) => {
        const msg = payload.payload as Message
        setMessages(prev => {
          if (prev.some(m => m.id === msg.id)) return prev
          const tempIdx = prev.findIndex(m => m.id.startsWith('temp-') && m.content === msg.content)
          if (tempIdx >= 0) { const next = [...prev]; next[tempIdx] = msg; return next }
          return [...prev, msg]
        })
      })
      .subscribe((status: string) => { setConnected(status === 'SUBSCRIBED') })

    const typingChannel = supabase
      .channel(`typing:${conv.id}`)
      .on('broadcast', { event: 'typing' }, (payload: any) => {
        const data = payload.payload as { user_id: string; name: string; typing: boolean }
        if (data.user_id !== 'client') {
          setNotaryTyping(data.typing)
          if (data.typing) {
            clearTimeout(notaryTypingTimer.current)
            notaryTypingTimer.current = setTimeout(() => setNotaryTyping(false), 4000)
          } else { clearTimeout(notaryTypingTimer.current) }
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

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  // ── Typing emit helper ────────────────────────────────────────────────
  const emitTyping = useCallback((typing: boolean) => {
    typingChannelRef.current?.send({ type: 'broadcast', event: 'typing', payload: { user_id: 'client', name: conv?.client_name ?? 'Client', typing } })
  }, [conv?.client_name])

  // ── Send ──────────────────────────────────────────────────────────────
  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text || sending || !conv) return
    setSending(true)
    setError('')
    // Stop typing
    clearTimeout(clientTypingTimer.current)
    if (isClientTyping.current) { isClientTyping.current = false; emitTyping(false) }
    // Optimistic
    const tempId = `temp-${Date.now()}`
    setMessages(prev => [...prev, { id: tempId, sender_type: 'client', sender_name: conv.client_name, content: text, created_at: new Date().toISOString(), is_read: false }])
    setInput('')
    if (textareaRef.current) { textareaRef.current.style.height = 'auto' }
    try {
      const res = await fetch(`${API_URL}/messages/client/${token}/messages`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text, sender_type: 'client', sender_name: conv.client_name }),
      })
      if (!res.ok) throw new Error('Failed to send')
      const json = await res.json()
      const saved: Message = json.data ?? json
      if (msgChannelRef.current) {
        const ack = await msgChannelRef.current.send({ type: 'broadcast', event: 'new_message', payload: saved })
        if (ack !== 'ok') console.warn('[Chat] broadcast result:', ack)
      }
      setMessages(prev => prev.map(m => m.id === tempId ? saved : m))
    } catch {
      setError('Failed to send message. Please try again.')
      setMessages(prev => prev.filter(m => m.id !== tempId))
      setInput(text)
    } finally { setSending(false) }
  }

  // ── Loading state ─────────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-[100dvh] flex items-center justify-center" style={{ background: 'var(--bg-page)' }}>
      <div className="w-9 h-9 rounded-full border-[3px] animate-spin"
        style={{ borderColor: 'var(--border)', borderTopColor: 'var(--primary)' }} />
    </div>
  )

  if (notFound) return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center gap-4 px-6" style={{ background: 'var(--bg-page)' }}>
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'var(--primary)' }}>
        <MI name="lock" size={28} style={{ color: 'white' }} />
      </div>
      <h1 className="text-[22px] font-extrabold" style={{ color: 'var(--text)' }}>Conversation not found</h1>
      <p className="text-sm text-center" style={{ color: 'var(--text-secondary)' }}>This chat link may have expired or doesn&apos;t exist.</p>
    </div>
  )

  // ── Main UI ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-[100dvh] flex flex-col" style={{ background: 'var(--bg-page)', fontFamily: "'Manrope', system-ui, sans-serif" }}>

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-10 flex items-center gap-3.5 px-5 py-4"
        style={{ background: 'var(--primary)', boxShadow: '0 2px 12px rgba(0,0,0,0.15)' }}>
        {/* Logo */}
        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-[16px] font-extrabold shrink-0"
          style={{ background: 'rgba(201,168,76,0.2)', border: '1px solid rgba(201,168,76,0.35)', color: 'var(--accent)' }}>
          ND
        </div>
        {/* Title */}
        <div className="flex-1 min-w-0">
          <div className="text-[15px] font-bold text-white leading-tight">Your Notary</div>
          {conv && <div className="text-[12px] text-white/50 mt-0.5 truncate">Chat with your notary · {conv.client_name}</div>}
        </div>
        {/* Status + theme toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <div className="w-2 h-2 rounded-full transition-colors" style={{ background: connected ? '#4ADE80' : 'rgba(255,255,255,0.35)' }} />
            <span className="text-[11px] font-medium text-white/60">{connected ? 'Live' : 'Connecting'}</span>
          </div>
          <button onClick={toggleTheme} className="w-9 h-9 rounded-xl flex items-center justify-center border-none cursor-pointer transition-colors"
            style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
            <MI name={isDark ? 'light_mode' : 'dark_mode'} size={18} />
          </button>
        </div>
      </div>

      {/* ── Messages ────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-3">

        {/* Welcome banner */}
        <div className="rounded-2xl p-4 text-center mb-2" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: 'var(--primary-light)' }}>
            <MI name="chat" size={24} style={{ color: 'var(--primary)' }} />
          </div>
          <p className="text-[14px] font-bold mb-1" style={{ color: 'var(--text)' }}>Your signing request was received!</p>
          <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Use this chat to communicate directly with your notary. They&apos;ll confirm details here.
          </p>
        </div>

        {/* Message list */}
        {messages.map(msg => {
          const isClient = msg.sender_type === 'client'
          return (
            <div key={msg.id} className={`flex flex-col ${isClient ? 'items-end' : 'items-start'}`}>
              <div className="max-w-[78%] px-4 py-2.5 text-[14px] leading-relaxed"
                style={{
                  background: isClient ? 'var(--primary)' : 'var(--card)',
                  color: isClient ? '#fff' : 'var(--text)',
                  borderRadius: isClient ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  border: isClient ? 'none' : '1px solid var(--border)',
                  boxShadow: 'var(--shadow-sm)',
                }}>
                {msg.content}
              </div>
              <div className={`flex items-center gap-1 mt-1 text-[11px] ${isClient ? 'pr-1' : 'pl-1'}`} style={{ color: 'var(--text-tertiary)' }}>
                {isClient ? 'You' : msg.sender_name} · {timeLabel(msg.created_at)}
              </div>
            </div>
          )
        })}

        {messages.length === 0 && !notaryTyping && (
          <div className="text-center py-6 text-[13px]" style={{ color: 'var(--text-tertiary)' }}>
            No messages yet. Say hello to your notary!
          </div>
        )}

        {/* Typing indicator */}
        {notaryTyping && (
          <div className="flex flex-col items-start">
            <div className="text-[11px] mb-1 pl-1 font-medium" style={{ color: 'var(--text-tertiary)' }}>Your Notary</div>
            <div className="px-4 py-3 flex items-center gap-1.5"
              style={{
                background: 'var(--card)', border: '1px solid var(--border)',
                borderRadius: '18px 18px 18px 4px', boxShadow: 'var(--shadow-sm)',
              }}>
              {[0, 150, 300].map(delay => (
                <span key={delay} className="w-[7px] h-[7px] rounded-full inline-block animate-bounce"
                  style={{ background: 'var(--text-tertiary)', animationDelay: `${delay}ms` }} />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Error ───────────────────────────────────────────────────── */}
      {error && (
        <div className="text-[13px] text-center px-4 py-2.5" style={{ background: 'var(--danger-bg)', color: 'var(--danger)' }}>
          {error}
        </div>
      )}

      {/* ── Input ───────────────────────────────────────────────────── */}
      <form onSubmit={handleSend} className="sticky bottom-0 flex items-end gap-2.5 px-4 py-3"
        style={{ background: 'var(--card)', borderTop: '1px solid var(--border)' }}>
        <div className="flex-1 flex items-end gap-2 px-3.5 py-2.5 rounded-2xl"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => {
              setInput(e.target.value)
              setError('')
              e.target.style.height = 'auto'
              e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`
              if (e.target.value.length > 0) {
                if (!isClientTyping.current) { isClientTyping.current = true; emitTyping(true) }
                clearTimeout(clientTypingTimer.current)
                clientTypingTimer.current = setTimeout(() => { isClientTyping.current = false; emitTyping(false) }, 2000)
              } else {
                clearTimeout(clientTypingTimer.current)
                if (isClientTyping.current) { isClientTyping.current = false; emitTyping(false) }
              }
            }}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e as any) } }}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 resize-none border-none outline-none text-[14px] leading-relaxed bg-transparent min-h-[24px] max-h-[120px]"
            style={{ color: 'var(--text)', overflowY: 'auto', fontFamily: 'inherit' }}
          />
        </div>
        <button type="submit" disabled={!input.trim() || sending}
          className="w-11 h-11 rounded-xl flex items-center justify-center border-none cursor-pointer transition-all shrink-0 disabled:opacity-30"
          style={{ background: 'var(--primary)', color: '#fff' }}>
          {sending
            ? <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} />
            : <MI name="send" size={20} style={{ color: 'var(--accent)' }} />
          }
        </button>
      </form>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <div className="text-center py-2.5 px-4 text-[11px]" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', color: 'var(--text-tertiary)' }}>
        Secured by{' '}
        <a href="/" className="font-bold no-underline" style={{ color: 'var(--primary)' }}>NotaryDesk</a>
      </div>
    </div>
  )
}
