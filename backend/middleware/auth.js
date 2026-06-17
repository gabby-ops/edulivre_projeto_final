const jwt = require('jsonwebtoken')

/**
 * Middleware — verifica JWT no header Authorization: Bearer <token>
 * Injeta req.user = { id, name, email, role }
 */
function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  if (!header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não fornecido. Faça login.' })
  }
  const token = header.slice(7)
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = payload
    next()
  } catch (err) {
    const msg = err.name === 'TokenExpiredError' ? 'Sessão expirada. Faça login novamente.' : 'Token inválido.'
    return res.status(401).json({ error: msg })
  }
}

/**
 * Middleware — verifica role específica
 * Uso: requireRole('teacher')
 */
function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Não autenticado.' })
    if (req.user.role !== role) return res.status(403).json({ error: 'Acesso negado. Permissão insuficiente.' })
    next()
  }
}

module.exports = { requireAuth, requireRole }
