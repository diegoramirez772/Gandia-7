/**
 * CamaraFeedWidget — Widget: camara:feed
 */
import type { Camara } from './CamaraListaWidget'

interface Props { camara: Camara }

const BOXES = [[8,28,9,28],[20,36,8,26],[34,26,10,32],[50,33,9,27],[64,28,11,30],[79,36,8,24]]

export default function CamaraFeedWidget({ camara }: Props) {
  const match     = camara.inventario > 0 ? Math.round(camara.detectados / camara.inventario * 100) : 0
  const diferencia = Math.abs(camara.detectados - camara.inventario)

  if (camara.estado === 'offline') {
    return (
      <div className="flex flex-col gap-3">
        <div className="w-full aspect-video max-h-[340px] rounded-[18px] bg-[#111] border border-stone-200/70 dark:border-stone-800/60 flex flex-col items-center justify-center gap-2.5">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.5" strokeLinecap="round">
            <line x1="1" y1="1" x2="23" y2="23"/>
            <path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h4a2 2 0 0 1 2 2v9.34"/>
          </svg>
          <p className="text-[12px] font-semibold text-stone-500">Sin señal · {camara.label}</p>
          <p className="text-[11px] text-stone-400">Cámara offline — revisar conexión</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Viewport */}
      <div className="w-full aspect-video max-h-[340px] rounded-[18px] overflow-hidden relative bg-[#111] border border-stone-200/70 dark:border-stone-800/60">
        <img
          src="https://images.unsplash.com/photo-1545468800-85cc9bc6ecf7?auto=format&fit=crop&q=80&w=1200"
          alt="camera feed"
          className="w-full h-full object-cover"
          style={{ filter: 'saturate(0.5) contrast(1.1) brightness(0.65)' }}
        />
        {/* Scanlines */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(transparent 0,transparent 2px,rgba(0,0,0,0.04) 2px,rgba(0,0,0,0.04) 3px)' }} />

        {/* Bounding boxes */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {BOXES.slice(0, Math.min(camara.detectados, 6)).map(([x,y,w,h], i) => (
            <g key={i}>
              <rect x={`${x}%`} y={`${y}%`} width={`${w}%`} height={`${h}%`} fill="none" stroke="rgba(47,175,143,0.6)" strokeWidth="1"/>
              <rect x={`${x}%`} y={`calc(${y}% - 16px)`} width="28" height="14" fill="rgba(47,175,143,0.85)" rx="3"/>
              <text x={`calc(${x}% + 4px)`} y={`calc(${y}% - 4px)`} fontSize="8" fill="white" fontFamily="monospace">#{String(i+1).padStart(2,'0')}</text>
            </g>
          ))}
        </svg>

        {/* Badge cámara */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 bg-black/60 backdrop-blur-[12px] border border-white/10 rounded-[10px] px-3 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
          <span className="text-[10px] text-white font-semibold tracking-[0.04em]">{camara.label} · Corral {camara.corral}</span>
        </div>

        {/* Badge conteo */}
        <div className="absolute bottom-3.5 right-3.5 bg-black/60 backdrop-blur-[12px] border border-[#2FAF8F]/30 rounded-[10px] px-3 py-1.5">
          <span className="text-[10px] text-[#2FAF8F] font-semibold">{camara.detectados} detectados · {match}% match</span>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {[
          { k: 'Detectados',   v: camara.detectados, color: 'text-[#2FAF8F]' },
          { k: 'Inventario',   v: camara.inventario, color: 'text-stone-800 dark:text-stone-100' },
          { k: 'Coincidencia', v: `${match}%`,       color: match === 100 ? 'text-[#2FAF8F]' : 'text-amber-500' },
          { k: 'Diferencia',   v: diferencia,        color: diferencia === 0 ? 'text-[#2FAF8F]' : 'text-red-500' },
        ].map((m, i) => (
          <div key={i} className="bg-white dark:bg-[#1c1917] border border-stone-200/70 dark:border-stone-800/60 rounded-[12px] px-3.5 py-2.5">
            <p className="text-[10px] text-stone-400 dark:text-stone-500 mb-1">{m.k}</p>
            <p className={`text-[22px] font-bold leading-none ${m.color}`}>{m.v}</p>
          </div>
        ))}
      </div>
      <style>{`@keyframes livePulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
    </div>
  )
}