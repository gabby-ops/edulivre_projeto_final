import { createContext, useContext, useState } from 'react'

const NotifContext = createContext(null)

const INITIAL = [
  { id: '1', title: 'Bem-vindo ao EduLivre! 🎉', body: 'Comece explorando os cursos disponíveis.', time: new Date(Date.now() - 60000 * 5).toISOString(), read: false },
  { id: '2', title: 'Novo curso disponível', body: 'React do Zero ao Avançado foi adicionado.', time: new Date(Date.now() - 60000 * 60).toISOString(), read: false },
  { id: '3', title: 'Aula concluída!', body: 'Continue assim e conquiste seu certificado.', time: new Date(Date.now() - 60000 * 120).toISOString(), read: true },
]

export function NotifProvider({ children }) {
  const [notifs, setNotifs] = useState(INITIAL)

  const unread = notifs.filter(n => !n.read).length

  function markAllRead() {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })))
  }

  function markRead(id) {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  function addNotif(title, body) {
    const n = { id: crypto.randomUUID(), title, body, time: new Date().toISOString(), read: false }
    setNotifs(prev => [n, ...prev])
  }

  return (
    <NotifContext.Provider value={{ notifs, unread, markAllRead, markRead, addNotif }}>
      {children}
    </NotifContext.Provider>
  )
}

export function useNotifs() {
  const ctx = useContext(NotifContext)
  if (!ctx) throw new Error('useNotifs must be inside NotifProvider')
  return ctx
}
