import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

// ─── TYPES ────────────────────────────────────────────────────────────────────
type OrbState = 'idle' | 'listening' | 'processing' | 'speaking'

interface Turn {
  role: 'user' | 'gandia'
  text: string
  ts: string
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const now = () =>
  new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })

// ─── MOCK CONVERSATION ───────────────────────────────────────────────────────
const MOCK_TURNS: Turn[] = [
  { role: 'user',   text: 'Necesito registrar un nuevo pasaporte para un becerro que nació esta mañana.',                                                                    ts: '09:14' },
  { role: 'gandia', text: 'Perfecto. Necesito el número de arete oficial o el ID del animal para iniciar el registro. ¿Lo tienes a la mano?',                               ts: '09:14' },
  { role: 'user',   text: 'Sí, el arete es MX-724-001-9923.',                                                                                                               ts: '09:15' },
  { role: 'gandia', text: 'Registrado. Ahora necesito la fecha de nacimiento exacta y el nombre de la madre si la tienes identificada.',                                     ts: '09:15' },
  { role: 'user',   text: 'Nació hoy 4 de marzo. La madre es la vaca con arete MX-724-001-0047, la Lola.',                                                                  ts: '09:15' },
  { role: 'gandia', text: 'Perfecto. Becerro MX-724-001-9923, nacido hoy, hijo de Lola MX-724-001-0047. ¿Deseas asignarle un nombre o lo dejamos sin nombre por ahora?',   ts: '09:16' },
  { role: 'user',   text: 'Ponle Torito por mientras.',                                                                                                                      ts: '09:16' },
  { role: 'gandia', text: 'Listo. El pasaporte de Torito quedó registrado. Te recuerdo que tiene 45 días para presentarlo ante el SENASICA para validación oficial.',       ts: '09:16' },
]

// ─── WAVEFORM ─────────────────────────────────────────────────────────────────
function Waveform({ active }: { active: boolean }) {
  const bars = 28
  return (
    <div className="flex items-center justify-center gap-[3px] h-8">
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className="rounded-full transition-all"
          style={{
            width: 2,
            backgroundColor: active ? '#2FAF8F' : '#d6d3d1',
            height: active
              ? `${8 + Math.abs(Math.sin(i * 0.72)) * 24}px`
              : '4px',
            animationDelay: active ? `${i * 38}ms` : '0ms',
            animation: active
              ? `wave-bar 1.1s ease-in-out ${i * 38}ms infinite alternate`
              : 'none',
            opacity: active ? 1 : 0.5,
          }}
        />
      ))}
    </div>
  )
}

// ─── ORB ──────────────────────────────────────────────────────────────────────
// ─── TYPING DOTS ─────────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 py-1">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-stone-300 dark:bg-stone-600"
          style={{ animation: `typing-dot 1.2s ease-in-out ${i * 200}ms infinite` }}
        />
      ))}
    </div>
  )
}

// ─── TURN ENTRY ───────────────────────────────────────────────────────────────
function TurnEntry({ turn }: { turn: Turn }) {
  return (
    <div className={`turn-in flex gap-3 ${turn.role === 'user' ? 'justify-end' : 'justify-start'}`}>

      <div className="max-w-[78%]">
        <p className={`text-[11px] font-semibold tracking-wide mb-1 ${turn.role === 'gandia' ? 'text-[#2FAF8F]' : 'text-stone-400 dark:text-stone-500 text-right'}`}>
          {turn.role === 'gandia' ? 'GANDIA' : 'TÚ'}
        </p>
        <div className={`rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-[1.65] ${
          turn.role === 'user'
            ? 'bg-stone-100 dark:bg-stone-800/60 text-stone-700 dark:text-stone-300'
            : 'text-stone-600 dark:text-stone-300'
        }`}>
          {turn.text}
        </div>
        <p className={`text-[10px] text-stone-300 dark:text-stone-600 mt-1 px-1 ${turn.role === 'user' ? 'text-right' : ''}`}>{turn.ts}</p>
      </div>
    </div>
  )
}

// ─── SUMMARY SHEET ────────────────────────────────────────────────────────────
function SummarySheet({
  open,
  onClose,
  turns,
}: {
  open: boolean
  onClose: () => void
  turns: Turn[]
}) {
  const navigate = useNavigate()

  const handleSendChat = () => {
    onClose()
    setTimeout(() => navigate('/chat'), 240)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 transition-all duration-300"
        style={{
          background: open ? 'rgba(0,0,0,0.25)' : 'transparent',
          backdropFilter: open ? 'blur(4px)' : 'none',
          pointerEvents: open ? 'all' : 'none',
          opacity: open ? 1 : 0,
        }}
      />

      {/* Sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 transition-transform duration-[360ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ transform: open ? 'translateY(0)' : 'translateY(100%)' }}
      >
        <div className="mx-auto max-w-[640px] px-4 pb-8">
          <div className="bg-white dark:bg-[#1c1917] rounded-[24px] border border-stone-200/80 dark:border-stone-800/60 shadow-[0_-4px_60px_rgba(0,0,0,0.12)] dark:shadow-[0_-4px_60px_rgba(0,0,0,0.50)] overflow-hidden">
            {/* Top accent */}
            <div className="h-[3px] bg-gradient-to-r from-[#2FAF8F] via-[#3fcfaf] to-[#2FAF8F]" />

            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-8 h-[3px] rounded-full bg-stone-200 dark:bg-stone-700" />
            </div>

            {/* Header */}
            <div className="px-6 pt-3 pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-[14px] font-semibold tracking-[-0.015em] text-stone-900 dark:text-stone-50">
                  Resumen de conversación
                </h3>
                <p className="text-[11.5px] text-stone-400 dark:text-stone-500 mt-0.5">
                  {turns.length} turnos · {turns[turns.length - 1]?.ts ?? '—'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/60 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Turns */}
            <div className="px-6 pb-4 space-y-4 max-h-[280px] overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
              {turns.map((t, i) => (
                <div key={i} className={`flex gap-3 ${t.role === 'user' ? 'justify-end' : 'justify-start'}`}>

                  <div className="max-w-[80%]">
                    <div className={`rounded-2xl px-3.5 py-2.5 text-[13px] leading-[1.65] ${
                      t.role === 'user'
                        ? 'bg-stone-100 dark:bg-stone-800/60 text-stone-700 dark:text-stone-300'
                        : 'bg-transparent text-stone-600 dark:text-stone-300'
                    }`}>
                      {t.text}
                    </div>
                    <p className="text-[10px] text-stone-300 dark:text-stone-600 mt-1 px-1">{t.ts}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="px-6 pb-6 pt-2 flex gap-2.5">
              <button
                onClick={() => navigator.clipboard.writeText(turns.map(t => `${t.role === 'gandia' ? 'Gandia' : 'Tú'}: ${t.text}`).join('\n\n'))}
                className="flex-1 h-10 rounded-xl text-[13px] font-medium text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800/60 hover:bg-stone-200 dark:hover:bg-stone-700 active:scale-[0.98] transition-all"
              >
                Copiar
              </button>
              <button
                onClick={handleSendChat}
                className="flex-1 h-10 rounded-xl text-[13px] font-medium text-white bg-[#2FAF8F] hover:bg-[#27a07f] active:scale-[0.98] transition-all shadow-sm"
              >
                Continuar en chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// ─── STATUS LABEL ─────────────────────────────────────────────────────────────
const STATE_META: Record<OrbState, { label: string; sub: string }> = {
  idle:       { label: 'Toca para hablar',  sub: 'Gandia está lista'            },
  listening:  { label: 'Escuchando…',       sub: 'Habla con claridad'           },
  processing: { label: 'Procesando…',       sub: 'Analizando tu solicitud'      },
  speaking:   { label: 'Gandia responde',   sub: 'Escucha la respuesta'         },
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function Voz() {
  const navigate = useNavigate()

  const [orbState, setOrbState] = useState<OrbState>('idle')
  const isPaused = false
  const [sheetOpen, setSheetOpen] = useState(false)
  const [turns, setTurns]         = useState<Turn[]>([])
  const [showTyping, setShowTyping] = useState(false)
  const timerRef  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hasRun    = useRef(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollToEnd = useCallback(() => {
    setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 80)
  }, [])

  // ── Demo flow ──
  const runDemoRef = useRef<() => void>(null!)

  useEffect(() => {
    runDemoRef.current = () => {
      if (hasRun.current) return
      hasRun.current = true
      let totalDelay = 0
      const schedule = (fn: () => void, ms: number) => {
        totalDelay += ms
        timerRef.current = setTimeout(fn, totalDelay)
      }
      MOCK_TURNS.forEach((turn, i) => {
        if (turn.role === 'user') {
          schedule(() => { setOrbState('listening') }, i === 0 ? 400 : 600)
          schedule(() => {
            setTurns(p => [...p, { ...turn, ts: now() }])
            setOrbState('processing')
            scrollToEnd()
          }, 2000)
        } else {
          schedule(() => { setShowTyping(true); setOrbState('speaking'); scrollToEnd() }, 1400)
          schedule(() => {
            setShowTyping(false)
            setTurns(p => [...p, { ...turn, ts: now() }])
            scrollToEnd()
          }, 1600)
          if (i === MOCK_TURNS.length - 1) {
            schedule(() => { setOrbState('idle') }, 1800)
          }
        }
      })
    }
  })

  useEffect(() => {
    const t = setTimeout(() => runDemoRef.current(), 600)
    return () => { clearTimeout(t); if (timerRef.current) clearTimeout(timerRef.current) }
  }, [])

  const handleOrbClick = () => {
    if (isPaused) return
    if (timerRef.current) clearTimeout(timerRef.current)
    if (orbState === 'idle') {
      runDemoRef.current()
    } else {
      setOrbState('idle')
    }
  }


  const meta = isPaused
    ? { label: 'En pausa', sub: 'Toca ▶ para continuar' }
    : STATE_META[orbState]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600&display=swap');

        .vz * { -webkit-font-smoothing: antialiased; }
        .vz { font-family: 'Geist', system-ui, sans-serif; }
        .vz-serif, .sheet-serif { font-family: 'Instrument Serif', Georgia, serif; }

        .vz *:focus-visible { outline: none !important; box-shadow: none !important; }

        /* Waveform bar animation */
        @keyframes wave-bar {
          0%   { transform: scaleY(0.3); }
          100% { transform: scaleY(1);   }
        }

        /* Orb ambient ring — slow rotation */
        @keyframes ring-ambient {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .orb-ring-ambient {
          animation: ring-ambient 18s linear infinite;
          border-style: dashed;
        }

        /* Listening pulse */
        @keyframes orb-pulse-out {
          0%   { transform: scale(1);    opacity: 0.5; }
          100% { transform: scale(1.48); opacity: 0;   }
        }
        .orb-pulse-1 { animation: orb-pulse-out 1.9s ease-out infinite; }
        .orb-pulse-2 { animation: orb-pulse-out 1.9s ease-out 0.65s infinite; }

        /* Speaking pulse */
        @keyframes orb-speak {
          0%,100% { transform: scale(1);    opacity: 0.3; }
          50%     { transform: scale(1.28); opacity: 0;   }
        }
        .orb-speak-1 { animation: orb-speak 2.4s ease-in-out infinite; }

        /* Processing arc spin */
        @keyframes arc-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .orb-spin-arc { animation: arc-spin 1.6s linear infinite; transform-origin: center; }

        /* Core idle breathing */
        @keyframes core-breathe {
          0%,100% { transform: scale(1);    }
          50%     { transform: scale(1.04); }
        }
        .orb-core { animation: core-breathe 4s ease-in-out infinite; }

        /* Processing icon micro-spin */
        @keyframes icon-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .orb-icon-spin { animation: icon-spin 3s linear infinite; }

        /* Turn entry */
        @keyframes turn-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
        .turn-in { animation: turn-in 320ms cubic-bezier(.16,1,.3,1) both; }

        /* State label cross-fade */
        @keyframes label-in {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
        .label-in { animation: label-in 240ms ease both; }

        /* Typing dots */
        @keyframes typing-dot {
          0%,60%,100% { opacity: 0.25; transform: translateY(0); }
          30%          { opacity: 1;    transform: translateY(-3px); }
        }

        /* Thin scrollbar */
        .vz-scroll::-webkit-scrollbar { width: 4px; }
        .vz-scroll::-webkit-scrollbar-track { background: transparent; }
        .vz-scroll::-webkit-scrollbar-thumb { background: #e7e5e4; border-radius: 999px; }
        .dark .vz-scroll::-webkit-scrollbar-thumb { background: #3c3836; }
      `}</style>

      <div className="vz flex flex-col h-full bg-[#fafaf9] dark:bg-[#0c0a09] select-none overflow-hidden">

        {/* ── TRANSCRIPT AREA ─────────────────────────────── */}
        <div className="flex-1 min-h-0 overflow-hidden">
          {turns.length === 0 && orbState === 'idle' && !isPaused ? (
            /* Empty state */
            <div className="h-full flex flex-col items-center justify-center gap-3 px-8">
              <div className="w-11 h-11 rounded-[14px] bg-stone-100 dark:bg-stone-800/60 flex items-center justify-center mb-1">
                <svg className="w-5 h-5 text-stone-300 dark:text-stone-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
              </div>
              <p className="text-[14px] font-semibold text-stone-500 dark:text-stone-400">Gandia está lista</p>
              <p className="text-[12.5px] text-stone-400 dark:text-stone-500 text-center leading-relaxed">
                Toca el micrófono para iniciar<br />una conversación por voz
              </p>
            </div>
          ) : (
            /* Transcript */
            <div
              ref={scrollRef}
              className="h-full overflow-y-auto vz-scroll px-5 py-5 space-y-5"
            >
              {/* Session divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-stone-200/70 dark:bg-stone-800/60" />
                <span className="text-[10px] text-stone-300 dark:text-stone-600 tracking-wide">{now()} · Sesión iniciada</span>
                <div className="flex-1 h-px bg-stone-200/70 dark:bg-stone-800/60" />
              </div>

              {turns.map((t, i) => (
                <TurnEntry key={i} turn={t} />
              ))}

              {/* Typing indicator */}
              {showTyping && (
                <div>
                  <p className="text-[11px] font-semibold tracking-wide text-[#2FAF8F] mb-1">GANDIA</p>
                  <TypingDots />
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── CONTROLS ────────────────────────────────────────── */}
        <div className="shrink-0 border border-b-0 border-stone-200/60 dark:border-stone-800/60 rounded-t-3xl px-6 pt-5 pb-6 bg-white dark:bg-[#0c0a09] shadow-[0_-4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_24px_rgba(0,0,0,0.30)]">
          <div className="max-w-[400px] mx-auto">

            {/* Status + waveform */}
            <div className="flex flex-col items-center gap-2 mb-5">
              <div key={`${orbState}-${isPaused}`} className="label-in text-center">
                <p className="text-[13px] font-medium tracking-[-0.01em] text-stone-700 dark:text-stone-200">
                  {meta.label}
                </p>
                <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-0.5">
                  {meta.sub}
                </p>
              </div>
              <div className="h-7">
                <Waveform active={!isPaused && orbState === 'listening'} />
              </div>
            </div>

            {/* 3 buttons: Resumen | Mic | Salir */}
            <div className="flex items-center justify-center gap-8">

              {/* Resumen */}
              <ControlBtn
                onClick={() => setSheetOpen(true)}
                label="Resumen"
                badge={turns.length > 0 ? String(turns.length) : undefined}
              >
                <svg className="w-[17px] h-[17px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="9" y1="13" x2="15" y2="13"/>
                  <line x1="9" y1="17" x2="13" y2="17"/>
                </svg>
              </ControlBtn>

              {/* Central mic button */}
              <button
                onClick={handleOrbClick}
                disabled={isPaused}
                aria-label="Activar micrófono"
                className={`
                  w-[66px] h-[66px] rounded-[22px] flex items-center justify-center
                  transition-all duration-200 active:scale-95
                  ${isPaused
                    ? 'bg-stone-100 dark:bg-stone-800/60 text-stone-300 dark:text-stone-600 cursor-not-allowed'
                    : orbState !== 'idle'
                    ? 'bg-[#2FAF8F] hover:bg-[#27a07f] text-white shadow-[0_4px_20px_rgba(47,175,143,0.35)]'
                    : 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-700 dark:hover:bg-stone-300'
                  }
                `}
              >
                <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="23"/>
                  <line x1="8" y1="23" x2="16" y2="23"/>
                </svg>
              </button>

              {/* Salir */}
              <ControlBtn onClick={() => navigate(-1)} label="Salir">
                <svg className="w-[17px] h-[17px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </ControlBtn>

            </div>

            <p className="text-center text-[10px] text-stone-300 dark:text-stone-700 mt-4 tracking-wide">
              GANDIA 7 · Voz · Asistente ganadero
            </p>
          </div>
        </div>

      </div>

      {/* ── SUMMARY SHEET ─────────────────────────────────────── */}
      <SummarySheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        turns={turns.length > 0 ? turns : MOCK_TURNS.map(t => ({ ...t, ts: '09:14' }))}
      />
    </>
  )
}

// ─── CONTROL BTN ──────────────────────────────────────────────────────────────
function ControlBtn({
  onClick,
  label,
  children,
  active = false,
  badge,
}: {
  onClick: () => void
  label: string
  children: React.ReactNode
  active?: boolean
  badge?: string
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`
        relative w-11 h-11 rounded-xl flex items-center justify-center
        transition-all duration-150 active:scale-95
        border
        ${active
          ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-stone-900 dark:border-stone-100'
          : 'bg-white dark:bg-[#1c1917] text-stone-500 dark:text-stone-400 border-stone-200/80 dark:border-stone-800/60 hover:text-stone-700 dark:hover:text-stone-200 hover:border-stone-300 dark:hover:border-stone-700 shadow-[0_1px_4px_rgba(0,0,0,0.05)]'
        }
      `}
    >
      {children}
      {badge && (
        <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-[#2FAF8F] text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 leading-none shadow-sm">
          {badge}
        </span>
      )}
    </button>
  )
}