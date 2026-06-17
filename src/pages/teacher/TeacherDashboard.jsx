import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useCourses } from '@/contexts/CoursesContext'
import { useTeacher } from '@/contexts/TeacherContext'
import { Link } from 'react-router-dom'
import { BookOpen, Users, PlayCircle, Award, BarChart3, GraduationCap, Zap, PlusCircle, ArrowRight, RefreshCw } from 'lucide-react'

function StatCard({ icon: Icon, label, value, color, delay }) {
  return (
    <div className="card p-4 sm:p-5 animate-fade-up" style={{ animationDelay: delay }}>
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: color + '18', border: `1px solid ${color}30` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div className="min-w-0">
          <p className="text-xl sm:text-2xl font-display font-bold text-white">{value}</p>
          <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>{label}</p>
        </div>
      </div>
    </div>
  )
}

export default function TeacherDashboard() {
  const { user } = useAuth()
  const { courses } = useCourses()
  const { students, stats, loading, fetchStudents, fetchStats } = useTeacher()

  useEffect(() => {
    fetchStudents(courses)
    fetchStats(courses)
  }, [])

  const totalLessons = courses.reduce((a, c) => a + (c.lessons?.length || 0), 0)
  const statsData = stats || {
    totalStudents:    students.length,
    totalCertificates: 0,
    avgQuizScore:      0,
    totalQuizzes:      0,
  }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'
  const avatar = user?.avatar || localStorage.getItem(`edulivre_avatar_${user?.id}`) || ''
  function getInitials(n) { return n?.split(' ').slice(0,2).map(x => x[0]?.toUpperCase()).join('') || '?' }

  const QUICK_ACTIONS = [
    {
      to: '/professor/adicionar-curso', label: 'Criar novo curso',
      sub: 'Adicione conteúdo à plataforma', icon: PlusCircle,
      bg: 'linear-gradient(135deg,rgba(139,92,246,0.14),rgba(109,40,217,0.08))',
      iconBg: 'linear-gradient(135deg,#8b5cf6,#6d28d9)',
      iconShadow: '0 4px 16px rgba(139,92,246,0.4)', arrowColor: 'text-purple-400'
    },
    {
      to: '/professor/gerenciar', label: 'Gerenciar cursos',
      sub: `${courses.length} curso${courses.length !== 1 ? 's' : ''} ativo${courses.length !== 1 ? 's' : ''}`, icon: BookOpen,
      bg: 'linear-gradient(135deg,rgba(6,182,212,0.10),rgba(8,145,178,0.06))',
      iconBg: 'linear-gradient(135deg,#06b6d4,#0891b2)',
      iconShadow: '0 4px 16px rgba(6,182,212,0.4)', arrowColor: 'text-cyan-400'
    },
    {
      to: '/professor/alunos', label: 'Ver alunos',
      sub: `${statsData.totalStudents} aluno${statsData.totalStudents !== 1 ? 's' : ''} cadastrado${statsData.totalStudents !== 1 ? 's' : ''}`, icon: Users,
      bg: 'linear-gradient(135deg,rgba(16,185,129,0.10),rgba(5,150,105,0.06))',
      iconBg: 'linear-gradient(135deg,#10b981,#059669)',
      iconShadow: '0 4px 16px rgba(16,185,129,0.4)', arrowColor: 'text-emerald-400'
    },
    {
      to: '/professor/relatorios', label: 'Relatórios',
      sub: 'Desempenho da plataforma', icon: BarChart3,
      bg: 'linear-gradient(135deg,rgba(245,158,11,0.10),rgba(217,119,6,0.06))',
      iconBg: 'linear-gradient(135deg,#f59e0b,#d97706)',
      iconShadow: '0 4px 16px rgba(245,158,11,0.4)', arrowColor: 'text-amber-400'
    },
  ]

  return (
    <div className="p-3 sm:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8 animate-fade-up flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="shrink-0">
            {avatar
              ? <img src={avatar} alt="avatar" className="w-12 h-12 rounded-full object-cover border-2" style={{ borderColor:'rgba(16,185,129,0.4)' }} />
              : <div className="w-12 h-12 rounded-full flex items-center justify-center text-base font-bold"
                  style={{ background:'linear-gradient(135deg,#10b981,#059669)', color:'#fff' }}>
                  {getInitials(user?.name)}
                </div>
            }
          </div>
          <div>
            <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-white">
              {greeting}, Prof. {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="mt-0.5 text-sm" style={{ color: 'var(--text-muted)' }}>
              Gerencie seus cursos e acompanhe o crescimento da plataforma.
            </p>
          </div>
        </div>
        <button onClick={() => { fetchStudents(courses); fetchStats(courses) }}
          className="shrink-0 p-2 rounded-xl transition-all"
          style={{ background:'rgba(139,92,246,0.1)', border:'1px solid rgba(139,92,246,0.2)' }}
          title="Atualizar dados">
          <RefreshCw className={`w-4 h-4 text-purple-400 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Stats principais */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <StatCard icon={BookOpen}   label="Cursos criados"  value={courses.length}              color="#8b5cf6" delay="0.05s" />
        <StatCard icon={PlayCircle} label="Total de aulas"  value={totalLessons}                color="#06b6d4" delay="0.10s" />
        <StatCard icon={Users}      label="Alunos"          value={statsData.totalStudents}     color="#10b981" delay="0.15s" />
        <StatCard icon={Award}      label="Certificados"    value={statsData.totalCertificates} color="#f59e0b" delay="0.20s" />
      </div>

      {/* Stats secundárias */}
      <div className="grid grid-cols-2 gap-3 mb-6 sm:mb-8 animate-fade-up" style={{ animationDelay:'0.22s' }}>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background:'rgba(236,72,153,0.15)' }}>
            <GraduationCap className="w-4 h-4 text-pink-400" />
          </div>
          <div>
            <p className="text-lg font-bold text-white">{statsData.totalQuizzes}</p>
            <p className="text-[10px] sm:text-xs" style={{ color:'var(--text-muted)' }}>Quizzes realizados</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background:'rgba(99,102,241,0.15)' }}>
            <Zap className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <p className="text-lg font-bold text-white">{statsData.avgQuizScore ? `${statsData.avgQuizScore}%` : '—'}</p>
            <p className="text-[10px] sm:text-xs" style={{ color:'var(--text-muted)' }}>Média dos quizzes</p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mb-6 sm:mb-8 animate-fade-up" style={{ animationDelay:'0.25s' }}>
        <h2 className="text-base sm:text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-400" /> Ações rápidas
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {QUICK_ACTIONS.map(({ to, label, sub, icon: Icon, bg, iconBg, iconShadow, arrowColor }) => (
            <Link key={to} to={to}
              className="card p-4 sm:p-5 hover:scale-[1.01] active:scale-[0.99] transition-transform flex items-center gap-4 group"
              style={{ background: bg }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: iconBg, boxShadow: iconShadow }}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm">{label}</p>
                <p className="text-xs mt-0.5 truncate" style={{ color:'var(--text-muted)' }}>{sub}</p>
              </div>
              <ArrowRight className={`w-4 h-4 ${arrowColor} group-hover:translate-x-1 transition-transform shrink-0`} />
            </Link>
          ))}
        </div>
      </div>

      {/* Cursos recentes */}
      <div className="animate-fade-up" style={{ animationDelay:'0.30s' }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" /> Cursos recentes
          </h2>
          <Link to="/professor/gerenciar" className="text-sm text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
            Ver todos →
          </Link>
        </div>

        {courses.length > 0 ? (
          <div className="space-y-2">
            {courses.slice(0, 6).map(c => (
              <div key={c.id} className="card p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{ background: c.color + '22', border: `1px solid ${c.color}33` }}>{c.thumbnail}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-sm truncate">{c.title}</p>
                  <p className="text-xs" style={{ color:'var(--text-muted)' }}>
                    {c.lessons.length} aulas · {c.category} · {c.workload || '—'}
                  </p>
                </div>
                <span className="hidden sm:block text-[10px] font-semibold px-2 py-0.5 rounded"
                  style={{ background:'rgba(16,185,129,0.12)', color:'#34d399', border:'1px solid rgba(16,185,129,0.25)' }}>
                  Ativo
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-8 sm:p-10 text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background:'rgba(139,92,246,0.1)', border:'1px solid rgba(139,92,246,0.2)' }}>
              <BookOpen className="w-7 h-7 text-purple-400/50" />
            </div>
            <p className="font-semibold text-white mb-1">Nenhum curso criado ainda</p>
            <p className="text-sm mb-4" style={{ color:'var(--text-muted)' }}>Comece criando seu primeiro curso para os alunos.</p>
            <Link to="/professor/adicionar-curso" className="btn-primary px-5 py-2.5 text-sm inline-flex">
              <PlusCircle className="w-4 h-4" /> Criar primeiro curso
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
