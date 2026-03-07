/**
 * VerificationInconsistenciasWidget — Widget: verification:inconsistencias
 * Acciones que llevan demasiado tiempo sin verificar,
 * o que fueron rechazadas sin seguimiento.
 */

export interface Inconsistencia {
  id:                number
  tipo:              'sin_verificar' | 'rechazado_sin_seguimiento' | 'conflicto'
  tiempoSinAtencion: string
  accion:            string
  actor:             string
  dominio:           string
  animal?:           string
  arete?:            string
  detalle:           string
  critico:           boolean
}

interface Props {
  inconsistencias: Inconsistencia[]
  onAtender?:      (id: number) => void
}

const DOMINIO_LABEL: Record<string, string> = {
  monitoreo:     'Monitoreo',
  sanidad:       'Sanidad',
  certificacion: 'Certificación',
  gemelo:        'Gemelo',
  biometria:     'Biometría',
  pasaporte:     'Pasaporte',
}

// Solo texto — sin colores de fondo
const TIPO_LABEL: Record<string, string> = {
  sin_verificar:              'Sin verificar',
  rechazado_sin_seguimiento:  'Sin seguimiento',
  conflicto:                  'Conflicto',
}

// Dot de color por tipo
const TIPO_DOT: Record<string, string> = {
  sin_verificar:              'bg-amber-400',
  rechazado_sin_seguimiento:  'bg-red-400',
  conflicto:                  'bg-purple-400',
}

export default function VerificationInconsistenciasWidget({ inconsistencias, onAtender }: Props) {
  const criticas = inconsistencias.filter(i => i.critico).length

  return (
    <div className="flex flex-col h-full">

      {/* Header */}
      <div className="pb-4 shrink-0">
        <div className="flex items-baseline gap-2">
          <p className="text-[22px] font-semibold tracking-tight text-stone-800 dark:text-stone-100 leading-none">
            {inconsistencias.length}
          </p>
          <p className="text-[13px] text-stone-400 dark:text-stone-500">
            {inconsistencias.length === 1 ? 'inconsistencia' : 'inconsistencias'}
            {criticas > 0 && (
              <span className="text-red-400 dark:text-red-500 ml-1.5">· {criticas} crítica{criticas > 1 ? 's' : ''}</span>
            )}
          </p>
        </div>
      </div>

      <div className="h-px bg-stone-100 dark:bg-stone-800/60 shrink-0 mb-1" />

      {/* Lista */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        {inconsistencias.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 py-16">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-stone-200 dark:text-stone-700">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <p className="text-[12px] text-stone-300 dark:text-stone-600">Sin inconsistencias</p>
          </div>
        )}

        {inconsistencias.map((inc, idx) => (
          <div key={inc.id}>
            <div className="flex items-start gap-3.5 py-3.5">

              {/* Dot */}
              <div className="pt-[5px] shrink-0">
                <span className={`block w-[7px] h-[7px] rounded-full ${TIPO_DOT[inc.tipo]}`} />
              </div>

              {/* Contenido */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-[13px] font-medium text-stone-700 dark:text-stone-200 leading-snug">
                    {inc.accion}
                  </p>
                  <span className="text-[10px] text-stone-300 dark:text-stone-600 shrink-0 mt-0.5 whitespace-nowrap">
                    {inc.tiempoSinAtencion}
                  </span>
                </div>

                {/* Metadatos de texto */}
                <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
                  <span className="text-[11px] text-stone-400 dark:text-stone-500">
                    {TIPO_LABEL[inc.tipo]}
                  </span>
                  <span className="text-stone-200 dark:text-stone-700 text-[10px]">·</span>
                  <span className="text-[11px] text-stone-400 dark:text-stone-500">
                    {DOMINIO_LABEL[inc.dominio] ?? inc.dominio}
                  </span>
                  {inc.animal && (
                    <>
                      <span className="text-stone-200 dark:text-stone-700 text-[10px]">·</span>
                      <span className="text-[11px] text-stone-400 dark:text-stone-500">{inc.animal}</span>
                    </>
                  )}
                  {inc.critico && (
                    <>
                      <span className="text-stone-200 dark:text-stone-700 text-[10px]">·</span>
                      <span className="text-[11px] font-medium text-red-400 dark:text-red-500">Crítico</span>
                    </>
                  )}
                </div>

                {/* Detalle */}
                <p className="text-[11.5px] text-stone-400 dark:text-stone-500 leading-relaxed mb-2">
                  {inc.detalle}
                </p>

                {/* Acción */}
                {onAtender && (
                  <button
                    onClick={() => onAtender(inc.id)}
                    className="text-[11.5px] font-medium text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer border-0 bg-transparent p-0 underline underline-offset-2 decoration-stone-200 dark:decoration-stone-700 hover:decoration-stone-400 dark:hover:decoration-stone-500 transition-all"
                  >
                    Atender →
                  </button>
                )}
              </div>
            </div>

            {idx < inconsistencias.length - 1 && (
              <div className="h-px bg-stone-100 dark:bg-stone-800/40" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}