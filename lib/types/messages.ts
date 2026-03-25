export interface Conversation {
  id: string
  user_id: string
  client_name: string
  client_email: string | null
  job_id: string | null
  last_message_at: string | null
  last_message_preview: string | null
  unread_count: number
  created_at: string
}

export interface Message {
  id: string
  conversation_id: string
  sender_type: 'notary' | 'client'
  sender_name: string
  content: string
  attachment_url: string | null
  attachment_name: string | null
  is_read: boolean
  created_at: string
}
