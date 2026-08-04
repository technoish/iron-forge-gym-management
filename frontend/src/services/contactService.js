import api from './api'


export async function sendContactMessage(payload) {
  try {
    const { data } = await api.post('/contact/', payload)
    return data.data
  } catch (error) {
    const responsePayload = error.response?.data
    const message = responsePayload?.message || 'Something went wrong. Please try again.'
    const normalized = new Error(message)
    normalized.fieldErrors = responsePayload?.errors || {}
    throw normalized
  }
}
