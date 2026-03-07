/**
 * ConfigCorralesWidget — Widget: config:corrales
 */
import { useState } from 'react'
import type { Corral } from './MapaVistaGeneralWidget'

interface Props {
  corrales:     Corral[]
  onEditar?:    (c: Corral) => void
  onBaja?:      (id: number) => void
  onNuevaZona?: () => void
}

const ESTADO = {
  normal:     { dot: 'bg-[#2FAF8F]', bg: 'bg-[#2FAF8F]/10 dark:bg-[#2FAF8F]/20', border: 'border-[#2FAF8F]/30', txt: 'text-[#2FAF8F]' },
  atencion:   { dot: 'bg-amber-400',  bg: 'bg-amber-50 dark:bg-amber-950/30',      border: 'border-amber-200 dark:border-amber-800/40', txt: 'text-amber-600 dark:text-amber-400' },
  cuarentena: { dot: 'bg-red-400',    bg: 'bg-red-50 dark:bg-red-950/30',          border: 'border-red-200 dark:border-red-800/40',   txt: 'text-red-600 dark:text-red-400' },
}

export default function ConfigCorralesWidget({ corrales, onEditar, onBaja, onNuevaZona }: Props) {
  const [confirmBaja, setConfirmBaja] = useState<number | null>(null)

  return (
    <div className="bg-white dark:bg-[#1c1917] border border-stone-200/70 dark:border-stone-800/60 rounded-[18px] overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-stone-100 dark:border-stone-800/40 flex items-center justify-between shrink-0">
        <div>
          <p className="text-[13px] font-semibold text-stone-700 dark:text-stone-200">Zonas y corrales</p>
          <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-0.5">{corrales.length} corrales registrados</p>
        </div>
        <button onClick={onNuevaZona} className="flex items-center gap-1 px-3.5 py-1.5 rounded-[9px] bg-[#2FAF8F] hover:bg-[#27a07f] text-white text-[11px] font-semibold border-0 cursor-pointer transition-colors">
          <span className="text-base leading-none">+</span> Nueva zona
        </button>
      </div>

      {/* Lista */}
      <div className="flex-1 overflow-y-auto">
        {corrales.map((c, i) => {
          const col = ESTADO[c.estado]
          const pct = Math.round(c.animales / c.capacidad * 100)
          return (
            <div key={c.id} className={`px-5 py-3.5 flex items-center gap-3.5 ${i < corrales.length - 1 ? 'border-b border-stone-100 dark:border-stone-800/40' : ''}`}>
              <div className={`w-[38px] h-[38px] rounded-[10px] shrink-0 flex items-center justify-center ${col.bg} border ${col.border}`}>
                <span className={`text-[11px] font-extrabold ${col.txt}`}>{c.label}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-[12px] font-bold text-stone-700 dark:text-stone-200">Corral {c.label}</p>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-[5px] border uppercase tracking-[0.04em] ${col.bg} ${col.txt} ${col.border}`}>{c.estado}</span>
                </div>
                <p className="text-[11px] text-stone-400 dark:text-stone-500">Cap. {c.capacidad} · {c.camara ? '● Cámara activa' : 'Sin cámara'}</p>
                <div className="mt-1.5 h-[3px] w-24 sm:w-32 bg-stone-100 dark:bg-stone-800/50 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${col.dot}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[20px] font-bold text-stone-700 dark:text-stone-200 leading-none">{c.animales}</p>
                <p className="text-[10px] text-stone-300 dark:text-stone-600 mt-0.5">animales</p>
              </div>
              <div className="flex gap-1.5 shrink-0">
                {confirmBaja === c.id ? (
                  <>
                    <button onClick={() => { onBaja?.(c.id); setConfirmBaja(null) }} className="px-2.5 py-1 rounded-[7px] bg-red-500 text-white text-[11px] border-0 cursor-pointer">Confirmar</button>
                    <button onClick={() => setConfirmBaja(null)} className="px-2.5 py-1 rounded-[7px] border border-stone-200/70 dark:border-stone-800/60 bg-white dark:bg-[#1c1917] text-[11px] text-stone-500 dark:text-stone-400 cursor-pointer">No</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => onEditar?.(c)} className="px-3 py-1 rounded-[7px] border border-stone-200/70 dark:border-stone-800/60 bg-white dark:bg-[#1c1917] text-[11px] text-stone-500 dark:text-stone-400 cursor-pointer hover:border-[#2FAF8F]/40 hover:text-[#2FAF8F] transition-all">Editar</button>
                    <button onClick={() => setConfirmBaja(c.id)} className="px-3 py-1 rounded-[7px] border border-red-200 dark:border-red-800/40 bg-red-50 dark:bg-red-950/20 text-[11px] text-red-500 cursor-pointer hover:bg-red-100 dark:hover:bg-red-950/40 transition-colors">Baja</button>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}