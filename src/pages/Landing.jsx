import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useLang } from '../hooks/useLang'
import { Card, Btn, Input, PageHeader, Alert } from '../components/UI'

export default function Landing() {
  const { t, lang } = useLang()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // Check if already logged in
    const savedUser = localStorage.getItem('saquic_user')
    if (savedUser) {
      navigate('/')
      return
    }
    setLoading(false)
  }, [])

  async function handleAuth() {
    if (!email || !password) {
      setError(lang === 'es' ? 'Por favor complete todos los campos' : 'Please fill in all fields')
      return
    }
    setSaving(true)
    setError('')

    try {
      if (isLogin) {
        // Sign in
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email, password
        })
        if (signInError) throw signInError
        localStorage.setItem('saquic_user', JSON.stringify(data.user))
        navigate('/')
      } else {
        // Sign up
        const { data, error: signUpError } = await supabase.auth.signUp({
          email, password
        })
        if (signUpError) throw signUpError
        localStorage.setItem('saquic_user', JSON.stringify(data.user))
        navigate('/')
      }
    } catch (e) {
      setError(e.message || (lang === 'es' ? 'Error de autenticación' : 'Auth error'))
    } finally {
      setSaving(false)
    }
  }

  function handleDemo() {
    // Skip login and go directly to app (demo mode)
    navigate('/')
  }

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center min-h-screen">
        <div className="text-earth">{t('loading')}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="text-6xl mb-4">🐓</div>
        <h1 className="text-4xl font-serif text-deep mb-2">SAQUIC</h1>
        <p className="text-earth text-lg mb-8">{t('appTagline')}</p>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8 w-full max-w-sm">
          <div className="bg-white rounded-lg p-3 text-center shadow-sm">
            <div className="text-2xl font-bold text-rust">6</div>
            <div className="text-xs text-tan">{t('totalBirds')}</div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center shadow-sm">
            <div className="text-2xl font-bold text-rust">3</div>
            <div className="text-xs text-tan">{t('hens')}</div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center shadow-sm">
            <div className="text-2xl font-bold text-rust">250+</div>
            <div className="text-xs text-tan">{lang === 'es' ? 'Huevos/año' : 'Eggs/year'}</div>
          </div>
        </div>

        <Btn onClick={handleDemo} className="w-full max-w-sm">
          {lang === 'es' ? 'Ver Demo' : 'View Demo'}
        </Btn>
      </div>

      {/* Login Section */}
      <div className="p-6 bg-white rounded-t-3xl shadow-lg">
        <div className="text-center mb-4">
          <h2 className="text-lg font-medium text-deep">
            {lang === 'es' ? '¿Tienes una cuenta?' : 'Have an account?'}
          </h2>
          <p className="text-sm text-tan">
            {lang === 'es' 
              ? 'Inicia sesión para sync a la nube' 
              : 'Sign in to sync to the cloud'}
          </p>
        </div>

        {error && <Alert type="danger">{error}</Alert>}

        <div className="space-y-3">
          <Input 
            label={lang === 'es' ? 'Correo' : 'Email'} 
            id="email" 
            type="email"
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            placeholder="you@example.com"
          />
          <Input 
            label={lang === 'es' ? 'Contraseña' : 'Password'} 
            id="password" 
            type="password"
            value={password} 
            onChange={e => setPassword(e.target.value)} 
          />
        </div>

        <div className="flex gap-3 mt-4">
          <Btn onClick={handleAuth} disabled={saving} className="flex-1">
            {saving ? '…' : isLogin 
              ? (lang === 'es' ? 'Iniciar Sesión' : 'Sign In')
              : (lang === 'es' ? 'Registrarse' : 'Sign Up')}
          </Btn>
        </div>

        <button 
          onClick={() => setIsLogin(!isLogin)}
          className="w-full text-center text-sm text-rust mt-4"
        >
          {isLogin 
            ? (lang === 'es' ? '¿No tienes cuenta? Regístrate' : "Don't have an account? Sign up")
            : (lang === 'es' ? '¿Ya tienes cuenta? Inicia sesión' : 'Already have an account? Sign in')}
        </button>
      </div>
    </div>
  )
}