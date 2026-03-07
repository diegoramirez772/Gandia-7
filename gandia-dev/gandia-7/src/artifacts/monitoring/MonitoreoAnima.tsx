/**
 * MonitoreoAnima.tsx
 * Nivel Ánima del dominio Monitoreo.
 * Estilos: Tailwind CSS + dark mode via clase .dark en <html>
 *
 * Layout 3 columnas:
 *   Sidebar izquierdo  → corrales y cámaras
 *   Zona central       → widget activo
 *   Panel derecho      → AnomaliaFeedWidget fijo
 */

import { useState, useCallback } from 'react'
import CopiloAnima                from '../CopiloAnima'

// ── Widgets ──────────────────────────────────────────────────────────────────
import MapaVistaGeneralWidget,  { type Corral }   from './widgets/MapaVistaGeneralWidget'
import MapaCorralDetalleWidget                      from './widgets/MapaCorralDetalleWidget'
import CamaraListaWidget,       { type Camara }   from './widgets/CamaraListaWidget'
import CamaraFeedWidget                            from './widgets/CamaraFeedWidget'
import CamaraAgregarWidget                         from './widgets/CamaraAgregarWidget'
import CamaraConfigWidget                          from './widgets/CamaraConfigWidget'
import SensorConteoLiveWidget                      from './widgets/SensorConteoLiveWidget'
import SensorCalibracionWidget                     from './widgets/SensorCalibracionWidget'
import AnomaliaFeedWidget,      { type Anomalia } from './widgets/AnomaliaFeedWidget'
import AnomaliaDetalleWidget                       from './widgets/AnomaliaDetalleWidget'
import AnomaliaConfigUmbralWidget                  from './widgets/AnomaliaConfigUmbralWidget'
import ConfigCorralesWidget                        from './widgets/ConfigCorralesWidget'
import ConfigCamarasWidget                         from './widgets/ConfigCamarasWidget'

// ─── TIPOS ────────────────────────────────────────────────────────────────────

export type ActiveWidget =
  | 'mapa:vista-general'
  | 'mapa:corral-detalle'
  | 'camara:feed'
  | 'camara:agregar'
  | 'camara:config'
  | 'sensor:conteo-live'
  | 'sensor:calibracion'
  | 'anomalia:detalle'
  | 'anomalia:config-umbral'
  | 'config:corrales'
  | 'config:camaras'

type Tab = 'mapa' | 'camaras' | 'sensores' | 'config'

interface Props {
  onClose:    () => void
  onEscalate: () => void
}

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const INIT_CORRALES: Corral[] = [
  { id: 1, label: 'C-01', animales: 45, capacidad: 50, estado: 'normal',     temp: 21.4, humedad: 62, camara: true  },
  { id: 2, label: 'C-02', animales: 38, capacidad: 50, estado: 'normal',     temp: 22.1, humedad: 58, camara: true  },
  { id: 3, label: 'C-03', animales: 62, capacidad: 60, estado: 'atencion',   temp: 24.7, humedad: 71, camara: true  },
  { id: 4, label: 'C-04', animales: 12, capacidad: 40, estado: 'cuarentena', temp: 23.2, humedad: 65, camara: false },
  { id: 5, label: 'C-05', animales: 51, capacidad: 55, estado: 'normal',     temp: 21.9, humedad: 60, camara: true  },
  { id: 6, label: 'C-06', animales: 44, capacidad: 50, estado: 'normal',     temp: 22.3, humedad: 59, camara: true  },
]

const INIT_CAMARAS: Camara[] = [
  { id: 1, label: 'CAM-01', corral: 'C-01', estado: 'online',  detectados: 45, inventario: 45, fps: 24 },
  { id: 2, label: 'CAM-02', corral: 'C-02', estado: 'online',  detectados: 37, inventario: 38, fps: 24 },
  { id: 3, label: 'CAM-03', corral: 'C-03', estado: 'online',  detectados: 61, inventario: 62, fps: 18 },
  { id: 4, label: 'CAM-05', corral: 'C-05', estado: 'online',  detectados: 51, inventario: 51, fps: 24 },
  { id: 5, label: 'CAM-06', corral: 'C-06', estado: 'offline', detectados:  0, inventario: 44, fps:  0 },
]

const INIT_SENSORES_STATS = [
  { corral: 'C-01', detectados: 45, inventario: 45, match: 100, activo: true  },
  { corral: 'C-02', detectados: 37, inventario: 38, match: 97,  activo: true  },
  { corral: 'C-03', detectados: 61, inventario: 62, match: 98,  activo: true  },
  { corral: 'C-05', detectados: 51, inventario: 51, match: 100, activo: true  },
  { corral: 'C-06', detectados:  0, inventario: 44, match:   0, activo: false },
]

const INIT_ANOMALIAS: Anomalia[] = [
  { id: 1, ts: '14:32', animal: '#417', corral: 'C-03', tipo: 'Separación del hato',   severidad: 'alta',  resuelto: false },
  { id: 2, ts: '13:51', animal: '#291', corral: 'C-03', tipo: 'Postura caída',          severidad: 'alta',  resuelto: false },
  { id: 3, ts: '12:14', animal: '#088', corral: 'C-02', tipo: 'Movimiento reducido',    severidad: 'media', resuelto: false },
  { id: 4, ts: '11:02', animal: '#334', corral: 'C-01', tipo: 'Sin ingesta registrada', severidad: 'media', resuelto: true  },
  { id: 5, ts: '09:47', animal: '#156', corral: 'C-05', tipo: 'Temperatura elevada',    severidad: 'media', resuelto: true  },
]

// ─── TABS ─────────────────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string; icon: React.FC<{ size?: number }> }[] = [
  { id: 'mapa',     label: 'Mapa UPP',    icon: MapIcon    },
  { id: 'camaras',  label: 'Cámaras',     icon: CamIcon    },
  { id: 'sensores', label: 'Sensores IA', icon: SensorIcon },
  { id: 'config',   label: 'Configurar',  icon: ConfigIcon },
]

const TAB_DEFAULT_WIDGET: Record<Tab, ActiveWidget> = {
  mapa:     'mapa:vista-general',
  camaras:  'camara:feed',
  sensores: 'sensor:conteo-live',
  config:   'config:camaras',
}

// ─── COMPONENTE ───────────────────────────────────────────────────────────────

export default function MonitoreoAnima({ onClose, onEscalate }: Props) {
  const [corrales,          setCorrales]          = useState<Corral[]>(INIT_CORRALES)
  const [camaras,           setCamaras]           = useState<Camara[]>(INIT_CAMARAS)
  const [anomalias,         setAnomalias]         = useState<Anomalia[]>(INIT_ANOMALIAS)
  const [activeTab,         setActiveTab]         = useState<Tab>('mapa')
  const [activeWidget,      setActiveWidget]      = useState<ActiveWidget>('mapa:vista-general')
  const [selectedCorral,    setSelectedCorral]    = useState<Corral   | null>(null)
  const [selectedCamara,    setSelectedCamara]    = useState<Camara   | null>(null)
  const [selectedAnomalia,  setSelectedAnomalia]  = useState<Anomalia | null>(null)

  const alertasActivas = anomalias.filter(a => !a.resuelto).length

  const handleTabChange = useCallback((tab: Tab) => {
    setActiveTab(tab)
    setActiveWidget(TAB_DEFAULT_WIDGET[tab])
    setSelectedCorral(null)
    setSelectedCamara(null)
    setSelectedAnomalia(null)
  }, [])

  const handleSelectCorral = useCallback((c: Corral) => {
    setSelectedCorral(c)
    if (c.camara) {
      const cam = camaras.find(cam => cam.corral === c.label) ?? null
      setSelectedCamara(cam)
      setActiveTab('camaras')
      setActiveWidget('camara:feed')
    } else {
      setActiveWidget('mapa:corral-detalle')
    }
  }, [camaras])

  const handleSelectCamara     = useCallback((cam: Camara)   => { setSelectedCamara(cam);    setActiveWidget('camara:feed')     }, [])
  const handleSelectAnomalia   = useCallback((a: Anomalia)   => { setSelectedAnomalia(a);    setActiveWidget('anomalia:detalle') }, [])
  const handleAgregarCamara    = useCallback(()               => { setActiveWidget('camara:agregar') }, [])
  const handleConfigurarCamara = useCallback((cam: Camara)   => { setSelectedCamara(cam);    setActiveWidget('camara:config')   }, [])
  const handleGuardarCamara    = useCallback((cam: Camara)   => { setCamaras(prev => prev.map(c => c.id === cam.id ? cam : c)); setActiveWidget('config:camaras') }, [])
  const handleEliminarCamara   = useCallback((id: number)    => { setCamaras(prev => prev.filter(c => c.id !== id));            setActiveWidget('config:camaras') }, [])
  const handleGuardarNuevaCamara = useCallback(()            => { setActiveWidget('config:camaras') }, [])

  const handleResolverAnomalia = useCallback((id: number) => {
    setAnomalias(prev => prev.map(a => a.id === id ? { ...a, resuelto: true } : a))
    setActiveWidget(TAB_DEFAULT_WIDGET[activeTab])
    setSelectedAnomalia(null)
  }, [activeTab])

  const handleCopiloAction = useCallback((actionId: string) => {
    const map: Partial<Record<string, () => void>> = {
      'view_alerts':     () => { setActiveWidget('anomalia:config-umbral') },
      'refresh_sensors': () => { setActiveTab('sensores'); setActiveWidget('sensor:conteo-live') },
      'view_map':        () => { setActiveTab('mapa');     setActiveWidget('mapa:vista-general') },
      'view_cameras':    () => { setActiveTab('camaras');  setActiveWidget('camara:feed') },
      'add_camera':      () => { setActiveWidget('camara:agregar') },
      'calibrate':       () => { setActiveTab('sensores'); setActiveWidget('sensor:calibracion') },
      'config_corrales': () => { setActiveTab('config');   setActiveWidget('config:corrales') },
      'config_umbrales': () => { setActiveTab('config');   setActiveWidget('anomalia:config-umbral') },
    }
    map[actionId]?.()
  }, [])

  // ── Widget central ────────────────────────────────────────────────────────

  const renderCentralWidget = () => {
    switch (activeWidget) {
      case 'mapa:vista-general':
        return <MapaVistaGeneralWidget corrales={corrales} onSelectCorral={handleSelectCorral} />

      case 'mapa:corral-detalle':
        return selectedCorral ? (
          <MapaCorralDetalleWidget
            corral={selectedCorral}
            onVerCamara={() => {
              const cam = camaras.find(c => c.corral === selectedCorral.label) ?? null
              setSelectedCamara(cam)
              setActiveTab('camaras')
              setActiveWidget('camara:feed')
            }}
            onClose={() => setActiveWidget('mapa:vista-general')}
          />
        ) : null

      case 'camara:feed':
        return (
          <div className="flex flex-col md:flex-row gap-4 h-full">
            <div className="w-full md:w-[200px] shrink-0">
              <CamaraListaWidget
                camaras={camaras}
                selectedId={selectedCamara?.id}
                onSelectCamara={handleSelectCamara}
                onAgregar={handleAgregarCamara}
              />
            </div>
            <div className="flex-1 flex flex-col">
              <CamaraFeedWidget
                camara={selectedCamara ?? camaras.find(c => c.estado === 'online') ?? camaras[0]}
              />
            </div>
          </div>
        )

      case 'camara:agregar':
        return <CamaraAgregarWidget corrales={corrales} onGuardar={handleGuardarNuevaCamara} onCancelar={() => setActiveWidget('config:camaras')} />

      case 'camara:config':
        return selectedCamara ? (
          <CamaraConfigWidget
            camara={selectedCamara}
            corrales={corrales}
            onGuardar={handleGuardarCamara}
            onEliminar={handleEliminarCamara}
            onCancelar={() => setActiveWidget('config:camaras')}
          />
        ) : null

      case 'sensor:conteo-live':
        return <SensorConteoLiveWidget stats={INIT_SENSORES_STATS} />

      case 'sensor:calibracion':
        return <SensorCalibracionWidget />

      case 'anomalia:detalle':
        return selectedAnomalia ? (
          <AnomaliaDetalleWidget
            anomalia={selectedAnomalia}
            onResolver={handleResolverAnomalia}
            onClose={() => { setSelectedAnomalia(null); setActiveWidget(TAB_DEFAULT_WIDGET[activeTab]) }}
          />
        ) : null

      case 'anomalia:config-umbral':
        return <AnomaliaConfigUmbralWidget />

      case 'config:corrales':
        return <ConfigCorralesWidget corrales={corrales} onBaja={id => setCorrales(prev => prev.filter(c => c.id !== id))} />

      case 'config:camaras':
        return <ConfigCamarasWidget camaras={camaras} onConfigurar={handleConfigurarCamara} onAgregar={handleAgregarCamara} />

      default:
        return null
    }
  }

  // ── RENDER ────────────────────────────────────────────────────────────────

  return (
    <div className="fixed inset-0 bg-stone-50 dark:bg-[#0c0a09] flex flex-col z-50">

      {/* ── TOPBAR ──────────────────────────────────────────────────────────── */}
      <div className="h-[52px] flex items-center px-5 border-b border-stone-200/70 dark:border-stone-800/60 bg-white dark:bg-[#1c1917] shrink-0 relative gap-4">

        {/* Breadcrumb izquierda */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#2FAF8F] animate-pulse" style={{ boxShadow: '0 0 0 3px rgba(47,175,143,0.15)' }} />
          <span className="text-[13px] font-bold text-stone-700 dark:text-stone-200">Monitoreo</span>
          <span className="hidden md:inline text-[12px] text-stone-300 dark:text-stone-600">·</span>
          <span className="hidden md:inline text-[12px] text-stone-400 dark:text-stone-500">UPP Rancho Morales</span>
          {alertasActivas > 0 && (
            <span className="hidden md:inline text-[10px] font-bold bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 px-2 py-0.5 rounded-[6px] border border-red-200 dark:border-red-800/40 ml-1">
              {alertasActivas} alertas
            </span>
          )}
        </div>

        {/* Tabs — centrados absolutamente */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 gap-0.5 bg-stone-100 dark:bg-[#141210] border border-stone-200/70 dark:border-stone-800/60 rounded-[12px] p-[3px]">
          {TABS.map(tab => {
            const Icon   = tab.icon
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
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

      {/* ── BODY ────────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex min-h-0">

        {/* Sidebar izquierdo */}
        <div className="hidden md:flex w-[220px] border-r border-stone-200/70 dark:border-stone-800/60 bg-white dark:bg-[#1c1917] flex-col p-4 gap-5 shrink-0 overflow-y-auto">

          {/* Corrales */}
          <div>
            <p className="text-[10px] font-semibold text-stone-300 dark:text-stone-600 uppercase tracking-[0.06em] mb-2">Corrales</p>
            {corrales.map(c => {
              const dotColor = c.estado === 'normal' ? '#2FAF8F' : c.estado === 'atencion' ? '#f59e0b' : '#ef4444'
              const isActive = selectedCorral?.id === c.id
              return (
                <div
                  key={c.id}
                  onClick={() => handleSelectCorral(c)}
                  className={`flex items-center gap-2.5 px-2.5 py-2 rounded-[10px] cursor-pointer transition-colors mb-0.5
                    ${isActive
                      ? 'bg-[#2FAF8F]/08 dark:bg-[#2FAF8F]/15'
                      : 'bg-transparent hover:bg-stone-50 dark:hover:bg-[#141210]'
                    }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: dotColor }} />
                  <span className="text-[12px] font-semibold text-stone-700 dark:text-stone-200 flex-1">{c.label}</span>
                  <span className="text-[11px] text-stone-400 dark:text-stone-500">{c.animales}</span>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-stone-300 dark:text-stone-600">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </div>
              )
            })}
          </div>

          {/* Cámaras */}
          <div>
            <p className="text-[10px] font-semibold text-stone-300 dark:text-stone-600 uppercase tracking-[0.06em] mb-2">Cámaras</p>
            {camaras.map(cam => {
              const isCamActive = selectedCamara?.id === cam.id && activeWidget === 'camara:feed'
              return (
                <div
                  key={cam.id}
                  onClick={() => handleSelectCamara(cam)}
                  className={`flex items-center gap-2.5 px-2.5 py-2 rounded-[10px] cursor-pointer transition-colors mb-0.5
                    ${isCamActive
                      ? 'bg-[#2FAF8F]/08 dark:bg-[#2FAF8F]/15'
                      : 'bg-transparent hover:bg-stone-50 dark:hover:bg-[#141210]'
                    }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cam.estado === 'online' ? 'bg-[#2FAF8F] animate-pulse' : 'bg-stone-300 dark:bg-stone-600'}`} />
                  <span className="text-[12px] font-semibold text-stone-700 dark:text-stone-200 flex-1">{cam.label}</span>
                  <span className={`text-[10px] font-semibold ${cam.estado === 'online' ? 'text-[#2FAF8F]' : 'text-stone-300 dark:text-stone-600'}`}>
                    {cam.estado === 'online' ? 'Live' : 'Off'}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Zona central */}
        <div className="flex-1 p-3 md:p-5 overflow-y-auto flex flex-col gap-3 pb-20 md:pb-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {renderCentralWidget()}
        </div>

        {/* Panel derecho: anomalías */}
        <div className="hidden md:flex md:flex-col w-[260px] border-l border-stone-200/70 dark:border-stone-800/60 bg-white dark:bg-[#1c1917] p-4 shrink-0 overflow-hidden">
          <AnomaliaFeedWidget
            anomalias={anomalias}
            onSelectAnomalia={handleSelectAnomalia}
          />
        </div>
      </div>

      {/* Copiloto flotante */}
      <CopiloAnima domain="monitoring" onAction={handleCopiloAction} />

      {/* ── BOTTOM NAV (solo móvil) ──────────────────────────────────────── */}
      <div className="md:hidden flex border-t border-stone-200/70 dark:border-stone-800/60 bg-white dark:bg-[#1c1917] shrink-0">
        {TABS.map(tab => {
          const Icon   = tab.icon
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 border-0 cursor-pointer transition-all
                ${active
                  ? 'text-[#2FAF8F]'
                  : 'bg-transparent text-stone-400 dark:text-stone-500'
                }`}
            >
              <Icon size={18} />
              <span className="text-[9px] font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>

      <style>{`@keyframes livePulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
    </div>
  )
}

// ─── ICONS ────────────────────────────────────────────────────────────────────

function MapIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
      <line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>
    </svg>
  )
}

function CamIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
      <path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/>
    </svg>
  )
}

function SensorIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M6.3 6.3a8 8 0 0 0 0 11.4M17.7 6.3a8 8 0 0 1 0 11.4"/>
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