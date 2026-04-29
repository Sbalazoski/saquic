import { useState } from 'react'
import { useLang } from '../hooks/useLang'
import { PageHeader, EggDot } from '../components/UI'

const BREEDS = [
  { name: 'Brahma', nameEs: 'Brahma', origin: 'USA / Asia', weight: '9–12 lb', eggsPerYear: 150, eggColor: 'brown', productivity: 'Low', broodiness: 'Low', climate: 'Cold-hardy', emoji: '🐓', desc: 'Gentle giant with feathered feet and a calm temperament. Great dual-purpose bird.', descEs: 'Gigante gentil con patas emplumadas y temperamento tranquilo. Excelente ave de doble propósito.' },
  { name: 'Rhode Island Red', nameEs: 'Rhode Island Roja', origin: 'USA', weight: '6.5–8.5 lb', eggsPerYear: 260, eggColor: 'brown', productivity: 'High', broodiness: 'Low', climate: 'All climates', emoji: '🐔', desc: 'Hardy dual-purpose bird; excellent layer of large brown eggs with a calm disposition.', descEs: 'Ave resistente de doble propósito; excelente ponedora de huevos cafés grandes, disposición tranquila.' },
  { name: 'Plymouth Rock', nameEs: 'Plymouth Rock', origin: 'USA', weight: '7–9.5 lb', eggsPerYear: 200, eggColor: 'brown', productivity: 'Medium', broodiness: 'Low', climate: 'All climates', emoji: '🐔', desc: 'Classic barred breed; docile, productive, and cold-hardy.', descEs: 'Raza clásica barrada; dócil, productiva y resistente al frío.' },
  { name: 'Silkie', nameEs: 'Silkie', origin: 'China / Asia', weight: '2–3 lb', eggsPerYear: 120, eggColor: 'cream', productivity: 'Low', broodiness: 'Very High', climate: 'Warm', emoji: '🐓', desc: 'Fluffy silky plumage, extremely broody and docile. Great surrogate mother.', descEs: 'Plumaje esponjoso y sedoso, extremadamente clueca y dócil. Excelente madre sustituta.' },
  { name: 'Ameraucana', nameEs: 'Ameraucana', origin: 'USA', weight: '5.5–6.5 lb', eggsPerYear: 200, eggColor: 'blue', productivity: 'Medium', broodiness: 'Low', climate: 'Cold-hardy', emoji: '🐔', desc: 'Famous for stunning blue eggs; muffs, beard, and pea comb.', descEs: 'Famosa por sus hermosos huevos azules; mofletes, barba y cresta de guisante.' },
  { name: 'Leghorn', nameEs: 'Leghorn', origin: 'Italy', weight: '4.5–6 lb', eggsPerYear: 280, eggColor: 'white', productivity: 'Very High', broodiness: 'Very Low', climate: 'Hot climates', emoji: '🐔', desc: 'Top commercial white-egg layer; active, flighty, and very heat-tolerant.', descEs: 'Mejor ponedora comercial de huevos blancos; activa, nerviosa y muy tolerante al calor.' },
  { name: 'Orpington', nameEs: 'Orpington', origin: 'England', weight: '7–10 lb', eggsPerYear: 175, eggColor: 'brown', productivity: 'Medium', broodiness: 'High', climate: 'Cold-hardy', emoji: '🐔', desc: 'Docile, fluffy, and friendly. Good dual-purpose bird that tolerates cold well.', descEs: 'Dócil, esponjosa y amigable. Buena ave de doble propósito que tolera bien el frío.' },
  { name: 'Kelso Gamefowl', nameEs: 'Gallo Kelso', origin: 'USA', weight: '4.5–5.5 lb', eggsPerYear: 80, eggColor: 'white', productivity: 'Low', broodiness: 'Low', climate: 'Hot climates', emoji: '🐓', desc: 'Sharp, intelligent gamefowl known for cutting ability and high station.', descEs: 'Gallo de combate agudo e inteligente, conocido por capacidad de corte y alta estatura.' },
  { name: 'Hatch Gamefowl', nameEs: 'Gallo Hatch', origin: 'USA', weight: '4.5–5.5 lb', eggsPerYear: 80, eggColor: 'white', productivity: 'Low', broodiness: 'Low', climate: 'All climates', emoji: '🐓', desc: 'Powerful, aggressive gamefowl with strong bone structure and deep gameness.', descEs: 'Gallo de combate poderoso y agresivo, con estructura ósea fuerte y bravura profunda.' },
  { name: 'Sweater Gamefowl', nameEs: 'Gallo Sweater', origin: 'USA', weight: '4–5 lb', eggsPerYear: 80, eggColor: 'white', productivity: 'Low', broodiness: 'Low', climate: 'Hot climates', emoji: '🐓', desc: 'Fast, high-stationed gamefowl bred for exceptional speed and gameness.', descEs: 'Gallo de combate rápido y de alta estatura, criado por velocidad excepcional y bravura.' },
]

export default function Breeds() {
  const { t, lang } = useLang()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  const filtered = BREEDS.filter(b => {
    const q = search.toLowerCase()
    return !q || (lang==='es'?b.nameEs:b.name).toLowerCase().includes(q) || b.origin.toLowerCase().includes(q)
  })

  if (selected) return (
    <div className="p-4 pb-24">
      <button onClick={() => setSelected(null)} className="text-sm text-earth mb-4 flex items-center gap-1">← {t('back')}</button>
      <div className="text-5xl mb-3">{selected.emoji}</div>
      <h1 className="font-serif text-2xl font-semibold text-deep">{lang==='es'?selected.nameEs:selected.name}</h1>
      <p className="text-xs text-tan mb-4">{selected.origin}</p>
      <p className="text-sm text-earth leading-relaxed mb-4">{lang==='es'?selected.descEs:selected.desc}</p>
      <div className="bg-white rounded-xl border border-deep/10 divide-y divide-deep/5">
        {[
          [t('eggsPerYear'), selected.eggsPerYear],
          [t('eggColor'), <span key="ec"><EggDot color={selected.eggColor} />{t(selected.eggColor)}</span>],
          [t('productivity'), selected.productivity],
          [t('broodiness'), selected.broodiness],
          [t('climate'), selected.climate],
          [t('weightLb'), selected.weight],
        ].map(([label, val], i) => (
          <div key={i} className="flex justify-between px-4 py-2.5 text-sm">
            <span className="text-earth text-xs">{label}</span>
            <span className="font-medium text-deep">{val}</span>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="p-4 pb-24">
      <PageHeader title={t('breedLibraryTitle')} sub={t('breedLibrarySub')} />
      <input value={search} onChange={e => setSearch(e.target.value)}
        placeholder={lang==='es'?'Buscar raza…':'Search breed…'}
        className="w-full px-3 py-2 text-sm border border-deep/20 rounded-lg bg-white text-deep outline-none focus:border-rust mb-4" />
      <div className="grid grid-cols-2 gap-3">
        {filtered.map(b => (
          <div key={b.name} onClick={() => setSelected(b)}
            className="bg-white rounded-xl border border-deep/10 p-3 cursor-pointer active:scale-95 transition-transform">
            <div className="text-3xl mb-1.5">{b.emoji}</div>
            <div className="font-serif font-semibold text-sm text-deep leading-tight">{lang==='es'?b.nameEs:b.name}</div>
            <div className="text-[10px] text-tan mb-1.5">{b.origin}</div>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-earth">{t('eggsPerYear')}</span>
                <span className="font-medium text-deep">{b.eggsPerYear}</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-earth">{t('eggColor')}</span>
                <span><EggDot color={b.eggColor} />{t(b.eggColor)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
