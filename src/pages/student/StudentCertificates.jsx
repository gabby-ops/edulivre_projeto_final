import { useState, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useCourses } from '@/contexts/CoursesContext'
import { Award, Download, Star, GraduationCap, Search, Eye, Share2, Clock, User, CheckCircle, Hash, RefreshCw } from 'lucide-react'
import { generateCertificatePDF } from '@/services/pdfGenerator'
import toast from 'react-hot-toast'

const CERT_KEY = 'edulivre_certificates_v1'

function genCertId(userId, courseId) {
  const base = `EL-${userId.slice(0,4).toUpperCase()}-${courseId.slice(-4).toUpperCase()}`
  const rand = Math.random().toString(36).slice(2,6).toUpperCase()
  return `${base}-${rand}`
}

function getCertificates() {
  try { return JSON.parse(localStorage.getItem(CERT_KEY) || '{}') } catch { return {} }
}
function saveCertificates(data) { localStorage.setItem(CERT_KEY, JSON.stringify(data)) }

function getOrCreateCert(userId, courseId) {
  const all = getCertificates()
  const key = `${userId}_${courseId}`
  if (all[key]) return all[key]
  const cert = {
    id: genCertId(userId, courseId),
    userId, courseId,
    issuedAt: new Date().toISOString(),
  }
  all[key] = cert
  saveCertificates(all)
  return cert
}

function buildCertHTML({ studentName, courseName, workload, teacherName, date, certId, progress }) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Certificado — ${courseName}</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',sans-serif;background:#0a0a1a;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:20px}
.page{width:100%;max-width:960px}
.cert{background:linear-gradient(160deg,#13132e 0%,#0d0d20 50%,#111127 100%);
  border:1px solid rgba(139,92,246,0.3);border-radius:20px;padding:60px 80px;position:relative;overflow:hidden}
.cert::before{content:'';position:absolute;top:-120px;right:-120px;width:400px;height:400px;border-radius:50%;
  background:radial-gradient(circle,rgba(139,92,246,0.12) 0%,transparent 70%)}
.cert::after{content:'';position:absolute;bottom:-100px;left:-100px;width:350px;height:350px;border-radius:50%;
  background:radial-gradient(circle,rgba(16,185,129,0.08) 0%,transparent 70%)}
.inner{position:relative;z-index:1}
.top-bar{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:48px;padding-bottom:32px;
  border-bottom:1px solid rgba(255,255,255,0.07)}
.logo{display:flex;align-items:center;gap:12px}
.logo-icon{width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,#8b5cf6,#6d28d9);
  display:flex;align-items:center;justify-content:center;font-size:22px}
.logo-name{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:700;color:#fff;letter-spacing:0.03em}
.logo-sub{font-size:11px;color:#8b8aae;letter-spacing:0.1em;text-transform:uppercase;margin-top:2px}
.badge-top{display:flex;align-items:center;gap:6px;padding:8px 16px;border-radius:99px;
  background:rgba(139,92,246,0.12);border:1px solid rgba(139,92,246,0.25);
  font-size:12px;font-weight:600;color:#c4b5fd;letter-spacing:0.05em}
.title-section{text-align:center;margin-bottom:40px}
.cert-label{font-size:12px;font-weight:700;color:#10b981;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:12px}
.cert-title{font-family:'Cormorant Garamond',serif;font-size:48px;font-weight:700;color:#fff;
  line-height:1.1;margin-bottom:8px;letter-spacing:0.02em}
.cert-subtitle{font-size:15px;color:#8b8aae;line-height:1.6}
.divider{width:80px;height:2px;background:linear-gradient(90deg,#8b5cf6,#10b981);margin:24px auto;border-radius:99px}
.student-section{text-align:center;margin-bottom:40px}
.certifies-text{font-size:14px;color:#8b8aae;margin-bottom:12px;font-style:italic}
.student-name{font-family:'Cormorant Garamond',serif;font-size:44px;font-weight:700;color:#fff;
  background:linear-gradient(135deg,#a78bfa 0%,#c4b5fd 50%,#34d399 100%);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:12px}
.course-label{font-size:14px;color:#8b8aae;margin-bottom:8px}
.course-name{font-size:22px;font-weight:600;color:#e2e8f0;margin-bottom:6px}
.course-desc{font-size:13px;color:#6b7280;max-width:540px;margin:0 auto}
.meta-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin:40px 0;padding:28px;
  background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:16px}
.meta-item{text-align:center}
.meta-label{font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px}
.meta-value{font-size:15px;font-weight:600;color:#e2e8f0}
.meta-icon{font-size:20px;margin-bottom:8px}
.footer-row{display:flex;justify-content:space-between;align-items:flex-end;padding-top:32px;
  border-top:1px solid rgba(255,255,255,0.07)}
.sig-block{text-align:center}
.sig-line{width:140px;height:1px;background:rgba(255,255,255,0.15);margin:0 auto 10px}
.sig-name{font-size:14px;font-weight:600;color:#e2e8f0}
.sig-role{font-size:11px;color:#6b7280;margin-top:3px}
.qr-block{text-align:center}
.qr-box{width:64px;height:64px;border:1px solid rgba(139,92,246,0.3);border-radius:10px;
  display:flex;align-items:center;justify-content:center;background:rgba(139,92,246,0.06);
  font-size:32px;margin:0 auto 8px}
.qr-text{font-size:10px;color:#6b7280;font-family:'Inter',monospace;letter-spacing:0.05em}
.cert-id{font-size:10px;color:#4b5563;text-align:center;margin-top:24px;font-family:monospace;letter-spacing:0.1em}
.stars{display:flex;justify-content:center;gap:4px;margin-bottom:16px}
.star{color:#f59e0b;font-size:18px}
.seal{position:absolute;top:48px;right:80px;width:90px;height:90px;border-radius:50%;
  border:2px dashed rgba(16,185,129,0.4);display:flex;flex-direction:column;align-items:center;
  justify-content:center;opacity:0.6}
.seal-inner{text-align:center}
.seal-text{font-size:8px;font-weight:700;color:#10b981;text-transform:uppercase;letter-spacing:0.1em}
.seal-icon{font-size:20px;margin-bottom:4px}
@media print{body{background:#fff;padding:0}.cert{border:2px solid #333}}
</style>
</head>
<body>
<div class="page">
<div class="cert">
  <div class="inner">
    <div class="top-bar">
      <div class="logo">
        <div class="logo-icon">🎓</div>
        <div>
          <div class="logo-name">EduLivre</div>
          <div class="logo-sub">Plataforma EAD</div>
        </div>
      </div>
      <div class="badge-top">✦ Certificado Oficial de Conclusão</div>
    </div>

    <div class="stars">${'<span class="star">★</span>'.repeat(5)}</div>

    <div class="title-section">
      <div class="cert-label">Certificado de Conclusão de Curso</div>
      <h1 class="cert-title">Certificado<br>de Conclusão</h1>
    </div>
    <div class="divider"></div>

    <div class="student-section">
      <p class="certifies-text">Certificamos que</p>
      <div class="student-name">${studentName}</div>
      <p class="course-label">concluiu com êxito o curso</p>
      <div class="course-name">${courseName}</div>
    </div>

    <div class="meta-grid">
      <div class="meta-item">
        <div class="meta-icon">📅</div>
        <div class="meta-label">Data de Conclusão</div>
        <div class="meta-value">${date}</div>
      </div>
      <div class="meta-item">
        <div class="meta-icon">⏱️</div>
        <div class="meta-label">Carga Horária</div>
        <div class="meta-value">${workload || '30h'}</div>
      </div>
      <div class="meta-item">
        <div class="meta-icon">👨‍🏫</div>
        <div class="meta-label">Professor</div>
        <div class="meta-value">${teacherName || 'EduLivre'}</div>
      </div>
      <div class="meta-item">
        <div class="meta-icon">📊</div>
        <div class="meta-label">Conclusão</div>
        <div class="meta-value">${progress}%</div>
      </div>
    </div>

    <div class="footer-row">
      <div class="sig-block">
        <div class="sig-line"></div>
        <div class="sig-name">${teacherName || 'Equipe EduLivre'}</div>
        <div class="sig-role">Professor Responsável</div>
      </div>
      <div class="sig-block">
        <div class="sig-line"></div>
        <div class="sig-name">EduLivre — Plataforma EAD</div>
        <div class="sig-role">Projeto de Extensão Universitária</div>
      </div>
      <div class="qr-block">
        <div class="qr-box">▦</div>
        <div class="qr-text">Validar em edulivre.app</div>
      </div>
    </div>

    <div class="cert-id">
      ID: ${certId} &nbsp;•&nbsp; Emitido em ${date} &nbsp;•&nbsp; edulivre.app/validar/${certId}
    </div>
  </div>
</div>
</div>
</body></html>`
}

function CertCard({ course, user, certData }) {
  const [loading, setLoading] = useState(false)
  const date = new Date(certData.issuedAt).toLocaleDateString('pt-BR', { day:'2-digit', month:'long', year:'numeric' })

  const handleDownload = useCallback(() => {
    setLoading(true)
    generateCertificatePDF({
      studentName: user.name,
      courseName: course.title,
      workload: course.workload || '30h',
      teacherName: course.teacherName,
      date,
      certId: certData.id,
      category: course.category,
      level: course.level,
    })
    setTimeout(() => setLoading(false), 800)
  }, [user, course, certData, date])

  const handleShare = useCallback(() => {
    const text = `Concluí o curso "${course.title}" na plataforma EduLivre! 🎓 Certificado: ${certData.id}`
    if (navigator.share) {
      navigator.share({ title: 'Certificado EduLivre', text })
    } else {
      navigator.clipboard.writeText(text)
      toast.success('Link copiado para a área de transferência!')
    }
  }, [course, certData])

  return (
    <div className="card overflow-hidden animate-fade-up">
      {/* Preview strip */}
      <div className="relative p-6 text-center overflow-hidden" style={{
        background: 'linear-gradient(135deg,rgba(139,92,246,0.15),rgba(16,185,129,0.08))',
        borderBottom: '1px solid var(--border)'
      }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% -20%, rgba(139,92,246,0.2) 0%, transparent 70%)' }} />

        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3"
            style={{ background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)', boxShadow: '0 8px 24px rgba(139,92,246,0.4)' }}>
            <GraduationCap className="w-7 h-7 text-white" />
          </div>

          <div className="flex items-center justify-center gap-1 mb-3">
            {[...Array(5)].map((_,i) => <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}
          </div>

          <p className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-2">Certificado de Conclusão</p>
          <p className="text-xl font-display font-bold text-white mb-1">{user.name}</p>
          <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>concluiu com êxito</p>
          <p className="text-sm font-semibold text-purple-300 mb-3">{course.title}</p>

          <div className="flex items-center justify-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.workload || '30h'}</span>
            <span className="flex items-center gap-1"><User className="w-3 h-3" />{course.teacherName || 'EduLivre'}</span>
            <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-green-400" />100%</span>
          </div>
        </div>
      </div>

      {/* Meta */}
      <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
          <Hash className="w-3 h-3" />
          <span className="font-mono">{certData.id}</span>
        </div>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Emitido em {date}</p>
      </div>

      {/* Actions */}
      <div className="p-4 flex gap-2 flex-wrap">
        <button onClick={handleDownload} disabled={loading}
          className="btn-primary flex-1 py-2.5 text-sm">
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          {loading ? 'Gerando...' : 'Baixar PDF'}
        </button>
        <button onClick={handleShare} className="btn-ghost py-2.5 px-3 text-sm">
          <Share2 className="w-4 h-4" />
        </button>
        <button onClick={handleDownload} className="btn-ghost py-2.5 px-3 text-sm">
          <Eye className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default function StudentCertificates() {
  const { user } = useAuth()
  const { courses, getProgress } = useCourses()
  const [search, setSearch] = useState('')

  const completed = courses.filter(c => getProgress(user.id, c.id) === 100)
  const filtered = completed.filter(c => c.title.toLowerCase().includes(search.toLowerCase()))

  // Pre-generate certificate records for completed courses
  const certMap = {}
  completed.forEach(c => { certMap[c.id] = getOrCreateCert(user.id, c.id) })

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <div className="mb-6 animate-fade-up">
        <h1 className="font-display text-2xl font-bold text-white">Meus Certificados</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          {completed.length} certificado{completed.length !== 1 ? 's' : ''} disponível{completed.length !== 1 ? 'is' : ''}
        </p>
      </div>

      {/* Search */}
      {completed.length > 0 && (
        <div className="relative mb-6 animate-fade-up" style={{ animationDelay:'0.05s' }}>
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color:'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Buscar certificado..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-10"
          />
        </div>
      )}

      {filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-5">
          {filtered.map((course, i) => (
            <div key={course.id} style={{ animationDelay: i * 0.07 + 's' }}>
              <CertCard course={course} user={user} certData={certMap[course.id]} />
            </div>
          ))}
        </div>
      ) : completed.length === 0 ? (
        <div className="card p-12 text-center animate-fade-up">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background:'rgba(139,92,246,0.1)', border:'1px solid rgba(139,92,246,0.2)' }}>
            <Award className="w-8 h-8 text-purple-400/50" />
          </div>
          <p className="font-semibold text-white mb-2">Nenhum certificado ainda</p>
          <p className="text-sm" style={{ color:'var(--text-muted)' }}>
            Conclua 100% de um curso para liberar seu certificado profissional.
          </p>
        </div>
      ) : (
        <div className="card p-10 text-center animate-fade-up">
          <Search className="w-8 h-8 mx-auto mb-3" style={{ color:'var(--text-muted)' }} />
          <p className="text-sm" style={{ color:'var(--text-muted)' }}>Nenhum resultado para "{search}"</p>
        </div>
      )}
    </div>
  )
}
