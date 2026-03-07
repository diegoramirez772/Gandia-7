/**
 * BiometriaRegistrarWidget — Widget: biometria:registrar
 * ARCHIVO → src/artifacts/biometria/widgets/BiometriaRegistrarWidget.tsx
 *
 * Vincula pasaportes existentes con huella de morro.
 * Estados:
 *   sin-registrar → nunca se les ha capturado el morro
 *   pendiente     → captura realizada pero score bajo, requiere verificación humana
 * Los animales ya registrados no aparecen (no requieren acción).
 */
import { useState } from 'react'
import type { AnimalContext } from './BiometriaCapturaWidget'

type EstadoBiometrico = 'registrado' | 'pendiente' | 'sin-registrar'
type Filtro = 'todos' | 'sin-registrar' | 'pendiente'

interface AnimalPassport {
  id:        string
  nombre:    string
  arete:     string
  raza:      string
  lote:      string
  sexo:      'M' | 'H'
  biometria: EstadoBiometrico
}

interface Props {
  onIniciarCaptura?: (animal: AnimalContext) => void
  onCancelar?:       () => void
}

const ANIMALES_MOCK: AnimalPassport[] = [
  { id: 'p1', nombre: 'Lupita',    arete: '#0142', raza: 'Simmental', lote: 'A1', sexo: 'H', biometria: 'registrado'    },
  { id: 'p2', nombre: 'Canela',    arete: '#0089', raza: 'Charolais', lote: 'B2', sexo: 'H', biometria: 'pendiente'     },
  { id: 'p3', nombre: 'Presumida', arete: '#0203', raza: 'Simmental', lote: 'A1', sexo: 'H', biometria: 'registrado'    },
  { id: 'p4', nombre: 'Estrella',  arete: '#0117', raza: 'Hereford',  lote: 'B1', sexo: 'H', biometria: 'sin-registrar' },
  { id: 'p5', nombre: 'Toro Rex',  arete: '#0055', raza: 'Brahman',   lote: 'C1', sexo: 'M', biometria: 'sin-registrar' },
  { id: 'p6', nombre: 'Paloma',    arete: '#0318', raza: 'Angus',     lote: 'A2', sexo: 'H', biometria: 'sin-registrar' },
  { id: 'p7', nombre: 'Valentina', arete: '#0401', raza: 'Charolais', lote: 'B2', sexo: 'H', biometria: 'pendiente'     },
  { id: 'p8', nombre: 'Don Bruno', arete: '#0022', raza: 'Simmental', lote: 'C2', sexo: 'M', biometria: 'sin-registrar' },
]

const BIO: Record<EstadoBiometrico, { dot: string; label: string; hint: string; textColor: string }> = {
  'registrado':    { dot: 'bg-[#2FAF8F]',                   label: 'Registrado',    hint: '',                                           textColor: 'text-[#2FAF8F]'  },
  'pendiente':     { dot: 'bg-amber-400',                   label: 'Pendiente',     hint: 'Score bajo — necesita verificación humana',  textColor: 'text-amber-500'  },
  'sin-registrar': { dot: 'bg-stone-300 dark:bg-stone-600', label: 'Sin registrar', hint: 'Sin captura de morro todavía',               textColor: 'text-stone-400 dark:text-stone-500' },
}

export default function BiometriaRegistrarWidget({ onIniciarCaptura }: Props) {
  const [query,    setQuery]    = useState('')
  const [filtro,   setFiltro]   = useState<Filtro>('todos')
  const [expanded, setExpanded] = useState<string | null>(null)

  const getBio = (a: AnimalPassport): EstadoBiometrico => a.biometria

  // Solo animales que requieren acción
  const requierenAccion = ANIMALES_MOCK.filter(a => getBio(a) !== 'registrado')

  const lower = query.toLowerCase()
  const filtrado = requierenAccion.filter(a => {
    const matchFiltro = filtro === 'todos' || getBio(a) === filtro
    const matchQuery  = !query.trim() ||
      a.nombre.toLowerCase().includes(lower) ||
      a.arete.toLowerCase().includes(lower)  ||
      a.raza.toLowerCase().includes(lower)   ||
      a.lote.toLowerCase().includes(lower)
    return matchFiltro && matchQuery
  })

  const cntSinReg   = requierenAccion.filter(a => getBio(a) === 'sin-registrar').length
  const cntPendiente = requierenAccion.filter(a => getBio(a) === 'pendiente').length

  const FILTROS: { id: Filtro; label: string; count: number }[] = [
    { id: 'todos',        label: 'Todos',        count: requierenAccion.length },
    { id: 'sin-registrar',label: 'Sin registrar', count: cntSinReg             },
    { id: 'pendiente',    label: 'Pendiente',    count: cntPendiente           },
  ]

  return (
    <div className="flex flex-col gap-4">

      {/* ── Header ── */}
      <div>
        <p className="text-[13.5px] font-semibold text-stone-800 dark:text-stone-100 leading-tight">
          Vincular huella a pasaporte
        </p>
        <p className="text-[12px] text-stone-400 dark:text-stone-500 mt-0.5">
          Animales que requieren captura o verificación de morro
        </p>
      </div>

      {/* ── Búsqueda ── */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500 pointer-events-none"
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setExpanded(null) }}
          placeholder="Buscar por nombre, arete, raza o lote…"
          className="w-full h-10 pl-9 pr-8 rounded-[8px] border border-stone-200 dark:border-stone-700/60 bg-white dark:bg-[#1c1917] text-[12.5px] text-stone-700 dark:text-stone-300 placeholder:text-stone-400 dark:placeholder:text-stone-500 outline-none focus:border-[#2FAF8F]/50 focus:ring-2 focus:ring-[#2FAF8F]/10 transition-all"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-500 dark:text-stone-600 dark:hover:text-stone-400 transition-colors cursor-pointer bg-transparent border-0 p-0"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        )}
      </div>

      {/* ── Filtros ── */}
      <div className="flex gap-1.5">
        {FILTROS.map(f => {
          const active = filtro === f.id
          const activeStyle = f.id === 'pendiente'
            ? 'bg-amber-500 text-white border-transparent'
            : 'bg-stone-800 dark:bg-stone-100 text-white dark:text-stone-800 border-transparent'
          const inactiveStyle = 'bg-white dark:bg-[#1c1917] text-stone-500 dark:text-stone-400 border-stone-200 dark:border-stone-700/60 hover:border-stone-300 dark:hover:border-stone-600'
          return (
            <button
              key={f.id}
              onClick={() => { setFiltro(f.id); setExpanded(null) }}
              className={`flex items-center gap-1.5 h-7 px-3 rounded-full text-[11.5px] font-medium transition-all cursor-pointer border ${active ? activeStyle : inactiveStyle}`}
            >
              {f.label}
              <span className={`text-[10px] font-bold tabular-nums ${active ? 'opacity-80' : 'opacity-50'}`}>
                {f.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* ── Lista ── */}
      <div className="bg-white dark:bg-[#1c1917] border border-stone-200/60 dark:border-stone-800/50 rounded-[12px] overflow-hidden">
        {filtrado.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-10">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" className="text-stone-300 dark:text-stone-700">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <p className="text-[12.5px] text-stone-400 dark:text-stone-500 text-center px-4">
              {query
                ? `Sin resultados para "${query}"`
                : '¡Todo al día! Todos los animales tienen huella registrada'}
            </p>
          </div>
        ) : (
          filtrado.map((a, i) => {
            const bio        = getBio(a)
            const cfg        = BIO[bio]
            const isExpanded = expanded === a.id

            return (
              <div key={a.id} className={i < filtrado.length - 1 ? 'border-b border-stone-100 dark:border-stone-800/40' : ''}>

                {/* Fila */}
                <div
                  onClick={() => setExpanded(isExpanded ? null : a.id)}
                  className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-colors hover:bg-stone-50 dark:hover:bg-stone-800/20 ${
                    isExpanded ? 'bg-stone-50 dark:bg-stone-800/20' : ''
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot} ${bio === 'pendiente' ? 'animate-pulse' : ''}`}/>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-[13px] font-semibold text-stone-800 dark:text-stone-100 leading-tight">{a.nombre}</p>
                      <p className="text-[12px] text-stone-400 dark:text-stone-500">{a.arete}</p>
                    </div>
                    <p className="text-[11.5px] text-stone-400 dark:text-stone-500 mt-0.5">
                      {a.raza} · Lote {a.lote} · {a.sexo === 'M' ? 'Macho' : 'Hembra'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                      <p className={`text-[11.5px] font-medium ${cfg.textColor}`}>{cfg.label}</p>
                      {bio === 'pendiente' && (
                        <p className="text-[10px] text-amber-400/80 leading-tight">Verificar</p>
                      )}
                    </div>
                    <svg
                      className={`w-4 h-4 text-stone-300 dark:text-stone-600 transition-transform duration-150 ${isExpanded ? 'rotate-180' : ''}`}
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </div>
                </div>

                {/* Panel expandido */}
                {isExpanded && (
                  <div className="px-4 pb-3.5 pt-3 bg-stone-50 dark:bg-stone-800/20 border-t border-stone-100 dark:border-stone-800/40 flex flex-col gap-2.5">
                    {cfg.hint && (
                      <p className="text-[11.5px] text-stone-400 dark:text-stone-500">{cfg.hint}</p>
                    )}
                    <button
                      onClick={() => onIniciarCaptura?.(a)}
                      className="w-full h-9 bg-[#2FAF8F] hover:bg-[#27a07f] text-white text-[12.5px] font-semibold rounded-[8px] border-0 cursor-pointer transition-colors flex items-center justify-center gap-2 active:scale-[0.98]">
                      {bio === 'pendiente' ? 'Volver a capturar' : 'Capturar huella'}
                    </button>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between">
        <p className="text-[11.5px] text-stone-400 dark:text-stone-500">
          {filtrado.length} animal{filtrado.length !== 1 ? 'es' : ''} pendiente{filtrado.length !== 1 ? 's' : ''}
        </p>
        <button className="text-[11.5px] text-stone-400 dark:text-stone-500 hover:text-[#2FAF8F] transition-colors cursor-pointer bg-transparent border-0 p-0">
          Ir a Pasaportes →
        </button>
      </div>

    </div>
  )
}