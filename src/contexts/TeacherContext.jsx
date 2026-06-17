// ============================================================
// EduLivre — TeacherContext
// Dados do painel do professor: alunos, estatísticas
// Suporta modo backend (API) e modo offline (localStorage)
// ============================================================
import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { api } from '@/services/api'

const TeacherContext = createContext(null)

const _u = import.meta.env.VITE_API_URL
const USE_BACKEND = Boolean(_u && _u.trim() !== '')

// ── Helpers offline ─────────────────────────────────────────
function readOfflineStudents() {
  try {
    const users = JSON.parse(localStorage.getItem('edulivre_users_v1') || '[]')
    return users.filter(u => u.role === 'student').map(s => ({
      id: s.id,
      name: s.name,
      email: s.email,
      avatar: s.avatar || '',
      createdAt: s.createdAt || new Date().toISOString(),
      lastAccess: null,
      lessonsCompleted: 0,
      certificates: 0,
      avgQuizScore: null,
      status: 'active',
    }))
  } catch { return [] }
}

function readOfflineStats(courses = []) {
  try {
    const users      = JSON.parse(localStorage.getItem('edulivre_users_v1') || '[]')
    const students   = users.filter(u => u.role === 'student')
    const quizData   = JSON.parse(localStorage.getItem('edulivre_quiz_v1') || '{}')
    const certsData  = JSON.parse(localStorage.getItem('edulivre_certificates_v1') || '{}')
    const totalLessons = courses.reduce((a, c) => a + (c.lessons?.length || 0), 0)

    const quizScores = Object.values(quizData).flatMap(byCourse =>
      Object.values(byCourse || {}).map(r => r.score != null && r.total ? Math.round((r.score / r.total) * 100) : null)
    ).filter(v => v != null)

    const avgQuiz = quizScores.length > 0
      ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length)
      : 0

    const certsCount = Object.values(certsData).reduce((acc, byCourse) =>
      acc + Object.keys(byCourse || {}).length, 0)

    return {
      totalStudents:    students.length,
      activeStudents:   students.length, // offline: todos considerados ativos
      totalTeachers:    users.filter(u => u.role === 'teacher').length,
      totalCourses:     courses.length,
      totalLessons,
      totalCertificates: certsCount,
      totalProgress:    0,
      avgQuizScore:     avgQuiz,
      totalQuizzes:     quizScores.length,
    }
  } catch { return { totalStudents:0, activeStudents:0, totalTeachers:0, totalCourses:0, totalLessons:0, totalCertificates:0, totalProgress:0, avgQuizScore:0, totalQuizzes:0 } }
}

export function TeacherProvider({ children }) {
  const [students, setStudents] = useState([])
  const [stats,    setStats]    = useState(null)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(null)

  const fetchStudents = useCallback(async (courses = []) => {
    setLoading(true)
    setError(null)
    try {
      if (USE_BACKEND) {
        const data = await api.teacher.listStudents()
        setStudents(data)
      } else {
        setStudents(readOfflineStudents())
      }
    } catch (err) {
      console.error('fetchStudents:', err)
      setError(err.message)
      // Fallback para offline mesmo com backend configurado
      setStudents(readOfflineStudents())
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchStats = useCallback(async (courses = []) => {
    try {
      if (USE_BACKEND) {
        const data = await api.teacher.getStats()
        setStats(data)
      } else {
        setStats(readOfflineStats(courses))
      }
    } catch (err) {
      console.error('fetchStats:', err)
      setStats(readOfflineStats(courses))
    }
  }, [])

  const refreshAll = useCallback(async (courses = []) => {
    await Promise.all([fetchStudents(courses), fetchStats(courses)])
  }, [fetchStudents, fetchStats])

  return (
    <TeacherContext.Provider value={{
      students, stats, loading, error,
      fetchStudents, fetchStats, refreshAll,
      isBackend: USE_BACKEND,
    }}>
      {children}
    </TeacherContext.Provider>
  )
}

export function useTeacher() {
  const ctx = useContext(TeacherContext)
  if (!ctx) throw new Error('useTeacher must be inside TeacherProvider')
  return ctx
}
