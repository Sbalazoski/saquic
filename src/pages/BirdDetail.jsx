import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useLang } from '../hooks/useLang'
import { getBirds, updateBird } from '../lib/db'
import { Card, Tag, Btn, BehaviorTag, EggDot, Spinner } from '../components/UI'

export default function BirdDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t, lang } = useLang()
  const [bird, setBird] = useState(null)
  const [photoMode, setPhotoMode] = useState('normal')

  useEffect(() => {
    getBirds().then(birds => setBird(birds.find(b => b.id === id)))
  }, [id])

  if (!bird) return <Spinner />

  const name = lang === 'es' ? bird.name_es : bird.name_en
  const notes = lang === 'es' ? bird.notes_es : bird.notes_en
  const emoji = bird.emoji || (bird.sex === 'M' ? '🐓' : '🐔')

  const filterStyles = {
    normal: '',
    enhanced: 'brightness-110 saturate-150 contrast-105',
    bg_blur: 'drop-shadow-2xl',
    show: 'brightness-105 saturate-120 hue-rotate-5',
  }

  const rows = [
    [t('breed'), bird.breed],
    [t('bloodline'), bird.bloodline],
    [t('age'), `${bird.age_months} ${t('months')}`],
    [t('weight'), `${bird.weight_kg} kg`],
    [t('sex'), bird.sex === 'M' ? t('rooster') : t('hen')],
    [t('temperament'), bird.temperament],
    bird.egg_color ? [t('eggColor'), <span key="ec"><EggDot color={bird.egg_color} />{t(bird.egg_color)}</span>] : null,
    bird.hatch_date ? [t('hatchDate'), bird.hatch_date] : null,
  ].filter(Boolean)

  return (
    <div className="p-4 pb-24">
      {/* Photo */}
      <div className={`w-full h-52 bg-warm rounded-2xl flex items-center justify-center text-8xl mb-4 overflow-hidden transition-all duration-300 ${filterStyles[photoMode]}`}>
        {emoji}
      </div>

      {/* Photo filters */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {[['normal', t('normal')], ['enhanced', t('enhanced') || 'Enhanced'], ['bg_blur', t('bg_blur') || 'BG Blur'], ['show', t('show_mode') || 'Show']].map(([k, label]) => (
          <button key={k} onClick={() => setPhotoMode(k)}
            className={`text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap border transition-colors ${photoMode===k?'bg-deep text-tan border-deep':'bg-white text-earth border-deep/20'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Name + tags */}
      <div className="mb-4">
        <h1 className="font-serif text-2xl font-semibold text-deep">{name}</h1>
        <p className="text-sm text-earth mt-0.5">{bird.breed} · {bird.bloodline}</p>
        <div className="flex flex-wrap gap-1.5 mt-2">
          <Tag color={bird.sex==='M'?'male':'female'}>{bird.sex==='M'?'♂ '+t('rooster'):'♀ '+t('hen')}</Tag>
          {bird.available && <Tag color="sale">🏷 {t('forSale')}</Tag>}
          {bird.tags?.includes('show') && <Tag color="show">🏆 Show</Tag>}
          {bird.tags?.includes('breeder') && <Tag color="breed">Breeder</Tag>}
        </div>
      </div>

      {/* Details */}
      <Card className="mb-4">
        {rows.map(([label, val], i) => (
          <div key={i} className="flex justify-between items-center py-2 border-b border-deep/5 last:border-0 text-sm">
            <span className="text-earth text-xs">{label}</span>
            <span className="font-medium text-deep text-right">{val}</span>
          </div>
        ))}
      </Card>

      {/* Behaviors */}
      {bird.behaviors?.length > 0 && (
        <Card className="mb-4">
          <div className="text-xs font-medium text-earth mb-2">{t('behavior')}</div>
          <div className="flex flex-wrap gap-1.5">
            {bird.behaviors.map(b => <BehaviorTag key={b} behavior={b} t={t} />)}
          </div>
        </Card>
      )}

      {/* Notes */}
      {notes && (
        <Card className="mb-4">
          <div className="text-xs font-medium text-earth mb-1">{t('notes')}</div>
          <p className="text-sm text-deep leading-relaxed">{notes}</p>
        </Card>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Btn size="sm" onClick={() => navigate('/lineage')}>🌳 {t('lineage')}</Btn>
        <Btn size="sm" variant="secondary" onClick={() => navigate('/eggs')}>🥚 {t('eggTracker')}</Btn>
        <Btn size="sm" variant="secondary" onClick={() => navigate('/health')}>💊 {t('healthLog')}</Btn>
        <Btn size="sm" variant="secondary" onClick={() => navigate(`/add-bird?edit=${bird.id}`)}>✏️ {t('edit')}</Btn>
      </div>
    </div>
  )
}
