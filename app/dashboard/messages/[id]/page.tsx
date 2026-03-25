'use client'

import { useParams } from 'next/navigation'
import { Icon } from '@/components/ui/icons'
import { Button } from '@/components/ui'
import { PageHeader } from '@/components/layout'
import { ChatPanel } from '@/components/chat/ChatPanel'
import { useConversation } from '@/hooks/use-messages'

export default function ConversationPage() {
  const params = useParams<{ id: string }>()
  const id = params.id
  const { conversation, loading } = useConversation(id)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-9 h-9 border-[3px] rounded-full animate-spin-slow"
          style={{ borderColor: 'var(--border)', borderTopColor: 'var(--primary)' }} />
      </div>
    )
  }

  if (!conversation) {
    return (
      <div className="text-center py-20">
        <div className="text-[15px] font-bold mb-2" style={{ color: 'var(--text)' }}>Conversation not found</div>
        <Button variant="outline" href="/dashboard/messages">
          <Icon name="arrow_back" size={16} style={{ color: 'inherit' }} /> Back to messages
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-[720px]">
      <PageHeader title={conversation.client_name} subtitle={conversation.client_email || 'Conversation'}
        action={
          <div className="flex gap-2">
            <Button variant="outline" href="/dashboard/messages">
              <Icon name="arrow_back" size={16} style={{ color: 'inherit' }} /> Back
            </Button>
            {conversation.job_id && (
              <Button variant="outline" href={`/dashboard/jobs/${conversation.job_id}`}>
                <Icon name="work" size={16} style={{ color: 'inherit' }} /> View Job
              </Button>
            )}
          </div>
        } />

      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <ChatPanel conversationId={id} />
      </div>
    </div>
  )
}
