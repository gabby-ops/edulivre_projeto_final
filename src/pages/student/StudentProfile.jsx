// ============================================================
// EduLivre — StudentProfile
// Edição completa de perfil: nome, e-mail, avatar, senha
// Persiste no banco via PUT /api/users/profile
// ============================================================
import { useState, useRef, useEffect } from 'react'
import { useAuth }    from '@/contexts/AuthContext'
import { useCourses } from '@/contexts/CoursesContext'
import {
  User, Mail, Lock, Camera, Check, BookOpen,
  Award, TrendingUp, Eye, EyeOff, Loader2, AlertCircle,
  Shield, CheckCircle2,
} from 'lucide-react'
import toast from 'react-hot-toast'

// ── Campo de formulário reutilizável ─────────────────────────
function Field({ label, icon: Icon, children, hint }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
        <span className="flex items-center gap-1.5">
          {Icon && <Icon className="w-3.5 h-3.5" />}
          {label}
        </span>
      </label>
      {children}
      {hint && <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>{hint}</p>}
    </div>
  )
}

// ── Input com toggle de visibilidade ─────────────────────────
function PasswordInput({ value, onChange, placeholder, disabled }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        className="input pr-10"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="new-password"
      />
      <button type="button" onClick={() => setShow(v => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400/50 hover:text-purple-300 transition-colors">
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  )
}

export default function StudentProfile() {
  const { user, updateProfile, isBackend } = useAuth()
  const { courses, getProgress }           = useCourses()
  const fileRef = useRef(null)

  // ── Estado do formulário ───────────────────────────────────
  const [name,            setName]            = useState('')
  const [email,           setEmail]           = useState('')
  const [avatarPreview,   setAvatarPreview]   = useState(null) // nova imagem selecionada
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword,     setNewPassword]     = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving,          setSaving]          = useState(false)
  const [activeTab,       setActiveTab]       = useState('info') // 'info' | 'senha'

  // Preenche campos com dados atuais do usuário
  useEffect(() => {
    if (user) {
      setName(user.name  || '')
      setEmail(user.email || '')
    }
  }, [user])

  function getInitials(n) {
    return n?.split(' ').slice(0, 2).map(x => x[0]?.toUpperCase()).join('') || '?'
  }

  const displayAvatar = avatarPreview || user?.avatar || ''

  // ── Selecionar nova foto ───────────────────────────────────
  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 3 * 1024 * 1024) {
      toast.error('Imagem muito grande. Máx 3MB.')
      return
    }
    const reader = new FileReader()
    reader.onload = ev => setAvatarPreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  // ── Salvar informações (aba Info) ──────────────────────────
  async function handleSaveInfo(e) {
    e.preventDefault()
    if (!name.trim()) { toast.error('O nome é obrigatório.'); return }
    if (!email.trim()) { toast.error('O e-mail é obrigatório.'); return }

    setSaving(true)
    try {
      const payload = {}
      if (name.trim() !== user?.name)   payload.name   = name.trim()
      if (email.trim() !== user?.email) payload.email  = email.trim()
      if (avatarPreview)                payload.avatar = avatarPreview

      if (Object.keys(payload).length === 0) {
        toast('Nenhuma alteração detectada.')
        setSaving(false)
        return
      }

      await updateProfile(payload)
      setAvatarPreview(null) // Limpa preview após salvar
      if (fileRef.current) fileRef.current.value = ''
      toast.success('Perfil atualizado com sucesso!')
    } catch (err) {
      toast.error(err.message || 'Erro ao salvar perfil.')
    } finally {
      setSaving(false)
    }
  }

  // ── Salvar senha (aba Senha) ───────────────────────────────
  async function handleSaveSenha(e) {
    e.preventDefault()
    if (!currentPassword) { toast.error('Informe sua senha atual.'); return }
    if (!newPassword)      { toast.error('Informe a nova senha.'); return }
    if (newPassword.length < 6) { toast.error('A nova senha deve ter ao menos 6 caracteres.'); return }
    if (newPassword !== confirmPassword) { toast.error('As novas senhas não coincidem.'); return }

    setSaving(true)
    try {
      await updateProfile({ currentPassword, newPassword, confirmPassword })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      toast.success('Senha alterada com sucesso!')
    } catch (err) {
      toast.error(err.message || 'Erro ao alterar senha.')
    } finally {
      setSaving(false)
    }
  }

  // ── Estatísticas ───────────────────────────────────────────
  const completed   = courses.filter(c => getProgress(user?.id, c.id) === 100).length
  const inProgress  = courses.filter(c => { const p = getProgress(user?.id, c.id); return p > 0 && p < 100 }).length
  const totalLessons = courses.reduce((acc, c) => {
    const done = Math.round((getProgress(user?.id, c.id) / 100) * c.lessons.length)
    return acc + done
  }, 0)

  const memberDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    : '—'

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6 animate-fade-up">
        <h1 className="font-display text-2xl font-bold text-white">Meu Perfil</h1>
        <p className="text-sm mt-1 flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
          Gerencie suas informações pessoais
          {isBackend
            ? <span className="text-[10px] text-emerald-400 font-medium">● Sincronizado com banco de dados</span>
            : <span className="text-[10px] text-yellow-400 font-medium">● Modo offline</span>
          }
        </p>
      </div>

      {/* Avatar + nome */}
      <div className="card p-6 sm:p-8 text-center mb-5 animate-fade-up" style={{ animationDelay: '0.05s' }}>
        <div className="relative inline-block group cursor-pointer" onClick={() => fileRef.current?.click()}>
          {displayAvatar
            ? <img src={displayAvatar} alt="avatar"
                className="w-24 h-24 rounded-full object-cover border-4 mx-auto"
                style={{ borderColor: 'rgba(139,92,246,0.4)', boxShadow: '0 8px 32px rgba(139,92,246,0.3)' }} />
            : <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold border-4 mx-auto"
                style={{ background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)', color: '#fff',
                  borderColor: 'rgba(139,92,246,0.4)', boxShadow: '0 8px 32px rgba(139,92,246,0.3)' }}>
                {getInitials(user?.name)}
              </div>
          }
          <div className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: 'rgba(0,0,0,0.55)' }}>
            <Camera className="w-6 h-6 text-white" />
          </div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

        {avatarPreview && (
          <p className="text-xs mt-2 text-purple-400">
            Nova foto selecionada — clique em "Salvar Alterações" para confirmar.
          </p>
        )}
        {!avatarPreview && (
          <button onClick={() => fileRef.current?.click()}
            className="mt-2 text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 mx-auto transition-colors">
            <Camera className="w-3 h-3" /> Alterar foto
          </button>
        )}

        <h2 className="font-display text-xl font-bold text-white mt-4 mb-1">{user?.name}</h2>
        <span className="badge-green text-xs">Aluno</span>
        <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>Membro desde {memberDate}</p>
      </div>

      {/* Abas */}
      <div className="flex gap-2 mb-4 animate-fade-up" style={{ animationDelay: '0.10s' }}>
        {[
          { key: 'info',  label: 'Informações', icon: User  },
          { key: 'senha', label: 'Senha',        icon: Shield },
        ].map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={activeTab === key
              ? { background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)', color: '#fff', boxShadow: '0 4px 16px rgba(139,92,246,0.3)' }
              : { background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)', color: 'rgba(139,92,246,0.7)' }}>
            <Icon className="w-4 h-4" />{label}
          </button>
        ))}
      </div>

      {/* ─── Aba: Informações ─────────────────────────────────── */}
      {activeTab === 'info' && (
        <form onSubmit={handleSaveInfo}
          className="card p-5 sm:p-6 space-y-4 animate-fade-up" style={{ animationDelay: '0.12s' }}>
          <Field label="Nome completo" icon={User}>
            <input
              className="input"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Seu nome completo"
              disabled={saving}
              required
            />
          </Field>

          <Field label="E-mail" icon={Mail}
            hint={isBackend ? 'Alterar o e-mail pode exigir novo login.' : undefined}>
            <input
              type="email"
              className="input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com"
              disabled={saving}
              required
            />
          </Field>

          <button type="submit" disabled={saving}
            className="btn-primary w-full h-11 flex items-center justify-center gap-2">
            {saving
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Salvando…</>
              : <><CheckCircle2 className="w-4 h-4" /> Salvar Alterações</>
            }
          </button>

          {!isBackend && (
            <div className="flex items-start gap-2 p-3 rounded-xl text-xs"
              style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', color: '#fbbf24' }}>
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              Modo offline: alterações salvas localmente. Configure o backend para persistência real.
            </div>
          )}
        </form>
      )}

      {/* ─── Aba: Senha ───────────────────────────────────────── */}
      {activeTab === 'senha' && (
        <form onSubmit={handleSaveSenha}
          className="card p-5 sm:p-6 space-y-4 animate-fade-up" style={{ animationDelay: '0.12s' }}>
          <Field label="Senha atual" icon={Lock}>
            <PasswordInput
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              placeholder="Digite sua senha atual"
              disabled={saving}
            />
          </Field>

          <Field label="Nova senha" icon={Lock}
            hint="Mínimo 6 caracteres.">
            <PasswordInput
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="Nova senha"
              disabled={saving}
            />
          </Field>

          <Field label="Confirmar nova senha" icon={Lock}>
            <PasswordInput
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Repita a nova senha"
              disabled={saving}
            />
          </Field>

          <button type="submit" disabled={saving}
            className="btn-primary w-full h-11 flex items-center justify-center gap-2">
            {saving
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Salvando…</>
              : <><Shield className="w-4 h-4" /> Alterar Senha</>
            }
          </button>
        </form>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 animate-fade-up" style={{ animationDelay: '0.20s' }}>
        {[
          { icon: BookOpen,   label: 'Cursos',       value: courses.length, color: '#8b5cf6' },
          { icon: TrendingUp, label: 'Em andamento', value: inProgress,     color: '#f59e0b' },
          { icon: Award,      label: 'Concluídos',   value: completed,      color: '#10b981' },
          { icon: User,       label: 'Aulas feitas', value: totalLessons,   color: '#ec4899' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="card p-4 text-center">
            <Icon className="w-5 h-5 mx-auto mb-2" style={{ color }} />
            <p className="text-xl font-display font-bold text-white">{value}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
