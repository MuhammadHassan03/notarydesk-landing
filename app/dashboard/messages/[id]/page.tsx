'use client'

import { useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Icon } from '@/components/ui/icons'
import { Button, ConfirmModal, Toast } from '@/components/ui'
import { ChatPanel } from '@/components/chat/ChatPanel'
import { useConversation } from '@/hooks/use-messages'
import { api } from '@/lib/api'
import Link from 'next/link'

export default function ConversationPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const id = params.id
  const { conversation, loading } = useConversation(id)
  const [showDelete, setShowDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  const handleDelete = useCallback(async () => {
    setDeleting(true)
    try {
      await api.delete(`/messages/conversations/${id}`)
      router.push('/dashboard/messages')
    } catch (e: any) {
      setToast({ msg: e.message || 'Failed to delete conversation.', type: 'error' })
    }
    setDeleting(false)
  }, [id, router])

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
      <div className="w-9 h-9 border-[3px] rounded-full animate-spin-slow"
        style={{ borderColor: 'var(--border)', borderTopColor: 'var(--primary)' }} />
      <span className="text-[13px]" style={{ color: 'var(--text-tertiary)' }}>Loading conversation…</span>
    </div>
  )

  if (!conversation) return (
    <div className="text-center py-20">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
        style={{ background: 'var(--surface)' }}>
        <Icon name="chat_bubble_outline" size={28} style={{ color: 'var(--text-tertiary)' }} />
      </div>
      <div className="text-[15px] font-bold mb-1" style={{ color: 'var(--text)' }}>Conversation not found</div>
      <div className="text-[13px] mb-4" style={{ color: 'var(--text-secondary)' }}>This conversation may have been deleted or the link is invalid.</div>
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
        <div className="flex gap-2">
          {conversation.job_id && (
            <Button variant="outline" size="sm" href={`/dashboard/jobs/${conversation.job_id}`}>
              <Icon name="work" size={15} style={{ color: 'inherit' }} /> View Job
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => setShowDelete(true)} title="Delete conversation">
            <Icon name="delete" size={15} style={{ color: 'var(--danger)' }} />
          </Button>
        </div>
      </div>

      {/* Full-height chat panel */}
      <div className="flex-1 rounded-2xl overflow-hidden min-h-0"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <ChatPanel conversationId={id} />
      </div>

      {/* Delete confirmation */}
      <ConfirmModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Delete conversation?"
        description="This will permanently delete this conversation and all its messages. This cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        loading={deleting}
      />

      {toast && <Toast message={toast.msg} type={toast.type} visible={!!toast} onHide={() => setToast(null)} />}
    </div>
  )
}
