/**
 * LangThemeButtons — botões de idioma e tema reutilizáveis
 * Usados na LandingPage, TopBar, layouts de aluno e professor.
 */
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { useLang } from '@/contexts/LangContext'

export default function LangThemeButtons({ size = 'md', className = '' }) {
  const { dark, toggle: toggleTheme } = useTheme()
  const { lang, toggleLang, t } = useLang()

  const h = size === 'sm' ? 32 : 36
  const iconSize = size === 'sm' ? 14 : 16
  const flagSize = size === 'sm' ? 14 : 16
  const labelSize = size === 'sm' ? 10 : 11

  const btnBase = {
    height: h,
    borderRadius: 10,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    background: 'rgba(139,92,246,0.1)',
    border: '1px solid var(--border)',
    flexShrink: 0,
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }} className={className}>
      {/* Language toggle */}
      <button
        onClick={toggleLang}
        title={lang === 'pt' ? 'Switch to English' : 'Mudar para Português'}
        style={{ ...btnBase, padding: '0 10px', gap: 5 }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)'; e.currentTarget.style.background = 'rgba(139,92,246,0.18)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'rgba(139,92,246,0.1)' }}
      >
        <span style={{ fontSize: flagSize }}>
          {lang === 'pt' ? '🇧🇷' : '🇺🇸'}
        </span>
        <span style={{ fontSize: labelSize, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
          {lang === 'pt' ? 'PT' : 'EN'}
        </span>
      </button>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        title={dark ? t('theme.light') : t('theme.dark')}
        style={{ ...btnBase, width: h }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)'; e.currentTarget.style.background = 'rgba(139,92,246,0.18)'; e.currentTarget.style.transform = 'scale(1.1)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'rgba(139,92,246,0.1)'; e.currentTarget.style.transform = 'scale(1)' }}
      >
        {dark
          ? <Sun size={iconSize} color="#f59e0b" />
          : <Moon size={iconSize} color="#8b5cf6" />
        }
      </button>
    </div>
  )
}
