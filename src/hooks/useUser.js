import { useState, useCallback, useMemo } from 'react'
import { getUsersMeta, saveUsersMeta, getActiveUserId, switchUser, addUser, deleteUser, renameUser, setUserAvatar } from '@/lib/storage'

export default function useUser() {
  const [usersMeta, setUsersMeta] = useState(() => getUsersMeta())

  const users = useMemo(() => usersMeta?.users || [], [usersMeta])
  const activeUserId = useMemo(() => usersMeta?.activeUserId || null, [usersMeta])
  const activeUser = useMemo(() => users.find(u => u.id === activeUserId) || null, [users, activeUserId])

  const reload = useCallback(() => setUsersMeta(getUsersMeta()), [])

  const switchTo = useCallback((userId) => {
    switchUser(userId)
    reload()
    window.dispatchEvent(new CustomEvent('user-changed', { detail: { userId } }))
  }, [reload])

  const add = useCallback((name) => {
    const id = addUser(name)
    if (id) {
      reload()
      return id
    }
    return null
  }, [reload])

  const remove = useCallback((userId) => {
    const ok = deleteUser(userId)
    if (ok) reload()
    return ok
  }, [reload])

  const rename = useCallback((userId, newName) => {
    renameUser(userId, newName)
    reload()
  }, [reload])

  const setAvatar = useCallback((avatarData) => {
    setUserAvatar(activeUserId, avatarData)
    reload()
  }, [activeUserId, reload])

  return { users, activeUserId, activeUser, switchTo, add, remove, rename, reload, setAvatar }
}
