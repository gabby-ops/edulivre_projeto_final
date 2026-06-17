import { useAuth } from '@/contexts/AuthContext'
import { useCourses } from '@/contexts/CoursesContext'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, Award, BookOpen, Clock, HelpCircle, PlayCircle, CheckCircle } from 'lucide-react'

const QUIZ_KEY = 'edulivre_quiz_v1'
function getQuizResult(userId, courseId) {
  try { const all = JSON.parse(localStorage.getItem(QUIZ_KEY) || '{}'); return all[`${userId}_${courseId}`] || null } catch { return null }
}

export default function StudentProgress() {
  const { user } = useAuth()
  const { courses, getProgress, getLessonsDone } = useCourses()
  const navigate = useNavigate()

  const stats = {
    total: courses.length,
    completed: courses.filter(c => getProgress(user.id, c.id) === 100).length,
    inProgress: courses.filter(c => { const p = getProgress(user.id, c.id); return p > 0 && p < 100 }).length,
    notStarted: courses.filter(c => getProgress(user.id, c.id) === 0).length,
  }
  const totalLessons = courses.reduce((a,c) => a + c.lessons.length, 0)
  const doneLessons  = courses.reduce((a,c) => a + getLessonsDone(user.id, c.id).length, 0)
  const overallPct = totalLessons > 0 ? Math.round((doneLessons / totalLessons) * 100) : 0

  const inProgressCourses = courses.filter(c => { const p = getProgress(user.id, c.id); return p > 0 && p < 100 })
  const completedCourses  = courses.filter(c => getProgress(user.id, c.id) === 100)
  const newCourses        = courses.filter(c => getProgress(user.id, c.id) === 0)

  function CourseRow({ course }) {
    const pct = getProgress(user.id, course.id)
    const done = getLessonsDone(user.id, course.id)
    const qr = getQuizResult(user.id, course.id)

    return (
      <div className="card p-4 flex items-center gap-3 sm:gap-4 hover:scale-[1.005] transition-transform cursor-pointer"
        onClick={() => navigate('/aluno/aulas', { state: { courseId: course.id } })}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
          style={{ background: course.color + '22', border: `1px solid ${course.color}33` }}>{course.thumbnail}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">{course.title}</p>
          <div className="flex items-center gap-3 mt-0.5 mb-2 text-xs" style={{ color:'var(--text-muted)' }}>
            <span>{course.category}</span>
            <span>{done.length}/{course.lessons.length} aulas</span>
            {qr && <span className="text-green-400 flex items-center gap-1"><HelpCircle className="w-2.5 h-2.5" />{Math.round((qr.score/qr.total)*100)}%</span>}
          </div>
          <div className="progress-bar h-1.5"><div className="progress-fill" style={{ width: pct + '%' }} /></div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-sm font-bold" style={{ color: pct === 100 ? '#10b981' : '#a78bfa' }}>{pct}%</p>
          {pct === 100 && <CheckCircle className="w-4 h-4 text-green-400 mx-auto mt-0.5" />}
        </div>
      </div>
    )
  }

  return (
    <div className="p-3 sm:p-6 max-w-5xl mx-auto">
      <div className="mb-5 animate-fade-up">
        <h1 className="font-display text-2xl font-bold text-white">Meu Progresso</h1>
        <p className="text-sm mt-1" style={{ color:'var(--text-muted)' }}>Acompanhe sua evolução em todos os cursos</p>
      </div>

      {/* Overall progress */}
      <div className="card p-5 sm:p-6 mb-5 animate-fade-up" style={{ animationDelay:'0.05s' }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-semibold text-white">Progresso Geral</p>
            <p className="text-xs mt-0.5" style={{ color:'var(--text-muted)' }}>{doneLessons} de {totalLessons} aulas concluídas</p>
          </div>
          <span className="text-3xl font-display font-bold text-purple-400">{overallPct}%</span>
        </div>
        <div className="progress-bar h-3">
          <div className="progress-fill" style={{ width: overallPct + '%' }} />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 animate-fade-up" style={{ animationDelay:'0.08s' }}>
        {[
          { v: stats.total,       l:'Total', icon: BookOpen,   color:'#8b5cf6' },
          { v: stats.inProgress,  l:'Em andamento', icon: TrendingUp, color:'#f59e0b' },
          { v: stats.completed,   l:'Concluídos', icon: Award, color:'#10b981' },
          { v: doneLessons,       l:'Aulas feitas', icon: PlayCircle, color:'#06b6d4' },
        ].map(({ v, l, icon: Icon, color }) => (
          <div key={l} className="card p-3 sm:p-4 text-center">
            <Icon className="w-4 h-4 mx-auto mb-1.5" style={{ color }} />
            <p className="text-xl sm:text-2xl font-display font-bold text-white">{v}</p>
            <p className="text-[10px] sm:text-xs mt-0.5" style={{ color:'var(--text-muted)' }}>{l}</p>
          </div>
        ))}
      </div>

      {/* In progress */}
      {inProgressCourses.length > 0 && (
        <div className="mb-5 animate-fade-up" style={{ animationDelay:'0.12s' }}>
          <h2 className="text-sm sm:text-base font-semibold text-white mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-yellow-400" /> Em andamento ({inProgressCourses.length})
          </h2>
          <div className="space-y-2">
            {inProgressCourses.map(c => <CourseRow key={c.id} course={c} />)}
          </div>
        </div>
      )}

      {/* Completed */}
      {completedCourses.length > 0 && (
        <div className="mb-5 animate-fade-up" style={{ animationDelay:'0.15s' }}>
          <h2 className="text-sm sm:text-base font-semibold text-white mb-3 flex items-center gap-2">
            <Award className="w-4 h-4 text-green-400" /> Concluídos ({completedCourses.length})
          </h2>
          <div className="space-y-2">
            {completedCourses.map(c => <CourseRow key={c.id} course={c} />)}
          </div>
        </div>
      )}

      {/* Not started */}
      {newCourses.length > 0 && (
        <div className="animate-fade-up" style={{ animationDelay:'0.18s' }}>
          <h2 className="text-sm sm:text-base font-semibold text-white mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-400" /> Novos cursos ({newCourses.length})
          </h2>
          <div className="space-y-2">
            {newCourses.slice(0, 10).map(c => <CourseRow key={c.id} course={c} />)}
          </div>
        </div>
      )}
    </div>
  )
}
