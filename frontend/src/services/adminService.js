import api from './api'

function toRequestBody(payload, { forceMultipart = false } = {}) {
  const hasFile = Object.values(payload).some((v) => v instanceof File)
  if (!hasFile && !forceMultipart) return payload

  const formData = new FormData()
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined) return
    if (value === null) {
      formData.append(key, '')
    } else if (Array.isArray(value)) {
      formData.append(key, JSON.stringify(value))
    } else if (typeof value === 'boolean') {
      formData.append(key, value ? 'true' : 'false')
    } else if (value instanceof File) {
      formData.append(key, value)
    } else {
      formData.append(key, String(value))
    }
  })
  return formData
}

function normalizeError(error) {
  const payload = error.response?.data
  const message = payload?.message || 'Something went wrong. Please try again.'
  const normalized = new Error(message)
  normalized.fieldErrors = payload?.errors || {}
  normalized.status = error.response?.status
  throw normalized
}


export function createResourceApi(endpoint, { forceMultipart = false } = {}) {
  return {
  
    async list(params = {}) {
      try {
        const { data } = await api.get(endpoint, { params })
        return { items: data.data || [], meta: data.meta || null }
      } catch (error) {
        normalizeError(error)
      }
    },

    async create(payload) {
      try {
        const body = toRequestBody(payload, { forceMultipart })
        const config = body instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined
        const { data } = await api.post(endpoint, body, config)
        return data.data
      } catch (error) {
        normalizeError(error)
      }
    },

    async update(id, payload) {
      try {
        const body = toRequestBody(payload, { forceMultipart })
        const config = body instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined
        
        const { data } = await api.patch(`${endpoint}${id}/`, body, config)
        return data.data
      } catch (error) {
        normalizeError(error)
      }
    },

    async remove(id) {
      try {
        await api.delete(`${endpoint}${id}/`)
      } catch (error) {
        normalizeError(error)
      }
    },
  }
}
