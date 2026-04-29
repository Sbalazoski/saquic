import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../hooks/useLang'
import { addBird } from '../lib/db'
import { Card, Btn, Input, Select, Textarea, Alert, PageHeader } from '../components/UI'

const BREEDS = ['Brahma','Rhode Island Red','Plymouth Rock','Silkie','Ameraucana','Leghorn','Orpington','Kelso Gamefowl','Hatch Gamefowl','Sweater Gamefowl']
const TAGS = ['breeder','show','for-sale','not-for-sale']

async function autoTranslate(text, toLang) {
  if (!text.trim()) return ''
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 200,
        messages: [{
          role: 'user',
          content: `Translate this poultry farming text to ${toLang === 'es' ? 'Spanish' : 'English'}. Return ONLY the translation, no explanation:\n"${text}"`
        }]
      })
    })
    const data = await res.json()
    return data.content?.[0]?.text?.trim() || ''
  } catch { return '' }
}

export default function AddBird() {
  const { t, lang } = useLang()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    bird_number: '', name_en: '', name_es: '', breed: BREEDS[0], sex: 'M',
    age_months: '', weight_kg: '', bloodline: '', temperament: '',
    egg_color: '', hatch_date: '', tags: [], available: false,
    behaviors: [], notes_en: '', notes_es: '', photo_url: ''
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const translateTimer = useRef(null)

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  function handleTranslate(srcKey, destKey, toLang) {
    return (e) => {
      const val = e.target.value
      set(srcKey, val)
      clearTimeout(translateTimer.current)
      if (!val.trim()) { set(destKey, ''); return }
      set(destKey, '…')
      translateTimer.current = setTimeout(async () => {
        const translated = await autoTranslate(val, toLang)
        set(destKey, translated)
      }, 700)
    }
  }

  function toggleTag(tag) {
    set('tags', form.tags.includes(tag) ? form.tags.filter(t => t !== tag) : [...form.tags, tag])
  }
  function toggleBehavior(b) {
    set('behaviors', form.behaviors.includes(b) ? form.behaviors.filter(x => x !== b) : [...form.behaviors, b])
  }

  function handlePhotoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    // Create a local URL for preview - this works for localStorage demo mode
    // For Supabase, we'll upload to Supabase Storage
    const reader = new FileReader()
    reader.onload = (ev) => {
      set('photo_url', ev.target.result)
    }
    reader.readAsDataURL(file)
  }

  async function handleSave() {
    if (!form.name_en && !form.name_es) return
    setSaving(true)
    try {
      await addBird({
        ...form,
        age_months: Number(form.age_months) || 0,
        weight_kg: Number(form.weight_kg) || 0,
        emoji: form.sex === 'F' ? '🐔' : '🐓',
      })
      setSaved(true)
      setTimeout(() => navigate('/flock'), 1200)
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-4 pb-24">
      <PageHeader title={t('addBirdTitle')} sub={t('addBirdSub')} />

      {saved && <Alert type="success">{t('addedSuccessfully')}</Alert>}

      {/* Photo upload */}
      <Card className="mb-4">
        <label className="block cursor-pointer">
          {form.photo_url ? (
            <div className="relative">
              <img src={form.photo_url} alt="Bird" className="w-full h-36 object-cover rounded-lg" />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg opacity-0 hover:opacity-100 transition-opacity">
                <span className="text-white text-sm">{t('changePhoto') || 'Change Photo'}</span>
              </div>
            </div>
          ) : (
            <div className="w-full h-36 bg-warm rounded-xl border-2 border-dashed border-tan flex flex-col items-center justify-center">
              <div className="text-4xl mb-1">📸</div>
              <div className="text-xs text-earth">{t('uploadPhoto')}</div>
            </div>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
        </label>
      </Card>

      <Card className="mb-4">
        <div className="font-medium text-sm text-deep mb-3">{lang==='es'?'Número de Ave':'Bird Number'}</div>
        <Input label={t('birdNumber') || 'Number'} id="bird_number" type="number" value={form.bird_number}
          onChange={e => set('bird_number', e.target.value)} placeholder="Auto if empty" />
      </Card>

      <Card className="mb-4">
        <div className="font-medium text-sm text-deep mb-3">{lang==='es'?'Nombres (bilingüe)':'Names (bilingual)'}</div>
        <div className="grid grid-cols-2 gap-3">
          <Input label={`${t('name')} (EN)`} id="name_en" value={form.name_en}
            onChange={handleTranslate('name_en', 'name_es', 'es')} placeholder="e.g. El Rojo" />
          <Input label={`${t('name')} (ES)`} id="name_es" badge={t('autoTranslate')} value={form.name_es}
            onChange={handleTranslate('name_es', 'name_en', 'en')} placeholder="ej. El Rojo" />
        </div>
      </Card>

      <Card className="mb-4">
        <div className="font-medium text-sm text-deep mb-3">{lang==='es'?'Detalles':'Details'}</div>
        <div className="grid grid-cols-2 gap-3">
          <Select label={t('breed')} id="breed" value={form.breed} onChange={e => set('breed', e.target.value)}>
            {BREEDS.map(b => <option key={b}>{b}</option>)}
          </Select>
          <Select label={t('sex')} id="sex" value={form.sex} onChange={e => set('sex', e.target.value)}>
            <option value="M">♂ {t('rooster')}</option>
            <option value="F">♀ {t('hen')}</option>
            <option value="C">🐥 {t('chick')}</option>
          </Select>
          <Input label={`${t('age')} (${t('months')})`} id="age" type="number" value={form.age_months}
            onChange={e => set('age_months', e.target.value)} placeholder="18" />
          <Input label={`${t('weight')} (kg)`} id="weight" type="number" step="0.1" value={form.weight_kg}
            onChange={e => set('weight_kg', e.target.value)} placeholder="2.5" />
        </div>
        <Input label={t('bloodline')} id="bloodline" value={form.bloodline}
          onChange={e => set('bloodline', e.target.value)} placeholder="e.g. Old Boston Kelso" />
        <Input label={t('hatchDate')} id="hatch_date" type="date" value={form.hatch_date}
          onChange={e => set('hatch_date', e.target.value)} />
        {form.sex === 'F' && (
          <Select label={t('eggColor')} id="egg_color" value={form.egg_color} onChange={e => set('egg_color', e.target.value)}>
            <option value="">—</option>
            <option value="brown">{t('brown')}</option>
            <option value="white">{t('white')}</option>
            <option value="blue">{t('blue')}</option>
            <option value="green">{t('green')}</option>
            <option value="cream">{t('cream')}</option>
          </Select>
        )}
      </Card>

      <Card className="mb-4">
        <div className="font-medium text-sm text-deep mb-3">{t('behavior')}</div>
        <div className="flex flex-wrap gap-2">
          {['calm','active','vocal','broody','aggressive'].map(b => (
            <button key={b} onClick={() => toggleBehavior(b)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${form.behaviors.includes(b)?'bg-rust text-white border-rust':'bg-white text-earth border-deep/20'}`}>
              {t(b)}
            </button>
          ))}
        </div>
      </Card>

      <Card className="mb-4">
        <div className="font-medium text-sm text-deep mb-3">{t('tags')}</div>
        <div className="flex flex-wrap gap-2 mb-3">
          {TAGS.map(tag => (
            <button key={tag} onClick={() => toggleTag(tag)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${form.tags.includes(tag)?'bg-deep text-tan border-deep':'bg-white text-earth border-deep/20'}`}>
              {tag}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm text-deep cursor-pointer">
          <input type="checkbox" checked={form.available} onChange={e => set('available', e.target.checked)}
            className="accent-rust w-4 h-4" />
          {t('available')} / {t('forSale')}
        </label>
      </Card>

      <Card className="mb-4">
        <div className="font-medium text-sm text-deep mb-3">{t('notes')}</div>
        <Textarea label={`${t('notes')} (EN)`} id="notes_en" rows={2} value={form.notes_en}
          onChange={handleTranslate('notes_en', 'notes_es', 'es')} placeholder="Health notes, temperament…" />
        <Textarea label={`${t('notes')} (ES)`} id="notes_es" badge={t('autoTranslate')} rows={2} value={form.notes_es}
          onChange={handleTranslate('notes_es', 'notes_en', 'en')} placeholder="Notas de salud, temperamento…" />
      </Card>

      <div className="flex gap-3">
        <Btn onClick={handleSave} disabled={saving} className="flex-1">
          {saving ? t('loading') : t('save')}
        </Btn>
        <Btn variant="secondary" onClick={() => navigate('/flock')}>{t('cancel')}</Btn>
      </div>
    </div>
  )
}
