import { useNavigate, useLocation } from 'react-router-dom'
import { useLang } from '../hooks/useLang'

const navItems = [
  { path: '/', icon: '📊', key: 'dashboard' },
  { path: '/flock', icon: '🐓', key: 'myFlock' },
  { path: '/eggs', icon: '🥚', key: 'eggTracker' },
  { path: '/lineage', icon: '🌳', key: 'lineage' },
  { path: '/more', icon: '···', key: 'more' },
]

export default function BottomNav({ onMore }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { t } = useLang()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-deep/10 safe-bottom">
      <div className="flex">
        {navItems.map(item => {
          const active = item.path === '/' ? pathname === '/' : pathname.startsWith(item.path)
          return (
            <button key={item.path}
              onClick={() => item.path === '/more' ? onMore() : navigate(item.path)}
              className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors ${active ? 'text-rust' : 'text-earth'}`}>
              <span className="text-xl leading-none">{item.icon}</span>
              <span className="text-[10px] font-medium">{t(item.key)}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
