// ============================================================
// EduLivre — Student Controller (Supabase)
// ============================================================
const { supabase } = require('../models/database')

// ── PROGRESS ────────────────────────────────────────────────

// GET /api/progress/:courseId
async function getProgress(req, res) {
  try {
    const { courseId } = req.params

    const { data: done } = await supabase
      .from('progress')
      .select('lesson_id')
      .eq('user_id', req.user.id)
      .eq('course_id', courseId)

    const { count: total } = await supabase
      .from('lessons')
      .select('*', { count: 'exact', head: true })
      .eq('course_id', courseId)

    const completedCount = done?.length || 0
    const pct = total ? Math.round((completedCount / total) * 100) : 0

    res.json({
      completedLessons: (done || []).map(p => p.lesson_id),
      percentage: pct,
    })
  } catch (err) {
    console.error('getProgress:', err)
    res.status(500).json({ error: 'Erro ao buscar progresso.' })
  }
}

// POST /api/progress/:courseId/lesson/:lessonId
async function markLesson(req, res) {
  try {
    const { courseId, lessonId } = req.params
    await supabase
      .from('progress')
      .upsert(
        { user_id: req.user.id, course_id: courseId, lesson_id: lessonId },
        { onConflict: 'user_id,course_id,lesson_id', ignoreDuplicates: true }
      )
    res.json({ message: 'Progresso registrado.' })
  } catch (err) {
    console.error('markLesson:', err)
    res.status(500).json({ error: 'Erro ao registrar progresso.' })
  }
}

// GET /api/progress  (todos os cursos)
async function getAllProgress(req, res) {
  try {
    const { data: courses } = await supabase
      .from('courses')
      .select('id, title, lessons(id)')

    const { data: done } = await supabase
      .from('progress')
      .select('course_id, lesson_id')
      .eq('user_id', req.user.id)

    const doneMap = {}
    ;(done || []).forEach(p => {
      if (!doneMap[p.course_id]) doneMap[p.course_id] = []
      doneMap[p.course_id].push(p.lesson_id)
    })

    const result = (courses || []).map(c => {
      const completed = doneMap[c.id] || []
      const total     = c.lessons?.length || 0
      return {
        courseId:         c.id,
        courseTitle:      c.title,
        completedLessons: completed,
        total,
        percentage: total ? Math.round((completed.length / total) * 100) : 0,
      }
    })

    res.json(result)
  } catch (err) {
    console.error('getAllProgress:', err)
    res.status(500).json({ error: 'Erro ao buscar progresso.' })
  }
}

// ── CERTIFICATES ─────────────────────────────────────────────

// GET /api/certificates
async function listCertificates(req, res) {
  try {
    const { data: certs, error } = await supabase
      .from('certificates')
      .select('*, course:courses(*)')
      .eq('user_id', req.user.id)
      .order('issued_at', { ascending: false })

    if (error) throw error
    res.json(certs || [])
  } catch (err) {
    console.error('listCertificates:', err)
    res.status(500).json({ error: 'Erro ao listar certificados.' })
  }
}

// POST /api/certificates/:courseId
async function issueCertificate(req, res) {
  try {
    const { courseId } = req.params

    const { data: course } = await supabase
      .from('courses')
      .select('id, title, lessons(id)')
      .eq('id', courseId)
      .single()
    if (!course) return res.status(404).json({ error: 'Curso não encontrado.' })

    const totalLessons = course.lessons?.length || 0
    if (totalLessons === 0)
      return res.status(400).json({ error: 'Curso sem aulas registradas.' })

    const { count: doneLessons } = await supabase
      .from('progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', req.user.id)
      .eq('course_id', courseId)

    const pct = Math.round(((doneLessons || 0) / totalLessons) * 100)
    if (pct < 100)
      return res.status(400).json({ error: 'Conclua 100% do curso para emitir o certificado.' })

    // Verifica se já existe
    const { data: existing } = await supabase
      .from('certificates')
      .select('*, course:courses(*)')
      .eq('user_id', req.user.id)
      .eq('course_id', courseId)
      .maybeSingle()
    if (existing) return res.json(existing)

    const certId = `EL-${req.user.id.slice(0, 4).toUpperCase()}-${courseId.slice(-4).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
    const { data: cert, error } = await supabase
      .from('certificates')
      .insert({ id: certId, user_id: req.user.id, course_id: courseId })
      .select('*, course:courses(*)')
      .single()

    if (error) throw error
    res.status(201).json(cert)
  } catch (err) {
    console.error('issueCertificate:', err)
    res.status(500).json({ error: 'Erro ao emitir certificado.' })
  }
}

// ── FAVORITES ────────────────────────────────────────────────

// GET /api/favorites
async function listFavorites(req, res) {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('course_id')
      .eq('user_id', req.user.id)
    if (error) throw error
    res.json((data || []).map(f => f.course_id))
  } catch (err) {
    console.error('listFavorites:', err)
    res.status(500).json({ error: 'Erro ao listar favoritos.' })
  }
}

// POST /api/favorites/:courseId  (toggle)
async function toggleFavorite(req, res) {
  try {
    const { courseId } = req.params
    const { data: existing } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', req.user.id)
      .eq('course_id', courseId)
      .maybeSingle()

    if (existing) {
      await supabase.from('favorites').delete().eq('id', existing.id)
      return res.json({ favorited: false })
    }

    await supabase.from('favorites').insert({ user_id: req.user.id, course_id: courseId })
    res.json({ favorited: true })
  } catch (err) {
    console.error('toggleFavorite:', err)
    res.status(500).json({ error: 'Erro ao favoritar curso.' })
  }
}

// ── QUIZ RESULTS ─────────────────────────────────────────────

// GET /api/quiz/:courseId
async function getQuizResult(req, res) {
  try {
    const { data: result } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('course_id', req.params.courseId)
      .maybeSingle()

    if (!result) return res.status(404).json({ error: 'Nenhum resultado encontrado.' })
    res.json(result)
  } catch (err) {
    console.error('getQuizResult:', err)
    res.status(500).json({ error: 'Erro ao buscar resultado.' })
  }
}

// POST /api/quiz/:courseId
async function saveQuizResult(req, res) {
  try {
    const { score, total } = req.body
    const { courseId }     = req.params

    const { data: result, error } = await supabase
      .from('quiz_results')
      .upsert(
        { user_id: req.user.id, course_id: courseId, score, total, answered_at: new Date().toISOString() },
        { onConflict: 'user_id,course_id' }
      )
      .select()
      .single()

    if (error) throw error
    res.status(201).json(result)
  } catch (err) {
    console.error('saveQuizResult:', err)
    res.status(500).json({ error: 'Erro ao salvar resultado.' })
  }
}

module.exports = {
  getProgress, markLesson, getAllProgress,
  listCertificates, issueCertificate,
  listFavorites, toggleFavorite,
  getQuizResult, saveQuizResult,
}
