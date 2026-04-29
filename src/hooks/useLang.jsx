import { createContext, useContext, useState, useEffect } from 'react'
import { useT } from '../i18n/translations'

const LangContext = createContext()

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('saquic_lang')
    if (saved) return saved
    return navigator.language?.startsWith('es') ? 'es' : 'en'
  })

  const toggle = () => setLang(l => {
    const next = l === 'en' ? 'es' : 'en'
    localStorage.setItem('saquic_lang', next)
    return next
  })

  const t = useT(lang)

  return <LangContext.Provider value={{ lang, toggle, t }}>{children}</LangContext.Provider>
}

export const useLang = () => useContext(LangContext)
