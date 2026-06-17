// ============================================================
//  EduLivre Backend — server.js
//  Projeto de Extensão Universitária
//  Stack: Node.js + Express + JWT + bcryptjs
// ============================================================
require('dotenv').config()

const express     = require('express')
const cors        = require('cors')
const helmet      = require('helmet')
const morgan      = require('morgan')
const rateLimit   = require('express-rate-limit')

const apiRouter   = require('./routes/api')

const app  = express()
const PORT = process.env.PORT || 3001

// ── Security middleware ──────────────────────────────────────
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))

// ── Rate limiting ────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 200,
  message: { error: 'Muitas requisições. Aguarde 15 minutos.' },
})
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Muitas tentativas de login. Aguarde 15 minutos.' },
})
app.use('/api', limiter)
app.use('/api/auth/login',    authLimiter)
app.use('/api/auth/register', authLimiter)

// ── Body parser ──────────────────────────────────────────────
app.use(express.json({ limit: '5mb' }))   // 5MB for base64 avatars
app.use(express.urlencoded({ extended: true }))

// ── Logger ───────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'))
}

// ── API Routes ───────────────────────────────────────────────
app.use('/api', apiRouter)

// ── 404 handler ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Rota ${req.method} ${req.path} não encontrada.` })
})

// ── Global error handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ error: 'Erro interno do servidor.' })
})

// ── Start ────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 EduLivre Backend rodando em http://localhost:${PORT}`)
  console.log(`   Ambiente: ${process.env.NODE_ENV || 'development'}`)
  console.log(`   Frontend: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`)
  console.log(`   Health:   http://localhost:${PORT}/api/health\n`)
})

module.exports = app
