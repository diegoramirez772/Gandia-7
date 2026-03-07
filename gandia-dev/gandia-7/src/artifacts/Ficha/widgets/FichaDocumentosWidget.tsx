/**
 * FichaDocumentosWidget — Widget: passport:documentos
 * ARCHIVO → src/artifacts/passport/widgets/FichaDocumentosWidget.tsx
 *
 * Documentos adjuntos de identificación del animal.
 * Certificados, actas, fotografías oficiales, constancias sanitarias.
 * UX de campo: estado de vigencia muy visible, acciones claras.
 */
import { useState } from 'react'

export type DocEstatus = 'vigente' | 'por-vencer' | 'vencido' | 'pendiente'
export type DocTipo    = 'certificado' | 'acta' | 'foto' | 'constancia' | 'guia' | 'otro'

export interface Documento {
  id:       string
  nombre:   string
  tipo:     DocTipo
  fuente:   string
  fecha:    string
  vigencia?: string
  estatus:  DocEstatus
  url?:     string
  hash?:    string
}

interface Props {
  documentos?:   Documento[]
  animalNombre?: string
  animalArete?:  string
  onSubir?:      () => void
}

const MOCK_DOCS: Documento[] = [
  {
    id: 'd1', nombre: 'Certificado de Origen',           tipo: 'certificado', fuente: 'SENASICA',
    fecha: '15 Mar 2024', vigencia: '15 Mar 2025', estatus: 'vigente',    hash: '3A7F...9C2E',
  },
  {
    id: 'd2', nombre: 'Acta de Herrado',                 tipo: 'acta',        fuente: 'UPP Rancho Morales',
    fecha: '02 Ene 2024', vigencia: undefined,            estatus: 'vigente',  hash: '8B4D...1F7A',
  },
  {
    id: 'd3', nombre: 'Constancia Sanitaria (Brucelosis)', tipo: 'constancia', fuente: 'MVZ Responsable',
    fecha: '10 Feb 2025', vigencia: '10 Ago 2025',        estatus: 'por-vencer', hash: '5C9A...4D2B',
  },
  {
    id: 'd4', nombre: 'Fotografía oficial — Costado Izq.', tipo: 'foto',      fuente: 'Sistema Gandia',
    fecha: '15 Mar 2024', vigencia: undefined,             estatus: 'vigente',  hash: '2E1C...7F8D',
  },
  {
    id: 'd5', nombre: 'Constancia Tuberculosis',          tipo: 'constancia', fuente: 'MVZ Responsable',
    fecha: '01 Oct 2023', vigencia: '01 Abr 2024',        estatus: 'vencido',
  },
]

const DOC_ICON: Record<DocTipo, React.FC<{ className?: string }>> = {
  certificado: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="12" cy="8" r="4"/><path d="M9 12l-2 9 5-3 5 3-2-9"/>
    </svg>
  ),
  acta: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  foto: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  ),
  constancia: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
  ),
  guia: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <polygon points="3 11 22 2 13 21 11 13 3 11"/>
    </svg>
  ),
  otro: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
      <polyline points="13 2 13 9 20 9"/>
    </svg>
  ),
}

const ESTATUS_STYLE: Record<DocEstatus, {
  badge: string; dot: string; label: string
}> = {
  vigente:    { dot: 'bg-[#2FAF8F]',   badge: 'bg-[#2FAF8F]/10 text-[#2FAF8F] border-[#2FAF8F]/30',                                          label: 'Vigente'    },
  'por-vencer':{ dot: 'bg-amber-400',  badge: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/40', label: 'Por vencer' },
  vencido:    { dot: 'bg-red-400',     badge: 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/40',              label: 'Vencido'    },
  pendiente:  { dot: 'bg-stone-300 dark:bg-stone-600', badge: 'bg-stone-50 dark:bg-[#141210] text-stone-400 dark:text-stone-500 border-stone-200 dark:border-stone-700/50', label: 'Pendiente'  },
}

const TYPE_LABEL: Record<DocTipo, string> = {
  certificado: 'Certificado',
  acta:        'Acta',
  foto:        'Fotografía',
  constancia:  'Constancia',
  guia:        'Guía',
  otro:        'Documento',
}

export default function FichaDocumentosWidget({
  documentos = MOCK_DOCS,
  animalNombre,
  animalArete,
  onSubir,
}: Props) {
  const [expanded, setExpanded] = useState<string | null>(null)

  const vigentes    = documentos.filter(d => d.estatus === 'vigente').length
  const porVencer   = documentos.filter(d => d.estatus === 'por-vencer').length
  const vencidos    = documentos.filter(d => d.estatus === 'vencido').length

  return (
    <div className="flex flex-col gap-3">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[13.5px] font-semibold text-stone-800 dark:text-stone-100 leading-tight">Documentos de identificación</p>
          {(animalNombre || animalArete) && (
            <p className="text-[11.5px] text-stone-400 dark:text-stone-500 mt-0.5">
              {animalNombre} {animalArete && <span className="font-mono">{animalArete}</span>}
            </p>
          )}
        </div>
        {onSubir && (
          <button
            onClick={onSubir}
            className="flex items-center gap-1.5 h-8 px-3.5 rounded-[8px] bg-[#2FAF8F] hover:bg-[#27a07f] text-white text-[11.5px] font-semibold border-0 cursor-pointer transition-colors active:scale-[0.97]"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Subir
          </button>
        )}
      </div>

      {/* ── Resumen ── */}
      {(porVencer > 0 || vencidos > 0) && (
        <div className={`flex items-center gap-3 px-3.5 py-3 rounded-[10px] border ${
          vencidos > 0
            ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800/40'
            : 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40'
        }`}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={vencidos > 0 ? '#ef4444' : '#f59e0b'} strokeWidth="2" strokeLinecap="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <p className={`text-[12px] font-semibold ${vencidos > 0 ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'}`}>
            {vencidos > 0 && `${vencidos} documento${vencidos > 1 ? 's' : ''} vencido${vencidos > 1 ? 's' : ''}`}
            {vencidos > 0 && porVencer > 0 && ' · '}
            {porVencer > 0 && `${porVencer} por vencer`}
          </p>
        </div>
      )}

      {/* ── Lista ── */}
      <div className="bg-white dark:bg-[#1c1917] border border-stone-200/70 dark:border-stone-800/60 rounded-[14px] overflow-hidden">
        {documentos.map((doc, i) => {
          const es  = ESTATUS_STYLE[doc.estatus]
          const Icon = DOC_ICON[doc.tipo]
          const isExp = expanded === doc.id

          return (
            <div
              key={doc.id}
              className={i < documentos.length - 1 ? 'border-b border-stone-100 dark:border-stone-800/40' : ''}
            >
              {/* Fila principal */}
              <div
                onClick={() => setExpanded(isExp ? null : doc.id)}
                className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-colors hover:bg-stone-50 dark:hover:bg-stone-800/20 active:bg-stone-100 ${isExp ? 'bg-stone-50 dark:bg-stone-800/20' : ''}`}
              >
                {/* Icono tipo */}
                <div className={`w-9 h-9 rounded-[8px] shrink-0 flex items-center justify-center border ${
                  doc.estatus === 'vencido'
                    ? 'bg-red-50 dark:bg-red-950/25 border-red-200 dark:border-red-800/40'
                    : doc.estatus === 'por-vencer'
                    ? 'bg-amber-50 dark:bg-amber-950/25 border-amber-200 dark:border-amber-800/40'
                    : 'bg-stone-50 dark:bg-[#141210] border-stone-200/70 dark:border-stone-800/60'
                }`}>
                  <Icon className={`w-4 h-4 ${
                    doc.estatus === 'vencido'    ? 'text-red-400'   :
                    doc.estatus === 'por-vencer' ? 'text-amber-400' :
                    'text-stone-400 dark:text-stone-500'
                  }`} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[12.5px] font-semibold text-stone-700 dark:text-stone-200 leading-tight truncate">{doc.nombre}</p>
                  <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-0.5">
                    {TYPE_LABEL[doc.tipo]} · {doc.fuente} · {doc.fecha}
                  </p>
                </div>

                {/* Estatus */}
                <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-[5px] border uppercase tracking-[0.04em] shrink-0 ${es.badge}`}>
                  {es.label}
                </span>

                <svg className={`w-4 h-4 text-stone-300 dark:text-stone-600 transition-transform duration-150 shrink-0 ${isExp ? 'rotate-180' : ''}`}
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>

              {/* Detalle expandido */}
              {isExp && (
                <div className="px-4 pb-3.5 pt-3 bg-stone-50 dark:bg-stone-800/20 border-t border-stone-100 dark:border-stone-800/40 flex flex-col gap-2.5">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                    {[
                      { k: 'Fuente',    v: doc.fuente },
                      { k: 'Emitido',   v: doc.fecha  },
                      ...(doc.vigencia ? [{ k: 'Vigencia', v: doc.vigencia }] : []),
                      ...(doc.hash     ? [{ k: 'Hash',     v: doc.hash }] : []),
                    ].map(({ k, v }) => (
                      <div key={k}>
                        <p className="text-[10px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-[0.06em] mb-0.5">{k}</p>
                        <p className="text-[11.5px] font-mono text-stone-600 dark:text-stone-300">{v}</p>
                      </div>
                    ))}
                  </div>
                  {doc.url && (
                    <button className="w-full h-9 flex items-center justify-center gap-2 rounded-[8px] bg-[#2FAF8F] hover:bg-[#27a07f] text-white text-[12px] font-semibold border-0 cursor-pointer transition-colors active:scale-[0.98]">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                      Ver documento
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        })}

        {documentos.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2.5 py-10">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" className="text-stone-300 dark:text-stone-700">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            <p className="text-[12.5px] text-stone-400 dark:text-stone-500">Sin documentos adjuntos</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-1">
        <p className="text-[11px] text-stone-400 dark:text-stone-500">{vigentes} vigentes · {documentos.length} total</p>
        <p className="text-[10.5px] text-stone-300 dark:text-stone-600 font-mono">Gandia · Evidencia verificable</p>
      </div>
    </div>
  )
}