/**
 * FichaHuellaWidget — Widget: passport:biometria
 * ARCHIVO → src/artifacts/passport/widgets/FichaHuellaWidget.tsx
 *
 * Puente entre Ficha Ganadera y Biometría (NosePrint Bovino).
 * Muestra el estatus de la huella de morro vinculada a la ficha del animal.
 * No duplica lógica de captura — delega a BiometriaCapturaWidget.
 * UX: estado muy claro, acción primaria grande (campo).
 */
import { useState } from 'react'

export type HuellaEstatus = 'capturada' | 'pendiente' | 'sin-registrar' | 'verificando'

export interface HuellaData {
  estatus:     HuellaEstatus
  score?:      number          // 0-1 · confianza del último match
  fechaCaptura?: string
  modo?:       'direct' | 'sheet'
  capturas?:   number          // total capturas históricas
  animalId?:   string
  animalNombre?: string
  animalArete?:  string
}

interface Props {
  data?:          HuellaData
  onCapturar?:    () => void   // abre BiometriaCapturaWidget
  onVerHistorial?: () => void  // abre BiometriaHistorialWidget
  compact?:       boolean
}

const MOCK_HUELLA: HuellaData = {
  estatus:       'pendiente',
  score:         0.83,
  fechaCaptura:  '10 Feb 2025',
  modo:          'direct',
  capturas:      3,
  animalNombre:  'Canela',
  animalArete:   '#0089',
}

const STATUS_CONFIG: Record<HuellaEstatus, {
  color: string
  bg: string
  border: string
  label: string
  desc: string
  icon: React.FC<{ color: string }>
}> = {
  capturada: {
    color: '#2FAF8F',
    bg:    'bg-[#2FAF8F]/08 dark:bg-[#2FAF8F]/12',
    border:'border-[#2FAF8F]/25',
    label: 'Huella registrada',
    desc:  'Biometría de morro vinculada y activa',
    icon: ({ color }) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M3 9V6a1 1 0 0 1 1-1h3"/><path d="M21 9V6a1 1 0 0 0-1-1h-3"/>
        <path d="M3 15v3a1 1 0 0 0 1 1h3"/><path d="M21 15v3a1 1 0 0 1-1 1h-3"/>
        <polyline stroke={color} strokeWidth="2" points="8 12 11 15 16 9"/>
      </svg>
    ),
  },
  pendiente: {
    color: '#f59e0b',
    bg:    'bg-amber-50 dark:bg-amber-950/20',
    border:'border-amber-200 dark:border-amber-800/35',
    label: 'Verificación pendiente',
    desc:  'Captura realizada con score bajo — requiere confirmación',
    icon: ({ color }) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M3 9V6a1 1 0 0 1 1-1h3"/><path d="M21 9V6a1 1 0 0 0-1-1h-3"/>
        <path d="M3 15v3a1 1 0 0 0 1 1h3"/><path d="M21 15v3a1 1 0 0 1-1 1h-3"/>
      </svg>
    ),
  },
  'sin-registrar': {
    color: '#a8a29e',
    bg:    'bg-stone-50 dark:bg-[#141210]',
    border:'border-stone-200/70 dark:border-stone-800/60',
    label: 'Sin huella de morro',
    desc:  'Este animal aún no tiene biometría capturada',
    icon: ({ color }) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="3" strokeDasharray="3 2"/>
        <path d="M3 9V6a1 1 0 0 1 1-1h3" strokeOpacity="0.5"/>
        <path d="M21 9V6a1 1 0 0 0-1-1h-3" strokeOpacity="0.5"/>
        <path d="M3 15v3a1 1 0 0 0 1 1h3" strokeOpacity="0.5"/>
        <path d="M21 15v3a1 1 0 0 1-1 1h-3" strokeOpacity="0.5"/>
      </svg>
    ),
  },
  verificando: {
    color: '#6366f1',
    bg:    'bg-indigo-50 dark:bg-indigo-950/20',
    border:'border-indigo-200 dark:border-indigo-800/35',
    label: 'Verificando…',
    desc:  'Procesando captura en el motor biométrico',
    icon: ({ color }) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
      </svg>
    ),
  },
}

export default function FichaHuellaWidget({
  data = MOCK_HUELLA,
  onCapturar,
  onVerHistorial,
  compact = false,
}: Props) {
  const [showScore, setShowScore] = useState(false)
  const cfg = STATUS_CONFIG[data.estatus]
  const Icon = cfg.icon
  const scoreLabel = data.score ? `${Math.round(data.score * 100)}%` : null

  return (
    <div className="flex flex-col gap-3">

      {/* ── Tarjeta estado ── */}
      <div className={`rounded-[14px] border px-4 py-4 ${cfg.bg} ${cfg.border}`}>
        <div className="flex items-start gap-3.5">
          <div className={`w-11 h-11 rounded-[10px] flex items-center justify-center shrink-0 border ${cfg.border} ${cfg.bg}`}>
            <Icon color={cfg.color} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-[14px] font-bold leading-tight" style={{ color: cfg.color }}>
                {cfg.label}
              </p>
              {data.estatus === 'verificando' && (
                <svg className="w-3.5 h-3.5 animate-spin" style={{ color: cfg.color }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
              )}
            </div>
            <p className="text-[12px] text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">{cfg.desc}</p>

            {/* Meta: score, fecha, modo */}
            {(data.fechaCaptura || data.score) && (
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                {data.fechaCaptura && (
                  <span className="flex items-center gap-1.5 text-[11px] text-stone-400 dark:text-stone-500">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                    {data.fechaCaptura}
                  </span>
                )}
                {data.modo && (
                  <span className="text-[10.5px] text-stone-400 dark:text-stone-500 font-mono">
                    {data.modo === 'direct' ? 'Cámara directa' : 'Hoja inteligente'}
                  </span>
                )}
                {scoreLabel && (
                  <button
                    onClick={() => setShowScore(s => !s)}
                    className="flex items-center gap-1 cursor-pointer border-0 bg-transparent p-0 text-left"
                  >
                    <span className="text-[11px] font-bold tabular-nums" style={{ color: cfg.color }}>{scoreLabel}</span>
                    <span className="text-[10px] text-stone-400 dark:text-stone-500">confianza</span>
                  </button>
                )}
                {data.capturas && data.capturas > 1 && (
                  <span className="text-[10.5px] text-stone-300 dark:text-stone-600">{data.capturas} capturas</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Score barra expandible */}
        {showScore && data.score && (
          <div className="mt-3.5 pt-3.5 border-t border-stone-200/60 dark:border-stone-700/40">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] text-stone-400 dark:text-stone-500">Score de confianza</span>
              <span className="text-[12px] font-bold tabular-nums" style={{ color: cfg.color }}>
                {Math.round(data.score * 100)}%
              </span>
            </div>
            <div className="h-2 bg-white/60 dark:bg-black/20 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${data.score * 100}%`, background: cfg.color }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[9.5px] text-stone-400 dark:text-stone-500">0%</span>
              <span className="text-[9.5px] text-stone-400 dark:text-stone-500">Umbral 90%</span>
              <span className="text-[9.5px] text-stone-400 dark:text-stone-500">100%</span>
            </div>
          </div>
        )}
      </div>

      {/* ── Animal context ── */}
      {(data.animalNombre || data.animalArete) && !compact && (
        <div className="flex items-center gap-3 px-3.5 py-3 bg-white dark:bg-[#1c1917] border border-stone-200/70 dark:border-stone-800/60 rounded-[10px]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a8a29e" strokeWidth="1.75" strokeLinecap="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
          <p className="text-[12px] text-stone-500 dark:text-stone-400">
            {data.animalNombre && <span className="font-semibold text-stone-700 dark:text-stone-200">{data.animalNombre}</span>}
            {data.animalArete && <span className="font-mono ml-1.5">{data.animalArete}</span>}
          </p>
        </div>
      )}

      {/* ── Acciones ── */}
      <div className="flex flex-col gap-2">
        {/* CTA principal */}
        <button
          onClick={onCapturar}
          className={`w-full h-12 flex items-center justify-center gap-2.5 rounded-[11px] text-[13.5px] font-semibold transition-all active:scale-[0.98] cursor-pointer border-0 ${
            data.estatus === 'capturada'
              ? 'bg-stone-100 dark:bg-stone-800/60 text-stone-500 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800/80'
              : 'bg-[#2FAF8F] hover:bg-[#27a07f] text-white shadow-[0_2px_12px_rgba(47,175,143,0.25)]'
          }`}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M3 9V6a1 1 0 0 1 1-1h3"/><path d="M21 9V6a1 1 0 0 0-1-1h-3"/>
            <path d="M3 15v3a1 1 0 0 0 1 1h3"/><path d="M21 15v3a1 1 0 0 1-1 1h-3"/>
          </svg>
          {data.estatus === 'capturada'    ? 'Volver a capturar' :
           data.estatus === 'pendiente'    ? 'Nueva captura' :
           data.estatus === 'verificando' ? 'Procesando…' :
           'Capturar huella de morro'}
        </button>

        {/* Historial link */}
        {onVerHistorial && data.capturas && data.capturas > 0 && (
          <button
            onClick={onVerHistorial}
            className="w-full h-10 flex items-center justify-center gap-2 rounded-[10px] border border-stone-200/70 dark:border-stone-800/60 bg-white dark:bg-[#1c1917] text-[12.5px] text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:border-stone-300 dark:hover:border-stone-600 transition-all cursor-pointer"
          >
            Ver historial de capturas
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
        )}
      </div>

      {/* Aviso campo */}
      {data.estatus === 'sin-registrar' && (
        <div className="px-3.5 py-2.5 bg-stone-50 dark:bg-[#141210] border border-stone-100 dark:border-stone-800/40 rounded-[8px]">
          <p className="text-[11.5px] text-stone-400 dark:text-stone-500 leading-relaxed">
            La huella de morro es única para cada animal, como una huella digital. Funciona sin internet y en el campo.
          </p>
        </div>
      )}
    </div>
  )
}