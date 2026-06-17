import { useState } from 'react'
import { useLang } from '@/contexts/LangContext'
import LangThemeButtons from '@/components/shared/LangThemeButtons'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Eye, EyeOff, AlertCircle, Loader2, GraduationCap, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function LoginPage() {
  const { t } = useLang()
  const { login } = useAuth()
  const navigate  = useNavigate()

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPwd,  setShowPwd]  = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [errors,   setErrors]   = useState({})
  const [globalErr,setGlobalErr]= useState('')

  async function handleSubmit(ev) {
    ev.preventDefault()
    setGlobalErr('')
    setErrors({})

    // Lê direto do form — captura autocompletar do navegador
    const formEl  = ev.currentTarget
    const em  = formEl.querySelector('[name="email"]').value.trim()
    const pwd = formEl.querySelector('[name="password"]').value

    const errs = {}
    if (!em)  errs.email    = 'Informe seu e-mail.'
    if (!pwd) errs.password = 'Informe sua senha.'
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      const user = await login(em, pwd)
      navigate(user.role === 'teacher' ? '/professor' : '/aluno', { replace: true })
    } catch (err) {
      setGlobalErr(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-bg flex items-center justify-center px-4 py-16 min-h-screen">
      <div className="relative z-10 w-full max-w-md animate-fade-up">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ background:'linear-gradient(135deg,#8b5cf6,#6d28d9)', boxShadow:'0 8px 32px rgba(139,92,246,0.4)' }}>
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold" style={{ color:'var(--text-primary)' }}>EduLivre</h1>
          <p className="mt-2 text-sm" style={{ color:'var(--text-muted)' }}>Aprenda sem limites. Ensine com propósito.</p>
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs mt-3 transition-colors"
            style={{ color:'var(--text-muted)' }}
            onMouseEnter={e => e.currentTarget.style.color='#c4b5fd'}
            onMouseLeave={e => e.currentTarget.style.color='var(--text-muted)'}>
            <ArrowLeft className="w-3 h-3" /> Voltar ao início
          </Link>
          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center' }}><LangThemeButtons size="sm" /></div>
        </div>

        <div className="card p-7 sm:p-8">
          <h2 className="text-xl font-semibold mb-1" style={{ color:'var(--text-primary)' }}>{t('auth.loginTitle')}</h2>
          <p className="text-sm mb-6" style={{ color:'var(--text-muted)' }}>{t('auth.loginSub')}</p>

          {/* Erro global */}
          {globalErr && (
            <div className="flex items-start gap-2.5 p-3.5 mb-5 rounded-xl text-sm animate-fade-in"
              style={{ background:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.25)', color:'#fca5a5' }}>
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{globalErr}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* E-mail */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color:'var(--text-muted)' }}>{t('auth.email')}</label>
              <input
                name="email"
                className={cn('input', errors.email && 'error')}
                type="text"
                placeholder="seu@email.com"
                defaultValue={email}
                onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email:'' })); setGlobalErr('') }}
                autoComplete="email"
                spellCheck={false}
                inputMode="email"
              />
              {errors.email && (
                <p className="text-xs mt-1.5 flex items-center gap-1 text-red-400">
                  <AlertCircle className="w-3 h-3" />{errors.email}
                </p>
              )}
            </div>

            {/* Senha */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium" style={{ color:'var(--text-muted)' }}>{t('auth.password')}</label>
                <Link to="/recuperar-senha"
                  className="text-xs font-medium transition-colors"
                  style={{ color:'#a78bfa' }}
                  onMouseEnter={e => e.currentTarget.style.color='#c4b5fd'}
                  onMouseLeave={e => e.currentTarget.style.color='#a78bfa'}>
                  Esqueci minha senha
                </Link>
              </div>
              <div className="relative">
                <input
                  name="password"
                  className={cn('input pr-11', errors.password && 'error')}
                  type={showPwd ? 'text' : 'password'}
                  placeholder="••••••••"
                  defaultValue={password}
                  onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password:'' })); setGlobalErr('') }}
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPwd(s => !s)} tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color:'var(--text-muted)' }}>
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs mt-1.5 flex items-center gap-1 text-red-400">
                  <AlertCircle className="w-3 h-3" />{errors.password}
                </p>
              )}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full h-12 mt-2 text-base">
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Entrando...</>
                : 'Entrar'}
            </button>
          </form>

          <p className="text-center text-sm mt-5" style={{ color:'var(--text-muted)' }}>
            {t('auth.noAccount')}{' '}
            <Link to="/cadastro" className="font-semibold transition-colors" style={{ color:'#a78bfa' }}
              onMouseEnter={e => e.currentTarget.style.color='#c4b5fd'}
              onMouseLeave={e => e.currentTarget.style.color='#a78bfa'}>
              Criar conta grátis
            </Link>
          </p>
        </div>

        {/* Contas demo */}
        <div className="mt-4 p-4 rounded-xl text-xs text-center"
          style={{ background:'rgba(139,92,246,0.08)', border:'1px solid rgba(139,92,246,0.15)' }}>
          <span className="font-semibold text-purple-300">Contas de demonstração</span><br />
          <span style={{ color:'var(--text-muted)' }}>Aluno: </span>
          <span style={{ color:'var(--text-primary)' }}>aluno@edulivre.com</span>
          <span style={{ color:'var(--text-muted)' }}> · senha: </span>
          <span style={{ color:'var(--text-primary)' }}>123456</span>
          <br />
          <span style={{ color:'var(--text-muted)' }}>Professor: </span>
          <span style={{ color:'var(--text-primary)' }}>prof@edulivre.com</span>
          <span style={{ color:'var(--text-muted)' }}> · senha: </span>
          <span style={{ color:'var(--text-primary)' }}>123456</span>
        </div>
      </div>
    </div>
  )
}
