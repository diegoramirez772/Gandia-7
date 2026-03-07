/**
 * BiometriaCapturaWidget — Widget: biometria:captura
 * ARCHIVO → src/artifacts/biometria/widgets/BiometriaCapturaWidget.tsx
 *
 * CAMBIOS v2:
 * - Auto-captura: cuando calidad >= 0.80 por 1.5s dispara sola
 * - Feedback en vivo mientras streaming: "Acércate", "Morro fuera", "Listo"
 * - Sheet mode: overlay de marcadores ArUco con estado detectado/buscando
 * - Indicador offline: capturas en cola pendientes de sync
 * - Burst mode: 3 frames → selecciona mejor (simulado en texto)
 */
import { useState, useRef, useCallback, useEffect } from 'react'
import HojaInteligenteSheet from './HojaInteligenteSheet'

export type CaptureMode = 'direct' | 'sheet'

export type PipelineEstado = 'idle' | 'running' | 'done' | 'error'

export interface PipelineStep {
  id:     string
  label:  string
  sub:    string
  estado: PipelineEstado
}

export interface CapturaResult {
  imageDataUrl: string
  mode:         CaptureMode
  timestamp:    number
  quality:      number
}

export interface AnimalContext {
  nombre: string
  arete:  string
  raza:   string
  lote:   string
}

interface Props {
  onCaptura?:     (result: CapturaResult) => void
  onExpand?:      () => void
  compact?:       boolean
  pipeline?:      PipelineStep[]
  processing?:    boolean
  offlineQueue?:  number
  animalContext?: AnimalContext
}

// ─── Simula análisis de calidad en vivo ──────────────────────────────────────
// En producción: Laplaciano real sobre frame del video

type LiveFeedback = {
  msg:   string
  kind:  'warn' | 'ok' | 'info'
  score: number
}

const FEEDBACK_CYCLE: LiveFeedback[] = [
  { msg: 'Muy borroso — acércate al morro',   kind: 'warn', score: 0.38 },
  { msg: 'Morro fuera del óvalo',              kind: 'warn', score: 0.51 },
  { msg: 'Acércate un poco más',               kind: 'warn', score: 0.62 },
  { msg: 'Casi listo…',                        kind: 'info', score: 0.74 },
  { msg: 'Buena imagen — capturando…',         kind: 'ok',   score: 0.88 },
]

const ARUCO_CYCLE = [
  { detected: [false, false, false, false], label: 'Buscando marcadores…' },
  { detected: [true,  false, false, false], label: 'Marcador 1 detectado' },
  { detected: [true,  true,  false, false], label: 'Marcadores 1-2 detectados' },
  { detected: [true,  true,  true,  false], label: 'Marcadores 1-3 detectados' },
  { detected: [true,  true,  true,  true],  label: 'Perspectiva corregida ✓' },
]

export default function BiometriaCapturaWidget({
  onCaptura,
  onExpand,
  compact = false,
  pipeline,
  processing = false,
  offlineQueue = 0,
  animalContext,
}: Props) {
  const [mode,         setMode]         = useState<CaptureMode>('direct')
  const [streaming,    setStreaming]     = useState(false)
  const [capturing,    setCapturing]    = useState(false)
  const [liveFeedback, setLiveFeedback] = useState<LiveFeedback | null>(null)
  const [liveScore,    setLiveScore]    = useState<number | null>(null)
  const [arucoStep,    setArucoStep]    = useState(0)
  const [pipeOpen,     setPipeOpen]     = useState(true)
  const [showHoja,     setShowHoja]     = useState(false)
  const [burstMsg,     setBurstMsg]     = useState<string | null>(null)

  const videoRef      = useRef<HTMLVideoElement>(null)
  const streamRef     = useRef<MediaStream | null>(null)
  const feedbackTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const arucoTimer    = useRef<ReturnType<typeof setInterval> | null>(null)
  const autoCaptureRef = useRef(false)

  // ── Simular análisis en vivo ────────────────────────────────────────────
  const startLiveAnalysis = useCallback(() => {
    let step = 0
    autoCaptureRef.current = false
    feedbackTimer.current = setInterval(() => {
      const fb = FEEDBACK_CYCLE[Math.min(step, FEEDBACK_CYCLE.length - 1)]
      setLiveFeedback(fb)
      setLiveScore(fb.score)

      if (fb.kind === 'ok' && !autoCaptureRef.current) {
        // Auto-captura: calidad buena → dispara en 800ms
        autoCaptureRef.current = true
        setTimeout(() => {
          if (autoCaptureRef.current) triggerCapture(fb.score)
        }, 800)
      }
      step++
      if (step > FEEDBACK_CYCLE.length - 1) {
        clearInterval(feedbackTimer.current!)
      }
    }, 900)
  }, []) // triggerCapture defined below with useCallback — called via ref workaround

  const stopLiveAnalysis = useCallback(() => {
    if (feedbackTimer.current) { clearInterval(feedbackTimer.current); feedbackTimer.current = null }
    if (arucoTimer.current)    { clearInterval(arucoTimer.current);    arucoTimer.current    = null }
    setLiveFeedback(null)
    setLiveScore(null)
    setArucoStep(0)
    autoCaptureRef.current = false
  }, [])

  const startArucoAnalysis = useCallback(() => {
    let step = 0
    arucoTimer.current = setInterval(() => {
      setArucoStep(step)
      step++
      if (step >= ARUCO_CYCLE.length) clearInterval(arucoTimer.current!)
    }, 700)
  }, [])

  // ── Cámara ──────────────────────────────────────────────────────────────
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      })
      streamRef.current = stream
      if (videoRef.current) videoRef.current.srcObject = stream
      setStreaming(true)

      if (mode === 'direct') {
        setTimeout(startLiveAnalysis, 600)
      } else {
        setTimeout(startArucoAnalysis, 400)
        setTimeout(startLiveAnalysis, 1200)
      }
    } catch {
      setLiveFeedback({ msg: 'Sin acceso a la cámara — verifica permisos', kind: 'warn', score: 0 })
    }
  }, [mode, startLiveAnalysis, startArucoAnalysis])

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
    setStreaming(false)
    stopLiveAnalysis()
    setBurstMsg(null)
  }, [stopLiveAnalysis])

  // ── Captura (manual o auto) ──────────────────────────────────────────────
  const triggerCapture = useCallback((scoreOverride?: number) => {
    if (!videoRef.current || capturing) return
    autoCaptureRef.current = false
    stopLiveAnalysis()
    setCapturing(true)

    // Burst mode visual
    setBurstMsg('Analizando 3 frames…')
    setTimeout(() => setBurstMsg('Seleccionando el más nítido…'), 400)

    const canvas  = document.createElement('canvas')
    canvas.width  = videoRef.current.videoWidth  || 640
    canvas.height = videoRef.current.videoHeight || 480
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92)
    const score   = scoreOverride ?? (0.82 + Math.random() * 0.15)

    setTimeout(() => {
      setBurstMsg(null)
      onCaptura?.({ imageDataUrl: dataUrl, mode, timestamp: Date.now(), quality: score })
      setCapturing(false)
      stopCamera()
    }, 900)
  }, [capturing, mode, onCaptura, stopCamera, stopLiveAnalysis])

  // Exponer triggerCapture al timer (closure workaround)
  const triggerRef = useRef(triggerCapture)
  useEffect(() => { triggerRef.current = triggerCapture }, [triggerCapture])

  const handleModeChange = (m: CaptureMode) => {
    if (streaming) stopCamera()
    setMode(m)
  }

  useEffect(() => () => { stopLiveAnalysis() }, [stopLiveAnalysis])

  // ── Pipeline estado ──────────────────────────────────────────────────────
  const hasPipeline  = !!pipeline && pipeline.length > 0
  const pipeAllDone  = hasPipeline && pipeline!.every(s => s.estado === 'done')
  const pipeRunning  = hasPipeline && pipeline!.some(s => s.estado === 'running')
  const currentStep  = hasPipeline ? pipeline!.find(s => s.estado === 'running') : null
  const doneCount    = hasPipeline ? pipeline!.filter(s => s.estado === 'done').length : 0
  const totalSteps   = hasPipeline ? pipeline!.length : 0
  const showPipeline = hasPipeline && (processing || pipeAllDone)

  const aruco = ARUCO_CYCLE[Math.min(arucoStep, ARUCO_CYCLE.length - 1)]
  const arucoAllDetected = aruco.detected.every(Boolean)

  // ── RENDER ───────────────────────────────────────────────────────────────
  return (
    <>
      {showHoja && (
        <HojaInteligenteSheet
          animal={animalContext}
          onClose={() => setShowHoja(false)}
        />
      )}
      <div className="flex flex-col bg-white dark:bg-[#1c1917] border border-stone-200/60 dark:border-stone-800/50 rounded-[12px] overflow-hidden">

      {/* ── Header ── */}
      <div className={`flex items-center justify-between border-b border-stone-100 dark:border-stone-800/40 ${compact ? 'px-3 py-2.5' : 'px-4 py-3.5'}`}>
        <div className="flex items-center gap-2.5">
          <svg width={compact ? 16 : 18} height={compact ? 16 : 18} viewBox="0 0 24 24" fill="none" stroke="#2FAF8F" strokeWidth="1.5" strokeLinecap="round" className="shrink-0">
            <circle cx="12" cy="12" r="3"/>
            <path d="M3 9V6a1 1 0 0 1 1-1h3"/><path d="M21 9V6a1 1 0 0 0-1-1h-3"/>
            <path d="M3 15v3a1 1 0 0 0 1 1h3"/><path d="M21 15v3a1 1 0 0 1-1 1h-3"/>
          </svg>
          <div>
            <p className={`font-semibold text-stone-800 dark:text-stone-100 leading-tight ${compact ? 'text-[12.5px]' : 'text-[13.5px]'}`}>Captura de morro</p>
            {!compact && <p className="text-[11.5px] text-stone-400 dark:text-stone-500">Huella biométrica bovina</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Offline queue badge */}
          {offlineQueue > 0 && (
            <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 rounded-[6px] px-2 py-1">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round">
                <path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z"/>
              </svg>
              <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">{offlineQueue} en cola</span>
            </div>
          )}
          {onExpand && (
            <button onClick={onExpand} className="text-[11.5px] text-stone-400 hover:text-[#2FAF8F] flex items-center gap-1.5 transition-colors cursor-pointer bg-transparent border-0 px-0">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>
                <line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
              </svg>
              Ver módulo
            </button>
          )}
        </div>
      </div>

      {/* ── Banner contexto animal ── */}
      {animalContext && (
        <div className="mx-3.5 mt-3 px-3.5 py-3 bg-white dark:bg-[#1c1917] border border-stone-200/70 dark:border-stone-800/60 rounded-[8px] flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-medium text-stone-400 dark:text-stone-500 uppercase tracking-[0.06em] leading-none mb-1">Registrando</p>
            <p className="text-[13px] font-semibold text-stone-800 dark:text-stone-100 leading-tight">{animalContext.nombre}</p>
            <p className="text-[11.5px] text-stone-400 dark:text-stone-500 mt-0.5">{animalContext.arete} · {animalContext.raza} · Lote {animalContext.lote}</p>
          </div>
          <span className="shrink-0 text-[10px] font-semibold px-2 py-1 rounded-[5px] bg-stone-100 dark:bg-stone-800/60 text-stone-500 dark:text-stone-400 border border-stone-200/70 dark:border-stone-700/50">
            Nuevo registro
          </span>
        </div>
      )}

      {/* ── Segmented control ── */}
      <div className="px-4 py-2.5 flex items-center gap-3 border-b border-stone-100 dark:border-stone-800/40">
        <div className="flex bg-stone-100 dark:bg-stone-800/60 rounded-[8px] p-0.5 gap-0.5">
          {(['direct', 'sheet'] as CaptureMode[]).map(m => (
            <button key={m} onClick={() => handleModeChange(m)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-[12px] font-medium transition-all cursor-pointer border-0 ${
                mode === m
                  ? 'bg-white dark:bg-[#2a2825] text-stone-700 dark:text-stone-200 shadow-sm'
                  : 'bg-transparent text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300'
              }`}>
              {m === 'direct'
                ? <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>Cámara directa</>
                : <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>Hoja inteligente</>
              }
            </button>
          ))}
        </div>
        <p className="text-[11px] text-stone-400 dark:text-stone-500 ml-auto">
          {mode === 'direct' ? 'Enfoca el morro directamente' : 'Coloca la hoja frente al morro'}
        </p>
      </div>

      {/* ── Viewport ── */}
      <div className="relative bg-[#0a0a0a] mx-3.5 mt-3 rounded-[10px] overflow-hidden"
        style={{ aspectRatio: compact ? '16/9' : '4/3', minHeight: compact ? 100 : 180 }}>
        <video ref={videoRef} autoPlay playsInline muted
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${streaming ? 'opacity-100' : 'opacity-0'}`}/>

        {/* Estado inactivo */}
        {!streaming && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="absolute inset-0 opacity-[0.04]"
              style={{ backgroundImage: 'linear-gradient(rgba(47,175,143,1) 1px, transparent 1px), linear-gradient(90deg, rgba(47,175,143,1) 1px, transparent 1px)', backgroundSize: '32px 32px' }}/>
            <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, #0a0a0a 100%)' }}/>
            <div className="relative">
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                <path d="M4 18 L4 4 L18 4"   stroke="rgba(47,175,143,0.65)" strokeWidth="2" strokeLinecap="round"/>
                <path d="M52 18 L52 4 L38 4"  stroke="rgba(47,175,143,0.65)" strokeWidth="2" strokeLinecap="round"/>
                <path d="M4 38 L4 52 L18 52"  stroke="rgba(47,175,143,0.65)" strokeWidth="2" strokeLinecap="round"/>
                <path d="M52 38 L52 52 L38 52" stroke="rgba(47,175,143,0.65)" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="28" cy="28" r="8" stroke="rgba(47,175,143,0.2)" strokeWidth="1.5" strokeDasharray="3 3"/>
                <circle cx="28" cy="28" r="2" fill="rgba(47,175,143,0.35)"/>
              </svg>
            </div>
            <p className="relative text-[11px] text-white/25 tracking-wide">Cámara inactiva</p>
          </div>
        )}

        {/* ── Overlay guía — modo DIRECT ── */}
        {streaming && mode === 'direct' && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet">
            <ellipse cx="200" cy="155" rx="118" ry="84"
              fill="none"
              stroke={liveFeedback?.kind === 'ok' ? 'rgba(47,175,143,0.9)' : 'rgba(47,175,143,0.55)'}
              strokeWidth={liveFeedback?.kind === 'ok' ? '2' : '1.5'}
              strokeDasharray={liveFeedback?.kind === 'ok' ? '0' : '8 5'}/>
            {/* Crosshair lines */}
            <line x1="200" y1="90"  x2="200" y2="110" stroke="rgba(47,175,143,0.25)" strokeWidth="1"/>
            <line x1="200" y1="200" x2="200" y2="220" stroke="rgba(47,175,143,0.25)" strokeWidth="1"/>
            <line x1="76"  y1="155" x2="96"  y2="155" stroke="rgba(47,175,143,0.25)" strokeWidth="1"/>
            <line x1="304" y1="155" x2="324" y2="155" stroke="rgba(47,175,143,0.25)" strokeWidth="1"/>
            <text x="200" y="78" textAnchor="middle" fill="rgba(47,175,143,0.55)" fontSize="8" fontFamily="system-ui" letterSpacing="2">ZONA MORRO</text>
          </svg>
        )}

        {/* ── Overlay guía — modo SHEET (ArUco) ── */}
        {streaming && mode === 'sheet' && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet">
            {/* Marco exterior */}
            <rect x="50" y="50" width="300" height="200" fill="none"
              stroke={arucoAllDetected ? 'rgba(47,175,143,0.6)' : 'rgba(47,175,143,0.3)'}
              strokeWidth="1.5" strokeDasharray={arucoAllDetected ? '0' : '6 4'}/>
            {/* Zona morro */}
            <rect x="112" y="88" width="176" height="124"
              fill={arucoAllDetected ? 'rgba(47,175,143,0.04)' : 'rgba(255,255,255,0.02)'}
              stroke="rgba(47,175,143,0.35)" strokeWidth="1" strokeDasharray="4 3"/>
            <text x="200" y="155" textAnchor="middle" fill="rgba(47,175,143,0.4)" fontSize="9" fontFamily="system-ui">ZONA MORRO</text>
            {/* Marcadores ArUco en esquinas */}
            {[
              { x: 50, y: 50, i: 0 }, { x: 350, y: 50, i: 1 },
              { x: 50, y: 250, i: 2 }, { x: 350, y: 250, i: 3 },
            ].map(({ x, y, i }) => {
              const detected = aruco.detected[i]
              const ox = x < 200 ? 1 : -17
              const oy = y < 150 ? 1 : -17
              return (
                <g key={i}>
                  <rect x={x + ox} y={y + oy} width="16" height="16" rx="2"
                    fill={detected ? 'rgba(47,175,143,0.15)' : 'rgba(255,255,255,0.04)'}
                    stroke={detected ? '#2FAF8F' : 'rgba(255,255,255,0.25)'}
                    strokeWidth={detected ? '1.5' : '1'}/>
                  {detected && (
                    <text x={x + ox + 8} y={y + oy + 11} textAnchor="middle"
                      fill="#2FAF8F" fontSize="8" fontFamily="system-ui">✓</text>
                  )}
                </g>
              )
            })}
          </svg>
        )}

        {/* Badges streaming */}
        {streaming && (
          <>
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-black/50 backdrop-blur-[4px] rounded-[5px] px-2 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"/>
              <span className="text-[9px] text-white font-semibold tracking-widest">EN VIVO</span>
            </div>
            <div className="absolute top-2.5 right-2.5 bg-black/50 backdrop-blur-[4px] rounded-[5px] px-2 py-1">
              <span className="text-[9px] text-[#2FAF8F] font-semibold">{mode === 'direct' ? 'DIRECTO' : 'HOJA'}</span>
            </div>
          </>
        )}

        {/* ArUco status badge */}
        {streaming && mode === 'sheet' && (
          <div className={`absolute bottom-9 left-2.5 right-2.5 flex items-center gap-2 rounded-[5px] px-2.5 py-1.5 bg-black/60 backdrop-blur-[4px]`}>
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${arucoAllDetected ? 'bg-[#2FAF8F]' : 'bg-amber-400 animate-pulse'}`}/>
            <span className="text-[9px] text-white/80 font-medium">{aruco.label}</span>
            <span className="ml-auto text-[9px] font-mono text-[#2FAF8F]/70">
              {aruco.detected.filter(Boolean).length}/4
            </span>
          </div>
        )}

        {/* Quality bar */}
        {liveScore !== null && streaming && (
          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center gap-2 bg-black/50 backdrop-blur-[4px] rounded-[5px] px-3 py-1.5">
            <span className="text-[9px] text-stone-400 shrink-0">Calidad</span>
            <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  liveScore >= 0.80 ? 'bg-[#2FAF8F]' : liveScore >= 0.65 ? 'bg-amber-400' : 'bg-red-400'
                }`}
                style={{ width: `${liveScore * 100}%` }}/>
            </div>
            <span className={`text-[9px] font-bold shrink-0 tabular-nums ${
              liveScore >= 0.80 ? 'text-[#2FAF8F]' : liveScore >= 0.65 ? 'text-amber-400' : 'text-red-400'
            }`}>{Math.round(liveScore * 100)}%</span>
          </div>
        )}
      </div>

      {/* ── Feedback en vivo ── */}
      {liveFeedback && streaming && (
        <div className={`mx-3.5 mt-2 px-3 py-2 rounded-[7px] flex items-center gap-2 ${
          liveFeedback.kind === 'ok'   ? 'bg-[#2FAF8F]/08 dark:bg-[#2FAF8F]/12 border border-[#2FAF8F]/20' :
          liveFeedback.kind === 'warn' ? 'bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/25' :
          'bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700/40'
        }`}>
          {liveFeedback.kind === 'ok' ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2FAF8F" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          ) : liveFeedback.kind === 'warn' ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-pulse shrink-0"/>
          )}
          <span className={`text-[12px] font-medium ${
            liveFeedback.kind === 'ok' ? 'text-[#2FAF8F]' :
            liveFeedback.kind === 'warn' ? 'text-amber-600 dark:text-amber-400' :
            'text-stone-500 dark:text-stone-400'
          }`}>{liveFeedback.msg}</span>
        </div>
      )}

      {/* Burst mode msg */}
      {burstMsg && (
        <div className="mx-3.5 mt-2 px-3 py-2 rounded-[7px] flex items-center gap-2 bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700/40">
          <svg className="w-3 h-3 animate-spin text-[#2FAF8F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
          <span className="text-[12px] text-stone-500 dark:text-stone-400">{burstMsg}</span>
        </div>
      )}

      {/* ── Pipeline ── */}
      {showPipeline && (
        <div className="mx-3.5 mt-2.5 border border-stone-100 dark:border-stone-800/40 rounded-[10px] overflow-hidden">
          <button
            onClick={() => setPipeOpen(o => !o)}
            className="w-full flex items-center gap-3 px-3 py-2.5 bg-stone-50 dark:bg-[#141210] hover:bg-stone-100/60 dark:hover:bg-stone-800/20 transition-colors cursor-pointer border-0"
          >
            {pipeRunning
              ? <svg className="w-3.5 h-3.5 text-[#2FAF8F] animate-spin shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              : <svg className="w-3.5 h-3.5 text-[#2FAF8F] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            }
            <div className="flex-1 flex items-center gap-2 min-w-0">
              <div className="flex gap-0.5 items-center">
                {pipeline!.map(s => (
                  <div key={s.id} className={`h-1 rounded-full transition-all duration-300 ${
                    s.estado === 'done'    ? 'bg-[#2FAF8F] w-3' :
                    s.estado === 'running' ? 'bg-[#2FAF8F]/60 w-3 animate-pulse' :
                    'bg-stone-200 dark:bg-stone-700/60 w-2'
                  }`}/>
                ))}
              </div>
              <span className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                {pipeRunning && currentStep ? currentStep.label : pipeAllDone ? 'Completado' : 'Procesando'}
              </span>
              <span className="text-[10px] text-stone-300 dark:text-stone-600 font-mono shrink-0 ml-auto">
                {doneCount}/{totalSteps}
              </span>
            </div>
            <svg className={`w-3.5 h-3.5 text-stone-300 dark:text-stone-600 transition-transform duration-200 shrink-0 ${pipeOpen ? '' : '-rotate-90'}`}
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          {pipeOpen && (
            <div className="px-3 py-2.5 flex flex-col gap-0 border-t border-stone-100 dark:border-stone-800/40">
              {pipeline!.map((step, i) => (
                <div key={step.id} className="flex items-center gap-2.5 py-1.5">
                  <div className="flex flex-col items-center shrink-0">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-200 ${
                      step.estado === 'done'    ? 'bg-[#2FAF8F]' :
                      step.estado === 'running' ? 'border-2 border-[#2FAF8F] bg-white dark:bg-[#1c1917]' :
                      'border border-stone-200 dark:border-stone-700/60 bg-stone-50 dark:bg-[#141210]'
                    }`}>
                      {step.estado === 'done'    && <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                      {step.estado === 'running' && <span className="w-1.5 h-1.5 rounded-full bg-[#2FAF8F] animate-pulse"/>}
                    </div>
                    {i < pipeline!.length - 1 && (
                      <div className={`w-px h-3 my-0.5 ${step.estado === 'done' ? 'bg-[#2FAF8F]/30' : 'bg-stone-100 dark:bg-stone-800/50'}`}/>
                    )}
                  </div>
                  <div className={`flex-1 transition-opacity duration-200 ${step.estado === 'idle' ? 'opacity-30' : step.estado === 'done' ? 'opacity-60' : 'opacity-100'}`}>
                    <span className={`text-[11.5px] font-medium ${step.estado === 'running' ? 'text-[#2FAF8F]' : 'text-stone-600 dark:text-stone-300'}`}>
                      {step.label}
                    </span>
                    {!compact && <span className="text-[10px] text-stone-400 dark:text-stone-600 font-mono ml-1.5">{step.sub}</span>}
                  </div>
                  {step.estado === 'done' && (
                    <span className="text-[10px] text-stone-300 dark:text-stone-600 font-mono shrink-0">{78 + i * 35}ms</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Footer / Acciones ── */}
      <div className={`flex items-center justify-between ${compact ? 'px-3 py-2.5' : 'px-3.5 py-3'} mt-1.5`}>
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${streaming ? 'bg-[#2FAF8F] animate-pulse' : 'bg-stone-300 dark:bg-stone-700'}`}/>
          <span className="text-[11.5px] text-stone-400 dark:text-stone-500">
            {streaming && liveFeedback?.kind === 'ok'
              ? 'Auto-captura activa'
              : streaming ? 'Analizando…'
              : 'Inactiva'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {streaming && (
            <button onClick={stopCamera}
              className="h-9 px-4 rounded-[8px] border border-stone-200 dark:border-stone-700/60 bg-white dark:bg-[#1c1917] text-[12px] text-stone-500 dark:text-stone-400 cursor-pointer hover:text-stone-700 transition-colors">
              Cancelar
            </button>
          )}
          <button
            onClick={streaming ? () => triggerCapture() : startCamera}
            disabled={capturing}
            className={`h-9 px-5 rounded-[8px] text-[12.5px] font-semibold transition-all flex items-center gap-2 ${
              capturing
                ? 'bg-stone-100 dark:bg-stone-800/50 text-stone-400 cursor-default border border-stone-200 dark:border-stone-700/60'
                : streaming
                ? 'bg-[#2FAF8F] hover:bg-[#27a07f] text-white cursor-pointer active:scale-[0.97] border-0'
                : 'border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#1c1917] text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800/40 cursor-pointer'
            }`}
          >
            {capturing ? (
              <><svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Analizando...</>
            ) : streaming ? (
              <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4" fill="white"/></svg>Capturar</>
            ) : (
              <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>Abrir cámara</>
            )}
          </button>
        </div>
      </div>

      {mode === 'sheet' && !streaming && (
        <div className="mx-3.5 mb-3.5 -mt-1 px-3 py-2 bg-stone-50 dark:bg-[#141210] border border-stone-100 dark:border-stone-800/40 rounded-[8px] flex items-center gap-3">
          <p className="text-[11.5px] text-stone-400 dark:text-stone-500 leading-relaxed flex-1">
            Imprime la hoja inteligente y colócala frente al morro. Los 4 marcadores ArUco se detectan automáticamente para corregir perspectiva.
          </p>
          <button
            onClick={() => setShowHoja(true)}
            className="shrink-0 flex items-center gap-1.5 h-8 px-3 rounded-[7px] border border-stone-200 dark:border-stone-700/60 bg-white dark:bg-[#1c1917] text-[11.5px] text-stone-500 dark:text-stone-400 hover:text-[#2FAF8F] hover:border-[#2FAF8F]/40 transition-all cursor-pointer"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
            </svg>
            Imprimir hoja
          </button>
        </div>
      )}
    </div>
    </>
  )
}