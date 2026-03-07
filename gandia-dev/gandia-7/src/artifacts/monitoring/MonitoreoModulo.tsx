/**
 * MonitoreoModulo.tsx
 * Nivel Módulo del dominio Monitoreo.
 * Estilos: Tailwind CSS + dark mode via clase .dark en <html>
 */

import { useState, useCallback } from 'react'

// ── Widgets ──────────────────────────────────────────────────────────────────
import MapaVistaGeneralWidget,  { type Corral }   from './widgets/MapaVistaGeneralWidget'
import MapaCorralDetalleWidget                      from './widgets/MapaCorralDetalleWidget'
import                          { type Camara }   from './widgets/CamaraListaWidget'
import CamaraFeedWidget                            from './widgets/CamaraFeedWidget'
import CamaraAgregarWidget                         from './widgets/CamaraAgregarWidget'
import CamaraConfigWidget                          from './widgets/CamaraConfigWidget'
import SensorConteoLiveWidget                      from './widgets/SensorConteoLiveWidget'
import AnomaliaFeedWidget,      { type Anomalia } from './widgets/AnomaliaFeedWidget'
import AnomaliaDetalleWidget                       from './widgets/AnomaliaDetalleWidget'
import AnomaliaConfigUmbralWidget                  from './widgets/AnomaliaConfigUmbralWidget'
import ConfigCorralesWidget                        from './widgets/ConfigCorralesWidget'
import ConfigCamarasWidget                         from './widgets/ConfigCamarasWidget'

// ─── TIPOS ────────────────────────────────────────────────────────────────────

type ModuleWidget =
  | 'mapa:vista-general'
  | 'mapa:corral-detalle'
  | 'camara:lista-feed'
  | 'camara:agregar'
  | 'camara:config'
  | 'sensor:conteo-live'
  | 'anomalia:feed'
  | 'anomalia:detalle'
  | 'anomalia:config-umbral'
  | 'config:corrales'
  | 'config:camaras'

type Tab = 'mapa' | 'camaras' | 'sensores' | 'alertas' | 'config'

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

const TAB_DEFAULT: Record<Tab, ModuleWidget> = {
  mapa:     'mapa:vista-general',
  camaras:  'camara:lista-feed',
  sensores: 'sensor:conteo-live',
  alertas:  'anomalia:feed',
  config:   'config:camaras',
}

const TABS: { id: Tab; label: string }[] = [
  { id: 'mapa',     label: 'Mapa'     },
  { id: 'camaras',  label: 'Cámaras'  },
  { id: 'sensores', label: 'Sensores' },
  { id: 'alertas',  label: 'Alertas'  },
  { id: 'config',   label: 'Config'   },
]

// ─── COMPONENTE ───────────────────────────────────────────────────────────────

export default function MonitoreoModulo({ onClose, onEscalate }: Props) {
  const [corrales,         setCorrales]         = useState<Corral[]>(INIT_CORRALES)
  const [camaras,          setCamaras]          = useState<Camara[]>(INIT_CAMARAS)
  const [anomalias,        setAnomalias]        = useState<Anomalia[]>(INIT_ANOMALIAS)
  const [activeTab,        setActiveTab]        = useState<Tab>('mapa')
  const [activeWidget,     setActiveWidget]     = useState<ModuleWidget>('mapa:vista-general')
  const [selectedCorral,   setSelectedCorral]   = useState<Corral   | null>(null)
  const [selectedCamara,   setSelectedCamara]   = useState<Camara   | null>(null)
  const [selectedAnomalia, setSelectedAnomalia] = useState<Anomalia | null>(null)

  const alertasActivas = anomalias.filter(a => !a.resuelto).length

  const handleTabChange = useCallback((tab: Tab) => {
    setActiveTab(tab)
    setActiveWidget(TAB_DEFAULT[tab])
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
      setActiveWidget('camara:lista-feed')
    } else {
      setActiveWidget('mapa:corral-detalle')
    }
  }, [camaras])

  const handleSelectCamara = useCallback((cam: Camara) => {
    setSelectedCamara(cam)
    setActiveWidget('camara:lista-feed')
  }, [])

  const handleSelectAnomalia = useCallback((a: Anomalia) => {
    setSelectedAnomalia(a)
    setActiveWidget('anomalia:detalle')
  }, [])

  const renderWidget = () => {
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
              setActiveWidget('camara:lista-feed')
            }}
            onClose={() => setActiveWidget('mapa:vista-general')}
          />
        ) : null

      case 'camara:lista-feed':
        return (
          <div className="flex flex-col gap-3 h-full">
            {/* Selector horizontal de cámaras */}
            <div className="flex gap-1.5 shrink-0 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {camaras.map(cam => {
                const isSel = selectedCamara?.id === cam.id
                return (
                  <button
                    key={cam.id}
                    onClick={() => cam.estado === 'online' && handleSelectCamara(cam)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-[8px] border text-[11px] shrink-0 transition-all
                      ${cam.estado === 'offline' ? 'opacity-50 cursor-default' : 'cursor-pointer'}
                      ${isSel
                        ? 'border-[#2FAF8F]/50 bg-[#2FAF8F]/08 dark:bg-[#2FAF8F]/15 text-[#2FAF8F] font-bold'
                        : 'border-stone-200/70 dark:border-stone-800/60 bg-white dark:bg-[#1c1917] text-stone-500 dark:text-stone-400'
                      }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cam.estado === 'online' ? 'bg-[#2FAF8F]' : 'bg-stone-300 dark:bg-stone-600'}`} />
                    {cam.label}
                  </button>
                )
              })}
              <button
                onClick={() => setActiveWidget('camara:agregar')}
                className="px-2.5 py-1.5 rounded-[8px] border border-dashed border-stone-200/70 dark:border-stone-800/60 text-[11px] text-stone-300 dark:text-stone-600 cursor-pointer shrink-0 hover:text-stone-400 dark:hover:text-stone-500 transition-colors"
              >+ Agregar</button>
            </div>
            {/* Feed */}
            <div className="flex-1 min-h-0">
              <CamaraFeedWidget
                camara={selectedCamara ?? camaras.find(c => c.estado === 'online') ?? camaras[0]}
              />
            </div>
          </div>
        )

      case 'camara:agregar':
        return (
          <CamaraAgregarWidget
            corrales={corrales}
            onGuardar={() => { setActiveTab('camaras'); setActiveWidget('camara:lista-feed') }}
            onCancelar={() => setActiveWidget('config:camaras')}
          />
        )

      case 'camara:config':
        return selectedCamara ? (
          <CamaraConfigWidget
            camara={selectedCamara}
            corrales={corrales}
            onGuardar={cam => { setCamaras(prev => prev.map(c => c.id === cam.id ? cam : c)); setActiveWidget('config:camaras') }}
            onEliminar={id => { setCamaras(prev => prev.filter(c => c.id !== id)); setActiveWidget('config:camaras') }}
            onCancelar={() => setActiveWidget('config:camaras')}
          />
        ) : null

      case 'sensor:conteo-live':
        return <SensorConteoLiveWidget stats={INIT_SENSORES_STATS} />

      case 'anomalia:feed':
        return <AnomaliaFeedWidget anomalias={anomalias} onSelectAnomalia={handleSelectAnomalia} />

      case 'anomalia:detalle':
        return selectedAnomalia ? (
          <AnomaliaDetalleWidget
            anomalia={selectedAnomalia}
            onResolver={id => {
              setAnomalias(prev => prev.map(a => a.id === id ? { ...a, resuelto: true } : a))
              setSelectedAnomalia(null)
              setActiveWidget('anomalia:feed')
            }}
            onClose={() => { setSelectedAnomalia(null); setActiveWidget('anomalia:feed') }}
          />
        ) : null

      case 'anomalia:config-umbral':
        return <AnomaliaConfigUmbralWidget />

      case 'config:corrales':
        return (
          <ConfigCorralesWidget
            corrales={corrales}
            onBaja={id => setCorrales(prev => prev.filter(c => c.id !== id))}
            onNuevaZona={() => {/* TODO */}}
          />
        )

      case 'config:camaras':
        return (
          <ConfigCamarasWidget
            camaras={camaras}
            onConfigurar={cam => { setSelectedCamara(cam); setActiveWidget('camara:config') }}
            onAgregar={() => setActiveWidget('camara:agregar')}
          />
        )

      default:
        return null
    }
  }

  // ── RENDER ────────────────────────────────────────────────────────────────

  return (
    <div className="flex-1 flex flex-col bg-stone-50 dark:bg-[#0c0a09] min-h-0">

      {/* Header */}
      <div className="flex items-center justify-between px-4 h-12 border-b border-stone-200/70 dark:border-stone-800/60 bg-white dark:bg-[#1c1917] shrink-0">

        {/* Título + badge */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#2FAF8F] animate-pulse" />
          <span className="text-[12px] font-bold text-stone-700 dark:text-stone-200">Monitoreo</span>
          {alertasActivas > 0 && (
            <span className="flex items-center gap-1 text-[10px] font-medium bg-red-50 dark:bg-red-950/30 text-red-500 dark:text-red-400 px-2 py-0.5 rounded-full border border-red-100 dark:border-red-900/40">
              <span className="w-1 h-1 rounded-full bg-red-400 animate-pulse" />
              {alertasActivas} alertas
            </span>
          )}
        </div>

        {/* Acciones */}
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
      <div className="flex border-b border-stone-200/70 dark:border-stone-800/60 bg-white dark:bg-[#1c1917] px-3.5 shrink-0 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {TABS.map(tab => {
          const active  = activeTab === tab.id
          const isBadge = tab.id === 'alertas' && alertasActivas > 0
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
              {isBadge && <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />}
            </button>
          )
        })}

      </div>

      {/* Config sub-nav — fila propia */}
      {activeTab === 'config' && (
        <div className="flex gap-1 px-3.5 py-2 border-b border-stone-100 dark:border-stone-800/60 bg-stone-50/80 dark:bg-[#141210] shrink-0">
          {([
            { label: 'Cámaras',     widget: 'config:camaras'        as ModuleWidget },
            { label: 'Corrales',    widget: 'config:corrales'        as ModuleWidget },
            { label: 'Umbrales',    widget: 'anomalia:config-umbral' as ModuleWidget },
            { label: 'Calibración', widget: 'sensor:calibracion'     as ModuleWidget },
          ] as const).map(s => (
            <button
              key={s.widget}
              onClick={() => setActiveWidget(s.widget)}
              className={`px-3 py-1 rounded-[7px] text-[11px] cursor-pointer border-0 transition-all
                ${activeWidget === s.widget
                  ? 'bg-[#2FAF8F]/10 dark:bg-[#2FAF8F]/20 text-[#2FAF8F] font-semibold'
                  : 'text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300'
                }`}
            >{s.label}</button>
          ))}
        </div>
      )}

      {/* Zona widget */}
      <div className="flex-1 p-3.5 overflow-y-auto flex flex-col
        [&::-webkit-scrollbar]:w-[5px]
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:bg-stone-200
        [&::-webkit-scrollbar-thumb]:dark:bg-stone-700
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb:hover]:bg-stone-300
        [&::-webkit-scrollbar-thumb:hover]:dark:bg-stone-600">
        {renderWidget()}
      </div>

      <style>{`@keyframes livePulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
    </div>
  )
}