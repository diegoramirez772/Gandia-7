/**
 * CamaraAgregarWidget — Widget: camara:agregar
 */
import { useState } from 'react'
import type { Corral } from './MapaVistaGeneralWidget'

export interface NuevaCamara { label: string; corral: string; url: string; fps: number; alertas: boolean }

interface Props {
  corrales:   Corral[]
  onGuardar?: (data: NuevaCamara) => void
  onCancelar?:() => void
}

const FPS_OPTIONS = [12, 18, 24, 30]

export default function CamaraAgregarWidget({ corrales, onGuardar, onCancelar }: Props) {
  const [form, setForm] = useState<NuevaCamara>({ label: '', corral: '', url: '', fps: 24, alertas: true })
  const [saved, setSaved] = useState(false)
  const valid = form.label.trim() && form.corral && form.url.trim()

  const handleGuardar = () => {
    if (!valid) return
    setSaved(true)
    setTimeout(() => { onGuardar?.(form); setSaved(false) }, 1200)
  }

  const inputCls = "w-full px-3 py-2 rounded-[10px] border border-stone-200/70 dark:border-stone-800/60 bg-stone-50 dark:bg-[#141210] text-[13px] text-stone-700 dark:text-stone-200 outline-none focus:border-[#2FAF8F]/60 transition-colors"
  const labelCls = "text-[11px] font-semibold text-stone-500 dark:text-stone-400 mb-1.5 block tracking-[0.02em]"

  return (
    <div className="bg-white dark:bg-[#1c1917] border border-stone-200/70 dark:border-stone-800/60 rounded-[18px] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-stone-100 dark:border-stone-800/40 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[9px] bg-[#2FAF8F]/10 dark:bg-[#2FAF8F]/20 border border-[#2FAF8F]/30 flex items-center justify-center">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2FAF8F" strokeWidth="1.75" strokeLinecap="round">
              <path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/>
            </svg>
          </div>
          <div>
            <p className="text-[13px] font-bold text-stone-700 dark:text-stone-200">Nueva cámara</p>
            <p className="text-[11px] text-stone-400 dark:text-stone-500">Registrar en UPP Rancho Morales</p>
          </div>
        </div>
        {onCancelar && (
          <button onClick={onCancelar} className="px-3 py-1.5 rounded-[8px] border border-stone-200/70 dark:border-stone-800/60 bg-white dark:bg-[#1c1917] text-[11px] text-stone-400 dark:text-stone-500 cursor-pointer hover:text-stone-600 dark:hover:text-stone-300 transition-colors">
            Cancelar
          </button>
        )}
      </div>

      {/* Form */}
      <div className="px-5 py-5 flex flex-col gap-4">
        <div>
          <label className={labelCls}>Nombre de la cámara</label>
          <input value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} placeholder="Ej. CAM-07" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Corral asignado</label>
          <select value={form.corral} onChange={e => setForm(f => ({ ...f, corral: e.target.value }))} className={inputCls + ' cursor-pointer'}>
            <option value="">Seleccionar corral...</option>
            {corrales.map(c => <option key={c.id} value={c.label}>{c.label} — {c.animales} animales</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>URL o IP del stream</label>
          <input value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="rtsp://192.168.1.x:554/stream" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Frecuencia de análisis (FPS)</label>
          <div className="flex gap-2">
            {FPS_OPTIONS.map(fps => (
              <button key={fps} onClick={() => setForm(f => ({ ...f, fps }))} className={`flex-1 py-2 rounded-[9px] border text-[12px] cursor-pointer transition-all ${form.fps === fps ? 'border-[#2FAF8F]/50 bg-[#2FAF8F]/08 dark:bg-[#2FAF8F]/15 text-[#2FAF8F] font-bold' : 'border-stone-200/70 dark:border-stone-800/60 bg-white dark:bg-[#1c1917] text-stone-500 dark:text-stone-400'}`}>
                {fps}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between px-3.5 py-3 bg-stone-50 dark:bg-[#141210] rounded-[12px]">
          <div>
            <p className="text-[12px] font-semibold text-stone-700 dark:text-stone-200">Activar detección de anomalías</p>
            <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-0.5">La IA alertará sobre comportamientos inusuales</p>
          </div>
          <button onClick={() => setForm(f => ({ ...f, alertas: !f.alertas }))} className={`w-11 h-6 rounded-full relative border-0 cursor-pointer transition-colors shrink-0 ${form.alertas ? 'bg-[#2FAF8F]' : 'bg-stone-200 dark:bg-stone-700'}`}>
            <span className="absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white shadow-md transition-all duration-200" style={{ left: form.alertas ? '22px' : '3px' }} />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-stone-100 dark:border-stone-800/40 flex justify-end">
        <button onClick={handleGuardar} disabled={!valid || saved} className={`px-5 py-2 rounded-[10px] border-0 text-[12px] font-semibold transition-all ${valid && !saved ? 'bg-[#2FAF8F] hover:bg-[#27a07f] text-white cursor-pointer' : 'bg-stone-100 dark:bg-stone-800/50 text-stone-400 dark:text-stone-500 cursor-default'}`}>
          {saved ? '✓ Guardado' : 'Registrar cámara'}
        </button>
      </div>
    </div>
  )
}