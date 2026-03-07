/**
 * SensorConteoLiveWidget — Widget: sensor:conteo-live
 */

interface SensorStat {
  corral:      string
  detectados:  number
  inventario:  number
  match:       number
  activo:      boolean
}

interface Props {
  stats:                 SensorStat[]
  ultimaActualizacion?:  string
}

export default function SensorConteoLiveWidget({ stats, ultimaActualizacion = 'hace 2 min' }: Props) {
  const activos      = stats.filter(s => s.activo)
  const totalDetect  = stats.reduce((s, c) => s + c.detectados, 0)
  const totalInvent  = stats.reduce((s, c) => s + c.inventario, 0)
  const matchGlobal  = activos.length > 0 ? Math.round(activos.reduce((s, c) => s + c.match, 0) / activos.length) : 0

  return (
    <div className="flex flex-col gap-4">
      {/* Stats top */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 shrink-0">
        {[
          { label: 'Total detectado',  value: totalDetect,       color: 'text-[#2FAF8F]' },
          { label: 'Total inventario', value: totalInvent,       color: 'text-stone-800 dark:text-stone-100' },
          { label: 'Match global',     value: `${matchGlobal}%`, color: 'text-[#2FAF8F]' },
        ].map((s, i) => (
          <div key={i} className="bg-white dark:bg-[#1c1917] border border-stone-200/70 dark:border-stone-800/60 rounded-[14px] px-[18px] py-4">
            <p className="text-[11px] text-stone-400 dark:text-stone-500 mb-1.5">{s.label}</p>
            <p className={`text-[32px] font-extrabold leading-none ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabla */}
      <div className="bg-white dark:bg-[#1c1917] border border-stone-200/70 dark:border-stone-800/60 rounded-[18px] overflow-hidden flex flex-col">
        <div className="px-5 py-3.5 border-b border-stone-100 dark:border-stone-800/40 flex items-center justify-between shrink-0">
          <p className="text-[13px] font-semibold text-stone-700 dark:text-stone-200">Conteo por corral</p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2FAF8F] animate-pulse" />
            <span className="text-[10px] text-stone-400 dark:text-stone-500">Actualizado {ultimaActualizacion}</span>
          </div>
        </div>

        <div className="overflow-y-auto">
          {stats.map((s, i) => {
            const barColor = s.match === 100 ? 'bg-[#2FAF8F]' : s.match >= 90 ? 'bg-amber-400' : 'bg-red-400'
            const txtColor = s.activo
              ? s.match === 100 ? 'text-[#2FAF8F]' : s.match >= 90 ? 'text-amber-500' : 'text-red-500'
              : 'text-stone-300 dark:text-stone-600'
            return (
              <div key={i} className={`px-5 py-3.5 flex items-center gap-4 ${i < stats.length - 1 ? 'border-b border-stone-100 dark:border-stone-800/40' : ''} ${s.activo ? 'opacity-100' : 'opacity-45'}`}>
                <span className="text-[12px] font-bold text-stone-700 dark:text-stone-200 w-[45px]">{s.corral}</span>
                <div className="flex-1 h-1.5 bg-stone-100 dark:bg-stone-800/50 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-1000 ${barColor}`} style={{ width: `${s.match}%` }} />
                </div>
                <div className="flex gap-5 items-center">
                  <span className="text-[12px] text-stone-400 dark:text-stone-500 w-20">
                    <span className="text-stone-700 dark:text-stone-200 font-bold">{s.detectados}</span> / {s.inventario}
                  </span>
                  <span className={`text-[11px] font-bold w-11 text-right ${txtColor}`}>
                    {s.activo ? `${s.match}%` : '—'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#2FAF8F]/08 dark:bg-[#2FAF8F]/12 border border-[#2FAF8F]/30 rounded-[14px] px-4 py-3 flex items-center gap-2.5 shrink-0">
        <span className="text-base">🤖</span>
        <div>
          <p className="text-[12px] font-semibold text-[#2FAF8F]">AI Perception v7.4 · Activo</p>
          <p className="text-[11px] text-[#2FAF8F]/70 mt-0.5">
            Precisión: 98.2% · {stats.filter(s => !s.activo).length > 0 ? `${stats.filter(s => !s.activo).length} corral(es) sin cobertura` : 'Cobertura completa'}
          </p>
        </div>
      </div>
      <style>{`@keyframes livePulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
    </div>
  )
}