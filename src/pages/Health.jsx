import { useState, useEffect, useRef } from 'react'
import { useLang } from '../hooks/useLang'
import { getHealthLogs, addHealthLog, getBirds } from '../lib/db'
import { Card, PageHeader, Alert, BehaviorTag, Btn, Spinner } from '../components/UI'
import { Chart, CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend } from 'chart.js'

Chart.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend)

export default function Health() {
  const { t, lang } = useLang()
  const [logs, setLogs] = useState([])
  const [birds, setBirds] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ bird_id: '', type: 'vaccination', title_en: '', title_es: '', notes_en: '', notes_es: '', next_due: '' })
  const chartRef = useRef(null)
  const chartInst = useRef(null)

  useEffect(() => {
    Promise.all([getHealthLogs(), getBirds()]).then(([h, b]) => {
      setLogs(h); setBirds(b); setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (!chartRef.current) return
    chartInst.current?.destroy()
    chartInst.current = new Chart(chartRef.current, {
      type: 'line',
      data: {
        labels: ['W1','W2','W3','W4','W5','W6','W7','W8'],
        datasets: [
          { label: 'Reina', data: [2.9,2.88,2.91,2.87,2.72,2.65,2.70,2.71], borderColor: '#B5541E', tension: 0.4, pointRadius: 3, fill: false },
          { label: 'Luna', data: [2.2,2.22,2.2,2.19,2.21,2.20,2.18,2.20], borderColor: '#7AB8C4', tension: 0.4, pointRadius: 3, fill: false },
          { label: 'Blanca', data: [1.8,1.82,1.81,1.80,1.79,1.82,1.80,1.81], borderColor: '#D4922A', tension: 0.4, pointRadius: 3, fill: false },
        ]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { font: { size: 10 }, color: '#7A5C3A' } } }, scales: { y: { ticks: { font: { size: 10 }, color: '#7A5C3A' }, title: { display: true, text: 'kg', font: { size: 10 }, color: '#7A5C3A' } }, x: { ticks: { font: { size: 10 }, color: '#7A5C3A' } } } }
    })
    return () => chartInst.current?.destroy()
  }, [])

  const behaviorMap = {
    'b1': ['aggressive', 'active'],
    'b2': ['calm', 'vocal'],
    'b3': ['broody', 'calm'],
    'b4': ['calm', 'active'],
    'b5': ['active', 'vocal'],
  }

  async function saveLog() {
    if (!form.title_en) return
    const record = await addHealthLog({ ...form, log_date: new Date().toISOString().split('T')[0] })
    setLogs([record, ...logs])
    setShowForm(false)
    setForm({ bird_id: '', type: 'vaccination', title_en: '', title_es: '', notes_en: '', notes_es: '', next_due: '' })
  }

  if (loading) return <Spinner />

  return (
    <div className="p-4 pb-24">
      <PageHeader title={t('healthTitle')} sub={t('healthSub')} />

      <Alert type="danger">{t('alertVacc')}</Alert>
      <Alert type="warn">{t('alertDrop')}</Alert>
      <Alert type="info">{t('alertBroody')}</Alert>

      <Card className="mb-4">
        <div className="text-sm font-medium text-deep mb-3">{t('behavior')}</div>
        {birds.slice(0,4).map(b => {
          const name = lang==='es'?b.name_es:b.name_en
          const behaviors = b.behaviors || behaviorMap[b.id] || []
          return behaviors.length > 0 && (
            <div key={b.id} className="mb-3">
              <div className="text-xs text-earth mb-1.5">{name}</div>
              <div className="flex flex-wrap gap-1.5">
                {behaviors.map(bh => <BehaviorTag key={bh} behavior={bh} t={t} />)}
              </div>
            </div>
          )
        })}
      </Card>

      <Card className="mb-4">
        <div className="flex justify-between items-center mb-3">
          <div className="text-sm font-medium text-deep">{t('vaccination')}</div>
          <Btn size="sm" onClick={() => setShowForm(true)}>+ {t('addNote')}</Btn>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse min-w-[340px]">
            <thead><tr className="bg-warm">
              {[lang==='es'?'Ave':'Bird', lang==='es'?'Tipo':'Type', lang==='es'?'Fecha':'Date', lang==='es'?'Próxima':'Next', lang==='es'?'Estado':'Status'].map(h=>(
                <th key={h} className="text-left px-2 py-1.5 text-earth font-medium first:rounded-l last:rounded-r">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {logs.map(l => {
                const bird = birds.find(b => b.id === l.bird_id)
                const bname = bird ? (lang==='es'?bird.name_es:bird.name_en) : l.bird_id
                const due = l.next_due && new Date(l.next_due) < new Date(Date.now() + 7*86400000)
                return (
                  <tr key={l.id} className="border-b border-deep/5 last:border-0">
                    <td className="px-2 py-2 font-medium">{bname}</td>
                    <td className="px-2 py-2">{lang==='es'?l.title_es||l.title_en:l.title_en}</td>
                    <td className="px-2 py-2 text-earth">{l.log_date}</td>
                    <td className="px-2 py-2 text-earth">{l.next_due||'—'}</td>
                    <td className="px-2 py-2">{due?'⚠ Due':'✅ OK'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="mb-4">
        <div className="text-sm font-medium text-deep mb-3">{t('weightLog')}</div>
        <div style={{ height: 150 }}><canvas ref={chartRef} /></div>
      </Card>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end">
          <div className="bg-white rounded-t-2xl w-full p-4 safe-bottom">
            <div className="text-sm font-medium text-deep mb-3">{t('addNote')}</div>
            <select className="w-full px-3 py-2 text-sm border border-deep/20 rounded-lg mb-3 bg-white" value={form.type} onChange={e => setForm(f=>({...f,type:e.target.value}))}>
              <option value="vaccination">{t('vaccination')}</option>
              <option value="treatment">{t('treatment')}</option>
              <option value="observation">{t('observation')}</option>
            </select>
            <select className="w-full px-3 py-2 text-sm border border-deep/20 rounded-lg mb-3 bg-white" value={form.bird_id} onChange={e => setForm(f=>({...f,bird_id:e.target.value}))}>
              <option value="">{lang==='es'?'Seleccionar ave…':'Select bird…'}</option>
              {birds.map(b => <option key={b.id} value={b.id}>{lang==='es'?b.name_es:b.name_en}</option>)}
            </select>
            <input className="w-full px-3 py-2 text-sm border border-deep/20 rounded-lg mb-3 bg-white" placeholder={lang==='es'?'Título…':'Title…'} value={form.title_en} onChange={e => setForm(f=>({...f,title_en:e.target.value,title_es:e.target.value}))} />
            <input type="date" className="w-full px-3 py-2 text-sm border border-deep/20 rounded-lg mb-3 bg-white" placeholder={lang==='es'?'Próxima dosis…':'Next due…'} value={form.next_due} onChange={e => setForm(f=>({...f,next_due:e.target.value}))} />
            <div className="flex gap-2">
              <Btn onClick={saveLog} className="flex-1">{t('save')}</Btn>
              <Btn variant="secondary" onClick={() => setShowForm(false)}>{t('cancel')}</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
