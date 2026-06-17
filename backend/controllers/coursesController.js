// ============================================================
// EduLivre — Courses Controller (Supabase)
// ============================================================
const { supabase } = require('../models/database')

// Helper: busca curso com lessons ordenadas
async function fetchCourseWithLessons(courseId) {
  const { data: course, error } = await supabase
    .from('courses')
    .select('*, lessons(*)')
    .eq('id', courseId)
    .single()
  if (error || !course) return null
  // Ordena lessons por position
  course.lessons = (course.lessons || []).sort((a, b) => a.position - b.position)
  return course
}

// GET /api/courses
async function listCourses(req, res) {
  try {
    const { data: courses, error } = await supabase
      .from('courses')
      .select('*, lessons(*)')
      .order('created_at', { ascending: false })
    if (error) throw error

    // Ordena lessons de cada curso
    const result = (courses || []).map(c => ({
      ...c,
      lessons: (c.lessons || []).sort((a, b) => a.position - b.position),
    }))
    res.json(result)
  } catch (err) {
    console.error('listCourses:', err)
    res.status(500).json({ error: 'Erro ao listar cursos.' })
  }
}

// GET /api/courses/:id
async function getCourse(req, res) {
  try {
    const course = await fetchCourseWithLessons(req.params.id)
    if (!course) return res.status(404).json({ error: 'Curso não encontrado.' })
    res.json(course)
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar curso.' })
  }
}

// POST /api/courses  (teacher only)
async function createCourse(req, res) {
  try {
    const { title, description, category, thumbnail, color, workload, level } = req.body
    if (!title || !description)
      return res.status(400).json({ error: 'Título e descrição são obrigatórios.' })

    // Busca nome do professor
    const { data: teacher } = await supabase
      .from('users')
      .select('name')
      .eq('id', req.user.id)
      .maybeSingle()

    const { data: course, error } = await supabase
      .from('courses')
      .insert({
        title,
        description,
        category:     category    || 'Geral',
        thumbnail:    thumbnail   || '📚',
        color:        color       || '#8b5cf6',
        teacher_id:   req.user.id,
        teacher_name: teacher?.name || req.user.name,
        workload:     workload    || '20h',
        level:        level       || 'Iniciante',
      })
      .select()
      .single()

    if (error) throw error
    res.status(201).json({ ...course, lessons: [] })
  } catch (err) {
    console.error('createCourse:', err)
    res.status(500).json({ error: 'Erro ao criar curso.' })
  }
}

// PUT /api/courses/:id
async function updateCourse(req, res) {
  try {
    const { data: existing } = await supabase
      .from('courses')
      .select('teacher_id')
      .eq('id', req.params.id)
      .maybeSingle()

    if (!existing) return res.status(404).json({ error: 'Curso não encontrado.' })
    if (existing.teacher_id !== req.user.id)
      return res.status(403).json({ error: 'Acesso negado.' })

    // Remove campos que não devem ser alterados diretamente
    const { id, teacher_id, lessons, created_at, ...fields } = req.body

    const { data: course, error } = await supabase
      .from('courses')
      .update(fields)
      .eq('id', req.params.id)
      .select()
      .single()

    if (error) throw error
    const full = await fetchCourseWithLessons(course.id)
    res.json(full)
  } catch (err) {
    console.error('updateCourse:', err)
    res.status(500).json({ error: 'Erro ao atualizar curso.' })
  }
}

// DELETE /api/courses/:id
async function deleteCourse(req, res) {
  try {
    const { data: existing } = await supabase
      .from('courses')
      .select('teacher_id')
      .eq('id', req.params.id)
      .maybeSingle()

    if (!existing) return res.status(404).json({ error: 'Curso não encontrado.' })
    if (existing.teacher_id !== req.user.id)
      return res.status(403).json({ error: 'Acesso negado.' })

    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', req.params.id)

    if (error) throw error
    res.json({ message: 'Curso removido.' })
  } catch (err) {
    console.error('deleteCourse:', err)
    res.status(500).json({ error: 'Erro ao remover curso.' })
  }
}

// POST /api/courses/:id/lessons
async function addLesson(req, res) {
  try {
    const { data: course } = await supabase
      .from('courses')
      .select('teacher_id')
      .eq('id', req.params.id)
      .maybeSingle()

    if (!course) return res.status(404).json({ error: 'Curso não encontrado.' })
    if (course.teacher_id !== req.user.id)
      return res.status(403).json({ error: 'Acesso negado.' })

    const { title, duration, videoUrl, video_url, pdfUrl, pdf_url, description } = req.body
    if (!title) return res.status(400).json({ error: 'Título da aula é obrigatório.' })

    // Determina a próxima posição
    const { count } = await supabase
      .from('lessons')
      .select('*', { count: 'exact', head: true })
      .eq('course_id', req.params.id)

    const { data: lesson, error } = await supabase
      .from('lessons')
      .insert({
        course_id:   req.params.id,
        title,
        duration:    duration    || '',
        video_url:   videoUrl    || video_url   || '',
        pdf_url:     pdfUrl      || pdf_url     || '',
        description: description || '',
        position:    (count || 0) + 1,
      })
      .select()
      .single()

    if (error) throw error
    res.status(201).json(lesson)
  } catch (err) {
    console.error('addLesson:', err)
    res.status(500).json({ error: 'Erro ao adicionar aula.' })
  }
}

// DELETE /api/courses/:id/lessons/:lessonId
async function deleteLesson(req, res) {
  try {
    const { data: course } = await supabase
      .from('courses')
      .select('teacher_id')
      .eq('id', req.params.id)
      .maybeSingle()

    if (!course) return res.status(404).json({ error: 'Curso não encontrado.' })
    if (course.teacher_id !== req.user.id)
      return res.status(403).json({ error: 'Acesso negado.' })

    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', req.params.lessonId)
      .eq('course_id', req.params.id)

    if (error) throw error
    res.json({ message: 'Aula removida.' })
  } catch (err) {
    console.error('deleteLesson:', err)
    res.status(500).json({ error: 'Erro ao remover aula.' })
  }
}

module.exports = { listCourses, getCourse, createCourse, updateCourse, deleteCourse, addLesson, deleteLesson }
