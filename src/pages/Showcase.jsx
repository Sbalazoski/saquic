import { useState, useEffect } from 'react'
import { useLang } from '../hooks/useLang'
import { getBirds } from '../lib/db'
import { PageHeader, Btn, Tag } from '../components/UI'

export default function Showcase() {
  const { t, lang } = useLang()
  const [birds, setBirds] = useState([])
  const [copied, setCopied] = useState(false)

  useEffect(() => { getBirds().then(setBirds) }, [])

  const template = lang === 'es'
    ? `Hola Don Marco,\n\nMe interesa conocer más sobre sus aves. He visto su perfil y me gustaría obtener información sobre:\n\n• Precio y disponibilidad\n• Linaje y bloodline\n• Historial de salud\n• Opciones de entrega o recogida\n\nMuchas gracias,\n[Su nombre] — [Teléfono]`
    : `Hello Don Marco,\n\nI'm interested in learning more about your birds. I saw your profile and would like information about:\n\n• Pricing and availability\n• Lineage and bloodline\n• Health history\n• Shipping or pickup options\n\nThank you,\n[Your name] — [Phone number]`

  function copyTemplate() {
    navigator.clipboard?.writeText(template).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }

  return (
    <div className="p-4 pb-24">
      <PageHeader title={t('showcaseTitle')} sub={t('showcaseSub')} />

      {/* Public banner */}
      <div className="bg-deep rounded-2xl p-5 mb-4 overflow-hidden relative">
        <div className="font-serif text-3xl font-bold text-tan tracking-widest mb-0.5">
          SAQ<span className="text-gold">U</span>IC
        </div>
        <div className="text-xs text-white/50 mb-4">
          {lang==='es'?'Criador de Gallos y Gallinas Finas · Don Marco · Cassville, MO':'Fine Rooster & Hen Breeder · Don Marco · Cassville, MO'}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {birds.slice(0,6).map(b => (
            <div key={b.id} className="bg-white/10 border border-white/10 rounded-xl p-2 text-center">
              <div className="text-3xl mb-1">{b.emoji || (b.sex==='M'?'🐓':'🐔')}</div>
              <div className="font-serif text-xs text-white leading-tight">{lang==='es'?b.name_es:b.name_en}</div>
              <div className="text-[9px] text-white/40 mb-1">{b.breed}</div>
              {b.available
                ? <span className="text-[9px] bg-gold text-white px-2 py-0.5 rounded-full font-semibold">{t('available')}</span>
                : <span className="text-[9px] text-white/30">{t('notForSale')}</span>
              }
            </div>
          ))}
        </div>
      </div>

      {/* CTA buttons */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Btn className="py-3 text-sm" onClick={() => window.open('mailto:donmarco@example.com?subject=Bird Inquiry — SAQUIC')}>
          📧 {t('contactBreeder')}
        </Btn>
        <Btn variant="secondary" className="py-3 text-sm" onClick={() => window.open('https://wa.me/15551234567?text=Hello+Don+Marco,+I+saw+your+SAQUIC+listing…')}>
          💬 {t('whatsappInquiry')}
        </Btn>
      </div>

      {/* Available birds */}
      <div className="bg-white rounded-xl border border-deep/10 p-4 mb-4">
        <div className="text-sm font-medium text-deep mb-3">{lang==='es'?'Aves Disponibles':'Available Birds'}</div>
        {birds.filter(b=>b.available).length === 0
          ? <div className="text-xs text-earth text-center py-4">{lang==='es'?'No hay aves disponibles en este momento.':'No birds currently available.'}</div>
          : birds.filter(b=>b.available).map(b=>(
            <div key={b.id} className="flex items-center gap-3 py-2.5 border-b border-deep/5 last:border-0">
              <div className="text-3xl">{b.emoji || '🐔'}</div>
              <div className="flex-1">
                <div className="text-sm font-medium text-deep">{lang==='es'?b.name_es:b.name_en}</div>
                <div className="text-xs text-earth">{b.breed} · {b.age_months} {t('months')}</div>
              </div>
              <Tag color="sale">{t('forSale')}</Tag>
            </div>
          ))
        }
      </div>

      {/* Inquiry template */}
      <div className="bg-white rounded-xl border border-deep/10 p-4">
        <div className="text-sm font-medium text-deep mb-2">{t('inquiryTemplate')}</div>
        <div className="bg-warm rounded-lg p-3 border-l-4 border-rust text-xs text-deep leading-relaxed whitespace-pre-wrap mb-3">{template}</div>
        <Btn size="sm" variant="secondary" onClick={copyTemplate}>
          {copied ? '✓ Copied!' : `📋 ${t('copyTemplate')}`}
        </Btn>
      </div>
    </div>
  )
}
