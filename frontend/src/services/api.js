import axios from 'axios'
import { getAccessToken, getRefreshToken, updateTokens, clearSession } from '../utils/tokenStorage'


export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})


const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
})

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})


let isRefreshing = false
let subscribers = []

function onRefreshed(newToken) {
  subscribers.forEach((cb) => cb(newToken))
  subscribers = []
}

function subscribeToRefresh(cb) {
  subscribers.push(cb)
}


let sessionExpiredListeners = []
export function onSessionExpired(cb) {
  sessionExpiredListeners.push(cb)
  return () => {
    sessionExpiredListeners = sessionExpiredListeners.filter((l) => l !== cb)
  }
}
function notifySessionExpired() {
  clearSession()
  sessionExpiredListeners.forEach((cb) => cb())
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const status = error.response?.status
    const isAuthEndpoint =
      originalRequest?.url?.includes('/auth/login') || originalRequest?.url?.includes('/auth/refresh')

    if (status !== 401 || isAuthEndpoint || originalRequest._retry) {
      return Promise.reject(error)
    }

    const refreshToken = getRefreshToken()
    if (!refreshToken) {
      notifySessionExpired()
      return Promise.reject(error)
    }

    originalRequest._retry = true

    if (isRefreshing) {
     
      return new Promise((resolve, reject) => {
        subscribeToRefresh((newToken) => {
          if (!newToken) {
            reject(error)
            return
          }
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          resolve(api(originalRequest))
        })
      })
    }

    isRefreshing = true
    try {
      const { data } = await refreshClient.post('/auth/refresh/', { refresh: refreshToken })
      const { access, refresh } = data.data
      updateTokens({ access, refresh })
      isRefreshing = false
      onRefreshed(access)
      originalRequest.headers.Authorization = `Bearer ${access}`
      return api(originalRequest)
    } catch (refreshError) {
      isRefreshing = false
      onRefreshed(null)
      notifySessionExpired()
      return Promise.reject(refreshError)
    }
  },
)

export default api
