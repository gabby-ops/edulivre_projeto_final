import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

const FavoritesContext = createContext(null)
const FAV_KEY  = 'edulivre_favorites_v1'
const ENRL_KEY = 'edulivre_enrolled_v1'

function readStore(key) { try { return JSON.parse(localStorage.getItem(key) || '{}') } catch { return {} } }
function writeStore(key, data) { localStorage.setItem(key, JSON.stringify(data)) }

export function FavoritesProvider({ children }) {
  const { user } = useAuth()
  const [favs,    setFavs]    = useState({})
  const [enrolled, setEnrolled] = useState({})

  useEffect(() => {
    setFavs(readStore(FAV_KEY))
    setEnrolled(readStore(ENRL_KEY))
  }, [])

  const uid = user?.id || ''

  // ── Favorites ──────────────────────────────────────────────
  const favorites      = favs[uid] || []
  function isFav(courseId) { return favorites.includes(courseId) }
  function toggleFav(courseId) {
    setFavs(prev => {
      const list = prev[uid] || []
      const next = list.includes(courseId) ? list.filter(id => id !== courseId) : [...list, courseId]
      const updated = { ...prev, [uid]: next }
      writeStore(FAV_KEY, updated)
      return updated
    })
  }
  // Legacy aliases used by StudentFavorites
  function getUserFavs(userId) { return favs[userId] || [] }
  function toggleFavFor(userId, courseId) {
    setFavs(prev => {
      const list = prev[userId] || []
      const next = list.includes(courseId) ? list.filter(id => id !== courseId) : [...list, courseId]
      const updated = { ...prev, [userId]: next }
      writeStore(FAV_KEY, updated)
      return updated
    })
  }
  function isFavFor(userId, courseId) { return (favs[userId] || []).includes(courseId) }

  // ── Enrollments ────────────────────────────────────────────
  const enrolledIds = enrolled[uid] || []
  function isEnrolled(courseId) { return enrolledIds.includes(courseId) }
  function enroll(courseId) {
    setEnrolled(prev => {
      const list = prev[uid] || []
      if (list.includes(courseId)) return prev
      const updated = { ...prev, [uid]: [...list, courseId] }
      writeStore(ENRL_KEY, updated)
      return updated
    })
  }
  function unenroll(courseId) {
    setEnrolled(prev => {
      const list = (prev[uid] || []).filter(id => id !== courseId)
      const updated = { ...prev, [uid]: list }
      writeStore(ENRL_KEY, updated)
      return updated
    })
  }

  return (
    <FavoritesContext.Provider value={{
      favorites, isFav, toggleFav,
      getUserFavs, toggleFavFor, isFavFor,
      enrolledIds, isEnrolled, enroll, unenroll,
    }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be inside FavoritesProvider')
  return ctx
}
