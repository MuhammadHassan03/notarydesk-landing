'use client'

import { useParams } from 'next/navigation'
import { Icon } from '@/components/ui/icons'
import { Button } from '@/components/ui'
import { ChatPanel } from '@/components/chat/ChatPanel'
import { useConversation } from '@/hooks/use-messages'
import Link from 'next/link'

export default function ConversationPage() {
  const params = useParams<{ id: string }>()
  const id = params.id
  const { conversation, loading } = useConversation(id)

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-9 h-9 border-[3px] rounded-full animate-spin-slow"
        style={{ borderColor: 'var(--border)', borderTopColor: 'var(--primary)' }} />
    </div>
  )

  if (!conversation) return (
    <div className="text-center py-20">
      <div className="text-[15px] font-bold mb-2" style={{ color: 'var(--text)' }}>Conversation not found</div>
      <Button variant="outline" href="/dashboard/messages">
        <Icon name="arrow_back" size={16} style={{ color: 'inherit' }} /> Back to messages
      </Button>
    </div>
  )

  return (
    <div className="max-w-[820px] flex flex-col" style={{ height: 'calc(100vh - 140px)' }}>
      {/* Breadcrumb */}
      <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
        <Link href="/dashboard/messages"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium no-underline transition-opacity hover:opacity-70"
          style={{ color: 'var(--text-secondary)' }}>
          <Icon name="arrow_back" size={15} style={{ color: 'inherit' }} /> Back to messages
        </Link>
        {conversation.job_id && (
          <Button variant="outline" size="sm" href={`/dashboard/jobs/${conversation.job_id}`}>
            <Icon name="work" size={15} style={{ color: 'inherit' }} /> View Job
          </Button>
        )}
      </div>

      {/* Full-height chat panel */}
      <div className="flex-1 rounded-2xl overflow-hidden min-h-0"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <ChatPanel conversationId={id} />
      </div>
    </div>
  )
}
