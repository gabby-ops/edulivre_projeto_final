import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useCourses } from '@/contexts/CoursesContext'
import { useFavorites } from '@/contexts/FavoritesContext'
import { GraduationCap, CheckCircle2, ArrowRight, BookOpen, Clock, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

const CATEGORY_ICONS = {
  'Programação':'💻','Design':'🎨','IA & Machine Learning':'🤖','Administração':'📊',
  'Idiomas':'🌐','Negócios':'🚀','Exatas':'📐','Marketing':'📱','Infraestrutura':'🌐',
  'Segurança':'🔐','DevOps':'🐳','Mobile':'📲','Dados':'📈','Gestão':'📋',
  'Web':'🌍','Linguagem':'✍️','Soft Skills':'🎤','Finanças':'💰',
}

export default function OnboardingPage() {
  const { user }   = useAuth()
  const { courses } = useCourses()
  const { enroll, isEnrolled } = useFavorites()
  const navigate   = useNavigate()

  const [selected, setSelected] = useState([])
  const [step,     setStep]     = useState(1) // 1 = select, 2 = confirm

  const categories = [...new Set(courses.map(c => c.category))]

  function toggle(courseId) {
    setSelected(prev =>
      prev.includes(courseId) ? prev.filter(id => id !== courseId) : [...prev, courseId]
    )
  }

  function handleConfirm() {
    if (selected.length === 0) { toast.error('Selecione ao menos 1 curso!'); return }
    selected.forEach(id => enroll(id))
    toast.success(`Matrícula em ${selected.length} curso${selected.length > 1 ? 's' : ''} realizada! 🎓`)
    // Mark onboarding done
    localStorage.setItem(`edulivre_onboarding_${user?.id}`, '1')
    navigate('/aluno', { replace: true })
  }

  function handleSkip() {
    localStorage.setItem(`edulivre_onboarding_${user?.id}`, '1')
    navigate('/aluno', { replace: true })
  }

  return (
    <div className="min-h-screen" style={{ background:'var(--bg-primary)' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 border-b" style={{ background:'rgba(7,7,15,0.95)', backdropFilter:'blur(16px)', borderColor:'var(--border)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background:'linear-gradient(135deg,#8b5cf6,#6d28d9)' }}>
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-base" style={{ color:'var(--text-primary)' }}>EduLivre</span>
          </div>
          <button onClick={handleSkip} className="text-sm" style={{ color:'var(--text-muted)' }}>
            Pular →
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome */}
        <div className="text-center mb-8 animate-fade-up">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background:'linear-gradient(135deg,#8b5cf6,#6d28d9)', boxShadow:'0 8px 32px rgba(139,92,246,0.4)' }}>
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold mb-2" style={{ color:'var(--text-primary)' }}>
            Bem-vindo(a), {user?.name?.split(' ')[0]}! 🎉
          </h1>
          <p className="text-sm sm:text-base max-w-md mx-auto" style={{ color:'var(--text-muted)' }}>
            Escolha os cursos em que deseja se matricular para começar sua jornada de aprendizado.
          </p>

          {selected.length > 0 && (
            <div className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full text-sm font-semibold"
              style={{ background:'rgba(139,92,246,0.15)', border:'1px solid rgba(139,92,246,0.3)', color:'#c4b5fd' }}>
              <CheckCircle2 className="w-4 h-4" />
              {selected.length} curso{selected.length > 1 ? 's' : ''} selecionado{selected.length > 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* Courses grouped by category */}
        <div className="space-y-8">
          {categories.map(cat => {
            const catCourses = courses.filter(c => c.category === cat)
            return (
              <div key={cat} className="animate-fade-up">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{CATEGORY_ICONS[cat] || '📚'}</span>
                  <h2 className="font-bold text-base" style={{ color:'var(--text-primary)' }}>{cat}</h2>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background:'rgba(139,92,246,0.1)', color:'#a78bfa' }}>
                    {catCourses.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {catCourses.map(course => {
                    const sel = selected.includes(course.id)
                    return (
                      <button key={course.id} onClick={() => toggle(course.id)}
                        className={cn(
                          'card p-4 text-left transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] relative',
                          sel && 'ring-2 ring-purple-500'
                        )}
                        style={sel ? { borderColor:'rgba(139,92,246,0.6)', boxShadow:'0 4px 20px rgba(139,92,246,0.2)' } : {}}>

                        {sel && (
                          <div className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center"
                            style={{ background:'#8b5cf6' }}>
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                        )}

                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                            style={{ background: course.color + '22' }}>
                            {course.thumbnail}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm leading-snug mb-1" style={{ color:'var(--text-primary)' }}>
                              {course.title}
                            </p>
                            <div className="flex items-center gap-3 text-xs" style={{ color:'var(--text-muted)' }}>
                              <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{course.lessons.length} aulas</span>
                              {course.workload && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.workload}</span>}
                            </div>
                            {course.teacherName && (
                              <p className="text-[10px] mt-1 flex items-center gap-1" style={{ color:'var(--text-muted)' }}>
                                <User className="w-2.5 h-2.5" />{course.teacherName}
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Sticky footer */}
        <div className="sticky bottom-0 mt-8 pt-4 pb-6"
          style={{ background:'linear-gradient(to top, var(--bg-primary) 80%, transparent)' }}>
          <div className="flex gap-3 max-w-sm mx-auto">
            <button onClick={handleSkip} className="btn-ghost flex-1 py-3">
              Pular por agora
            </button>
            <button onClick={handleConfirm}
              disabled={selected.length === 0}
              className="btn-primary flex-[2] py-3">
              Matricular em {selected.length > 0 ? selected.length : ''} {selected.length > 0 ? `curso${selected.length > 1 ? 's' : ''}` : 'cursos'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
