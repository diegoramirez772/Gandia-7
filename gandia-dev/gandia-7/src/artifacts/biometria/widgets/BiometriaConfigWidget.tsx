/**
 * BiometriaConfigWidget — Widget: biometria:config
 * ARCHIVO → src/artifacts/biometria/widgets/BiometriaConfigWidget.tsx
 */
import { useState } from 'react'

interface Parametro {
  id:       string
  grupo:    string
  label:    string
  desc:     string
  valor:    string
  tag?:     string
  tagOk?:   boolean
}

const PARAMS_DEFAULT: Parametro[] = [
  { id: 'umbral_match',     grupo: 'Umbrales',    label: 'Umbral match',       desc: 'Score mínimo para identificación automática',        valor: '0.90', tag: 'Recomendado', tagOk: true  },
  { id: 'umbral_candidato', grupo: 'Umbrales',    label: 'Umbral candidato',   desc: 'Zona gris — requiere confirmación manual',           valor: '0.80'                                    },
  { id: 'umbral_nuevo',     grupo: 'Umbrales',    label: 'Umbral nuevo',       desc: 'Por debajo → registrar como animal nuevo',           valor: '0.70'                                    },
  { id: 'peso_cv',          grupo: 'Motor',       label: 'Peso Fingerprint',   desc: 'Porcentaje motor clásico en la fusión',              valor: '55%',  tag: 'Activo',     tagOk: true  },
  { id: 'peso_ia',          grupo: 'Motor',       label: 'Peso IA Embedding',  desc: 'Complementario al motor clásico (suma 100%)',        valor: '45%'                                     },
  { id: 'calidad_min',      grupo: 'Captura',     label: 'Calidad mínima',     desc: 'Imágenes por debajo se rechazan automáticamente',    valor: '65%',  tag: 'Revisar',    tagOk: false },
]

interface Props {
  onGuardar?: (params: Parametro[]) => void
}

export default function BiometriaConfigWidget({ onGuardar }: Props) {
  const [params,   setParams]   = useState(PARAMS_DEFAULT)
  const [editando, setEditando] = useState<string | null>(null)
  const [saved,    setSaved]    = useState(false)

  const update = (id: string, valor: string) =>
    setParams(p => p.map(pm => pm.id === id ? { ...pm, valor } : pm))

  const save = () => {
    setSaved(true)
    setTimeout(() => { onGuardar?.(params); setSaved(false) }, 1200)
  }

  const grupos = [...new Set(params.map(p => p.grupo))]

  return (
    <div className="flex flex-col gap-4">

      {/* ── Estado del motor ────────────────────────────────────────── */}
      <div className="bg-white dark:bg-[#1c1917] border border-stone-200/60 dark:border-stone-800/50 rounded-[12px] px-4 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2FAF8F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
          <div>
            <p className="text-[13px] font-semibold text-stone-800 dark:text-stone-100 leading-tight">Motor Biométrico v2.1</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2FAF8F] animate-pulse"/>
              <p className="text-[11.5px] text-stone-400 dark:text-stone-500">Fingerprint CV + ResNet50 · Fusión 55/45</p>
            </div>
          </div>
        </div>
        <button
          onClick={save}
          className={`h-9 px-5 rounded-[8px] border-0 text-white text-[12.5px] font-semibold cursor-pointer transition-all shrink-0 ${
            saved ? 'bg-stone-400' : 'bg-[#2FAF8F] hover:bg-[#27a07f] active:scale-[0.97]'
          }`}
        >
          {saved ? 'Guardado ✓' : 'Guardar cambios'}
        </button>
      </div>

      {/* ── Parámetros por grupo ─────────────────────────────────────── */}
      {grupos.map(grupo => (
        <div key={grupo} className="bg-white dark:bg-[#1c1917] border border-stone-200/60 dark:border-stone-800/50 rounded-[12px] overflow-hidden">
          {/* Header grupo */}
          <div className="px-4 py-3 border-b border-stone-100 dark:border-stone-800/40">
            <p className="text-[11px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-[0.07em]">{grupo}</p>
          </div>

          {/* Filas */}
          {params
            .filter(p => p.grupo === grupo)
            .map((p, i, arr) => (
              <div
                key={p.id}
                className={`flex items-center gap-4 px-4 py-3.5 ${i < arr.length - 1 ? 'border-b border-stone-100 dark:border-stone-800/40' : ''}`}
              >
                {/* Texto */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[13px] font-medium text-stone-700 dark:text-stone-200">{p.label}</p>
                    {p.tag && (
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-[5px] border ${
                        p.tagOk
                          ? 'bg-[#2FAF8F]/08 dark:bg-[#2FAF8F]/12 text-[#2FAF8F] border-[#2FAF8F]/25'
                          : 'bg-amber-50 dark:bg-amber-950/25 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/30'
                      }`}>
                        {p.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-[11.5px] text-stone-400 dark:text-stone-500 mt-0.5 leading-relaxed">{p.desc}</p>
                </div>

                {/* Valor editable */}
                {editando === p.id ? (
                  <input
                    defaultValue={p.valor}
                    autoFocus
                    onChange={e => update(p.id, e.target.value)}
                    onBlur={() => setEditando(null)}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === 'Escape') setEditando(null) }}
                    className="w-20 h-9 px-3 rounded-[8px] border border-[#2FAF8F]/40 bg-white dark:bg-[#1c1917] text-[13px] font-bold text-[#2FAF8F] outline-none text-center"
                  />
                ) : (
                  <button
                    onClick={() => setEditando(p.id)}
                    className="h-9 px-4 rounded-[8px] border border-stone-200 dark:border-stone-700/60 bg-stone-50 dark:bg-[#141210] text-[13px] font-bold text-stone-700 dark:text-stone-200 min-w-[72px] text-center cursor-pointer hover:border-[#2FAF8F]/40 hover:text-[#2FAF8F] transition-all"
                  >
                    {p.valor}
                  </button>
                )}
              </div>
            ))
          }
        </div>
      ))}

      {/* ── Aviso ───────────────────────────────────────────────────── */}
      <div className="px-3.5 py-3 bg-stone-50 dark:bg-[#141210] border border-stone-200/60 dark:border-stone-800/50 rounded-[10px]">
        <p className="text-[12px] text-stone-500 dark:text-stone-400 leading-relaxed">
          Los cambios en umbrales afectan la sensibilidad del motor. Ajustar con criterio técnico veterinario.
        </p>
      </div>
    </div>
  )
}