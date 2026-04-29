export function Card({ children, className = '' }) {
  return <div className={`bg-white rounded-xl border border-deep/10 p-4 ${className}`}>{children}</div>
}

export function StatCard({ label, value, sub, subColor = 'text-tan' }) {
  return (
    <div className="bg-warm rounded-xl border border-deep/10 p-3">
      <div className="text-xs text-earth uppercase tracking-wider mb-1">{label}</div>
      <div className="text-2xl font-serif font-semibold text-deep leading-none">{value}</div>
      {sub && <div className={`text-xs mt-1 ${subColor}`}>{sub}</div>}
    </div>
  )
}

export function Btn({ children, onClick, variant = 'primary', size = 'md', className = '', disabled = false, type = 'button' }) {
  const base = 'inline-flex items-center justify-center font-sans font-medium rounded-lg transition-all cursor-pointer border-0'
  const variants = {
    primary: 'bg-rust text-white hover:bg-deep active:bg-deep',
    secondary: 'bg-warm text-deep border border-deep/20 hover:bg-deep/10',
    ghost: 'bg-transparent text-earth hover:bg-warm',
    danger: 'bg-red-100 text-red-800 hover:bg-red-200',
  }
  const sizes = { sm: 'text-xs px-3 py-1.5', md: 'text-sm px-4 py-2', lg: 'text-base px-5 py-3' }
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      {children}
    </button>
  )
}

export function Alert({ children, type = 'warn' }) {
  const styles = {
    warn: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    success: 'bg-green-50 text-green-800 border-green-200',
    danger: 'bg-red-50 text-red-800 border-red-200',
  }
  return <div className={`text-xs px-3 py-2 rounded-lg border mb-2 leading-relaxed ${styles[type]}`}>{children}</div>
}

export function Tag({ children, color = 'default' }) {
  const colors = {
    default: 'bg-warm text-earth',
    sale: 'bg-yellow-100 text-yellow-800',
    show: 'bg-violet-100 text-violet-800',
    breed: 'bg-green-100 text-green-700',
    male: 'bg-blue-100 text-blue-800',
    female: 'bg-pink-100 text-pink-800',
    gold: 'bg-gold/20 text-deep',
  }
  return <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${colors[color]}`}>{children}</span>
}

export function EggDot({ color }) {
  const bg = { brown: '#B8743A', white: '#E8E0D5', blue: '#7AB8C4', green: '#8DB87A', cream: '#F5EEDD' }
  return <span className="inline-block w-2.5 h-2.5 rounded-full mr-1 align-middle" style={{ background: bg[color] || '#ccc' }} />
}

export function Input({ label, id, badge, ...props }) {
  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={id} className="block text-xs text-earth font-medium mb-1">
          {label}{badge && <span className="ml-1.5 bg-gold text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">{badge}</span>}
        </label>
      )}
      <input id={id} className="w-full px-3 py-2 text-sm border border-deep/20 rounded-lg bg-white text-deep outline-none focus:border-rust transition-colors" {...props} />
    </div>
  )
}

export function Select({ label, id, children, ...props }) {
  return (
    <div className="mb-3">
      {label && <label htmlFor={id} className="block text-xs text-earth font-medium mb-1">{label}</label>}
      <select id={id} className="w-full px-3 py-2 text-sm border border-deep/20 rounded-lg bg-white text-deep outline-none focus:border-rust appearance-none" {...props}>
        {children}
      </select>
    </div>
  )
}

export function Textarea({ label, id, badge, ...props }) {
  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={id} className="block text-xs text-earth font-medium mb-1">
          {label}{badge && <span className="ml-1.5 bg-gold text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">{badge}</span>}
        </label>
      )}
      <textarea id={id} className="w-full px-3 py-2 text-sm border border-deep/20 rounded-lg bg-white text-deep outline-none focus:border-rust transition-colors resize-none" {...props} />
    </div>
  )
}

export function PageHeader({ title, sub }) {
  return (
    <div className="mb-4">
      <h1 className="font-serif text-2xl font-semibold text-deep">{title}</h1>
      {sub && <p className="text-xs text-earth mt-0.5">{sub}</p>}
    </div>
  )
}

export function Spinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-8 h-8 border-2 border-tan border-t-rust rounded-full animate-spin" />
    </div>
  )
}

export function BehaviorTag({ behavior, t }) {
  const styles = {
    calm: 'bg-green-50 text-green-800 border-green-200',
    active: 'bg-blue-50 text-blue-800 border-blue-200',
    vocal: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    broody: 'bg-pink-50 text-pink-800 border-pink-200',
    aggressive: 'bg-red-50 text-red-800 border-red-200',
  }
  return (
    <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full border ${styles[behavior] || 'bg-warm text-earth border-tan'}`}>
      {t(behavior)}
    </span>
  )
}

export function GaugeRing({ value, color = '#D4922A', size = 60 }) {
  const r = 22; const circ = 2 * Math.PI * r
  const offset = circ * (1 - value / 100)
  return (
    <svg width={size} height={size} viewBox="0 0 60 60">
      <circle cx="30" cy="30" r={r} fill="none" stroke="rgba(92,51,23,0.1)" strokeWidth="6" />
      <circle cx="30" cy="30" r={r} fill="none" stroke={color} strokeWidth="6"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" transform="rotate(-90 30 30)" style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
      <text x="30" y="34" textAnchor="middle" fontSize="12" fontWeight="600" fill="#5C3317">{value}%</text>
    </svg>
  )
}
