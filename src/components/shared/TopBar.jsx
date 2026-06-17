import { useState, useRef, useEffect } from 'react'
import { useAuth }   from '@/contexts/AuthContext'
import { useNotifs } from '@/contexts/NotifContext'
import { useLang }   from '@/contexts/LangContext'
import { useNavigate } from 'react-router-dom'
import { Bell, LogOut, User, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import LangThemeButtons from '@/components/shared/LangThemeButtons'

function timeAgo(iso, lang) {
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000)
  if (lang === 'en') {
    if (diff < 60)    return 'just now'
    if (diff < 3600)  return Math.floor(diff/60) + 'min ago'
    if (diff < 86400) return Math.floor(diff/3600) + 'h ago'
    return Math.floor(diff/86400) + 'd ago'
  }
  if (diff < 60)    return 'agora'
  if (diff < 3600)  return Math.floor(diff/60) + 'min atrás'
  if (diff < 86400) return Math.floor(diff/3600) + 'h atrás'
  return Math.floor(diff/86400) + 'd atrás'
}

function getInitials(name) {
  return name?.split(' ').slice(0,2).map(n => n[0]?.toUpperCase()).join('') || '?'
}

/* ── Notification Dropdown ── */
function NotifDropdown({ open, onClose }) {
  const { notifs, unread, markAllRead, markRead } = useNotifs()
  const { t, lang } = useLang()
  const ref = useRef(null)

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) onClose() }
    if (open) document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open, onClose])

  if (!open) return null

  return (
    <div ref={ref}
      className="absolute right-0 top-full mt-2 w-80 rounded-2xl z-50 overflow-hidden"
      style={{ background:'var(--bg-card)', border:'1px solid var(--border)', boxShadow:'0 20px 60px rgba(0,0,0,0.4)' }}>
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor:'var(--border)' }}>
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-semibold" style={{ color:'var(--text-primary)' }}>
            {t('topbar.notifications')}
          </span>
          {unread > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold text-white"
              style={{ background:'linear-gradient(135deg,#8b5cf6,#6d28d9)' }}>{unread}</span>
          )}
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors">
            {t('topbar.markAll')}
          </button>
        )}
      </div>
      <div className="max-h-80 overflow-y-auto">
        {notifs.length === 0 ? (
          <div className="py-8 text-center">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" style={{ color:'var(--text-muted)' }} />
            <p className="text-sm" style={{ color:'var(--text-muted)' }}>{t('topbar.noNotifs')}</p>
          </div>
        ) : notifs.map(n => (
          <div key={n.id} onClick={() => markRead(n.id)}
            className={cn('flex gap-3 px-4 py-3 border-b cursor-pointer transition-colors hover:bg-purple-500/5',
              !n.read && 'bg-purple-500/5'
            )} style={{ borderColor:'var(--border)' }}>
            <div className={cn('w-2 h-2 rounded-full mt-1.5 shrink-0', n.read ? 'bg-transparent' : 'bg-purple-500')} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color:'var(--text-primary)' }}>{n.title}</p>
              <p className="text-xs mt-0.5 line-clamp-2" style={{ color:'var(--text-muted)' }}>{n.body}</p>
              <p className="text-[10px] mt-1 text-purple-400/70">{timeAgo(n.time, lang)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Avatar Dropdown ── */
function AvatarDropdown({ open, onClose, profilePath }) {
  const { user, logout } = useAuth()
  const { t } = useLang()
  const navigate = useNavigate()
  const ref = useRef(null)
  const fileRef = useRef(null)
  const [avatar, setAvatar] = useState(() => localStorage.getItem(`edulivre_avatar_${user?.id}`) || '')

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) onClose() }
    if (open) document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open, onClose])

  function handleFile(e) {
    const file = e.target.files[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = ev => { const d = ev.target.result; localStorage.setItem(`edulivre_avatar_${user?.id}`, d); setAvatar(d) }
    reader.readAsDataURL(file)
  }

  function handleLogout() { logout(); navigate('/login', { replace: true }) }

  if (!open) return null

  return (
    <div ref={ref}
      className="absolute right-0 top-full mt-2 w-56 rounded-2xl z-50 overflow-hidden"
      style={{ background:'var(--bg-card)', border:'1px solid var(--border)', boxShadow:'0 20px 60px rgba(0,0,0,0.4)' }}>
      <div className="px-4 py-4 border-b text-center" style={{ borderColor:'var(--border)' }}>
        <div className="relative inline-block mb-2">
          {avatar
            ? <img src={avatar} alt="avatar" className="w-14 h-14 rounded-full object-cover mx-auto border-2 border-purple-500/40" />
            : <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold mx-auto"
                style={{ background:'linear-gradient(135deg,#8b5cf6,#6d28d9)', color:'#fff' }}>
                {getInitials(user?.name)}
              </div>
          }
          <button onClick={() => fileRef.current?.click()}
            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
            style={{ background:'linear-gradient(135deg,#10b981,#059669)' }}>✏️</button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>
        <p className="text-sm font-semibold" style={{ color:'var(--text-primary)' }}>{user?.name}</p>
        <p className="text-xs mt-0.5" style={{ color:'var(--text-muted)' }}>{user?.email}</p>
      </div>
      <div className="p-1.5">
        <button onClick={() => { navigate(profilePath); onClose() }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors hover:bg-purple-500/10"
          style={{ color:'var(--text-primary)' }}>
          <User className="w-4 h-4 text-purple-400" /> {t('topbar.myProfile')}
        </button>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors hover:bg-red-500/10 text-red-400">
          <LogOut className="w-4 h-4" /> {t('topbar.logout')}
        </button>
      </div>
    </div>
  )
}

/* ── Main TopBar ── */
export default function TopBar({ profilePath = '/aluno/perfil' }) {
  const { user } = useAuth()
  const { t } = useLang()
  const { unread } = useNotifs()
  const [notifOpen, setNotifOpen] = useState(false)
  const [avatarOpen, setAvatarOpen] = useState(false)
  const avatar = localStorage.getItem(`edulivre_avatar_${user?.id}`) || ''

  return (
    <header className="h-14 flex items-center justify-between px-4 shrink-0 border-b"
      style={{ background:'var(--bg-secondary)', borderColor:'var(--border)' }}>

      <div className="hidden lg:block">
        <p className="text-sm font-medium" style={{ color:'var(--text-muted)' }}>
          <span style={{ color:'var(--text-primary)' }}>{t('topbar.greeting')}, {user?.name?.split(' ')[0]}</span>
          {' '}{t('topbar.greetMsg')}
        </p>
      </div>
      <div className="lg:hidden" />

      <div className="flex items-center gap-2">
        {/* Lang + Theme */}
        <LangThemeButtons size="sm" />

        {/* Bell */}
        <div className="relative">
          <button onClick={() => { setNotifOpen(o => !o); setAvatarOpen(false) }}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all relative"
            style={{ background:'rgba(139,92,246,0.1)', border:'1px solid var(--border)' }}>
            <Bell className="w-4 h-4 text-purple-400" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                style={{ background:'linear-gradient(135deg,#8b5cf6,#6d28d9)' }}>{unread}</span>
            )}
          </button>
          <NotifDropdown open={notifOpen} onClose={() => setNotifOpen(false)} />
        </div>

        {/* Avatar */}
        <div className="relative">
          <button onClick={() => { setAvatarOpen(o => !o); setNotifOpen(false) }}
            className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl transition-all hover:bg-purple-500/10"
            style={{ border:'1px solid var(--border)' }}>
            {avatar
              ? <img src={avatar} alt="av" className="w-7 h-7 rounded-full object-cover" />
              : <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background:'linear-gradient(135deg,#8b5cf6,#6d28d9)', color:'#fff' }}>
                  {getInitials(user?.name)}
                </div>
            }
            <span className="hidden sm:block text-sm font-medium" style={{ color:'var(--text-primary)' }}>
              {user?.name?.split(' ')[0]}
            </span>
            <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', avatarOpen && 'rotate-180')}
              style={{ color:'var(--text-muted)' }} />
          </button>
          <AvatarDropdown open={avatarOpen} onClose={() => setAvatarOpen(false)} profilePath={profilePath} />
        </div>
      </div>
    </header>
  )
}
