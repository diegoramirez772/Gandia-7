/**
 * CamaraConfigWidget — Widget: camara:config
 */
import { useState } from 'react'
import type { Camara } from './CamaraListaWidget'
import type { Corral } from './MapaVistaGeneralWidget'

interface Props {
  camara:      Camara
  corrales:    Corral[]
  onGuardar?:  (cam: Camara) => void
  onEliminar?: (id: number) => void
  onCancelar?: () => void
}

export default function CamaraConfigWidget({ camara, corrales, onGuardar, onEliminar, onCancelar }: Props) {
  const [form, setForm]     = useState({ ...camara })
  const [alertas, setAlertas] = useState(true)
  const [saved, setSaved]   = useState(false)
  const [confirm, setConfirm] = useState(false)

  const save = () => { setSaved(true); setTimeout(() => { onGuardar?.(form); setSaved(false) }, 1000) }

  const inputCls = "w-full px-3 py-2 rounded-[10px] border border-stone-200/70 dark:border-stone-800/60 bg-stone-50 dark:bg-[#141210] text-[13px] text-stone-700 dark:text-stone-200 outline-none focus:border-[#2FAF8F]/60 transition-colors"
  const labelCls = "text-[11px] font-semibold text-stone-500 dark:text-stone-400 mb-1.5 block"

  return (
    <div className="bg-white dark:bg-[#1c1917] border border-stone-200/70 dark:border-stone-800/60 rounded-[18px] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-stone-100 dark:border-stone-800/40 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[9px] bg-stone-50 dark:bg-[#141210] border border-stone-200/70 dark:border-stone-800/60 flex items-center justify-center">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" className="text-stone-400 dark:text-stone-500">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </div>
          <div>
            <p className="text-[13px] font-bold text-stone-700 dark:text-stone-200">Configurar {camara.label}</p>
            <p className="text-[11px] text-stone-400 dark:text-stone-500">Corral {camara.corral} · {camara.fps > 0 ? `${camara.fps} fps` : 'Sin señal'}</p>
          </div>
        </div>
        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-[0.04em] ${camara.estado === 'online' ? 'bg-[#2FAF8F]/10 text-[#2FAF8F] border-[#2FAF8F]/30' : 'bg-red-50 dark:bg-red-950/30 text-red-500 border-red-200 dark:border-red-800/40'}`}>
          {camara.estado}
        </span>
      </div>

      {/* Form */}
      <div className="px-5 py-5 flex flex-col gap-3.5">
        <div className="grid grid-cols-2 gap-3.5">
          <div>
            <label className={labelCls}>Nombre</label>
            <input value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Corral asignado</label>
            <select value={form.corral} onChange={e => setForm(f => ({ ...f, corral: e.target.value }))} className={inputCls + ' cursor-pointer'}>
              {corrales.map(c => <option key={c.id} value={c.label}>{c.label}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className={labelCls}>FPS de análisis</label>
          <div className="flex gap-2">
            {[12,18,24,30].map(fps => (
              <button key={fps} onClick={() => setForm(f => ({ ...f, fps }))} className={`flex-1 py-1.5 rounded-[9px] border text-[12px] cursor-pointer transition-all ${form.fps === fps ? 'border-[#2FAF8F]/50 bg-[#2FAF8F]/08 dark:bg-[#2FAF8F]/15 text-[#2FAF8F] font-bold' : 'border-stone-200/70 dark:border-stone-800/60 bg-white dark:bg-[#1c1917] text-stone-500 dark:text-stone-400'}`}>
                {fps}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between px-3.5 py-3 bg-stone-50 dark:bg-[#141210] rounded-[12px]">
          <div>
            <p className="text-[12px] font-semibold text-stone-700 dark:text-stone-200">Detección de anomalías</p>
            <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-0.5">Alertas automáticas por comportamiento</p>
          </div>
          <button onClick={() => setAlertas(a => !a)} className={`w-11 h-6 rounded-full relative border-0 cursor-pointer transition-colors shrink-0 ${alertas ? 'bg-[#2FAF8F]' : 'bg-stone-200 dark:bg-stone-700'}`}>
            <span className="absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white shadow-md transition-all duration-200" style={{ left: alertas ? '22px' : '3px' }} />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-stone-100 dark:border-stone-800/40 flex items-center justify-between">
        {!confirm ? (
          <button onClick={() => setConfirm(true)} className="px-3 py-1.5 rounded-[8px] border border-red-200 dark:border-red-800/40 bg-white dark:bg-[#1c1917] text-[11px] text-red-600 dark:text-red-400 cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
            Eliminar cámara
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-red-500">¿Confirmar?</span>
            <button onClick={() => { onEliminar?.(camara.id); setConfirm(false) }} className="px-2.5 py-1 rounded-[7px] bg-red-500 text-white text-[11px] border-0 cursor-pointer">Sí, eliminar</button>
            <button onClick={() => setConfirm(false)} className="px-2.5 py-1 rounded-[7px] border border-stone-200/70 dark:border-stone-800/60 bg-white dark:bg-[#1c1917] text-[11px] text-stone-500 dark:text-stone-400 cursor-pointer">No</button>
          </div>
        )}
        <div className="flex gap-2">
          {onCancelar && (
            <button onClick={onCancelar} className="px-3.5 py-1.5 rounded-[9px] border border-stone-200/70 dark:border-stone-800/60 bg-white dark:bg-[#1c1917] text-[11px] text-stone-400 dark:text-stone-500 cursor-pointer hover:text-stone-600 dark:hover:text-stone-300 transition-colors">Cancelar</button>
          )}
          <button onClick={save} className={`px-4 py-1.5 rounded-[9px] border-0 text-white text-[11px] font-semibold cursor-pointer transition-colors ${saved ? 'bg-[#2FAF8F]' : 'bg-[#2FAF8F] hover:bg-[#27a07f]'}`}>
            {saved ? '✓ Guardado' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  )
}