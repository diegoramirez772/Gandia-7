/**
 * SensorCalibracionWidget — Widget: sensor:calibracion
 */
import { useState } from 'react'

interface Parametro {
  id:       string
  label:    string
  desc:     string
  valor:    string
  tag?:     string
  tagType?: 'ok' | 'warn' | 'error'
}

const PARAMS: Parametro[] = [
  { id: 'sensibilidad', label: 'Sensibilidad de detección',   desc: 'Qué tan agresivo es el modelo al detectar animales', valor: 'Alta',       tag: 'Recomendado', tagType: 'ok'    },
  { id: 'fps',          label: 'FPS mínimo de procesamiento', desc: 'Frames por segundo mínimos para análisis',           valor: '18 fps'                                      },
  { id: 'confianza',    label: 'Confianza mínima',            desc: 'Score mínimo del modelo para contar una detección',  valor: '0.72'                                        },
  { id: 'nocturno',     label: 'Modo nocturno',               desc: 'Activar modelo alternativo con visión infrarroja',   valor: 'Automático', tag: 'Activo',     tagType: 'ok'    },
  { id: 'cobertura',    label: 'Cobertura C-06',              desc: 'CAM-06 offline · Corral sin cobertura visual activa',valor: 'Sin señal', tag: 'Revisar',    tagType: 'error' },
]

const TAG_CLS = {
  ok:    'bg-[#2FAF8F]/10 dark:bg-[#2FAF8F]/20 text-[#2FAF8F] border-[#2FAF8F]/30',
  warn:  'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/40',
  error: 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/40',
}

interface Props {
  onRecalibrar?: () => void
}

export default function SensorCalibracionWidget({ onRecalibrar }: Props) {
  const [recalibrando, setRecalibrando] = useState(false)
  const [editando, setEditando]         = useState<string | null>(null)

  const handleRecalibrar = () => {
    setRecalibrando(true)
    setTimeout(() => { setRecalibrando(false); onRecalibrar?.() }, 2000)
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Estado modelo */}
      <div className={`rounded-[14px] px-4 py-3.5 flex items-center gap-3 transition-all ${recalibrando ? 'bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40' : 'bg-[#2FAF8F]/08 dark:bg-[#2FAF8F]/12 border border-[#2FAF8F]/30'}`}>
        <span className="text-xl">{recalibrando ? '⚙️' : '🤖'}</span>
        <div className="flex-1">
          <p className={`text-[12px] font-bold ${recalibrando ? 'text-amber-600 dark:text-amber-400' : 'text-[#2FAF8F]'}`}>
            {recalibrando ? 'Recalibrando modelo...' : 'AI Perception v7.4 · Activo'}
          </p>
          <p className={`text-[11px] mt-0.5 ${recalibrando ? 'text-amber-500/80' : 'text-[#2FAF8F]/70'}`}>
            {recalibrando ? 'Esto puede tardar unos segundos' : 'Precisión actual: 98.2% · Última calibración: 3 días'}
          </p>
        </div>
        {!recalibrando && (
          <button onClick={handleRecalibrar} className="px-4 py-1.5 rounded-[9px] bg-[#2FAF8F] hover:bg-[#27a07f] text-white text-[11px] font-semibold border-0 cursor-pointer transition-colors shrink-0">
            Recalibrar
          </button>
        )}
        {recalibrando && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-amber-500 animate-spin shrink-0">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
        )}
      </div>

      {/* Parámetros */}
      <div className="flex-1 bg-white dark:bg-[#1c1917] border border-stone-200/70 dark:border-stone-800/60 rounded-[18px] overflow-hidden flex flex-col">
        <div className="px-5 py-3.5 border-b border-stone-100 dark:border-stone-800/40 shrink-0">
          <p className="text-[13px] font-semibold text-stone-700 dark:text-stone-200">Parámetros del modelo</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {PARAMS.map((p, i) => (
            <div key={p.id} className={`px-5 py-3.5 flex items-center gap-3.5 ${i < PARAMS.length - 1 ? 'border-b border-stone-100 dark:border-stone-800/40' : ''}`}>
              <div className="flex-1">
                <p className="text-[12px] font-semibold text-stone-700 dark:text-stone-200">{p.label}</p>
                <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-0.5">{p.desc}</p>
              </div>
              {editando === p.id ? (
                <input
                  defaultValue={p.valor}
                  autoFocus
                  onBlur={() => setEditando(null)}
                  onKeyDown={e => e.key === 'Enter' && setEditando(null)}
                  className="w-[100px] px-2 py-1 rounded-[7px] border border-[#2FAF8F]/40 bg-[#2FAF8F]/08 dark:bg-[#2FAF8F]/15 text-[12px] font-bold text-[#2FAF8F] outline-none"
                />
              ) : (
                <span className="text-[12px] font-bold text-stone-700 dark:text-stone-200 min-w-[80px] text-right">{p.valor}</span>
              )}
              {p.tag && p.tagType && (
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-[0.04em] shrink-0 ${TAG_CLS[p.tagType]}`}>{p.tag}</span>
              )}
              <button
                onClick={() => setEditando(editando === p.id ? null : p.id)}
                className={`px-2.5 py-1 rounded-[7px] border text-[11px] cursor-pointer shrink-0 transition-colors ${editando === p.id ? 'border-[#2FAF8F]/40 bg-[#2FAF8F]/08 text-[#2FAF8F]' : 'border-stone-200/70 dark:border-stone-800/60 bg-white dark:bg-[#1c1917] text-stone-500 dark:text-stone-400 hover:border-[#2FAF8F]/40'}`}
              >
                {editando === p.id ? 'Listo' : 'Editar'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}