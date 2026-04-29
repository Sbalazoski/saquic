import { useRef, useEffect } from 'react'
import { useLang } from '../hooks/useLang'
import { Card, PageHeader, Btn, Tag } from '../components/UI'
import { Chart, CategoryScale, LinearScale, LineElement, PointElement, Filler, Tooltip, Legend } from 'chart.js'

Chart.register(CategoryScale, LinearScale, LineElement, PointElement, Filler, Tooltip, Legend)

const CHICKS = [
  { id: 'C-01', parent_en: 'El Rojo × Reina', parent_es: 'El Rojo × Reina', weeks: 6, weights: [35,52,78,110,158,220], confirmed: false },
  { id: 'C-02', parent_en: 'El Rojo × Reina', parent_es: 'El Rojo × Reina', weeks: 6, weights: [38,55,82,115,162,228], confirmed: false },
  { id: 'C-03', parent_en: 'Titán × Luna', parent_es: 'Titán × Luna', weeks: 9, weights: [42,63,90,132,185,265,310,355,400], confirmed: true, breed: 'Brahma × Ameraucana' },
]

function ChickCard({ chick, lang, t }) {
  const chartRef = useRef(null)
  const chartInst = useRef(null)

  useEffect(() => {
    if (!chartRef.current) return
    chartInst.current?.destroy()
    chartInst.current = new Chart(chartRef.current, {
      type: 'line',
      data: {
        labels: chick.weights.map((_, i) => `W${i+1}`),
        datasets: [{ data: chick.weights, borderColor: '#D4922A', backgroundColor: 'rgba(212,146,42,0.1)', tension: 0.4, pointRadius: 3, fill: true }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { ticks: { font: { size: 9 }, color: '#7A5C3A' } }, x: { ticks: { font: { size: 9 }, color: '#7A5C3A' } } } }
    })
    return () => chartInst.current?.destroy()
  }, [])

  return (
    <Card>
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="text-sm font-semibold text-deep">🐥 {chick.id}</div>
          <div className="text-xs text-earth">{lang==='es'?chick.parent_es:chick.parent_en}</div>
        </div>
        <Tag color={chick.confirmed?'breed':'male'}>{chick.confirmed ? '✓ '+t('breedConfirmed') : `${t('weekNum')} ${chick.weeks}`}</Tag>
      </div>
      {chick.confirmed && (
        <div className="text-xs bg-green-50 text-green-800 border border-green-200 rounded-lg px-2.5 py-1.5 mb-2">{chick.breed}</div>
      )}
      <div className="text-xs text-earth mb-1">{t('weightG')}: <span className="font-medium text-deep">{chick.weights[chick.weights.length-1]}g</span></div>
      <div style={{ height: 80 }}><canvas ref={chartRef} /></div>
      <div className="mt-2">
        {chick.confirmed
          ? <Btn size="sm" className="w-full">{t('graduateAdult')} →</Btn>
          : <Btn size="sm" variant="secondary" className="w-full">{lang==='es'?'Confirmar Raza':'Confirm Breed'}</Btn>
        }
      </div>
    </Card>
  )
}

export default function Chicks() {
  const { t, lang } = useLang()
  const compareRef = useRef(null)
  const compareInst = useRef(null)

  useEffect(() => {
    if (!compareRef.current) return
    compareInst.current?.destroy()
    compareInst.current = new Chart(compareRef.current, {
      type: 'line',
      data: {
        labels: ['W1','W2','W3','W4','W5','W6'],
        datasets: [
          { label: 'C-01', data: [35,52,78,110,158,220], borderColor: '#B5541E', tension: 0.4, pointRadius: 3, fill: false },
          { label: 'C-02', data: [38,55,82,115,162,228], borderColor: '#D4922A', tension: 0.4, pointRadius: 3, fill: false },
          { label: 'C-03', data: [42,63,90,132,185,265], borderColor: '#3D6142', tension: 0.4, pointRadius: 3, fill: false },
        ]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { font: { size: 10 }, color: '#7A5C3A' } } }, scales: { y: { ticks: { font: { size: 10 }, color: '#7A5C3A' }, title: { display: true, text: 'g', font: { size: 10 }, color: '#7A5C3A' } }, x: { ticks: { font: { size: 10 }, color: '#7A5C3A' } } } }
    })
    return () => compareInst.current?.destroy()
  }, [])

  return (
    <div className="p-4 pb-24">
      <PageHeader title={t('chickTitle')} sub={t('chickSub')} />
      <div className="space-y-3 mb-4">
        {CHICKS.map(c => <ChickCard key={c.id} chick={c} lang={lang} t={t} />)}
      </div>
      <Card>
        <div className="text-sm font-medium text-deep mb-3">{lang==='es'?'Curva Comparativa':'Comparative Growth Curve'}</div>
        <div style={{ height: 160 }}><canvas ref={compareRef} /></div>
      </Card>
    </div>
  )
}
