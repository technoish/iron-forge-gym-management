import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import * as authService from '../services/authService'
import { onSessionExpired } from '../services/api'
import {
  saveSession,
  getAccessToken,
  getRefreshToken,
  getStoredUser,
  updateStoredUser,
  clearSession,
} from '../utils/tokenStorage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser())
  
  const [isBootstrapping, setIsBootstrapping] = useState(() => Boolean(getAccessToken()))
  const [sessionExpiredNotice, setSessionExpiredNotice] = useState(false)

  useEffect(() => {
    if (!getAccessToken()) {
      setIsBootstrapping(false)
      return
    }
    authService
      .getProfile()
      .then((profile) => {
        setUser(profile)
        updateStoredUser(profile)
      })
      .catch(() => {
       
        setUser(null)
      })
      .finally(() => setIsBootstrapping(false))
  }, [])

  useEffect(() => {
    return onSessionExpired(() => {
      setUser((current) => {
        if (current) setSessionExpiredNotice(true)
        return null
      })
    })
  }, [])

  const login = useCallback(async ({ username, password, remember = true }) => {
    const { user: loggedInUser, tokens } = await authService.login({ username, password })
    saveSession({ access: tokens.access, refresh: tokens.refresh, user: loggedInUser, remember })
    setSessionExpiredNotice(false)
    setUser(loggedInUser)
    return loggedInUser
  }, [])

  const register = useCallback(async (payload) => {
    const { user: newUser, tokens } = await authService.register(payload)
    saveSession({ access: tokens.access, refresh: tokens.refresh, user: newUser, remember: true })
    setSessionExpiredNotice(false)
    setUser(newUser)
    return newUser
  }, [])

  const logout = useCallback(async () => {
    const refreshToken = getRefreshToken()
    try {
      if (refreshToken) await authService.logout(refreshToken)
    } catch {
      // Even if the blacklist call fails (e.g. token already expired),
      // still clear the local session below.
    } finally {
      clearSession()
      setUser(null)
    }
  }, [])

  const updateProfile = useCallback(async (payload) => {
    const updated = await authService.updateProfile(payload)
    setUser(updated)
    updateStoredUser(updated)
    return updated
  }, [])

  const dismissSessionExpiredNotice = useCallback(() => setSessionExpiredNotice(false), [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'admin',
      isBootstrapping,
      sessionExpiredNotice,
      dismissSessionExpiredNotice,
      login,
      register,
      logout,
      updateProfile,
    }),
    [user, isBootstrapping, sessionExpiredNotice, dismissSessionExpiredNotice, login, register, logout, updateProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
