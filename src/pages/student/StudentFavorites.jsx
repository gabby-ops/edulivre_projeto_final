import { useAuth }    from '@/contexts/AuthContext'
import { useCourses } from '@/contexts/CoursesContext'
import { useFavorites } from '@/contexts/FavoritesContext'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, BookOpen, Award, PlayCircle, Clock, User, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function StudentFavorites() {
  const { user }   = useAuth()
  const { courses, getProgress } = useCourses()
  const { favorites, toggleFav, isEnrolled, enroll } = useFavorites()
  const navigate = useNavigate()

  const favCourses = courses.filter(c => favorites.includes(c.id))

  function handleEnroll(e, courseId) {
    e.preventDefault()
    if (isEnrolled(courseId)) { navigate('/aluno/aulas', { state: { courseId } }); return }
    enroll(courseId)
  }

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <div className="mb-6 animate-fade-up">
        <h1 className="font-display text-2xl font-bold flex items-center gap-2" style={{ color:'var(--text-primary)' }}>
          <Heart className="w-6 h-6 text-red-400 fill-red-400" /> Favoritos
        </h1>
        <p className="text-sm mt-1" style={{ color:'var(--text-muted)' }}>
          {favCourses.length} curso{favCourses.length !== 1 ? 's' : ''} favoritado{favCourses.length !== 1 ? 's' : ''}
        </p>
      </div>

      {favCourses.length === 0 ? (
        <div className="card p-12 text-center animate-fade-up">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.2)' }}>
            <Heart className="w-8 h-8 text-red-400/40" />
          </div>
          <h2 className="text-lg font-semibold mb-2" style={{ color:'var(--text-primary)' }}>
            Nenhum curso favoritado ainda
          </h2>
          <p className="text-sm mb-5" style={{ color:'var(--text-muted)' }}>
            Clique no ♥ em qualquer curso para salvá-lo aqui.
          </p>
          <Link to="/aluno/cursos" className="btn-primary px-6 py-2.5 text-sm inline-flex">
            <BookOpen className="w-4 h-4" /> Explorar cursos
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favCourses.map((course, i) => {
            const pct  = getProgress(user?.id, course.id)
            const enrl = isEnrolled(course.id)
            return (
              <div key={course.id}
                className="card overflow-hidden hover:scale-[1.01] transition-all duration-200 animate-fade-up flex flex-col"
                style={{ animationDelay: i * 0.05 + 's' }}>

                {/* Thumbnail */}
                <div className="h-28 flex items-center justify-center text-5xl relative"
                  style={{ background: course.color + '22', borderBottom:'1px solid var(--border)' }}>
                  <span>{course.thumbnail}</span>
                  <button onClick={() => toggleFav(course.id)}
                    className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110"
                    style={{ background:'rgba(0,0,0,0.35)', backdropFilter:'blur(6px)' }}>
                    <Heart className="w-3.5 h-3.5 fill-red-400 text-red-400" />
                  </button>
                  {pct === 100 && (
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                      style={{ background:'rgba(16,185,129,0.2)', border:'1px solid rgba(16,185,129,0.4)', color:'#34d399' }}>
                      <Award className="w-2.5 h-2.5" /> Concluído
                    </div>
                  )}
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <span className="badge-lilac text-[10px] mb-2 self-start">{course.category}</span>
                  <h3 className="font-semibold text-sm mb-1 line-clamp-2" style={{ color:'var(--text-primary)' }}>
                    {course.title}
                  </h3>
                  <p className="text-xs mb-3 line-clamp-2 flex-1" style={{ color:'var(--text-muted)' }}>
                    {course.description}
                  </p>

                  <div className="flex items-center gap-3 text-xs mb-3" style={{ color:'var(--text-muted)' }}>
                    <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{course.lessons.length} aulas</span>
                    {course.workload && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.workload}</span>}
                  </div>

                  {enrl && (
                    <>
                      <div className="progress-bar mb-1.5"><div className="progress-fill" style={{ width: pct + '%' }} /></div>
                      <p className="text-xs mb-3 font-medium" style={{ color: pct===100 ? '#10b981' : '#a78bfa' }}>{pct}% concluído</p>
                    </>
                  )}

                  {course.teacherName && (
                    <p className="text-[10px] flex items-center gap-1 mb-3" style={{ color:'var(--text-muted)' }}>
                      <User className="w-2.5 h-2.5" />{course.teacherName}
                    </p>
                  )}

                  {enrl ? (
                    <Link to="/aluno/aulas" state={{ courseId: course.id }} className="btn-primary w-full py-2.5 text-xs">
                      <PlayCircle className="w-3.5 h-3.5" />
                      {pct === 0 ? 'Começar' : pct === 100 ? 'Revisar' : 'Continuar'}
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <button onClick={e => handleEnroll(e, course.id)} className="btn-green w-full py-2.5 text-xs">
                      Matricular-se
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
