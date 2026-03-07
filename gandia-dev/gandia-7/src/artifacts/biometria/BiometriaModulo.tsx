/**
 * BiometriaModulo.tsx
 * Nivel Módulo del dominio Biometría.
 *
 * ARCHIVO NUEVO → src/artifacts/biometria/BiometriaModulo.tsx
 *
 * Patrón idéntico a MonitoreoModulo.tsx.
 * Tabs: Captura · Resultado · Historial · Registrar
 */

import { useState, useCallback } from 'react'

import BiometriaCapturaWidget,      { type CapturaResult }       from './widgets/BiometriaCapturaWidget'
import BiometriaResultadoWidget,    { type BiometriaResultado,
                                     type AnimalMatch }           from './widgets/BiometriaResultadoWidget'
import BiometriaHistorialWidget,    { type RegistroCaptura }      from './widgets/BiometriaHistorialWidget'
import BiometriaEstadisticasWidget                                from './widgets/BiometriaEstadisticasWidget'
import BiometriaConfigWidget                                      from './widgets/BiometriaConfigWidget'
import BiometriaRegistrarWidget from './widgets/BiometriaRegistrarWidget'
import type { AnimalContext } from './widgets/BiometriaCapturaWidget'

// ─── TIPOS ────────────────────────────────────────────────────────────────────

type ModuleWidget =
  | 'biometria:captura'
  | 'biometria:resultado'
  | 'biometria:historial'
  | 'biometria:registrar'
  | 'biometria:estadisticas'
  | 'biometria:config'

type Tab = 'captura' | 'historial' | 'registrar' | 'estadisticas' | 'config'

interface Props {
  onClose:    () => void
  onEscalate: () => void
}

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const MOCK_REGISTROS: RegistroCaptura[] = [
  { id: 1, ts: 'hace 5 min',  animal: 'Lupita',   arete: '#0142', lote: 'A1', score: 0.94, resultado: 'match',     modo: 'direct', confirmado: true  },
  { id: 2, ts: 'hace 18 min', animal: 'Canela',   arete: '#0089', lote: 'B2', score: 0.83, resultado: 'candidato', modo: 'direct', confirmado: false },
  { id: 3, ts: 'hace 31 min', animal: 'Presumida',arete: '#0203', lote: 'A1', score: 0.91, resultado: 'match',     modo: 'sheet',  confirmado: true  },
  { id: 4, ts: 'hace 1 hr',   animal: '—',        arete: '—',     lote: '—',  score: 0,    resultado: 'nuevo',     modo: 'direct', confirmado: false },
]

const MOCK_CANDIDATOS: AnimalMatch[] = [
  { id: 'c1', nombre: 'Canela',    raza: 'Charolais',  lote: 'B2', arete: '#0089', score: 0.83, scoreCV: 0.80, scoreIA: 0.87 },
  { id: 'c2', nombre: 'Estrella',  raza: 'Hereford',   lote: 'B1', arete: '#0117', score: 0.76, scoreCV: 0.74, scoreIA: 0.79 },
]

const TAB_DEFAULT: Record<Tab, ModuleWidget> = {
  captura:      'biometria:captura',
  historial:    'biometria:historial',
  registrar:    'biometria:registrar',
  estadisticas: 'biometria:estadisticas',
  config:       'biometria:config',
}

const TABS: { id: Tab; label: string }[] = [
  { id: 'captura',      label: 'Captura'      },
  { id: 'historial',    label: 'Historial'    },
  { id: 'registrar',    label: 'Registrar'    },
  { id: 'estadisticas', label: 'Estadísticas' },
  { id: 'config',       label: 'Config'       },
]

// ─── COMPONENTE ───────────────────────────────────────────────────────────────

export default function BiometriaModulo({ onClose, onEscalate }: Props) {
  const [activeTab,    setActiveTab]    = useState<Tab>('captura')
  const [activeWidget, setActiveWidget] = useState<ModuleWidget>('biometria:captura')
  const [registros,    setRegistros]    = useState<RegistroCaptura[]>(MOCK_REGISTROS)
  const [resultado,    setResultado]    = useState<BiometriaResultado | null>(null)
  const [offlineQueue] = useState(0)
  const [registrandoAnimal, setRegistrandoAnimal] = useState<AnimalContext | null>(null)

  const pendientes = registros.filter(r => r.resultado === 'candidato' && !r.confirmado).length

  const handleTabChange = useCallback((tab: Tab) => {
    setActiveTab(tab)
    setActiveWidget(TAB_DEFAULT[tab])
  }, [])

  // Cuando BiometriaCapturaWidget entrega una imagen
  const handleCaptura = useCallback((capturaResult: CapturaResult) => {
    // Simular análisis: score alto → match, medio → candidato, 0 → nuevo
    const score = capturaResult.quality
    const res: BiometriaResultado =
      score >= 0.88
        ? {
            tipo: 'match',
            captura: capturaResult.imageDataUrl,
            modo: capturaResult.mode,
            ms: Math.round(800 + Math.random() * 600),
            match: { id: 'm1', nombre: 'Lupita', raza: 'Simmental', lote: 'A1', arete: '#0142', score, scoreCV: score - 0.03, scoreIA: score + 0.02 },
          }
        : score >= 0.72
        ? {
            tipo: 'candidato',
            captura: capturaResult.imageDataUrl,
            modo: capturaResult.mode,
            ms: Math.round(900 + Math.random() * 700),
            candidatos: MOCK_CANDIDATOS,
          }
        : {
            tipo: 'nuevo',
            captura: capturaResult.imageDataUrl,
            modo: capturaResult.mode,
            ms: Math.round(700 + Math.random() * 500),
          }

    setResultado(res)
    setActiveTab('captura')
    setActiveWidget('biometria:resultado')

    // Agregar al historial
    const resultadoTipo: 'match' | 'candidato' | 'nuevo' =
      res.tipo === 'match' ? 'match' : res.tipo === 'candidato' ? 'candidato' : 'nuevo'
    setRegistros(prev => [{
      id:         Date.now(),
      ts:         'ahora',
      animal:     res.tipo === 'match' ? (res.match?.nombre ?? '—') : res.tipo === 'candidato' ? '?' : '—',
      arete:      res.tipo === 'match' ? (res.match?.arete ?? '—') : '—',
      lote:       res.tipo === 'match' ? (res.match?.lote ?? '—') : '—',
      score,
      resultado:  resultadoTipo,
      modo:       capturaResult.mode,
      confirmado: false,
    }, ...prev])
  }, [])

  const handleConfirmar = useCallback((animal: AnimalMatch) => {
    setRegistros(prev => prev.map((r, i) => i === 0 ? { ...r, animal: animal.nombre, arete: animal.arete, confirmado: true } : r))
    setActiveWidget('biometria:historial')
    setActiveTab('historial')
    setRegistrandoAnimal(null)
  }, [])

  const handleRechazar = useCallback(() => {
    setActiveWidget('biometria:captura')
    setActiveTab('captura')
  }, [])

  const handleNueva = useCallback(() => {
    setActiveWidget('biometria:captura')
    setActiveTab('captura')
    setRegistrandoAnimal(null)
  }, [])

  const handleIniciarCaptura = useCallback((animal: AnimalContext) => {
    setRegistrandoAnimal(animal)
    setActiveWidget('biometria:captura')
    setActiveTab('captura')
  }, [])

  // ── Widget activo ─────────────────────────────────────────────────────────

  const renderWidget = () => {
    switch (activeWidget) {

      case 'biometria:captura':
        return (
          <BiometriaCapturaWidget
            onCaptura={handleCaptura}
            offlineQueue={offlineQueue}
            animalContext={registrandoAnimal ?? undefined}
          />
        )

      case 'biometria:resultado':
        return resultado ? (
          <BiometriaResultadoWidget
            resultado={resultado}
            onConfirmar={handleConfirmar}
            onRechazar={handleRechazar}
            onRegistrar={() => setActiveWidget('biometria:registrar')}
            onNueva={handleNueva}
          />
        ) : null

      case 'biometria:historial':
        return (
          <BiometriaHistorialWidget
            registros={registros}
            onSelectRegistro={r => {
              if (r.resultado === 'candidato' && !r.confirmado) {
                setActiveWidget('biometria:resultado')
                setActiveTab('captura')
              }
            }}
          />
        )

      case 'biometria:registrar':
        return <BiometriaRegistrarWidget onIniciarCaptura={handleIniciarCaptura} />

      case 'biometria:estadisticas':
        return <BiometriaEstadisticasWidget registros={registros} />

      case 'biometria:config':
        return <BiometriaConfigWidget />

      default:
        return null
    }
  }

  // ── RENDER ────────────────────────────────────────────────────────────────

  return (
    <div className="flex-1 flex flex-col bg-stone-50 dark:bg-[#0c0a09] min-h-0">

      {/* Header */}
      <div className="flex items-center justify-between px-4 h-12 border-b border-stone-200/70 dark:border-stone-800/60 bg-white dark:bg-[#1c1917] shrink-0">

        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2FAF8F" strokeWidth="1.5" strokeLinecap="round" className="shrink-0">
            <circle cx="12" cy="12" r="3"/>
            <path d="M3 9V6a1 1 0 0 1 1-1h3"/>
            <path d="M21 9V6a1 1 0 0 0-1-1h-3"/>
            <path d="M3 15v3a1 1 0 0 0 1 1h3"/>
            <path d="M21 15v3a1 1 0 0 1-1 1h-3"/>
          </svg>
          <span className="text-[12px] font-bold text-stone-700 dark:text-stone-200">Biometría</span>
          {pendientes > 0 && (
            <span className="flex items-center gap-1 text-[10px] font-medium text-amber-500 dark:text-amber-400">
              <span className="w-1 h-1 rounded-full bg-amber-400 animate-pulse"/>
              {pendientes} pendiente{pendientes > 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onEscalate}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[8px] border border-stone-200/70 dark:border-stone-800/60 bg-white dark:bg-[#1c1917] text-[11px] text-stone-400 dark:text-stone-500 cursor-pointer hover:text-[#2FAF8F] hover:border-[#2FAF8F]/40 transition-all"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>
              <line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
            </svg>
            Espacio Gandia
          </button>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-[8px] border border-stone-200/70 dark:border-stone-800/60 bg-white dark:bg-[#1c1917] text-stone-400 dark:text-stone-500 cursor-pointer hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200/70 dark:border-stone-800/60 bg-white dark:bg-[#1c1917] px-3.5 shrink-0">
        {TABS.map(tab => {
          const active  = activeTab === tab.id
          const isBadge = tab.id === 'historial' && pendientes > 0
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-1.5 px-2.5 py-2.5 text-[11.5px] cursor-pointer border-0 bg-transparent transition-all -mb-px shrink-0
                ${active
                  ? 'text-stone-700 dark:text-stone-200 font-semibold border-b-2 border-[#2FAF8F]'
                  : 'text-stone-400 dark:text-stone-500 font-normal border-b-2 border-transparent hover:text-stone-600 dark:hover:text-stone-300'
                }`}
            >
              {tab.label}
              {isBadge && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"/>}
            </button>
          )
        })}
      </div>

      {/* Zona widget */}
      <div className="flex-1 min-h-0 overflow-y-auto
        [&::-webkit-scrollbar]:w-[3px]
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:bg-stone-200
        [&::-webkit-scrollbar-thumb]:dark:bg-stone-700/80
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb:hover]:bg-[#2FAF8F]/60
        [&::-webkit-scrollbar-thumb:hover]:dark:bg-[#2FAF8F]/50">
        <div className="p-3.5">
          {renderWidget()}
        </div>
      </div>
    </div>
  )
}