/**
 * CertificationDocumentosWidget
 * Diseño institucional — tabla de documentos, sin cajas por fila.
 */
export type EstadoDoc = 'ok' | 'pendiente' | 'faltante'
export type TipoDoc   = 'resultado_lab' | 'vacunacion' | 'reemo' | 'foto_oficial' | 'firma_mvz' | 'auditoria' | 'identificacion' | 'otro'

export interface Documento {
  id:      number
  tipo:    TipoDoc
  nombre:  string
  estado:  EstadoDoc
  fecha?:  string
  emisor?: string
  hash?:   string
  hashOk?: boolean
  critico: boolean
}

export interface DatosDocumentos {
  animal:      string
  arete:       string
  tipoCert:    string
  documentos:  Documento[]
  completitud: number
}

interface Props {
  datos:    DatosDocumentos
  onSubir?: (docId: number) => void
}

const DOC_ESTADO: Record<EstadoDoc, { label: string; color: string; symbol: string }> = {
  ok:       { label: 'Ok',        color: '#2FAF8F', symbol: '✓' },
  pendiente:{ label: 'Pendiente', color: '#d97706', symbol: '◐' },
  faltante: { label: 'Faltante',  color: '#e11d48', symbol: '○' },
}

export default function CertificationDocumentosWidget({ datos, onSubir }: Props) {
  const presentes = datos.documentos.filter(d => d.estado === 'ok').length
  const criticos  = datos.documentos.filter(d => d.estado !== 'ok' && d.critico).length
  const pctColor  = datos.completitud === 100 ? '#2FAF8F' : criticos > 0 ? '#e11d48' : '#d97706'

  return (
    <div className="flex flex-col">

      {/* Hero */}
      <div className="pb-5 border-b border-stone-200/60 dark:border-stone-800/50">
        <p className="text-[11px] text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-2">Expediente · {datos.tipoCert}</p>
        <div className="flex items-end gap-3">
          <p className="text-[48px] font-black leading-none tabular-nums" style={{ color: pctColor }}>{datos.completitud}</p>
          <div className="pb-1">
            <p className="text-[16px] text-stone-300 dark:text-stone-600 leading-none">%</p>
            <p className="text-[12px] text-stone-400 dark:text-stone-500 mt-0.5">{presentes}/{datos.documentos.length} docs</p>
          </div>
        </div>
        <div className="mt-3 h-1 bg-stone-100 dark:bg-stone-800/50 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${datos.completitud}%`, backgroundColor: pctColor }}/>
        </div>
        {criticos > 0 && (
          <p className="text-[11px] text-rose-500 mt-1.5 font-semibold">{criticos} documento{criticos > 1 ? 's' : ''} crítico{criticos > 1 ? 's' : ''} faltante{criticos > 1 ? 's' : ''}</p>
        )}
        <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-1">
          {datos.animal} <span className="font-mono">{datos.arete}</span>
        </p>
      </div>

      {/* Tabla de documentos */}
      <div className="divide-y divide-stone-100 dark:divide-stone-800/40">
        {datos.documentos.map(doc => {
          const est = DOC_ESTADO[doc.estado]
          return (
            <div key={doc.id} className="flex items-start gap-3 py-3.5 px-1">

              {/* Símbolo estado */}
              <span className="text-[13px] font-black w-5 shrink-0 mt-0.5 text-center" style={{ color: est.color }}>
                {est.symbol}
              </span>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className={`text-[12px] font-semibold leading-snug ${doc.estado === 'ok' ? 'text-stone-600 dark:text-stone-300' : doc.critico ? 'text-stone-700 dark:text-stone-200' : 'text-stone-600 dark:text-stone-300'}`}>
                      {doc.nombre}
                      {doc.critico && doc.estado !== 'ok' && (
                        <span className="ml-1.5 text-[9.5px] font-bold uppercase tracking-wide" style={{ color: '#e11d48' }}>crítico</span>
                      )}
                    </p>
                    {(doc.fecha || doc.emisor) && (
                      <p className="text-[10.5px] text-stone-400 dark:text-stone-500 mt-0.5">
                        {doc.fecha}{doc.fecha && doc.emisor ? ' · ' : ''}{doc.emisor}
                      </p>
                    )}
                    {doc.hash && (
                      <p className={`text-[9.5px] font-mono mt-0.5 ${doc.hashOk ? 'text-[#2FAF8F]' : 'text-rose-400'}`}>{doc.hash}</p>
                    )}
                  </div>
                  <p className="text-[11px] font-semibold shrink-0" style={{ color: est.color }}>{est.label}</p>
                </div>

                {doc.estado !== 'ok' && onSubir && (
                  <button onClick={() => onSubir(doc.id)}
                    className="mt-1.5 text-[10.5px] font-semibold cursor-pointer border-0 bg-transparent p-0 transition-colors"
                    style={{ color: '#2FAF8F' }}>
                    Subir documento ↑
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}