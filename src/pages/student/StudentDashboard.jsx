import { useAuth } from '@/contexts/AuthContext'
import { useCourses } from '@/contexts/CoursesContext'
import { Link } from 'react-router-dom'
import { BookOpen, Award, PlayCircle, TrendingUp, HelpCircle, Zap } from 'lucide-react'

function StatCard({ icon: Icon, label, value, color, delay }) {
  return (
    <div className="card p-4 sm:p-5 animate-fade-up" style={{ animationDelay: delay }}>
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: color + '18', border: `1px solid ${color}30` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div>
          <p className="text-xl sm:text-2xl font-display font-bold text-white">{value}</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
        </div>
      </div>
    </div>
  )
}

const QUIZ_KEY = 'edulivre_quiz_v1'
function getQuizResult(userId, courseId) {
  try { const all = JSON.parse(localStorage.getItem(QUIZ_KEY) || '{}'); return all[`${userId}_${courseId}`] || null }
  catch { return null }
}

export default function StudentDashboard() {
  const { user } = useAuth()
  const { courses, getProgress } = useCourses()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'

  const completed  = courses.filter(c => getProgress(user.id, c.id) === 100).length
  const inProgress = courses.filter(c => { const p = getProgress(user.id, c.id); return p > 0 && p < 100 }).length
  const totalLessons = courses.reduce((a, c) => a + c.lessons.length, 0)

  const AVATAR_KEY = `edulivre_avatar_${user?.id}`
  const avatar = typeof window !== 'undefined' ? localStorage.getItem(AVATAR_KEY) || '' : ''

  function getInitials(n) { return n?.split(' ').slice(0,2).map(x => x[0]?.toUpperCase()).join('') || '?' }

  return (
    <div className="p-3 sm:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8 animate-fade-up flex items-center gap-4">
        <div className="shrink-0">
          {avatar
            ? <img src={avatar} alt="avatar" className="w-12 h-12 rounded-full object-cover border-2" style={{ borderColor:'rgba(139,92,246,0.4)' }} />
            : <div className="w-12 h-12 rounded-full flex items-center justify-center text-base font-bold"
                style={{ background:'linear-gradient(135deg,#8b5cf6,#6d28d9)', color:'#fff' }}>
                {getInitials(user?.name)}
              </div>
          }
        </div>
        <div>
          <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-white">
            {greeting}, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="mt-0.5 text-sm" style={{ color: 'var(--text-muted)' }}>
            Continue seu aprendizado — o conhecimento te espera.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <StatCard icon={BookOpen}   label="Cursos"       value={courses.length} color="#8b5cf6" delay="0.05s" />
        <StatCard icon={TrendingUp} label="Em progresso" value={inProgress}     color="#f59e0b" delay="0.10s" />
        <StatCard icon={Award}      label="Concluídos"   value={completed}      color="#10b981" delay="0.15s" />
        <StatCard icon={PlayCircle} label="Aulas totais" value={totalLessons}   color="#06b6d4" delay="0.20s" />
      </div>

      {/* Continue learning */}
      {inProgress > 0 && (
        <div className="mb-6 sm:mb-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-base sm:text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" /> Continuar aprendendo
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {courses.filter(c => { const p = getProgress(user.id, c.id); return p > 0 && p < 100 }).slice(0,4).map(course => {
              const pct = getProgress(user.id, course.id)
              const qr = getQuizResult(user.id, course.id)
              return (
                <Link key={course.id} to="/aluno/aulas" state={{ courseId: course.id }}
                  className="card p-4 sm:p-5 hover:scale-[1.01] active:scale-[0.99] transition-transform block">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0"
                      style={{ background: course.color + '22', border: `1px solid ${course.color}33` }}>{course.thumbnail}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white text-sm truncate">{course.title}</p>
                      <p className="text-xs mb-2.5" style={{ color: 'var(--text-muted)' }}>{course.category}</p>
                      <div className="progress-bar"><div className="progress-fill" style={{ width: pct + '%' }} /></div>
                      <div className="flex items-center justify-between mt-1.5">
                        <p className="text-xs text-purple-400 font-medium">{pct}% concluído</p>
                        {qr && <span className="text-xs text-green-400 flex items-center gap-1"><HelpCircle className="w-3 h-3" />Quiz ✓</span>}
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* All courses */}
      <div className="animate-fade-up" style={{ animationDelay: '0.25s' }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" /> Todos os cursos
          </h2>
          <Link to="/aluno/cursos" className="text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors">
            Ver todos →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {courses.slice(0, 8).map(course => {
            const pct = getProgress(user.id, course.id)
            return (
              <Link key={course.id} to="/aluno/aulas" state={{ courseId: course.id }}
                className="card p-4 hover:scale-[1.01] active:scale-[0.99] transition-transform block">
                <div className="text-2xl sm:text-3xl mb-2">{course.thumbnail}</div>
                <p className="font-semibold text-white text-xs sm:text-sm mb-1 leading-snug line-clamp-2">{course.title}</p>
                <p className="text-[10px] sm:text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{course.lessons.length} aulas</p>
                <div className="progress-bar h-1"><div className="progress-fill" style={{ width: pct + '%' }} /></div>
                <p className="text-[10px] sm:text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{pct}%</p>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
