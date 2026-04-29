import { useLang } from '../hooks/useLang'
import { Card, PageHeader, GaugeRing, Btn } from '../components/UI'

function LineageNode({ name, breed, type = 'default', small = false }) {
  const colors = { kelso: 'border-blue-400 bg-blue-50 text-blue-800', hatch: 'border-green-500 bg-green-50 text-green-800', sweater: 'border-yellow-600 bg-yellow-50 text-yellow-800', highlight: 'border-rust bg-rust/10 text-rust', default: 'border-tan bg-warm text-deep' }
  const c = colors[type] || colors.default
  return (
    <div className={`border-2 rounded-lg text-center ${small ? 'px-2 py-1 text-[9px]' : 'px-2.5 py-1.5 text-[11px]'} font-medium min-w-[76px] ${c}`}>
      {name}{breed && <div className={`opacity-60 ${small ? 'text-[8px]' : 'text-[9px]'}`}>{breed}</div>}
    </div>
  )
}

function Connector() {
  return <div className="w-0.5 h-4 bg-tan mx-auto" />
}

export default function Lineage() {
  const { t, lang } = useLang()

  return (
    <div className="p-4 pb-24">
      <PageHeader title={t('lineageTitle')} sub={t('lineageSub')} />

      <div className="grid grid-cols-2 gap-3 mb-4">
        <Card>
          <div className="text-xs text-earth mb-2">{t('inbreeding')}</div>
          <div className="flex items-center gap-3">
            <GaugeRing value={18} color="#D4922A" />
            <div>
              <div className="text-sm font-semibold text-deep">F = 0.18</div>
              <div className="text-xs text-earth">{t('moderate')} · Wright's</div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="text-xs text-earth mb-2">{t('geneticDiversity')}</div>
          <div className="flex items-center gap-3">
            <GaugeRing value={72} color="#3D6142" />
            <div>
              <div className="text-sm font-semibold text-deep">{t('good')}</div>
              <div className="text-xs text-earth">3 bloodlines</div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-medium text-deep">{lang==='es'?'El Rojo — 4 Generaciones':'El Rojo — 4-Generation Pedigree'}</div>
          <div className="flex gap-1.5">
            <Btn size="sm" variant="secondary">📷 PNG</Btn>
            <Btn size="sm" variant="secondary">📄 PDF</Btn>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[520px] py-2">
            {/* Gen 1 — Subject */}
            <div className="flex justify-center mb-1">
              <LineageNode name="🐓 El Rojo" breed="Kelso · 24m" type="highlight" />
            </div>
            <Connector />

            {/* Gen 2 */}
            <div className="flex justify-center gap-8 mb-1">
              <LineageNode name="Boston King" breed="Old Kelso · 4yr" type="kelso" />
              <LineageNode name="Hatch Queen" breed="Hatch · 3yr" type="hatch" />
            </div>
            <div className="flex justify-center gap-8">
              <Connector /><Connector />
            </div>

            {/* Gen 3 */}
            <div className="flex justify-center gap-3 mb-1">
              <LineageNode name="Blueface Sr." breed="Kelso" type="kelso" small />
              <LineageNode name="Pinto Mare" breed="Kelso" type="kelso" small />
              <LineageNode name="Grey Hatch" breed="Hatch" type="hatch" small />
              <LineageNode name="Sweater X" breed="Sweater" type="sweater" small />
            </div>
            <div className="flex justify-center gap-3">
              <Connector /><Connector /><Connector /><Connector />
            </div>

            {/* Gen 4 */}
            <div className="flex justify-center gap-2">
              {[['G.G. Kelso','Sire'],['Pure Dam','Kelso'],['Boston Jr.','Sire'],['Baker Dam','Line'],['Claret','Hatch'],['Albany X','Cross'],['Morgan','Sweater'],['Brunner','Hatch']].map(([n,b],i)=>(
                <LineageNode key={i} name={n} breed={b} small />
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-3 flex-wrap">
          {[['kelso','Kelso','#1E40AF'],['hatch','Hatch','#166534'],['sweater','Sweater','#92400E']].map(([type,label,color])=>(
            <span key={type} className="inline-flex items-center gap-1.5 bg-warm border border-deep/20 rounded-full px-3 py-1 text-xs font-medium text-deep">
              <span className="w-2 h-2 rounded-full" style={{background:color}} />{label}
            </span>
          ))}
        </div>
      </Card>

      <Card>
        <div className="text-sm font-medium text-deep mb-2">{t('traitNotes')}</div>
        <p className="text-xs text-earth leading-relaxed">
          {lang === 'es'
            ? 'El Rojo hereda la inteligencia y velocidad de la línea Boston Kelso, con la agresividad y estructura del Hatch Queen. El cruce Sweater en la línea materna agrega altura en estación y reflejos rápidos. Coeficiente moderado — candidato viable para cruce con hembra externa Kelso pura.'
            : 'El Rojo inherits Boston Kelso intelligence and speed, with Hatch Queen\'s aggression and bone structure. The Sweater cross on the maternal line adds high station and quick reflexes. Moderate inbreeding coefficient — viable candidate for outcross with a pure external Kelso female.'}
        </p>
      </Card>
    </div>
  )
}
