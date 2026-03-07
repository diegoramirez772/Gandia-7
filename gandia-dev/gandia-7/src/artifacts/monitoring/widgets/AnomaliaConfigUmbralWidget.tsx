/**
 * AnomaliaConfigUmbralWidget — Widget: anomalia:config-umbral
 */
import { useState } from 'react'

interface Umbral {
  id:        string
  label:     string
  desc:      string
  valor:     string
  severidad: 'alta' | 'media'
  activo:    boolean
}

const UMBRALES_DEFAULT: Umbral[] = [
  { id: 'separacion',  label: 'Separación del hato',      desc: 'Animal a más de X metros del grupo',     valor: '15 m',   severidad: 'alta',  activo: true },
  { id: 'postura',     label: 'Postura caída',             desc: 'Animal sin movimiento detectado por',    valor: '20 min', severidad: 'alta',  activo: true },
  { id: 'ingesta',     label: 'Sin ingesta',               desc: 'Sin acercarse al comedero en más de',    valor: '4 hrs',  severidad: 'media', activo: true },
  { id: 'temperatura', label: 'Temperatura corporal alta', desc: 'Temperatura estimada por sensor mayor a', valor: '39.5°C',severidad: 'media', activo: true },
]

interface Props {
  onGuardar?: (umbrales: Umbral[]) => void
}

export default function AnomaliaConfigUmbralWidget({ onGuardar }: Props) {
  const [umbrales, setUmbrales] = useState(UMBRALES_DEFAULT)
  const [editando, setEditando] = useState<string | null>(null)
  const [saved, setSaved]       = useState(false)

  const toggle = (id: string) => setUmbrales(u => u.map(um => um.id === id ? { ...um, activo: !um.activo } : um))
  const update = (id: string, valor: string) => setUmbrales(u => u.map(um => um.id === id ? { ...um, valor } : um))
  const save   = () => { setSaved(true); setTimeout(() => { onGuardar?.(umbrales); setSaved(false) }, 1000) }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white dark:bg-[#1c1917] border border-stone-200/70 dark:border-stone-800/60 rounded-[18px] overflow-hidden flex-1 flex flex-col">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-stone-100 dark:border-stone-800/40 flex items-center justify-between shrink-0">
          <div>
            <p className="text-[13px] font-semibold text-stone-700 dark:text-stone-200">Umbrales de alerta</p>
            <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-0.5">La IA dispara alertas cuando se superan estos valores</p>
          </div>
          <button onClick={save} className={`px-4 py-1.5 rounded-[9px] border-0 text-white text-[11px] font-semibold cursor-pointer transition-colors ${saved ? 'bg-[#2FAF8F]' : 'bg-[#2FAF8F] hover:bg-[#27a07f]'}`}>
            {saved ? '✓ Guardado' : 'Guardar'}
          </button>
        </div>

        {/* Lista */}
        <div className="flex-1 overflow-y-auto">
          {umbrales.map((u, i) => (
            <div key={u.id} className={`px-5 py-4 flex items-center gap-3.5 transition-opacity ${i < umbrales.length - 1 ? 'border-b border-stone-100 dark:border-stone-800/40' : ''} ${u.activo ? 'opacity-100' : 'opacity-45'}`}>
              <span className={`w-2 h-2 rounded-full shrink-0 ${u.severidad === 'alta' ? 'bg-red-400' : 'bg-[#2FAF8F]'}`} />
              <div className="flex-1">
                <p className="text-[12px] font-semibold text-stone-700 dark:text-stone-200">{u.label}</p>
                <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-0.5">{u.desc}</p>
              </div>

              {editando === u.id ? (
                <input
                  defaultValue={u.valor}
                  autoFocus
                  onChange={e => update(u.id, e.target.value)}
                  onBlur={() => setEditando(null)}
                  onKeyDown={e => e.key === 'Enter' && setEditando(null)}
                  className="w-[90px] px-2 py-1 rounded-[7px] border border-[#2FAF8F]/40 bg-[#2FAF8F]/08 dark:bg-[#2FAF8F]/15 text-[12px] font-bold text-[#2FAF8F] outline-none text-center"
                />
              ) : (
                <div onClick={() => setEditando(u.id)} className="bg-stone-50 dark:bg-[#141210] border border-stone-200/70 dark:border-stone-800/60 rounded-[8px] px-3 py-1 text-[12px] font-bold text-stone-700 dark:text-stone-200 min-w-[72px] text-center cursor-pointer hover:border-[#2FAF8F]/40 transition-colors">
                  {u.valor}
                </div>
              )}

              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-[0.04em] shrink-0 ${u.severidad === 'alta' ? 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/40' : 'bg-[#2FAF8F]/10 dark:bg-[#2FAF8F]/20 text-[#2FAF8F] border-[#2FAF8F]/30'}`}>
                {u.severidad}
              </span>

              <button onClick={() => toggle(u.id)} className={`w-[38px] h-5 rounded-full relative cursor-pointer border-0 transition-colors shrink-0 ${u.activo ? 'bg-[#2FAF8F]' : 'bg-stone-200 dark:bg-stone-700'}`}>
                <span className="absolute top-[2px] w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200" style={{ left: u.activo ? '18px' : '2px' }} />
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-stone-100 dark:border-stone-800/40 bg-[#2FAF8F]/05 dark:bg-[#2FAF8F]/08 shrink-0">
          <p className="text-[11px] text-[#2FAF8F]">⚠️ Cambios en umbrales afectan la sensibilidad del sistema. Ajustar con criterio veterinario.</p>
        </div>
      </div>
    </div>
  )
}