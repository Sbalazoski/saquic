import { useState } from 'react'
import { useLang } from '../hooks/useLang'
import { Card, PageHeader, Btn, Alert } from '../components/UI'

const SIMULATIONS = [
  { breeds: [{ name: 'Kelso Gamefowl', conf: 0.84 }, { name: 'Hatch Gamefowl', conf: 0.11 }, { name: 'Sweater Gamefowl', conf: 0.05 }], attrs: { en: { comb: 'Single, upright', feather: 'Smooth, tight', leg: 'Yellow', tail: 'High (~60°)' }, es: { comb: 'Simple, erguida', feather: 'Liso, ajustado', leg: 'Amarillo', tail: 'Alto (~60°)' } } },
  { breeds: [{ name: 'Rhode Island Red', conf: 0.72 }, { name: 'Plymouth Rock', conf: 0.18 }, { name: 'Orpington', conf: 0.10 }], attrs: { en: { comb: 'Single, medium', feather: 'Solid mahogany-red', leg: 'Yellow', tail: 'Medium (~40°)' }, es: { comb: 'Simple, mediana', feather: 'Castaño-rojo sólido', leg: 'Amarillo', tail: 'Medio (~40°)' } } },
  { breeds: [{ name: 'Ameraucana', conf: 0.55 }, { name: 'Easter Egger', conf: 0.32 }, { name: 'Araucana', conf: 0.13 }], attrs: { en: { comb: 'Pea comb', feather: 'Varied, muffed & bearded', leg: 'Blue-slate', tail: 'Medium (~45°)' }, es: { comb: 'Cresta de guisante', feather: 'Variado, con mofletes y barba', leg: 'Azul-pizarra', tail: 'Medio (~45°)' } } },
]

export default function Detect() {
  const { t, lang } = useLang()
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  function simulate() {
    setLoading(true)
    setTimeout(() => {
      setResult(SIMULATIONS[Math.floor(Math.random() * SIMULATIONS.length)])
      setLoading(false)
    }, 1200)
  }

  const attrs = result ? result.attrs[lang] : null
  const lowConf = result && result.breeds[0].conf < 0.6

  return (
    <div className="p-4 pb-24">
      <PageHeader title={t('detectTitle')} sub={t('detectSub')} />

      <Card className="mb-4">
        <div className="border-2 border-dashed border-tan rounded-xl p-6 text-center">
          <div className="text-5xl mb-3">📸</div>
          <div className="text-sm font-medium text-deep mb-1">{t('uploadPhoto')}</div>
          <div className="text-xs text-earth mb-4">{t('clickUpload')} · JPG, PNG, WEBP</div>
          <Btn onClick={simulate} disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                {lang==='es'?'Analizando…':'Analyzing…'}
              </span>
            ) : t('simulateDetect')}
          </Btn>
        </div>
      </Card>

      {result && (
        <>
          {lowConf && <Alert type="warn">{t('lowConfidence')}</Alert>}

          <Card className="mb-4">
            <div className="text-sm font-medium text-deep mb-3">{t('topMatches')}</div>
            {result.breeds.map((b, i) => (
              <div key={b.name} className="mb-4 last:mb-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-sm ${i===0?'font-semibold text-deep':'text-earth'}`}>{i+1}. {b.name}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${b.conf >= 0.6 ? 'text-saqgreen' : 'text-rust'}`}>{Math.round(b.conf*100)}%</span>
                    {i === 0
                      ? <Btn size="sm">{t('confirmBreed')}</Btn>
                      : <Btn size="sm" variant="secondary">{t('override')}</Btn>
                    }
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full bg-warm overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${Math.round(b.conf*100)}%`, background: `linear-gradient(90deg, #D4922A, #B5541E)` }} />
                  </div>
                  <span className="text-[10px] text-earth w-8 text-right">{Math.round(b.conf*100)}%</span>
                </div>
              </div>
            ))}
          </Card>

          <Card>
            <div className="text-sm font-medium text-deep mb-3">{t('detectedAttrs')}</div>
            <div className="grid grid-cols-2 gap-2">
              {[[t('combType'), attrs.comb],[t('featherPattern'), attrs.feather],[t('legColor'), attrs.leg],[t('tailAngle'), attrs.tail]].map(([label,val])=>(
                <div key={label} className="bg-warm rounded-lg p-2.5">
                  <div className="text-[10px] text-earth mb-0.5">{label}</div>
                  <div className="text-sm font-medium text-deep">{val}</div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  )
}
