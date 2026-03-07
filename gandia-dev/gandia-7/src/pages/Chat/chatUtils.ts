import type { ChatMessage as DBMessage } from '../../lib/chatService'
import type { UIMessage } from './chatTypes'

// ─── Formatters ───────────────────────────────────────────────────────────────

export const fmt = (b: number) =>
  b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(1)} MB`

export function relativeTime(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000)
  if (diff < 10)   return 'ahora'
  if (diff < 60)   return `hace ${diff}s`
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`
  return new Date(ts).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
}

// ─── File helpers ─────────────────────────────────────────────────────────────

export function getFileKind(type: string, name: string): string {
  if (type.startsWith('image/'))                                                              return 'image'
  if (type.startsWith('audio/'))                                                              return 'audio'
  if (type === 'application/pdf' || name.endsWith('.pdf'))                                   return 'pdf'
  if (type.includes('spreadsheet') || name.endsWith('.xlsx') || name.endsWith('.xls'))      return 'xlsx'
  if (type.includes('wordprocessingml') || name.endsWith('.docx') || name.endsWith('.doc')) return 'docx'
  if (type === 'text/plain' || name.endsWith('.txt'))                                         return 'txt'
  return 'generic'
}

export const FILE_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  pdf:     { bg: 'bg-red-50 dark:bg-red-950/30',          color: 'text-red-500',     label: 'PDF'  },
  xlsx:    { bg: 'bg-emerald-50 dark:bg-emerald-950/30',  color: 'text-emerald-500', label: 'XLS'  },
  docx:    { bg: 'bg-blue-50 dark:bg-blue-950/30',        color: 'text-blue-500',    label: 'DOC'  },
  image:   { bg: 'bg-[#2FAF8F]/08 dark:bg-[#2FAF8F]/10', color: 'text-[#2FAF8F]',   label: 'IMG'  },
  audio:   { bg: 'bg-purple-50 dark:bg-purple-950/30',    color: 'text-purple-500',  label: 'AUD'  },
  txt:     { bg: 'bg-stone-100 dark:bg-stone-800/50',     color: 'text-stone-400',   label: 'TXT'  },
  generic: { bg: 'bg-stone-100 dark:bg-stone-800/50',     color: 'text-stone-400',   label: 'FILE' },
}

// ─── DB → UI ──────────────────────────────────────────────────────────────────

export function dbToUI(msg: DBMessage): UIMessage {
  return {
    id:               msg.id,
    role:             msg.role === 'system' ? 'assistant' : msg.role,
    content:          msg.content,
    files:            msg.files ?? [],
    thoughts:         msg.thoughts ?? [],
    thoughtsExpanded: false,
    isError:          msg.is_error,
    model:            msg.model,
    ts:               new Date(msg.created_at).getTime(),
  }
}