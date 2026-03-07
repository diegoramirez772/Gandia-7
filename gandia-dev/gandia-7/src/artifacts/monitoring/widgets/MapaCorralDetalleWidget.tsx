/**
 * MapaCorralDetalleWidget — Widget: mapa:corral-detalle
 */
import type { Corral } from './MapaVistaGeneralWidget'

interface Props {
  corral:       Corral
  onVerCamara?: () => void
  onClose?:     () => void
}

const ESTADO = {
  normal:     { dot: 'bg-[#2FAF8F]', bg: 'bg-[#2FAF8F]/10 dark:bg-[#2FAF8F]/20', border: 'border-[#2FAF8F]/30', txt: 'text-[#2FAF8F]', label: 'Normal'     },
  atencion:   { dot: 'bg-amber-400',  bg: 'bg-amber-50 dark:bg-amber-950/30',      border: 'border-amber-200 dark:border-amber-800/40', txt: 'text-amber-600 dark:text-amber-400', label: 'Atención'   },
  cuarentena: { dot: 'bg-red-400',    bg: 'bg-red-50 dark:bg-red-950/30',          border: 'border-red-200 dark:border-red-800/40',   txt: 'text-red-600 dark:text-red-400',   label: 'Cuarentena' },
}

export default function MapaCorralDetalleWidget({ corral, onVerCamara, onClose }: Props) {
  const col     = ESTADO[corral.estado]
  const ocupPct = Math.round(corral.animales / corral.capacidad * 100)

  return (
    <div className={`bg-white dark:bg-[#1c1917] border-l-[3px] border rounded-[18px] overflow-hidden w-full ${col.border}`}>
      {/* Header */}
      <div className="px-[18px] py-3.5 border-b border-stone-100 dark:border-stone-800/40 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center ${col.bg} border ${col.border}`}>
            <span className={`text-[11px] font-extrabold ${col.txt}`}>{corral.label}</span>
          </div>
          <div>
            <p className="text-[13px] font-bold text-stone-700 dark:text-stone-200">Corral {corral.label}</p>
            <p className="text-[11px] text-stone-400 dark:text-stone-500">UPP Rancho Morales</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-[8px] border uppercase tracking-[0.04em] ${col.bg} ${col.txt} ${col.border}`}>{col.label}</span>
          {onClose && (
            <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-[8px] border border-stone-200/70 dark:border-stone-800/60 bg-white dark:bg-[#1c1917] text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors text-sm">✕</button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3">
        {[
          { label: 'Animales',    value: corral.animales,     sub: `cap. ${corral.capacidad}`,  color: corral.animales > corral.capacidad * 0.9 ? 'text-amber-500' : 'text-stone-800 dark:text-stone-100' },
          { label: 'Temperatura', value: `${corral.temp}°C`,  sub: 'sensor ambiental',          color: corral.temp > 24 ? 'text-amber-500' : 'text-stone-800 dark:text-stone-100' },
          { label: 'Humedad',     value: `${corral.humedad}%`, sub: 'relativa',                color: 'text-stone-800 dark:text-stone-100' },
        ].map((s, i) => (
          <div key={i} className={`px-[18px] py-3.5 ${i < 2 ? 'border-r border-stone-100 dark:border-stone-800/40' : ''}`}>
            <p className="text-[11px] text-stone-400 dark:text-stone-500 mb-1">{s.label}</p>
            <p className={`text-[24px] font-bold leading-none ${s.color}`}>{s.value}</p>
            <p className="text-[10.5px] text-stone-300 dark:text-stone-600 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Ocupación */}
      <div className="px-[18px] pb-4">
        <div className="flex justify-between mb-1.5">
          <span className="text-[11px] text-stone-400 dark:text-stone-500">Ocupación</span>
          <span className={`text-[11px] font-bold ${col.txt}`}>{ocupPct}%</span>
        </div>
        <div className="h-1.5 bg-stone-100 dark:bg-stone-800/50 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-1000 ${col.dot}`} style={{ width: `${ocupPct}%` }} />
        </div>
      </div>

      {/* Footer */}
      <div className="px-[18px] py-3 border-t border-stone-100 dark:border-stone-800/40 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${corral.camara ? 'bg-[#2FAF8F]' : 'bg-stone-300 dark:bg-stone-600'}`} />
          <span className={`text-[11px] ${corral.camara ? 'text-[#2FAF8F]' : 'text-stone-400 dark:text-stone-500'}`}>
            {corral.camara ? 'Cámara activa' : 'Sin cámara'}
          </span>
        </div>
        {corral.camara && onVerCamara && (
          <button onClick={onVerCamara} className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-[9px] bg-[#2FAF8F] hover:bg-[#27a07f] text-white text-[11px] font-semibold border-0 cursor-pointer transition-colors">
            Ver cámara
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        )}
      </div>
    </div>
  )
}