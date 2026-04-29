import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../hooks/useLang'
import { getBirds, DEMO_BIRDS } from '../lib/db'
import { PageHeader, Tag, Btn, Spinner } from '../components/UI'

export default function Flock() {
  const { t, lang } = useLang()
  const navigate = useNavigate()
  const [birds, setBirds] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getBirds().then(b => { setBirds(b); setLoading(false) })
  }, [])

  const filters = [
    { k: 'all', label: t('allBirds') },
    { k: 'M', label: t('roosters') },
    { k: 'F', label: t('hens') },
    { k: 'sale', label: t('filterSale') },
  ]

  const filtered = birds.filter(b => {
    if (filter === 'all') return true
    if (filter === 'sale') return b.available
    return b.sex === filter
  })

  return (
    <div className="p-4 pb-24">
      <PageHeader title={t('myFlock')} sub={t('flock_sub') || (lang==='es'?'Administre todas sus aves':'Manage all your birds')} />

      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {filters.map(f => (
          <button key={f.k} onClick={() => setFilter(f.k)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap transition-colors border ${filter === f.k ? 'bg-rust text-white border-rust' : 'bg-white text-earth border-deep/20'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {loading ? <Spinner /> : filtered.length === 0 ? (
        <div className="text-center py-12 text-earth text-sm">
          <div className="text-4xl mb-3">🐓</div>
          <p>{t('noBirds')}</p>
          <Btn className="mt-4" onClick={() => navigate('/add-bird')}>+ {t('addBird')}</Btn>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filtered.map(b => (
            <div key={b.id} onClick={() => navigate(`/bird/${b.id}`)}
              className="bg-white rounded-xl border border-deep/10 overflow-hidden cursor-pointer active:scale-95 transition-transform">
              <div className="h-28 bg-warm flex items-center justify-center text-5xl">{b.emoji || (b.sex==='M'?'🐓':'🐔')}</div>
              <div className="p-2.5">
                <div className="font-serif font-semibold text-sm text-deep truncate">{lang==='es'?b.name_es:b.name_en}</div>
                <div className="text-xs text-earth mt-0.5 truncate">{b.breed}</div>
                <div className="text-[10px] text-tan mt-0.5">{b.age_months} {t('months')} · {b.weight_kg} kg</div>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  <Tag color={b.sex==='M'?'male':'female'}>{b.sex==='M'?'♂ '+t('rooster'):'♀ '+t('hen')}</Tag>
                  {b.available && <Tag color="sale">🏷 {t('forSale')}</Tag>}
                  {b.tags?.includes('show') && <Tag color="show">🏆</Tag>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
