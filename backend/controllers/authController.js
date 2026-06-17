// ============================================================
// EduLivre — Auth Controller (Supabase)
// ============================================================
const bcrypt   = require('bcryptjs')
const jwt      = require('jsonwebtoken')
const crypto   = require('crypto')
const { supabase } = require('../models/database')
const { sendPasswordReset, sendWelcome } = require('../services/emailService')

function signToken(user) {
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )
}

function sanitizeUser(u) {
  return { id: u.id, name: u.name, email: u.email, role: u.role, avatar: u.avatar || '', createdAt: u.created_at }
}

// POST /api/auth/register
async function register(req, res) {
  try {
    const { name, email, password, role } = req.body
    if (!name || !email || !password || !role)
      return res.status(400).json({ error: 'Preencha todos os campos.' })
    if (name.trim().length < 2)
      return res.status(400).json({ error: 'Nome muito curto.' })
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(400).json({ error: 'E-mail inválido.' })
    if (password.length < 6)
      return res.status(400).json({ error: 'Senha deve ter no mínimo 6 caracteres.' })
    if (!['student', 'teacher'].includes(role))
      return res.status(400).json({ error: 'Role inválida.' })

    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .maybeSingle()
    if (existing)
      return res.status(409).json({ error: 'E-mail já cadastrado. Faça login.' })

    const passwordHash = await bcrypt.hash(password, 10)
    const { data: user, error } = await supabase
      .from('users')
      .insert({ name: name.trim(), email: email.toLowerCase(), password_hash: passwordHash, role, avatar: '' })
      .select()
      .single()

    if (error) throw error

    sendWelcome(user.email, user.name).catch(e => console.error('sendWelcome:', e.message))

    const token = signToken(user)
    res.status(201).json({ token, user: sanitizeUser(user) })
  } catch (err) {
    console.error('register error:', err)
    res.status(500).json({ error: 'Erro interno do servidor.' })
  }
}

// POST /api/auth/login
async function login(req, res) {
  try {
    const { email, password } = req.body
    if (!email || !password)
      return res.status(400).json({ error: 'Preencha todos os campos.' })

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .maybeSingle()

    if (error) throw error
    if (!user) return res.status(401).json({ error: 'E-mail não encontrado.' })

    const ok = await bcrypt.compare(password, user.password_hash)
    if (!ok) return res.status(401).json({ error: 'Senha incorreta.' })

    const token = signToken(user)
    res.json({ token, user: sanitizeUser(user) })
  } catch (err) {
    console.error('login error:', err)
    res.status(500).json({ error: 'Erro interno do servidor.' })
  }
}

// GET /api/auth/me
async function me(req, res) {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.user.id)
      .single()
    if (error || !user)
      return res.status(404).json({ error: 'Usuário não encontrado.' })
    res.json(sanitizeUser(user))
  } catch (err) {
    res.status(500).json({ error: 'Erro interno do servidor.' })
  }
}

// PUT /api/users/profile — atualiza nome, email, avatar e/ou senha
async function updateProfile(req, res) {
  try {
    const { name, email, avatar, currentPassword, newPassword, confirmPassword } = req.body
    const userId = req.user.id

    // Validações básicas
    if (name !== undefined && String(name).trim().length < 2)
      return res.status(400).json({ error: 'Nome deve ter ao menos 2 caracteres.' })

    if (email !== undefined) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim()))
        return res.status(400).json({ error: 'E-mail inválido.' })

      // Verifica duplicidade (ignora o próprio usuário)
      const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('email', String(email).trim().toLowerCase())
        .neq('id', userId)
        .maybeSingle()
      if (existing)
        return res.status(409).json({ error: 'Este e-mail já está em uso por outra conta.' })
    }

    // Busca o usuário atual (para validar senha atual se necessário)
    const { data: currentUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    if (fetchError || !currentUser)
      return res.status(404).json({ error: 'Usuário não encontrado.' })

    // Monta o objeto de atualização
    const updates = {}
    if (name  !== undefined) updates.name  = String(name).trim()
    if (email !== undefined) updates.email = String(email).trim().toLowerCase()

    // Tratar avatar
    if (avatar !== undefined) {
      if (avatar === '' || avatar === null) {
        updates.avatar = ''
      } else if (avatar.startsWith('data:image/')) {
        // Base64 → upload no Supabase Storage
        const matches = avatar.match(/^data:(image\/\w+);base64,(.+)$/)
        if (!matches) return res.status(400).json({ error: 'Formato de imagem inválido.' })

        const mimeType = matches[1]
        const ext      = mimeType.split('/')[1].replace('jpeg', 'jpg')
        const buffer   = Buffer.from(matches[2], 'base64')
        const fileName = `avatar_${userId}_${Date.now()}.${ext}`

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, buffer, { contentType: mimeType, upsert: true, cacheControl: '3600' })

        if (uploadError) {
          // Se storage não estiver configurado, salva o base64 direto
          console.warn('Storage upload falhou, salvando base64 direto:', uploadError.message)
          updates.avatar = avatar
        } else {
          const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(fileName)
          updates.avatar = urlData.publicUrl
        }
      } else {
        updates.avatar = avatar // URL direta
      }
    }

    // Troca de senha
    if (newPassword) {
      if (!currentPassword)
        return res.status(400).json({ error: 'Informe a senha atual para trocá-la.' })
      const ok = await bcrypt.compare(currentPassword, currentUser.password_hash)
      if (!ok)
        return res.status(401).json({ error: 'Senha atual incorreta.' })
      if (newPassword.length < 6)
        return res.status(400).json({ error: 'Nova senha deve ter ao menos 6 caracteres.' })
      if (newPassword !== confirmPassword)
        return res.status(400).json({ error: 'As novas senhas não coincidem.' })

      updates.password_hash = await bcrypt.hash(newPassword, 10)
    }

    if (Object.keys(updates).length === 0)
      return res.status(400).json({ error: 'Nenhuma alteração enviada.' })

    // Persiste no banco
    const { data: updated, error: updateError } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (updateError) throw updateError

    // Gera novo token com dados atualizados
    const newToken = signToken(updated)
    res.json({ token: newToken, user: sanitizeUser(updated) })
  } catch (err) {
    console.error('updateProfile error:', err)
    res.status(500).json({ error: 'Erro ao atualizar perfil.' })
  }
}

// PUT /api/auth/avatar  — mantido por compatibilidade
async function updateAvatar(req, res) {
  try {
    const { avatar } = req.body
    if (!avatar) return res.status(400).json({ error: 'Avatar é obrigatório.' })

    let avatarUrl = avatar

    if (avatar.startsWith('data:image/')) {
      const matches = avatar.match(/^data:(image\/\w+);base64,(.+)$/)
      if (!matches) return res.status(400).json({ error: 'Formato de imagem inválido.' })
      const mimeType = matches[1]
      const ext      = mimeType.split('/')[1].replace('jpeg', 'jpg')
      const buffer   = Buffer.from(matches[2], 'base64')
      const fileName = `avatar_${req.user.id}_${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, buffer, { contentType: mimeType, upsert: true, cacheControl: '3600' })

      if (uploadError) {
        console.warn('Storage upload falhou:', uploadError.message)
        avatarUrl = avatar
      } else {
        const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(fileName)
        avatarUrl = urlData.publicUrl
      }
    }

    const { error } = await supabase
      .from('users')
      .update({ avatar: avatarUrl })
      .eq('id', req.user.id)
    if (error) throw error

    res.json({ avatar: avatarUrl })
  } catch (err) {
    console.error('updateAvatar error:', err)
    res.status(500).json({ error: 'Erro ao atualizar avatar.' })
  }
}

// POST /api/auth/forgot-password
async function forgotPassword(req, res) {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ error: 'Informe seu e-mail.' })

    const { data: user } = await supabase
      .from('users')
      .select('id, name, email')
      .eq('email', email.toLowerCase())
      .maybeSingle()

    if (!user)
      return res.json({ message: 'Se o e-mail estiver cadastrado, você receberá um link em breve.' })

    const token     = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString()

    await supabase.from('password_reset_tokens')
      .update({ used: true }).eq('user_id', user.id).eq('used', false)

    await supabase.from('password_reset_tokens')
      .insert({ user_id: user.id, token, expires_at: expiresAt })

    await sendPasswordReset(user.email, user.name, token)
    res.json({ message: 'Se o e-mail estiver cadastrado, você receberá um link em breve.' })
  } catch (err) {
    console.error('forgotPassword error:', err)
    res.status(500).json({ error: 'Erro ao processar solicitação.' })
  }
}

// POST /api/auth/reset-password
async function resetPassword(req, res) {
  try {
    const { token, password, confirm } = req.body
    if (!token || !password)
      return res.status(400).json({ error: 'Token e nova senha são obrigatórios.' })
    if (password.length < 6)
      return res.status(400).json({ error: 'Senha deve ter no mínimo 6 caracteres.' })
    if (password !== confirm)
      return res.status(400).json({ error: 'As senhas não coincidem.' })

    const { data: record, error } = await supabase
      .from('password_reset_tokens')
      .select('*')
      .eq('token', token)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle()

    if (error || !record)
      return res.status(400).json({ error: 'Token inválido ou expirado.' })

    const passwordHash = await bcrypt.hash(password, 10)
    await supabase.from('users').update({ password_hash: passwordHash }).eq('id', record.user_id)
    await supabase.from('password_reset_tokens').update({ used: true }).eq('id', record.id)

    res.json({ message: 'Senha redefinida com sucesso. Faça login.' })
  } catch (err) {
    console.error('resetPassword error:', err)
    res.status(500).json({ error: 'Erro ao redefinir senha.' })
  }
}

module.exports = { register, login, me, updateProfile, updateAvatar, forgotPassword, resetPassword }
