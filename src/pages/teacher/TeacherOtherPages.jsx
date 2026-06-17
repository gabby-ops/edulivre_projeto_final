// ─── Imports consolidados no topo ────────────────────────────
import { useState, useEffect, useRef, useMemo } from 'react'
import { useAuth }    from '@/contexts/AuthContext'
import { useCourses } from '@/contexts/CoursesContext'
import { useTeacher } from '@/contexts/TeacherContext'
import toast from 'react-hot-toast'
import {
  Upload, FileText, Video, CheckCircle2, Link as LinkIcon, Camera,
  Users, Search, Mail, Calendar, Download, RefreshCw,
  User, BookOpen as BookOpenIcon, BarChart3, Award, ChevronLeft, ChevronRight,
  Filter, XCircle, GraduationCap, Zap, AlertCircle, Loader2,
  Lock, Eye, EyeOff, Shield,
} from 'lucide-react'

// ─── Materials Upload ────────────────────────────────────────
export function TeacherMaterials() {
  const [tab, setTab]       = useState('video')
  const [url, setUrl]       = useState('')
  const [name, setName]     = useState('')
  const [saved, setSaved]   = useState([])
  const [success, setSuccess] = useState(false)

  function handleSave() {
    if (!url.trim() || !name.trim()) return
    setSaved(p => [...p, { type: tab, name, url, id: crypto.randomUUID() }])
    setUrl(''); setName(''); setSuccess(true)
    setTimeout(() => setSuccess(false), 2000)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6 animate-fade-up">
        <h1 className="font-display text-2xl font-bold text-white">Upload de Materiais</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Adicione vídeos e PDFs para as aulas</p>
      </div>

      <div className="card p-6 animate-fade-up" style={{ animationDelay: '0.05s' }}>
        <div className="flex gap-3 mb-6">
          {[{ val:'video', label:'Vídeo', icon: Video }, { val:'pdf', label:'PDF', icon: FileText }].map(({ val, label, icon: Icon }) => (
            <button key={val} onClick={() => setTab(val)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === val ? 'text-white' : 'text-purple-400/60 hover:text-purple-300'}`}
              style={tab === val
                ? { background:'linear-gradient(135deg,#8b5cf6,#6d28d9)', boxShadow:'0 4px 16px rgba(139,92,246,0.3)' }
                : { background:'rgba(139,92,246,0.08)', border:'1px solid rgba(139,92,246,0.15)' }}>
              <Icon className="w-4 h-4" />{label}
            </button>
          ))}
        </div>

        {success && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-xl text-sm text-emerald-400 animate-fade-in"
            style={{ background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.25)' }}>
            <CheckCircle2 className="w-4 h-4" /> Material salvo com sucesso!
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-purple-200/80 mb-1.5">Nome do material</label>
            <input className="input" placeholder="Ex: Aula 01 - Introdução" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-purple-200/80 mb-1.5">
              {tab === 'video' ? 'URL do vídeo (YouTube embed)' : 'URL do PDF'}
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400/50" />
              <input className="input pl-10"
                placeholder={tab === 'video' ? 'https://www.youtube.com/embed/...' : 'https://...'}
                value={url} onChange={e => setUrl(e.target.value)} />
            </div>
          </div>
          <button onClick={handleSave} className="btn-primary w-full h-11">
            <Upload className="w-4 h-4" /> Salvar material
          </button>
        </div>
      </div>

      {saved.length > 0 && (
        <div className="mt-5 animate-fade-up">
          <h3 className="text-sm font-semibold text-white mb-3">Materiais desta sessão</h3>
          <div className="space-y-2">
            {saved.map(m => (
              <div key={m.id} className="card p-4 flex items-center gap-3">
                {m.type === 'video'
                  ? <Video className="w-4 h-4 text-purple-400 shrink-0" />
                  : <FileText className="w-4 h-4 text-emerald-400 shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{m.name}</p>
                  <p className="text-xs truncate" style={{ color:'var(--text-muted)' }}>{m.url}</p>
                </div>
                <span className={m.type === 'video' ? 'badge-lilac' : 'badge-green'}>{m.type.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Students List (MELHORADO) ────────────────────────────────
const PAGE_SIZE = 12

export function TeacherStudents() {
  const { students, loading, error, fetchStudents, isBackend } = useTeacher()
  const { courses } = useCourses()
  const [search, setSearch]   = useState('')
  const [sortBy, setSortBy]   = useState('createdAt')
  const [sortDir, setSortDir] = useState('desc')
  const [page,    setPage]    = useState(1)

  useEffect(() => { fetchStudents(courses) }, [])

  // Filtro + ordenação
  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    const list = students.filter(s =>
      s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)
    )
    list.sort((a, b) => {
      let va = a[sortBy], vb = b[sortBy]
      if (sortBy === 'createdAt' || sortBy === 'lastAccess') {
        va = va ? new Date(va).getTime() : 0
        vb = vb ? new Date(vb).getTime() : 0
      }
      if (typeof va === 'string') va = va.toLowerCase()
      if (typeof vb === 'string') vb = vb.toLowerCase()
      if (va < vb) return sortDir === 'asc' ? -1 : 1
      if (va > vb) return sortDir === 'asc' ?  1 : -1
      return 0
    })
    return list
  }, [students, search, sortBy, sortDir])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function toggleSort(field) {
    if (sortBy === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortBy(field); setSortDir('asc') }
    setPage(1)
  }

  // Exportar CSV
  function exportCSV() {
    const header = ['Nome', 'Email', 'Cadastro', 'Último Acesso', 'Aulas Concluídas', 'Certificados', 'Média Quiz']
    const rows = filtered.map(s => [
      s.name,
      s.email,
      s.createdAt ? new Date(s.createdAt).toLocaleDateString('pt-BR') : '—',
      s.lastAccess ? new Date(s.lastAccess).toLocaleDateString('pt-BR') : '—',
      s.lessonsCompleted ?? 0,
      s.certificates ?? 0,
      s.avgQuizScore != null ? `${s.avgQuizScore}%` : '—',
    ])
    const csv = [header, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = `alunos_edulivre_${new Date().toISOString().slice(0,10)}.csv`
    a.click(); URL.revokeObjectURL(url)
  }

  function getInitials(name) { return name?.split(' ').slice(0,2).map(n => n[0]?.toUpperCase()).join('') || '?' }
  function fmtDate(iso) { return iso ? new Date(iso).toLocaleDateString('pt-BR') : '—' }

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 animate-fade-up flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Alunos Cadastrados</h1>
          <p className="text-sm mt-1" style={{ color:'var(--text-muted)' }}>
            {loading ? 'Carregando…' : `${filtered.length} aluno${filtered.length !== 1 ? 's' : ''} encontrado${filtered.length !== 1 ? 's' : ''}`}
            {isBackend && <span className="ml-2 text-emerald-400 text-xs">● Backend</span>}
            {!isBackend && <span className="ml-2 text-yellow-400 text-xs">● Offline</span>}
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={() => fetchStudents(courses)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{ background:'rgba(139,92,246,0.1)', border:'1px solid rgba(139,92,246,0.2)', color:'#a78bfa' }}
            disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Atualizar
          </button>
          <button onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{ background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.2)', color:'#34d399' }}
            disabled={filtered.length === 0}>
            <Download className="w-4 h-4" /> CSV
          </button>
        </div>
      </div>

      {/* Aviso offline */}
      {!isBackend && (
        <div className="mb-4 flex items-start gap-2 p-3 rounded-xl text-xs"
          style={{ background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.2)', color:'#fbbf24' }}>
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>Modo offline: exibindo alunos salvos localmente. Configure <code>VITE_API_URL</code> para ver alunos do banco de dados.</span>
        </div>
      )}

      {/* Erro */}
      {error && (
        <div className="mb-4 flex items-start gap-2 p-3 rounded-xl text-xs"
          style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', color:'#f87171' }}>
          <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>Erro ao carregar do backend: {error}. Exibindo dados locais.</span>
        </div>
      )}

      {/* Busca + Ordenação */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5 animate-fade-up" style={{ animationDelay:'0.05s' }}>
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400/50" />
          <input className="input pl-10" placeholder="Buscar por nome ou e-mail…"
            value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
          {search && (
            <button onClick={() => { setSearch(''); setPage(1) }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400/50 hover:text-purple-300">
              <XCircle className="w-4 h-4" />
            </button>
          )}
        </div>
        <select
          className="input sm:w-52"
          value={`${sortBy}_${sortDir}`}
          onChange={e => {
            const [f, d] = e.target.value.split('_')
            setSortBy(f); setSortDir(d); setPage(1)
          }}>
          <option value="createdAt_desc">Mais recentes</option>
          <option value="createdAt_asc">Mais antigos</option>
          <option value="name_asc">Nome A→Z</option>
          <option value="name_desc">Nome Z→A</option>
          <option value="lessonsCompleted_desc">+ Aulas concluídas</option>
          <option value="certificates_desc">+ Certificados</option>
        </select>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center py-16 animate-fade-up">
          <Loader2 className="w-10 h-10 text-purple-400 animate-spin mb-3" />
          <p className="text-sm" style={{ color:'var(--text-muted)' }}>Carregando alunos…</p>
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <div className="card p-12 text-center animate-fade-up">
          <Users className="w-12 h-12 mx-auto mb-3 text-purple-500/30" />
          <p className="text-white font-semibold mb-1">
            {search ? 'Nenhum aluno encontrado' : 'Nenhum aluno cadastrado ainda'}
          </p>
          <p className="text-sm" style={{ color:'var(--text-muted)' }}>
            {search ? 'Tente outro termo de busca.' : 'Os alunos aparecerão aqui após se cadastrarem na plataforma.'}
          </p>
        </div>
      )}

      {/* Grid de alunos */}
      {!loading && paginated.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {paginated.map((s, i) => (
            <div key={s.id} className="card p-4 sm:p-5 animate-fade-up"
              style={{ animationDelay: Math.min(i * 0.04, 0.4) + 's' }}>
              <div className="flex items-center gap-3 mb-3">
                {s.avatar
                  ? <img src={s.avatar} alt={s.name} className="w-11 h-11 rounded-full object-cover shrink-0" />
                  : <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                      style={{ background:'linear-gradient(135deg,#8b5cf6,#6d28d9)', color:'#fff' }}>
                      {getInitials(s.name)}
                    </div>
                }
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate text-sm">{s.name}</p>
                  <p className="text-xs truncate flex items-center gap-1" style={{ color:'var(--text-muted)' }}>
                    <Mail className="w-3 h-3" />{s.email}
                  </p>
                </div>
                <span className="badge-green shrink-0 text-[10px]">Aluno</span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-3 border-t" style={{ borderColor:'var(--border)' }}>
                <div className="text-center">
                  <p className="text-base font-bold text-white">{s.lessonsCompleted ?? 0}</p>
                  <p className="text-[10px]" style={{ color:'var(--text-muted)' }}>Aulas</p>
                </div>
                <div className="text-center">
                  <p className="text-base font-bold text-white">{s.certificates ?? 0}</p>
                  <p className="text-[10px]" style={{ color:'var(--text-muted)' }}>Cert.</p>
                </div>
                <div className="text-center">
                  <p className="text-base font-bold" style={{ color: s.avgQuizScore != null ? '#a78bfa' : 'var(--text-muted)' }}>
                    {s.avgQuizScore != null ? `${s.avgQuizScore}%` : '—'}
                  </p>
                  <p className="text-[10px]" style={{ color:'var(--text-muted)' }}>Quiz</p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-1 text-[10px]" style={{ color:'var(--text-muted)' }}>
                <Calendar className="w-3 h-3" />
                Cadastro: {fmtDate(s.createdAt)}
                {s.lastAccess && <span className="ml-auto">Acesso: {fmtDate(s.lastAccess)}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Paginação */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 animate-fade-up">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="p-2 rounded-lg transition-all disabled:opacity-30"
            style={{ background:'rgba(139,92,246,0.1)', border:'1px solid rgba(139,92,246,0.2)' }}>
            <ChevronLeft className="w-4 h-4 text-purple-400" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
            .reduce((acc, n, i, arr) => {
              if (i > 0 && n - arr[i-1] > 1) acc.push('…')
              acc.push(n)
              return acc
            }, [])
            .map((n, i) =>
              n === '…'
                ? <span key={`e${i}`} className="px-2 text-purple-400/40 text-sm">…</span>
                : <button key={n} onClick={() => setPage(n)}
                    className="w-8 h-8 rounded-lg text-sm font-medium transition-all"
                    style={page === n
                      ? { background:'linear-gradient(135deg,#8b5cf6,#6d28d9)', color:'#fff' }
                      : { background:'rgba(139,92,246,0.1)', border:'1px solid rgba(139,92,246,0.2)', color:'#a78bfa' }}>
                    {n}
                  </button>
            )
          }
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="p-2 rounded-lg transition-all disabled:opacity-30"
            style={{ background:'rgba(139,92,246,0.1)', border:'1px solid rgba(139,92,246,0.2)' }}>
            <ChevronRight className="w-4 h-4 text-purple-400" />
          </button>
          <span className="text-xs ml-2" style={{ color:'var(--text-muted)' }}>
            {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} de {filtered.length}
          </span>
        </div>
      )}
    </div>
  )
}

// ─── Reports (MELHORADO) ──────────────────────────────────────
export function TeacherReports() {
  const { courses } = useCourses()
  const { students, stats, fetchStats, loading } = useTeacher()

  useEffect(() => { fetchStats(courses) }, [courses])

  const data = stats || {
    totalStudents: students.length,
    activeStudents: students.length,
    totalCourses: courses.length,
    totalLessons: courses.reduce((a, c) => a + (c.lessons?.length || 0), 0),
    totalCertificates: 0,
    avgQuizScore: 0,
    totalQuizzes: 0,
  }

  const byCategory = courses.reduce((acc, c) => {
    acc[c.category] = (acc[c.category] || 0) + 1
    return acc
  }, {})

  const statsCards = [
    { label:'Total de alunos',    value: data.totalStudents,    color:'#8b5cf6', icon: Users },
    { label:'Alunos ativos',      value: data.activeStudents,   color:'#10b981', icon: Zap },
    { label:'Total de cursos',    value: data.totalCourses,     color:'#06b6d4', icon: BookOpenIcon },
    { label:'Total de aulas',     value: data.totalLessons,     color:'#f59e0b', icon: GraduationCap },
    { label:'Certificados',       value: data.totalCertificates,color:'#a855f7', icon: Award },
    { label:'Média dos quizzes',  value: data.avgQuizScore ? `${data.avgQuizScore}%` : '—', color:'#ec4899', icon: BarChart3 },
  ]

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <div className="mb-6 animate-fade-up flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Relatórios</h1>
          <p className="text-sm mt-1" style={{ color:'var(--text-muted)' }}>Dados reais da plataforma</p>
        </div>
        <button onClick={() => fetchStats(courses)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm"
          style={{ background:'rgba(139,92,246,0.1)', border:'1px solid rgba(139,92,246,0.2)', color:'#a78bfa' }}>
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {statsCards.map((s, i) => (
          <div key={s.label} className="card p-4 sm:p-5 animate-fade-up"
            style={{ animationDelay: i * 0.04 + 's' }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: s.color + '18' }}>
                <s.icon className="w-4 h-4" style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-2xl font-display font-bold" style={{ color: s.color }}>{s.value}</p>
                <p className="text-xs" style={{ color:'var(--text-muted)' }}>{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Por categoria */}
      {Object.keys(byCategory).length > 0 && (
        <div className="card p-5 sm:p-6 animate-fade-up mb-5" style={{ animationDelay:'0.25s' }}>
          <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <BookOpenIcon className="w-4 h-4 text-purple-400" /> Cursos por Categoria
          </h2>
          <div className="space-y-3">
            {Object.entries(byCategory).sort((a,b) => b[1]-a[1]).map(([cat, count]) => {
              const pct = Math.round((count / courses.length) * 100)
              return (
                <div key={cat}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/80">{cat}</span>
                    <span style={{ color:'var(--text-muted)' }}>{count} curso{count !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background:'rgba(139,92,246,0.1)' }}>
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, background:'linear-gradient(90deg,#8b5cf6,#a855f7)' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Cursos recentes */}
      <div className="card p-5 sm:p-6 animate-fade-up" style={{ animationDelay:'0.30s' }}>
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-cyan-400" /> Cursos por Aulas
        </h2>
        {courses.length === 0
          ? <p className="text-sm text-center py-6" style={{ color:'var(--text-muted)' }}>Nenhum curso criado ainda.</p>
          : <div className="space-y-3">
              {courses.slice(0, 8).sort((a, b) => b.lessons.length - a.lessons.length).map(c => (
                <div key={c.id} className="flex items-center gap-3">
                  <span className="text-xl w-8 text-center shrink-0">{c.thumbnail}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{c.title}</p>
                    <div className="h-1.5 rounded-full mt-1 overflow-hidden" style={{ background:'rgba(139,92,246,0.1)' }}>
                      <div className="h-full rounded-full" style={{ width: `${Math.min(100, (c.lessons.length / 10) * 100)}%`, background: c.color }} />
                    </div>
                  </div>
                  <span className="text-xs shrink-0 font-mono" style={{ color:'var(--text-muted)' }}>{c.lessons.length}✓</span>
                </div>
              ))}
            </div>
        }
      </div>
    </div>
  )
}

// ─── Profile ──────────────────────────────────────────────────
// ─── Teacher Profile (COMPLETO) ──────────────────────────────
export function TeacherProfile() {
  const { user, updateProfile, isBackend } = useAuth()
  const fileRef = useRef()

  const [name,            setName]            = useState('')
  const [email,           setEmail]           = useState('')
  const [avatarPreview,   setAvatarPreview]   = useState(null)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword,     setNewPassword]     = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving,          setSaving]          = useState(false)
  const [activeTab,       setActiveTab]       = useState('info')
  const [showCurrent,     setShowCurrent]     = useState(false)
  const [showNew,         setShowNew]         = useState(false)
  const [showConfirm,     setShowConfirm]     = useState(false)

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

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 3 * 1024 * 1024) { toast.error('Imagem muito grande. Máx 3MB.'); return }
    const reader = new FileReader()
    reader.onload = ev => setAvatarPreview(ev.target.result)
    reader.readAsDataURL(file)
  }

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
        setSaving(false)
        return
      }

      await updateProfile(payload)
      setAvatarPreview(null)
      if (fileRef.current) fileRef.current.value = ''
      toast.success('Perfil atualizado com sucesso!')
    } catch (err) {
      toast.error(err.message || 'Erro ao salvar perfil.')
    } finally {
      setSaving(false)
    }
  }

  async function handleSaveSenha(e) {
    e.preventDefault()
    if (!currentPassword) { toast.error('Informe sua senha atual.'); return }
    if (!newPassword)     { toast.error('Informe a nova senha.'); return }
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

  const memberDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    : '—'

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6 animate-fade-up">
        <h1 className="font-display text-2xl font-bold text-white">Meu Perfil</h1>
        <p className="text-sm mt-1 flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
          Gerencie suas informações de professor
          {isBackend
            ? <span className="text-[10px] text-emerald-400 font-medium">● Sincronizado com banco de dados</span>
            : <span className="text-[10px] text-yellow-400 font-medium">● Modo offline</span>
          }
        </p>
      </div>

      {/* Avatar card */}
      <div className="card p-6 sm:p-8 text-center mb-5 animate-fade-up" style={{ animationDelay: '0.05s' }}>
        <div className="relative inline-block group cursor-pointer" onClick={() => fileRef.current?.click()}>
          {displayAvatar
            ? <img src={displayAvatar} alt="avatar"
                className="w-24 h-24 rounded-full object-cover border-4 mx-auto"
                style={{ borderColor: 'rgba(16,185,129,0.4)', boxShadow: '0 8px 32px rgba(16,185,129,0.3)' }} />
            : <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold border-4 mx-auto"
                style={{ background: 'linear-gradient(135deg,#10b981,#059669)', color: '#fff',
                  borderColor: 'rgba(16,185,129,0.4)', boxShadow: '0 8px 32px rgba(16,185,129,0.3)' }}>
                {getInitials(user?.name)}
              </div>
          }
          <div className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: 'rgba(0,0,0,0.55)' }}>
            <Camera className="w-6 h-6 text-white" />
          </div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

        {avatarPreview
          ? <p className="text-xs mt-2 text-emerald-400">Nova foto selecionada — salve para confirmar.</p>
          : <button onClick={() => fileRef.current?.click()}
              className="mt-2 text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 mx-auto transition-colors">
              <Camera className="w-3 h-3" /> Alterar foto
            </button>
        }

        <h2 className="font-display text-xl font-bold text-white mt-4 mb-1">{user?.name}</h2>
        <span className="badge-green text-xs">Professor</span>
        <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>Membro desde {memberDate}</p>
      </div>

      {/* Abas */}
      <div className="flex gap-2 mb-4 animate-fade-up" style={{ animationDelay: '0.10s' }}>
        {[
          { key: 'info',  label: 'Informações', icon: User   },
          { key: 'senha', label: 'Senha',        icon: Shield },
        ].map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={activeTab === key
              ? { background: 'linear-gradient(135deg,#10b981,#059669)', color: '#fff', boxShadow: '0 4px 16px rgba(16,185,129,0.3)' }
              : { background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)', color: 'rgba(16,185,129,0.7)' }}>
            <Icon className="w-4 h-4" />{label}
          </button>
        ))}
      </div>

      {/* ─── Aba: Informações ─── */}
      {activeTab === 'info' && (
        <form onSubmit={handleSaveInfo}
          className="card p-5 sm:p-6 space-y-4 animate-fade-up" style={{ animationDelay: '0.12s' }}>
          <div>
            <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
              <User className="w-3.5 h-3.5" /> Nome completo
            </label>
            <input className="input" value={name} onChange={e => setName(e.target.value)}
              placeholder="Seu nome completo" disabled={saving} required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
              <Mail className="w-3.5 h-3.5" /> E-mail
            </label>
            <input type="email" className="input" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com" disabled={saving} required />
            {isBackend && (
              <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>
                Alterar o e-mail pode exigir novo login.
              </p>
            )}
          </div>

          <button type="submit" disabled={saving}
            className="w-full h-11 flex items-center justify-center gap-2 rounded-xl font-medium text-sm text-white transition-all"
            style={{ background: 'linear-gradient(135deg,#10b981,#059669)', boxShadow: saving ? 'none' : '0 4px 16px rgba(16,185,129,0.3)' }}>
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

      {/* ─── Aba: Senha ─── */}
      {activeTab === 'senha' && (
        <form onSubmit={handleSaveSenha}
          className="card p-5 sm:p-6 space-y-4 animate-fade-up" style={{ animationDelay: '0.12s' }}>
          {[
            { label: 'Senha atual',        val: currentPassword, set: setCurrentPassword, show: showCurrent, setShow: setShowCurrent, ph: 'Sua senha atual' },
            { label: 'Nova senha',         val: newPassword,     set: setNewPassword,     show: showNew,     setShow: setShowNew,     ph: 'Nova senha (mín. 6 caracteres)' },
            { label: 'Confirmar nova senha', val: confirmPassword, set: setConfirmPassword, show: showConfirm, setShow: setShowConfirm, ph: 'Repita a nova senha' },
          ].map(({ label, val, set, show, setShow, ph }) => (
            <div key={label}>
              <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                <Lock className="w-3.5 h-3.5" /> {label}
              </label>
              <div className="relative">
                <input type={show ? 'text' : 'password'} className="input pr-10"
                  value={val} onChange={e => set(e.target.value)} placeholder={ph}
                  disabled={saving} autoComplete="new-password" />
                <button type="button" onClick={() => setShow(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400/50 hover:text-purple-300 transition-colors">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}

          <button type="submit" disabled={saving}
            className="w-full h-11 flex items-center justify-center gap-2 rounded-xl font-medium text-sm text-white transition-all"
            style={{ background: 'linear-gradient(135deg,#10b981,#059669)', boxShadow: saving ? 'none' : '0 4px 16px rgba(16,185,129,0.3)' }}>
            {saving
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Salvando…</>
              : <><Shield className="w-4 h-4" /> Alterar Senha</>
            }
          </button>
        </form>
      )}
    </div>
  )
}
