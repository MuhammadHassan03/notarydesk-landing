export const NOTIFICATION_TYPE_CONFIG: Record<string, { icon: string; color: string; label: string }> = {
  job_assigned:         { icon: 'work',           color: '#2563EB', label: 'New Job' },
  job_completed:        { icon: 'check_circle',   color: '#16A34A', label: 'Completed' },
  payment_received:     { icon: 'payments',        color: '#16A34A', label: 'Payment' },
  invoice_overdue:      { icon: 'error',           color: '#DC2626', label: 'Overdue' },
  invoice_paid:         { icon: 'paid',            color: '#16A34A', label: 'Paid' },
  appointment_reminder: { icon: 'calendar_month',  color: '#D97706', label: 'Reminder' },
  message_received:     { icon: 'chat',            color: '#7C3AED', label: 'Message' },
  client_added:         { icon: 'person_add',      color: '#1B3A5C', label: 'Client' },
}

export function getNotificationConfig(type: string) {
  return NOTIFICATION_TYPE_CONFIG[type] || { icon: 'notifications', color: '#64748B', label: 'Update' }
}
