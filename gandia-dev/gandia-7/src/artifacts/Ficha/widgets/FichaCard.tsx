/**
 * FichaCard — estado WIDGET (inline en el chat)
 * Ficha Ganadera · Identificación oficial del animal.
 * Cambios vs PassportCard:
 *   - Se eliminó la foto del animal (ruido en campo)
 *   - Se agregó acción "Ver huella de morro" → onHuella()
 *   - Renombrado a FICHA GANADERA
 *   - MRZ y animación de scanline ahora sobre banda de datos
 */

import { useState, useEffect } from 'react'
import type { PassportData } from '../../../pages/Chat/artifactEngine/mockData'

interface Props {
  data:       PassportData
  onHuella?:  () => void
}

export default function FichaCard({ data, onHuella }: Props) {
  const [fields,      setFields]      = useState<boolean[]>([false, false, false, false, false])
  const [cardVisible, setCardVisible] = useState(false)
  const [ctaVisible,  setCtaVisible]  = useState(false)

  useEffect(() => {
    const t0 = setTimeout(() => setCardVisible(true), 100)
    const t1 = setTimeout(() => setFields([true, true, false, false, false]), 300)
    const t2 = setTimeout(() => setFields([true, true, true, true, false]),   700)
    const t3 = setTimeout(() => setFields([true, true, true, true, true]),   1100)
    const t4 = setTimeout(() => setCtaVisible(true), 1500)
    return () => [t0, t1, t2, t3, t4].forEach(clearTimeout)
  }, [])

  const rows: { k: string; v: string; mono: boolean; green: boolean; gold: boolean }[][] = [
    [
      { k: 'SINIIGA',      v: data.siniiga,    mono: true,  green: true,  gold: false },
      { k: 'RFID / Arete', v: data.rfid,       mono: true,  green: false, gold: false },
    ],
    [
      { k: 'Raza',         v: data.raza,        mono: false, green: false, gold: false },
      { k: 'Sexo',         v: data.sexo,        mono: false, green: false, gold: false },
    ],
    [
      { k: 'Peso',         v: data.peso,        mono: false, green: false, gold: false },
      { k: 'Nacimiento',   v: data.nacimiento,  mono: false, green: false, gold: false },
    ],
    [
      { k: 'UPP',          v: data.upp,         mono: false, green: false, gold: false },
      { k: 'Propietario',  v: data.propietario, mono: false, green: false, gold: false },
    ],
    [
      { k: 'Export',       v: data.exportLabel, mono: false, green: false, gold: true  },
      { k: 'Verificado',   v: data.verificado,  mono: true,  green: false, gold: false },
    ],
  ]

  return (
    <>
      <style>{`
        @keyframes fc-in    { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fc-scan  { 0%{top:0%;opacity:0} 5%{opacity:.8} 95%{opacity:.8} 100%{top:100%;opacity:0} }
        @keyframes fc-cta   { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fc-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.35;transform:scale(.78)} }
        .fc-in    { animation: fc-in   .45s cubic-bezier(.16,1,.3,1) both; }
        .fc-cta   { animation: fc-cta  .4s  cubic-bezier(.16,1,.3,1) both; }
        .fc-pulse { animation: fc-pulse 2s ease-in-out infinite; }
        .fc-scanline { animation: fc-scan 1.8s ease-in-out 1 forwards; position:absolute;left:0;right:0;height:1px;background:linear-gradient(to right,transparent,#2FAF8F,transparent);top:0;pointer-events:none; }
      `}</style>

      {cardVisible && (
        <div className="fc-in mt-3 w-full border border-stone-200/70 dark:border-stone-800 rounded-2xl overflow-hidden bg-white dark:bg-[#141210]">

          {/* ── Banda institucional ── */}
          <div className="bg-[#1c1917] px-4 py-3 flex items-center justify-between relative overflow-hidden">
            <div className="fc-scanline" />
            <div>
              <p className="font-mono text-[8.5px] tracking-[2.5px] uppercase text-white/30">México · SENASICA · Gandia</p>
              <p className="text-[15px] font-semibold text-white tracking-tight mt-0.5">FICHA GANADERA</p>
              <p className="font-mono text-[8px] text-white/20 uppercase tracking-[1.5px]">Identificación Bovina Oficial</p>
            </div>
            <div className="flex items-center gap-1.5 bg-[#2FAF8F]/12 border border-[#2FAF8F]/25 rounded-full px-3 py-1.5">
              <span className="fc-pulse w-1.5 h-1.5 rounded-full bg-[#2FAF8F] shrink-0" />
              <span className="font-mono text-[9.5px] font-semibold text-[#2FAF8F] uppercase tracking-[1px]">{data.estatus}</span>
            </div>
          </div>

          {/* ── Campos de identidad (full width, sin foto) ── */}
          <div className="px-4 py-2 flex flex-col divide-y divide-stone-50 dark:divide-stone-800/50">
            {rows.map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-2 gap-x-3 py-1.5"
                style={{
                  opacity:    fields[i] ? 1 : 0,
                  transform:  fields[i] ? 'none' : 'translateX(-4px)',
                  transition: `opacity .35s ease ${i * 55}ms, transform .35s ease ${i * 55}ms`,
                }}
              >
                {row.map((f, j) => (
                  <div key={j}>
                    <p className="font-mono text-[8px] text-stone-400 dark:text-stone-500 uppercase tracking-[1px] mb-0.5">{f.k}</p>
                    {f.gold ? (
                      <span className="inline-flex items-center gap-1 font-mono text-[9px] font-semibold text-amber-700 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 px-1.5 py-0.5 rounded tracking-[.5px]">
                        {f.v}
                      </span>
                    ) : (
                      <p className={`text-[12px] font-medium leading-snug ${f.green ? 'text-[#2FAF8F]' : 'text-stone-800 dark:text-stone-100'} ${f.mono ? 'font-mono text-[11px]' : ''}`}>
                        {f.v}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* ── Huella de morro ── */}
          {fields[4] && (
            <div className="mx-4 mb-3 mt-1">
              <button
                onClick={onHuella}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-[10px] bg-stone-50 dark:bg-stone-900/40 border border-stone-100 dark:border-stone-800 hover:border-[#2FAF8F]/40 hover:bg-[#2FAF8F]/05 transition-all group cursor-pointer"
              >
                {/* Morro icon */}
                <div className="w-8 h-8 rounded-[8px] bg-[#2FAF8F]/10 border border-[#2FAF8F]/25 flex items-center justify-center shrink-0 group-hover:bg-[#2FAF8F]/15 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2FAF8F" strokeWidth="1.5" strokeLinecap="round">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M3 9V6a1 1 0 0 1 1-1h3"/><path d="M21 9V6a1 1 0 0 0-1-1h-3"/>
                    <path d="M3 15v3a1 1 0 0 0 1 1h3"/><path d="M21 15v3a1 1 0 0 1-1 1h-3"/>
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <p className="text-[12px] font-semibold text-stone-700 dark:text-stone-200">Huella de morro</p>
                  <p className="text-[10.5px] text-stone-400 dark:text-stone-500 mt-0.5">NosePrint Bovino · Biometría registrada</p>
                </div>
                <svg className="w-3.5 h-3.5 text-stone-300 group-hover:text-[#2FAF8F] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
            </div>
          )}

          {/* ── MRZ ── */}
          <div className="bg-stone-50 dark:bg-stone-900/40 border-t border-stone-100 dark:border-stone-800 px-4 py-2">
            <p className="font-mono text-[8px] text-stone-300 dark:text-stone-600 tracking-[2px] leading-[1.9]">
              {data.mrz[0]}<br />{data.mrz[1]}
            </p>
          </div>

          {/* ── CTA ── */}
          {ctaVisible && (
            <div className="fc-cta px-4 py-2.5 border-t border-stone-100 dark:border-stone-800">
              <p className="text-[11.5px] text-stone-500 dark:text-stone-400">
                Trazabilidad completa · <span className="text-[#2FAF8F] font-medium">Arete Azul activo</span>
              </p>
            </div>
          )}
        </div>
      )}
    </>
  )
}