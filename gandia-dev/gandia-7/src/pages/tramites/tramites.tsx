import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'

/**
 * /tramites — punto de entrada
 * Lee el rol real desde localStorage o user_profiles en Supabase.
 *   union_ganadera  →  /tramites/panel
 *   todos los demás →  /chat (con contexto tramites)
 */
export default function Tramites() {
  const navigate = useNavigate()

  useEffect(() => {
    let cancelled = false

    async function redirect() {
      try {
        // 1. Obtener la sesión segura (o desde localStorage)
        const rawSession = localStorage.getItem('gandia-auth-token')
        if (!rawSession && !cancelled) {
          navigate('/login', { replace: true })
          return
        }

        const session = JSON.parse(rawSession as string)
        const userId = session.user?.id
        const accessToken = session.access_token

        if ((!userId || !accessToken) && !cancelled) {
          navigate('/login', { replace: true })
          return
        }

        // 2. Obtener el perfil usando fetch directo para evitar el bloqueo del SDK
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
        const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY

        const res = await fetch(`${supabaseUrl}/rest/v1/user_profiles?user_id=eq.${userId}&select=role`, {
          method: 'GET',
          headers: {
            'apikey': supabaseAnon,
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        })

        if (!res.ok) throw new Error('Error al obtener perfil')
        
        const data = await res.json()
        const role = data && data.length > 0 ? data[0].role : null

        if (cancelled) return

        if (role === 'union_ganadera') {
          navigate('/tramites/panel', { replace: true })
        } else {
          navigate('/chat', { replace: true, state: { context: 'tramites' } })
        }
      } catch (err) {
        console.error('[Tramites] Error en redirección:', err)
        if (!cancelled) {
          // Fallback a chat en caso de error
          navigate('/chat', { replace: true, state: { context: 'tramites' } })
        }
      }
    }

    redirect()
    return () => { cancelled = true }
  }, [navigate])

  return null
}