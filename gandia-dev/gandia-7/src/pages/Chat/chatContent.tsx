import type { ReactNode } from 'react'

// ─── renderContent ────────────────────────────────────────────────────────────
// Convierte texto plano con markdown básico a nodos React.
// Usado en ChatMessage.tsx (mensajes históricos) y Chat.tsx (streaming).

export function renderContent(text: string): ReactNode[] {
  const lines    = text.split('\n')
  const elements: ReactNode[] = []
  let key = 0

  const renderInline = (line: string): ReactNode[] => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g)
    return parts.map((p, i) =>
      p.startsWith('**') && p.endsWith('**')
        ? <strong key={i} className="font-semibold text-stone-800 dark:text-stone-100">{p.slice(2, -2)}</strong>
        : p
    )
  }

  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (!line.trim()) { elements.push(<div key={key++} className="h-3" />); i++; continue }
    if (line.match(/^[-•]\s/)) {
      const items: string[] = []
      while (i < lines.length && lines[i].match(/^[-•]\s/)) { items.push(lines[i].replace(/^[-•]\s/, '')); i++ }
      elements.push(
        <ul key={key++} className="space-y-1 my-1">
          {items.map((item, ii) => (
            <li key={ii} className="flex items-start gap-2.5 text-[14px] text-stone-600 dark:text-stone-300 leading-[1.7]">
              <span className="mt-1.75 w-1 h-1 rounded-full bg-[#2FAF8F]/60 shrink-0" />
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      )
      continue
    }
    if (line.match(/^\*\*[^*]+\*\*$/)) {
      elements.push(
        <p key={key++} className="text-[14px] font-semibold text-stone-800 dark:text-stone-100 leading-snug mt-4 first:mt-0">
          {line.slice(2, -2)}
        </p>
      )
      i++; continue
    }
    elements.push(
      <p key={key++} className="text-[14px] text-stone-700 dark:text-stone-200 leading-[1.75]">
        {renderInline(line)}
      </p>
    )
    i++
  }
  return elements
}