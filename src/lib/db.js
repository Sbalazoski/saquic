import { supabase } from './supabase'

// ── localStorage fallback helpers ──────────────────────────────────────────
function lsGet(key, def) {
  try { return JSON.parse(localStorage.getItem('saquic_' + key)) ?? def } catch { return def }
}
function lsSet(key, val) {
  localStorage.setItem('saquic_' + key, JSON.stringify(val))
}
function lsId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6) }

// Generate the next bird number
function getNextBirdNumber(birds) {
  const numbers = birds.filter(b => b.bird_number).map(b => b.bird_number)
  if (numbers.length === 0) return 1
  return Math.max(...numbers) + 1
}

// ── BIRDS ──────────────────────────────────────────────────────────────────
export async function getBirds() {
  if (supabase) {
    const { data, error } = await supabase.from('birds').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return data
  }
  return lsGet('birds', DEMO_BIRDS)
}

export async function addBird(bird) {
  const birds = lsGet('birds', DEMO_BIRDS)
  const birdNumber = bird.bird_number || getNextBirdNumber(birds)
  const record = { ...bird, id: lsId(), bird_number: birdNumber, created_at: new Date().toISOString() }
  if (supabase) {
    const { data, error } = await supabase.from('birds').insert([record]).select().single()
    if (error) throw error
    return data
  }
  lsSet('birds', [record, ...birds])
  return record
}

export async function updateBird(id, updates) {
  if (supabase) {
    const { data, error } = await supabase.from('birds').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  }
  const birds = lsGet('birds', DEMO_BIRDS)
  const updated = birds.map(b => b.id === id ? { ...b, ...updates } : b)
  lsSet('birds', updated)
  return updated.find(b => b.id === id)
}

export async function deleteBird(id) {
  if (supabase) {
    const { error } = await supabase.from('birds').delete().eq('id', id)
    if (error) throw error
    return
  }
  const birds = lsGet('birds', DEMO_BIRDS)
  lsSet('birds', birds.filter(b => b.id !== id))
}

// ── EGG LOGS ───────────────────────────────────────────────────────────────
export async function getEggLogs(days = 30) {
  const since = new Date(Date.now() - days * 86400000).toISOString().split('T')[0]
  if (supabase) {
    const { data, error } = await supabase
      .from('egg_logs')
      .select('*')
      .gte('log_date', since)
      .order('log_date', { ascending: false })
    if (error) throw error
    return data
  }
  return lsGet('egg_logs', DEMO_EGG_LOGS).filter(l => l.log_date >= since)
}

export async function addEggLog(log) {
  const record = { ...log, id: lsId(), created_at: new Date().toISOString() }
  if (supabase) {
    const { data, error } = await supabase.from('egg_logs').insert([log]).select().single()
    if (error) throw error
    return data
  }
  const logs = lsGet('egg_logs', DEMO_EGG_LOGS)
  lsSet('egg_logs', [record, ...logs])
  return record
}

// ── HEALTH LOGS ────────────────────────────────────────────────────────────
export async function getHealthLogs(birdId) {
  if (supabase) {
    const q = supabase.from('health_logs').select('*').order('log_date', { ascending: false })
    const { data, error } = birdId ? await q.eq('bird_id', birdId) : await q
    if (error) throw error
    return data
  }
  const all = lsGet('health_logs', DEMO_HEALTH_LOGS)
  return birdId ? all.filter(l => l.bird_id === birdId) : all
}

export async function addHealthLog(log) {
  const record = { ...log, id: lsId(), created_at: new Date().toISOString() }
  if (supabase) {
    const { data, error } = await supabase.from('health_logs').insert([log]).select().single()
    if (error) throw error
    return data
  }
  const logs = lsGet('health_logs', DEMO_HEALTH_LOGS)
  lsSet('health_logs', [record, ...logs])
  return record
}

// ── HATCH LOGS ─────────────────────────────────────────────────────────────
export async function getHatchLogs() {
  if (supabase) {
    const { data, error } = await supabase.from('hatch_logs').select('*').order('set_date', { ascending: false })
    if (error) throw error
    return data
  }
  return lsGet('hatch_logs', DEMO_HATCH_LOGS)
}

export async function addHatchLog(log) {
  const record = { ...log, id: lsId(), created_at: new Date().toISOString() }
  if (supabase) {
    const { data, error } = await supabase.from('hatch_logs').insert([log]).select().single()
    if (error) throw error
    return data
  }
  const logs = lsGet('hatch_logs', DEMO_HATCH_LOGS)
  lsSet('hatch_logs', [record, ...logs])
  return record
}

export async function updateHatchLog(id, updates) {
  if (supabase) {
    const { data, error } = await supabase.from('hatch_logs').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  }
  const logs = lsGet('hatch_logs', DEMO_HATCH_LOGS)
  const updated = logs.map(l => l.id === id ? { ...l, ...updates } : l)
  lsSet('hatch_logs', updated)
  return updated.find(l => l.id === id)
}

// ── WEIGHT LOGS ────────────────────────────────────────────────────────────
export async function getWeightLogs(birdId) {
  if (supabase) {
    const { data, error } = await supabase.from('weight_logs').select('*').eq('bird_id', birdId).order('log_date')
    if (error) throw error
    return data
  }
  return lsGet('weight_logs_' + birdId, [])
}

export async function addWeightLog(log) {
  const record = { ...log, id: lsId(), created_at: new Date().toISOString() }
  if (supabase) {
    const { data, error } = await supabase.from('weight_logs').insert([log]).select().single()
    if (error) throw error
    return data
  }
  const logs = lsGet('weight_logs_' + log.bird_id, [])
  lsSet('weight_logs_' + log.bird_id, [...logs, record])
  return record
}

// ── DEMO DATA ──────────────────────────────────────────────────────────────
export const DEMO_BIRDS = [
  { id: 'b1', bird_number: 1, name_en: 'El Rojo', name_es: 'El Rojo', breed: 'Kelso Gamefowl', sex: 'M', age_months: 24, bloodline: 'Old Boston Kelso', weight_kg: 2.4, temperament: 'Aggressive', tags: ['show', 'breeder'], available: false, behaviors: ['aggressive', 'active'], egg_color: null, emoji: '🐓', notes_en: 'Champion bloodline, sharp reflexes.', notes_es: 'Línea campeona, reflejos agudos.', father_id: null, mother_id: null, hatch_date: '2022-04-15' },
  { id: 'b2', bird_number: 2, name_en: 'Reina', name_es: 'Reina', breed: 'Rhode Island Red', sex: 'F', age_months: 18, bloodline: 'Mahogany Line', weight_kg: 2.9, temperament: 'Calm', tags: ['breeder'], available: true, behaviors: ['calm', 'vocal'], egg_color: 'brown', emoji: '🐔', notes_en: 'Excellent layer, very consistent.', notes_es: 'Excelente ponedora, muy consistente.', father_id: null, mother_id: null, hatch_date: '2022-10-01' },
  { id: 'b3', bird_number: 3, name_en: 'Luna', name_es: 'Luna', breed: 'Ameraucana', sex: 'F', age_months: 14, bloodline: 'Blue Beard', weight_kg: 2.2, temperament: 'Calm', tags: ['for-sale'], available: true, behaviors: ['broody', 'calm'], egg_color: 'blue', emoji: '🐔', notes_en: 'Lays beautiful blue eggs.', notes_es: 'Pone hermosos huevos azules.', father_id: null, mother_id: null, hatch_date: '2023-02-20' },
  { id: 'b4', bird_number: 4, name_en: 'Titan', name_es: 'Titán', breed: 'Brahma', sex: 'M', age_months: 30, bloodline: 'Dark Brahma Heritage', weight_kg: 5.1, temperament: 'Gentle', tags: ['breeder', 'show'], available: false, behaviors: ['calm', 'active'], egg_color: null, emoji: '🐓', notes_en: 'Gentle giant, excellent sire.', notes_es: 'Gigante gentil, excelente semental.', father_id: null, mother_id: null, hatch_date: '2021-10-10' },
  { id: 'b5', bird_number: 5, name_en: 'Blanca', name_es: 'Blanca', breed: 'Leghorn', sex: 'F', age_months: 12, bloodline: 'Single Comb White', weight_kg: 1.8, temperament: 'Active', tags: ['breeder'], available: true, behaviors: ['active', 'vocal'], egg_color: 'white', emoji: '🐔', notes_en: 'Top producer, lays daily.', notes_es: 'Mejor productora, pone a diario.', father_id: null, mother_id: null, hatch_date: '2023-04-05' },
  { id: 'b6', bird_number: 6, name_en: 'Shadow', name_es: 'Sombra', breed: 'Sweater Gamefowl', sex: 'M', age_months: 20, bloodline: 'Sweater Grey', weight_kg: 2.1, temperament: 'Aggressive', tags: ['show'], available: false, behaviors: ['aggressive'], egg_color: null, emoji: '🐓', notes_en: 'Fast and high-stationed.', notes_es: 'Rápido y de alta estatura.', father_id: null, mother_id: null, hatch_date: '2022-08-12' },
]

export const DEMO_EGG_LOGS = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(Date.now() - (29 - i) * 86400000)
  return {
    id: 'e' + i,
    log_date: d.toISOString().split('T')[0],
    bird_id: ['b2', 'b3', 'b5'][i % 3],
    count: Math.max(0, Math.round(3 + Math.sin(i * 0.5) * 1.5 + (Math.random() - 0.5))),
    egg_color: ['brown', 'blue', 'white'][i % 3],
    egg_size: ['medium', 'large', 'medium'][i % 3],
    notes_en: '',
    notes_es: '',
  }
})

export const DEMO_HEALTH_LOGS = [
  { id: 'h1', bird_id: 'b1', log_date: '2024-03-15', type: 'vaccination', title_en: 'Newcastle Vaccine', title_es: 'Vacuna Newcastle', notes_en: 'Annual dose given.', notes_es: 'Dosis anual aplicada.', next_due: '2024-05-03' },
  { id: 'h2', bird_id: 'b2', log_date: '2024-01-10', type: 'vaccination', title_en: "Marek's Disease", title_es: 'Enfermedad de Marek', notes_en: 'Boosted.', notes_es: 'Refuerzo aplicado.', next_due: '2024-07-10' },
  { id: 'h3', bird_id: 'b2', log_date: '2024-04-20', type: 'observation', title_en: 'Weight drop noticed', title_es: 'Bajada de peso notada', notes_en: 'Weight dropped from 2.9 to 2.65 kg.', notes_es: 'Peso bajó de 2.9 a 2.65 kg.', next_due: null },
  { id: 'h4', bird_id: 'b3', log_date: '2024-04-18', type: 'observation', title_en: 'Broody behavior', title_es: 'Comportamiento clueca', notes_en: 'Sitting on nest box for 3 days.', notes_es: 'Sentada en el nido por 3 días.', next_due: null },
]

export const DEMO_HATCH_LOGS = [
  { id: 'ht1', label_en: 'Spring Clutch 2024', label_es: 'Puesta Primavera 2024', set_date: '2024-04-20', eggs_set: 12, fertile: 10, hatched: null, sire_id: 'b1', dam_id: 'b2', candling_d7: { fertile: 9, clear: 3, removed: 3 }, candling_d14: null, candling_d18: null, notes_en: 'Good fertility rate.', notes_es: 'Buena tasa de fertilidad.' },
  { id: 'ht2', label_en: 'Winter Clutch 2023', label_es: 'Puesta Invierno 2023', set_date: '2023-12-01', eggs_set: 10, fertile: 9, hatched: 8, sire_id: 'b4', dam_id: 'b3', candling_d7: { fertile: 9, clear: 1, removed: 1 }, candling_d14: { fertile: 8, clear: 1, removed: 1 }, candling_d18: { fertile: 8, clear: 0, removed: 0 }, notes_en: 'Excellent hatch rate.', notes_es: 'Excelente tasa de eclosión.' },
]
