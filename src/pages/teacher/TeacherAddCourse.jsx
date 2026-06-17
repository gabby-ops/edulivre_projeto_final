import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useCourses } from '@/contexts/CoursesContext'
import { useNavigate } from 'react-router-dom'
import { PlusCircle, CheckCircle2, BookOpen, Trash2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const EMOJIS   = ['⚛️','⚡','🎨','🐍','📱','🔐','🗄️','☁️','🤖','📊','🎮','🎵']
const COLORS   = ['#8b5cf6','#10b981','#f59e0b','#06b6d4','#ef4444','#ec4899','#6366f1','#84cc16']
const CATS     = ['Desenvolvimento Web','Programação','Design','DevOps','Mobile','Data Science','Segurança','Outro']

export default function TeacherAddCourse() {
  const { user } = useAuth()
  const { addCourse, addLesson } = useCourses()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [courseId, setCourseId] = useState(null)
  const [success, setSuccess] = useState(false)

  const [course, setCourse] = useState({ title:'', description:'', category: CATS[0], thumbnail: EMOJIS[0], color: COLORS[0] })
  const [courseErr, setCourseErr] = useState({})

  const [lesson, setLesson] = useState({ title:'', duration:'', description:'', videoUrl:'', pdfUrl:'' })
  const [lessonErr, setLessonErr] = useState({})
  const [lessons, setLessons] = useState([])

  function setCF(f) { return e => { setCourse(p => ({ ...p, [f]: e.target.value })); setCourseErr(p => ({ ...p, [f]:'' })) } }
  function setLF(f) { return e => { setLesson(p => ({ ...p, [f]: e.target.value })); setLessonErr(p => ({ ...p, [f]:'' })) } }

  function validateCourse() {
    const e = {}
    if (!course.title.trim()) e.title = 'Título obrigatório.'
    if (!course.description.trim()) e.description = 'Descrição obrigatória.'
    return e
  }

  function handleCreateCourse() {
    const e = validateCourse(); setCourseErr(e)
    if (Object.keys(e).length) return
    const created = addCourse({ ...course, teacherId: user.id, teacherName: user.name })
    setCourseId(created.id)
    setStep(2)
  }

  function validateLesson() {
    const e = {}
    if (!lesson.title.trim()) e.title = 'Título obrigatório.'
    if (!lesson.duration.trim()) e.duration = 'Duração obrigatória.'
    return e
  }

  function handleAddLesson() {
    const e = validateLesson(); setLessonErr(e)
    if (Object.keys(e).length) return
    addLesson(courseId, lesson)
    setLessons(p => [...p, lesson])
    setLesson({ title:'', duration:'', description:'', videoUrl:'', pdfUrl:'' })
  }

  function handleFinish() { setSuccess(true); setTimeout(() => navigate('/professor/gerenciar'), 1800) }

  if (success) return (
    <div className="p-6 flex items-center justify-center min-h-[60vh]">
      <div className="text-center animate-scale-in">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ background:'linear-gradient(135deg,#10b981,#059669)', boxShadow:'0 8px 32px rgba(16,185,129,0.5)' }}>
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>
        <h2 className="font-display text-2xl font-bold text-white mb-2">Curso criado!</h2>
        <p style={{ color:'var(--text-muted)' }}>Redirecionando para gerenciar cursos...</p>
      </div>
    </div>
  )

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6 animate-fade-up">
        <h1 className="font-display text-2xl font-bold text-white">Adicionar Curso</h1>
        <p className="text-sm mt-1" style={{ color:'var(--text-muted)' }}>Crie um novo curso para a plataforma</p>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-3 mb-8 animate-fade-up" style={{ animationDelay:'0.05s' }}>
        {[1,2].map(s => (
          <div key={s} className="flex items-center gap-3">
            <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all',
              step === s ? 'text-white' : step > s ? 'text-white' : 'text-purple-500/40'
            )} style={step >= s ? { background:'linear-gradient(135deg,#8b5cf6,#6d28d9)' } : { background:'rgba(139,92,246,0.1)', border:'1px solid rgba(139,92,246,0.2)' }}>
              {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
            </div>
            <span className={cn('text-sm font-medium', step >= s ? 'text-white' : 'text-purple-500/40')}>
              {s === 1 ? 'Dados do curso' : 'Adicionar aulas'}
            </span>
            {s < 2 && <div className="w-12 h-px" style={{ background: step > s ? 'var(--lilac)' : 'rgba(139,92,246,0.2)' }} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="card p-6 animate-fade-up" style={{ animationDelay:'0.1s' }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-purple-200/80 mb-1.5">Título do curso *</label>
              <input className={cn('input', courseErr.title && 'error')} placeholder="Ex: React do Zero ao Avançado" value={course.title} onChange={setCF('title')} />
              {courseErr.title && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{courseErr.title}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-200/80 mb-1.5">Descrição *</label>
              <textarea className={cn('input h-auto py-3', courseErr.description && 'error')} rows={3}
                placeholder="Descreva o que o aluno vai aprender..." value={course.description} onChange={setCF('description')} />
              {courseErr.description && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{courseErr.description}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-200/80 mb-1.5">Categoria</label>
              <select className="input" value={course.category} onChange={setCF('category')}>
                {CATS.map(c => <option key={c} value={c} style={{ background:'#12122a' }}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-200/80 mb-2">Ícone do curso</label>
              <div className="flex flex-wrap gap-2">
                {EMOJIS.map(e => (
                  <button key={e} type="button" onClick={() => setCourse(p => ({ ...p, thumbnail: e }))}
                    className={cn('w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all',
                      course.thumbnail === e ? 'ring-2 ring-purple-500 scale-110' : 'hover:scale-105'
                    )} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid var(--border)' }}>{e}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-200/80 mb-2">Cor do curso</label>
              <div className="flex gap-2 flex-wrap">
                {COLORS.map(c => (
                  <button key={c} type="button" onClick={() => setCourse(p => ({ ...p, color: c }))}
                    className={cn('w-8 h-8 rounded-lg transition-all', course.color === c ? 'ring-2 ring-white scale-110' : 'hover:scale-105')}
                    style={{ background: c }} />
                ))}
              </div>
            </div>
            <button onClick={handleCreateCourse} className="btn-primary w-full h-11 mt-2">
              <PlusCircle className="w-4 h-4" /> Criar curso e adicionar aulas
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 animate-fade-up" style={{ animationDelay:'0.1s' }}>
          {/* Added lessons */}
          {lessons.length > 0 && (
            <div className="card p-4">
              <p className="text-sm font-semibold text-white mb-3">{lessons.length} aula{lessons.length>1?'s':''} adicionada{lessons.length>1?'s':''}</p>
              <div className="space-y-2">
                {lessons.map((l, i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg" style={{ background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.2)' }}>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-sm text-white flex-1">{l.title}</span>
                    <span className="text-xs" style={{ color:'var(--text-muted)' }}>{l.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add lesson form */}
          <div className="card p-6">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><BookOpen className="w-4 h-4 text-purple-400" />Nova aula</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-purple-200/80 mb-1.5">Título *</label>
                  <input className={cn('input', lessonErr.title && 'error')} placeholder="Título da aula" value={lesson.title} onChange={setLF('title')} />
                  {lessonErr.title && <p className="text-xs text-red-400 mt-1">{lessonErr.title}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-200/80 mb-1.5">Duração *</label>
                  <input className={cn('input', lessonErr.duration && 'error')} placeholder="Ex: 20min" value={lesson.duration} onChange={setLF('duration')} />
                  {lessonErr.duration && <p className="text-xs text-red-400 mt-1">{lessonErr.duration}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-200/80 mb-1.5">Descrição</label>
                <input className="input" placeholder="Descrição breve da aula" value={lesson.description} onChange={setLF('description')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-200/80 mb-1.5">URL do vídeo (YouTube embed)</label>
                <input className="input" placeholder="https://www.youtube.com/embed/..." value={lesson.videoUrl} onChange={setLF('videoUrl')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-200/80 mb-1.5">URL do PDF (opcional)</label>
                <input className="input" placeholder="https://..." value={lesson.pdfUrl} onChange={setLF('pdfUrl')} />
              </div>
              <button onClick={handleAddLesson} className="btn-primary w-full h-10 text-sm">
                <PlusCircle className="w-4 h-4" /> Adicionar aula
              </button>
            </div>
          </div>

          <button onClick={handleFinish} disabled={lessons.length === 0}
            className="btn-green w-full h-11">
            <CheckCircle2 className="w-4 h-4" /> Finalizar curso ({lessons.length} aula{lessons.length !== 1 ? 's' : ''})
          </button>
        </div>
      )}
    </div>
  )
}
