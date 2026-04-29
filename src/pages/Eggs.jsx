import { useState, useEffect, useRef } from 'react'
import { useLang } from '../hooks/useLang'
import { getBirds, getEggLogs, addEggLog } from '../lib/db'
import { Card, StatCard, PageHeader, Alert, Btn, EggDot } from '../components/UI'
import { Chart, CategoryScale, LinearScale, LineElement, PointElement, Filler, Tooltip, Legend } from 'chart.js'

Chart.register(CategoryScale, LinearScale, LineElement, PointElement, Filler, Tooltip, Legend)

export default function Eggs() {
  const { t, lang } = useLang()
  const [hens, setHens] = useState([])
  const [entries, setEntries] = useState({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const lineRef = useRef(null)
  const curveRef = useRef(null)
  const lineInst = useRef(null)
  const curveInst = useRef(null)

  useEffect(() => {
    getBirds().then(birds => {
      const h = birds.filter(b => b.sex === 'F')
      setHens(h)
      const init = {}
      h.forEach(b => init[b.id] = 0)
      setEntries(init)
    })
  }, [])

  const weekData = [9,11,10,12,9,8,8]
  const weekLabels = lang==='es' ? ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'] : ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

  useEffect(() => {
    if (lineRef.current) {
      lineInst.current?.destroy()
      lineInst.current = new Chart(lineRef.current, {
        type: 'line',
        data: {
          labels: Array.from({ length: 30 }, (_, i) => i + 1),
          datasets: [
            { label: t('actual'), data: [8,9,10,11,10,9,12,11,9,10,11,12,10,9,8,10,11,10,9,8,10,11,12,10,9,8,9,10,9,8], borderColor: '#B5541E', backgroundColor: 'rgba(181,84,30,0.08)', tension: 0.4, fill: true, pointRadius: 2 },
            { label: t('predicted'), data: [9,9.5,10,10.5,10,9.5,11,10.5,10,10,10.5,11,10,9.5,9,10,10.5,10,9.5,9,10,10.5,11,10,9.5,9,9.5,10,9.5,9], borderColor: '#D4922A', borderDash: [4,3], tension: 0.4, pointRadius: 0 }
          ]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { font: { size: 10 }, color: '#7A5C3A' } } }, scales: { y: { min: 5, max: 14, ticks: { font: { size: 10 }, color: '#7A5C3A' } }, x: { ticks: { font: { size: 10 }, color: '#7A5C3A', maxTicksLimit: 8 } } } }
      })
    }
    if (curveRef.current) {
      curveInst.current?.destroy()
      const mk = (peak, spread, max) => Array.from({ length: 36 }, (_, i) => Math.round(Math.max(0, max * Math.exp(-0.5 * Math.pow((i + 6 - peak) / spread, 2))) * 10) / 10)
      curveInst.current = new Chart(curveRef.current, {
        type: 'line',
        data: {
          labels: Array.from({ length: 36 }, (_, i) => i + 6),
          datasets: [
            { label: 'RIR', data: mk(18, 6, 100), borderColor: '#B5541E', tension: 0.4, pointRadius: 0, fill: false },
            { label: 'Ameraucana', data: mk(16, 5, 80), borderColor: '#7AB8C4', tension: 0.4, pointRadius: 0, fill: false },
            { label: 'Leghorn', data: mk(20, 7, 110), borderColor: '#D4922A', tension: 0.4, pointRadius: 0, fill: false },
          ]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { font: { size: 10 }, color: '#7A5C3A' } } }, scales: { y: { ticks: { font: { size: 10 }, color: '#7A5C3A' }, title: { display: true, text: '% prod', font: { size: 10 }, color: '#7A5C3A' } }, x: { ticks: { font: { size: 10 }, color: '#7A5C3A', maxTicksLimit: 8 }, title: { display: true, text: lang==='es'?'Edad (meses)':'Age (months)', font: { size: 10 }, color: '#7A5C3A' } } } }
      })
    }
    return () => { lineInst.current?.destroy(); curveInst.current?.destroy() }
  }, [lang])

  async function saveLog() {
    setSaving(true)
    const today = new Date().toISOString().split('T')[0]
    await Promise.all(Object.entries(entries).map(([bird_id, count]) =>
      count > 0 ? addEggLog({ bird_id, count, log_date: today, egg_size: 'medium', notes_en: '', notes_es: '' }) : Promise.resolve()
    ))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const perHenData = [
    { name: lang==='es'?'Reina':'Reina', today: 3, max: 5, color: '#B5541E', eggColor: 'brown' },
    { name: lang==='es'?'Luna':'Luna', today: 2, max: 4, color: '#7AB8C4', eggColor: 'blue' },
    { name: lang==='es'?'Blanca':'Blanca', today: 3, max: 5, color: '#D4922A', eggColor: 'white' },
  ]

  return (
    <div className="p-4 pb-24">
      <PageHeader title={t('eggTracker')} sub={lang==='es'?'Registros diarios y análisis de producción':'Daily logs, predictions, and analytics'} />

      <div className="grid grid-cols-2 gap-3 mb-4">
        <StatCard label={t('eggsToday')} value="8" sub="↓ -27%" subColor="text-rust" />
        <StatCard label={lang==='es'?'7 Días':'7 Days'} value="67" sub="avg 9.6/day" />
        <StatCard label={lang==='es'?'30 Días':'30 Days'} value="284" sub="avg 9.5/day" />
        <StatCard label={t('efficiency')} value="0.31" sub="kg feed/egg" />
      </div>

      <Alert type="warn">{t('alertDrop')}</Alert>

      {/* Log today */}
      <Card className="mb-4">
        <div className="text-sm font-medium text-deep mb-3">{t('logToday')}</div>
        {saved && <div className="text-xs text-green-700 bg-green-50 px-3 py-2 rounded-lg mb-3">{t('saved')}</div>}
        <div className="space-y-3">
          {perHenData.map(h => (
            <div key={h.name} className="flex items-center gap-3">
              <div className="text-xs font-medium text-deep w-14 shrink-0">{h.name}</div>
              <EggDot color={h.eggColor} />
              <input type="number" min={0} max={8}
                defaultValue={h.today}
                onChange={e => setEntries(ev => ({ ...ev, [h.name]: Number(e.target.value) }))}
                className="w-14 px-2 py-1.5 text-sm border border-deep/20 rounded-lg bg-white text-deep outline-none focus:border-rust text-center" />
              <div className="flex gap-0.5 flex-1">
                {Array.from({ length: h.max }).map((_, i) => (
                  <span key={i} className={`text-base ${i < h.today ? 'opacity-100' : 'opacity-20'}`}>🥚</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-3">
          <Btn size="sm" onClick={saveLog} disabled={saving}>{saving ? t('loading') : t('save')}</Btn>
          <Btn size="sm" variant="secondary">📥 CSV</Btn>
        </div>
      </Card>

      {/* Per-hen bars */}
      <Card className="mb-4">
        <div className="text-sm font-medium text-deep mb-3">{t('perHen')}</div>
        {perHenData.map(h => (
          <div key={h.name} className="mb-3 last:mb-0">
            <div className="flex justify-between text-xs text-deep mb-1">
              <span className="font-medium">{h.name}</span>
              <span className="text-earth">{h.today}/{h.max} {lang==='es'?'huevos':'eggs'}</span>
            </div>
            <div className="h-2 rounded-full bg-warm overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.round(h.today/h.max*100)}%`, background: h.color }} />
            </div>
          </div>
        ))}
      </Card>

      {/* 30-day chart */}
      <Card className="mb-4">
        <div className="text-sm font-medium text-deep mb-3">{t('flockSummary')}</div>
        <div style={{ height: 160 }}><canvas ref={lineRef} /></div>
      </Card>

      {/* Production curve */}
      <Card>
        <div className="text-sm font-medium text-deep mb-3">{t('productionCurve')}</div>
        <div style={{ height: 160 }}><canvas ref={curveRef} /></div>
      </Card>
    </div>
  )
}
