/**
 * FichaPerfilesWidget — Widget: passport:perfiles
 * ARCHIVO → src/artifacts/Ficha/widgets/FichaPerfilesWidget.tsx
 */
import { useState } from 'react'

export type EstatusDoc = 'activo' | 'incompleto' | 'pendiente' | 'vencido'
export type EstatusBio = 'capturado' | 'pendiente' | 'sin-registrar'

export interface AnimalPerfil {
  id:        string
  nombre:    string
  arete:     string
  rfid?:     string
  raza:      string
  sexo:      'M' | 'H'
  lote:      string
  ficha:     EstatusDoc
  biometria: EstatusBio
  peso?:     string
  upp?:      string
}

interface Props {
  animales?:        AnimalPerfil[]   // ← optional: default MOCK_ANIMALES
  onSelectAnimal?:  (a: AnimalPerfil) => void
  onNuevo?:         () => void
}

type Filtro = 'todos' | 'activo' | 'incompleto' | 'sin-bio'

const FICHA_STYLE: Record<EstatusDoc, { dot: string; badge: string; label: string }> = {
  activo:     { dot: 'bg-[#2FAF8F]',                    badge: 'bg-[#2FAF8F]/10 text-[#2FAF8F] border-[#2FAF8F]/30',         label: 'Activo'     },
  incompleto: { dot: 'bg-amber-400',                    badge: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/40', label: 'Incompleto' },
  pendiente:  { dot: 'bg-stone-300 dark:bg-stone-600',  badge: 'bg-stone-50 dark:bg-[#141210] text-stone-400 dark:text-stone-500 border-stone-200 dark:border-stone-700/50',  label: 'Pendiente'  },
  vencido:    { dot: 'bg-red-400',                      badge: 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/40',           label: 'Vencido'    },
}

const BIO_STYLE: Record<EstatusBio, { icon: string; color: string; label: string }> = {
  'capturado':     { icon: '◉', color: 'text-[#2FAF8F]',                          label: 'Huella OK'     },
  'pendiente':     { icon: '◎', color: 'text-amber-400',                          label: 'Pendiente'     },
  'sin-registrar': { icon: '○', color: 'text-stone-300 dark:text-stone-600',      label: 'Sin captura'   },
}

const MOCK_ANIMALES: AnimalPerfil[] = [
  { id: '1', nombre: 'Lupita',    arete: '#0142', raza: 'Simmental', sexo: 'H', lote: 'A1', ficha: 'activo',     biometria: 'capturado',     peso: '485 kg' },
  { id: '2', nombre: 'Canela',    arete: '#0089', raza: 'Charolais', sexo: 'H', lote: 'B2', ficha: 'activo',     biometria: 'pendiente',     peso: '470 kg' },
  { id: '3', nombre: 'Presumida', arete: '#0203', raza: 'Simmental', sexo: 'H', lote: 'A1', ficha: 'incompleto', biometria: 'sin-registrar', peso: '502 kg' },
  { id: '4', nombre: 'Estrella',  arete: '#0117', raza: 'Hereford',  sexo: 'H', lote: 'B1', ficha: 'activo',     biometria: 'capturado',     peso: '460 kg' },
  { id: '5', nombre: 'Toro Rex',  arete: '#0055', raza: 'Brahman',   sexo: 'M', lote: 'C1', ficha: 'incompleto', biometria: 'sin-registrar', peso: '720 kg' },
  { id: '6', nombre: 'Paloma',    arete: '#0318', raza: 'Angus',     sexo: 'H', lote: 'A2', ficha: 'pendiente',  biometria: 'sin-registrar', peso: '445 kg' },
  { id: '7', nombre: 'Valentina', arete: '#0401', raza: 'Charolais', sexo: 'H', lote: 'B2', ficha: 'activo',     biometria: 'pendiente',     peso: '490 kg' },
  { id: '8', nombre: 'Don Bruno', arete: '#0022', raza: 'Simmental', sexo: 'M', lote: 'C2', ficha: 'vencido',    biometria: 'capturado',     peso: '690 kg' },
]

export default function FichaPerfilesWidget({
  animales = MOCK_ANIMALES,
  onSelectAnimal,
  onNuevo,
}: Props) {
  const [query,  setQuery]  = useState('')
  const [filtro, setFiltro] = useState<Filtro>('todos')

  const lower = query.toLowerCase()
  const filtered = animales.filter(a => {
    const matchQ = !query.trim() ||
      a.nombre.toLowerCase().includes(lower) ||
      a.arete.toLowerCase().includes(lower)  ||
      a.raza.toLowerCase().includes(lower)   ||
      a.lote.toLowerCase().includes(lower)
    const matchF =
      filtro === 'todos'      ? true :
      filtro === 'activo'     ? a.ficha === 'activo' :
      filtro === 'incompleto' ? (a.ficha === 'incompleto' || a.ficha === 'pendiente' || a.ficha === 'vencido') :
      filtro === 'sin-bio'    ? a.biometria === 'sin-registrar' : true
    return matchQ && matchF
  })

  const cntActivos     = animales.filter(a => a.ficha === 'activo').length
  const cntIncompletos = animales.filter(a => a.ficha !== 'activo').length
  const cntSinBio      = animales.filter(a => a.biometria === 'sin-registrar').length

  const FILTROS: { id: Filtro; label: string; count: number }[] = [
    { id: 'todos',      label: 'Todos',      count: animales.length },
    { id: 'activo',     label: 'Activos',    count: cntActivos      },
    { id: 'incompleto', label: 'Pendientes', count: cntIncompletos  },
    { id: 'sin-bio',    label: 'Sin huella', count: cntSinBio       },
  ]

  return (
    <div className="flex flex-col gap-3">

      {/* ── Stats rápidas ── */}
      <div className="grid grid-cols-3 gap-2.5">
        {[
          { label: 'Registrados', value: animales.length, color: 'text-stone-800 dark:text-stone-100' },
          { label: 'Activos',     value: cntActivos,       color: 'text-[#2FAF8F]' },
          { label: 'Sin huella',  value: cntSinBio,        color: cntSinBio > 0 ? 'text-amber-500' : 'text-stone-400 dark:text-stone-500' },
        ].map((s, i) => (
          <div key={i} className="bg-white dark:bg-[#1c1917] border border-stone-200/70 dark:border-stone-800/60 rounded-[12px] px-3.5 py-3 text-center">
            <p className={`text-[26px] font-extrabold leading-none tabular-nums ${s.color}`}>{s.value}</p>
            <p className="text-[10.5px] text-stone-400 dark:text-stone-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Búsqueda ── */}
      <div className="relative">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500 pointer-events-none"
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Buscar por nombre, arete, raza o lote…"
          className="w-full h-11 pl-10 pr-4 rounded-[10px] border border-stone-200/70 dark:border-stone-800/60 bg-white dark:bg-[#1c1917] text-[13px] text-stone-700 dark:text-stone-200 placeholder:text-stone-400 dark:placeholder:text-stone-500 outline-none focus:border-[#2FAF8F]/50 focus:ring-2 focus:ring-[#2FAF8F]/08 transition-all"
        />
        {query && (
          <button onClick={() => setQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-500 transition-colors border-0 bg-transparent cursor-pointer p-0">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        )}
      </div>

      {/* ── Filtros ── */}
      <div className="flex gap-1.5 flex-wrap">
        {FILTROS.map(f => {
          const active = filtro === f.id
          return (
            <button
              key={f.id}
              onClick={() => setFiltro(f.id)}
              className={`flex items-center gap-1.5 h-8 px-3.5 rounded-full text-[12px] font-medium transition-all cursor-pointer border ${
                active
                  ? 'bg-stone-800 dark:bg-stone-100 text-white dark:text-stone-800 border-transparent'
                  : 'bg-white dark:bg-[#1c1917] text-stone-500 dark:text-stone-400 border-stone-200 dark:border-stone-700/60 hover:border-stone-300 dark:hover:border-stone-600'
              }`}
            >
              {f.label}
              <span className={`text-[10px] font-bold tabular-nums ${active ? 'opacity-70' : 'opacity-45'}`}>{f.count}</span>
            </button>
          )
        })}
        {onNuevo && (
          <button
            onClick={onNuevo}
            className="flex items-center gap-1.5 h-8 px-3.5 rounded-full text-[12px] font-semibold bg-[#2FAF8F] hover:bg-[#27a07f] text-white border-0 cursor-pointer transition-colors ml-auto"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Nueva ficha
          </button>
        )}
      </div>

      {/* ── Lista de animales ── */}
      <div className="bg-white dark:bg-[#1c1917] border border-stone-200/70 dark:border-stone-800/60 rounded-[14px] overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2.5 py-10">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" className="text-stone-300 dark:text-stone-700">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <p className="text-[12.5px] text-stone-400 dark:text-stone-500">
              {query ? `Sin resultados para "${query}"` : 'Sin animales registrados'}
            </p>
          </div>
        ) : (
          filtered.map((a, i) => {
            const fs = FICHA_STYLE[a.ficha]
            const bs = BIO_STYLE[a.biometria]
            return (
              <div
                key={a.id}
                onClick={() => onSelectAnimal?.(a)}
                className={`flex items-center gap-3.5 px-4 py-3.5 cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800/20 transition-colors active:bg-stone-100 dark:active:bg-stone-800/40 ${
                  i < filtered.length - 1 ? 'border-b border-stone-100 dark:border-stone-800/40' : ''
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${fs.dot}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-[13.5px] font-bold text-stone-800 dark:text-stone-100 leading-tight">{a.nombre}</p>
                    <p className="text-[12px] font-mono text-stone-400 dark:text-stone-500">{a.arete}</p>
                  </div>
                  <p className="text-[11.5px] text-stone-400 dark:text-stone-500 mt-0.5">
                    {a.raza} · L-{a.lote} · {a.sexo === 'M' ? 'Macho' : 'Hembra'}
                    {a.peso && <span> · {a.peso}</span>}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-[5px] border ${fs.badge}`}>
                    {fs.label}
                  </span>
                  <span className={`text-[10.5px] font-medium flex items-center gap-1 ${bs.color}`}>
                    <span className="text-[9px]">{bs.icon}</span>
                    {bs.label}
                  </span>
                </div>
                <svg className="w-4 h-4 text-stone-300 dark:text-stone-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </div>
            )
          })
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-1">
        <p className="text-[11px] text-stone-400 dark:text-stone-500">
          {filtered.length} de {animales.length} animales
        </p>
        {cntSinBio > 0 && (
          <button
            onClick={() => setFiltro('sin-bio')}
            className="text-[11px] text-amber-500 font-medium hover:text-amber-600 transition-colors cursor-pointer border-0 bg-transparent p-0"
          >
            {cntSinBio} sin huella de morro →
          </button>
        )}
      </div>
    </div>
  )
}