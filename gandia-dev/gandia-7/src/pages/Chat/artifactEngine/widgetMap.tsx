/**
 * artifactEngine/widgetMap.tsx
 */

import React from 'react'

import {
  MOCK_PASSPORT,
  CORRALES,
  CAMARAS,
  CAMARA_ACTIVA,
  CORRAL_DETALLE,
  ANOMALIAS,
  ANOMALIA_DETALLE,
  SENSOR_STATS,
  MOCK_EVENTOS_TWINS,
  MOCK_AUDITORIAS_TWINS,
  MOCK_ALIMENTACION_TWINS,
} from './mockData'

// ── Ficha Ganadera ─────────────────────────────────────────────────────────────
import FichaCard             from '../../../artifacts/Ficha/widgets/FichaCard'
import FichaPerfilesWidget   from '../../../artifacts/Ficha/widgets/FichaPerfilesWidget'
import FichaDocumentosWidget from '../../../artifacts/Ficha/widgets/FichaDocumentosWidget'
import FichaHuellaWidget     from '../../../artifacts/Ficha/widgets/FichaHuellaWidget'
import FichaNuevoWidget      from '../../../artifacts/Ficha/widgets/FichaNuevoWidget'

// ── Monitoring widgets ────────────────────────────────────────────────────────
import MapaVistaGeneralWidget   from '../../../artifacts/monitoring/widgets/MapaVistaGeneralWidget'
import MapaCorralDetalleWidget  from '../../../artifacts/monitoring/widgets/MapaCorralDetalleWidget'
import SensorConteoLiveWidget   from '../../../artifacts/monitoring/widgets/SensorConteoLiveWidget'
import SensorCalibracionWidget  from '../../../artifacts/monitoring/widgets/SensorCalibracionWidget'
import AnomaliaFeedWidget       from '../../../artifacts/monitoring/widgets/AnomaliaFeedWidget'
import AnomaliaDetalleWidget    from '../../../artifacts/monitoring/widgets/AnomaliaDetalleWidget'
import AnomaliaConfigUmbralWidget from '../../../artifacts/monitoring/widgets/AnomaliaConfigUmbralWidget'
import CamaraListaWidget        from '../../../artifacts/monitoring/widgets/CamaraListaWidget'
import CamaraFeedWidget         from '../../../artifacts/monitoring/widgets/CamaraFeedWidget'
import CamaraConfigWidget       from '../../../artifacts/monitoring/widgets/CamaraConfigWidget'
import CamaraAgregarWidget      from '../../../artifacts/monitoring/widgets/CamaraAgregarWidget'
import ConfigCamarasWidget      from '../../../artifacts/monitoring/widgets/ConfigCamarasWidget'
import ConfigCorralesWidget     from '../../../artifacts/monitoring/widgets/ConfigCorralesWidget'

// ── Sanidad ───────────────────────────────────────────────────────────────────
import GusanoWidget from '../../../artifacts/sanidad/widgets/GusanoWidget'

// ── Gemelo Digital ────────────────────────────────────────────────────────────
import TwinsTimelineWidget     from '../../../artifacts/twins/widgets/TwinsTimelineWidget'
import TwinsFeedWidget         from '../../../artifacts/twins/widgets/TwinsFeedWidget'
import TwinsAlimentacionWidget from '../../../artifacts/twins/widgets/TwinsAlimentacionWidget'

// ── Biometría ─────────────────────────────────────────────────────────────────
import BiometriaCapturaWidget      from '../../../artifacts/biometria/widgets/BiometriaCapturaWidget'
import BiometriaHistorialWidget    from '../../../artifacts/biometria/widgets/BiometriaHistorialWidget'
import BiometriaEstadisticasWidget from '../../../artifacts/biometria/widgets/BiometriaEstadisticasWidget'
import BiometriaConfigWidget       from '../../../artifacts/biometria/widgets/BiometriaConfigWidget'
import BiometriaRegistrarWidget    from '../../../artifacts/biometria/widgets/BiometriaRegistrarWidget'
import { MOCK_REGISTROS_BIOMETRIA } from './mockData'

// ── Certificación ─────────────────────────────────────────────────────────────
import CertificationCardWidget         from '../../../artifacts/certification/widgets/CertificationCardWidget'
import CertificationElegibilidadWidget from '../../../artifacts/certification/widgets/CertificationElegibilidadWidget'
import CertificationChecklistWidget    from '../../../artifacts/certification/widgets/CertificationChecklistWidget'
import CertificationDocumentosWidget   from '../../../artifacts/certification/widgets/CertificationDocumentosWidget'
import CertificationVencimientosWidget from '../../../artifacts/certification/widgets/CertificationVencimientosWidget'

// ── Verificación ──────────────────────────────────────────────────────────────
import VerificationColaWidget            from '../../../artifacts/verification/widgets/VerificationColaWidget'
import VerificationItemWidget            from '../../../artifacts/verification/widgets/VerificationItemWidget'
import VerificationHistorialWidget       from '../../../artifacts/verification/widgets/VerificationHistorialWidget'
import VerificationInconsistenciasWidget from '../../../artifacts/verification/widgets/VerificationInconsistenciasWidget'
import {
  MOCK_CERT_CARDS,
  MOCK_ELEGIBILIDAD,
  MOCK_CHECKLIST,
  MOCK_DOCUMENTOS,
  MOCK_VENCIMIENTOS,
  MOCK_VERIFICATION_COLA,
  MOCK_VERIFICATION_ITEM,
  MOCK_VERIFICATION_HISTORIAL,
  MOCK_VERIFICATION_INCONSISTENCIAS,
} from './mockData'

export interface WidgetCallbacks {
  onExpand: () => void
}

const EXPANDABLE_WIDGETS = new Set([
  // Ficha Ganadera
  'passport:card',
  'passport:perfiles',
  'passport:documentos',
  'passport:biometria',
  // Monitoring
  'monitoring:mapa',
  'monitoring:sensor',
  'monitoring:anomalia',
  // Twins
  'twins:timeline',
  'twins:feed',
  'twins:alimentacion',
  // Biometría
  'biometria:captura',
  'biometria:resultado',
  'biometria:historial',
  'biometria:estadisticas',
  'biometria:config',
  'biometria:registrar',
  // Certificación
  'certification:card',
  'certification:elegibilidad',
  'certification:checklist',
  'certification:documentos',
  'certification:vencimientos',
  // Verificación
  'verification:cola',
  'verification:item',
  'verification:historial',
  'verification:inconsistencias',
])

export function renderWidget(
  widgetId: string,
  { onExpand }: WidgetCallbacks,
): React.ReactNode {

  const node = getWidgetNode(widgetId, onExpand)
  if (!node) return null

  if (EXPANDABLE_WIDGETS.has(widgetId)) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {node}
        <button
          onClick={onExpand}
          style={{
            alignSelf:    'flex-end',
            padding:      '6px 14px',
            borderRadius: 9,
            border:       'none',
            background:   '#2FAF8F',
            color:        'white',
            fontSize:     11,
            fontWeight:   600,
            cursor:       'pointer',
          }}
        >
          Ver módulo completo →
        </button>
      </div>
    )
  }

  return node
}

function getWidgetNode(widgetId: string, onExpand: () => void): React.ReactNode {
  switch (widgetId) {

    // ── Ficha Ganadera ──
    case 'passport:card':
      return (
        <FichaCard
          data={MOCK_PASSPORT}
          onExpand={onExpand}
          onHuella={onExpand}
        />
      )

    case 'passport:perfiles':
      return <FichaPerfilesWidget onNuevo={onExpand} onSelectAnimal={onExpand} />

    case 'passport:documentos':
      return <FichaDocumentosWidget onSubir={onExpand} />

    case 'passport:biometria':
      return <FichaHuellaWidget onCapturar={onExpand} onVerHistorial={onExpand} />

    case 'passport:nuevo':
      return <FichaNuevoWidget />

    // ── Mapa ──
    case 'monitoring:mapa':
      return <MapaVistaGeneralWidget corrales={CORRALES} />

    case 'mapa:corral-detalle':
      return <MapaCorralDetalleWidget corral={CORRAL_DETALLE} />

    // ── Sensor ──
    case 'monitoring:sensor':
      return <SensorConteoLiveWidget stats={SENSOR_STATS} />

    case 'sensor:calibracion':
      return <SensorCalibracionWidget />

    // ── Anomalía ──
    case 'monitoring:anomalia':
      return <AnomaliaFeedWidget anomalias={ANOMALIAS} />

    case 'anomalia:detalle':
      return <AnomaliaDetalleWidget anomalia={ANOMALIA_DETALLE} />

    case 'anomalia:config-umbral':
      return <AnomaliaConfigUmbralWidget />

    // ── Cámara ──
    case 'camara:lista':
      return <CamaraListaWidget camaras={CAMARAS} />

    case 'camara:feed':
      return <CamaraFeedWidget camara={CAMARA_ACTIVA} />

    case 'camara:config':
      return <CamaraConfigWidget camara={CAMARA_ACTIVA} corrales={CORRALES} />

    case 'camara:agregar':
      return <CamaraAgregarWidget corrales={CORRALES} />

    case 'config:camaras':
      return <ConfigCamarasWidget camaras={CAMARAS} />

    case 'config:corrales':
      return <ConfigCorralesWidget corrales={CORRALES} />

    // ── Sanidad ──
    case 'sanidad:gusano':
      return <GusanoWidget />

    // ── Gemelo Digital ──
    case 'twins:timeline':
      return <TwinsTimelineWidget eventos={MOCK_EVENTOS_TWINS} ubicacionActual="Corral 1" />

    case 'twins:feed':
      return <TwinsFeedWidget auditorias={MOCK_AUDITORIAS_TWINS} completitud={78} />

    case 'twins:alimentacion':
      return <TwinsAlimentacionWidget datos={MOCK_ALIMENTACION_TWINS} />

    // ── Biometría ──
    case 'biometria:captura':
      return <BiometriaCapturaWidget compact />

    case 'biometria:resultado':
      return null

    case 'biometria:historial':
      return <BiometriaHistorialWidget registros={MOCK_REGISTROS_BIOMETRIA} />

    case 'biometria:estadisticas':
      return <BiometriaEstadisticasWidget registros={MOCK_REGISTROS_BIOMETRIA} />

    case 'biometria:config':
      return <BiometriaConfigWidget />

    case 'biometria:registrar':
      return <BiometriaRegistrarWidget />

    // ── Certificación ──
    case 'certification:card':
      return <CertificationCardWidget data={MOCK_CERT_CARDS[0]} onExpand={onExpand} onVerCheck={onExpand} />

    case 'certification:elegibilidad':
      return <CertificationElegibilidadWidget datos={MOCK_ELEGIBILIDAD} onExpedir={onExpand} onVerDetalle={onExpand} />

    case 'certification:checklist':
      return <CertificationChecklistWidget datos={MOCK_CHECKLIST} />

    case 'certification:documentos':
      return <CertificationDocumentosWidget datos={MOCK_DOCUMENTOS} />

    case 'certification:vencimientos':
      return <CertificationVencimientosWidget vencimientos={MOCK_VENCIMIENTOS} />

    // ── Verificación ──
    case 'verification:cola':
      return <VerificationColaWidget items={MOCK_VERIFICATION_COLA} />

    case 'verification:item':
      return <VerificationItemWidget item={MOCK_VERIFICATION_ITEM} />

    case 'verification:historial':
      return <VerificationHistorialWidget historial={MOCK_VERIFICATION_HISTORIAL} />

    case 'verification:inconsistencias':
      return <VerificationInconsistenciasWidget inconsistencias={MOCK_VERIFICATION_INCONSISTENCIAS} />

    default:
      return null
  }
}