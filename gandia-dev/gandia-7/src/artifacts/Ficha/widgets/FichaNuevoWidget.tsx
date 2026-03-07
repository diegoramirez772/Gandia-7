/**
 * FichaNuevoWidget — Widget: passport:nuevo
 * ARCHIVO → src/artifacts/passport/widgets/FichaNuevoWidget.tsx
 *
 * Registro de nueva ficha ganadera.
 * Filosofía Gandia: flujo por pasos, no formulario extenso.
 * 3 pasos → resumen → confirmar.
 * UX de campo: controles grandes, un campo por foco, validación clara.
 */
import { useState } from 'react'

interface FormData {
  // Paso 1 — Identidad
  arete:     string
  rfid:      string
  siniiga:   string
  // Paso 2 — Animal
  nombre:    string
  raza:      string
  sexo:      'M' | 'H' | ''
  nacimiento:string
  peso:      string
  // Paso 3 — Propiedad
  upp:       string
  propietario: string
  lote:      string
}

interface Props {
  onGuardar?: (data: FormData) => void
  onCancelar?: () => void
}

const PASO_INFO = [
  { num: 1, label: 'Identificación',  desc: 'Aretes y registros oficiales' },
  { num: 2, label: 'Animal',          desc: 'Raza, sexo y datos físicos'   },
  { num: 3, label: 'Propiedad',       desc: 'UPP, propietario y lote'      },
]

const RAZAS = ['Angus', 'Brahman', 'Charolais', 'Hereford', 'Limousin', 'Simmental', 'Suizo', 'Sardo Negro', 'Otra']

const inputCls = "w-full h-11 px-3.5 rounded-[10px] border border-stone-200/70 dark:border-stone-800/60 bg-stone-50 dark:bg-[#141210] text-[13px] text-stone-700 dark:text-stone-200 placeholder:text-stone-400 dark:placeholder:text-stone-500 outline-none focus:border-[#2FAF8F]/60 focus:ring-2 focus:ring-[#2FAF8F]/08 transition-all"
const labelCls = "text-[11.5px] font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-[0.05em] mb-1.5 block"

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  )
}

export default function FichaNuevoWidget({ onGuardar, onCancelar }: Props) {
  const [paso, setPaso] = useState(1)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState<FormData>({
    arete: '', rfid: '', siniiga: '',
    nombre: '', raza: '', sexo: '', nacimiento: '', peso: '',
    upp: '', propietario: '', lote: '',
  })

  const set = (k: keyof FormData, v: string) => setForm(f => ({ ...f, [k]: v }))

  // Validación por paso
  const valid1 = form.arete.trim().length > 0
  const valid2 = form.raza && form.sexo && form.nacimiento
  const valid3 = form.upp.trim().length > 0 && form.propietario.trim().length > 0

  const canNext = paso === 1 ? valid1 : paso === 2 ? valid2 : paso === 3 ? valid3 : false

  const handleGuardar = () => {
    setSaved(true)
    setTimeout(() => { onGuardar?.(form); setSaved(false) }, 1200)
  }

  // ── Resumen para paso 4
  const RESUMEN = [
    { k: 'Arete',       v: form.arete      || '—' },
    { k: 'RFID',        v: form.rfid       || '—' },
    { k: 'SINIIGA',     v: form.siniiga    || '—' },
    { k: 'Nombre',      v: form.nombre     || '—' },
    { k: 'Raza',        v: form.raza       || '—' },
    { k: 'Sexo',        v: form.sexo === 'M' ? 'Macho' : form.sexo === 'H' ? 'Hembra' : '—' },
    { k: 'Nacimiento',  v: form.nacimiento || '—' },
    { k: 'Peso aprox.', v: form.peso ? `${form.peso} kg` : '—' },
    { k: 'UPP',         v: form.upp        || '—' },
    { k: 'Propietario', v: form.propietario || '—' },
    { k: 'Lote',        v: form.lote       || '—' },
  ]

  return (
    <div className="flex flex-col gap-4">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[14px] font-bold text-stone-800 dark:text-stone-100 leading-tight">Nueva Ficha Ganadera</p>
          <p className="text-[11.5px] text-stone-400 dark:text-stone-500 mt-0.5">Registro de animal en la UPP</p>
        </div>
        {onCancelar && (
          <button onClick={onCancelar} className="text-[11.5px] text-stone-400 hover:text-stone-600 transition-colors cursor-pointer border-0 bg-transparent p-0">
            Cancelar
          </button>
        )}
      </div>

      {/* ── Stepper ── */}
      <div className="flex items-center gap-0">
        {PASO_INFO.map((p, i) => {
          const done   = paso > p.num
          const active = paso === p.num
          return (
            <div key={p.num} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12.5px] font-bold transition-all duration-200 ${
                  done   ? 'bg-[#2FAF8F] text-white' :
                  active ? 'bg-stone-800 dark:bg-stone-100 text-white dark:text-stone-800' :
                  'bg-stone-100 dark:bg-stone-800/60 text-stone-400 dark:text-stone-500'
                }`}>
                  {done
                    ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    : p.num
                  }
                </div>
                <span className={`text-[9.5px] font-semibold text-center leading-tight ${
                  active ? 'text-stone-700 dark:text-stone-200' : 'text-stone-400 dark:text-stone-500'
                }`}>{p.label}</span>
              </div>
              {i < PASO_INFO.length - 1 && (
                <div className={`flex-1 h-px mx-1 mb-4 ${
                  paso > p.num ? 'bg-[#2FAF8F]' : 'bg-stone-200 dark:bg-stone-700/60'
                }`} />
              )}
            </div>
          )
        })}
      </div>

      {/* ── Contenido por paso ── */}
      <div className="bg-white dark:bg-[#1c1917] border border-stone-200/70 dark:border-stone-800/60 rounded-[14px] overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-100 dark:border-stone-800/40">
          <p className="text-[12px] font-semibold text-stone-700 dark:text-stone-200">
            {paso <= 3 ? `Paso ${paso} · ${PASO_INFO[paso - 1].desc}` : 'Resumen · Confirmar registro'}
          </p>
        </div>

        <div className="px-5 py-5 flex flex-col gap-4">

          {/* ── PASO 1: Identidad ── */}
          {paso === 1 && (
            <>
              <FieldGroup label="Arete *">
                <input
                  autoFocus
                  value={form.arete}
                  onChange={e => set('arete', e.target.value)}
                  placeholder="Ej. #0142"
                  className={inputCls}
                />
              </FieldGroup>
              <div className="grid grid-cols-2 gap-3">
                <FieldGroup label="RFID (chip)">
                  <input value={form.rfid} onChange={e => set('rfid', e.target.value)} placeholder="900xxxxxxxxxxxx" className={inputCls} />
                </FieldGroup>
                <FieldGroup label="SINIIGA">
                  <input value={form.siniiga} onChange={e => set('siniiga', e.target.value)} placeholder="MX…" className={inputCls} />
                </FieldGroup>
              </div>
              <p className="text-[11.5px] text-stone-400 dark:text-stone-500 leading-relaxed">
                El arete es el único campo obligatorio. RFID y SINIIGA pueden agregarse después.
              </p>
            </>
          )}

          {/* ── PASO 2: Animal ── */}
          {paso === 2 && (
            <>
              <FieldGroup label="Nombre del animal">
                <input autoFocus value={form.nombre} onChange={e => set('nombre', e.target.value)} placeholder="Ej. Lupita" className={inputCls} />
              </FieldGroup>
              <FieldGroup label="Raza *">
                <select value={form.raza} onChange={e => set('raza', e.target.value)} className={inputCls + ' cursor-pointer'}>
                  <option value="">Seleccionar raza…</option>
                  {RAZAS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </FieldGroup>
              <FieldGroup label="Sexo *">
                <div className="flex gap-2">
                  {([['M', 'Macho'], ['H', 'Hembra']] as const).map(([val, lbl]) => (
                    <button
                      key={val}
                      onClick={() => set('sexo', val)}
                      className={`flex-1 h-11 rounded-[10px] border text-[13px] font-semibold cursor-pointer transition-all ${
                        form.sexo === val
                          ? 'border-[#2FAF8F]/50 bg-[#2FAF8F]/08 dark:bg-[#2FAF8F]/15 text-[#2FAF8F]'
                          : 'border-stone-200/70 dark:border-stone-800/60 bg-stone-50 dark:bg-[#141210] text-stone-500 dark:text-stone-400'
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </FieldGroup>
              <div className="grid grid-cols-2 gap-3">
                <FieldGroup label="Fecha de nacimiento *">
                  <input
                    type="date"
                    value={form.nacimiento}
                    onChange={e => set('nacimiento', e.target.value)}
                    className={inputCls}
                  />
                </FieldGroup>
                <FieldGroup label="Peso aprox. (kg)">
                  <input
                    type="number"
                    value={form.peso}
                    onChange={e => set('peso', e.target.value)}
                    placeholder="Ej. 480"
                    className={inputCls}
                  />
                </FieldGroup>
              </div>
            </>
          )}

          {/* ── PASO 3: Propiedad ── */}
          {paso === 3 && (
            <>
              <FieldGroup label="UPP / Rancho *">
                <input autoFocus value={form.upp} onChange={e => set('upp', e.target.value)} placeholder="Ej. UPP Rancho Morales" className={inputCls} />
              </FieldGroup>
              <FieldGroup label="Propietario *">
                <input value={form.propietario} onChange={e => set('propietario', e.target.value)} placeholder="Nombre completo" className={inputCls} />
              </FieldGroup>
              <FieldGroup label="Lote / Corral">
                <input value={form.lote} onChange={e => set('lote', e.target.value)} placeholder="Ej. A1 o C-03" className={inputCls} />
              </FieldGroup>
            </>
          )}

          {/* ── PASO 4: Resumen ── */}
          {paso === 4 && (
            <div className="flex flex-col gap-0 divide-y divide-stone-100 dark:divide-stone-800/40">
              {RESUMEN.map(({ k, v }) => (
                <div key={k} className="flex justify-between py-2.5">
                  <span className="text-[12px] text-stone-400 dark:text-stone-500">{k}</span>
                  <span className={`text-[12.5px] font-semibold text-right ${v === '—' ? 'text-stone-300 dark:text-stone-600' : 'text-stone-700 dark:text-stone-200'}`}>{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Navegación ── */}
      <div className="flex gap-2">
        {paso > 1 && (
          <button
            onClick={() => setPaso(p => p - 1)}
            className="h-11 px-5 rounded-[10px] border border-stone-200/70 dark:border-stone-800/60 bg-white dark:bg-[#1c1917] text-[13px] text-stone-500 dark:text-stone-400 cursor-pointer hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
          >
            ← Anterior
          </button>
        )}

        {paso < 4 ? (
          <button
            onClick={() => setPaso(p => p + 1)}
            disabled={!canNext && paso < 4}
            className={`flex-1 h-11 rounded-[10px] text-[13px] font-semibold transition-all ${
              canNext || paso === 4
                ? 'bg-[#2FAF8F] hover:bg-[#27a07f] text-white cursor-pointer active:scale-[0.98] border-0'
                : 'bg-stone-100 dark:bg-stone-800/50 text-stone-400 dark:text-stone-500 cursor-default border border-stone-200/70 dark:border-stone-800/60'
            }`}
          >
            {paso === 3 ? 'Revisar resumen →' : 'Siguiente →'}
          </button>
        ) : (
          <button
            onClick={handleGuardar}
            disabled={saved}
            className={`flex-1 h-11 rounded-[10px] text-[13px] font-semibold border-0 cursor-pointer transition-all flex items-center justify-center gap-2 active:scale-[0.98] ${
              saved
                ? 'bg-[#2FAF8F] text-white opacity-80'
                : 'bg-[#2FAF8F] hover:bg-[#27a07f] text-white shadow-[0_2px_14px_rgba(47,175,143,0.28)]'
            }`}
          >
            {saved ? (
              <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>Ficha registrada</>
            ) : (
              <>Registrar ficha ganadera</>
            )}
          </button>
        )}
      </div>

      {/* Nota paso 4 */}
      {paso === 4 && (
        <p className="text-[11px] text-stone-400 dark:text-stone-500 text-center leading-relaxed px-2">
          Después del registro, podrás capturar la huella de morro y adjuntar documentos desde la ficha.
        </p>
      )}
    </div>
  )
}