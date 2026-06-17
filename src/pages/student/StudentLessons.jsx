import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useCourses } from '@/contexts/CoursesContext'
import { useFavorites } from '@/contexts/FavoritesContext'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  CheckCircle2, Circle, PlayCircle, ChevronRight,
  Award, BookOpen, HelpCircle, Clock, FileDown,
  Lock, BookMarked
} from 'lucide-react'
import { generateSummaryPDF, LESSON_SUMMARIES } from '@/services/pdfGenerator'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

const QUIZ_KEY = 'edulivre_quiz_v1'
function getQuizResult(userId, courseId) {
  try { return JSON.parse(localStorage.getItem(QUIZ_KEY) || '{}')[`${userId}_${courseId}`] || null }
  catch { return null }
}

export default function StudentLessons() {
  const { user }   = useAuth()
  const { courses, getLessonsDone, getProgress, markLesson } = useCourses()
  const location   = useLocation()
  const navigate   = useNavigate()

  // Lê favoritos/matrículas com segurança — contexto pode não estar pronto
  let isEnrolled = () => false
  try {
    const fav = useFavorites()
    isEnrolled = fav.isEnrolled
  } catch (_) {}

  const [activeCourseId, setActiveCourseId] = useState(
    location.state?.courseId || null
  )
  const [activeLessonId, setActiveLessonId] = useState(null)
  const [showSummary,    setShowSummary]    = useState(false)

  // Seleciona primeiro curso quando a lista carrega
  useEffect(() => {
    if (!courses.length) return
    if (activeCourseId && courses.find(c => c.id === activeCourseId)) return
    // Tenta o que veio pelo state primeiro
    if (location.state?.courseId && courses.find(c => c.id === location.state.courseId)) {
      setActiveCourseId(location.state.courseId)
      return
    }
    // Depois matriculados, depois qualquer um
    const first = courses.find(c => isEnrolled(c.id)) || courses[0]
    setActiveCourseId(first.id)
  }, [courses]) // eslint-disable-line

  const course = courses.find(c => c.id === activeCourseId) || null

  // Seleciona primeira aula quando curso muda
  useEffect(() => {
    if (course?.lessons?.length) {
      setActiveLessonId(course.lessons[0].id)
      setShowSummary(false)
    }
  }, [activeCourseId]) // eslint-disable-line

  const lesson   = course?.lessons?.find(l => l.id === activeLessonId) || course?.lessons?.[0] || null
  const done     = (user && activeCourseId) ? getLessonsDone(user.id, activeCourseId) : []
  const pct      = (user && activeCourseId) ? getProgress(user.id, activeCourseId) : 0
  const quizResult = (user && activeCourseId) ? getQuizResult(user.id, activeCourseId) : null
  const enrolled   = activeCourseId ? isEnrolled(activeCourseId) : false

  function handleMark() {
    if (!lesson || !user) return
    markLesson(user.id, activeCourseId, lesson.id)
    toast.success('Aula concluída! ✅')
  }

  const handleDownloadSummary = useCallback(() => {
    if (!lesson || !course) return
    generateSummaryPDF({ lesson, course })
    toast.success('Resumo aberto para impressão! 📄')
  }, [lesson, course])

  // Mostra todos os cursos no seletor (sem filtrar por matrícula para não dar tela branca)
  const displayCourses = courses.length > 0 ? courses.slice(0, 20) : []

  // Loading state
  if (!courses.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin mx-auto mb-3" />
          <p className="text-sm" style={{ color:'var(--text-muted)' }}>Carregando cursos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-3 sm:p-5 max-w-7xl mx-auto">
      <div className="mb-4">
        <h1 className="font-display text-xl sm:text-2xl font-bold" style={{ color:'var(--text-primary)' }}>
          Aulas
        </h1>
      </div>

      {/* Seletor de curso */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {displayCourses.map(c => (
          <button key={c.id}
            onClick={() => { setActiveCourseId(c.id); setShowSummary(false) }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 shrink-0"
            style={activeCourseId === c.id
              ? { background:'linear-gradient(135deg,#8b5cf6,#6d28d9)', color:'#fff', boxShadow:'0 4px 14px rgba(139,92,246,0.35)' }
              : { background:'rgba(139,92,246,0.08)', border:'1px solid rgba(139,92,246,0.15)', color:'var(--text-muted)' }}>
            <span>{c.thumbnail}</span>
            <span className="max-w-28 truncate hidden sm:block">{c.title}</span>
          </button>
        ))}
      </div>

      {!course ? (
        <div className="card p-10 text-center">
          <PlayCircle className="w-12 h-12 mx-auto mb-3 opacity-20" style={{ color:'var(--text-muted)' }} />
          <p className="font-semibold mb-2" style={{ color:'var(--text-primary)' }}>Selecione um curso acima</p>
        </div>
      ) : !enrolled ? (
        /* Não matriculado */
        <div className="card p-10 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background:'rgba(139,92,246,0.1)', border:'1px solid rgba(139,92,246,0.2)' }}>
            <Lock className="w-8 h-8 text-purple-400/50" />
          </div>
          <p className="font-semibold mb-2" style={{ color:'var(--text-primary)' }}>
            Você não está matriculado em "{course.title}"
          </p>
          <p className="text-sm mb-5" style={{ color:'var(--text-muted)' }}>
            Faça sua matrícula para acessar as aulas.
          </p>
          <button onClick={() => navigate('/aluno/cursos')} className="btn-primary px-6 py-2.5">
            <BookOpen className="w-4 h-4" /> Ver cursos e matricular
          </button>
        </div>
      ) : (
        /* Conteúdo normal */
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-5">

          {/* ── Coluna principal ─────────────────────────── */}
          <div className="lg:col-span-2">

            {/* Player */}
            <div className="card overflow-hidden mb-4">
              {lesson?.videoUrl ? (
                <div className="relative w-full" style={{ paddingBottom:'56.25%' }}>
                  <iframe
                    src={lesson.videoUrl}
                    title={lesson.title}
                    allowFullScreen
                    className="absolute inset-0 w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              ) : (
                <div className="h-48 sm:h-64 flex items-center justify-center"
                  style={{ background:'rgba(139,92,246,0.06)' }}>
                  <div className="text-center">
                    <PlayCircle className="w-12 h-12 mx-auto mb-2 text-purple-500/30" />
                    <p className="text-sm" style={{ color:'var(--text-muted)' }}>Vídeo não disponível</p>
                  </div>
                </div>
              )}

              <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-base sm:text-lg leading-snug mb-1"
                      style={{ color:'var(--text-primary)' }}>
                      {lesson?.title}
                    </h2>
                    {lesson?.description && (
                      <p className="text-sm" style={{ color:'var(--text-muted)' }}>{lesson.description}</p>
                    )}
                    {lesson?.duration && (
                      <p className="text-xs mt-1 flex items-center gap-1" style={{ color:'var(--text-muted)' }}>
                        <Clock className="w-3 h-3" /> {lesson.duration}
                      </p>
                    )}
                  </div>
                  {lesson && done.includes(lesson.id) ? (
                    <span className="badge-green shrink-0 text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Concluída
                    </span>
                  ) : (
                    <button onClick={handleMark} className="btn-green shrink-0 px-3 py-2 text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Concluir aula
                    </button>
                  )}
                </div>

                {/* Botões de material */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <button onClick={handleDownloadSummary}
                    className="btn-ghost px-4 py-2 text-xs">
                    <FileDown className="w-3.5 h-3.5" /> Baixar Resumo
                  </button>
                  <button
                    onClick={() => setShowSummary(v => !v)}
                    className="px-4 py-2 text-xs rounded-xl border transition-all"
                    style={showSummary
                      ? { background:'rgba(139,92,246,0.12)', borderColor:'rgba(139,92,246,0.4)', color:'#c4b5fd' }
                      : { background:'rgba(139,92,246,0.05)', borderColor:'var(--border)', color:'var(--text-muted)' }}>
                    <BookMarked className="w-3.5 h-3.5 inline mr-1.5" />
                    {showSummary ? 'Ocultar resumo' : 'Ver resumo da aula'}
                  </button>
                </div>
              </div>
            </div>

            {/* Painel de resumo */}
            {showSummary && lesson && course && (
              <div className="card p-5 mb-4" style={{ animation:'fadeIn 0.2s ease' }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2"
                    style={{ color:'var(--text-primary)' }}>
                    <BookMarked className="w-4 h-4 text-purple-400" /> Resumo — {lesson.title}
                  </h3>
                  <button onClick={handleDownloadSummary} className="btn-primary px-3 py-1.5 text-xs">
                    <FileDown className="w-3.5 h-3.5" /> Baixar PDF
                  </button>
                </div>
                <SummaryPreview lessonId={lesson.id} lesson={lesson} course={course} />
              </div>
            )}

            {/* Progresso + quiz */}
            <div className="card p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1 w-full">
                <div className="flex justify-between text-xs mb-1.5">
                  <span style={{ color:'var(--text-muted)' }}>Progresso do curso</span>
                  <span className="font-bold text-purple-400">{pct}%</span>
                </div>
                <div className="progress-bar h-2">
                  <div className="progress-fill" style={{ width: pct + '%' }} />
                </div>
                <p className="text-xs mt-1" style={{ color:'var(--text-muted)' }}>
                  {done.length}/{course.lessons.length} aulas concluídas
                </p>
              </div>
              <div className="flex gap-2 flex-wrap shrink-0">
                {pct === 100 && (
                  <span className="flex items-center gap-1.5 text-emerald-400 text-sm font-semibold">
                    <Award className="w-4 h-4" /> Concluído!
                  </span>
                )}
                <button
                  onClick={() => navigate(`/aluno/quiz/${activeCourseId}`)}
                  className={cn('px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all',
                    quizResult ? 'btn-ghost' : 'btn-primary')}>
                  <HelpCircle className="w-3.5 h-3.5" />
                  {quizResult
                    ? `Quiz ✓ ${Math.round((quizResult.score / quizResult.total) * 100)}%`
                    : 'Fazer Quiz'}
                </button>
                {pct === 100 && (
                  <button onClick={() => navigate('/aluno/certificados')} className="btn-green px-3 py-2 text-xs">
                    <Award className="w-3.5 h-3.5" /> Certificado
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ── Lista de aulas ───────────────────────────── */}
          <div>
            <div className="card p-4">
              <p className="font-semibold text-sm mb-0.5 truncate" style={{ color:'var(--text-primary)' }}>
                {course.title}
              </p>
              <div className="flex items-center gap-2 mb-4 text-xs" style={{ color:'var(--text-muted)' }}>
                <BookOpen className="w-3 h-3" />
                <span>{done.length}/{course.lessons.length} aulas</span>
                {course.workload && <span>· {course.workload}</span>}
              </div>

              <div className="space-y-1">
                {course.lessons.map(l => {
                  const isDone   = done.includes(l.id)
                  const isActive = l.id === lesson?.id
                  return (
                    <button key={l.id}
                      onClick={() => { setActiveLessonId(l.id); setShowSummary(false) }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-150"
                      style={isActive
                        ? { background:'rgba(139,92,246,0.15)', border:'1px solid rgba(139,92,246,0.3)' }
                        : { border:'1px solid transparent' }}>
                      {isDone
                        ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        : <Circle className="w-4 h-4 shrink-0" style={{ color:'rgba(139,92,246,0.35)' }} />
                      }
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate"
                          style={{ color: isActive ? '#c4b5fd' : 'var(--text-primary)' }}>
                          {l.title}
                        </p>
                        {l.duration && (
                          <p className="text-[10px] mt-0.5" style={{ color:'var(--text-muted)' }}>
                            {l.duration}
                          </p>
                        )}
                      </div>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-purple-400 shrink-0" />}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Preview do resumo inline ──────────────────────────────────

function SummaryPreview({ lessonId, lesson, course }) {
  const summary = LESSON_SUMMARIES[lessonId]
  if (!summary) {
    return (
      <div className="space-y-2 text-sm" style={{ color:'var(--text-muted)' }}>
        <p><strong style={{ color:'var(--text-primary)' }}>Curso:</strong> {course.title}</p>
        <p><strong style={{ color:'var(--text-primary)' }}>Aula:</strong> {lesson.title}</p>
        <p><strong style={{ color:'var(--text-primary)' }}>Professor:</strong> {course.teacherName || 'EduLivre'}</p>
        <p><strong style={{ color:'var(--text-primary)' }}>Duração:</strong> {lesson.duration || 'N/A'}</p>
        <p className="mt-3 text-xs p-3 rounded-xl"
          style={{ background:'rgba(139,92,246,0.08)', border:'1px solid rgba(139,92,246,0.15)' }}>
          💡 Clique em "Baixar PDF" para ver o resumo completo desta aula formatado para impressão.
        </p>
      </div>
    )
  }
  return (
    <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
      {summary.content.map((item, i) => {
        if (item.type === 'h1') return (
          <h3 key={i} className="text-base font-bold" style={{ color:'var(--text-primary)' }}>{item.text}</h3>
        )
        if (item.type === 'h2') return (
          <h4 key={i} className="text-sm font-semibold text-purple-400 mt-3" style={{ borderLeft:'3px solid #8b5cf6', paddingLeft:10 }}>
            {item.text}
          </h4>
        )
        if (item.type === 'p') return (
          <p key={i} className="text-sm leading-relaxed" style={{ color:'var(--text-muted)' }}>{item.text}</p>
        )
        if (item.type === 'ul') return (
          <ul key={i} className="space-y-1">
            {item.items.map((li, j) => (
              <li key={j} className="text-sm flex items-start gap-2" style={{ color:'var(--text-muted)' }}>
                <span className="text-purple-400 font-bold shrink-0 mt-0.5">→</span>
                <span>{li}</span>
              </li>
            ))}
          </ul>
        )
        if (item.type === 'code') return (
          <pre key={i} className="text-xs rounded-xl p-3 overflow-x-auto"
            style={{ background:'rgba(139,92,246,0.08)', border:'1px solid rgba(139,92,246,0.15)', color:'#c4b5fd', fontFamily:'monospace' }}>
            {item.text}
          </pre>
        )
        return null
      })}
    </div>
  )
}
