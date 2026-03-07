/**
 * VerificationHistorialWidget — Widget: verification:historial
 * Todo lo que ya pasó por el filtro humano.
 */

export interface ItemHistorial {
  id:           number
  ts:           string
  tsFormal:     string
  origen:       'ia' | 'usuario'
  actor:        string
  verificador:  string
  accion:       string
  animal?:      string
  arete?:       string
  dominio:      string
  resultado:    'verificado' | 'rechazado'
  observacion?: string
}

interface Props {
  historial: ItemHistorial[]
}

const DOMINIO_LABEL: Record<string, string> = {
  monitoreo:     'Monitoreo',
  sanidad:       'Sanidad',
  certificacion: 'Certificación',
  gemelo:        'Gemelo',
  biometria:     'Biometría',
  pasaporte:     'Pasaporte',
}

export default function VerificationHistorialWidget({ historial }: Props) {
  const verificados = historial.filter(i => i.resultado === 'verificado').length
  const rechazados  = historial.filter(i => i.resultado === 'rechazado').length

  return (
    <div className="flex flex-col h-full">

      {/* Header */}
      <div className="pb-4 shrink-0">
        <div className="flex items-baseline gap-2">
          <p className="text-[22px] font-semibold tracking-tight text-stone-800 dark:text-stone-100 leading-none">
            {historial.length}
          </p>
          <p className="text-[13px] text-stone-400 dark:text-stone-500">
            {historial.length === 1 ? 'verificación' : 'verificaciones'}
            {rechazados > 0 && (
              <span className="text-red-400 dark:text-red-500 ml-1.5">· {rechazados} rechazada{rechazados > 1 ? 's' : ''}</span>
            )}
          </p>
        </div>
      </div>

      <div className="h-px bg-stone-100 dark:bg-stone-800/60 shrink-0 mb-1" />

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto">
        {historial.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 py-16">
            <p className="text-[12px] text-stone-300 dark:text-stone-600">Sin verificaciones aún</p>
          </div>
        )}

        <div className="relative">
          {/* Línea vertical del timeline */}
          {historial.length > 1 && (
            <div className="absolute left-[10px] top-[14px] bottom-6 w-px bg-stone-100 dark:bg-stone-800/60" />
          )}

          {historial.map((item, idx) => {
            const esVerif = item.resultado === 'verificado'
            return (
              <div key={item.id} className="relative flex gap-4 pb-5">

                {/* Icono del resultado */}
                <div className="shrink-0 mt-0.5 z-10">
                  <div className={`w-[21px] h-[21px] rounded-full flex items-center justify-center ${
                    esVerif
                      ? 'bg-[#2FAF8F]/12 dark:bg-[#2FAF8F]/20'
                      : 'bg-red-50 dark:bg-red-950/30'
                  }`}>
                    {esVerif
                      ? <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#2FAF8F" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      : <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    }
                  </div>
                </div>

                {/* Contenido */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-[13px] font-medium text-stone-700 dark:text-stone-200 leading-snug">
                      {item.accion}
                    </p>
                    <span className="text-[10px] text-stone-300 dark:text-stone-600 shrink-0 mt-0.5">{item.ts}</span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap mb-2">
                    <span className="text-[11px] text-stone-400 dark:text-stone-500">
                      {DOMINIO_LABEL[item.dominio] ?? item.dominio}
                    </span>
                    <span className="text-stone-200 dark:text-stone-700 text-[10px]">·</span>
                    <span className="text-[11px] text-stone-400 dark:text-stone-500">
                      {item.origen === 'ia' ? 'IA' : 'Usuario'}: {item.actor}
                    </span>
                    {item.animal && (
                      <>
                        <span className="text-stone-200 dark:text-stone-700 text-[10px]">·</span>
                        <span className="text-[11px] text-stone-400 dark:text-stone-500">{item.animal}</span>
                      </>
                    )}
                  </div>

                  {/* Verificador */}
                  <div className="flex items-center gap-1.5">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-stone-300 dark:text-stone-600 shrink-0">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                    <span className="text-[11px] text-stone-400 dark:text-stone-500">
                      {item.verificador}
                    </span>
                    <span className="text-stone-200 dark:text-stone-700 text-[10px]">·</span>
                    <span className="text-[11px] text-stone-300 dark:text-stone-600">{item.tsFormal}</span>
                  </div>

                  {/* Observación */}
                  {item.observacion && (
                    <div className="mt-2 pl-3 border-l-2 border-stone-100 dark:border-stone-800/60">
                      <p className="text-[11.5px] text-stone-400 dark:text-stone-500 leading-relaxed italic">
                        {item.observacion}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}