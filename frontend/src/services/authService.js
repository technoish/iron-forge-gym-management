import api from './api'


function unwrap(promise) {
  return promise.then(({ data }) => data.data)
}

function normalizeError(error) {
  const payload = error.response?.data
  const message = payload?.message || 'Something went wrong. Please try again.'
  const fieldErrors = payload?.errors || {}
  const normalized = new Error(message)
  normalized.fieldErrors = fieldErrors
  normalized.status = error.response?.status
  throw normalized
}

export function register(payload) {
  return unwrap(api.post('/auth/register/', payload)).catch(normalizeError)
}

export function login({ username, password }) {
  return unwrap(api.post('/auth/login/', { username, password })).catch(normalizeError)
}

export function logout(refreshToken) {
  return unwrap(api.post('/auth/logout/', { refresh: refreshToken })).catch(normalizeError)
}

export function getProfile() {
  return unwrap(api.get('/auth/profile/')).catch(normalizeError)
}

export function updateProfile(payload) {
  
  const hasFile = payload instanceof FormData
  return unwrap(
    api.put('/auth/profile/', payload, hasFile ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined),
  ).catch(normalizeError)
}

export function changePassword(payload) {
  return unwrap(api.post('/auth/change-password/', payload)).catch(normalizeError)
}

export function forgotPassword(email) {
  return unwrap(api.post('/auth/forgot-password/', { email })).catch(normalizeError)
}

export function resetPassword(payload) {
  return unwrap(api.post('/auth/reset-password/', payload)).catch(normalizeError)
}
