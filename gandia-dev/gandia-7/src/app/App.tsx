import { useEffect } from 'react'
import { BrowserRouter, useNavigate, useLocation } from 'react-router-dom'
import Router from './Router'
import { checkProfileExists, getCurrentProfile } from '../lib/authService'
import { UserProvider } from '../context/UserContext'
import { NotificationsProvider } from '../context/NotificationsContext'
import { supabase } from '../lib/supabaseClient'

// ── Rutas donde el AuthHandler NO debe actuar ────────────────────────────────

// 1. El Splash maneja su propia sesión — no interferir nunca
// 2. El usuario navega la web pública intencionalmente — dejarlo navegar libre
const IGNORE_ROUTES = [
  '/splash',
  '/home',
  '/blog',
  '/contacto',
  '/recursos',
  '/legal',
  '/compliance',
  '/modelo-operativo',
]

// 3. Ya está en área privada — no redirigir
const PRIVATE_ROUTES = [
  '/chat', '/historial', '/notificaciones', '/configuraciones',
  '/voz', '/ayuda', '/plan', '/tramites', '/noticias', '/perfil',
  '/onboarding', '/tour',
]

const AuthHandler = () => {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔐 Auth event:', event, '@ path:', location.pathname)

      // El Splash y las páginas públicas manejan su propio estado — no tocar
      const ignored = IGNORE_ROUTES.some(r => location.pathname.startsWith(r))
      if (ignored) return

      // Admin y registro tienen su propio flujo
      if (location.pathname.startsWith('/admin')) return
      if (location.pathname.startsWith('/signup')) return

      // Ya está en área privada — no redirigir
      const isPrivate = PRIVATE_ROUTES.some(r => location.pathname.startsWith(r))
      if (isPrivate) return

      // ── Desde /login u otras rutas de entrada ────────────────────────────
      if ((event === 'INITIAL_SESSION' || event === 'SIGNED_IN') && session?.user) {
        const email = session.user.email ?? ''
        const hasProfile = email ? await checkProfileExists(email) : false

        if (hasProfile) {
          try {
            const profile = await getCurrentProfile()
            if (profile?.status === 'approved') {
              const onboardingDone = profile?.onboarding_completed ?? true
              navigate(onboardingDone ? '/chat' : '/onboarding', { replace: true })
            } else {
              const accountId = profile?.account_id || ''
              localStorage.setItem('signup-completed', 'true')
              localStorage.setItem('user-status', profile?.status ?? 'pending')
              if (accountId) localStorage.setItem('account-id', accountId)
              navigate('/signup', { replace: true })
            }
          } catch {
            navigate('/chat', { replace: true })
          }
          return
        }

        // Usuario nuevo sin perfil
        const provider = (session.user.app_metadata?.provider as string | undefined) ?? 'email'
        localStorage.setItem('signup-auth-method', provider)
        if (email) localStorage.setItem('signup-email', email)
        navigate('/signup/personal', { replace: true })
      }

      if (event === 'SIGNED_OUT') {
        ;['signup-auth-method', 'signup-email', 'signup-personal-data',
          'signup-institutional-data', 'signup-completed', 'user-status', 'account-id',
        ].forEach(key => localStorage.removeItem(key))
        navigate('/login', { replace: true })
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate, location.pathname])

  return null
}

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <NotificationsProvider>
          <AuthHandler />
          <Router />
        </NotificationsProvider>
      </UserProvider>
    </BrowserRouter>
  )
}

export default App