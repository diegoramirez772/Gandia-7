/**
 * BiometriaResultadoWidget — Widget: biometria:resultado
 * ARCHIVO → src/artifacts/biometria/widgets/BiometriaResultadoWidget.tsx
 *
 * CAMBIOS v2:
 * - Match: comparación lado a lado (captura actual vs foto registrada)
 * - "No es esta" → muestra candidatos inline sin salir de la pantalla
 * - Nuevo animal: imagen ya adjunta + GPS + timestamp pre-llenados visibles
 */
import { useState, useMemo } from 'react'

export type ResultadoTipo = 'match' | 'candidato' | 'nuevo' | 'procesando'

export interface AnimalMatch {
  id:         string
  nombre:     string
  raza:       string
  lote:       string
  arete:      string
  score:      number
  scoreCV:    number
  scoreIA:    number
  imagenUrl?: string
}

export interface BiometriaResultado {
  tipo:        ResultadoTipo
  captura:     string
  match?:      AnimalMatch
  candidatos?: AnimalMatch[]
  modo:        'direct' | 'sheet'
  ms:          number
  // Para nuevo animal — GPS simulado, se sustituye por Geolocation API en prod
  lat?:        number
  lng?:        number
}

interface Props {
  resultado:    BiometriaResultado
  onConfirmar?: (animal: AnimalMatch) => void
  onRechazar?:  () => void
  onRegistrar?: () => void
  onNueva?:     () => void
}

const STATUS = {
  match:      { label: 'Identificado',  color: '#2FAF8F', bg: 'bg-[#2FAF8F]/10 dark:bg-[#2FAF8F]/15', text: 'text-[#2FAF8F]',                         border: 'border-[#2FAF8F]/25' },
  candidato:  { label: 'Revisar',       color: '#f59e0b', bg: 'bg-amber-50 dark:bg-amber-950/25',     text: 'text-amber-600 dark:text-amber-400',     border: 'border-amber-200 dark:border-amber-800/30' },
  nuevo:      { label: 'No registrado', color: '#8b5cf6', bg: 'bg-violet-50 dark:bg-violet-950/25',   text: 'text-violet-600 dark:text-violet-400',   border: 'border-violet-200 dark:border-violet-800/30' },
  procesando: { label: 'Procesando…',   color: '#94a3b8', bg: 'bg-stone-50 dark:bg-stone-800/30',     text: 'text-stone-400 dark:text-stone-500',     border: 'border-stone-200 dark:border-stone-700/40' },
}

// Simula foto registrada — en prod: resultado.match.imagenUrl desde Supabase Storage
const PLACEHOLDER_REGISTERED = null

export default function BiometriaResultadoWidget({
  resultado, onConfirmar, onRechazar, onRegistrar, onNueva,
}: Props) {
  const [candidatoSel,    setCandidatoSel]    = useState<AnimalMatch | null>(resultado.candidatos?.[0] ?? null)
  const [confirmado,      setConfirmado]      = useState(false)
  // "No es esta" en match → muestra candidatos inline
  const [showCandidatos,  setShowCandidatos]  = useState(false)

  const s = STATUS[resultado.tipo]

  const handleConfirmar = (animal: AnimalMatch) => {
    setConfirmado(true)
    setTimeout(() => onConfirmar?.(animal), 500)
  }

  const handleNoEsEsta = () => {
    // Si hay candidatos → mostrarlos inline
    if (resultado.candidatos && resultado.candidatos.length > 0) {
      setShowCandidatos(true)
    } else {
      onRechazar?.()
    }
  }

  // Timestamp legible para nuevo animal
  const tsLabel = useMemo(() =>
    new Date().toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' })
  , [])
  const gpsLabel = resultado.lat && resultado.lng
    ? `${resultado.lat.toFixed(4)}, ${resultado.lng.toFixed(4)}`
    : '24.1540, −104.6045'  // simulado — en prod: navigator.geolocation

  return (
    <div className="flex flex-col bg-white dark:bg-[#1c1917] border border-stone-200/60 dark:border-stone-800/50 rounded-[12px] overflow-hidden">

      {/* ── Banda de estado ── */}
      <div className={`flex items-center justify-between px-4 py-2.5 border-b ${s.bg} ${s.border}`}>
        <div className="flex items-center gap-2">
          {resultado.tipo === 'procesando'
            ? <svg className="w-3.5 h-3.5 animate-spin" style={{ color: s.color }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            : resultado.tipo === 'match'
            ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            : resultado.tipo === 'candidato'
            ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          }
          <span className={`text-[13px] font-semibold ${s.text}`}>{s.label}</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-[11px] text-stone-400 dark:text-stone-500">{resultado.modo === 'direct' ? 'Cámara directa' : 'Hoja inteligente'}</span>
          <span className="text-[10px] text-stone-300 dark:text-stone-600 font-mono">{resultado.ms}ms</span>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-4">

        {/* ═══ MATCH ════════════════════════════════════════════════════ */}
        {resultado.tipo === 'match' && resultado.match && !showCandidatos && (
          <>
            {/* ── Comparación lado a lado ── */}
            <div className="flex flex-col gap-2">
              <p className="text-[10.5px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-[0.06em]">Comparación biométrica</p>
              <div className="grid grid-cols-2 gap-2">
                {/* Captura actual */}
                <div className="flex flex-col gap-1.5">
                  <div className="aspect-[4/3] rounded-[8px] overflow-hidden bg-stone-100 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-800/50 relative">
                    {resultado.captura
                      ? <img src={resultado.captura} alt="Morro capturado" className="w-full h-full object-cover"/>
                      : <div className="w-full h-full flex items-center justify-center text-stone-300 dark:text-stone-600">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><ellipse cx="12" cy="13" rx="7" ry="5"/></svg>
                        </div>
                    }
                    <div className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-[3px] rounded-[4px] px-1.5 py-0.5">
                      <span className="text-[8px] text-white font-semibold tracking-wide">CAPTURA</span>
                    </div>
                  </div>
                  <p className="text-[10.5px] text-stone-400 dark:text-stone-500 text-center">Foto actual</p>
                </div>

                {/* Foto registrada */}
                <div className="flex flex-col gap-1.5">
                  <div className="aspect-[4/3] rounded-[8px] overflow-hidden bg-stone-100 dark:bg-stone-800/50 border-2 border-[#2FAF8F]/30 relative">
                    {resultado.match.imagenUrl || PLACEHOLDER_REGISTERED
                      ? <img src={resultado.match.imagenUrl} alt="Morro registrado" className="w-full h-full object-cover"/>
                      : (
                        /* Placeholder realista — en prod: imagen de Supabase Storage */
                        <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 bg-[#2FAF8F]/04">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2FAF8F" strokeWidth="1.25" strokeLinecap="round" strokeOpacity="0.5">
                            <circle cx="12" cy="12" r="3"/>
                            <path d="M3 9V6a1 1 0 0 1 1-1h3"/><path d="M21 9V6a1 1 0 0 0-1-1h-3"/>
                            <path d="M3 15v3a1 1 0 0 0 1 1h3"/><path d="M21 15v3a1 1 0 0 1-1 1h-3"/>
                          </svg>
                          <span className="text-[9px] text-[#2FAF8F]/50">Foto en base de datos</span>
                        </div>
                      )
                    }
                    <div className="absolute bottom-1.5 left-1.5 bg-[#2FAF8F]/80 backdrop-blur-[3px] rounded-[4px] px-1.5 py-0.5">
                      <span className="text-[8px] text-white font-semibold tracking-wide">REGISTRADO</span>
                    </div>
                  </div>
                  <p className="text-[10.5px] text-stone-400 dark:text-stone-500 text-center">Foto base de datos</p>
                </div>
              </div>
            </div>

            {/* Animal info + score hero */}
            <div className="flex items-center gap-3 bg-stone-50 dark:bg-[#141210] rounded-[8px] px-3.5 py-3">
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-bold text-stone-800 dark:text-stone-100 leading-tight truncate">{resultado.match.nombre}</p>
                <p className="text-[12px] text-stone-500 dark:text-stone-400 mt-0.5">
                  {resultado.match.raza} · Lote {resultado.match.lote} · {resultado.match.arete}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[36px] font-extrabold leading-none tabular-nums" style={{ color: '#2FAF8F' }}>
                  {Math.round(resultado.match.score * 100)}%
                </p>
                <p className="text-[10.5px] text-stone-400 dark:text-stone-500 mt-0.5">confianza</p>
              </div>
            </div>

            {/* Scores detalle */}
            <div className="border border-stone-100 dark:border-stone-800/40 rounded-[8px] overflow-hidden">
              {[
                { label: 'Fingerprint CV', value: resultado.match.scoreCV, color: '#2FAF8F' },
                { label: 'IA Embedding',   value: resultado.match.scoreIA, color: '#8b5cf6' },
                { label: 'Score final',    value: resultado.match.score,   color: '#2FAF8F', bold: true },
              ].map((row, i, arr) => (
                <div key={row.label}
                  className={`flex items-center justify-between px-3.5 py-2.5 ${i < arr.length - 1 ? 'border-b border-stone-100 dark:border-stone-800/40' : ''} ${row.bold ? 'bg-stone-50 dark:bg-[#141210]' : ''}`}>
                  <span className={`text-[12px] ${row.bold ? 'font-semibold text-stone-700 dark:text-stone-300' : 'text-stone-500 dark:text-stone-400'}`}>{row.label}</span>
                  <span className="text-[13px] font-bold tabular-nums" style={{ color: row.color }}>
                    {Math.round(row.value * 100)}%
                  </span>
                </div>
              ))}
            </div>

            {/* Acciones */}
            {!confirmado ? (
              <div className="flex gap-2">
                <button
                  onClick={handleNoEsEsta}
                  className="flex-1 h-9 rounded-[8px] border border-stone-200 dark:border-stone-700/60 bg-white dark:bg-[#1c1917] text-[12.5px] text-stone-500 dark:text-stone-400 cursor-pointer hover:border-red-300 hover:text-red-500 transition-all"
                >
                  No es esta
                </button>
                <button
                  onClick={() => handleConfirmar(resultado.match!)}
                  className="flex-1 h-9 bg-[#2FAF8F] hover:bg-[#27a07f] text-white text-[12.5px] font-semibold rounded-[8px] border-0 cursor-pointer transition-colors flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Confirmar
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 h-9 bg-[#2FAF8F]/08 dark:bg-[#2FAF8F]/12 rounded-[8px] border border-[#2FAF8F]/20">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2FAF8F" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                <span className="text-[12.5px] text-[#2FAF8F] font-semibold">Identificación confirmada</span>
              </div>
            )}
          </>
        )}

        {/* ═══ CANDIDATOS INLINE (desde "No es esta" o tipo candidato) ══ */}
        {(resultado.tipo === 'candidato' || showCandidatos) && resultado.candidatos && (
          <>
            {showCandidatos && (
              <div className="flex items-center gap-2 pb-1">
                <button onClick={() => setShowCandidatos(false)}
                  className="flex items-center gap-1 text-stone-400 hover:text-stone-600 transition-colors cursor-pointer border-0 bg-transparent p-0">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
                <p className="text-[12px] font-semibold text-stone-700 dark:text-stone-200">¿Cuál es el animal correcto?</p>
              </div>
            )}

            {!showCandidatos && (
              <p className="text-[12.5px] text-stone-500 dark:text-stone-400">
                Score en zona gris. Selecciona el animal correcto:
              </p>
            )}

            {/* Comparación: captura + candidatos */}
            <div className="flex gap-2 items-start">
              {/* Captura actual — columna fija */}
              <div className="shrink-0 flex flex-col gap-1">
                <div className="w-16 h-16 rounded-[8px] overflow-hidden bg-stone-100 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-800/50">
                  {resultado.captura
                    ? <img src={resultado.captura} alt="Captura" className="w-full h-full object-cover"/>
                    : <div className="w-full h-full flex items-center justify-center"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round"><ellipse cx="12" cy="13" rx="7" ry="5"/></svg></div>
                  }
                </div>
                <p className="text-[9px] text-stone-400 text-center">Captura</p>
              </div>

              {/* Lista candidatos */}
              <div className="flex-1 flex flex-col gap-1.5">
                {resultado.candidatos.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setCandidatoSel(c)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[8px] border text-left cursor-pointer transition-all ${
                      candidatoSel?.id === c.id
                        ? 'border-amber-300 dark:border-amber-700/50 bg-amber-50/60 dark:bg-amber-950/20'
                        : 'border-stone-200/60 dark:border-stone-800/50 bg-white dark:bg-[#1c1917] hover:bg-stone-50 dark:hover:bg-[#141210]'
                    }`}
                  >
                    {/* Foto registrada miniatura */}
                    <div className="w-9 h-9 rounded-[6px] overflow-hidden bg-stone-100 dark:bg-stone-800/40 border border-stone-200/50 shrink-0">
                      {c.imagenUrl
                        ? <img src={c.imagenUrl} alt={c.nombre} className="w-full h-full object-cover"/>
                        : <div className="w-full h-full flex items-center justify-center bg-[#2FAF8F]/06">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2FAF8F" strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round"><ellipse cx="12" cy="13" rx="7" ry="5"/></svg>
                          </div>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12.5px] font-semibold text-stone-800 dark:text-stone-100 leading-tight truncate">{c.nombre}</p>
                      <p className="text-[10.5px] text-stone-400 dark:text-stone-500">{c.raza} · {c.arete}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[18px] font-extrabold leading-none tabular-nums text-amber-500">{Math.round(c.score * 100)}%</p>
                    </div>
                    {candidatoSel?.id === c.id && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" className="shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {!confirmado ? (
              <div className="flex gap-2">
                <button onClick={onRechazar}
                  className="flex-1 h-9 rounded-[8px] border border-stone-200 dark:border-stone-700/60 bg-white dark:bg-[#1c1917] text-[12.5px] text-stone-500 dark:text-stone-400 cursor-pointer hover:text-stone-700 transition-colors">
                  Ninguno de estos
                </button>
                {candidatoSel && (
                  <button onClick={() => handleConfirmar(candidatoSel)}
                    className="flex-1 h-9 bg-amber-500 hover:bg-amber-600 text-white text-[12.5px] font-semibold rounded-[8px] border-0 cursor-pointer transition-colors active:scale-[0.98]">
                    Confirmar — {candidatoSel.nombre}
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 h-9 bg-[#2FAF8F]/08 rounded-[8px] border border-[#2FAF8F]/20">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2FAF8F" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                <span className="text-[12.5px] text-[#2FAF8F] font-semibold">Confirmado como {candidatoSel?.nombre}</span>
              </div>
            )}
          </>
        )}

        {/* ═══ NUEVO ANIMAL ══════════════════════════════════════════════ */}
        {resultado.tipo === 'nuevo' && (
          <>
            {/* Captura + metadata pre-llenada */}
            <div className="flex items-start gap-3">
              <div className="w-20 h-20 rounded-[8px] overflow-hidden bg-stone-100 dark:bg-stone-800/50 border-2 border-violet-200 dark:border-violet-800/30 shrink-0">
                {resultado.captura
                  ? <img src={resultado.captura} alt="Morro capturado" className="w-full h-full object-cover"/>
                  : <div className="w-full h-full flex items-center justify-center text-stone-300 dark:text-stone-600">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><ellipse cx="12" cy="13" rx="7" ry="5"/></svg>
                    </div>
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13.5px] font-semibold text-stone-700 dark:text-stone-300 leading-tight">Animal no registrado</p>
                <p className="text-[11.5px] text-stone-400 dark:text-stone-500 mt-0.5 leading-relaxed">
                  No hay coincidencias en la base. La imagen queda adjunta al registro.
                </p>
                {/* Metadata pre-llenada */}
                <div className="mt-2 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    <span className="text-[10.5px] text-stone-400 dark:text-stone-500 font-mono">{tsLabel}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span className="text-[10.5px] text-stone-400 dark:text-stone-500 font-mono">{gpsLabel}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
                    <span className="text-[10.5px] text-stone-400 dark:text-stone-500 font-mono">
                      {resultado.modo === 'direct' ? 'Cámara directa' : 'Hoja inteligente'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {onNueva && (
                <button onClick={onNueva}
                  className="flex-1 h-9 rounded-[8px] border border-stone-200 dark:border-stone-700/60 bg-white dark:bg-[#1c1917] text-[12.5px] text-stone-500 dark:text-stone-400 cursor-pointer hover:text-stone-700 transition-colors">
                  Nueva captura
                </button>
              )}
              {onRegistrar && (
                <button onClick={onRegistrar}
                  className="flex-1 h-9 bg-violet-500 hover:bg-violet-600 text-white text-[12.5px] font-semibold rounded-[8px] border-0 cursor-pointer transition-colors flex items-center justify-center gap-2 active:scale-[0.98]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Registrar animal
                </button>
              )}
            </div>
          </>
        )}

      </div>

      {/* ── Footer ── */}
      {onNueva && resultado.tipo !== 'procesando' && resultado.tipo !== 'nuevo' && (
        <div className="px-4 py-2.5 border-t border-stone-100 dark:border-stone-800/40 flex justify-end">
          <button onClick={onNueva} className="text-[11.5px] text-stone-400 dark:text-stone-500 hover:text-[#2FAF8F] transition-colors cursor-pointer">
            Nueva captura →
          </button>
        </div>
      )}
    </div>
  )
}