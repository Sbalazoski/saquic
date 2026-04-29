import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Chart, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Filler, Tooltip, Legend } from 'chart.js'
import { useLang } from '../hooks/useLang'
import { getBirds, getEggLogs } from '../lib/db'
import { PageHeader, StatCard, Card, Alert, Btn } from '../components/UI'

Chart.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Filler, Tooltip, Legend)

export default function Dashboard() {
  const { t, lang } = useLang()
  const navigate = useNavigate()
  const [birds, setBirds] = useState([])
  const [logs, setLogs] = useState([])
  const chartRef = useRef(null)
  const chartInst = useRef(null)

  useEffect(() => {
    getBirds().then(setBirds)
    getEggLogs(7).then(setLogs)
  }, [])

  const hens = birds.filter(b => b.sex === 'F')
  const weekDays = lang === 'es'
    ? ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom']
    : ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
  const weekData = [9,11,10,12,9,8,8]
  const todayEggs = weekData[weekData.length - 1]
  const weekTotal = weekData.reduce((a,b)=>a+b,0)

  useEffect(() => {
    if (!chartRef.current) return
    if (chartInst.current) chartInst.current.destroy()
    chartInst.current = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels: weekDays,
        datasets: [{ label: lang === 'es' ? 'Huevos' : 'Eggs', data: weekData,
          backgroundColor: weekData.map(v => v < 9 ? '#B5541E' : '#D4922A'), borderRadius: 5 }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, max: 15, ticks: { font: { size: 10 }, color: '#7A5C3A' } },
          x: { ticks: { font: { size: 10 }, color: '#7A5C3A' } } } }
    })
    return () => chartInst.current?.destroy()
  }, [lang])

  return (
    <div className="p-4 pb-24">
      <PageHeader title={t('dashboard')} sub={lang === 'es' ? 'Bienvenido, Don Marco. Su parvada de un vistazo.' : 'Welcome back, Don Marco. Your flock at a glance.'} />

      <div className="grid grid-cols-2 gap-3 mb-4">
        <StatCard label={t('totalBirds')} value={birds.length || 6} sub={`${birds.filter(b=>b.sex==='M').length||4} ♂ · ${birds.filter(b=>b.sex==='F').length||2} ♀`} />
        <StatCard label={t('layingHens')} value={hens.length || 3} sub="active" />
        <StatCard label={t('eggsToday')} value={todayEggs} sub="↓ from 11" subColor="text-rust" />
        <StatCard label={t('avgWeekly')} value={Math.round(weekTotal/7*10)/10} sub={lang==='es'?'huevos/día':'eggs/day'} />
      </div>

      <Card className="mb-4">
        <div className="text-sm font-medium text-deep mb-3">{lang==='es'?'Huevos — 7 Días':'Eggs — 7 Days'}</div>
        <div style={{ height: 150 }}><canvas ref={chartRef} /></div>
      </Card>

      <Card className="mb-4">
        <div className="text-sm font-medium text-deep mb-3">{t('alerts')}</div>
        <Alert type="warn">{t('alertDrop')}</Alert>
        <Alert type="info">{t('alertBroody')}</Alert>
        <Alert type="danger">{t('alertVacc')}</Alert>
      </Card>

      <Card className="mb-4">
        <div className="text-sm font-medium text-deep mb-3">{t('quickActions')}</div>
        <div className="flex flex-wrap gap-2">
          <Btn size="sm" onClick={() => navigate('/add-bird')}>+ {t('addBird')}</Btn>
          <Btn size="sm" variant="secondary" onClick={() => navigate('/eggs')}>🥚 {t('eggTracker')}</Btn>
          <Btn size="sm" variant="secondary" onClick={() => navigate('/flock')}>🐓 {t('myFlock')}</Btn>
          <Btn size="sm" variant="secondary" onClick={() => navigate('/detect')}>🔍 {t('breedDetect')}</Btn>
        </div>
      </Card>

      <Card>
        <div className="text-sm font-medium text-deep mb-3">{t('recentActivity')}</div>
        {[
          { icon: '🥚', en: 'Reina: 3 eggs logged today', es: 'Reina: 3 huevos registrados hoy', time: '2h ago' },
          { icon: '💊', en: 'Titan: vitamins administered', es: 'Titán: vitaminas administradas', time: '5h ago' },
          { icon: '📸', en: 'Luna: profile photo updated', es: 'Luna: foto de perfil actualizada', time: '1d ago' },
          { icon: '🌡️', en: 'Incubator: 12 eggs set, day 8', es: 'Incubadora: 12 huevos, día 8', time: '2d ago' },
        ].map((a, i) => (
          <div key={i} className="flex items-center gap-2.5 py-2 border-b border-deep/5 last:border-0">
            <span className="text-lg">{a.icon}</span>
            <span className="text-xs flex-1 text-deep">{lang === 'es' ? a.es : a.en}</span>
            <span className="text-[10px] text-tan">{a.time}</span>
          </div>
        ))}
      </Card>
    </div>
  )
}
