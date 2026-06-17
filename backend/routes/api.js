const router = require('express').Router()
const { requireAuth, requireRole } = require('../middleware/auth')
const auth    = require('../controllers/authController')
const courses = require('../controllers/coursesController')
const student = require('../controllers/studentController')
const teacher = require('../controllers/teacherController')

// ── Auth ────────────────────────────────────────────────────
router.post('/auth/register',        auth.register)
router.post('/auth/login',           auth.login)
router.get ('/auth/me',              requireAuth, auth.me)
router.put ('/auth/avatar',          requireAuth, auth.updateAvatar)
router.post('/auth/forgot-password', auth.forgotPassword)
router.post('/auth/reset-password',  auth.resetPassword)

// ── Perfil do usuário (aluno + professor) ────────────────────
router.put('/users/profile', requireAuth, auth.updateProfile)

// ── Courses ─────────────────────────────────────────────────
router.get   ('/courses',                            courses.listCourses)
router.get   ('/courses/:id',                        courses.getCourse)
router.post  ('/courses',                            requireAuth, requireRole('teacher'), courses.createCourse)
router.put   ('/courses/:id',                        requireAuth, requireRole('teacher'), courses.updateCourse)
router.delete('/courses/:id',                        requireAuth, requireRole('teacher'), courses.deleteCourse)
router.post  ('/courses/:id/lessons',                requireAuth, requireRole('teacher'), courses.addLesson)
router.delete('/courses/:id/lessons/:lessonId',      requireAuth, requireRole('teacher'), courses.deleteLesson)

// ── Progress ────────────────────────────────────────────────
router.get ('/progress',                                requireAuth, student.getAllProgress)
router.get ('/progress/:courseId',                      requireAuth, student.getProgress)
router.post('/progress/:courseId/lesson/:lessonId',     requireAuth, student.markLesson)

// ── Certificates ─────────────────────────────────────────────
router.get ('/certificates',             requireAuth, student.listCertificates)
router.post('/certificates/:courseId',   requireAuth, student.issueCertificate)

// ── Favorites ────────────────────────────────────────────────
router.get ('/favorites',            requireAuth, student.listFavorites)
router.post('/favorites/:courseId',  requireAuth, student.toggleFavorite)

// ── Quiz ─────────────────────────────────────────────────────
router.get ('/quiz/:courseId', requireAuth, student.getQuizResult)
router.post('/quiz/:courseId', requireAuth, student.saveQuizResult)

// ── Teacher panel ────────────────────────────────────────────
router.get('/teacher/students',     requireAuth, requireRole('teacher'), teacher.listStudents)
router.get('/teacher/students/:id', requireAuth, requireRole('teacher'), teacher.getStudent)
router.get('/teacher/stats',        requireAuth, requireRole('teacher'), teacher.getStats)

// ── Health ───────────────────────────────────────────────────
router.get('/health', (req, res) => res.json({ status: 'ok', env: process.env.NODE_ENV, timestamp: new Date().toISOString() }))

module.exports = router
