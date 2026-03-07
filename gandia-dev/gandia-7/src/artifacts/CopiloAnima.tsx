/**
 * CopiloAnima — Copiloto flotante del nivel Ánima.
 *
 * No es el chat principal. Es un agente contextual que:
 *   - Vive dentro del Ánima como componente flotante.
 *   - Tiene thinking block de una sola línea (compacto).
 *   - Ejecuta acciones directamente sobre el dominio activo.
 *   - Puede sugerir acciones contextuales.
 *   - El usuario lo usa sin salir del entorno operativo.
 *
 * Props:
 *   domain  → dominio activo del Ánima (define qué acciones sugiere)
 *   onAction → callback cuando la IA ejecuta una acción en el dominio
 */

import { useState, useRef, useEffect, useCallback } from 'react'
import type { ArtifactDomain } from './artifactTypes'

// ─── TIPOS ────────────────────────────────────────────────────────────────────

interface CopiloAction {
  id:    string
  label: string
  icon:  string
}

interface Props {
  domain:    ArtifactDomain
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onAction?: (actionId: string, payload?: any) => void
}

// ─── ACCIONES SUGERIDAS POR DOMINIO ──────────────────────────────────────────

const SUGGESTED_ACTIONS: Record<ArtifactDomain, CopiloAction[]> = {
  passport: [
    { id: 'create_passport',  label: 'Crear pasaporte',     icon: '+' },
    { id: 'filter_eligible',  label: 'Solo elegibles',      icon: '★' },
    { id: 'export_list',      label: 'Exportar lista',      icon: '↓' },
  ],
  twins: [
    { id: 'view_timeline',    label: 'Ver historial',       icon: '⌛' },
    { id: 'add_event',        label: 'Registrar evento',    icon: '+' },
    { id: 'view_feeding',     label: 'Ver alimentación',    icon: '🌾' },
  ],
  monitoring: [
    { id: 'view_alerts',      label: 'Ver alertas',         icon: '!' },
    { id: 'refresh_sensors',  label: 'Actualizar sensores', icon: '↻' },
  ],
  certification: [
    { id: 'new_cert',         label: 'Nueva certificación', icon: '+' },
    { id: 'expiring',         label: 'Próximas a vencer',   icon: '⏱' },
  ],
  tramites: [
    { id: 'new_tramite',      label: 'Nuevo trámite',       icon: '+' },
    { id: 'pending',          label: 'Pendientes',          icon: '·' },
  ],
  verification: [
    { id: 'new_audit',        label: 'Nueva auditoría',     icon: '+' },
    { id: 'history',          label: 'Ver historial',       icon: '⌛' },
  ],
  sanidad: [
    { id: 'check_risk',       label: 'Ver riesgo zona',     icon: '⚠' },
    { id: 'report_senasica',  label: 'Reportar SENASICA',   icon: '↗' },
    { id: 'view_protocol',    label: 'Ver protocolo',       icon: '📋' },
  ],
  biometria: [
    { id: 'capture_morro',    label: 'Nueva captura',       icon: '📷' },
    { id: 'view_historial',   label: 'Historial del día',   icon: '⌛' },
    { id: 'register_animal',  label: 'Registrar animal',    icon: '+' },
  ],
}

// ─── COLORES POR DOMINIO (solo para el botón flotante) ───────────────────────

const DOMAIN_COLOR: Record<ArtifactDomain, string> = {
  passport:      '#2FAF8F',
  twins:         '#6366f1',
  monitoring:    '#f59e0b',
  certification: '#3b82f6',
  tramites:      '#8b5cf6',
  verification:  '#ec4899',
  sanidad:       '#ef4444',
  biometria:     '#6366f1',
}

// ─── ESTADO DEL COPILOTO ──────────────────────────────────────────────────────

type CopiloState =
  | 'idle'       // Campo de texto, acciones sugeridas visibles
  | 'thinking'   // Ejecutando / procesando (thinking block de 1 línea)
  | 'done'       // Acción completada, mensaje de respuesta breve

// ─── COMPONENTE ──────────────────────────────────────────────────────────────

export default function CopiloAnima({ domain, onAction }: Props) {
  const [open,       setOpen]       = useState(false)
  const [input,      setInput]      = useState('')
  const [state,      setState]      = useState<CopiloState>('idle')
  const [thinkText,  setThinkText]  = useState('')
  const [resultText, setResultText] = useState('')

  const inputRef = useRef<HTMLInputElement>(null)
  const color    = DOMAIN_COLOR[domain]
  const actions  = SUGGESTED_ACTIONS[domain]

  // Foco automático al abrir
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 80)
  }, [open])

  // ─── Simular ejecución de acción ─────────────────────────────────────────
  const executeAction = useCallback((label: string, actionId?: string) => {
    if (state === 'thinking') return
    setState('thinking')
    setThinkText(`Ejecutando: ${label}...`)
    setInput('')

    setTimeout(() => {
      setState('done')
      setResultText(`Listo. ${label} completado.`)
      if (actionId) onAction?.(actionId)
      setTimeout(() => {
        setState('idle')
        setResultText('')
        setThinkText('')
      }, 2500)
    }, 1200)
  }, [state, onAction])

  const handleSubmit = useCallback(() => {
    const trimmed = input.trim()
    if (!trimmed || state === 'thinking') return
    executeAction(trimmed)
  }, [input, state, executeAction])

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit()
    if (e.key === 'Escape') { setOpen(false); setInput('') }
  }

  // ─── RENDER ──────────────────────────────────────────────────────────────
  return (
    <div className="fixed bottom-20 md:bottom-6 right-6 z-[60] flex flex-col items-end gap-2">

      {/* Panel ── mismo lenguaje visual que Chat.tsx */}
      {open && (
        <div className="w-72 rounded-2xl overflow-hidden
                        bg-white dark:bg-[#141210]
                        border border-stone-200/80 dark:border-stone-800/70
                        shadow-[0_8px_32px_rgba(0,0,0,0.08)]
                        dark:shadow-[0_8px_40px_rgba(0,0,0,0.45)]">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2.5
                          border-b border-stone-100 dark:border-stone-800/60">
            <div className="flex items-center gap-2">
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: color }}
              />
              <span className="text-[12px] font-semibold
                               text-stone-700 dark:text-stone-200">
                Copiloto
              </span>
              <span className="font-mono text-[9px] font-semibold px-1.5 py-0.5
                               rounded uppercase tracking-wider
                               text-stone-400 dark:text-stone-500
                               bg-stone-100 dark:bg-stone-800/60
                               border border-stone-200/70 dark:border-stone-700/50">
                {domain}
              </span>
            </div>
            <button
              onClick={() => { setOpen(false); setInput('') }}
              className="w-6 h-6 flex items-center justify-center rounded-lg
                         text-stone-300 dark:text-stone-600
                         hover:text-stone-500 dark:hover:text-stone-400
                         hover:bg-stone-100 dark:hover:bg-stone-800/60
                         transition-all"
            >
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Thinking block */}
          {state === 'thinking' && (
            <div className="px-4 py-2.5 flex items-center gap-2
                            border-b border-stone-100 dark:border-stone-800/50
                            bg-stone-50/60 dark:bg-stone-900/30">
              <span
                className="w-1 h-1 rounded-full shrink-0 animate-pulse"
                style={{ background: color }}
              />
              <span className="font-mono text-[11px] flex-1 truncate
                               text-stone-400 dark:text-stone-500">
                {thinkText}
              </span>
            </div>
          )}

          {/* Resultado */}
          {state === 'done' && (
            <div className="px-4 py-2.5 flex items-center gap-2
                            border-b border-stone-100 dark:border-stone-800/50
                            bg-stone-50/60 dark:bg-stone-900/30">
              <span className="text-[#2FAF8F] text-[11px] font-semibold shrink-0">✓</span>
              <span className="text-[12px] text-stone-600 dark:text-stone-300">
                {resultText}
              </span>
            </div>
          )}

          {/* Acciones sugeridas */}
          {state === 'idle' && (
            <div className="px-3 py-2.5 flex flex-wrap gap-1.5">
              {actions.map(a => (
                <button
                  key={a.id}
                  onClick={() => executeAction(a.label, a.id)}
                  className="flex items-center gap-1.5 h-7 px-2.5 rounded-lg
                             text-[11.5px] font-medium transition-all
                             text-stone-500 dark:text-stone-400
                             bg-stone-50 dark:bg-stone-800/50
                             border border-stone-200/70 dark:border-stone-700/50
                             hover:text-stone-700 dark:hover:text-stone-200
                             hover:border-stone-300 dark:hover:border-stone-600
                             active:scale-95"
                >
                  <span className="text-[10px] opacity-60">{a.icon}</span>
                  {a.label}
                </button>
              ))}
            </div>
          )}

          {/* Input — igual que ch-input de Chat.tsx */}
          <div className="px-3 pb-3 pt-1
                          border-t border-stone-100 dark:border-stone-800/50">
            <div className="flex items-center gap-2
                            bg-white dark:bg-[#1c1917]
                            border border-stone-200/70 dark:border-stone-800/60
                            rounded-xl px-3 py-2
                            focus-within:border-stone-300 dark:focus-within:border-stone-700
                            transition-all">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                disabled={state === 'thinking'}
                placeholder="Ejecutar acción o hacer pregunta..."
                className="flex-1 bg-transparent text-[12px] outline-none min-w-0
                           text-stone-700 dark:text-stone-200
                           placeholder:text-stone-300 dark:placeholder:text-stone-600
                           disabled:opacity-50"
              />
              <button
                onClick={handleSubmit}
                disabled={!input.trim() || state === 'thinking'}
                className="w-6 h-6 flex items-center justify-center rounded-lg
                           transition-all active:scale-90 shrink-0
                           disabled:opacity-25"
                style={{
                  background: input.trim() ? '#2FAF8F' : 'transparent',
                }}
              >
                <svg
                  className="w-3 h-3"
                  style={{ color: input.trim() ? 'white' : '#a8a29e' }}
                  viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2.5" strokeLinecap="round"
                >
                  <line x1="12" y1="19" x2="12" y2="5"/>
                  <polyline points="5 12 12 5 19 12"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Botón flotante */}
      <button
        onClick={() => setOpen(p => !p)}
        title="Copiloto"
        className="w-10 h-10 rounded-2xl flex items-center justify-center
                   transition-all hover:scale-105 active:scale-95
                   shadow-[0_4px_16px_rgba(0,0,0,0.12)]
                   dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
        style={{ background: '#2FAF8F' }}
      >
        {state === 'thinking' ? (
          <svg className="w-4 h-4 text-white animate-spin" viewBox="0 0 24 24"
            fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
        ) : state === 'done' ? (
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24"
            fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        ) : (
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24"
            fill="none" stroke="white" strokeWidth="1.75" strokeLinecap="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
        )}
      </button>

    </div>
  )
}