import { useState } from 'react'
import { NavLink, useNavigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useLang } from '@/contexts/LangContext'
import {
  GraduationCap, LayoutDashboard, PlusCircle, BookOpen,
  Upload, Users, BarChart3, User, LogOut, Menu, X, ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import TopBar from '@/components/shared/TopBar'
import LangThemeButtons from '@/components/shared/LangThemeButtons'

function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth()
  const { t } = useLang()
  const navigate = useNavigate()
  function handleLogout() { logout(); navigate('/login', { replace: true }) }
  function getInitials(name) { return name?.split(' ').slice(0,2).map(n => n[0]?.toUpperCase()).join('') || '?' }
  const avatar = typeof window !== 'undefined' ? localStorage.getItem(`edulivre_avatar_${user?.id}`) || '' : ''

  const NAV = [
    { to: '/professor',                 labelKey: 'teacher.nav.dashboard',  icon: LayoutDashboard, end: true },
    { to: '/professor/adicionar-curso', labelKey: 'teacher.nav.addCourse',  icon: PlusCircle },
    { to: '/professor/gerenciar',       labelKey: 'teacher.nav.manage',     icon: BookOpen },
    { to: '/professor/materiais',       labelKey: 'teacher.nav.materials',  icon: Upload },
    { to: '/professor/alunos',          labelKey: 'teacher.nav.students',   icon: Users },
    { to: '/professor/relatorios',      labelKey: 'teacher.nav.reports',    icon: BarChart3 },
    { to: '/professor/perfil',          labelKey: 'teacher.nav.profile',    icon: User },
  ]

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={onClose} />}
      <aside className={cn(
        'fixed top-0 left-0 h-full w-64 z-40 flex flex-col transition-transform duration-300',
        'lg:translate-x-0 lg:static lg:z-auto',
        open ? 'translate-x-0' : '-translate-x-full'
      )} style={{ background:'var(--bg-secondary)', borderRight:'1px solid var(--border)' }}>

        <div className="flex items-center gap-3 px-5 py-5 border-b" style={{ borderColor:'var(--border)' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background:'linear-gradient(135deg,#10b981,#059669)' }}>
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-base leading-none" style={{ color:'var(--text-primary)' }}>EduLivre</p>
            <p className="text-xs mt-0.5" style={{ color:'var(--text-muted)' }}>{t('teacher.area')}</p>
          </div>
          <button onClick={onClose} className="ml-auto lg:hidden" style={{ color:'var(--text-muted)' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mx-3 mt-4 p-3 rounded-xl" style={{ background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.2)' }}>
          <div className="flex items-center gap-3">
            {avatar
              ? <img src={avatar} alt="av" className="w-9 h-9 rounded-full object-cover shrink-0 border border-emerald-500/30" />
              : <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                  style={{ background:'linear-gradient(135deg,#10b981,#059669)', color:'#fff' }}>
                  {getInitials(user?.name)}
                </div>
            }
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color:'var(--text-primary)' }}>{user?.name}</p>
              <span className="badge-green text-[10px]">{t('auth.teacher')}</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 mt-4 space-y-0.5 overflow-y-auto pb-2">
          {NAV.map(({ to, labelKey, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) => cn('sidebar-link', isActive && 'active')}
              onClick={onClose}>
              <Icon className="w-4 h-4 shrink-0 icon" />
              <span className="flex-1">{t(labelKey)}</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-30" />
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t" style={{ borderColor:'var(--border)' }}>
          <button onClick={handleLogout}
            className="sidebar-link w-full text-red-400/70 hover:text-red-400 hover:bg-red-500/10">
            <LogOut className="w-4 h-4 shrink-0" /><span>{t('topbar.logout')}</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default function TeacherLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <div className="flex h-screen overflow-hidden" style={{ background:'var(--bg-primary)' }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 border-b shrink-0"
          style={{ background:'var(--bg-secondary)', borderColor:'var(--border)' }}>
          <button onClick={() => setSidebarOpen(true)} className="text-emerald-400 hover:text-white transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <GraduationCap className="w-5 h-5 text-emerald-400" />
            <span className="font-display font-bold" style={{ color:'var(--text-primary)' }}>EduLivre</span>
          </div>
          <LangThemeButtons size="sm" />
        </header>
        {/* Desktop TopBar */}
        <div className="hidden lg:block shrink-0"><TopBar profilePath="/professor/perfil" /></div>
        <main className="flex-1 overflow-y-auto"><Outlet /></main>
      </div>
    </div>
  )
}
