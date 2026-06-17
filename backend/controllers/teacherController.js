// ============================================================
// EduLivre — Teacher Controller (Supabase)
// Rotas exclusivas para professores: alunos, estatísticas, etc.
// ============================================================
const { supabase } = require('../models/database')

// GET /api/teacher/students — lista todos os alunos
async function listStudents(req, res) {
  try {
    const { data: students, error } = await supabase
      .from('users')
      .select('id, name, email, avatar, created_at')
      .eq('role', 'student')
      .order('created_at', { ascending: false })

    if (error) throw error

    // Para cada aluno, busca dados adicionais
    const enriched = await Promise.all((students || []).map(async (s) => {
      // Último acesso (última atividade de progresso)
      const { data: lastProgress } = await supabase
        .from('progress')
        .select('completed_at')
        .eq('user_id', s.id)
        .order('completed_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      // Total de aulas concluídas
      const { count: lessonsCount } = await supabase
        .from('progress')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', s.id)

      // Certificados
      const { count: certsCount } = await supabase
        .from('certificates')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', s.id)

      // Quiz results
      const { data: quizzes } = await supabase
        .from('quiz_results')
        .select('score, total')
        .eq('user_id', s.id)

      const avgQuiz = quizzes && quizzes.length > 0
        ? Math.round(quizzes.reduce((acc, q) => acc + (q.score / q.total) * 100, 0) / quizzes.length)
        : null

      return {
        id: s.id,
        name: s.name,
        email: s.email,
        avatar: s.avatar || '',
        createdAt: s.created_at,
        lastAccess: lastProgress?.completed_at || null,
        lessonsCompleted: lessonsCount || 0,
        certificates: certsCount || 0,
        avgQuizScore: avgQuiz,
        status: 'active',
      }
    }))

    res.json(enriched)
  } catch (err) {
    console.error('listStudents:', err)
    res.status(500).json({ error: 'Erro ao listar alunos.' })
  }
}

// GET /api/teacher/stats — estatísticas do dashboard
async function getStats(req, res) {
  try {
    const { count: totalStudents } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'student')

    const { count: totalTeachers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'teacher')

    const { count: totalCourses } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true })

    const { count: totalLessons } = await supabase
      .from('lessons')
      .select('*', { count: 'exact', head: true })

    const { count: totalCerts } = await supabase
      .from('certificates')
      .select('*', { count: 'exact', head: true })

    const { count: totalProgress } = await supabase
      .from('progress')
      .select('*', { count: 'exact', head: true })

    // Média dos quizzes
    const { data: quizzes } = await supabase
      .from('quiz_results')
      .select('score, total')

    const avgQuiz = quizzes && quizzes.length > 0
      ? Math.round(quizzes.reduce((acc, q) => acc + (q.score / q.total) * 100, 0) / quizzes.length)
      : 0

    // Alunos ativos (com progresso nos últimos 30 dias)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const { data: activeStudentIds } = await supabase
      .from('progress')
      .select('user_id')
      .gte('completed_at', thirtyDaysAgo)

    const activeCount = new Set((activeStudentIds || []).map(p => p.user_id)).size

    res.json({
      totalStudents: totalStudents || 0,
      activeStudents: activeCount,
      totalTeachers: totalTeachers || 0,
      totalCourses: totalCourses || 0,
      totalLessons: totalLessons || 0,
      totalCertificates: totalCerts || 0,
      totalProgress: totalProgress || 0,
      avgQuizScore: avgQuiz,
      totalQuizzes: quizzes?.length || 0,
    })
  } catch (err) {
    console.error('getStats:', err)
    res.status(500).json({ error: 'Erro ao buscar estatísticas.' })
  }
}

// GET /api/teacher/students/:id — detalhe de um aluno
async function getStudent(req, res) {
  try {
    const { id } = req.params

    const { data: student, error } = await supabase
      .from('users')
      .select('id, name, email, avatar, created_at')
      .eq('id', id)
      .eq('role', 'student')
      .single()

    if (error || !student) return res.status(404).json({ error: 'Aluno não encontrado.' })

    const { data: progress } = await supabase
      .from('progress')
      .select('course_id, lesson_id, completed_at')
      .eq('user_id', id)

    const { data: certs } = await supabase
      .from('certificates')
      .select('*, course:courses(title)')
      .eq('user_id', id)

    const { data: quizzes } = await supabase
      .from('quiz_results')
      .select('*, course:courses(title)')
      .eq('user_id', id)

    res.json({ student, progress: progress || [], certificates: certs || [], quizzes: quizzes || [] })
  } catch (err) {
    console.error('getStudent:', err)
    res.status(500).json({ error: 'Erro ao buscar aluno.' })
  }
}

module.exports = { listStudents, getStats, getStudent }
