import { useNavigate } from 'react-router-dom'
import { useLang } from '../hooks/useLang'

const items = [
  { path: '/hatch', icon: '🌡️', key: 'hatchLog' },
  { path: '/chicks', icon: '🐥', key: 'chickGrowth' },
  { path: '/breeds', icon: '📖', key: 'breedLibrary' },
  { path: '/detect', icon: '🔍', key: 'breedDetect' },
  { path: '/health', icon: '💊', key: 'healthLog' },
  { path: '/showcase', icon: '🏆', key: 'publicPage' },
]

export default function MoreDrawer({ open, onClose }) {
  const navigate = useNavigate()
  const { t } = useLang()

  if (!open) return null
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 p-4 safe-bottom">
        <div className="w-10 h-1 bg-tan rounded-full mx-auto mb-4" />
        <div className="grid grid-cols-3 gap-3">
          {items.map(item => (
            <button key={item.path}
              onClick={() => { navigate(item.path); onClose() }}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-warm hover:bg-tan/20 transition-colors">
              <span className="text-2xl">{item.icon}</span>
              <span className="text-xs font-medium text-deep text-center leading-tight">{t(item.key)}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
