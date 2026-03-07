import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

function PublicLayout() {
  useEffect(() => {
    const id = 'gandia-scrollbar'
    if (document.getElementById(id)) return
    const el = document.createElement('style')
    el.id = id
    el.textContent = `
      html { scrollbar-width: thin; scrollbar-color: #2a2523 #0c0a09; }
      html::-webkit-scrollbar { width: 5px; }
      html::-webkit-scrollbar-track { background: #0c0a09; }
      html::-webkit-scrollbar-thumb {
        background: #3c3836;
        border-radius: 999px;
      }
      html::-webkit-scrollbar-thumb:hover { background: #52504e; }

      @media (prefers-color-scheme: light) {
        html { scrollbar-color: #d6d3d1 #f5f4f3; }
        html::-webkit-scrollbar-track { background: #f5f4f3; }
        html::-webkit-scrollbar-thumb { background: #d6d3d1; }
        html::-webkit-scrollbar-thumb:hover { background: #a8a29e; }
      }
    `
    document.head.appendChild(el)
  }, [])

  return (
    <div className="min-h-screen" style={{ background: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#0c0a09' : '#F5F4F3' }}>
      <Outlet />
    </div>
  )
}

export default PublicLayout