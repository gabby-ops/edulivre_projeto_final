import { useState, useMemo } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useCourses } from '@/contexts/CoursesContext'
import { Link, useNavigate } from 'react-router-dom'
import { useFavorites } from '@/contexts/FavoritesContext'
import {
  Search, BookOpen, Clock, User, Award, HelpCircle,
  Heart, CheckCircle2, Lock, Star, ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

const QUIZ_KEY = 'edulivre_quiz_v1'
function getQuizResult(userId, courseId) {
  try { return JSON.parse(localStorage.getItem(QUIZ_KEY) || '{}')[`${userId}_${courseId}`] || null }
  catch { return null }
}

const CATEGORY_ICONS = {
  'Programação':        '💻',
  'Design':             '🎨',
  'IA & Machine Learning': '🤖',
  'Administração':      '📊',
  'Idiomas':            '🌐',
  'Negócios':           '🚀',
  'Exatas':             '📐',
  'Marketing':          '📱',
  'Infraestrutura':     '🌐',
  'Segurança':          '🔐',
  'DevOps':             '🐳',
  'Mobile':             '📲',
  'Dados':              '📈',
  'Gestão':             '📋',
  'Web':                '🌍',
  'Linguagem':          '✍️',
  'Soft Skills':        '🎤',
  'Finanças':           '💰',
}

export default function StudentCourses() {
  const { user }   = useAuth()
  const { courses, getProgress } = useCourses()
  const { isFav, toggleFav, isEnrolled, enroll } = useFavorites()
  const navigate = useNavigate()

  const [search,   setSearch]   = useState('')
  const [category, setCategory] = useState('Todas')
  const [filter,   setFilter]   = useState('all')
  const [view,     setView]     = useState('grid') // grid | list

  const categories = useMemo(() =>
    ['Todas', ...new Set(courses.map(c => c.category))], [courses])

  const filtered = useMemo(() => courses.filter(c => {
    const q   = search.toLowerCase()
    const matchS = !search ||
      c.title.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      (c.teacherName || '').toLowerCase().includes(q)
    const matchC = category === 'Todas' || c.category === category
    const pct = getProgress(user.id, c.id)
    const enrl = isEnrolled(c.id)
    const matchF =
      filter === 'all'       ||
      (filter === 'enrolled' && enrl) ||
      (filter === 'progress' && enrl && pct > 0 && pct < 100) ||
      (filter === 'completed' && pct === 100) ||
      (filter === 'new'      && !enrl)
    return matchS && matchC && matchF
  }), [courses, search, category, filter, user.id, isEnrolled, getProgress])

  // Group by category for category view
  const grouped = useMemo(() => {
    const map = {}
    filtered.forEach(c => {
      if (!map[c.category]) map[c.category] = []
      map[c.category].push(c)
    })
    return map
  }, [filtered])

  function handleEnroll(e, courseId) {
    e.preventDefault()
    e.stopPropagation()
    if (isEnrolled(courseId)) {
      navigate('/aluno/aulas', { state: { courseId } })
      return
    }
    enroll(courseId)
    toast.success('Matrícula realizada! Bons estudos! 🎉', { icon: '🎓' })
  }

  function CourseCard({ course, i }) {
    const pct   = getProgress(user.id, course.id)
    const fav   = isFav(course.id)
    const enrl  = isEnrolled(course.id)
    const qr    = getQuizResult(user.id, course.id)

    return (
      <div className="card overflow-hidden animate-fade-up hover:scale-[1.01] active:scale-[0.99] transition-transform flex flex-col"
        style={{ animationDelay: Math.min(i, 11) * 0.04 + 's' }}>

        {/* Thumb */}
        <div className="relative h-28 flex items-center justify-center text-5xl shrink-0"
          style={{ background: `linear-gradient(135deg,${course.color}28,${course.color}12)` }}>
          <span>{course.thumbnail}</span>

          {/* Favorite */}
          <button onClick={e => { e.preventDefault(); toggleFav(course.id) }}
            className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)' }}>
            <Heart className={cn('w-3.5 h-3.5 transition-colors', fav ? 'fill-red-400 text-red-400' : 'text-white/70')} />
          </button>

          {/* Status badge */}
          {pct === 100 && (
            <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
              style={{ background:'rgba(16,185,129,0.25)', border:'1px solid rgba(16,185,129,0.5)', color:'#34d399' }}>
              <Award className="w-2.5 h-2.5" /> Concluído
            </div>
          )}
          {!enrl && pct === 0 && (
            <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
              style={{ background:'rgba(139,92,246,0.2)', border:'1px solid rgba(139,92,246,0.4)', color:'#c4b5fd' }}>
              <Star className="w-2.5 h-2.5" /> Disponível
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: course.color }}>
              {CATEGORY_ICONS[course.category] || '📚'} {course.category}
            </span>
            {course.level && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-md font-medium"
                style={{ background:'rgba(255,255,255,0.07)', color:'var(--text-muted)' }}>
                {course.level}
              </span>
            )}
          </div>

          <h3 className="font-semibold text-sm mb-1 line-clamp-2 leading-snug" style={{ color:'var(--text-primary)' }}>
            {course.title}
          </h3>
          <p className="text-xs mb-3 line-clamp-2 leading-relaxed flex-1" style={{ color:'var(--text-muted)' }}>
            {course.description}
          </p>

          <div className="flex items-center gap-3 mb-3 text-xs" style={{ color:'var(--text-muted)' }}>
            <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{course.lessons.length} aulas</span>
            {course.workload && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.workload}</span>}
            {qr && <span className="flex items-center gap-1 text-emerald-500"><HelpCircle className="w-3 h-3" />{Math.round((qr.score/qr.total)*100)}%</span>}
          </div>

          {enrl && (
            <>
              <div className="progress-bar mb-1.5">
                <div className="progress-fill" style={{ width: pct + '%' }} />
              </div>
              <p className="text-xs mb-3 font-medium" style={{ color: pct === 100 ? '#10b981' : '#a78bfa' }}>
                {pct}% concluído
              </p>
            </>
          )}

          {course.teacherName && (
            <p className="text-[10px] flex items-center gap-1 mb-3" style={{ color:'var(--text-muted)' }}>
              <User className="w-2.5 h-2.5" />{course.teacherName}
            </p>
          )}

          {enrl ? (
            <Link to="/aluno/aulas" state={{ courseId: course.id }} className="btn-primary w-full py-2.5 text-xs">
              {pct === 0 ? 'Começar aulas' : pct === 100 ? 'Revisar curso' : 'Continuar'}
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <button onClick={e => handleEnroll(e, course.id)}
              className="btn-green w-full py-2.5 text-xs">
              <CheckCircle2 className="w-3.5 h-3.5" /> Matricular-se
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-5 animate-fade-up">
        <h1 className="font-display text-2xl font-bold" style={{ color:'var(--text-primary)' }}>
          Catálogo de Cursos
        </h1>
        <p className="text-sm mt-1" style={{ color:'var(--text-muted)' }}>
          {courses.length} cursos disponíveis · {courses.filter(c => isEnrolled(c.id)).length} matrículas ativas
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-4 animate-fade-up" style={{ animationDelay:'0.05s' }}>
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color:'var(--text-muted)' }} />
        <input type="text" placeholder="Buscar cursos, categorias ou professores..."
          value={search} onChange={e => setSearch(e.target.value)} className="input pl-10" />
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 mb-3 overflow-x-auto pb-1 animate-fade-up" style={{ animationDelay:'0.07s' }}>
        {[
          { v:'all',       l:'Todos' },
          { v:'enrolled',  l:'Matriculados' },
          { v:'progress',  l:'Em andamento' },
          { v:'completed', l:'Concluídos' },
          { v:'new',       l:'Não matriculado' },
        ].map(({ v, l }) => (
          <button key={v} onClick={() => setFilter(v)}
            className={cn('px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all',
              filter === v ? 'text-white' : 'hover:opacity-80')}
            style={filter === v
              ? { background:'linear-gradient(135deg,#8b5cf6,#6d28d9)', color:'#fff' }
              : { background:'rgba(139,92,246,0.08)', border:'1px solid rgba(139,92,246,0.18)', color:'var(--text-muted)' }}>
            {l}
          </button>
        ))}
      </div>

      {/* Category chips */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1 animate-fade-up" style={{ animationDelay:'0.09s' }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)}
            className={cn('px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1',
              category === cat ? 'text-white' : 'hover:opacity-80')}
            style={category === cat
              ? { background:'rgba(139,92,246,0.3)', border:'1px solid rgba(139,92,246,0.6)', color:'#e2d9fe' }
              : { border:'1px solid var(--border)', color:'var(--text-muted)' }}>
            {cat !== 'Todas' && (CATEGORY_ICONS[cat] || '📚')} {cat}
          </button>
        ))}
      </div>

      <p className="text-xs mb-4" style={{ color:'var(--text-muted)' }}>
        {filtered.length} curso{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
      </p>

      {/* Courses — grouped by category when "Todas" */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center animate-fade-up">
          <Search className="w-10 h-10 mx-auto mb-3 opacity-30" style={{ color:'var(--text-muted)' }} />
          <p className="font-semibold mb-1" style={{ color:'var(--text-primary)' }}>Nenhum curso encontrado</p>
          <p className="text-sm" style={{ color:'var(--text-muted)' }}>Tente outros termos ou filtros</p>
        </div>
      ) : category === 'Todas' && !search && filter === 'all' ? (
        // Grouped by category
        <div className="space-y-8">
          {Object.entries(grouped).map(([cat, catCourses]) => (
            <div key={cat} className="animate-fade-up">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{CATEGORY_ICONS[cat] || '📚'}</span>
                <h2 className="text-base font-bold" style={{ color:'var(--text-primary)' }}>{cat}</h2>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background:'rgba(139,92,246,0.12)', color:'#a78bfa', border:'1px solid rgba(139,92,246,0.2)' }}>
                  {catCourses.length} curso{catCourses.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {catCourses.map((course, i) => (
                  <CourseCard key={course.id} course={course} i={i} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Flat grid
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((course, i) => (
            <CourseCard key={course.id} course={course} i={i} />
          ))}
        </div>
      )}
    </div>
  )
}
