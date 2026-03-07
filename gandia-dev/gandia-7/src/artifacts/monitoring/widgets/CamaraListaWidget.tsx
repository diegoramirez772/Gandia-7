/**
 * CamaraListaWidget — Widget: camara:lista
 */

export interface Camara {
  id:         number
  label:      string
  corral:     string
  estado:     'online' | 'offline'
  detectados: number
  inventario: number
  fps:        number
}

interface Props {
  camaras:         Camara[]
  selectedId?:     number
  onSelectCamara?: (cam: Camara) => void
  onAgregar?:      () => void
}

export default function CamaraListaWidget({ camaras, selectedId, onSelectCamara, onAgregar }: Props) {
  const online  = camaras.filter(c => c.estado === 'online').length
  const offline = camaras.length - online

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-[12px] font-bold text-stone-700 dark:text-stone-200">Cámaras</p>
          <p className="text-[10.5px] text-stone-400 dark:text-stone-500 mt-0.5">
            <span className="text-[#2FAF8F] font-semibold">{online} online</span>
            {offline > 0 && <span className="text-red-400"> · {offline} offline</span>}
          </p>
        </div>
        {onAgregar && (
          <button onClick={onAgregar} className="w-7 h-7 flex items-center justify-center rounded-[8px] bg-[#2FAF8F] hover:bg-[#27a07f] text-white text-base font-light border-0 cursor-pointer transition-colors">+</button>
        )}
      </div>

      {/* Lista */}
      <div className="flex-1 flex flex-col gap-1.5 overflow-y-auto">
        {camaras.map(cam => {
          const isSelected = cam.id === selectedId
          const match      = cam.inventario > 0 ? Math.round(cam.detectados / cam.inventario * 100) : 0
          const isOnline   = cam.estado === 'online'
          return (
            <div
              key={cam.id}
              onClick={() => isOnline && onSelectCamara?.(cam)}
              className={`rounded-[12px] px-3 py-2.5 border transition-all
                ${isSelected ? 'bg-[#2FAF8F]/08 dark:bg-[#2FAF8F]/15 border-[#2FAF8F]/40' : 'bg-white dark:bg-[#1c1917] border-stone-200/70 dark:border-stone-800/60'}
                ${isOnline ? 'cursor-pointer hover:bg-stone-50 dark:hover:bg-[#141210]' : 'opacity-50 cursor-default'}
                ${isSelected && isOnline ? 'hover:bg-[#2FAF8F]/08 dark:hover:bg-[#2FAF8F]/15' : ''}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[12px] font-bold text-stone-700 dark:text-stone-200">{cam.label}</span>
                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-[5px] uppercase tracking-[0.04em] ${isOnline ? 'bg-[#2FAF8F]/10 text-[#2FAF8F]' : 'bg-red-50 dark:bg-red-950/30 text-red-500'}`}>
                  {cam.estado}
                </span>
              </div>
              <p className="text-[10.5px] text-stone-400 dark:text-stone-500">Corral {cam.corral}</p>
              {isOnline && (
                <p className="text-[10.5px] text-[#2FAF8F] mt-0.5">{cam.detectados} det. · {match}% · {cam.fps}fps</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}