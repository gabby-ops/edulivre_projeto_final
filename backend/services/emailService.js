// ============================================================
// EduLivre — Email Service (Nodemailer)
// ============================================================
const nodemailer = require('nodemailer')

function createTransport() {
  const host = process.env.SMTP_HOST
  if (!host) {
    console.warn('⚠️  SMTP não configurado — e-mails serão logados no console (dev).')
    return null
  }
  return nodemailer.createTransport({
    host,
    port:   parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

const FROM    = process.env.SMTP_FROM    || 'EduLivre <noreply@edulivre.com>'
const APP_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

async function sendPasswordReset(toEmail, toName, token) {
  const transport = createTransport()
  const link = `${APP_URL}/recuperar-senha?token=${token}`

  if (!transport) {
    console.log(`\n📧 [DEV] Reset link para ${toEmail}:\n   ${link}\n`)
    return { messageId: 'dev-mode', previewLink: link }
  }

  const info = await transport.sendMail({
    from: FROM,
    to: `${toName} <${toEmail}>`,
    subject: 'EduLivre — Redefinição de senha',
    html: `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:'Segoe UI',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 16px;">
<table width="560" cellpadding="0" cellspacing="0" style="background:#1e293b;border-radius:16px;border:1px solid #334155;">
<tr><td style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:32px;text-align:center;border-radius:16px 16px 0 0;">
<h1 style="color:#fff;margin:0;font-size:28px;">📚 EduLivre</h1>
<p style="color:#c4b5fd;margin:8px 0 0;font-size:14px;">Plataforma de Educação Livre</p></td></tr>
<tr><td style="padding:40px 32px;">
<p style="color:#e2e8f0;font-size:16px;margin:0 0 16px;">Olá, <strong>${toName}</strong>!</p>
<p style="color:#94a3b8;font-size:15px;margin:0 0 32px;line-height:1.6;">Recebemos uma solicitação para redefinir a senha da sua conta. Clique no botão abaixo para criar uma nova senha.</p>
<div style="text-align:center;margin:0 0 32px;">
<a href="${link}" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;text-decoration:none;font-weight:600;font-size:16px;padding:14px 32px;border-radius:10px;">Redefinir minha senha</a>
</div>
<p style="color:#64748b;font-size:13px;margin:0;text-align:center;">Este link expira em <strong style="color:#94a3b8;">1 hora</strong>. Se você não solicitou, ignore este e-mail.</p>
</td></tr>
<tr><td style="background:#0f172a;padding:20px 32px;text-align:center;border-top:1px solid #1e293b;border-radius:0 0 16px 16px;">
<p style="color:#475569;font-size:12px;margin:0;">© ${new Date().getFullYear()} EduLivre · Plataforma de Extensão Universitária</p>
</td></tr></table></td></tr></table></body></html>`,
    text: `Olá ${toName}!\n\nRedefinição de senha (expira em 1 hora):\n${link}\n\nSe não solicitou, ignore este e-mail.`,
  })
  return { messageId: info.messageId }
}

async function sendWelcome(toEmail, toName) {
  const transport = createTransport()
  if (!transport) {
    console.log(`\n📧 [DEV] Boas-vindas enviado para ${toName} (${toEmail})`)
    return
  }
  await transport.sendMail({
    from: FROM,
    to: `${toName} <${toEmail}>`,
    subject: 'Bem-vindo ao EduLivre! 🎓',
    html: `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:'Segoe UI',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 16px;">
<table width="560" cellpadding="0" cellspacing="0" style="background:#1e293b;border-radius:16px;border:1px solid #334155;">
<tr><td style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:32px;text-align:center;border-radius:16px 16px 0 0;">
<h1 style="color:#fff;margin:0;font-size:28px;">📚 EduLivre</h1></td></tr>
<tr><td style="padding:40px 32px;">
<p style="color:#e2e8f0;font-size:16px;margin:0 0 16px;">Olá, <strong>${toName}</strong>! 🎉</p>
<p style="color:#94a3b8;font-size:15px;margin:0 0 24px;line-height:1.6;">Sua conta foi criada com sucesso. Acesse a plataforma e comece a aprender!</p>
<div style="text-align:center;">
<a href="${APP_URL}/login" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;text-decoration:none;font-weight:600;font-size:16px;padding:14px 32px;border-radius:10px;">Acessar EduLivre</a>
</div></td></tr>
<tr><td style="background:#0f172a;padding:20px 32px;text-align:center;border-top:1px solid #1e293b;border-radius:0 0 16px 16px;">
<p style="color:#475569;font-size:12px;margin:0;">© ${new Date().getFullYear()} EduLivre</p>
</td></tr></table></td></tr></table></body></html>`,
  })
}

module.exports = { sendPasswordReset, sendWelcome }
