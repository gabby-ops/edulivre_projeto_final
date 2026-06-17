import { createContext, useContext, useState, useCallback } from 'react'
import pt from '@/locales/pt.json'
import en from '@/locales/en.json'

const TRANSLATIONS = { pt, en }

const LangContext = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() =>
    localStorage.getItem('edulivre_lang') || 'pt'
  )

  const toggleLang = useCallback(() => {
    setLang(prev => {
      const next = prev === 'pt' ? 'en' : 'pt'
      localStorage.setItem('edulivre_lang', next)
      return next
    })
  }, [])

  const t = useCallback((key) => {
    const keys = key.split('.')
    let val = TRANSLATIONS[lang]
    for (const k of keys) {
      val = val?.[k]
      if (val === undefined) return key
    }
    return val ?? key
  }, [lang])

  return (
    <LangContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be inside LangProvider')
  return ctx
}
