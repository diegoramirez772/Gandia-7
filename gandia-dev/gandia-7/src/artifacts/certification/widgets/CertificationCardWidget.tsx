/**
 * CertificationCardWidget
 * Diseño institucional — sin bg tints, estado como texto de color, datos limpios.
 */
export type EstadoCert = 'vigente' | 'por_vencer' | 'vencido' | 'en_proceso' | 'rechazado'

export interface DatosCertCard {
  id:             string
  tipo:           string
  autoridad:      string
  animal:         string
  arete:          string
  lote?:          string
  estado:         EstadoCert
  folio?:         string
  fechaEmision?:  string
  fechaVence?:    string
  diasParaVencer?: number
  completitud:    number
  expedidor?:     string
}

interface Props {
  data:        DatosCertCard
  onExpand?:   () => void
  onVerCheck?: () => void
}

const EST: Record<EstadoCert, { label: string; color: string }> = {
  vigente:    { label: 'Vigente',    color: '#2FAF8F' },
  por_vencer: { label: 'Por vencer', color: '#d97706' },
  vencido:    { label: 'Vencido',    color: '#e11d48' },
  en_proceso: { label: 'En proceso', color: '#3b82f6' },
  rechazado:  { label: 'Rechazado',  color: '#78716c' },
}

export default function CertificationCardWidget({ data, onExpand, onVerCheck }: Props) {
  const col = EST[data.estado]

  return (
    <div className="border border-stone-200/60 dark:border-stone-800/50 rounded-[12px] overflow-hidden bg-white dark:bg-[#1c1917]">

      {/* Header — tipo + estado en una línea */}
      <div className="px-4 py-3.5 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[13px] font-bold text-stone-700 dark:text-stone-200 leading-snug">{data.tipo}</p>
          <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-0.5">{data.autoridad}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[12px] font-bold" style={{ color: col.color }}>{col.label}</p>
          {data.folio && (
            <p className="font-mono text-[10px] text-stone-300 dark:text-stone-600 mt-0.5">{data.folio}</p>
          )}
        </div>
      </div>

      {/* Animal */}
      <div className="px-4 pb-3 border-b border-stone-100 dark:border-stone-800/40">
        <p className="text-[13px] font-bold text-stone-800 dark:text-stone-100">
          {data.animal} <span className="font-mono font-normal text-stone-400 dark:text-stone-500 text-[12px]">{data.arete}</span>
        </p>
        {data.lote && <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-0.5">{data.lote}</p>}
      </div>

      {/* Datos — row horizontal, sin cajas */}
      <div className="px-4 py-3 flex items-center gap-6 text-[11px]">
        {data.fechaEmision && (
          <div>
            <p className="text-stone-400 dark:text-stone-500 mb-0.5">Emisión</p>
            <p className="font-semibold text-stone-600 dark:text-stone-300">{data.fechaEmision}</p>
          </div>
        )}
        {data.fechaVence && (
          <div>
            <p className="text-stone-400 dark:text-stone-500 mb-0.5">Vence</p>
            <p className="font-semibold" style={{ color: data.estado === 'vencido' || data.estado === 'por_vencer' ? col.color : undefined }}>
              {data.fechaVence}
            </p>
          </div>
        )}
        <div>
          <p className="text-stone-400 dark:text-stone-500 mb-0.5">Expediente</p>
          <p className="font-bold" style={{ color: '#2FAF8F' }}>{data.completitud}%</p>
        </div>
        {data.expedidor && (
          <div className="ml-auto">
            <p className="text-stone-300 dark:text-stone-600 text-right">{data.expedidor}</p>
          </div>
        )}
      </div>

      {/* Acciones */}
      {(onVerCheck || onExpand) && (
        <div className="px-4 pb-3.5 flex items-center gap-2 justify-end">
          {onVerCheck && (
            <button onClick={onVerCheck}
              className="text-[11px] font-semibold text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 cursor-pointer border-0 bg-transparent p-0 transition-colors">
              Checklist
            </button>
          )}
          {onExpand && (
            <button onClick={onExpand}
              className="text-[11px] font-semibold cursor-pointer border-0 bg-transparent p-0 transition-colors"
              style={{ color: '#2FAF8F' }}>
              Ver expediente →
            </button>
          )}
        </div>
      )}
    </div>
  )
}