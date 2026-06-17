// ============================================================
// EduLivre — Seed Script
// Cria contas demo no Supabase
// Uso: node backend/scripts/seed.js
// ============================================================
require('dotenv').config({ path: require('path').join(__dirname, '../.env') })
const bcrypt    = require('bcryptjs')
const { supabase } = require('../models/database')

const DEMO_COURSES = [
  {
    title: 'React do Zero ao Avançado',
    description: 'Aprenda React, hooks, context, roteamento e muito mais com projetos práticos.',
    category: 'Programação', thumbnail: '⚛️', color: '#8b5cf6',
    teacher_name: 'Prof. Carlos Mendes', workload: '40h', level: 'Intermediário',
    lessons: [
      { title: 'Introdução ao React',    duration: '18min', video_url: 'https://www.youtube.com/embed/SqcY0GlETPk', description: 'Conceitos fundamentais do React.', position: 1 },
      { title: 'Componentes e Props',    duration: '24min', video_url: 'https://www.youtube.com/embed/35lXWvCuM8o', description: 'Criando componentes reutilizáveis.', position: 2 },
      { title: 'State e Hooks',          duration: '31min', video_url: 'https://www.youtube.com/embed/O6P86uwfdR0', description: 'useState, useEffect e hooks personalizados.', position: 3 },
    ],
  },
  {
    title: 'JavaScript Moderno ES2024',
    description: 'Domine JavaScript moderno com async/await, módulos, classes e as novidades do ES2024.',
    category: 'Programação', thumbnail: '⚡', color: '#10b981',
    teacher_name: 'Prof. Demo', workload: '30h', level: 'Iniciante',
    lessons: [
      { title: 'Fundamentos do JavaScript', duration: '22min', video_url: 'https://www.youtube.com/embed/hdI2bqOjy3c', description: 'Variáveis, tipos e operadores.', position: 1 },
      { title: 'Funções e Closures',        duration: '28min', video_url: 'https://www.youtube.com/embed/aAXMLzS3T0w', description: 'Escopo, closures e arrow functions.', position: 2 },
    ],
  },
]

async function seed() {
  console.log('🌱 Iniciando seed...\n')
  const hash = await bcrypt.hash('123456', 10)

  // Upsert demo users
  const { data: users, error: uErr } = await supabase
    .from('users')
    .upsert([
      { id: '00000000-0000-0000-0000-000000000001', name: 'Aluno Demo',     email: 'aluno@edulivre.com', password_hash: hash, role: 'student' },
      { id: '00000000-0000-0000-0000-000000000002', name: 'Professor Demo', email: 'prof@edulivre.com',  password_hash: hash, role: 'teacher' },
    ], { onConflict: 'id' })
    .select()
  if (uErr) { console.error('❌ Erro ao criar usuários:', uErr.message); return }
  console.log('✅ Usuários demo criados')

  const teacherId = '00000000-0000-0000-0000-000000000002'

  for (const c of DEMO_COURSES) {
    const { lessons, ...courseData } = c
    const { data: course, error: cErr } = await supabase
      .from('courses')
      .insert({ ...courseData, teacher_id: teacherId })
      .select()
      .single()
    if (cErr) { console.error(`❌ Erro ao criar curso "${c.title}":`, cErr.message); continue }

    if (lessons?.length) {
      const { error: lErr } = await supabase
        .from('lessons')
        .insert(lessons.map(l => ({ ...l, course_id: course.id })))
      if (lErr) console.error(`❌ Erro nas aulas de "${c.title}":`, lErr.message)
    }
    console.log(`✅ Curso "${c.title}" criado`)
  }

  console.log('\n🎉 Seed concluído!')
  console.log('   aluno@edulivre.com / 123456')
  console.log('   prof@edulivre.com  / 123456')
}

seed().catch(console.error)
