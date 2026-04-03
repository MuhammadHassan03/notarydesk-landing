/**
 * realtime.ts — Supabase Realtime helpers for web dashboard
 * ==========================================================
 * Replaces Socket.IO (which doesn't work on Vercel serverless).
 * Uses Supabase Realtime channels for:
 *   - Message delivery (postgres_changes on messages table)
 *   - Typing indicators (broadcast, no DB writes)
 *   - Presence tracking (who's online)
 */

import { supabase } from '@/lib/supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'

// ── Multi-callback channel registry ─────────────────────────────────────────
// Each channel key maps to the channel + a Set of active callbacks.
// Multiple React components (or re-mounts) can subscribe to the same channel
// without creating duplicate Supabase connections. Each gets its own callback.

interface ChannelEntry {
  channel: RealtimeChannel
  callbacks: Set<(msg: any) => void>
}

const channels = new Map<string, ChannelEntry>()

/** Subscribe to new messages in a conversation. Returns unsubscribe function. */
export function subscribeToMessages(
  conversationId: string,
  onMessage: (msg: any) => void,
): () => void {
  const key = `msgs:${conversationId}`
  const existing = channels.get(key)

  if (existing) {
    // Re-use the same Supabase channel but add this callback to the set.
    // This handles React remounts / strict-mode double-invocations safely.
    existing.callbacks.add(onMessage)
    return () => {
      existing.callbacks.delete(onMessage)
      if (existing.callbacks.size === 0) unsubscribe(key)
    }
  }

  const callbacks = new Set<(msg: any) => void>([onMessage])

  const channel = supabase
    .channel(key, { config: { broadcast: { self: false, ack: true } } })
    // Backend broadcasts via Supabase Realtime HTTP API (service role key) after every
    // INSERT — bypasses RLS which would block the unauthenticated anon client.
    .on('broadcast', { event: 'new_message' }, (payload: any) => {
      callbacks.forEach(cb => cb(payload.payload))
    })
    .subscribe((status: string) => {
      if (status === 'CHANNEL_ERROR') {
        console.warn(`[Realtime] Channel error for ${key}`)
      }
    })

  channels.set(key, { channel, callbacks })

  return () => {
    callbacks.delete(onMessage)
    if (callbacks.size === 0) unsubscribe(key)
  }
}

/** Broadcast a new message to all subscribers of this conversation.
 *  Call this after the REST save returns the persisted message object. */
export async function broadcastMessage(conversationId: string, message: any) {
  const key = `msgs:${conversationId}`
  const entry = channels.get(key)
  if (entry) {
    const result = await entry.channel.send({ type: 'broadcast', event: 'new_message', payload: message })
    if (result !== 'ok') {
      console.warn(`[Realtime] broadcast on ${key} returned: ${result}`)
    }
    return
  }
  // No active subscriber yet — open an ephemeral channel just to broadcast
  const channel = supabase.channel(key, { config: { broadcast: { self: false, ack: true } } })
  channel.subscribe((status: string) => {
    if (status === 'SUBSCRIBED') {
      channel.send({ type: 'broadcast', event: 'new_message', payload: message })
    }
  })
  setTimeout(() => {
    if (!channels.has(key)) supabase.removeChannel(channel)
  }, 2000)
}

/** Subscribe to typing events for a conversation (broadcast, no DB). */
export function subscribeToTyping(
  conversationId: string,
  onTyping: (data: { user_id: string; name: string; typing: boolean }) => void,
): () => void {
  const key = `typing:${conversationId}`
  const existing = channels.get(key)

  if (existing) {
    existing.callbacks.add(onTyping as any)
    return () => {
      existing.callbacks.delete(onTyping as any)
      if (existing.callbacks.size === 0) unsubscribe(key)
    }
  }

  const callbacks = new Set<(msg: any) => void>([onTyping as any])

  const channel = supabase
    .channel(key)
    .on('broadcast', { event: 'typing' }, (payload: any) => {
      callbacks.forEach(cb => cb(payload.payload as any))
    })
    .subscribe()

  channels.set(key, { channel, callbacks })

  return () => {
    callbacks.delete(onTyping as any)
    if (callbacks.size === 0) unsubscribe(key)
  }
}

/** Broadcast a typing event.
 *  If the typing channel isn't open yet (no active subscribeToTyping caller),
 *  we create a short-lived channel just to broadcast, then clean it up. */
export function sendTypingEvent(conversationId: string, userId: string, name: string, typing: boolean) {
  const key = `typing:${conversationId}`
  const entry = channels.get(key)
  if (entry) {
    entry.channel.send({ type: 'broadcast', event: 'typing', payload: { user_id: userId, name, typing } })
    return
  }
  // No subscriber yet — open an ephemeral channel for this single broadcast
  const channel = supabase.channel(key)
  channel.subscribe((status: string) => {
    if (status === 'SUBSCRIBED') {
      channel.send({ type: 'broadcast', event: 'typing', payload: { user_id: userId, name, typing } })
    }
  })
  // Clean up after 2 seconds (enough time for the broadcast to go out)
  setTimeout(() => {
    if (!channels.has(key)) supabase.removeChannel(channel)
  }, 2000)
}

/** Clean up a channel subscription. */
function unsubscribe(key: string) {
  const entry = channels.get(key)
  if (entry) {
    supabase.removeChannel(entry.channel)
    channels.delete(key)
  }
}

/** Clean up all channels (call on logout or page unload). */
export function disconnectAll() {
  Array.from(channels.keys()).forEach(key => {
    unsubscribe(key)
  })
}
