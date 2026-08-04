import api from './api'


export async function calculateBMI({ height, weight }) {
  try {
    const { data } = await api.post('/bmi/', { height, weight })
    return data.data
  } catch (error) {
    const payload = error.response?.data
    const message = payload?.message || 'Could not calculate your BMI. Please check your inputs and try again.'
    const normalized = new Error(message)
    normalized.fieldErrors = payload?.errors || {}
    throw normalized
  }
}
