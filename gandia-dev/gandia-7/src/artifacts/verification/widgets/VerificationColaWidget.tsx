/**
 * VerificationColaWidget — Widget: verification:cola
 * Cola de acciones pendientes de verificación humana.
 */

export interface ItemVerificacion {
  id:         number
  ts:         string
  origen:     'ia' | 'usuario'
  actor:      string
  dominio:    string
  accion:     string
  animal?:    string
  arete?:     string
  severidad:  'alta' | 'media' | 'baja'
  estado:     'pendiente' | 'verificado' | 'rechazado'
}

interface Props {
  items:          ItemVerificacion[]
  onSelectItem?:  (item: ItemVerificacion) => void
}

const DOMINIO_LABEL: Record<string, string> = {
  monitoreo:     'Monitoreo',
  sanidad:       'Sanidad',
  certificacion: 'Certificación',
  gemelo:        'Gemelo',
  biometria:     'Biometría',
  pasaporte:     'Pasaporte',
}

// Solo dots — sin badges de colores
const SEV_DOT: Record<string, string> = {
  alta:  'bg-red-400',
  media: 'bg-amber-400',
  baja:  'bg-stone-300 dark:bg-stone-600',
}

export default function VerificationColaWidget({ items, onSelectItem }: Props) {
  const pendientes = items.filter(i => i.estado === 'pendiente')
  const altaCount  = pendientes.filter(i => i.severidad === 'alta').length

  return (
    <div className="flex flex-col h-full">

      {/* Header — solo texto, sin pills */}
      <div className="pb-4 shrink-0">
        <div className="flex items-baseline gap-2">
          <p className="text-[22px] font-semibold tracking-tight text-stone-800 dark:text-stone-100 leading-none">
            {pendientes.length}
          </p>
          <p className="text-[13px] text-stone-400 dark:text-stone-500">
            {pendientes.length === 1 ? 'acción pendiente' : 'acciones pendientes'}
            {altaCount > 0 && (
              <span className="text-red-400 dark:text-red-500 ml-1.5">· {altaCount} urgente{altaCount > 1 ? 's' : ''}</span>
            )}
          </p>
        </div>
      </div>

      {/* Divisor */}
      <div className="h-px bg-stone-100 dark:bg-stone-800/60 shrink-0 mb-1" />

      {/* Lista — rows, no cards */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        {pendientes.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 py-16">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-stone-200 dark:text-stone-700">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <p className="text-[12px] text-stone-300 dark:text-stone-600">Todo verificado</p>
          </div>
        )}

        {pendientes.map((item, idx) => (
          <div key={item.id}>
            <div
              onClick={() => onSelectItem?.(item)}
              className="group flex items-start gap-3.5 px-0 py-3.5 cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800/30 rounded-[10px] -mx-1 px-1 transition-colors"
            >
              {/* Dot de severidad */}
              <div className="pt-[5px] shrink-0">
                <span className={`block w-[7px] h-[7px] rounded-full ${SEV_DOT[item.severidad]}`} />
              </div>

              {/* Contenido */}
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-stone-700 dark:text-stone-200 leading-snug mb-1 group-hover:text-stone-900 dark:group-hover:text-stone-100 transition-colors">
                  {item.accion}
                </p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {/* Origen — solo texto */}
                  <span className="text-[11px] text-stone-400 dark:text-stone-500">
                    {item.origen === 'ia' ? 'IA' : 'Usuario'}
                  </span>
                  <span className="text-stone-200 dark:text-stone-700 text-[10px]">·</span>
                  <span className="text-[11px] text-stone-400 dark:text-stone-500">
                    {DOMINIO_LABEL[item.dominio] ?? item.dominio}
                  </span>
                  {item.animal && (
                    <>
                      <span className="text-stone-200 dark:text-stone-700 text-[10px]">·</span>
                      <span className="text-[11px] text-stone-400 dark:text-stone-500">{item.animal}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Timestamp + flecha */}
              <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                <span className="text-[10px] text-stone-300 dark:text-stone-600">{item.ts}</span>
                <svg
                  width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round"
                  className="text-stone-200 dark:text-stone-700 group-hover:text-stone-400 dark:group-hover:text-stone-500 transition-colors"
                >
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </div>
            </div>

            {/* Separador entre items — no al final */}
            {idx < pendientes.length - 1 && (
              <div className="h-px bg-stone-100 dark:bg-stone-800/40 mx-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}