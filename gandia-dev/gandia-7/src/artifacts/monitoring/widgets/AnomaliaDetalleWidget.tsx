/**
 * AnomaliaDetalleWidget — Widget: anomalia:detalle
 */
import type { Anomalia } from './AnomaliaFeedWidget'

interface Props {
  anomalia:    Anomalia
  onResolver?: (id: number) => void
  onClose?:    () => void
}

const SENALES: Record<string, string[]> = {
  'Separación del hato':    ['Separación del hato', 'Postura caída', 'Movimiento reducido', 'Sin ingesta registrada'],
  'Postura caída':          ['Postura caída', 'Sin movimiento > 20 min', 'Sin ingesta'],
  'Movimiento reducido':    ['Movimiento reducido', 'Velocidad de desplazamiento baja'],
  'Sin ingesta registrada': ['Sin acercamiento al comedero > 4h', 'Postura inactiva'],
  'Temperatura elevada':    ['Temperatura estimada > 39.5°C', 'Jadeo', 'Búsqueda de sombra'],
}

export default function AnomaliaDetalleWidget({ anomalia, onResolver, onClose }: Props) {
  const isAlta  = anomalia.severidad === 'alta'
  const senales = SENALES[anomalia.tipo] ?? [anomalia.tipo]

  const sevCard   = isAlta ? 'border-red-200 dark:border-red-800/40 border-l-red-400'   : 'border-[#2FAF8F]/30 dark:border-[#2FAF8F]/20 border-l-[#2FAF8F]'
  const sevBadge  = isAlta ? 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/40' : 'bg-[#2FAF8F]/10 dark:bg-[#2FAF8F]/20 text-[#2FAF8F] border-[#2FAF8F]/30'
  const sevDot    = isAlta ? 'bg-red-400' : 'bg-[#2FAF8F]'
  const sevTag    = isAlta ? 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/40' : 'bg-[#2FAF8F]/10 dark:bg-[#2FAF8F]/20 text-[#2FAF8F] border-[#2FAF8F]/30'

  return (
    <div className={`bg-white dark:bg-[#1c1917] border border-l-[3px] rounded-[18px] overflow-hidden ${sevCard}`}>
      {/* Header */}
      <div className="px-[18px] py-3.5 border-b border-stone-100 dark:border-stone-800/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${sevDot} ${!anomalia.resuelto ? 'animate-pulse' : ''}`} />
          <p className="text-[13px] font-bold text-stone-700 dark:text-stone-200">{anomalia.tipo}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-[0.04em] ${sevBadge}`}>
            ● {anomalia.severidad}
          </span>
          {onClose && (
            <button onClick={onClose} className="w-[26px] h-[26px] flex items-center justify-center rounded-[7px] border border-stone-200/70 dark:border-stone-800/60 bg-white dark:bg-[#1c1917] text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 transition-colors text-[13px]">✕</button>
          )}
        </div>
      </div>

      <div className="p-[16px_18px] flex flex-col gap-3.5">
        {/* Animal info */}
        <div className="flex items-center gap-3 bg-stone-50 dark:bg-[#141210] border border-stone-100 dark:border-stone-800/40 rounded-[12px] p-[12px_14px]">
          <div className="w-11 h-11 rounded-[10px] overflow-hidden shrink-0 border border-stone-100 dark:border-stone-800/40">
            <img src="https://images.unsplash.com/photo-1546445317-29f4545e9d53?q=80&w=200" alt="animal" className="w-full h-full object-cover grayscale-[20%]" />
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-bold text-stone-700 dark:text-stone-200">Ejemplar {anomalia.animal}</p>
            <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-0.5">{anomalia.corral} · Detectado {anomalia.ts}</p>
          </div>
        </div>

        {/* Señales */}
        <div>
          <p className="text-[10px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-[0.05em] mb-2">Señales observadas</p>
          <div className="flex flex-wrap gap-1.5">
            {senales.map((s, i) => (
              <span key={i} className={`text-[11px] font-semibold px-2.5 py-1 rounded-[8px] border ${sevTag}`}>{s}</span>
            ))}
          </div>
        </div>

        {/* Recomendación */}
        <div className="bg-[#2FAF8F]/08 dark:bg-[#2FAF8F]/12 border border-[#2FAF8F]/30 rounded-[12px] p-[12px_14px]">
          <p className="text-[10px] font-semibold text-[#2FAF8F] uppercase tracking-[0.04em] mb-1.5">Recomendación</p>
          <p className="text-[12px] text-stone-600 dark:text-stone-300 leading-relaxed">
            Revisión visual directa en los próximos 30 min. Si se confirma postración, contactar MVZ de guardia.
          </p>
          <p className="text-[11px] text-[#2FAF8F] mt-1.5 italic">La IA alerta. El humano decide y actúa.</p>
        </div>

        {/* Acciones */}
        {!anomalia.resuelto && onResolver && (
          <div className="flex justify-end">
            <button onClick={() => onResolver(anomalia.id)} className="flex items-center gap-1.5 px-[18px] py-2 rounded-[10px] bg-[#2FAF8F] hover:bg-[#27a07f] text-white text-[12px] font-semibold transition-colors border-0 cursor-pointer">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              Marcar resuelta
            </button>
          </div>
        )}

        {anomalia.resuelto && (
          <div className="flex items-center gap-1.5 justify-center py-2 bg-[#2FAF8F]/08 rounded-[10px]">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2FAF8F" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            <span className="text-[12px] text-[#2FAF8F] font-semibold">Anomalía resuelta</span>
          </div>
        )}
      </div>
      <style>{`@keyframes livePulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
    </div>
  )
}