/**
 * GemelosModulo.tsx
 * Nivel Módulo del dominio Gemelo Digital (twins).
 *
 * ARCHIVO → src/artifacts/twins/GemelosModulo.tsx
 *
 * Tabs: Perfiles · Timeline · Alimentación · Auditorías
 */
import { useState } from 'react'

import TwinsPerfilesWidget,     { type AnimalListItem }    from './widgets/TwinsPerfilesWidget'
import TwinsTimelineWidget,     { type EventoTimeline }    from './widgets/TwinsTimelineWidget'
import TwinsFeedWidget,         { type Auditoria }         from './widgets/TwinsFeedWidget'
import TwinsAlimentacionWidget, { type DatosAlimentacion } from './widgets/TwinsAlimentacionWidget'
import TwinsHeroWidget                                     from './widgets/TwinsHeroWidget'
import TwinsPesoWidget                                     from './widgets/TwinsPesoWidget'

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const MOCK_ANIMALES: AnimalListItem[] = [
  {
    perfil: {
      arete: 'EJM-892', nombre: 'Lupita', raza: 'Charolais × Suizo Europeo',
      sexo: 'Hembra', edadMeses: 24, lote: 'Lote 4', corral: 'Corral 1',
      upp: 'UPP San Jacinto', pesoActual: 437, pesoNacimiento: 38,
      pesoMeta: 500, gananciaDiaria: 0.82, estado: 'engorda', alertas: 1,
    },
    pesos: [
      { fecha: '02 MAR 24', peso:  38, objetivo:  38 },
      { fecha: '01 SEP 24', peso: 210, objetivo: 200 },
      { fecha: '01 FEB 25', peso: 340, objetivo: 345 },
      { fecha: '24 FEB 26', peso: 437, objetivo: 480 },
    ],
  },
  {
    perfil: {
      arete: 'EJM-741', nombre: 'Canela', raza: 'Hereford',
      sexo: 'Hembra', edadMeses: 18, lote: 'Lote 2', corral: 'Corral 2',
      upp: 'UPP San Jacinto', pesoActual: 362, pesoNacimiento: 35,
      pesoMeta: 480, gananciaDiaria: 0.74, estado: 'engorda', alertas: 0,
    },
    pesos: [
      { fecha: '15 MAY 24', peso:  35, objetivo:  35 },
      { fecha: '01 SEP 24', peso: 180, objetivo: 175 },
      { fecha: '01 FEB 25', peso: 290, objetivo: 300 },
      { fecha: '24 FEB 26', peso: 362, objetivo: 390 },
    ],
  },
  {
    perfil: {
      arete: 'EJM-503', nombre: 'Presumida', raza: 'Simmental',
      sexo: 'Hembra', edadMeses: 30, lote: 'Lote 1', corral: 'Corral 3',
      upp: 'UPP San Jacinto', pesoActual: 512, pesoNacimiento: 41,
      pesoMeta: 520, gananciaDiaria: 0.91, estado: 'engorda', alertas: 0,
    },
    pesos: [
      { fecha: '10 AGO 23', peso:  41, objetivo:  41 },
      { fecha: '01 FEB 24', peso: 220, objetivo: 210 },
      { fecha: '01 AGO 24', peso: 380, objetivo: 370 },
      { fecha: '24 FEB 26', peso: 512, objetivo: 510 },
    ],
  },
  {
    perfil: {
      arete: 'EJM-188', nombre: undefined, raza: 'Charolais',
      sexo: 'Macho', edadMeses: 12, lote: 'Lote 3', corral: 'Corral 4',
      upp: 'UPP San Jacinto', pesoActual: 198, pesoNacimiento: 40,
      pesoMeta: 500, gananciaDiaria: 0.55, estado: 'cría', alertas: 2,
    },
    pesos: [
      { fecha: '01 FEB 25', peso:  40, objetivo:  40 },
      { fecha: '01 AGO 25', peso: 140, objetivo: 160 },
      { fecha: '24 FEB 26', peso: 198, objetivo: 230 },
    ],
  },
  {
    perfil: {
      arete: 'EJM-330', nombre: 'Reina', raza: 'Suizo Americano',
      sexo: 'Hembra', edadMeses: 36, lote: 'Lote 1', corral: 'Corral 1',
      upp: 'UPP San Jacinto', pesoActual: 489, pesoNacimiento: 38,
      pesoMeta: 500, gananciaDiaria: 0.88, estado: 'reproducción', alertas: 0,
    },
    pesos: [
      { fecha: '01 FEB 23', peso:  38, objetivo:  38 },
      { fecha: '01 AGO 23', peso: 240, objetivo: 230 },
      { fecha: '01 FEB 24', peso: 380, objetivo: 370 },
      { fecha: '24 FEB 26', peso: 489, objetivo: 490 },
    ],
  },
]

const MOCK_EVENTOS: EventoTimeline[] = [
  { id: 1, fecha: '18 FEB 26', tipo: 'movilizacion', titulo: 'Traslado a Corral 1 — Engorda final',    detalle: 'Movimiento autorizado por operador campo. Registro REEMO pendiente de firma digital del MVZ.', valor: 'Corral 2 → Corral 1',    cert: 'parcial',   ubicacion: 'Corral 1'        },
  { id: 2, fecha: '10 FEB 26', tipo: 'pesaje',        titulo: 'Pesaje semanal',                         valor: '437 kg · +12 kg vs semana anterior',                                                          cert: 'completa',               ubicacion: 'Báscula A'       },
  { id: 3, fecha: '02 FEB 26', tipo: 'vacunacion',    titulo: 'Vacunación anual 2026',                  detalle: 'Protocolo anual complejo viral-clostridial. Dosis: 2 ml IM. Fotografía pendiente.',          valor: 'Dosis 2 ml IM',         cert: 'pendiente', ubicacion: 'Manga Corral 1'  },
  { id: 4, fecha: '17 ENE 26', tipo: 'pesaje',        titulo: 'Pesaje mensual',                         valor: '425 kg',                                                                                      cert: 'completa',               ubicacion: 'Báscula A'       },
  { id: 5, fecha: '14 ENE 26', tipo: 'auditoria',     titulo: 'Auditoría sanitaria SENASICA',           detalle: 'Campaña Nacional TB y Brucelosis 2024–2025. Resultado negativo. Firma MVZ registrada.',      valor: 'Resultado negativo',    cert: 'completa',  ubicacion: 'UPP San Jacinto' },
  { id: 6, fecha: '10 NOV 25', tipo: 'movilizacion',  titulo: 'Traslado a Corral 2 — Cambio de etapa', valor: 'Corral 3 → Corral 2',                                                                         cert: 'completa',               ubicacion: 'Corral 2'        },
  { id: 7, fecha: '15 OCT 25', tipo: 'tratamiento',   titulo: 'Tratamiento antiparasitario',            detalle: 'Ivermectina 1% subcutánea. Dosis: 4.4 ml. Sin periodo de retiro activo.',                   valor: 'Ivermectina 4.4 ml SC', cert: 'completa',  ubicacion: 'Manga Corral 2'  },
  { id: 8, fecha: '02 MAR 24', tipo: 'movilizacion',  titulo: 'Ingreso — Destete maternidad',           valor: 'Maternidad → Corral 3',                                                                       cert: 'completa',               ubicacion: 'Corral 3'        },
]

const MOCK_AUDITORIAS: Auditoria[] = [
  {
    id: 1,
    nombre: 'Auditoría sanitaria · SENASICA', sub: 'Campaña TB y Brucelosis 2024–2025',
    fecha: '14 ENE 2026', estado: 'aprobado',
    pills: [
      { label: 'Foto vacunación',    ok: true  },
      { label: 'Firma MVZ digital',  ok: true  },
      { label: 'SINIIGA verificado', ok: true  },
      { label: 'Resultado negativo', ok: true  },
    ],
    hash: '0x3fa8c219…d7c291 · IPFS · verificado', hashOk: true,
  },
  {
    id: 2,
    nombre: 'Verificación de inventario · UPP', sub: 'Conteo biométrico Corral 1',
    fecha: '17 FEB 2026', estado: 'coincide',
    pills: [
      { label: 'Lectura biométrica', ok: true },
      { label: 'Foto corral',        ok: true },
      { label: 'GPS registrado',     ok: true },
    ],
    hash: '0xb11d9a4c…f7e004 · IPFS · verificado', hashOk: true,
  },
  {
    id: 3,
    nombre: 'Registro vacunación 2026', sub: 'Protocolo anual · Operador en campo',
    fecha: '02 FEB 2026', estado: 'incompleto',
    pills: [
      { label: 'Registro manual',  ok: true  },
      { label: 'Sin fotografía',   ok: false },
      { label: 'Firma pendiente',  ok: false },
    ],
    hash: 'Sin indexar · evidencia incompleta', hashOk: false,
  },
]

const MOCK_ALIMENTACION: DatosAlimentacion = {
  semanas: [
    { fecha: '24 FEB', forraje: 95, concentrado: 88, suplemento: 62 },
    { fecha: '17 FEB', forraje: 92, concentrado: 91, suplemento: 84 },
    { fecha: '10 FEB', forraje: 97, concentrado: 93, suplemento: 89 },
    { fecha: '03 FEB', forraje: 90, concentrado: 85, suplemento: 91 },
  ],
  caActual:    6.8,
  caObjetivo:  7.1,
  caIndustria: 8.2,
  proyDias:    38,
  proyFecha:   '08 ABR 2026',
  pesoMeta:    500,
  pesoActual:  437,
}

// ─── TIPOS ────────────────────────────────────────────────────────────────────

type Tab = 'perfiles' | 'timeline' | 'alimentacion' | 'auditorias'

interface Props {
  onClose:    () => void
  onEscalate: () => void
}

const TABS: { id: Tab; label: string }[] = [
  { id: 'perfiles',     label: 'Perfiles'     },
  { id: 'timeline',     label: 'Timeline'     },
  { id: 'alimentacion', label: 'Alimentación' },
  { id: 'auditorias',   label: 'Auditorías'   },
]

const pendientesAudit = MOCK_AUDITORIAS.filter(a => a.estado === 'incompleto').length

// ─── COMPONENTE ───────────────────────────────────────────────────────────────

export default function GemelosModulo({ onClose, onEscalate }: Props) {
  const [activeTab,      setActiveTab]      = useState<Tab>('perfiles')
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalListItem | null>(null)

  const handleSelectAnimal = (item: AnimalListItem) => {
    setSelectedAnimal(item)
    // nos quedamos en Perfiles mostrando el detalle
  }

  const renderWidget = () => {
    switch (activeTab) {
      case 'perfiles':
        return selectedAnimal ? (
          <div className="flex flex-col gap-4">
            <button
              onClick={() => setSelectedAnimal(null)}
              className="flex items-center gap-1.5 text-[12px] text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 transition-colors bg-transparent border-0 cursor-pointer w-fit"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="15 19 8 12 15 5"/>
              </svg>
              Todos los animales
            </button>
            <TwinsHeroWidget perfil={selectedAnimal.perfil} />
            <TwinsPesoWidget
              registros={selectedAnimal.pesos}
              pesoMeta={selectedAnimal.perfil.pesoMeta}
              gananciaDiaria={selectedAnimal.perfil.gananciaDiaria}
            />
          </div>
        ) : (
          <TwinsPerfilesWidget
            animales={MOCK_ANIMALES}
            selected={selectedAnimal}
            onSelect={handleSelectAnimal}
          />
        )
      case 'timeline':
        return <TwinsTimelineWidget eventos={MOCK_EVENTOS} ubicacionActual={selectedAnimal!.perfil.corral} />
      case 'alimentacion':
        return <TwinsAlimentacionWidget datos={MOCK_ALIMENTACION} />
      case 'auditorias':
        return <TwinsFeedWidget auditorias={MOCK_AUDITORIAS} completitud={78} />
      default:
        return null
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-stone-50 dark:bg-[#0c0a09] min-h-0">

      {/* Header */}
      <div className="flex items-center justify-between px-4 h-12 border-b border-stone-200/70 dark:border-stone-800/60 bg-white dark:bg-[#1c1917] shrink-0">
        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2FAF8F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <rect x="9" y="9" width="13" height="13" rx="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
          <span className="text-[12px] font-bold text-stone-700 dark:text-stone-200">Gemelo Digital</span>
          {selectedAnimal ? (
            <>
              <span className="text-stone-300 dark:text-stone-700 text-[10px]">/</span>
              <span className="font-mono text-[11px] text-stone-500 dark:text-stone-400">{selectedAnimal.perfil.arete}</span>
              {selectedAnimal.perfil.nombre && (
                <span className="text-[11px] text-stone-400 dark:text-stone-500">{selectedAnimal.perfil.nombre}</span>
              )}
              <button
                onClick={() => { setSelectedAnimal(null); setActiveTab('perfiles') }}
                className="flex items-center gap-1 text-[10.5px] text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 transition-colors bg-transparent border-0 cursor-pointer ml-1"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 19 8 12 15 5"/></svg>
                Lista
              </button>
            </>
          ) : (
            pendientesAudit > 0 && (
              <span className="flex items-center gap-1 text-[10px] font-medium text-amber-500 dark:text-amber-400">
                <span className="w-1 h-1 rounded-full bg-amber-400 animate-pulse" />
                {pendientesAudit} alerta{pendientesAudit > 1 ? 's' : ''}
              </span>
            )
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
      <div className="flex border-b border-stone-200/70 dark:border-stone-800/60 bg-white dark:bg-[#1c1917] px-3.5 shrink-0 overflow-x-auto [&::-webkit-scrollbar]:hidden">
        {TABS.map(tab => {
          const active    = activeTab === tab.id
          const isBadge   = tab.id === 'auditorias' && pendientesAudit > 0
          const disabled  = tab.id !== 'perfiles' && !selectedAnimal
          return (
            <button
              key={tab.id}
              onClick={() => !disabled && setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-2.5 py-2.5 text-[11.5px] border-0 bg-transparent transition-all -mb-px shrink-0
                ${disabled
                  ? 'text-stone-300 dark:text-stone-700 cursor-not-allowed border-b-2 border-transparent'
                  : active
                    ? 'text-stone-700 dark:text-stone-200 font-semibold border-b-2 border-[#2FAF8F] cursor-pointer'
                    : 'text-stone-400 dark:text-stone-500 font-normal border-b-2 border-transparent hover:text-stone-600 dark:hover:text-stone-300 cursor-pointer'
                }`}
            >
              {tab.label}
              {isBadge && !disabled && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />}
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