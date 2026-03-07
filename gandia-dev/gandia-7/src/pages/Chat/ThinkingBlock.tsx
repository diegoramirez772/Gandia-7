// ─── ThinkingBlock ────────────────────────────────────────────────────────────
// Diseño: sin cajas, sin fondos. Solo texto vivo con línea pulso izquierda.
// Íconos contextuales monocromáticos (se adaptan a dark/light mode).

// ─── Icon detector ────────────────────────────────────────────────────────────

function detectIcon(text: string): 'search' | 'chart' | 'file' | 'scale' | 'calc' | 'spark' | 'check' | 'dot' {
  const t = text.toLowerCase()
  if (/busqu|revis|encontr|consult|buscar|investig|explor/.test(t))            return 'search'
  if (/analiz|analice|calcul|compar|evalu|proces/.test(t))                    return 'chart'
  if (/document|archivo|dato|registro|historial|tabla|excel|pdf/.test(t))     return 'file'
  if (/opcion|alternativ|ventaja|desventaja|versus|vs\./.test(t))             return 'scale'
  if (/total|resultado|cifra|porcentaje|promedio|formula|consolid/.test(t))   return 'calc'
  if (/conclu|determin|identific|detect|observ|not[eé]|encontr/.test(t))      return 'spark'
  return 'dot'
}

function StepIcon({ kind, className }: { kind: ReturnType<typeof detectIcon>; className?: string }) {
  const cls = `shrink-0 ${className ?? 'w-3 h-3 text-stone-400 dark:text-stone-500'}`
  if (kind === 'search') return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  )
  if (kind === 'chart') return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  )
  if (kind === 'file') return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
    </svg>
  )
  if (kind === 'scale') return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="3" x2="12" y2="21"/><path d="M3 6l9-3 9 3"/><path d="M3 6c0 3.3 2.7 6 6 6s6-2.7 6-6"/><path d="M9 18c0 3.3 2.7 6 6 6s6-2.7 6-6"/>
    </svg>
  )
  if (kind === 'calc') return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="10" y2="10"/><line x1="14" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="10" y2="14"/><line x1="14" y1="14" x2="16" y2="14"/><line x1="8" y1="18" x2="16" y2="18"/>
    </svg>
  )
  if (kind === 'spark') return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  )
  // fallback — círculo genérico
  return (
    <svg className="shrink-0 w-3 h-3 text-stone-300 dark:text-stone-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="7"/>
    </svg>
  )
}

// ─── ThinkingBlock ─────────────────────────────────────────────────────────────

export function ThinkingBlock({
  thoughts,
  currentIdx,
  done,
  expanded,
  onToggle,
}: {
  thoughts:   string[]
  currentIdx: number
  done:       boolean
  expanded:   boolean
  onToggle:   () => void
}) {
  const visible = done ? thoughts : thoughts.slice(0, currentIdx + 1)
  const current = thoughts[currentIdx] ?? ''

  return (
    <div className="th-wrap mb-4 max-w-[520px]">

      {/* ── Línea pulso izquierda + contenido ── */}
      <div className="flex gap-3">

        {/* Línea vertical — pulso vivo cuando piensa, se apaga al terminar */}
        <div
          className="shrink-0 w-px self-stretch transition-all duration-500"
          style={{
            background: done
              ? 'rgba(47,175,143,0.25)'
              : 'linear-gradient(to bottom, #2FAF8F, rgba(47,175,143,0.3))',
          }}
        />

        <div className="flex flex-col gap-0 min-w-0 flex-1">

          {/* ── Header — siempre visible ── */}
          <button
            onClick={onToggle}
            className="flex items-center gap-2 group text-left"
            aria-expanded={expanded}
          >
            <span aria-live="polite" aria-atomic="true" className="sr-only">
              {done ? `Análisis completado: ${thoughts.length} pasos` : `Pensando: ${current}`}
            </span>

            {/* Ícono de estado */}
            {done ? (
              <svg
                className="shrink-0 w-3 h-3 text-[#2FAF8F]"
                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            ) : (
              /* Logo Gandia animado mientras piensa */
              <svg className="shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2FAF8F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <g className="gl-b"><path d="M2 17l10 5 10-5"/></g>
                <g className="gl-m"><path d="M2 12l10 5 10-5"/></g>
                <g className="gl-t"><path d="M12 2L2 7l10 5 10-5-10-5z"/></g>
              </svg>
            )}

            {/* Texto del header */}
            <span
              key={`t-${currentIdx}-${done}`}
              className="ch-serif italic text-[12.5px] leading-snug text-stone-400 dark:text-stone-500 truncate"
            >
              {done ? `Analicé ${thoughts.length} pasos` : current}
            </span>

            {/* Flecha expand/collapse */}
            <svg
              className={`w-2.5 h-2.5 shrink-0 transition-all duration-200 ml-0.5
                ${expanded
                  ? 'rotate-180 text-stone-400 dark:text-stone-500 opacity-100'
                  : 'text-stone-300 dark:text-stone-600 opacity-0 group-hover:opacity-100'
                }`}
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
            >
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          {/* ── Pasos expandidos ── */}
          {expanded && (
            <div className="mt-3 flex flex-col gap-2">
              {visible.map((t, i) => {
                const icon = detectIcon(t)
                return (
                  <div
                    key={i}
                    className="th-line flex items-start gap-2.5"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <div className="mt-[2px]">
                      <StepIcon kind={icon} />
                    </div>
                    <p className="text-[12px] text-stone-400 dark:text-stone-500 leading-[1.7]">
                      {t}
                    </p>
                  </div>
                )
              })}

              {/* Paso en curso si no ha terminado */}
              {!done && (
                <div className="flex items-start gap-2.5">
                  <span className="shrink-0 mt-[5px] w-1 h-1 rounded-full bg-[#2FAF8F]/50 animate-pulse" />
                  <p className="text-[12px] text-stone-300 dark:text-stone-600 italic leading-[1.7]">
                    Trabajando…
                  </p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

// ─── SavedThoughts ────────────────────────────────────────────────────────────
// Para mensajes históricos ya guardados en base de datos.

export function SavedThoughts({
  thoughts,
  expanded,
  onToggle,
}: {
  thoughts: string[]
  expanded: boolean
  onToggle: () => void
}) {
  return (
    <div className="th-resp mb-4 max-w-[520px]">
      <div className="flex gap-3">

        <div
          className="shrink-0 w-px self-stretch"
          style={{ background: 'rgba(47,175,143,0.2)' }}
        />

        <div className="flex flex-col gap-0 min-w-0 flex-1">

          <button onClick={onToggle} className="flex items-center gap-2 group text-left">
            <svg
              className="shrink-0 w-3 h-3 text-[#2FAF8F]"
              viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"/>
            </svg>

            <span className="ch-serif italic text-[12.5px] text-stone-400 dark:text-stone-500">
              Analicé {thoughts.length} pasos
            </span>

            <svg
              className={`w-2.5 h-2.5 shrink-0 transition-all duration-200 ml-0.5
                ${expanded
                  ? 'rotate-180 text-stone-400 dark:text-stone-500 opacity-100'
                  : 'text-stone-300 dark:text-stone-600 opacity-0 group-hover:opacity-100'
                }`}
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
            >
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          {expanded && (
            <div className="mt-3 flex flex-col gap-2">
              {thoughts.map((t, i) => (
                <div
                  key={i}
                  className="th-line flex items-start gap-2.5"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <div className="mt-[2px]">
                    <StepIcon kind={detectIcon(t)} />
                  </div>
                  <p className="text-[12px] text-stone-400 dark:text-stone-500 leading-[1.7]">
                    {t}
                  </p>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}