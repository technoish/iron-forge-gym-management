

const KEYS = {
  ACCESS: 'ironforge-access-token',
  REFRESH: 'ironforge-refresh-token',
  USER: 'ironforge-user',
  REMEMBER: 'ironforge-remember',
}

function activeStore() {
  
  const remember = window.localStorage.getItem(KEYS.REMEMBER) === '1'
  return remember ? window.localStorage : window.sessionStorage
}

export function saveSession({ access, refresh, user, remember }) {
  window.localStorage.setItem(KEYS.REMEMBER, remember ? '1' : '0')
  const store = remember ? window.localStorage : window.sessionStorage
  const other = remember ? window.sessionStorage : window.localStorage

  store.setItem(KEYS.ACCESS, access)
  store.setItem(KEYS.REFRESH, refresh)
  store.setItem(KEYS.USER, JSON.stringify(user))

 
  other.removeItem(KEYS.ACCESS)
  other.removeItem(KEYS.REFRESH)
  other.removeItem(KEYS.USER)
}

export function updateTokens({ access, refresh }) {
  const store = activeStore()
  store.setItem(KEYS.ACCESS, access)
  if (refresh) store.setItem(KEYS.REFRESH, refresh)
}

export function updateStoredUser(user) {
  activeStore().setItem(KEYS.USER, JSON.stringify(user))
}

export function getAccessToken() {
  return activeStore().getItem(KEYS.ACCESS)
}

export function getRefreshToken() {
  return activeStore().getItem(KEYS.REFRESH)
}

export function getStoredUser() {
  const raw = activeStore().getItem(KEYS.USER)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function clearSession() {
  window.localStorage.removeItem(KEYS.ACCESS)
  window.localStorage.removeItem(KEYS.REFRESH)
  window.localStorage.removeItem(KEYS.USER)
  window.localStorage.removeItem(KEYS.REMEMBER)
  window.sessionStorage.removeItem(KEYS.ACCESS)
  window.sessionStorage.removeItem(KEYS.REFRESH)
  window.sessionStorage.removeItem(KEYS.USER)
}
