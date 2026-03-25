'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { api } from '@/lib/api/client'
import { connectSocket, disconnectSocket } from '@/lib/socket'
import type { Conversation, Message } from '@/lib/types'
import type { Socket } from 'socket.io-client'

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.get<Conversation[]>('/messages/conversations')
      setConversations(Array.isArray(data) ? data : [])
    } catch {
      // endpoint may not exist yet
    }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

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
    } catch {
      setConversation(null)
      setMessages([])
    }
    setLoading(false)
  }, [id])

  useEffect(() => { load() }, [load])

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
      return await api.post<Message>(`/messages/conversations/${conversationId}/messages`, content ? { content } : undefined)
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

// ── Real-time Socket.IO hook for a conversation ────────────────────────

export function useRealtimeMessages(conversationId: string | undefined, onNewMessage: (msg: Message) => void) {
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    if (!conversationId) return

    const socket = connectSocket()
    socketRef.current = socket

    function handleConnect() {
      socket.emit('join_conversation', conversationId)
    }

    function handleNewMessage(msg: Message) {
      onNewMessage(msg)
    }

    function handleError(err: { error: string }) {
      console.error('[socket] message_error:', err.error)
    }

    // If already connected, join immediately
    if (socket.connected) {
      socket.emit('join_conversation', conversationId)
    }

    socket.on('connect', handleConnect)
    socket.on('new_message', handleNewMessage)
    socket.on('message_error', handleError)

    return () => {
      socket.emit('leave_conversation', conversationId)
      socket.off('connect', handleConnect)
      socket.off('new_message', handleNewMessage)
      socket.off('message_error', handleError)
    }
  }, [conversationId, onNewMessage])

  // Send via socket instead of REST
  const sendViaSocket = useCallback((content: string, opts?: { sender_type?: string; sender_name?: string }) => {
    const socket = socketRef.current
    if (!socket?.connected || !conversationId) return false
    socket.emit('send_message', { conversation_id: conversationId, content, ...opts })
    return true
  }, [conversationId])

  return { sendViaSocket }
}
