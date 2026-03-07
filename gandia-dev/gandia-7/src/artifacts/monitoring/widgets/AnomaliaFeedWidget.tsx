/**
 * AnomaliaFeedWidget — Widget: anomalia:feed
 * Feed en tiempo real de anomalías activas y resueltas.
 */

export interface Anomalia {
  id:        number
  ts:        string
  animal:    string
  corral:    string
  tipo:      string
  severidad: 'alta' | 'media'
  resuelto:  boolean
}

interface Props {
  anomalias:         Anomalia[]
  onSelectAnomalia?: (a: Anomalia) => void
}

export default function AnomaliaFeedWidget({ anomalias, onSelectAnomalia }: Props) {
  const activas   = anomalias.filter(a => !a.resuelto)
  const resueltas = anomalias.filter(a =>  a.resuelto)

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 shrink-0">
        <p className="text-[12px] font-bold text-stone-700 dark:text-stone-200">Anomalías</p>
        <div className="flex items-center gap-2">
          {activas.length > 0 && (
            <span className="text-[10px] font-bold bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 px-2 py-0.5 rounded-md border border-red-200 dark:border-red-800/40">
              {activas.length} activas
            </span>
          )}
          <span className="w-1.5 h-1.5 rounded-full bg-[#2FAF8F] animate-pulse" />
        </div>
      </div>

      {/* Lista */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-1.5">
        {activas.map(a => (
          <div
            key={a.id}
            onClick={() => onSelectAnomalia?.(a)}
            className={`bg-white dark:bg-[#1c1917] rounded-[13px] p-[11px_13px] cursor-pointer border-l-[3px] transition-shadow hover:shadow-md
              ${a.severidad === 'alta'
                ? 'border border-red-200 dark:border-red-800/40 border-l-red-400'
                : 'border border-[#2FAF8F]/30 dark:border-[#2FAF8F]/20 border-l-[#2FAF8F]'
              }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${a.severidad === 'alta' ? 'bg-red-400' : 'bg-[#2FAF8F]'}`} />
                <span className="text-[11px] font-bold text-stone-700 dark:text-stone-200">{a.corral}</span>
              </div>
              <span className="text-[10px] text-stone-400 dark:text-stone-500">{a.ts}</span>
            </div>
            <p className="text-[12px] text-stone-600 dark:text-stone-300 leading-snug mb-0.5">{a.tipo}</p>
            <p className="text-[10.5px] text-stone-400 dark:text-stone-500">Animal {a.animal}</p>
          </div>
        ))}

        {resueltas.length > 0 && (
          <>
            <p className="text-[10px] text-stone-300 dark:text-stone-600 uppercase tracking-[0.05em] mt-2 mb-1">Resueltas hoy</p>
            {resueltas.map(a => (
              <div key={a.id} className="bg-stone-50 dark:bg-[#141210] border border-stone-100 dark:border-stone-800/40 rounded-[12px] p-[10px_13px] opacity-60">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#2FAF8F" strokeWidth="2.5" strokeLinecap="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <span className="text-[11px] font-semibold text-stone-400 dark:text-stone-500">{a.corral}</span>
                  </div>
                  <span className="text-[10px] text-stone-300 dark:text-stone-600">{a.ts}</span>
                </div>
                <p className="text-[11.5px] text-stone-400 dark:text-stone-500 leading-snug">{a.tipo}</p>
              </div>
            ))}
          </>
        )}

        {anomalias.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 pt-10">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-stone-300 dark:text-stone-600">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <p className="text-[12px] text-stone-300 dark:text-stone-600">Sin anomalías hoy</p>
          </div>
        )}
      </div>
      <style>{`@keyframes livePulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
    </div>
  )
}