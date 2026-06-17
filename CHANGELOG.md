# CHANGELOG — EduLivre

## v11.0.0 — Junho 2026

### 🔴 CORREÇÕES CRÍTICAS

#### Painel do Professor — Alunos não apareciam
- **Problema**: `getStudents()` no `CoursesContext` lia apenas `localStorage`, ignorando alunos salvos no backend (Supabase).
- **Solução**: Criado `TeacherContext` com `fetchStudents()` que lê da API do backend quando disponível, com fallback para localStorage no modo offline.
- **Impacto**: Professor agora visualiza TODOS os alunos cadastrados, independente do modo (online/offline).

#### Dashboard com dados fictícios
- **Problema**: TeacherDashboard usava `getStudents()` do localStorage e valores estáticos ("94%").
- **Solução**: Dashboard atualizado para consumir `TeacherContext.stats` com dados reais do banco.
- **Impacto**: Todos os indicadores (total alunos, certificados, quizzes) refletem dados reais.

### ✅ NOVAS FUNCIONALIDADES

#### Backend — Rotas do Professor (novas)
- `GET /api/teacher/students` — lista todos os alunos com métricas (aulas, certs, quizzes)
- `GET /api/teacher/students/:id` — detalhe completo de um aluno
- `GET /api/teacher/stats` — estatísticas globais da plataforma
- Arquivo criado: `backend/controllers/teacherController.js`

#### Frontend — TeacherContext
- Novo contexto React: `src/contexts/TeacherContext.jsx`
- Suporta modo backend (API real) e modo offline (localStorage)
- Funções: `fetchStudents()`, `fetchStats()`, `refreshAll()`
- Indicador visual de modo (● Backend / ● Offline)

#### Painel de Alunos — Melhorias
- Busca por nome e e-mail em tempo real
- Ordenação por: data de cadastro, nome, aulas concluídas, certificados
- Paginação (12 alunos por página)
- Exportação CSV com BOM UTF-8 (suporte Excel)
- Cards com métricas: aulas concluídas, certificados, média de quiz
- Botão de atualização manual
- Avatar do aluno (se disponível)
- Aviso claro de modo offline vs backend

#### Relatórios — Melhorias
- Stats reais via `TeacherContext.stats`
- Gráfico de barras por categoria de cursos
- Ranking de cursos por número de aulas
- Botão de atualização

#### TeacherDashboard — Melhorias
- Integração com `TeacherContext` para dados reais
- Botão de atualização (RefreshCw)
- Stats com contadores reais (alunos, certificados, quizzes)
- Média dos quizzes exibida no lugar de "94% engajamento" estático

### 🔧 MELHORIAS TÉCNICAS

- `App.jsx`: Adicionado `<TeacherProvider>` ao árbol de providers
- `src/services/api.js`: Adicionado namespace `api.teacher` com 3 endpoints
- `backend/routes/api.js`: 3 novas rotas protegidas por `requireRole('teacher')`
- Build sem erros (`npm run build` ✅)

### 📝 NOTAS DE COMPATIBILIDADE

- Modo offline: totalmente funcional sem backend
- Modo backend: requer `VITE_API_URL` definido no `.env`
- Fallback automático: se backend falhar, exibe dados locais com aviso
