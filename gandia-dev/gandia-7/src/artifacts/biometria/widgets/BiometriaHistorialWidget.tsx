/**
 * BiometriaHistorialWidget — Widget: biometria:historial
 * ARCHIVO → src/artifacts/biometria/widgets/BiometriaHistorialWidget.tsx
 */

export type ResultadoTipo = 'match' | 'candidato' | 'nuevo' | 'error'

export interface RegistroCaptura {
  id:         number
  ts:         string
  animal:     string
  arete:      string
  lote:       string
  score:      number
  resultado:  ResultadoTipo
  modo:       'direct' | 'sheet'
  confirmado: boolean
}

interface Props {
  registros:         RegistroCaptura[]
  onSelectRegistro?: (r: RegistroCaptura) => void
}

const R = {
  match:     { dot: 'bg-[#2FAF8F]', label: 'Match',     textColor: 'text-[#2FAF8F]'  },
  candidato: { dot: 'bg-amber-400', label: 'Candidato', textColor: 'text-amber-500'  },
  nuevo:     { dot: 'bg-violet-400',label: 'Nuevo',     textColor: 'text-violet-500' },
  error:     { dot: 'bg-red-400',   label: 'Error',     textColor: 'text-red-500'    },
}

export default function BiometriaHistorialWidget({ registros, onSelectRegistro }: Props) {
  const total      = registros.length
  const matches    = registros.filter(r => r.resultado === 'match').length
  const pendientes = registros.filter(r => r.resultado === 'candidato' && !r.confirmado)
  const errores    = registros.filter(r => r.resultado === 'error')
  const precision  = total > 0 ? Math.round((matches / total) * 100) : 0

  return (
    <div className="flex flex-col gap-0">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-[13px] font-semibold text-stone-800 dark:text-stone-100">Historial del día</p>
        <div className="flex items-center gap-2">
          {pendientes.length > 0 && (
            <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/25 border border-amber-200 dark:border-amber-800/30 px-2 py-0.5 rounded-[6px]">
              {pendientes.length} pendiente{pendientes.length > 1 ? 's' : ''}
            </span>
          )}
          <span className="w-1.5 h-1.5 rounded-full bg-[#2FAF8F] animate-pulse"/>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[
          { label: 'Capturas',  value: total,          color: 'text-stone-800 dark:text-stone-100' },
          { label: 'Match',     value: matches,         color: 'text-[#2FAF8F]'  },
          { label: 'Precisión', value: `${precision}%`, color: precision >= 90 ? 'text-[#2FAF8F]' : 'text-amber-500' },
        ].map((s, i) => (
          <div key={i} className="bg-stone-50 dark:bg-[#141210] rounded-[8px] px-2 py-2.5 text-center border border-stone-100 dark:border-stone-800/40">
            <p className={`text-[18px] font-extrabold leading-none tabular-nums ${s.color}`}>{s.value}</p>
            <p className="text-[10.5px] text-stone-400 dark:text-stone-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Lista de registros ── */}
      <div className="bg-white dark:bg-[#1c1917] border border-stone-200/60 dark:border-stone-800/50 rounded-[12px] overflow-hidden">

        {/* Pendientes primero */}
        {pendientes.length > 0 && (
          <div className="border-b border-stone-100 dark:border-stone-800/40">
            <p className="text-[10.5px] font-semibold text-amber-500 uppercase tracking-[0.06em] px-4 pt-3 pb-1.5">
              Pendientes
            </p>
            {pendientes.map((r, i) => (
              <RegistroRow
                key={r.id}
                registro={r}
                onClick={onSelectRegistro}
                hasBorder={i < pendientes.length - 1}
                highlight
              />
            ))}
          </div>
        )}

        {/* Resto */}
        {registros
          .filter(r => !(r.resultado === 'candidato' && !r.confirmado))
          .map((r, i, arr) => (
            <RegistroRow
              key={r.id}
              registro={r}
              onClick={onSelectRegistro}
              hasBorder={i < arr.length - 1}
            />
          ))
        }

        {/* Empty state */}
        {registros.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2.5 py-10">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="text-stone-300 dark:text-stone-700">
              <path d="M2 7V5a2 2 0 0 1 2-2h2"/><path d="M22 7V5a2 2 0 0 0-2-2h-2"/>
              <path d="M2 17v2a2 2 0 0 0 2 2h2"/><path d="M22 17v2a2 2 0 0 1-2 2h-2"/>
              <circle cx="12" cy="12" r="3.5"/><path d="M12 4v1M12 19v1M4 12h1M19 12h1"/>
            </svg>
            <p className="text-[12.5px] text-stone-400 dark:text-stone-500">Sin capturas hoy</p>
          </div>
        )}
      </div>

      {/* Footer errores */}
      {errores.length > 0 && (
        <div className="mt-2 px-3 py-2 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30 rounded-[8px]">
          <p className="text-[11.5px] text-red-500 font-medium">
            {errores.length} captura{errores.length > 1 ? 's' : ''} con error
          </p>
        </div>
      )}
    </div>
  )
}

function RegistroRow({
  registro: r,
  onClick,
  hasBorder,
  highlight,
}: {
  registro:   RegistroCaptura
  onClick?:   (r: RegistroCaptura) => void
  hasBorder?: boolean
  highlight?: boolean
}) {
  const cfg = R[r.resultado]

  return (
    <div
      onClick={() => onClick?.(r)}
      className={`flex items-center gap-3 py-2.5 cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800/20 transition-colors rounded-[6px] px-1 ${
        hasBorder ? 'border-b border-stone-100 dark:border-stone-800/40' : ''
      } ${highlight ? 'bg-amber-50/40 dark:bg-amber-950/10' : ''}`}
    >
      {/* Dot estado */}
      <span className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot} ${r.resultado === 'candidato' && !r.confirmado ? 'animate-pulse' : ''}`}/>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[12.5px] font-semibold text-stone-700 dark:text-stone-200 truncate leading-tight">
          {r.resultado === 'nuevo' ? 'Sin registro' : r.animal}
          {r.resultado !== 'nuevo' && r.arete && (
            <span className="font-normal text-stone-400 dark:text-stone-500 ml-1.5">{r.arete}</span>
          )}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`text-[10.5px] font-medium ${cfg.textColor}`}>{cfg.label}</span>
          {r.confirmado && <span className="text-[10.5px] text-[#2FAF8F]">· Confirmado</span>}
          {r.lote && r.resultado !== 'nuevo' && (
            <span className="text-[10.5px] text-stone-400 dark:text-stone-500">L-{r.lote}</span>
          )}
        </div>
      </div>

      {/* Score + hora */}
      <div className="text-right shrink-0">
        {r.score > 0 && (
          <p className={`text-[13px] font-bold leading-tight tabular-nums ${cfg.textColor}`}>
            {Math.round(r.score * 100)}%
          </p>
        )}
        <p className="text-[10px] text-stone-400 dark:text-stone-500 mt-0.5">{r.ts}</p>
      </div>
    </div>
  )
}