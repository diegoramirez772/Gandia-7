/**
 * MapaVistaGeneralWidget — Widget: mapa:vista-general
 */

export interface Corral {
  id:        number
  label:     string
  animales:  number
  capacidad: number
  estado:    'normal' | 'atencion' | 'cuarentena'
  temp:      number
  humedad:   number
  camara:    boolean
  lat?:      number
  lng?:      number
  anchoM?:   number
  largoM?:   number
}

interface Props {
  corrales:        Corral[]
  onSelectCorral?: (corral: Corral) => void
}

const ESTADO: Record<string, { dot: string; border: string; label: string }> = {
  normal:     { dot: '#2FAF8F', border: '#2FAF8F',   label: 'Normal'     },
  atencion:   { dot: '#f59e0b', border: '#f59e0b',   label: 'Atención'   },
  cuarentena: { dot: '#ef4444', border: '#ef4444',   label: 'Cuarentena' },
}

const PIN_POS: Record<number, { top: string; left: string }> = {
  1: { top: '28%', left: '22%' }, 2: { top: '22%', left: '42%' },
  3: { top: '35%', left: '61%' }, 4: { top: '55%', left: '30%' },
  5: { top: '60%', left: '52%' }, 6: { top: '48%', left: '74%' },
}

function StatsRow({ corrales }: { corrales: Corral[] }) {
  const total    = corrales.reduce((s, c) => s + c.animales, 0)
  const cap      = corrales.reduce((s, c) => s + c.capacidad, 0)
  const ocupacion = Math.round(total / cap * 100)
  const alertas  = corrales.filter(c => c.estado !== 'normal').length
  const activos  = corrales.filter(c => c.estado === 'normal').length

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 shrink-0">
      {[
        { label: 'Total animales',   value: total,          sub: `de ${cap}`,               color: 'text-stone-800 dark:text-stone-100' },
        { label: 'Ocupación',        value: `${ocupacion}%`, sub: 'capacidad total',        color: 'text-stone-800 dark:text-stone-100' },
        { label: 'Alertas activas',  value: alertas,        sub: 'corrales',               color: alertas > 0 ? 'text-red-500' : 'text-[#2FAF8F]' },
        { label: 'Corrales activos', value: activos,        sub: `de ${corrales.length}`,   color: 'text-[#2FAF8F]' },
      ].map((s, i) => (
        <div key={i} className="bg-white dark:bg-[#1c1917] border border-stone-200/70 dark:border-stone-800/60 rounded-[14px] px-4 py-3.5 flex flex-col gap-1">
          <span className="text-[11px] text-stone-400 dark:text-stone-500">{s.label}</span>
          <span className={`text-[26px] font-bold leading-none ${s.color}`}>{s.value}</span>
          <span className="text-[10.5px] text-stone-300 dark:text-stone-600">{s.sub}</span>
        </div>
      ))}
    </div>
  )
}

export default function MapaVistaGeneralWidget({ corrales, onSelectCorral }: Props) {
  return (
    <div className="flex flex-col h-full gap-4">
      <StatsRow corrales={corrales} />

      <div className="flex-1 rounded-[18px] overflow-hidden relative border border-stone-200/70 dark:border-stone-800/60 min-h-0">
        <iframe
          title="Mapa UPP"
          width="100%" height="100%"
          className="block border-0"
          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d8000!2d-104.6!3d24.15!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1ses!2smx!4v1700000000000!5m2!1ses!2smx"
          allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
        />

        {corrales.map(c => {
          const pos = PIN_POS[c.id]
          const col = ESTADO[c.estado]
          if (!pos) return null
          return (
            <div
              key={c.id}
              onClick={() => onSelectCorral?.(c)}
              className="absolute z-10 cursor-pointer flex flex-col items-center transition-transform hover:scale-[1.08]"
              style={{ top: pos.top, left: pos.left, transform: 'translate(-50%,-100%)', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.25))' }}
            >
              <div className="bg-white rounded-[10px] px-2.5 py-1 flex items-center gap-1.5 whitespace-nowrap" style={{ border: `2px solid ${col.dot}` }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: col.dot }} />
                <span className="text-[11px] font-bold text-stone-700">{c.label}</span>
                <span className="text-[11px] text-stone-400">{c.animales}</span>
              </div>
              <div className="w-0 h-0 -mt-px" style={{ borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: `7px solid ${col.dot}` }} />
            </div>
          )
        })}

        {/* Badge live */}
        <div className="absolute top-3.5 left-3.5 z-20 flex items-center gap-1.5 bg-white/92 dark:bg-black/60 backdrop-blur-[10px] border border-black/08 dark:border-white/10 rounded-[10px] px-3 py-1.5 shadow-md">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2FAF8F] animate-pulse" />
          <span className="text-[10px] text-stone-700 dark:text-stone-200 font-semibold">EN VIVO · UPP Rancho Morales</span>
        </div>

        {/* Leyenda */}
        <div className="absolute bottom-3.5 left-3.5 z-20 bg-white/92 dark:bg-black/60 backdrop-blur-[10px] border border-black/08 dark:border-white/10 rounded-[10px] px-3 py-2 flex gap-3.5 shadow-md">
          {[{ color: '#2FAF8F', label: 'Normal' }, { color: '#f59e0b', label: 'Atención' }, { color: '#ef4444', label: 'Cuarentena' }].map(l => (
            <div key={l.label} className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: l.color }} />
              <span className="text-[10.5px] text-stone-500 dark:text-stone-400">{l.label}</span>
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes livePulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
    </div>
  )
}