// ============================================================
// EduLivre — AuthContext
// Modo dual: backend (VITE_API_URL) ou localStorage (offline)
// ============================================================
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { api, setToken, getToken } from '@/services/api'

const AuthContext = createContext(null)

const USERS_KEY   = 'edulivre_users_v1'
const SESSION_KEY = 'edulivre_session_v1'
const SESSION_TTL = 7 * 24 * 60 * 60 * 1000
const _u = import.meta.env.VITE_API_URL
const USE_BACKEND = Boolean(_u && _u.trim() !== '')

// ── Helpers offline ─────────────────────────────────────────
async function hashPassword(password) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(String(password)))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}
function isValidEmail(raw) {
  if (!raw || typeof raw !== 'string') return false
  return /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,10}$/.test(raw.trim().toLowerCase())
}
function readUsers()   { try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]') } catch { return [] } }
function writeUsers(u) { localStorage.setItem(USERS_KEY, JSON.stringify(u)) }
function readSession() {
  try {
    const s = JSON.parse(localStorage.getItem(SESSION_KEY))
    if (!s || !s.expiresAt || Date.now() > s.expiresAt) { localStorage.removeItem(SESSION_KEY); return null }
    return s
  } catch { return null }
}
function saveSession(user) {
  const s = {
    id: user.id, name: user.name, email: user.email,
    role: user.role, avatar: user.avatar || '',
    createdAt: user.createdAt || user.created_at || new Date().toISOString(),
    expiresAt: Date.now() + SESSION_TTL,
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(s))
  return s
}

async function seedDemoAccounts() {
  const hash  = await hashPassword('123456')
  const users = readUsers()
  const others = users.filter(u => u.id !== 'demo-student' && u.id !== 'demo-teacher')
  writeUsers([
    ...others,
    { id: 'demo-student', name: 'Aluno Demo',     email: 'aluno@edulivre.com', role: 'student', passwordHash: hash, avatar: '', createdAt: new Date().toISOString() },
    { id: 'demo-teacher', name: 'Professor Demo', email: 'prof@edulivre.com',  role: 'teacher', passwordHash: hash, avatar: '', createdAt: new Date().toISOString() },
  ])
  localStorage.setItem('edulivre_onboarding_demo-student', '1')
}

// ── Provider ─────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (USE_BACKEND) {
      const token = getToken()
      if (token) {
        api.auth.me()
          .then(u => setUser(u))
          .catch(() => { setToken(null); setUser(null) })
          .finally(() => setLoading(false))
      } else {
        setLoading(false)
      }
    } else {
      seedDemoAccounts().then(() => {
        setUser(readSession())
        setLoading(false)
      })
    }
  }, [])

  // ── Login ──────────────────────────────────────────────────
  const login = useCallback(async (rawEmail, rawPassword) => {
    const email    = String(rawEmail    || '').trim().toLowerCase()
    const password = String(rawPassword || '')
    if (!email)    throw new Error('Informe o e-mail.')
    if (!password) throw new Error('Informe a senha.')

    if (USE_BACKEND) {
      const { token, user: u } = await api.auth.login(email, password)
      setToken(token)
      setUser(u)
      return u
    }

    const users = readUsers()
    const found = users.find(u => u.email === email)
    if (!found) throw new Error('E-mail não encontrado. Verifique ou crie uma conta.')
    const hash = await hashPassword(password)
    if (found.passwordHash !== hash) throw new Error('Senha incorreta. Verifique a senha e tente novamente.')
    const s = saveSession(found)
    setUser(s)
    return s
  }, [])

  // ── Cadastro ───────────────────────────────────────────────
  const register = useCallback(async (rawName, rawEmail, rawPassword, rawConfirm, role) => {
    const name     = String(rawName     || '').trim()
    const email    = String(rawEmail    || '').trim().toLowerCase()
    const password = String(rawPassword || '')
    const confirm  = String(rawConfirm  || '')

    if (!name || name.length < 2)         throw new Error('Nome inválido. Use pelo menos 2 letras.')
    if (!isValidEmail(email))             throw new Error('E-mail inválido. Use o formato: voce@dominio.com')
    if (password.length < 6)             throw new Error('A senha deve ter no mínimo 6 caracteres.')
    if (password !== confirm)            throw new Error('As senhas não coincidem.')
    if (!['student','teacher'].includes(role)) throw new Error('Selecione o tipo de conta.')

    if (USE_BACKEND) {
      const { token, user: u } = await api.auth.register(name, email, password, confirm, role)
      setToken(token)
      setUser(u)
      return u
    }

    const users = readUsers()
    if (users.some(u => u.email === email)) throw new Error('Este e-mail já está cadastrado. Faça login.')
    const newUser = { id: crypto.randomUUID(), name, email, role, avatar: '', passwordHash: await hashPassword(password), createdAt: new Date().toISOString() }
    writeUsers([...users, newUser])
    const s = saveSession(newUser)
    setUser(s)
    return s
  }, [])

  // ── Atualizar Perfil (nome, email, avatar, senha) ──────────
  const updateProfile = useCallback(async (fields) => {
    // fields: { name?, email?, avatar?, currentPassword?, newPassword?, confirmPassword? }
    if (USE_BACKEND) {
      const { token, user: updated } = await api.users.updateProfile(fields)
      // Atualiza token JWT com novos dados
      setToken(token)
      setUser(updated)
      return updated
    }

    // Modo offline
    const currentUser = readSession()
    if (!currentUser) throw new Error('Sessão expirada. Faça login novamente.')

    const { name, email, avatar, currentPassword, newPassword, confirmPassword } = fields

    // Validações offline
    if (name !== undefined && String(name).trim().length < 2)
      throw new Error('Nome deve ter ao menos 2 caracteres.')
    if (email !== undefined && !isValidEmail(String(email).trim()))
      throw new Error('E-mail inválido.')

    const users = readUsers()
    const idx   = users.findIndex(u => u.id === currentUser.id)
    if (idx === -1) throw new Error('Usuário não encontrado.')

    // Verifica duplicidade de email (offline)
    if (email !== undefined) {
      const normalizedEmail = String(email).trim().toLowerCase()
      const conflict = users.find(u => u.email === normalizedEmail && u.id !== currentUser.id)
      if (conflict) throw new Error('Este e-mail já está em uso por outra conta.')
    }

    // Troca de senha offline
    if (newPassword) {
      if (!currentPassword) throw new Error('Informe a senha atual para trocá-la.')
      const currentHash = await hashPassword(currentPassword)
      if (users[idx].passwordHash !== currentHash) throw new Error('Senha atual incorreta.')
      if (newPassword.length < 6) throw new Error('Nova senha deve ter ao menos 6 caracteres.')
      if (newPassword !== confirmPassword) throw new Error('As novas senhas não coincidem.')
      users[idx].passwordHash = await hashPassword(newPassword)
    }

    // Atualiza campos
    if (name  !== undefined) users[idx].name  = String(name).trim()
    if (email !== undefined) users[idx].email = String(email).trim().toLowerCase()
    if (avatar!== undefined) users[idx].avatar= avatar

    writeUsers(users)

    // Atualiza sessão
    const updatedUser = { ...currentUser, ...users[idx] }
    const s = saveSession(updatedUser)
    setUser(s)
    return s
  }, [])

  // ── Redefinir senha ────────────────────────────────────────
  const resetPassword = useCallback(async (rawEmail, newPwd, confirmPwd) => {
    if (USE_BACKEND) throw new Error('Use o link de redefinição enviado por e-mail.')
    const email = String(rawEmail || '').trim().toLowerCase()
    if (!email)              throw new Error('Informe seu e-mail.')
    if (!isValidEmail(email)) throw new Error('E-mail inválido.')
    if (!newPwd || newPwd.length < 6) throw new Error('Mínimo 6 caracteres.')
    if (newPwd !== confirmPwd)        throw new Error('As senhas não coincidem.')
    const users = readUsers()
    const idx   = users.findIndex(u => u.email === email)
    if (idx === -1) throw new Error('Nenhuma conta encontrada com este e-mail.')
    users[idx].passwordHash = await hashPassword(String(newPwd))
    writeUsers(users)
  }, [])

  // ── Logout ─────────────────────────────────────────────────
  const logout = useCallback(() => {
    if (USE_BACKEND) setToken(null)
    else localStorage.removeItem(SESSION_KEY)
    setUser(null)
  }, [])

  // ── Update avatar (legado, mantido para compatibilidade) ───
  const updateAvatar = useCallback(async (avatarData) => {
    return updateProfile({ avatar: avatarData })
  }, [updateProfile])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, resetPassword, updateProfile, updateAvatar, isBackend: USE_BACKEND }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
