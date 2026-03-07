/**
 * CertificationPerfilesWidget
 * Diseño institucional — lista tipo tabla, sin cards apiladas, color mínimo.
 */
export type CertEstado = 'listo' | 'casi' | 'bloqueado'

export interface CertAnimalItem {
  arete:       string
  nombre?:     string
  lote:        string
  corral?:     string
  estado:      CertEstado
  score:       number
  tipoCert:    string
  diasVence?:  number
  bloqueantes?: number
  pendientes?:  number
}

interface Props {
  animales:  CertAnimalItem[]
  selected?: CertAnimalItem | null
  onSelect:  (item: CertAnimalItem) => void
}

const EST: Record<CertEstado, { label: string; color: string }> = {
  listo:    { label: 'Listo',     color: '#2FAF8F' },
  casi:     { label: 'Casi',      color: '#d97706' },
  bloqueado:{ label: 'Bloqueado', color: '#e11d48' },
}

export default function CertificationPerfilesWidget({ animales, selected, onSelect }: Props) {
  const listos    = animales.filter(a => a.estado === 'listo').length
  const casi      = animales.filter(a => a.estado === 'casi').length
  const bloq      = animales.filter(a => a.estado === 'bloqueado').length

  return (
    <div className="flex flex-col">

      {/* KPI row — editorial, sin cajas */}
      <div className="flex items-end gap-8 pb-5 border-b border-stone-200/60 dark:border-stone-800/50 mb-0">
        {[
          { n: listos, label: 'listos',    color: '#2FAF8F' },
          { n: casi,   label: 'casi',      color: '#d97706' },
          { n: bloq,   label: 'bloqueados',color: bloq > 0 ? '#e11d48' : '#a8a29e' },
        ].map((s, i) => (
          <div key={i}>
            <p className="text-[32px] font-black leading-none tabular-nums" style={{ color: s.color }}>{s.n}</p>
            <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-1 uppercase tracking-widest">{s.label}</p>
          </div>
        ))}
        <div className="ml-auto text-right">
          <p className="text-[13px] font-semibold text-stone-500 dark:text-stone-400">{animales.length} animales</p>
          <p className="text-[11px] text-stone-300 dark:text-stone-600 mt-0.5">expedientes</p>
        </div>
      </div>

      {/* Lista — tabla limpia, sin card por fila */}
      <div className="divide-y divide-stone-100 dark:divide-stone-800/40">
        {animales.map(item => {
          const cfg      = EST[item.estado]
          const isActive = selected?.arete === item.arete
          return (
            <button
              key={item.arete}
              onClick={() => onSelect(item)}
              className={`w-full text-left flex items-center gap-4 py-3.5 px-1 transition-colors cursor-pointer border-0
                ${isActive
                  ? 'bg-stone-50 dark:bg-[#1a1917]'
                  : 'bg-transparent hover:bg-stone-50/60 dark:hover:bg-[#1a1917]/60'
                }`}
            >
              {/* Score — número solo */}
              <div className="w-8 shrink-0 text-right">
                <p className="text-[16px] font-black tabular-nums leading-none" style={{ color: cfg.color }}>{item.score}</p>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <p className="font-mono text-[13px] font-bold text-stone-700 dark:text-stone-200">{item.arete}</p>
                  {item.nombre && <p className="text-[12px] text-stone-400 dark:text-stone-500 truncate">{item.nombre}</p>}
                </div>
                <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-0.5 truncate">{item.tipoCert}</p>
              </div>

              {/* Derecha — estado + alertas */}
              <div className="shrink-0 text-right">
                <p className="text-[11.5px] font-semibold" style={{ color: cfg.color }}>{cfg.label}</p>
                {(item.diasVence !== undefined && item.diasVence <= 30) && (
                  <p className={`text-[10px] mt-0.5 font-medium ${item.diasVence <= 0 ? 'text-rose-500' : item.diasVence <= 14 ? 'text-amber-500' : 'text-stone-400'}`}>
                    {item.diasVence <= 0 ? 'vencido' : `${item.diasVence}d`}
                  </p>
                )}
                {(item.bloqueantes ?? 0) > 0 && (
                  <p className="text-[10px] text-rose-500 mt-0.5">{item.bloqueantes} bloq.</p>
                )}
              </div>

              {/* Chevron */}
              <svg className="w-3.5 h-3.5 shrink-0 text-stone-300 dark:text-stone-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          )
        })}
      </div>
    </div>
  )
}