/**
 * ConfigCamarasWidget — Widget: config:camaras
 */
import type { Camara } from './CamaraListaWidget'

interface Props {
  camaras:       Camara[]
  onConfigurar?: (cam: Camara) => void
  onAgregar?:    () => void
}

export default function ConfigCamarasWidget({ camaras, onConfigurar, onAgregar }: Props) {
  const online  = camaras.filter(c => c.estado === 'online').length
  const offline = camaras.length - online

  return (
    <div className="bg-white dark:bg-[#1c1917] border border-stone-200/70 dark:border-stone-800/60 rounded-[18px] overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-stone-100 dark:border-stone-800/40 flex items-center justify-between shrink-0">
        <div>
          <p className="text-[13px] font-semibold text-stone-700 dark:text-stone-200">Cámaras registradas</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[11px] text-[#2FAF8F] font-semibold">● {online} online</span>
            {offline > 0 && <span className="text-[11px] text-red-400 font-semibold">● {offline} offline</span>}
          </div>
        </div>
        <button onClick={onAgregar} className="flex items-center gap-1 px-3.5 py-1.5 rounded-[9px] bg-[#2FAF8F] hover:bg-[#27a07f] text-white text-[11px] font-semibold border-0 cursor-pointer transition-colors">
          <span className="text-base leading-none">+</span> Agregar cámara
        </button>
      </div>

      {/* Lista */}
      <div className="flex-1 overflow-y-auto">
        {camaras.map((cam, i) => {
          const match = cam.inventario > 0 ? Math.round(cam.detectados / cam.inventario * 100) : 0
          return (
            <div key={cam.id} className={`px-5 py-3.5 flex items-center gap-3.5 ${i < camaras.length - 1 ? 'border-b border-stone-100 dark:border-stone-800/40' : ''} ${cam.estado === 'offline' ? 'opacity-60' : ''} transition-opacity`}>
              <div className={`w-[38px] h-[38px] rounded-[10px] shrink-0 flex items-center justify-center ${cam.estado === 'online' ? 'bg-[#2FAF8F]/10 dark:bg-[#2FAF8F]/20 border border-[#2FAF8F]/30' : 'bg-stone-50 dark:bg-[#141210] border border-stone-200/70 dark:border-stone-800/60'}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={cam.estado === 'online' ? '#2FAF8F' : 'currentColor'} strokeWidth="1.75" strokeLinecap="round" className={cam.estado !== 'online' ? 'text-stone-400 dark:text-stone-500' : ''}>
                  <path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/>
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-[12px] font-bold text-stone-700 dark:text-stone-200 mb-0.5">{cam.label}</p>
                <div className="flex items-center gap-2">
                  <p className="text-[11px] text-stone-400 dark:text-stone-500">Corral {cam.corral}</p>
                  {cam.estado === 'online' && (
                    <>
                      <span className="text-stone-300 dark:text-stone-600 text-[10px]">·</span>
                      <p className="text-[11px] text-stone-400 dark:text-stone-500">{cam.fps} fps</p>
                      <span className="text-stone-300 dark:text-stone-600 text-[10px]">·</span>
                      <p className={`text-[11px] font-semibold ${match === 100 ? 'text-[#2FAF8F]' : 'text-amber-500'}`}>{match}% match</p>
                    </>
                  )}
                  {cam.estado === 'offline' && <p className="text-[11px] text-red-400 font-semibold">Sin señal</p>}
                </div>
              </div>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-[0.04em] shrink-0 ${cam.estado === 'online' ? 'bg-[#2FAF8F]/10 text-[#2FAF8F] border-[#2FAF8F]/30' : 'bg-red-50 dark:bg-red-950/30 text-red-500 border-red-200 dark:border-red-800/40'}`}>
                {cam.estado}
              </span>
              <button onClick={() => onConfigurar?.(cam)} className="px-3.5 py-1.5 rounded-[8px] border border-stone-200/70 dark:border-stone-800/60 bg-white dark:bg-[#1c1917] text-[11px] text-stone-500 dark:text-stone-400 cursor-pointer shrink-0 hover:border-[#2FAF8F]/40 hover:text-[#2FAF8F] transition-all">
                Configurar
              </button>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="px-5 py-2.5 border-t border-stone-100 dark:border-stone-800/40 flex justify-between items-center shrink-0">
        <span className="text-[10.5px] text-stone-300 dark:text-stone-600">{camaras.length} cámara{camaras.length !== 1 ? 's' : ''} · AI Perception v7.4</span>
        <span className="text-[10px] text-stone-400 dark:text-stone-500">{online}/{camaras.length} con cobertura activa</span>
      </div>
    </div>
  )
}