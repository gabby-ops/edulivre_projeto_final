import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster }           from 'react-hot-toast'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { CoursesProvider }       from '@/contexts/CoursesContext'
import { FavoritesProvider }     from '@/contexts/FavoritesContext'
import { ThemeProvider }         from '@/contexts/ThemeContext'
import { NotifProvider }         from '@/contexts/NotifContext'
import { LangProvider }          from '@/contexts/LangContext'
import { TeacherProvider }       from '@/contexts/TeacherContext'
import RequireAuth               from '@/components/auth/RequireAuth'

// Páginas públicas
import LandingPage        from '@/pages/LandingPage'
import LoginPage          from '@/pages/auth/LoginPage'
import RegisterPage       from '@/pages/auth/RegisterPage'
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage'

// Aluno
import StudentLayout       from '@/components/student/StudentLayout'
import StudentDashboard    from '@/pages/student/StudentDashboard'
import StudentCourses      from '@/pages/student/StudentCourses'
import StudentLessons      from '@/pages/student/StudentLessons'
import StudentCertificates from '@/pages/student/StudentCertificates'
import StudentProfile      from '@/pages/student/StudentProfile'
import StudentFavorites    from '@/pages/student/StudentFavorites'
import StudentProgress     from '@/pages/student/StudentProgress'
import StudentAgenda       from '@/pages/student/StudentAgenda'
import StudentForum        from '@/pages/student/StudentForum'
import StudentQuiz         from '@/pages/student/StudentQuiz'
import OnboardingPage      from '@/pages/student/OnboardingPage'

// Professor
import TeacherLayout        from '@/components/teacher/TeacherLayout'
import TeacherDashboard     from '@/pages/teacher/TeacherDashboard'
import TeacherAddCourse     from '@/pages/teacher/TeacherAddCourse'
import TeacherManageCourses from '@/pages/teacher/TeacherManageCourses'
import { TeacherMaterials, TeacherStudents, TeacherReports, TeacherProfile } from '@/pages/teacher/TeacherOtherPages'

// Guard: redireciona aluno novo para onboarding
function StudentGuard({ children }) {
  const { user } = useAuth()
  const location  = useLocation()
  if (!user) return children
  const done = localStorage.getItem(`edulivre_onboarding_${user.id}`)
  if (!done && location.pathname !== '/aluno/onboarding') {
    return <Navigate to="/aluno/onboarding" replace />
  }
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <LangProvider>
      <ThemeProvider>
        <AuthProvider>
          <CoursesProvider>
            <TeacherProvider>
            <FavoritesProvider>
              <NotifProvider>
                <Toaster position="top-right" toastOptions={{
                  style: {
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    fontSize: '14px',
                  }
                }} />

                <Routes>
                  {/* Público */}
                  <Route path="/"                 element={<LandingPage />} />
                  <Route path="/login"             element={<LoginPage />} />
                  <Route path="/cadastro"          element={<RegisterPage />} />
                  <Route path="/recuperar-senha"   element={<ForgotPasswordPage />} />

                  {/* Onboarding (aluno recém-cadastrado) */}
                  <Route path="/aluno/onboarding" element={
                    <RequireAuth role="student"><OnboardingPage /></RequireAuth>
                  } />

                  {/* Área do aluno */}
                  <Route path="/aluno" element={
                    <RequireAuth role="student">
                      <StudentGuard>
                        <StudentLayout />
                      </StudentGuard>
                    </RequireAuth>
                  }>
                    <Route index                  element={<StudentDashboard />} />
                    <Route path="cursos"          element={<StudentCourses />} />
                    <Route path="aulas"           element={<StudentLessons />} />
                    <Route path="progresso"       element={<StudentProgress />} />
                    <Route path="favoritos"       element={<StudentFavorites />} />
                    <Route path="agenda"          element={<StudentAgenda />} />
                    <Route path="forum"           element={<StudentForum />} />
                    <Route path="certificados"    element={<StudentCertificates />} />
                    <Route path="perfil"          element={<StudentProfile />} />
                    <Route path="quiz/:courseId"  element={<StudentQuiz />} />
                  </Route>

                  {/* Área do professor */}
                  <Route path="/professor" element={
                    <RequireAuth role="teacher"><TeacherLayout /></RequireAuth>
                  }>
                    <Route index                   element={<TeacherDashboard />} />
                    <Route path="adicionar-curso"  element={<TeacherAddCourse />} />
                    <Route path="gerenciar"        element={<TeacherManageCourses />} />
                    <Route path="materiais"        element={<TeacherMaterials />} />
                    <Route path="alunos"           element={<TeacherStudents />} />
                    <Route path="relatorios"       element={<TeacherReports />} />
                    <Route path="perfil"           element={<TeacherProfile />} />
                  </Route>

                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </NotifProvider>
            </FavoritesProvider>
            </TeacherProvider>
          </CoursesProvider>
        </AuthProvider>
      </ThemeProvider>
      </LangProvider>
    </BrowserRouter>
  )
}
