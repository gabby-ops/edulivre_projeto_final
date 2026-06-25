/**
 * EduLivre — API Service
 * Para ativar o backend: defina VITE_API_URL=http://localhost:3001/api no .env
 */

const _u = import.meta.env.VITE_API_URL
const BASE_URL = (_u && _u.trim()) ? _u.trim() : null

console.log("VITE_API_URL =", import.meta.env.VITE_API_URL)
console.log("BASE_URL =", BASE_URL)

let _token = localStorage.getItem('edulivre_api_token') || null

export function setToken(token) {
  _token = token
  if (token) localStorage.setItem('edulivre_api_token', token)
  else        localStorage.removeItem('edulivre_api_token')
}

export function getToken() { return _token }

async function request(method, path, body = null) {
  if (!BASE_URL) throw new Error('Backend não configurado.')

  const headers = { 'Content-Type': 'application/json' }
  if (_token) headers['Authorization'] = `Bearer ${_token}`

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Erro na requisição.')
  return data
}

export const api = {
  auth: {
    login:         (email, password)                     => request('POST', '/auth/login',    { email, password }),
    register:      (name, email, password, confirm, role)=> request('POST', '/auth/register', { name, email, password, confirm, role }),
    me:            ()                                    => request('GET',  '/auth/me'),
    updateAvatar:  (avatar)                              => request('PUT',  '/auth/avatar',   { avatar }),
  },

  // Perfil (aluno e professor)
  users: {
    updateProfile: (data) => request('PUT', '/users/profile', data),
  },

  courses: {
    list:          ()                   => request('GET',    '/courses'),
    get:           (id)                 => request('GET',    `/courses/${id}`),
    create:        (data)               => request('POST',   '/courses',       data),
    update:        (id, data)           => request('PUT',    `/courses/${id}`, data),
    delete:        (id)                 => request('DELETE', `/courses/${id}`),
    addLesson:     (courseId, data)     => request('POST',   `/courses/${courseId}/lessons`,            data),
    deleteLesson:  (courseId, lessonId) => request('DELETE', `/courses/${courseId}/lessons/${lessonId}`),
  },

  progress: {
    getAll:        ()                    => request('GET',  '/progress'),
    get:           (courseId)            => request('GET',  `/progress/${courseId}`),
    mark:          (courseId, lessonId)  => request('POST', `/progress/${courseId}/lesson/${lessonId}`),
  },

  certificates: {
    list:          ()          => request('GET',  '/certificates'),
    issue:         (courseId)  => request('POST', `/certificates/${courseId}`),
  },

  favorites: {
    list:          ()          => request('GET',  '/favorites'),
    toggle:        (courseId)  => request('POST', `/favorites/${courseId}`),
  },

  quiz: {
    get:           (courseId)              => request('GET',  `/quiz/${courseId}`),
    save:          (courseId, score, total)=> request('POST', `/quiz/${courseId}`, { score, total }),
  },

  teacher: {
    listStudents:  ()    => request('GET', '/teacher/students'),
    getStudent:    (id)  => request('GET', `/teacher/students/${id}`),
    getStats:      ()    => request('GET', '/teacher/stats'),
  },
}

export default api
