import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export default function RequireAuth({ children, role }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#07070f]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin" />
        <p className="text-sm text-purple-300/60">Carregando EduLivre...</p>
      </div>
    </div>
  )

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  if (role && user.role !== role) return <Navigate to={user.role === 'teacher' ? '/professor' : '/aluno'} replace />

  return children
}
