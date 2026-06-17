import { useState } from 'react'
import { useCourses } from '@/contexts/CoursesContext'
import { Link } from 'react-router-dom'
import { Trash2, PlusCircle, ChevronDown, ChevronUp, BookOpen, Edit2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

function LessonRow({ courseId, lesson, onDelete }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid var(--border)' }}>
      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background:'rgba(139,92,246,0.15)' }}>
        <BookOpen className="w-3.5 h-3.5 text-purple-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white truncate">{lesson.title}</p>
        <p className="text-xs" style={{ color:'var(--text-muted)' }}>{lesson.duration}</p>
      </div>
      <button onClick={() => onDelete(courseId, lesson.id)} className="p-1.5 rounded-lg text-red-400/50 hover:text-red-400 hover:bg-red-500/10 transition-all">
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

function AddLessonInline({ courseId, onAdd }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ title:'', duration:'', description:'', videoUrl:'', pdfUrl:'' })
  const [err, setErr] = useState('')

  function handleAdd() {
    if (!form.title.trim() || !form.duration.trim()) { setErr('Título e duração são obrigatórios.'); return }
    onAdd(courseId, form)
    setForm({ title:'', duration:'', description:'', videoUrl:'', pdfUrl:'' })
    setErr(''); setOpen(false)
  }

  if (!open) return (
    <button onClick={() => setOpen(true)} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors"
      style={{ border:'1px dashed rgba(139,92,246,0.25)', background:'rgba(139,92,246,0.04)' }}>
      <PlusCircle className="w-3.5 h-3.5" /> Adicionar aula
    </button>
  )

  return (
    <div className="p-4 rounded-xl space-y-3" style={{ background:'rgba(139,92,246,0.06)', border:'1px solid rgba(139,92,246,0.2)' }}>
      {err && <p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{err}</p>}
      <div className="grid grid-cols-2 gap-2">
        <input className="input h-9 text-xs" placeholder="Título *" value={form.title} onChange={e => setForm(p=>({...p,title:e.target.value}))} />
        <input className="input h-9 text-xs" placeholder="Duração *" value={form.duration} onChange={e => setForm(p=>({...p,duration:e.target.value}))} />
      </div>
      <input className="input h-9 text-xs" placeholder="URL do vídeo (YouTube embed)" value={form.videoUrl} onChange={e => setForm(p=>({...p,videoUrl:e.target.value}))} />
      <div className="flex gap-2">
        <button onClick={handleAdd} className="btn-primary flex-1 h-9 text-xs"><PlusCircle className="w-3.5 h-3.5"/>Adicionar</button>
        <button onClick={() => setOpen(false)} className="btn-ghost px-4 h-9 text-xs">Cancelar</button>
      </div>
    </div>
  )
}

export default function TeacherManageCourses() {
  const { courses, deleteCourse, deleteLesson, addLesson } = useCourses()
  const [expanded, setExpanded] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  function handleDeleteCourse(id) {
    if (confirmDelete === id) { deleteCourse(id); setConfirmDelete(null) }
    else { setConfirmDelete(id); setTimeout(() => setConfirmDelete(null), 3000) }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6 animate-fade-up">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Gerenciar Cursos</h1>
          <p className="text-sm mt-1" style={{ color:'var(--text-muted)' }}>{courses.length} curso{courses.length!==1?'s':''} na plataforma</p>
        </div>
        <Link to="/professor/adicionar-curso" className="btn-primary px-4 py-2.5 text-sm">
          <PlusCircle className="w-4 h-4" /> Novo curso
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="card p-12 text-center animate-fade-up">
          <BookOpen className="w-12 h-12 mx-auto mb-3 text-purple-500/30" />
          <p className="text-white font-semibold mb-1">Nenhum curso criado</p>
          <p className="text-sm mb-5" style={{ color:'var(--text-muted)' }}>Comece criando seu primeiro curso</p>
          <Link to="/professor/adicionar-curso" className="btn-primary px-6 py-2.5 text-sm inline-flex">
            <PlusCircle className="w-4 h-4" /> Criar primeiro curso
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {courses.map((course, i) => (
            <div key={course.id} className="card overflow-hidden animate-fade-up" style={{ animationDelay: i * 0.05 + 's' }}>
              {/* Course header */}
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                    style={{ background: course.color + '22' }}>{course.thumbnail}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white">{course.title}</p>
                    <p className="text-xs mt-0.5 mb-2" style={{ color:'var(--text-muted)' }}>{course.category} · {course.lessons.length} aulas</p>
                    <p className="text-xs line-clamp-1" style={{ color:'var(--text-muted)' }}>{course.description}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => handleDeleteCourse(course.id)}
                      className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                        confirmDelete === course.id
                          ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                          : 'text-red-400/50 hover:text-red-400 hover:bg-red-500/10'
                      )}>
                      <Trash2 className="w-3.5 h-3.5 inline mr-1" />
                      {confirmDelete === course.id ? 'Confirmar?' : 'Excluir'}
                    </button>
                    <button onClick={() => setExpanded(expanded === course.id ? null : course.id)}
                      className="p-2 rounded-lg text-purple-400/60 hover:text-purple-300 hover:bg-purple-500/10 transition-all">
                      {expanded === course.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Lessons accordion */}
              {expanded === course.id && (
                <div className="px-5 pb-5 space-y-2 border-t" style={{ borderColor:'var(--border)', paddingTop:'16px' }}>
                  <p className="text-xs font-semibold text-purple-400 uppercase tracking-wide mb-3">Aulas</p>
                  {course.lessons.map(l => (
                    <LessonRow key={l.id} courseId={course.id} lesson={l} onDelete={deleteLesson} />
                  ))}
                  {course.lessons.length === 0 && (
                    <p className="text-xs text-center py-3" style={{ color:'var(--text-muted)' }}>Nenhuma aula ainda.</p>
                  )}
                  <AddLessonInline courseId={course.id} onAdd={addLesson} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
