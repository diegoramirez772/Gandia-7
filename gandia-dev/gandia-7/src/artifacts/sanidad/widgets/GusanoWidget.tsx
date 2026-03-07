/**
 * GusanoWidget — Evaluación de riesgo epidemiológico por zona
 * Widget: sanidad:gusano
 */
import { useState, useEffect, useRef } from 'react'

const ZONAS = [
  { nombre: 'Durango Norte',  pct: 87, nivel: 'alta'  as const },
  { nombre: 'Durango Centro', pct: 54, nivel: 'media' as const },
  { nombre: 'Sinaloa Norte',  pct: 61, nivel: 'media' as const },
  { nombre: 'Durango Sur',    pct: 22, nivel: 'baja'  as const },
]

const NIVEL_COLOR = {
  alta:  '#ef4444',
  media: '#f59e0b',
  baja:  '#2FAF8F',
}

const NIVEL_TAG: Record<'alta' | 'media' | 'baja', string> = {
  alta:  'bg-red-50 dark:bg-red-950/40 text-red-600 border border-red-200 dark:border-red-900/50',
  media: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 border border-amber-200 dark:border-amber-900/50',
  baja:  'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border border-emerald-200 dark:border-emerald-900/50',
}

const SINTOMAS = [
  'Heridas con olor fétido o larvae visibles',
  'Animal que se rasca o sacude continuamente',
  'Separación del hato sin causa aparente',
  'Moscas agrupadas en zona del cuerpo',
]

const PROTOCOLO = [
  { n: '01', title: 'Aislamiento inmediato', desc: 'Mover a área de tratamiento y registrar en Gemelo Digital.' },
  { n: '02', title: 'Notificar al MVZ',      desc: 'De guardia y al supervisor UPP. Sin tratamiento sin diagnóstico.' },
  { n: '03', title: 'Reportar a SENASICA',   desc: 'Dentro de 24h. Activa el protocolo regional de vector.' },
  { n: '04', title: 'Revisión preventiva',   desc: 'Hato completo en 3 días. Atención especial a neonatos.' },
]

export default function GusanoWidget() {
  const [vis,    setVis]    = useState(false)
  const [barsIn, setBarsIn] = useState(false)
  const [sec2In, setSec2In] = useState(false)
  const [sec3In, setSec3In] = useState(false)
  const barsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const t0 = setTimeout(() => setVis(true),    80)
    const t1 = setTimeout(() => setBarsIn(true), 500)
    const t2 = setTimeout(() => setSec2In(true), 1100)
    const t3 = setTimeout(() => setSec3In(true), 1700)
    return () => [t0, t1, t2, t3].forEach(clearTimeout)
  }, [])

  useEffect(() => {
    if (!barsIn) return
    ZONAS.forEach((z, i) => {
      setTimeout(() => {
        const el = barsRef.current[i]
        if (el) el.style.width = `${z.pct}%`
      }, i * 120)
    })
  }, [barsIn])

  if (!vis) return null

  return (
    <div className="mt-3 w-full rounded-2xl overflow-hidden border border-red-200/60 dark:border-red-900/40 bg-white dark:bg-[#141210] animate-[fadeUp_.42s_cubic-bezier(.16,1,.3,1)_both]"
      style={{ animationName: 'fadeUp' }}
    >
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Banda roja top */}
      <div className="h-0.5 w-full bg-red-500" />

      {/* Topbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#0c0a09]">
        <span className="font-mono text-[8.5px] tracking-[2.5px] uppercase text-white/30">
          Riesgo Sanitario · SENASICA
        </span>
        <span className="font-mono text-[9px] font-semibold text-red-400 uppercase tracking-[1px]">
          ● Riesgo Alto · Tu zona
        </span>
      </div>

      {/* Header */}
      <div className="flex items-start gap-3 px-4 py-4 border-b border-stone-100 dark:border-stone-800/50">
        <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center text-xl shrink-0">
          🪲
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13.5px] font-semibold text-stone-800 dark:text-stone-100">
            Gusano Barrenador del Ganado
          </p>
          <p className="text-[11px] text-stone-400 italic mt-0.5">Cochliomyia hominivorax</p>
          <span className={`inline-block font-mono text-[9px] font-semibold px-2 py-0.5 rounded mt-1.5 ${NIVEL_TAG.alta}`}>
            ● Riesgo Alto · Durango-Norte
          </span>
        </div>
      </div>

      {/* Zonas */}
      <div
        className="px-4 py-3.5 border-b border-stone-100 dark:border-stone-800/50 transition-[opacity,transform] duration-400"
        style={{ opacity: barsIn ? 1 : 0, transform: barsIn ? 'none' : 'translateY(5px)' }}
      >
        <p className="font-mono text-[9px] uppercase tracking-[1.2px] text-stone-400 mb-3">
          Amenaza por zona
        </p>
        <div className="flex flex-col gap-2.5">
          {ZONAS.map((z, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-[11.5px] text-stone-500 dark:text-stone-400 w-30 shrink-0">{z.nombre}</span>
              <div className="flex-1 h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                <div
                  ref={el => { barsRef.current[i] = el }}
                  className="h-full rounded-full"
                  style={{ width: '0%', background: NIVEL_COLOR[z.nivel], transition: 'width 1.1s cubic-bezier(.4,0,.2,1)' }}
                />
              </div>
              <span
                className="font-mono text-[10px] font-semibold w-8 text-right shrink-0"
                style={{ color: NIVEL_COLOR[z.nivel] }}
              >
                {z.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Síntomas */}
      <div
        className="px-4 py-3.5 border-b border-stone-100 dark:border-stone-800/50 transition-[opacity,transform] duration-400"
        style={{ opacity: sec2In ? 1 : 0, transform: sec2In ? 'none' : 'translateY(5px)' }}
      >
        <p className="font-mono text-[9px] uppercase tracking-[1.2px] text-stone-400 mb-2.5">
          Síntomas a vigilar
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          {SINTOMAS.map((s, i) => (
            <div key={i} className="flex items-start gap-2 bg-stone-50 dark:bg-stone-900/40 rounded-lg px-2.5 py-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 mt-1" />
              <span className="text-[11px] text-stone-600 dark:text-stone-400 leading-snug">{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Protocolo */}
      <div
        className="px-4 py-3.5 transition-[opacity,transform] duration-400"
        style={{ opacity: sec3In ? 1 : 0, transform: sec3In ? 'none' : 'translateY(5px)' }}
      >
        <p className="font-mono text-[9px] uppercase tracking-[1.2px] text-stone-400 mb-2.5">
          Protocolo de respuesta
        </p>
        <div className="flex flex-col gap-2">
          {PROTOCOLO.map((p, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 bg-[#2FAF8F]/10 border border-[#2FAF8F]/20">
                <span className="font-mono text-[9px] font-semibold text-[#2FAF8F]">{p.n}</span>
              </div>
              <div>
                <p className="text-[12px] font-semibold text-stone-700 dark:text-stone-200">{p.title}</p>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-snug mt-0.5">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-stone-100 dark:border-stone-800/50 bg-stone-50/50 dark:bg-stone-900/20">
        <span className="font-mono text-[9px] text-stone-400">Fuente: SENASICA · USDA-APHIS · FEB 2026</span>
        <span className="font-mono text-[9px] text-stone-300 dark:text-stone-600">Gandia no diagnostica</span>
      </div>
    </div>
  )
}