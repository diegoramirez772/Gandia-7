/**
 * CertificationVencimientosWidget
 * Diseño institucional — lista por urgencia, sin cards por ítem.
 */
export interface Vencimiento {
  id:           number
  animal:       string
  arete:        string
  tipoCert:     string
  autoridad:    string
  fechaVence:   string
  diasRestantes: number
  lote?:        string
}

interface Props {
  vencimientos: Vencimiento[]
  onVerCert?:   (v: Vencimiento) => void
  onRenovar?:   (v: Vencimiento) => void
}

function urgCfg(dias: number) {
  if (dias < 0)   return { label: `Venció hace ${Math.abs(dias)}d`, color: '#e11d48', group: 'Vencidos'        }
  if (dias <= 7)  return { label: `${dias}d`,                       color: '#e11d48', group: 'Esta semana'     }
  if (dias <= 30) return { label: `${dias}d`,                       color: '#d97706', group: 'Próximos 30 días'}
  return                 { label: `${dias}d`,                       color: '#a8a29e', group: 'Vigentes'        }
}

export default function CertificationVencimientosWidget({ vencimientos, onVerCert, onRenovar }: Props) {
  const sorted   = [...vencimientos].sort((a, b) => a.diasRestantes - b.diasRestantes)
  const vencidos = sorted.filter(v => v.diasRestantes < 0)
  const urgentes = sorted.filter(v => v.diasRestantes >= 0 && v.diasRestantes <= 7)
  const proximos = sorted.filter(v => v.diasRestantes > 7  && v.diasRestantes <= 30)
  const ok       = sorted.filter(v => v.diasRestantes > 30)

  const totalUrgentes = vencidos.length + urgentes.length

  const renderGroup = (items: Vencimiento[], titulo: string) => {
    if (!items.length) return null
    return (
      <div key={titulo}>
        <p className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest py-2.5 mt-1 first:mt-0">{titulo}</p>
        <div className="divide-y divide-stone-100 dark:divide-stone-800/40">
          {items.map(v => {
            const cfg = urgCfg(v.diasRestantes)
            return (
              <div key={v.id}
                onClick={() => onVerCert?.(v)}
                className="flex items-center gap-4 py-3.5 px-1 cursor-pointer hover:bg-stone-50/60 dark:hover:bg-[#1a1917]/60 transition-colors rounded">

                {/* Días restantes — número hero pequeño */}
                <div className="w-10 shrink-0 text-right">
                  <p className="text-[14px] font-black leading-none tabular-nums" style={{ color: cfg.color }}>
                    {v.diasRestantes < 0 ? `-${Math.abs(v.diasRestantes)}` : v.diasRestantes <= 30 ? v.diasRestantes : ''}
                  </p>
                  {v.diasRestantes <= 30 && (
                    <p className="text-[9px] text-stone-400 dark:text-stone-500 mt-0.5">días</p>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[12.5px] font-bold text-stone-700 dark:text-stone-200 truncate">
                    {v.animal || v.arete}
                  </p>
                  <p className="text-[11px] text-stone-400 dark:text-stone-500 truncate mt-0.5">
                    {v.tipoCert} · {v.autoridad}
                  </p>
                </div>

                {/* Fecha */}
                <div className="shrink-0 text-right">
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">{v.fechaVence}</p>
                  {onRenovar && v.diasRestantes <= 30 && (
                    <button onClick={e => { e.stopPropagation(); onRenovar(v) }}
                      className="text-[10px] font-semibold cursor-pointer border-0 bg-transparent p-0 mt-0.5 block ml-auto"
                      style={{ color: '#2FAF8F' }}>
                      Renovar →
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="pb-5 border-b border-stone-200/60 dark:border-stone-800/50">
        <p className="text-[11px] text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-2">Vencimientos</p>
        <div className="flex items-end gap-6">
          {vencidos.length > 0 && (
            <div>
              <p className="text-[32px] font-black leading-none tabular-nums" style={{ color: '#e11d48' }}>{vencidos.length}</p>
              <p className="text-[10px] text-stone-400 dark:text-stone-500 mt-1 uppercase tracking-widest">vencido{vencidos.length > 1 ? 's' : ''}</p>
            </div>
          )}
          {urgentes.length > 0 && (
            <div>
              <p className="text-[32px] font-black leading-none tabular-nums" style={{ color: '#e11d48' }}>{urgentes.length}</p>
              <p className="text-[10px] text-stone-400 dark:text-stone-500 mt-1 uppercase tracking-widest">esta semana</p>
            </div>
          )}
          {proximos.length > 0 && (
            <div>
              <p className="text-[32px] font-black leading-none tabular-nums" style={{ color: '#d97706' }}>{proximos.length}</p>
              <p className="text-[10px] text-stone-400 dark:text-stone-500 mt-1 uppercase tracking-widest">próximos</p>
            </div>
          )}
          {totalUrgentes === 0 && (
            <div>
              <p className="text-[32px] font-black leading-none tabular-nums" style={{ color: '#2FAF8F' }}>{ok.length}</p>
              <p className="text-[10px] text-stone-400 dark:text-stone-500 mt-1 uppercase tracking-widest">vigentes</p>
            </div>
          )}
        </div>
      </div>

      {renderGroup(vencidos, 'Vencidos')}
      {renderGroup(urgentes, 'Esta semana')}
      {renderGroup(proximos, 'Próximos 30 días')}
      {renderGroup(ok, 'Vigentes')}
    </div>
  )
}