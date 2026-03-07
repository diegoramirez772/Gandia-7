/**
 * BiometriaAnima.tsx
 * Nivel Ánima del dominio Biometría.
 *
 * ARCHIVO NUEVO → src/artifacts/biometria/BiometriaAnima.tsx
 *
 * Patrón idéntico a MonitoreoAnima.tsx.
 *
 * Layout:
 *   Zona central       → cámara (izq) + resultado (der) + pipeline colapsable abajo
 *   Panel derecho fijo → historial del día
 *
 * Tabs: Identificar · Registrar · Estadísticas · Configuración
 */

import { useState, useCallback, useEffect, useRef } from 'react'
import CopiloAnima from '../CopiloAnima'

import BiometriaCapturaWidget,   { type CapturaResult }     from './widgets/BiometriaCapturaWidget'
import BiometriaResultadoWidget, { type BiometriaResultado,
                                   type AnimalMatch }       from './widgets/BiometriaResultadoWidget'
import BiometriaHistorialWidget, { type RegistroCaptura }   from './widgets/BiometriaHistorialWidget'
import BiometriaEstadisticasWidget                          from './widgets/BiometriaEstadisticasWidget'
import BiometriaConfigWidget                                from './widgets/BiometriaConfigWidget'
import BiometriaRegistrarWidget from './widgets/BiometriaRegistrarWidget'
import type { AnimalContext } from './widgets/BiometriaCapturaWidget'

// ─── TIPOS ────────────────────────────────────────────────────────────────────

type Tab = 'identificar' | 'registrar' | 'estadisticas' | 'config'

type PipelineStep = {
  id:      string
  label:   string
  sub:     string
  estado:  'idle' | 'running' | 'done' | 'error'
}

interface Props {
  onClose:    () => void
  onEscalate: () => void
}

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const INIT_REGISTROS: RegistroCaptura[] = [
  { id: 1, ts: 'hace 5 min',  animal: 'Lupita',    arete: '#0142', lote: 'A1', score: 0.94, resultado: 'match',     modo: 'direct', confirmado: true  },
  { id: 2, ts: 'hace 18 min', animal: 'Canela',    arete: '#0089', lote: 'B2', score: 0.83, resultado: 'candidato', modo: 'direct', confirmado: false },
  { id: 3, ts: 'hace 31 min', animal: 'Presumida', arete: '#0203', lote: 'A1', score: 0.91, resultado: 'match',     modo: 'sheet',  confirmado: true  },
  { id: 4, ts: 'hace 1 hr',   animal: '—',         arete: '—',     lote: '—',  score: 0,    resultado: 'nuevo',     modo: 'direct', confirmado: false },
]

const MOCK_CANDIDATOS: AnimalMatch[] = [
  { id: 'c1', nombre: 'Canela',   raza: 'Charolais', lote: 'B2', arete: '#0089', score: 0.83, scoreCV: 0.80, scoreIA: 0.87 },
  { id: 'c2', nombre: 'Estrella', raza: 'Hereford',  lote: 'B1', arete: '#0117', score: 0.76, scoreCV: 0.74, scoreIA: 0.79 },
]

const PIPELINE_BASE: PipelineStep[] = [
  { id: 'validar',    label: 'Validación',        sub: 'Formato · Resolución · Nitidez',       estado: 'idle' },
  { id: 'detectar',   label: 'Detección morro',   sub: 'Contornos Canny · Segmentación',        estado: 'idle' },
  { id: 'preproc',    label: 'Preprocesamiento',  sub: 'CLAHE · Gaussiano · Normalización',     estado: 'idle' },
  { id: 'fingerprint',label: 'Fingerprint CV',    sub: 'Gradientes Sobel · Minutiae · 512D',   estado: 'idle' },
  { id: 'embedding',  label: 'IA Embedding',       sub: 'ResNet50 → PCA 128D',                  estado: 'idle' },
  { id: 'fusion',     label: 'Fusión + Búsqueda', sub: 'Score 55/45 · pgvector coseno',         estado: 'idle' },
  { id: 'decision',   label: 'Decisión',           sub: 'Umbral 0.90 · 0.80 · 0.70',           estado: 'idle' },
]

const TABS: { id: Tab; label: string; icon: React.FC<{ size?: number }> }[] = [
  { id: 'identificar',  label: 'Identificar',  icon: MorroIcon    },
  { id: 'registrar',    label: 'Registrar',    icon: PlusIcon     },
  { id: 'estadisticas', label: 'Estadísticas', icon: ChartIcon    },
  { id: 'config',       label: 'Config',       icon: ConfigIcon   },
]

// ─── COMPONENTE ───────────────────────────────────────────────────────────────

export default function BiometriaAnima({ onClose, onEscalate }: Props) {
  const [activeTab,   setActiveTab]   = useState<Tab>('identificar')
  const [registros,   setRegistros]   = useState<RegistroCaptura[]>(INIT_REGISTROS)
  const [resultado,   setResultado]   = useState<BiometriaResultado | null>(null)
  const [pipeline,    setPipeline]    = useState<PipelineStep[]>(PIPELINE_BASE)
  const [processing,  setProcessing]  = useState(false)
  const [showCameraSheet, setShowCameraSheet] = useState(false)
  const [registrandoAnimal, setRegistrandoAnimal] = useState<AnimalContext | null>(null)
  const pipelineRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const pendientes = registros.filter(r => r.resultado === 'candidato' && !r.confirmado).length

  // ── Limpiar timers al desmontar ───────────────────────────────────────────
  useEffect(() => {
    return () => pipelineRef.current.forEach(clearTimeout)
  }, [])

  // ── Animar pipeline paso a paso ───────────────────────────────────────────
  const animarPipeline = useCallback((onDone: () => void) => {
    pipelineRef.current.forEach(clearTimeout)
    pipelineRef.current = []
    setProcessing(true)
    setPipeline(PIPELINE_BASE.map(s => ({ ...s, estado: 'idle' })))

    PIPELINE_BASE.forEach((step, i) => {
      // running
      const t1 = setTimeout(() => {
        setPipeline(prev => prev.map(s => s.id === step.id ? { ...s, estado: 'running' } : s))
      }, i * 520)
      // done
      const t2 = setTimeout(() => {
        setPipeline(prev => prev.map(s => s.id === step.id ? { ...s, estado: 'done' } : s))
        if (i === PIPELINE_BASE.length - 1) {
          setProcessing(false)
          onDone()
        }
      }, i * 520 + 420)
      pipelineRef.current.push(t1, t2)
    })
  }, [])

  // ── Recibir captura y arrancar pipeline ───────────────────────────────────
  const handleCaptura = useCallback((capturaResult: CapturaResult) => {
    setResultado(null)

    animarPipeline(() => {
      const score   = capturaResult.quality
      const msMatch = Math.round(800 + score * 600)
      const res: BiometriaResultado =
        score >= 0.88
          ? {
              tipo: 'match', captura: capturaResult.imageDataUrl, modo: capturaResult.mode,
              ms: msMatch,
              match: { id: 'm1', nombre: 'Lupita', raza: 'Simmental', lote: 'A1', arete: '#0142', score, scoreCV: score - 0.03, scoreIA: score + 0.02 },
            }
          : score >= 0.72
          ? {
              tipo: 'candidato', captura: capturaResult.imageDataUrl, modo: capturaResult.mode,
              ms: msMatch,
              candidatos: MOCK_CANDIDATOS,
            }
          : {
              tipo: 'nuevo', captura: capturaResult.imageDataUrl, modo: capturaResult.mode,
              ms: msMatch,
            }

      setResultado(res)
      const resultadoTipo: 'match' | 'candidato' | 'nuevo' =
        res.tipo === 'match' ? 'match' : res.tipo === 'candidato' ? 'candidato' : 'nuevo'
      setRegistros(prev => [{
        id: Date.now(), ts: 'ahora',
        animal: res.tipo === 'match' ? (res.match?.nombre ?? '—') : res.tipo === 'candidato' ? '?' : '—',
        arete:  res.tipo === 'match' ? (res.match?.arete ?? '—') : '—',
        lote:   res.tipo === 'match' ? (res.match?.lote ?? '—') : '—',
        score, resultado: resultadoTipo,
        modo: capturaResult.mode, confirmado: false,
      }, ...prev])
    })
  }, [animarPipeline])

  const handleConfirmar = useCallback((animal: AnimalMatch) => {
    setRegistros(prev => prev.map((r, i) => i === 0 ? { ...r, animal: animal.nombre, arete: animal.arete, confirmado: true } : r))
    setResultado(null)
    setPipeline(PIPELINE_BASE)
    setRegistrandoAnimal(null)
  }, [])

  const handleNueva = useCallback(() => {
    setResultado(null)
    setPipeline(PIPELINE_BASE)
    setRegistrandoAnimal(null)
  }, [])

  const handleIniciarCaptura = useCallback((animal: AnimalContext) => {
    setRegistrandoAnimal(animal)
    setResultado(null)
    setPipeline(PIPELINE_BASE)
    setActiveTab('identificar')
  }, [])

  const handleCopiloAction = useCallback((actionId: string) => {
    const map: Partial<Record<string, () => void>> = {
      'nueva_captura':  () => { setResultado(null); setPipeline(PIPELINE_BASE) },
      'ver_historial':  () => setActiveTab('estadisticas'),
      'modo_hoja':      () => { setResultado(null); setPipeline(PIPELINE_BASE) },
    }
    map[actionId]?.()
  }, [])

  // ── RENDER ────────────────────────────────────────────────────────────────

  return (
    <div className="fixed inset-0 bg-stone-50 dark:bg-[#0c0a09] flex flex-col z-50">

      {/* ── TOPBAR ── */}
      <div className="h-[52px] flex items-center px-5 border-b border-stone-200/70 dark:border-stone-800/60 bg-white dark:bg-[#1c1917] shrink-0 relative gap-4">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2FAF8F" strokeWidth="1.5" strokeLinecap="round" className="shrink-0">
            <circle cx="12" cy="12" r="3"/>
            <path d="M3 9V6a1 1 0 0 1 1-1h3"/>
            <path d="M21 9V6a1 1 0 0 0-1-1h-3"/>
            <path d="M3 15v3a1 1 0 0 0 1 1h3"/>
            <path d="M21 15v3a1 1 0 0 1-1 1h-3"/>
          </svg>
          <span className="text-[13px] font-bold text-stone-700 dark:text-stone-200">Biometría</span>
          <span className="hidden md:inline text-[12px] text-stone-300 dark:text-stone-600">·</span>
          <span className="hidden md:inline text-[12px] text-stone-400 dark:text-stone-500">Identificación bovina</span>
          {pendientes > 0 && (
            <span className="hidden md:inline text-[10px] font-medium text-amber-500 dark:text-amber-400 ml-1">
              · {pendientes} pendiente{pendientes > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Tabs centrados */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 gap-0.5 bg-stone-100 dark:bg-[#141210] border border-stone-200/70 dark:border-stone-800/60 rounded-[12px] p-[3px]">
          {TABS.map(tab => {
            const Icon   = tab.icon
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-[9px] border-0 cursor-pointer text-[12px] transition-all
                  ${active
                    ? 'bg-white dark:bg-[#1c1917] text-stone-700 dark:text-stone-200 font-semibold shadow-sm'
                    : 'bg-transparent text-stone-400 dark:text-stone-500 font-normal hover:text-stone-600 dark:hover:text-stone-300'
                  }`}
              >
                <Icon size={13} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Acciones derecha */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={onEscalate}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-[10px] border border-stone-200/70 dark:border-stone-800/60 bg-white dark:bg-[#1c1917] text-[12px] text-stone-400 dark:text-stone-500 cursor-pointer hover:text-[#2FAF8F] hover:border-[#2FAF8F]/40 transition-all"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/>
              <line x1="10" y1="14" x2="17" y2="7"/><line x1="4" y1="20" x2="11" y2="13"/>
            </svg>
            Espacio Gandia
          </button>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-[10px] border border-stone-200/70 dark:border-stone-800/60 bg-white dark:bg-[#1c1917] text-[12px] text-stone-400 dark:text-stone-500 cursor-pointer hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
          >
            Chat
          </button>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="flex-1 flex min-h-0">

        {/* ── Zona central — Pipeline + Resultado ── */}
        <div className="flex-1 flex flex-col p-4 md:p-6 overflow-y-auto gap-5 pb-20 md:pb-6
              [&::-webkit-scrollbar]:w-[3px]
              [&::-webkit-scrollbar-track]:bg-transparent
              [&::-webkit-scrollbar-thumb]:bg-stone-200
              [&::-webkit-scrollbar-thumb]:dark:bg-stone-700/80
              [&::-webkit-scrollbar-thumb]:rounded-full
              [&::-webkit-scrollbar-thumb:hover]:bg-[#2FAF8F]/60
              [&::-webkit-scrollbar-thumb:hover]:dark:bg-[#2FAF8F]/50">

          {activeTab === 'identificar' && (
            <>
              {/* Layout: cámara ocupa todo, o 2 col si hay resultado */}
              <div className={`flex flex-col ${resultado ? 'lg:flex-row' : ''} gap-5`}>

                {/* ── Widget de captura ── */}
                <div className={resultado ? 'w-full lg:w-[400px] shrink-0' : 'w-full'}>
                  <BiometriaCapturaWidget onCaptura={handleCaptura} compact pipeline={pipeline} processing={processing} animalContext={registrandoAnimal ?? undefined} />
                </div>

                {/* ── Resultado (solo si existe) ── */}
                {resultado && (
                  <div className="flex-1 flex flex-col gap-4 min-w-0">
                    <BiometriaResultadoWidget
                      resultado={resultado}
                      onConfirmar={handleConfirmar}
                      onRechazar={handleNueva}
                      onRegistrar={() => setActiveTab('registrar')}
                      onNueva={handleNueva}
                    />
                  </div>
                )}
              </div>

            </>
          )}

          {activeTab === 'estadisticas' && (
            <BiometriaEstadisticasWidget registros={registros} />
          )}

          {activeTab === 'registrar' && (
            <BiometriaRegistrarWidget onIniciarCaptura={handleIniciarCaptura} onCancelar={() => setActiveTab('identificar')} />
          )}

          {activeTab === 'config' && (
            <BiometriaConfigWidget />
          )}
        </div>

        {/* Panel derecho — Historial fijo */}
        <div className="hidden md:flex md:flex-col w-[320px] border-l border-stone-200/70 dark:border-stone-800/60 bg-white dark:bg-[#1c1917] p-4 shrink-0 overflow-hidden">
          <BiometriaHistorialWidget
            registros={registros}
            onSelectRegistro={r => {
              if (r.resultado === 'candidato' && !r.confirmado) setActiveTab('identificar')
            }}
          />
        </div>
      </div>

      {/* Copiloto flotante */}
      <CopiloAnima domain="biometria" onAction={handleCopiloAction} />

      {/* Bottom nav móvil */}
      <div className="md:hidden flex border-t border-stone-200/70 dark:border-stone-800/60 bg-white dark:bg-[#1c1917] shrink-0">
        {TABS.map(tab => {
          const Icon   = tab.icon
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 border-0 cursor-pointer transition-all
                ${active ? 'text-[#2FAF8F]' : 'bg-transparent text-stone-400 dark:text-stone-500'}`}
            >
              <Icon size={18}/>
              <span className="text-[9px] font-medium">{tab.label}</span>
            </button>
          )
        })}

        {/* Botón historial — solo móvil */}
        <button
          onClick={() => setShowCameraSheet(true)}
          className="flex-1 flex flex-col items-center gap-1 py-2.5 border-0 cursor-pointer transition-all text-stone-400 dark:text-stone-500 hover:text-[#2FAF8F] bg-transparent"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
          </svg>
          <span className="text-[9px] font-medium">Historial</span>
        </button>
      </div>

      {/* Bottom sheet historial — solo móvil */}
      {showCameraSheet && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setShowCameraSheet(false)}/>
          <div className="relative bg-stone-50 dark:bg-[#0c0a09] rounded-t-[20px] overflow-hidden flex flex-col" style={{ maxHeight: '85vh' }}>
            <div className="flex items-center justify-between px-4 pt-3 pb-3 border-b border-stone-100 dark:border-stone-800/40 shrink-0">
              <div className="absolute left-1/2 -translate-x-1/2 top-2 w-10 h-1 rounded-full bg-stone-200 dark:bg-stone-700"/>
              <p className="text-[13px] font-semibold text-stone-800 dark:text-stone-100 mt-2">Historial del día</p>
              <button onClick={() => setShowCameraSheet(false)} className="mt-2 w-7 h-7 flex items-center justify-center rounded-full bg-stone-100 dark:bg-stone-800/60 text-stone-500 dark:text-stone-400 border-0 cursor-pointer">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="overflow-y-auto px-4 py-4 flex-1">
              <BiometriaHistorialWidget registros={registros} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── ICONS ────────────────────────────────────────────────────────────────────

function MorroIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M3 9V6a1 1 0 0 1 1-1h3"/>
      <path d="M21 9V6a1 1 0 0 0-1-1h-3"/>
      <path d="M3 15v3a1 1 0 0 0 1 1h3"/>
      <path d="M21 15v3a1 1 0 0 1-1 1h-3"/>
    </svg>
  )
}

function PlusIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  )
}

function ChartIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6"  y1="20" x2="6"  y2="14"/>
    </svg>
  )
}

function ConfigIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  )
}