'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useConversations, useCreateConversation } from '@/hooks/use-messages'
import { Icon } from '@/components/ui/icons'
import { PageHeader } from '@/components/layout'
import { Button, Toast, Modal } from '@/components/ui'
import { FormField } from '@/components/forms/FormField'
import { IconInput } from '@/components/forms/IconInput'
import { FilterOption, FilterPills } from '@/components/ui/FilterPills'

type Filter = 'all' | 'unread'

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return ''
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diff = Math.floor((now - then) / 1000)
  if (diff < 60) return 'now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function MessagesPage() {
  const router = useRouter()
  const { conversations, loading, refresh } = useConversations()
  const { create, loading: creating } = useCreateConversation()
  const [filter, setFilter] = useState<Filter>('all')
  const [showNew, setShowNew] = useState(false)
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  const filtered = useMemo(() => {
    if (filter === 'unread') return conversations.filter(c => c.unread_count > 0)
    return conversations
  }, [conversations, filter])

  const totalUnread = useMemo(() => conversations.reduce((s, c) => s + c.unread_count, 0), [conversations])

  const filterOpts: FilterOption<Filter>[] = [
    { key: 'all', label: 'All', count: conversations.length },
    { key: 'unread', label: 'Unread', count: totalUnread },
  ]

  async function handleCreate() {
    if (!newName.trim()) {
      setToast({ msg: 'Client name required.', type: 'error' }); return
    }
    try {
      const conv = await create({ client_name: newName.trim(), client_email: newEmail.trim() || undefined })
      setShowNew(false)
      setNewName('')
      setNewEmail('')
      refresh()
      router.push(`/dashboard/messages/${conv.id}`)
    } catch (e: any) {
      setToast({ msg: e.message || 'Failed to create.', type: 'error' })
    }
  }

  return (
    <div>
      <PageHeader title="Messages" subtitle={`${conversations.length} conversation${conversations.length !== 1 ? 's' : ''}${totalUnread > 0 ? ` · ${totalUnread} unread` : ''}`}
        action={
          <Button variant="gold" onClick={() => setShowNew(true)}>
            <Icon name="add" size={16} style={{ color: 'inherit' }} /> New Conversation
          </Button>
        } />

      <div className="mb-5">
        <FilterPills options={filterOpts} value={filter} onChange={setFilter} />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-9 h-9 border-[3px] rounded-full animate-spin-slow" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--primary)' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl p-10 text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <Icon name="chat" size={40} style={{ color: 'var(--text-tertiary)', opacity: 0.3 }} />
          <div className="text-[15px] font-bold mb-1 mt-3" style={{ color: 'var(--text)' }}>
            {filter === 'all' ? 'No conversations yet' : 'No unread messages'}
          </div>
          <div className="text-[13px] mb-4" style={{ color: 'var(--text-tertiary)' }}>
            {filter === 'all' ? 'Start a conversation with a client to keep all communication in one place.' : 'You\'re all caught up!'}
          </div>
          {filter === 'all' && (
            <Button variant="gold" onClick={() => setShowNew(true)}>
              <Icon name="add" size={16} style={{ color: 'inherit' }} /> Start Conversation
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          {filtered.map((conv, i) => (
            <button key={conv.id} onClick={() => router.push(`/dashboard/messages/${conv.id}`)}
              className="w-full flex items-center gap-4 px-5 py-4 border-none bg-transparent cursor-pointer text-left transition-colors duration-150 hover:bg-[var(--surface)]"
              style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--divider)' : 'none' }}>
              {/* Avatar */}
              <div className="w-11 h-11 rounded-full flex items-center justify-center text-[14px] font-bold shrink-0"
                style={{ background: conv.unread_count > 0 ? 'var(--primary)' : 'var(--surface)', color: conv.unread_count > 0 ? '#fff' : 'var(--text-secondary)', border: conv.unread_count > 0 ? 'none' : '1px solid var(--border)' }}>
                {conv.client_name.charAt(0).toUpperCase()}
              </div>
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-semibold truncate" style={{ color: 'var(--text)' }}>{conv.client_name}</span>
                  <span className="text-[11px] shrink-0 ml-2" style={{ color: 'var(--text-tertiary)' }}>{timeAgo(conv.last_message_at)}</span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-[12px] truncate" style={{ color: conv.unread_count > 0 ? 'var(--text)' : 'var(--text-tertiary)', fontWeight: conv.unread_count > 0 ? 600 : 400 }}>
                    {conv.last_message_preview || 'No messages yet'}
                  </span>
                  {conv.unread_count > 0 && (
                    <span className="min-w-[20px] h-5 rounded-full flex items-center justify-center text-[10px] font-bold px-1.5 shrink-0 ml-2"
                      style={{ background: 'var(--primary)', color: '#fff' }}>
                      {conv.unread_count}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* New conversation modal */}
      <Modal open={showNew} onClose={() => setShowNew(false)} title="New conversation" description="Start a message thread with a client." size="sm">
        <div className="flex flex-col gap-1">
          <FormField label="Client name" required>
            <IconInput placeholder="Client or signer name" value={newName} onChange={e => setNewName(e.target.value)} />
          </FormField>
          <FormField label="Email (optional)">
            <IconInput type="email" placeholder="client@example.com" value={newEmail} onChange={e => setNewEmail(e.target.value)} />
          </FormField>
          <div className="flex gap-3 mt-3">
            <Button variant="gold" fullWidth onClick={handleCreate} loading={creating}>
              <Icon name="chat" size={16} style={{ color: 'inherit' }} /> Start conversation
            </Button>
          </div>
        </div>
      </Modal>

      {toast && <Toast message={toast.msg} type={toast.type} visible={!!toast} onHide={() => setToast(null)} />}
    </div>
  )
}
