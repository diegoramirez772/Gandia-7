import type { ChatMode, ChatModel } from '../../lib/chatService'

export const MODELS_ASISTENTE: { id: ChatModel; label: string; desc: string }[] = [
  { id: 'acipe',      label: 'Siete 1.0',      desc: 'Asistente ganadero' },
  { id: 'acipe-slim', label: 'Siete 1.0 Slim', desc: 'Sin conexión a internet' },
]

export const MODELS_EXTERNOS: { id: ChatModel; label: string; desc: string }[] = [
  { id: 'claude', label: 'Claude', desc: 'Análisis profundo' },
  { id: 'gpt4o',  label: 'GPT-4o', desc: 'Respuesta rápida'  },
  { id: 'gemini', label: 'Gemini', desc: 'Multimodal'         },
]

export const modeLabel: Record<ChatMode, string> = {
  asistente:     'Asistente',
  noticias:      'Noticias',
  investigacion: 'Investigación',
}

// IcoNews, IcoChat, IcoSearch are local to ChatInputBar, so modeIcon lives there