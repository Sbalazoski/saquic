import { useState, useEffect, useRef } from 'react'
import { useLang } from '../hooks/useLang'
import { getHatchLogs, addHatchLog, updateHatchLog } from '../lib/db'
import { Card, StatCard, PageHeader, Btn, Input, Alert } from '../components/UI'
import { Chart, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js'

Chart.register(CategoryScale, LinearScale, BarElement, Tooltip)

export default function Hatch() {
  const { t, lang } = useLang()
  const [logs, setLogs] = useState([])
  const [active, setActive] = useState(null)
  const [showNew, setShowNew] = useState(false)
  const chartRef = useRef(null)
  const chartInst = useRef(null)

  useEffect(() => {
    getHatchLogs().then(l => { setLogs(l); if (l.length) setActive(l[0]) })
  }, [])

  useEffect(() => {
    if (!chartRef.current) return
    chartInst.current?.destroy()
    chartInst.current = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels: logs.map(l => lang==='es' ? l.label_es : l.label_en),
        datasets: [{ label: lang==='es'?'Tasa %':'Rate %', data: logs.map(l => l.hatched && l.fertile ? Math.round(l.hatched/l.fertile*100) : null), backgroundColor: '#D4922A', borderRadius: 5 }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { min: 0, max: 100, ticks: { font: { size: 10 }, color: '#7A5C3A' } }, x: { ticks: { font: { size: 9 }, color: '#7A5C3A' } } } }
    })
    return () => chartInst.current?.destroy()
  }, [logs, lang])

  const today = active ? Math.floor((Date.now() - new Date(active.set_date)) / 86400000) : 0
  const daysLeft = Math.max(0, 21 - today)
  const days21 = Array.from({ length: 21 }, (_, i) => i + 1)
  const candleDays = [7, 14, 18]

  return (
    <div className="p-4 pb-24">
      <PageHeader title={t('hatchTitle')} sub={t('hatchSub')} />

      {active && (
        <>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <StatCard label={t('eggsSet')} value={active.eggs_set} />
            <StatCard label={t('fertilityRate')} value={active.fertile ? `${Math.round(active.fertile/active.eggs_set*100)}%` : '—'} sub={`${active.fertile||'?'} of ${active.eggs_set} fertile`} />
            <StatCard label={t('hatchRate')} value={active.hatched ? `${Math.round(active.hatched/active.fertile*100)}%` : '—'} sub={active.hatched ? `${active.hatched} hatched` : t('inProgress')} />
            <StatCard label={t('daysLeft')} value={daysLeft} sub={lang==='es'?'hasta eclosión':'until hatch'} />
          </div>

          <Card className="mb-4">
            <div className="text-sm font-medium text-deep mb-3">{lang==='es'?'Calendario de Incubación':'Incubation Calendar'}</div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {days21.map(d => {
                const isToday = d === today
                const isCandle = candleDays.includes(d)
                const isHatch = d === 21
                const isPast = d < today
                let cls = 'w-9 h-9 rounded-lg flex flex-col items-center justify-center text-xs font-medium border cursor-default '
                if (isToday) cls += 'bg-deep text-tan border-deep'
                else if (isCandle && isPast) cls += 'bg-yellow-100 text-yellow-800 border-yellow-300'
                else if (isHatch) cls += 'bg-gold text-white border-gold'
                else if (isPast) cls += 'bg-warm text-earth border-transparent'
                else cls += 'bg-white text-earth/40 border-deep/10'
                return (
                  <div key={d} className={cls}>
                    <span>{d}</span>
                    {isCandle && <span className="text-[7px] leading-none">👁</span>}
                    {isHatch && <span className="text-[7px] leading-none">🥚</span>}
                  </div>
                )
              })}
            </div>
            <div className="flex gap-3 text-[10px] flex-wrap">
              {[[lang==='es'?'Hoy':'Today','bg-deep'],['Candling','bg-yellow-100 border border-yellow-300'],[lang==='es'?'Eclosión':'Hatch','bg-gold']].map(([label,cls])=>(
                <span key={label} className="flex items-center gap-1"><span className={`w-3 h-3 rounded ${cls} inline-block`}/>{label}</span>
              ))}
            </div>
          </Card>

          {active.candling_d7 && (
            <Card className="mb-4">
              <div className="text-sm font-medium text-deep mb-2">{t('candlingLog')}</div>
              <table className="w-full text-xs border-collapse">
                <thead><tr className="bg-warm">
                  <th className="text-left px-2 py-1.5 text-earth font-medium rounded-l">{t('day')}</th>
                  <th className="text-left px-2 py-1.5 text-earth font-medium">{t('fertile')}</th>
                  <th className="text-left px-2 py-1.5 text-earth font-medium">{t('clear')}</th>
                  <th className="text-left px-2 py-1.5 text-earth font-medium rounded-r">{t('removed')}</th>
                </tr></thead>
                <tbody>
                  {[['d7',7],['d14',14],['d18',18]].map(([key,day]) => active[`candling_${key}`] && (
                    <tr key={day} className="border-b border-deep/5">
                      <td className="px-2 py-1.5 font-medium">{lang==='es'?'Día':'Day'} {day}</td>
                      <td className="px-2 py-1.5 text-green-700">✅ {active[`candling_${key}`].fertile}</td>
                      <td className="px-2 py-1.5 text-red-600">❌ {active[`candling_${key}`].clear}</td>
                      <td className="px-2 py-1.5 text-earth">{active[`candling_${key}`].removed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}
        </>
      )}

      <Card className="mb-4">
        <div className="text-sm font-medium text-deep mb-2">{t('clutchHistory')}</div>
        <div style={{ height: 130 }}><canvas ref={chartRef} /></div>
      </Card>

      <Card>
        <div className="flex justify-between items-center mb-3">
          <div className="text-sm font-medium text-deep">{lang==='es'?'Todas las Puestas':'All Clutches'}</div>
          <Btn size="sm" onClick={() => setShowNew(true)}>+ {t('newHatch')}</Btn>
        </div>
        {logs.map(l => (
          <div key={l.id} onClick={() => setActive(l)}
            className={`flex items-center justify-between p-2.5 rounded-lg mb-2 cursor-pointer transition-colors ${active?.id === l.id ? 'bg-warm border border-tan' : 'bg-cream hover:bg-warm'}`}>
            <div>
              <div className="text-sm font-medium text-deep">{lang==='es'?l.label_es:l.label_en}</div>
              <div className="text-xs text-earth">{l.set_date} · {l.eggs_set} {lang==='es'?'huevos':'eggs'}</div>
            </div>
            <div className="text-sm font-semibold text-rust">
              {l.hatched ? `${Math.round(l.hatched/l.fertile*100)}%` : '—'}
            </div>
          </div>
        ))}
      </Card>
    </div>
  )
}
