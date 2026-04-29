import { useLang } from '../hooks/useLang'
import { useNavigate } from 'react-router-dom'

export default function TopBar({ title, back }) {
  const { t, toggle, lang } = useLang()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-40 bg-deep safe-top">
      <div className="flex items-center h-14 px-4 gap-3">
        {back ? (
          <button onClick={() => navigate(-1)} className="text-tan text-sm font-medium">← {t('back')}</button>
        ) : (
          <div className="font-serif text-xl font-bold text-tan tracking-widest flex-1">
            SAQ<span className="text-gold">U</span>IC
          </div>
        )}
        {title && back && <div className="flex-1 text-center text-sm font-medium text-tan truncate">{title}</div>}
        <button onClick={toggle}
          className="ml-auto text-xs font-medium text-white/70 border border-white/20 px-3 py-1 rounded-full hover:bg-white/10 transition-colors">
          🌐 {lang === 'en' ? 'Español' : 'English'}
        </button>
        <button onClick={() => navigate('/add-bird')}
          className="w-8 h-8 rounded-full bg-rust text-white text-lg font-bold flex items-center justify-center leading-none hover:bg-gold transition-colors">
          +
        </button>
      </div>
    </header>
  )
}
