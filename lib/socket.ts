import { io, Socket } from 'socket.io-client'
import { getStoredTokens } from '@/lib/api/tokens'

// Base URL without /api/v1 — Socket.IO connects to the root
const SOCKET_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1').replace(/\/api\/v1$/, '')

let socket: Socket | null = null

export function getSocket(): Socket {
  if (!socket) {
    const { access } = getStoredTokens()
    socket = io(SOCKET_URL, {
      auth: { token: access },
      transports: ['websocket', 'polling'],
      autoConnect: false,
    })
  }
  return socket
}

export function connectSocket(): Socket {
  const s = getSocket()
  if (!s.connected) {
    // Refresh token in case it changed since creation
    const { access } = getStoredTokens()
    s.auth = { token: access }
    s.connect()
  }
  return s
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
