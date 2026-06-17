import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem('edulivre_theme')
    return stored ? stored === 'dark' : true
  })

  useEffect(() => {
    localStorage.setItem('edulivre_theme', dark ? 'dark' : 'light')
    if (dark) {
      document.documentElement.classList.add('dark')
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.setAttribute('data-theme', 'light')
    }
    // Update CSS variables live
    const root = document.documentElement
    if (dark) {
      root.style.setProperty('--bg-primary',   '#07070f')
      root.style.setProperty('--bg-secondary', '#0d0d1a')
      root.style.setProperty('--bg-card',      '#12122a')
      root.style.setProperty('--bg-card-hover','#1a1a35')
      root.style.setProperty('--border',       'rgba(139,92,246,0.15)')
      root.style.setProperty('--border-hover', 'rgba(139,92,246,0.35)')
      root.style.setProperty('--text-primary', '#f0eeff')
      root.style.setProperty('--text-muted',   '#8b8aae')
      document.body.style.background = '#07070f'
      document.body.style.color = '#f0eeff'
    } else {
      root.style.setProperty('--bg-primary',   '#f5f3ff')
      root.style.setProperty('--bg-secondary', '#ede9fe')
      root.style.setProperty('--bg-card',      '#ffffff')
      root.style.setProperty('--bg-card-hover','#faf8ff')
      root.style.setProperty('--border',       'rgba(139,92,246,0.18)')
      root.style.setProperty('--border-hover', 'rgba(139,92,246,0.4)')
      root.style.setProperty('--text-primary', '#1e1040')
      root.style.setProperty('--text-muted',   '#6d5f9e')
      document.body.style.background = '#f5f3ff'
      document.body.style.color = '#1e1040'
    }
  }, [dark])

  const toggle = () => setDark(d => !d)

  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider')
  return ctx
}
