'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { api } from '@/lib/api/client'
import { subscribeToMessages } from '@/lib/realtime'
import type { Conversation, Message } from '@/lib/types'

function useDebouncedCallback<T extends (...args: any[]) => void>(fn: T, delay: number): T {
  const timer = useRef<ReturnType<typeof setTimeout>>()
  return useCallback((...args: any[]) => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => fn(...args), delay)
  }, [fn, delay]) as unknown as T
}

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  // Track cleanup functions for per-conversation channel subscriptions
  const channelCleanups = useRef<(() => void)[]>([])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.get<Conversation[]>('/messages/conversations')
      const list: Conversation[] = Array.isArray(data) ? data : []
      setConversations(list)

      // Tear down previous channel subscriptions before creating new ones
      channelCleanups.current.forEach(fn => fn())
      channelCleanups.current = []

      // Subscribe to each conversation's messages so the list stays live:
      // unread counts, last message preview and timestamp update in real time.
      list.forEach(conv => {
        const unsub = subscribeToMessages(conv.id, (msg: Message) => {
          setConversations(prev => prev.map(c =>
            c.id === conv.id
              ? {
                  ...c,
                  last_message_preview: msg.content,
                  last_message_at: msg.created_at,
                  unread_count: msg.sender_type === 'client'
                    ? c.unread_count + 1
                    : c.unread_count,
                }
              : c
          ))
        })
        channelCleanups.current.push(unsub)
      })
    } catch {
      // endpoint may not exist yet
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
    return () => {
      channelCleanups.current.forEach(fn => fn())
    }
  }, [load])

  return { conversations, loading, refresh: load }
}

export function useConversation(id: string | undefined) {
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!id) return
    setLoading(true)
    try {
      const [conv, msgs] = await Promise.all([
        api.get<Conversation>(`/messages/conversations/${id}`),
        api.get<Message[]>(`/messages/conversations/${id}/messages`),
      ])
      setConversation(conv)
      setMessages(Array.isArray(msgs) ? msgs : [])

      // Mark as read
      api.patch(`/messages/conversations/${id}/read`).catch(() => {})
    } catch {
      setConversation(null)
      setMessages([])
    }
    setLoading(false)
  }, [id])

  useEffect(() => { load() }, [load])

  // Debounced mark-as-read to avoid spamming API on rapid messages
  const debouncedMarkRead = useDebouncedCallback(() => {
    if (id) api.patch(`/messages/conversations/${id}/read`).catch(() => {})
  }, 500)

  // Subscribe to real-time messages via Supabase Realtime
  useEffect(() => {
    if (!id) return

    const unsubscribe = subscribeToMessages(id, (msg: Message) => {
      setMessages(prev => {
        // Skip if already in list (dedup by id)
        if (prev.some(m => m.id === msg.id)) return prev
        // Replace any optimistic temp that matches this message (by content + sender)
        const tempIdx = prev.findIndex(
          m => m.id.startsWith('temp-') && m.content === msg.content && m.sender_type === msg.sender_type
        )
        if (tempIdx >= 0) {
          const next = [...prev]
          next[tempIdx] = msg
          return next
        }
        return [...prev, msg]
      })
      debouncedMarkRead()
    })

    return unsubscribe
  }, [id, debouncedMarkRead])

  return { conversation, messages, loading, refresh: load, setMessages }
}

export function useCreateConversation() {
  const [loading, setLoading] = useState(false)

  const create = useCallback(async (input: { client_name: string; client_email?: string; job_id?: string }): Promise<Conversation> => {
    setLoading(true)
    try {
      return await api.post<Conversation>('/messages/conversations', input)
    } finally {
      setLoading(false)
    }
  }, [])

  return { create, loading }
}

export function useSendMessage() {
  const [loading, setLoading] = useState(false)

  const send = useCallback(async (conversationId: string, content: string): Promise<Message> => {
    setLoading(true)
    try {
      return await api.post<Message>(`/messages/conversations/${conversationId}/messages`, { content, sender_type: 'notary' })
    } finally {
      setLoading(false)
    }
  }, [])

  return { send, loading }
}

export function useUnreadMessageCount() {
  const [count, setCount] = useState(0)

  const load = useCallback(async () => {
    try {
      const res = await api.get<{ count: number } | number>('/messages/unread-count')
      setCount(typeof res === 'number' ? res : res?.count ?? 0)
    } catch {}
  }, [])

  useEffect(() => {
    load()
    const interval = setInterval(load, 30000)
    return () => clearInterval(interval)
  }, [load])

  return { count, refresh: load }
}
