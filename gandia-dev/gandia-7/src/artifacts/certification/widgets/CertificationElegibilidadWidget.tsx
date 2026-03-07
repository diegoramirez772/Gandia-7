/**
 * CertificationElegibilidadWidget
 * Diseño institucional — número hero, tabla de dominios, sin rings ni cajas.
 */
export type EstadoElegibilidad = 'listo' | 'casi' | 'bloqueado'

export interface DominioCheck {
  dominio:  'pasaporte' | 'gemelo' | 'monitoreo' | 'sanidad'
  label:    string
  ok:       boolean
  items:    { texto: string; ok: boolean; critico?: boolean }[]
}

export interface DatosElegibilidad {
  animal:      string
  arete:       string
  lote:        string
  tipoCert:    string
  estado:      EstadoElegibilidad
  score:       number
  dominios:    DominioCheck[]
  bloqueantes: string[]
  pendientes:  string[]
  fechaCorte?: string
}

interface Props {
  datos:         DatosElegibilidad
  onExpedir?:    () => void
  onVerDetalle?: () => void
}

const EST = {
  listo:    { label: 'Listo para certificar',    color: '#2FAF8F' },
  casi:     { label: 'Casi listo',               color: '#d97706' },
  bloqueado:{ label: 'Bloqueado',                color: '#e11d48' },
}

export default function CertificationElegibilidadWidget({ datos, onExpedir, onVerDetalle }: Props) {
  const col = EST[datos.estado]

  return (
    <div className="flex flex-col gap-0">

      {/* Hero — número + estado sin decoración */}
      <div className="pb-5 border-b border-stone-200/60 dark:border-stone-800/50">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-2">{datos.tipoCert}</p>
            <div className="flex items-baseline gap-3">
              <p className="text-[56px] font-black leading-none tabular-nums" style={{ color: col.color }}>{datos.score}</p>
              <div>
                <p className="text-[13px] text-stone-300 dark:text-stone-600 leading-none mb-1">/ 100</p>
                <p className="text-[13px] font-bold" style={{ color: col.color }}>{col.label}</p>
              </div>
            </div>
            <p className="text-[13px] text-stone-600 dark:text-stone-300 mt-2 font-medium">
              {datos.animal} <span className="font-mono text-stone-400 dark:text-stone-500 font-normal">{datos.arete}</span>
              <span className="text-stone-300 dark:text-stone-600"> · </span>
              <span className="text-stone-400 dark:text-stone-500">{datos.lote}</span>
            </p>
            {datos.fechaCorte && (
              <p className="text-[11px] text-amber-600 dark:text-amber-500 mt-1.5">Fecha límite: {datos.fechaCorte}</p>
            )}
          </div>

          {/* Barra vertical de score */}
          <div className="flex flex-col items-center gap-1 pb-1">
            <div className="w-2 h-24 bg-stone-100 dark:bg-stone-800/60 rounded-full overflow-hidden flex flex-col justify-end">
              <div className="w-full rounded-full transition-all duration-700" style={{ height: `${datos.score}%`, backgroundColor: col.color }} />
            </div>
          </div>
        </div>

        {/* Bloqueantes */}
        {datos.bloqueantes.length > 0 && (
          <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800/40">
            {datos.bloqueantes.map((b, i) => (
              <p key={i} className="text-[11.5px] text-rose-600 dark:text-rose-400 flex gap-2 mb-1 leading-snug">
                <span className="shrink-0 font-black mt-0.5">✕</span>{b}
              </p>
            ))}
          </div>
        )}

        {/* Pendientes */}
        {datos.pendientes.length > 0 && datos.estado !== 'bloqueado' && (
          <div className={`mt-3 ${datos.bloqueantes.length === 0 ? 'pt-4 border-t border-stone-100 dark:border-stone-800/40' : ''}`}>
            {datos.pendientes.map((p, i) => (
              <p key={i} className="text-[11.5px] text-amber-600 dark:text-amber-500 flex gap-2 mb-1 leading-snug">
                <span className="shrink-0 mt-0.5">·</span>{p}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Tabla de dominios */}
      <div className="pt-2">
        <p className="text-[10px] text-stone-400 dark:text-stone-500 uppercase tracking-widest font-semibold px-1 py-3">Verificación por dominio</p>
        <div className="divide-y divide-stone-100 dark:divide-stone-800/40">
          {datos.dominios.map((d, i) => {
            const fail = d.items.filter(x => !x.ok)
            const bloq = fail.some(x => x.critico)
            const statusColor = d.ok ? '#2FAF8F' : bloq ? '#e11d48' : '#d97706'
            return (
              <div key={i} className="py-3 px-1">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[12px] font-semibold text-stone-700 dark:text-stone-200 capitalize">{d.label}</p>
                  <p className="text-[11px] font-semibold" style={{ color: statusColor }}>
                    {d.ok ? `${d.items.length}/${d.items.length} ✓` : `${fail.length} faltante${fail.length > 1 ? 's' : ''}`}
                  </p>
                </div>
                {/* Items como chips mínimos */}
                <div className="flex flex-wrap gap-1.5">
                  {d.items.map((item, j) => (
                    <span key={j} className={`text-[10.5px] px-2 py-0.5 rounded-md
                      ${item.ok
                        ? 'text-stone-400 dark:text-stone-500 bg-stone-100/80 dark:bg-stone-800/40'
                        : item.critico
                          ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 font-medium'
                          : 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20'
                      }`}>
                      {item.ok ? '✓ ' : '○ '}{item.texto}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Acciones */}
      <div className="flex gap-2 pt-4 border-t border-stone-200/60 dark:border-stone-800/50 mt-2">
        {onVerDetalle && (
          <button onClick={onVerDetalle}
            className="flex-1 py-2.5 rounded-[10px] border border-stone-200/70 dark:border-stone-800/60 text-[12px] font-semibold text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer transition-colors bg-transparent">
            Ver checklist
          </button>
        )}
        {onExpedir && datos.estado !== 'bloqueado' && (
          <button onClick={onExpedir}
            className="flex-1 py-2.5 rounded-[10px] text-[12px] font-semibold text-white cursor-pointer transition-colors border-0"
            style={{ backgroundColor: '#2FAF8F' }}>
            Preparar expediente
          </button>
        )}
      </div>
    </div>
  )
}