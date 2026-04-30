import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../hooks/useLang'
import { Btn } from '../components/UI'

export default function Landing() {
  const { t, lang } = useLang()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  function handleStart() {
    localStorage.setItem('saquic_user', 'demo')
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
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="text-6xl mb-4">🐓</div>
        <h1 className="text-4xl font-serif text-deep mb-2">SAQUIC</h1>
        <p className="text-earth text-lg mb-8">{t('appTagline')}</p>

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

        <Btn onClick={handleStart} className="w-full max-w-sm">
          {lang === 'es' ? 'Comenzar' : 'Get Started'}
        </Btn>
      </div>
    </div>
  )
}
