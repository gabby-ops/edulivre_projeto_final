import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  GraduationCap, ArrowLeft, Mail, Eye, EyeOff,
  CheckCircle2, AlertCircle, Loader2, KeyRound, Send
} from 'lucide-react'

const USE_BACKEND = Boolean(import.meta.env.VITE_API_URL)
const API_BASE    = import.meta.env.VITE_API_URL || ''

// ── Helpers offline ────────────────────────────────────────
async function hashPassword(password) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(String(password)))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}
function readUsers()   { try { return JSON.parse(localStorage.getItem('edulivre_users_v1') || '[]') } catch { return [] } }
function writeUsers(u) { localStorage.setItem('edulivre_users_v1', JSON.stringify(u)) }

export default function ForgotPasswordPage() {
  const [params] = useSearchParams()
  const tokenFromUrl = params.get('token') || ''

  // Se há token na URL, vai direto pro passo de nova senha (modo backend)
  const initialStep = USE_BACKEND && tokenFromUrl ? 2 : 1

  const [step,    setStep]    = useState(initialStep)
  const [email,   setEmail]   = useState('')
  const [token,   setToken]   = useState(tokenFromUrl)
  const [showP1,  setShowP1]  = useState(false)
  const [showP2,  setShowP2]  = useState(false)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  useEffect(() => {
    if (tokenFromUrl) setToken(tokenFromUrl)
  }, [tokenFromUrl])

  // ── Passo 1: solicitar reset ──────────────────────────────
  async function handleRequestReset(ev) {
    ev.preventDefault()
    setError('')
    const em = ev.currentTarget.querySelector('[name="email"]').value.trim()
    setEmail(em)
    if (!em) { setError('Informe seu e-mail.'); return }

    setLoading(true)
    try {
      if (USE_BACKEND) {
        const res  = await fetch(`${API_BASE}/auth/forgot-password`, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ email: em }),
        })
        await res.json() // resposta genérica — sempre avança
        setStep(3) // passo "e-mail enviado"
      } else {
        // Offline: verifica se existe e vai para passo 2
        const users = readUsers()
        const found = users.find(u => u.email === em.toLowerCase())
        if (!found) { setError('Nenhuma conta encontrada com este e-mail.'); return }
        setStep(2)
      }
    } catch {
      if (USE_BACKEND) setStep(3) // mesmo com erro de rede, não revela se existe
      else setError('Erro ao verificar e-mail.')
    } finally {
      setLoading(false)
    }
  }

  // ── Passo 2: definir nova senha ───────────────────────────
  async function handleReset(ev) {
    ev.preventDefault()
    setError('')
    const p1 = ev.currentTarget.querySelector('[name="newpwd"]').value
    const p2 = ev.currentTarget.querySelector('[name="cfmpwd"]').value
    if (!p1)          { setError('Digite a nova senha.'); return }
    if (p1.length < 6){ setError('Mínimo 6 caracteres.'); return }
    if (p1 !== p2)    { setError('As senhas não coincidem.'); return }

    setLoading(true)
    try {
      if (USE_BACKEND) {
        const res  = await fetch(`${API_BASE}/auth/reset-password`, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ token, password: p1, confirm: p2 }),
        })
        const data = await res.json()
        if (!res.ok) { setError(data.error || 'Token inválido ou expirado.'); return }
        setStep(4) // sucesso
      } else {
        // Offline: atualiza direto no localStorage
        const users = readUsers()
        const idx   = users.findIndex(u => u.email === email.toLowerCase())
        if (idx === -1) { setError('Conta não encontrada.'); return }
        users[idx].passwordHash = await hashPassword(p1)
        writeUsers(users)
        setStep(4)
      }
    } catch {
      setError('Erro ao redefinir senha. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  // ── stepLabels ────────────────────────────────────────────
  const title = {
    1: 'Recuperar conta',
    2: 'Nova senha',
    3: 'E-mail enviado',
    4: 'Senha redefinida!',
  }[step]

  const subtitle = {
    1: 'Informe seu e-mail para redefinir a senha',
    2: 'Crie uma nova senha para sua conta',
    3: USE_BACKEND ? 'Verifique sua caixa de entrada' : '',
    4: 'Sua senha foi atualizada com sucesso',
  }[step]

  return (
    <div className="auth-bg flex items-center justify-center px-4 py-16 min-h-screen">
      <div className="relative z-10 w-full max-w-md animate-fade-up">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3"
            style={{ background:'linear-gradient(135deg,#8b5cf6,#6d28d9)', boxShadow:'0 8px 28px rgba(139,92,246,0.4)' }}>
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold" style={{ color:'var(--text-primary)' }}>{title}</h1>
          <p className="text-sm mt-1" style={{ color:'var(--text-muted)' }}>{subtitle}</p>
        </div>

        {/* Indicador de passos — só mostra em steps 1 e 2 no modo offline */}
        {!USE_BACKEND && step < 4 && (
          <div className="flex items-center gap-2 mb-6 justify-center">
            {[1, 2].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                  style={step >= s
                    ? { background:'linear-gradient(135deg,#8b5cf6,#6d28d9)', color:'#fff' }
                    : { background:'rgba(139,92,246,0.1)', border:'1px solid rgba(139,92,246,0.2)', color:'var(--text-muted)' }}>
                  {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                </div>
                {s < 2 && <div className="w-12 h-0.5 rounded" style={{ background: step > s ? '#8b5cf6' : 'var(--border)' }} />}
              </div>
            ))}
          </div>
        )}

        <div className="card p-6 sm:p-7">

          {/* Erro */}
          {error && (
            <div className="flex items-start gap-2.5 p-3.5 mb-5 rounded-xl text-sm"
              style={{ background:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.25)', color:'#fca5a5' }}>
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          {/* ── Passo 1: E-mail ──────────────────────────── */}
          {step === 1 && (
            <form onSubmit={handleRequestReset} noValidate className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color:'var(--text-muted)' }}>
                  E-mail da sua conta
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color:'var(--text-muted)' }} />
                  <input
                    name="email" type="text" className="input pl-10"
                    placeholder="voce@email.com" defaultValue={email}
                    autoComplete="email" inputMode="email" spellCheck={false}
                  />
                </div>
                {USE_BACKEND && (
                  <p className="text-xs mt-2" style={{ color:'var(--text-muted)' }}>
                    Um link de redefinição será enviado para seu e-mail.
                  </p>
                )}
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full h-12">
                {loading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</>
                  : USE_BACKEND
                    ? <><Send className="w-4 h-4" /> Enviar link de redefinição</>
                    : <><Mail className="w-4 h-4" /> Verificar e-mail</>}
              </button>
            </form>
          )}

          {/* ── Passo 2: Nova senha ─────────────────────── */}
          {step === 2 && (
            <form onSubmit={handleReset} noValidate className="space-y-4">
              {!USE_BACKEND && (
                <div className="p-3 rounded-xl text-sm flex items-center gap-2 mb-2"
                  style={{ background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.2)', color:'#34d399' }}>
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  Conta encontrada: <strong>{email}</strong>
                </div>
              )}
              {USE_BACKEND && (
                <div className="p-3 rounded-xl text-sm flex items-center gap-2 mb-2"
                  style={{ background:'rgba(139,92,246,0.1)', border:'1px solid rgba(139,92,246,0.2)', color:'#c4b5fd' }}>
                  <KeyRound className="w-4 h-4 shrink-0" />
                  Token de redefinição recebido. Crie sua nova senha.
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color:'var(--text-muted)' }}>Nova senha</label>
                <div className="relative">
                  <input name="newpwd" type={showP1 ? 'text' : 'password'} className="input pr-11"
                    placeholder="Mínimo 6 caracteres" autoComplete="new-password" />
                  <button type="button" onClick={() => setShowP1(s => !s)} tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color:'var(--text-muted)' }}>
                    {showP1 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color:'var(--text-muted)' }}>Confirmar nova senha</label>
                <div className="relative">
                  <input name="cfmpwd" type={showP2 ? 'text' : 'password'} className="input pr-11"
                    placeholder="Repita a senha" autoComplete="new-password" />
                  <button type="button" onClick={() => setShowP2(s => !s)} tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color:'var(--text-muted)' }}>
                    {showP2 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full h-12">
                {loading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Salvando...</>
                  : <><KeyRound className="w-4 h-4" /> Redefinir senha</>}
              </button>

              {!USE_BACKEND && (
                <button type="button" onClick={() => { setStep(1); setError('') }}
                  className="btn-ghost w-full h-10 text-sm">
                  <ArrowLeft className="w-4 h-4" /> Voltar
                </button>
              )}
            </form>
          )}

          {/* ── Passo 3: E-mail enviado (modo backend) ──── */}
          {step === 3 && (
            <div className="text-center py-2">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background:'rgba(139,92,246,0.15)', border:'2px solid rgba(139,92,246,0.4)' }}>
                <Send className="w-8 h-8" style={{ color:'#a78bfa' }} />
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color:'var(--text-primary)' }}>
                Verifique seu e-mail
              </h3>
              <p className="text-sm mb-2" style={{ color:'var(--text-muted)' }}>
                Se o endereço <strong style={{ color:'var(--text-primary)' }}>{email}</strong> estiver cadastrado,
                você receberá um link de redefinição em breve.
              </p>
              <p className="text-xs mb-6" style={{ color:'var(--text-muted)' }}>
                O link expira em 1 hora. Verifique também a pasta de spam.
              </p>
              <button onClick={() => { setStep(1); setError('') }}
                className="btn-ghost w-full h-10 text-sm">
                <ArrowLeft className="w-4 h-4" /> Tentar outro e-mail
              </button>
            </div>
          )}

          {/* ── Passo 4: Sucesso ─────────────────────────── */}
          {step === 4 && (
            <div className="text-center py-2">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background:'rgba(16,185,129,0.15)', border:'2px solid rgba(16,185,129,0.4)' }}>
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color:'var(--text-primary)' }}>
                Senha redefinida com sucesso!
              </h3>
              <p className="text-sm mb-6" style={{ color:'var(--text-muted)' }}>
                Agora você pode entrar com sua nova senha.
              </p>
              <Link to="/login" className="btn-primary w-full h-12 flex items-center justify-center gap-2">
                <GraduationCap className="w-4 h-4" /> Ir para o login
              </Link>
            </div>
          )}
        </div>

        <p className="text-center text-sm mt-4" style={{ color:'var(--text-muted)' }}>
          Lembrou a senha?{' '}
          <Link to="/login" className="font-semibold" style={{ color:'#a78bfa' }}>
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  )
}
