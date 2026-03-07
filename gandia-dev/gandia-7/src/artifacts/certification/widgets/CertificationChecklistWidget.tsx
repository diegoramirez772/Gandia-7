/**
 * CertificationChecklistWidget
 * Diseño institucional — tabla limpia, sin cards por ítem.
 */
export type CatRequisito = 'identidad' | 'sanitario' | 'documental' | 'legal'

export interface Requisito {
  id:        string
  categoria: CatRequisito
  label:     string
  desc:      string
  estado:    'ok' | 'pendiente' | 'faltante' | 'bloqueante'
  fuente?:   string
  accion?:   string
}

export interface DatosChecklist {
  tipoCert:   string
  autoridad:  string
  animal:     string
  arete:      string
  requisitos: Requisito[]
}

interface Props {
  datos:     DatosChecklist
  onAccion?: (reqId: string) => void
}

const CAT: Record<CatRequisito, string> = {
  identidad:  'Identidad',
  sanitario:  'Sanitario',
  documental: 'Documental',
  legal:      'Legal / Oficial',
}

const ICON: Record<string, { symbol: string; color: string }> = {
  ok:         { symbol: '✓', color: '#2FAF8F'  },
  pendiente:  { symbol: '◐', color: '#d97706'  },
  faltante:   { symbol: '○', color: '#d97706'  },
  bloqueante: { symbol: '✕', color: '#e11d48'  },
}

export default function CertificationChecklistWidget({ datos, onAccion }: Props) {
  const total = datos.requisitos.length
  const ok    = datos.requisitos.filter(r => r.estado === 'ok').length
  const pct   = Math.round((ok / total) * 100)
  const pctColor = pct === 100 ? '#2FAF8F' : pct >= 70 ? '#d97706' : '#e11d48'

  const categorias = (['identidad', 'sanitario', 'documental', 'legal'] as CatRequisito[])
    .filter(cat => datos.requisitos.some(r => r.categoria === cat))

  return (
    <div className="flex flex-col">

      {/* Header — hero numérico */}
      <div className="pb-5 border-b border-stone-200/60 dark:border-stone-800/50">
        <p className="text-[11px] text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-2">{datos.tipoCert} · {datos.autoridad}</p>
        <div className="flex items-end gap-3">
          <p className="text-[48px] font-black leading-none tabular-nums" style={{ color: pctColor }}>{ok}</p>
          <div className="pb-1">
            <p className="text-[16px] text-stone-300 dark:text-stone-600 leading-none">/{total}</p>
            <p className="text-[12px] text-stone-400 dark:text-stone-500 mt-0.5">completados</p>
          </div>
        </div>
        {/* Progress bar — simple */}
        <div className="mt-3 h-1 bg-stone-100 dark:bg-stone-800/50 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: pctColor }}/>
        </div>
        <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-1.5">
          {datos.animal} <span className="font-mono">{datos.arete}</span>
        </p>
      </div>

      {/* Tabla de requisitos */}
      {categorias.map(cat => {
        const reqs    = datos.requisitos.filter(r => r.categoria === cat)
        const catOk   = reqs.every(r => r.estado === 'ok')
        const catFail = reqs.filter(r => r.estado !== 'ok').length
        return (
          <div key={cat}>
            {/* Separador categoría */}
            <div className="flex items-center justify-between px-1 py-2.5 border-b border-stone-100 dark:border-stone-800/40">
              <p className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest">{CAT[cat]}</p>
              <p className="text-[10px] font-semibold" style={{ color: catOk ? '#2FAF8F' : '#d97706' }}>
                {catOk ? '✓ completo' : `${catFail} pendiente${catFail > 1 ? 's' : ''}`}
              </p>
            </div>

            {/* Rows */}
            <div className="divide-y divide-stone-100/80 dark:divide-stone-800/30">
              {reqs.map(req => {
                const ic = ICON[req.estado]
                return (
                  <div key={req.id} className="flex items-start gap-3 px-1 py-3">
                    <span className="text-[13px] font-black w-5 shrink-0 mt-0.5 text-center" style={{ color: ic.color }}>{ic.symbol}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[12px] leading-snug ${req.estado === 'ok' ? 'text-stone-600 dark:text-stone-300' : req.estado === 'bloqueante' ? 'text-rose-600 dark:text-rose-400 font-semibold' : 'text-amber-600 dark:text-amber-400 font-medium'}`}>
                        {req.label}
                      </p>
                      <p className="text-[10.5px] text-stone-400 dark:text-stone-500 mt-0.5 leading-snug">{req.desc}</p>
                      {req.fuente && (
                        <p className="text-[10px] text-stone-300 dark:text-stone-600 mt-0.5 font-mono">← {req.fuente}</p>
                      )}
                    </div>
                    {req.accion && req.estado !== 'ok' && onAccion && (
                      <button onClick={() => onAccion(req.id)}
                        className="shrink-0 text-[10.5px] font-semibold cursor-pointer border-0 bg-transparent p-0"
                        style={{ color: '#2FAF8F' }}>
                        {req.accion} →
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      <div className="pt-4 border-t border-stone-100 dark:border-stone-800/40 mt-1">
        <p className="text-[11px] text-stone-300 dark:text-stone-600 italic px-1">
          Certificación emitida por {datos.autoridad} · Gandia prepara el expediente
        </p>
      </div>
    </div>
  )
}