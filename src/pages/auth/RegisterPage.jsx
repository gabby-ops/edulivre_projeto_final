import { useState } from 'react'
import { useLang } from '@/contexts/LangContext'
import LangThemeButtons from '@/components/shared/LangThemeButtons'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import {
  Eye, EyeOff, AlertCircle, CheckCircle2,
  Loader2, GraduationCap, BookOpen, Users, ArrowLeft, XCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Mesma validação do AuthContext
function isValidEmail(raw) {
  if (!raw || typeof raw !== 'string') return false
  const email = raw.trim().toLowerCase()
  // Deve ter exatamente um @
  const parts = email.split('@')
  if (parts.length !== 2) return false
  const [local, domain] = parts
  if (!local || local.length < 1) return false
  if (!domain || !domain.includes('.')) return false
  // Extensão final: 2–10 letras apenas
  const ext = domain.split('.').pop()
  if (!ext || !/^[a-zA-Z]{2,10}$/.test(ext)) return false
  // Regex completa
  if (!/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,10}$/.test(email)) return false
  if (/\.\./.test(email)) return false
  return true
}

function isValidName(n) {
  if (!n || n.trim().length < 2) return false
  return n.replace(/[^a-zA-ZÀ-ÿ]/g, '').length >= 2
}

function StrengthBar({ pwd }) {
  if (!pwd) return null
  let s = 0
  if (pwd.length >= 6) s++
  if (pwd.length >= 10) s++
  if (/[A-Z]/.test(pwd)) s++
  if (/\d/.test(pwd) || /[^a-zA-Z0-9]/.test(pwd)) s++
  const colors = ['', '#ef4444', '#f59e0b', '#eab308', '#10b981']
  const labels = ['', 'Fraca', 'Média', 'Boa', 'Forte']
  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{ background: i <= s ? colors[s] : 'rgba(139,92,246,0.12)' }} />
        ))}
      </div>
      <p className="text-xs font-medium" style={{ color: colors[s] }}>Força: {labels[s]}</p>
    </div>
  )
}

export default function RegisterPage() {
  const { t } = useLang()
  const { register } = useAuth()
  const navigate = useNavigate()

  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [role,     setRole]     = useState('')
  const [showPwd,  setShowPwd]  = useState(false)
  const [showCfm,  setShowCfm]  = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [errors,   setErrors]   = useState({})
  const [globalErr,setGlobalErr]= useState('')

  function validate(n, em, pwd, cfm, rl) {
    const e = {}
    if (!n.trim())            e.name     = 'Informe seu nome.'
    else if (!isValidName(n)) e.name     = 'Nome inválido. Use pelo menos 2 letras.'

    if (!em.trim())                    e.email = 'Informe seu e-mail.'
    else if (!isValidEmail(em))        e.email = 'E-mail inválido. Exemplo: voce@gmail.com'

    if (!pwd)                          e.password = 'Crie uma senha.'
    else if (pwd.length < 6)           e.password = 'Mínimo 6 caracteres.'

    if (!cfm)                          e.confirm = 'Confirme sua senha.'
    else if (pwd !== cfm)              e.confirm = 'As senhas não coincidem.'

    if (!rl)                           e.role = 'Selecione o tipo de conta.'
    return e
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    setGlobalErr('')

    // Lê valores direto do formulário (pega autocomplete também)
    const formEl  = ev.currentTarget
    const nm  = formEl.querySelector('[name="name"]').value.trim()
    const em  = formEl.querySelector('[name="email"]').value.trim()
    const pwd = formEl.querySelector('[name="password"]').value
    const cfm = formEl.querySelector('[name="confirm"]').value

    // Sincroniza state com valores reais do form
    setName(nm); setEmail(em); setPassword(pwd); setConfirm(cfm)

    const errs = validate(nm, em, pwd, cfm, role)
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setLoading(true)
    try {
      const user = await register(nm, em, pwd, cfm, role)
      navigate(user.role === 'teacher' ? '/professor' : '/aluno/onboarding', { replace: true })
    } catch (err) {
      setGlobalErr(err.message)
      // Se o erro vier do backend e mencionar e-mail, mostramos no campo
      if (err.message.toLowerCase().includes('e-mail')) {
        setErrors(p => ({ ...p, email: err.message }))
      }
    } finally {
      setLoading(false)
    }
  }

  const emailOk = isValidEmail(email)
  const pwdOk   = password === confirm && password.length >= 6

  return (
    <div className="auth-bg flex items-center justify-center px-4 py-10 min-h-screen">
      <div className="relative z-10 w-full max-w-md animate-fade-up">

        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3"
            style={{ background:'linear-gradient(135deg,#8b5cf6,#6d28d9)', boxShadow:'0 8px 28px rgba(139,92,246,0.4)' }}>
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold" style={{ color:'var(--text-primary)' }}>Criar conta</h1>
          <p className="text-sm mt-1" style={{ color:'var(--text-muted)' }}>Junte-se à EduLivre gratuitamente</p>
          <Link to="/" className="inline-flex items-center gap-1 text-xs mt-2 transition-colors"
            style={{ color:'var(--text-muted)' }}>
            <ArrowLeft className="w-3 h-3" /> Voltar ao início
          </Link>
          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center' }}><LangThemeButtons size="sm" /></div>
        </div>

        <div className="card p-6 sm:p-7">
          {globalErr && (
            <div className="flex items-start gap-2.5 p-3.5 mb-5 rounded-xl text-sm animate-fade-in"
              style={{ background:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.3)', color:'#fca5a5' }}>
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />{globalErr}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">

            {/* Nome */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color:'var(--text-muted)' }}>{t('auth.name')}</label>
              <input name="name" className={cn('input', errors.name && 'error')}
                type="text" placeholder="Ex: Maria Silva"
                defaultValue={name}
                onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name:'' })) }}
                maxLength={80} />
              {errors.name && <p className="text-xs mt-1.5 flex items-center gap-1 text-red-400"><XCircle className="w-3 h-3" />{errors.name}</p>}
            </div>

            {/* E-mail */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color:'var(--text-muted)' }}>{t('auth.email')}</label>
              <input name="email" className={cn('input', errors.email && 'error', emailOk && !errors.email && email && 'border-emerald-500/40')}
                type="text"
                placeholder="voce@gmail.com"
                defaultValue={email}
                onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email:'' })) }}
                autoComplete="email"
                spellCheck={false}
                inputMode="email" />
              {errors.email
                ? <p className="text-xs mt-1.5 flex items-center gap-1 text-red-400"><XCircle className="w-3 h-3" />{errors.email}</p>
                : emailOk && email && <p className="text-xs mt-1.5 flex items-center gap-1 text-emerald-400"><CheckCircle2 className="w-3 h-3" />E-mail válido</p>
              }
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color:'var(--text-muted)' }}>{t('auth.password')}</label>
              <div className="relative">
                <input name="password" className={cn('input pr-11', errors.password && 'error')}
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Mínimo 6 caracteres"
                  defaultValue={password}
                  onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password:'', confirm:'' })) }}
                  autoComplete="new-password" />
                <button type="button" onClick={() => setShowPwd(s => !s)} tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color:'var(--text-muted)' }}>
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs mt-1.5 flex items-center gap-1 text-red-400"><XCircle className="w-3 h-3" />{errors.password}</p>}
              <StrengthBar pwd={password} />
            </div>

            {/* Confirmar senha */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color:'var(--text-muted)' }}>{t('auth.confirmPassword')}</label>
              <div className="relative">
                <input name="confirm" className={cn('input pr-11', errors.confirm && 'error', pwdOk && confirm && 'border-emerald-500/40')}
                  type={showCfm ? 'text' : 'password'}
                  placeholder="Repita a senha"
                  defaultValue={confirm}
                  onChange={e => { setConfirm(e.target.value); setErrors(p => ({ ...p, confirm:'' })) }}
                  autoComplete="new-password" />
                <button type="button" onClick={() => setShowCfm(s => !s)} tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color:'var(--text-muted)' }}>
                  {showCfm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirm
                ? <p className="text-xs mt-1.5 flex items-center gap-1 text-red-400"><XCircle className="w-3 h-3" />{errors.confirm}</p>
                : pwdOk && confirm && <p className="text-xs mt-1.5 flex items-center gap-1 text-emerald-400"><CheckCircle2 className="w-3 h-3" />Senhas coincidem</p>
              }
            </div>

            {/* Tipo de conta */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color:'var(--text-muted)' }}>Tipo de conta</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { val:'student', label:'Aluno',    icon:BookOpen, desc:'Acesse cursos e aulas' },
                  { val:'teacher', label:'Professor', icon:Users,    desc:'Crie e gerencie cursos' },
                ].map(({ val, label, icon:Icon, desc }) => (
                  <button key={val} type="button" onClick={() => { setRole(val); setErrors(p => ({ ...p, role:'' })) }}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 cursor-pointer"
                    style={{
                      borderColor: role === val ? 'rgba(139,92,246,0.6)' : 'var(--border)',
                      background: role === val ? 'rgba(139,92,246,0.14)' : 'transparent',
                    }}>
                    <Icon className="w-6 h-6" style={{ color: role === val ? '#a78bfa' : 'var(--text-muted)' }} />
                    <span className="text-sm font-semibold" style={{ color: role === val ? '#c4b5fd' : 'var(--text-primary)' }}>{label}</span>
                    <span className="text-xs text-center leading-tight" style={{ color:'var(--text-muted)' }}>{desc}</span>
                  </button>
                ))}
              </div>
              {errors.role && <p className="text-xs mt-2 flex items-center gap-1 text-red-400"><XCircle className="w-3 h-3" />{errors.role}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full h-12 mt-2 text-base">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Criando conta...</> : 'Criar conta grátis'}
            </button>
          </form>

          <div className="mt-4 p-3 rounded-xl text-xs text-center"
            style={{ background:'rgba(139,92,246,0.06)', border:'1px solid rgba(139,92,246,0.12)', color:'var(--text-muted)' }}>
            🔒 Dados salvos localmente no seu navegador.
          </div>

          <p className="text-center text-sm mt-4" style={{ color:'var(--text-muted)' }}>
            {t('auth.hasAccount')}{' '}
            <Link to="/login" className="font-semibold" style={{ color:'#a78bfa' }}>Fazer login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
