/**
 * GemelosAnima.tsx
 * Nivel Ánima — Gemelo Digital
 * ARCHIVO → src/artifacts/twins/GemelosAnima.tsx
 *
 * Tabs: Perfil · Timeline · Alimentación · Auditorías
 * Sin emojis. Mock data production-ready: reemplazar constantes MOCK_*
 * por queries Supabase sin tocar el resto del componente.
 */
import { useState } from 'react'
import CopiloAnima from '../CopiloAnima'

import TwinsTimelineWidget,     { type EventoTimeline }    from './widgets/TwinsTimelineWidget'
import TwinsAlimentacionWidget, { type DatosAlimentacion } from './widgets/TwinsAlimentacionWidget'
import TwinsFeedWidget,         { type Auditoria }         from './widgets/TwinsFeedWidget'
import TwinsPerfilesWidget,     { type AnimalListItem }    from './widgets/TwinsPerfilesWidget'
import TwinsHeroWidget, { type AnimalPerfil }              from './widgets/TwinsHeroWidget'
import TwinsPesoWidget                                     from './widgets/TwinsPesoWidget'

// ─── TIPOS ────────────────────────────────────────────────────────────────────

type Tab = 'perfil' | 'timeline' | 'alimentacion' | 'auditorias'

interface Props {
  onClose:    () => void
  onEscalate: () => void
}

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
// TODO producción: reemplazar cada constante por query a Supabase / API.
// El componente no cambia — solo los datos.

// ─── MOCK DATA — LISTA DE ANIMALES ───────────────────────────────────────────

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

const MOCK_PERFIL: AnimalPerfil = {
  arete:          'EJM-892',
  nombre:         'Lupita',
  raza:           'Charolais × Suizo Europeo',
  sexo:           'Hembra',
  edadMeses:      24,
  lote:           'Lote 4',
  corral:         'Corral 1',
  upp:            'UPP San Jacinto',
  pesoActual:     437,
  pesoNacimiento: 38,
  pesoMeta:       500,
  gananciaDiaria: 0.82,
  estado:         'engorda',
  alertas:        1,
}

const MOCK_EVENTOS: EventoTimeline[] = [
  {
    id: 1, fecha: '18 FEB 26', tipo: 'movilizacion',
    titulo:    'Traslado a Corral 1 — Engorda final',
    detalle:   'Movimiento autorizado por operador campo. Registro REEMO pendiente de firma digital del MVZ.',
    valor:     'Corral 2 → Corral 1',
    cert:      'parcial',
    ubicacion: 'Corral 1',
  },
  {
    id: 2, fecha: '10 FEB 26', tipo: 'pesaje',
    titulo:    'Pesaje semanal',
    valor:     '437 kg · +12 kg vs semana anterior',
    cert:      'completa',
    ubicacion: 'Báscula A',
  },
  {
    id: 3, fecha: '02 FEB 26', tipo: 'vacunacion',
    titulo:    'Vacunación anual 2026',
    detalle:   'Protocolo anual complejo viral-clostridial. Dosis: 2 ml IM. Operador en campo sin cámara activa — fotografía pendiente.',
    valor:     'Dosis 2 ml IM',
    cert:      'pendiente',
    ubicacion: 'Manga Corral 1',
  },
  {
    id: 4, fecha: '17 ENE 26', tipo: 'pesaje',
    titulo:    'Pesaje mensual',
    valor:     '425 kg',
    cert:      'completa',
    ubicacion: 'Báscula A',
  },
  {
    id: 5, fecha: '14 ENE 26', tipo: 'auditoria',
    titulo:    'Auditoría sanitaria SENASICA',
    detalle:   'Campaña Nacional TB y Brucelosis 2024–2025. Resultado negativo. Firma MVZ digital registrada en blockchain.',
    valor:     'Resultado negativo',
    cert:      'completa',
    ubicacion: 'UPP San Jacinto',
  },
  {
    id: 6, fecha: '10 NOV 25', tipo: 'movilizacion',
    titulo:    'Traslado a Corral 2 — Cambio de etapa',
    valor:     'Corral 3 → Corral 2',
    cert:      'completa',
    ubicacion: 'Corral 2',
  },
  {
    id: 7, fecha: '15 OCT 25', tipo: 'tratamiento',
    titulo:    'Tratamiento antiparasitario',
    detalle:   'Ivermectina 1% subcutánea. Dosis: 4.4 ml. Sin periodo de retiro activo a la fecha.',
    valor:     'Ivermectina 4.4 ml SC',
    cert:      'completa',
    ubicacion: 'Manga Corral 2',
  },
  {
    id: 8, fecha: '02 MAR 24', tipo: 'movilizacion',
    titulo:    'Ingreso — Destete maternidad',
    valor:     'Maternidad → Corral 3',
    cert:      'completa',
    ubicacion: 'Corral 3',
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

const MOCK_AUDITORIAS: Auditoria[] = [
  {
    id: 1,
    nombre: 'Auditoría sanitaria · SENASICA',
    sub:    'Campaña TB y Brucelosis 2024–2025',
    fecha:  '14 ENE 2026',
    estado: 'aprobado',
    pills: [
      { label: 'Foto vacunación',    ok: true  },
      { label: 'Firma MVZ digital',  ok: true  },
      { label: 'SINIIGA verificado', ok: true  },
      { label: 'Resultado negativo', ok: true  },
    ],
    hash:   '0x3fa8c219…d7c291 · IPFS · verificado',
    hashOk: true,
  },
  {
    id: 2,
    nombre: 'Verificación de inventario · UPP',
    sub:    'Conteo biométrico Corral 1',
    fecha:  '17 FEB 2026',
    estado: 'coincide',
    pills: [
      { label: 'Lectura biométrica', ok: true  },
      { label: 'Foto corral',        ok: true  },
      { label: 'GPS registrado',     ok: true  },
    ],
    hash:   '0xb11d9a4c…f7e004 · IPFS · verificado',
    hashOk: true,
  },
  {
    id: 3,
    nombre: 'Registro vacunación 2026',
    sub:    'Protocolo anual · Operador en campo',
    fecha:  '02 FEB 2026',
    estado: 'incompleto',
    pills: [
      { label: 'Registro manual',  ok: true  },
      { label: 'Sin fotografía',   ok: false },
      { label: 'Firma pendiente',  ok: false },
    ],
    hash:   'Sin indexar · evidencia incompleta',
    hashOk: false,
  },
]

const MOCK_COMPLETITUD  = 78
const pendientesAudit   = MOCK_AUDITORIAS.filter(a => a.estado === 'incompleto').length

// ─── TABS ─────────────────────────────────────────────────────────────────────

const TABS: { key: Tab; label: string; alerta?: boolean }[] = [
  { key: 'perfil',       label: 'Perfil'                                   },
  { key: 'timeline',     label: 'Timeline'                                 },
  { key: 'alimentacion', label: 'Alimentación'                             },
  { key: 'auditorias',   label: 'Auditorías', alerta: pendientesAudit > 0  },
]

// ─── ÍCONOS ───────────────────────────────────────────────────────────────────

function IcoCopy() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2FAF8F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <rect x="9" y="9" width="13" height="13" rx="2"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  )
}

// ─── COMPONENTE ───────────────────────────────────────────────────────────────

export default function GemelosAnima({ onClose, onEscalate }: Props) {
  const [activeTab,      setActiveTab]      = useState<Tab>('perfil')
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalListItem | null>(null)

  const handleSelectAnimal = (item: AnimalListItem) => {
    setSelectedAnimal(item)
  }

  return (
    <div className="fixed inset-0 flex flex-col z-50 bg-stone-50 dark:bg-[#0e0d0c]">

      {/* TOPBAR */}
      <div className="h-[52px] flex items-center px-5 border-b border-stone-200/70 dark:border-stone-800/60 bg-white dark:bg-[#1c1917] shrink-0 relative gap-4">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2">
          <IcoCopy />
          <span className="text-[13px] font-bold text-stone-700 dark:text-stone-200">Gemelo Digital</span>
          {selectedAnimal ? (
            <>
              <span className="hidden md:inline text-[12px] text-stone-300 dark:text-stone-600">·</span>
              <span className="hidden md:inline font-mono text-[12px] text-stone-400 dark:text-stone-500">{selectedAnimal.perfil.arete}</span>
              {selectedAnimal.perfil.nombre && (
                <span className="hidden md:inline text-[12px] text-stone-400 dark:text-stone-500">{selectedAnimal.perfil.nombre}</span>
              )}
              {selectedAnimal.perfil.alertas > 0 && (
                <span className="hidden md:inline text-[10px] font-medium text-amber-500 dark:text-amber-400 ml-1">
                  · {selectedAnimal.perfil.alertas} alerta
                </span>
              )}
            </>
          ) : (
            <>
              <span className="hidden md:inline text-[12px] text-stone-300 dark:text-stone-600">·</span>
              <span className="hidden md:inline font-mono text-[12px] text-stone-400 dark:text-stone-500">{MOCK_PERFIL.arete}</span>
              {MOCK_PERFIL.alertas > 0 && (
                <span className="hidden md:inline text-[10px] font-medium text-amber-500 dark:text-amber-400 ml-1">
                  · {MOCK_PERFIL.alertas} alerta
                </span>
              )}
            </>
          )}
        </div>

        {/* Tabs centrados */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 gap-0.5 bg-stone-100 dark:bg-[#141210] border border-stone-200/70 dark:border-stone-800/60 rounded-[12px] p-[3px]">
          {TABS.map(t => {
            const disabled = t.key !== 'perfil' && !selectedAnimal
            return (
              <button
                key={t.key}
                onClick={() => !disabled && setActiveTab(t.key)}
                className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-[9px] border-0 text-[12px] transition-all
                  ${disabled
                    ? 'text-stone-300 dark:text-stone-700 cursor-not-allowed bg-transparent'
                    : activeTab === t.key
                      ? 'bg-white dark:bg-[#1c1917] text-stone-700 dark:text-stone-200 font-semibold shadow-sm cursor-pointer'
                      : 'bg-transparent text-stone-400 dark:text-stone-500 font-normal hover:text-stone-600 dark:hover:text-stone-300 cursor-pointer'
                  }`}
              >
                {t.label}
                {t.alerta && !disabled && (
                  <span className="absolute -top-[3px] -right-[3px] w-[7px] h-[7px] rounded-full bg-amber-400 border-[1.5px] border-white dark:border-[#141210]" />
                )}
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

      {/* BODY */}
      <div className="flex-1 min-h-0 overflow-y-auto
        [&::-webkit-scrollbar]:w-[3px]
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:bg-stone-200
        [&::-webkit-scrollbar-thumb]:dark:bg-stone-700/80
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb:hover]:bg-[#2FAF8F]/60
        [&::-webkit-scrollbar-thumb:hover]:dark:bg-[#2FAF8F]/50">
        <div className="max-w-2xl mx-auto px-4 py-5">

          {activeTab === 'perfil' && (
            selectedAnimal ? (
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
          )}

          {activeTab === 'timeline' && (
            <TwinsTimelineWidget
              eventos={MOCK_EVENTOS}
              ubicacionActual={selectedAnimal?.perfil.corral ?? MOCK_PERFIL.corral}
            />
          )}

          {activeTab === 'alimentacion' && (
            <TwinsAlimentacionWidget datos={MOCK_ALIMENTACION} />
          )}

          {activeTab === 'auditorias' && (
            <TwinsFeedWidget
              auditorias={MOCK_AUDITORIAS}
              completitud={MOCK_COMPLETITUD}
            />
          )}

        </div>
      </div>

      {/* NAV MÓVIL */}
      <div className="md:hidden shrink-0 flex items-center bg-white dark:bg-[#141210] border-t border-stone-200/60 dark:border-stone-800/50">
        {TABS.map(t => {
          const disabled = t.key !== 'perfil' && !selectedAnimal
          return (
            <button
              key={t.key}
              onClick={() => !disabled && setActiveTab(t.key)}
              className={`relative flex-1 py-3 text-[11px] font-medium transition-colors bg-transparent border-0
                ${disabled
                  ? 'text-stone-300 dark:text-stone-700 cursor-not-allowed'
                  : activeTab === t.key
                    ? 'text-stone-800 dark:text-stone-100 cursor-pointer'
                    : 'text-stone-400 dark:text-stone-500 cursor-pointer'
                }`}
            >
              {t.label}
              {activeTab === t.key && !disabled && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#2FAF8F] rounded-full" />
              )}
              {t.alerta && !disabled && (
                <span className="absolute top-2 right-1/2 translate-x-3 w-[5px] h-[5px] rounded-full bg-amber-400" />
              )}
            </button>
          )
        })}
      </div>

      {/* COPILOTO */}
      <CopiloAnima domain="twins" />
    </div>
  )
}