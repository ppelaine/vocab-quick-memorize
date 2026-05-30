import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react'
import { migrateToMultiUser } from '@/lib/storage'
import useUser from '@/hooks/useUser'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  migrateToMultiUser()
  const user = useUser()
  const [activeTab, setActiveTab] = useState('bank')
  const [refreshKey, setRefreshKey] = useState(0)
  const [toasts, setToasts] = useState([])

  // Listen for user-switch events to trigger refresh
  useEffect(() => {
    const handler = () => setRefreshKey(k => k + 1)
    window.addEventListener('user-changed', handler)
    return () => window.removeEventListener('user-changed', handler)
  }, [])

  const toast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 2500)
  }, [])

  const refresh = useCallback(() => setRefreshKey(k => k + 1), [])

  const value = useMemo(() => ({
    activeTab,
    setActiveTab,
    toast,
    refresh,
    refreshKey,
    toasts,
    user,
  }), [activeTab, toast, refresh, refreshKey, toasts, user])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
