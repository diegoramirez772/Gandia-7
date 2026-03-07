/**
 * BiometriaEstadisticasWidget — Widget: biometria:estadisticas
 * ARCHIVO → src/artifacts/biometria/widgets/BiometriaEstadisticasWidget.tsx
 */
import type { RegistroCaptura } from './BiometriaHistorialWidget'

interface Props {
  registros: RegistroCaptura[]
}

export default function BiometriaEstadisticasWidget({ registros }: Props) {
  const total      = registros.length
  const matches    = registros.filter(r => r.resultado === 'match').length
  const candidatos = registros.filter(r => r.resultado === 'candidato').length
  const nuevos     = registros.filter(r => r.resultado === 'nuevo').length
  const errores    = registros.filter(r => r.resultado === 'error').length
  const precision  = total > 0 ? Math.round((matches / total) * 100) : 0
  const conScore   = registros.filter(r => r.score > 0)
  const avgScore   = conScore.length > 0
    ? Math.round(conScore.reduce((s, r) => s + r.score, 0) / conScore.length * 100)
    : 0
  const directas = registros.filter(r => r.modo === 'direct').length
  const hojas    = registros.filter(r => r.modo === 'sheet').length

  return (
    <div className="flex flex-col gap-4">

      {/* ── Encabezado ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <p className="text-[13.5px] font-semibold text-stone-800 dark:text-stone-100">Estadísticas del día</p>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2FAF8F] animate-pulse"/>
          <span className="text-[11px] text-stone-400 dark:text-stone-500">En vivo</span>
        </div>
      </div>

      {/* ── Precisión — métrica héroe ────────────────────────────────── */}
      <div className="bg-white dark:bg-[#1c1917] border border-stone-200/60 dark:border-stone-800/50 rounded-[12px] p-4">
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-[11px] font-medium text-stone-400 dark:text-stone-500 uppercase tracking-[0.06em]">Precisión global</p>
            <p className={`text-[40px] font-extrabold leading-none tabular-nums mt-1 ${precision >= 90 ? 'text-[#2FAF8F]' : precision >= 70 ? 'text-amber-500' : 'text-red-500'}`}>
              {precision}%
            </p>
          </div>
          <p className="text-[13px] text-stone-400 dark:text-stone-500 mb-1">
            {matches}/{total} capturas
          </p>
        </div>
        <div className="h-2.5 bg-stone-100 dark:bg-stone-800/50 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              precision >= 90 ? 'bg-[#2FAF8F]' : precision >= 70 ? 'bg-amber-400' : 'bg-red-400'
            }`}
            style={{ width: `${precision}%` }}
          />
        </div>
      </div>

      {/* ── Grid de métricas ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-2.5">
        {[
          { label: 'Capturas totales',  value: total,          color: 'text-stone-800 dark:text-stone-100' },
          { label: 'Score promedio',    value: `${avgScore}%`, color: avgScore >= 85 ? 'text-[#2FAF8F]' : 'text-amber-500' },
          { label: 'Match directo',     value: matches,         color: 'text-[#2FAF8F]'  },
          { label: 'Candidatos',        value: candidatos,      color: 'text-amber-500'  },
          { label: 'Nuevos animales',   value: nuevos,          color: 'text-violet-500' },
          { label: 'Con error',         value: errores,         color: errores > 0 ? 'text-red-500' : 'text-stone-400 dark:text-stone-500' },
        ].map((s, i) => (
          <div key={i} className="bg-white dark:bg-[#1c1917] border border-stone-200/60 dark:border-stone-800/50 rounded-[10px] px-3.5 py-3">
            <p className={`text-[26px] font-extrabold leading-none tabular-nums ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-1.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Modo de captura ─────────────────────────────────────────── */}
      {total > 0 && (
        <div className="bg-white dark:bg-[#1c1917] border border-stone-200/60 dark:border-stone-800/50 rounded-[12px] p-4">
          <p className="text-[11px] font-medium text-stone-400 dark:text-stone-500 uppercase tracking-[0.06em] mb-3">Modo de captura</p>
          <div className="flex gap-5">
            {[
              {
                label: 'Cámara directa',
                value: directas,
                pct: total > 0 ? Math.round((directas / total) * 100) : 0,
                icon: (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" className="text-[#2FAF8F]">
                    <path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/>
                  </svg>
                ),
                bar: 'bg-[#2FAF8F]',
              },
              {
                label: 'Hoja inteligente',
                value: hojas,
                pct: total > 0 ? Math.round((hojas / total) * 100) : 0,
                icon: (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" className="text-violet-400">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
                  </svg>
                ),
                bar: 'bg-violet-400',
              },
            ].map(m => (
              <div key={m.label} className="flex-1">
                <div className="flex items-center gap-1.5 mb-1.5">
                  {m.icon}
                  <span className="text-[12px] text-stone-500 dark:text-stone-400">{m.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-stone-100 dark:bg-stone-800/50 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${m.bar}`} style={{ width: `${m.pct}%` }}/>
                  </div>
                  <span className="text-[12px] font-bold text-stone-700 dark:text-stone-300 tabular-nums w-6 text-right">{m.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer aviso error */}
      {errores > 0 && (
        <div className="px-3.5 py-2.5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30 rounded-[8px]">
          <p className="text-[12px] text-red-500 font-medium">
            {errores} captura{errores > 1 ? 's' : ''} con error — revisar calidad de imagen
          </p>
        </div>
      )}
    </div>
  )
}